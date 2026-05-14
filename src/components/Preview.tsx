import { useMemo, useEffect, useRef, useState } from 'react'
import { marked, Renderer } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import createFootnotes from 'marked-footnote'

import { getBlobUrl } from '../utils/imageStorage'
import { PDFConfig } from '../types/pdf'
import { calculatePagination, formatHeights, formatWidths, waitForFonts, waitForImages } from '../utils/pdfUtils'


interface PreviewProps {
  content: string
  pdfConfig: PDFConfig
  showPDFTimestamp: boolean
  showPageNumbers: boolean
  headerBanner?: string
  footerBanner?: string
  assetMappings: Map<string, string>
}

// ==highlight== extension
const highlightExtension = {
  name: 'highlight',
  level: 'inline' as const,
  start(src: string) { return src.indexOf('==') },
  tokenizer(src: string) {
    const match = src.match(/^==([^=]+)==/)
    if (match) {
      return { type: 'highlight', raw: match[0], text: match[1] }
    }
  },
  renderer(token: any) {
    return `<mark>${token.text}</mark>`
  }
}

// H~2~O subscript extension
const subscriptExtension = {
  name: 'subscript',
  level: 'inline' as const,
  start(src: string) { return src.indexOf('~') },
  tokenizer(src: string) {
    const match = src.match(/^~(?!~)([^~\s]+)~(?!~)/)
    if (match) {
      return { type: 'subscript', raw: match[0], text: match[1] }
    }
  },
  renderer(token: any) {
    return `<sub>${token.text}</sub>`
  }
}

// X^2^ superscript extension
const superscriptExtension = {
  name: 'superscript',
  level: 'inline' as const,
  start(src: string) { return src.indexOf('^') },
  tokenizer(src: string) {
    const match = src.match(/^\^([^\^\s]+)\^/)
    if (match) {
      return { type: 'superscript', raw: match[0], text: match[1] }
    }
  },
  renderer(token: any) {
    return `<sup>${token.text}</sup>`
  }
}

// ::space[40] spacing extension
const spacingExtension = {
  name: 'spacing',
  level: 'block' as const,
  start(src: string) { return src.indexOf('::space['); },
  tokenizer(src: string) {
    const match = src.match(/^::space\[(\d+)\][ \t]*(?:\n|$)/);
    if (match) {
      return {
        type: 'spacing',
        raw: match[0],
        height: parseInt(match[1], 10)
      };
    }
  },
  renderer(token: any) {
    return `<div style="height: ${token.height}px;" aria-hidden="true"></div>\n`;
  }
};

// ::center ... :: and ::right ... :: alignment extension
const alignmentExtension = {
  name: 'alignment',
  level: 'block' as const,
  start(src: string) { return src.indexOf('::'); },
  tokenizer(this: any, src: string) {
    const match = src.match(/^::(center|right)(?:\s+|\n)([\s\S]*?)(?:\s+|\n)::[ \t]*(?:\n|$)/);
    if (match) {
      const token = {
        type: 'alignment',
        raw: match[0],
        align: match[1],
        text: match[2],
        tokens: []
      };
      this.lexer.blockTokens(token.text, token.tokens);
      return token;
    }
  },
  renderer(this: any, token: any) {
    return `<div style="text-align: ${token.align};">\n${this.parser.parse(token.tokens)}</div>\n`;
  }
};

// Configure marked globally with extensions
marked.setOptions({
  gfm: true,
  breaks: true,
} as any)

marked.use(
  createFootnotes(),
  { extensions: [highlightExtension, subscriptExtension, superscriptExtension, spacingExtension, alignmentExtension] }
)

export default function Preview({ content, pdfConfig, showPDFTimestamp, showPageNumbers, headerBanner, footerBanner, assetMappings }: PreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hiddenMeasureRef = useRef<HTMLDivElement>(null)
  const [paginatedPages, setPaginatedPages] = useState<string[]>([])
  const [zoom, setZoom] = useState(1);
  const [hashToUrl, setHashToUrl] = useState<Record<string, string>>({});

  const [isPrintMode, setIsPrintMode] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('print')

    const listener = () => setIsPrintMode(media.matches)

    media.addEventListener('change', listener)
    setIsPrintMode(media.matches)

    return () => media.removeEventListener('change', listener)
  }, [])

  // Resolve hashes to Blob URLs
  useEffect(() => {
    const hashRegex = /!\[.*?\]\s*\(([a-f0-9]{64})\)/g
    const matches = [...content.matchAll(hashRegex)]

    const hashes = matches.map(m => m[1])

    Promise.all(
      hashes.map(async (h) => {
        if (hashToUrl[h]) return null
        const url = await getBlobUrl(h)
        return { hash: h, url }
      })
    ).then(results => {
      const updates: Record<string, string> = {}

      results.forEach(r => {
        if (r && r.url) updates[r.hash] = r.url
      })

      if (Object.keys(updates).length) {
        setHashToUrl(prev => ({ ...prev, ...updates }))
      }
    })
  }, [content, hashToUrl])

  // Parse markdown → sanitized HTML
  const fullHtml = useMemo(() => {
    // Configure marked with a custom renderer for images
    const renderer = new Renderer();
    // Support highlight.js in code blocks (Supports both old and new Marked signatures)
    renderer.code = (textOrToken: any, langOrOptions?: any) => {
      const text = typeof textOrToken === 'string' ? textOrToken : (textOrToken.text || '');
      const language = (typeof textOrToken === 'string' ? langOrOptions : textOrToken.lang) || 'plaintext';
      
      const highlighted = hljs.highlight(text, { language: hljs.getLanguage(language) ? language : 'plaintext' }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    };

    // Support images with asset mapping (Supports both old and new Marked signatures)
    renderer.image = (hrefOrToken: any, title?: string | null, text?: string) => {
      let href = typeof hrefOrToken === 'string' ? hrefOrToken : hrefOrToken.href;
      let t = typeof hrefOrToken === 'string' ? title : hrefOrToken.title;
      let txt = typeof hrefOrToken === 'string' ? text : hrefOrToken.text;

      if (!href) return '';

      // 1. Check if it's an asset:// link
      if (href.startsWith('asset://')) {
        const assetId = href.replace('asset://', '');
        const mappedUrl = assetMappings.get(assetId);
        return `<img src="${mappedUrl || href}" alt="${txt || ''}" ${t ? `title="${t}"` : ''} data-asset-id="${assetId}" />`;
      }

      // 2. Fallback for legacy hash-based images
      const actualUrl = hashToUrl[href] || href;
      return `<img src="${actualUrl}" alt="${txt || ''}" ${t ? `title="${t}"` : ''} data-hash="${href}" />`;
    };

    const raw = marked.parse(content, { renderer, async: false }) as string;

    // Use a hook to explicitly allow data:image/, blob:, and asset:// URIs to avoid being stripped
    DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
      const tagName = node.tagName.toUpperCase();
      if (data.attrName === 'src' && (tagName === 'IMG' || tagName === 'IMAGE')) {
        const val = data.attrValue;
        if (val.startsWith('data:image/') || val.startsWith('blob:') || val.startsWith('asset://')) {
          ;(data as any).forceKeepAttr = true;
        }
      }
    });

    const output = DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'del', 'code', 'pre', 'blockquote',
        'ul', 'ol', 'li',
        'a', 'img',
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
        'details', 'summary',
        'span', 'div',
        'center', 'mark', 'kbd', 'sub', 'sup', 'u', 'ins', 'abbr', 'small', 'b', 'i', 's', 'q', 'cite',
        'figure', 'figcaption', 'picture', 'source', 'video', 'audio',
        'section', 'article', 'nav', 'header', 'footer', 'aside', 'main',
        'dl', 'dt', 'dd', 'ruby', 'rt', 'rp', 'wbr', 'time', 'data', 'var', 'samp', 'dfn',
        'input', 'label',
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'align', 'style', 'data-hash', 'data-asset-id',
        'width', 'height', 'controls', 'autoplay', 'loop', 'muted', 'poster', 'preload',
        'type', 'checked', 'disabled', 'readonly', 'value', 'name', 'for',
        'datetime', 'colspan', 'rowspan', 'scope', 'open', 'role', 'aria-label',
        'start', 'reversed',
        'data-footnote-ref', 'data-footnote-backref', 'data-footnotes',
      ],
      ADD_ATTR: ['target'],
      FORBID_TAGS: ['style', 'script'],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|blob|data|asset):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    }) as string;

    // Remove hook to prevent global side effects
    DOMPurify.removeHook('uponSanitizeAttribute');
    
    return output;
  }, [content, hashToUrl, assetMappings])

  // Auto-Pagination: await fonts (#3) and images (#12) before measuring
  useEffect(() => {
    if (isPrintMode) return

    const measureEl = hiddenMeasureRef.current
    if (!measureEl) return

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    const run = async () => {
      // Wait for fonts to load before measuring text (#3)
      await waitForFonts()
      if (cancelled) return

      // Inject HTML so images start loading
      measureEl.innerHTML = fullHtml

      // Wait for all images inside the measure container to load (#12)
      await waitForImages(measureEl)
      if (cancelled) return

      const pages = calculatePagination({
        fullHtml,
        pdfConfig,
        headerBanner,
        footerBanner,
        measureElement: measureEl
      })

      if (!cancelled) {
        setPaginatedPages(pages)
      }
    }

    // Debounce the update to avoid flickering and excessive calculations during typing
    timeoutId = setTimeout(run, 500)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [fullHtml, pdfConfig.format, pdfConfig.orientation, pdfConfig.margin, headerBanner, footerBanner, isPrintMode])


  // Dynamic Scaling / Center alignment
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || isPrintMode) return

    const updateScale = () => {
      const key = `${pdfConfig.format}-${pdfConfig.orientation}`
      const targetWidthMm = formatWidths[key] || 210
      const targetWidthPx = (targetWidthMm * 96) / 25.4

      // Calculate how much space we actually have
      // Padding/buffer: 32px (16px each side)
      const availableWidth = wrapper.clientWidth - 32

      const scaleToFit = availableWidth / targetWidthPx

      // We strictly match the page ratio but scale it down to fit the screen
      // If it's already smaller than the screen (Desktop), we keep it at 100% (1)
      setZoom(Math.min(scaleToFit, 1))
    }

    const observer = new ResizeObserver(updateScale)
    observer.observe(wrapper)
    updateScale()

    return () => observer.disconnect()
  }, [pdfConfig.format, pdfConfig.orientation, isPrintMode])

  // Update Page Indicator on scroll
  useEffect(() => {
    const wrapper = wrapperRef.current
    const container = containerRef.current
    if (!wrapper || !container) return

    const handleScroll = () => {
      const cards = container.querySelectorAll('.preview-content')
      if (cards.length === 0) return
      const wrapperRect = wrapper.getBoundingClientRect()
      const wrapperCenter = wrapperRect.top + wrapperRect.height / 3

      let currentPage = 1
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect()
        if (cardRect.top <= wrapperCenter) currentPage = index + 1
      })

      const indicator = wrapper.querySelector('.preview-page-indicator')
      if (indicator) indicator.textContent = `PAGE ${currentPage}`
    }

    wrapper.addEventListener('scroll', handleScroll)
    return () => wrapper.removeEventListener('scroll', handleScroll)
  }, [paginatedPages]) // depend on paginatedPages

  // Open links in external browser via Electron
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a') as HTMLAnchorElement | null
      if (anchor && anchor.href.startsWith('http')) {
        e.preventDefault()
        window.open(anchor.href, '_blank')
      }
    }
    container.addEventListener('click', handleClick)
    return () => container.removeEventListener('click', handleClick)
  }, [])

  const pagesToRender = (paginatedPages.length ? paginatedPages : [fullHtml]) as string[];

  return (
    <div className="flex-1 overflow-y-auto overflow-x-auto h-full bg-gray-100 dark:bg-[#0f1115] print:bg-white print:overflow-visible print:h-auto print:block flex flex-col justify-start items-center" ref={wrapperRef}>
      {/* Hidden container for measurement */}
      <div
        ref={hiddenMeasureRef}
        className="prose dark:prose-invert max-w-none break-words print:!max-w-none"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: pdfConfig.orientation === 'portrait' ? `${formatWidths[`${pdfConfig.format}-portrait`]}mm` : `${formatWidths[`${pdfConfig.format}-landscape`]}mm`,
          padding: `${pdfConfig.margin}in`,
          boxSizing: 'border-box'
        }}
      />

      <div
        className="preview-page-container flex flex-col items-center py-6 gap-6 min-h-full print:py-0 print:gap-0 print:block print:w-full print:m-0 w-full max-w-full"
        ref={containerRef}
        style={{
          '--page-margin': `${pdfConfig.margin}in`,
          transform: isPrintMode ? 'none' : `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out'
        } as any}
      >

        {pagesToRender.map((pageHtml, index) => (
          <div
            key={index + '-' + showPageNumbers + '-' + showPDFTimestamp}
            className="preview-content bg-white dark:bg-[#16181d] shadow-md dark:shadow-xl shrink-0 prose dark:prose-invert !max-w-none break-words print:!shadow-none print:!bg-transparent print:!m-0"
            style={{
              width: pdfConfig.orientation === 'portrait'
                ? `${formatWidths[`${pdfConfig.format}-portrait`]}mm`
                : `${formatWidths[`${pdfConfig.format}-landscape`]}mm`,
              height: pdfConfig.orientation === 'portrait'
                ? `${formatHeights[`${pdfConfig.format}-portrait`]}mm`
                : `${formatHeights[`${pdfConfig.format}-landscape`]}mm`,
              padding: `${pdfConfig.margin}in`,
              position: 'relative',
              overflow: 'hidden',
              pageBreakAfter: index < pagesToRender.length - 1 ? 'always' : 'auto'
            }}
          >
            {showPDFTimestamp && (
              <div className="absolute top-2 left-4 text-[10px] text-gray-400 font-mono z-10">
                {new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            {headerBanner && (
              <div
                className="w-full mb-4 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: headerBanner }}
              />
            )}
            {pdfConfig.headerText && (
              <div
                className="absolute top-4 left-0 right-0 text-center text-[10px] text-gray-400 font-mono z-10"
                dangerouslySetInnerHTML={{ __html: pdfConfig.headerText }}
              />
            )}
            {/* Content Container */}
            <div className="relative pt-0 pb-20" dangerouslySetInnerHTML={{ __html: pageHtml }} />

            {footerBanner && (
              <div
                className="absolute left-0 right-0 overflow-hidden"
                style={{
                  bottom: `${pdfConfig.margin}in`,
                  paddingLeft: `${pdfConfig.margin}in`,
                  paddingRight: `${pdfConfig.margin}in`,
                }}
                dangerouslySetInnerHTML={{ __html: footerBanner }}
              />
            )}

            {pdfConfig.footerText && (
              <div
                className="absolute left-0 right-0 text-center text-[10px] text-gray-400 font-mono z-10"
                style={{ bottom: `calc(${pdfConfig.margin}in - 20px)` }}
                dangerouslySetInnerHTML={{ __html: pdfConfig.footerText }}
              />
            )}
            {showPageNumbers && (
              <div
                className="absolute right-0 text-[10px] text-gray-400 font-mono z-10"
                style={{
                  bottom: `calc(${pdfConfig.margin}in - 20px)`,
                  right: `${pdfConfig.margin}in`
                }}
              >
                {index + 1}/{pagesToRender.length}
              </div>
            )}
          </div>
        ))}
        {/* Placeholder for page indicator logic if needed */}
      </div>
    </div>
  )
}
