import { PDFConfig } from '../types/pdf'

// ── Page dimension constants (mm) ──────────────────────────────────────────
export const formatHeights: Record<string, number> = {
  'a4-portrait': 297,
  'a4-landscape': 210,
  'letter-portrait': 11 * 25.4,
  'letter-landscape': 8.5 * 25.4,
  'legal-portrait': 14 * 25.4,
  'legal-landscape': 8.5 * 25.4
}

export const formatWidths: Record<string, number> = {
  'a4-portrait': 210,
  'a4-landscape': 297,
  'letter-portrait': 8.5 * 25.4,
  'letter-landscape': 11 * 25.4,
  'legal-portrait': 8.5 * 25.4,
  'legal-landscape': 14 * 25.4
}

// ── Unit conversion helpers (#6) ───────────────────────────────────────────
const MM_TO_PX = 96 / 25.4
const INCH_TO_PX = 96

/** Convert mm to px */
export function mmToPx(mm: number): number {
  return mm * MM_TO_PX
}

/** Convert inches to px */
export function inchToPx(inches: number): number {
  return inches * INCH_TO_PX
}

// ── Named layout constants (#7 – replaces magic 48) ───────────────────────
// These MUST match the Tailwind classes on the content wrapper in Preview.tsx:
//   <div className="relative pt-6 pb-20" ...>
const CONTENT_PADDING_TOP_PX = 24   // pt-6 → 1.5rem → 24px
const CONTENT_PADDING_BOTTOM_PX = 80 // pb-20 → 5rem → 80px
const CONTENT_PADDING_PX = CONTENT_PADDING_TOP_PX + CONTENT_PADDING_BOTTOM_PX // 104px

// Absorbs subpixel rounding, font metric drift, and minor screen↔print differences
const SAFETY_BUFFER_PX = 16 // #8

// ── Pagination options ─────────────────────────────────────────────────────
interface PaginationOptions {
  fullHtml: string
  pdfConfig: PDFConfig
  headerBanner?: string
  footerBanner?: string
  measureElement: HTMLElement
}

// ── Font readiness helper (#3) ─────────────────────────────────────────────
/**
 * Resolves when all fonts used in the document are loaded and ready.
 */
export function waitForFonts(): Promise<FontFaceSet> {
  return document.fonts.ready
}

// ── Image readiness helper (#12) ───────────────────────────────────────────
/**
 * Waits for every <img> inside `container` to finish loading.
 */
export function waitForImages(container: HTMLElement): Promise<void[]> {
  const imgs = Array.from(container.querySelectorAll('img')) as HTMLImageElement[]
  return Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) return resolve()
          img.onload = () => resolve()
          img.onerror = () => resolve() // don't block on broken images
        })
    )
  )
}

// ── Banner measurement helper (#11) ────────────────────────────────────────
/**
 * Measures banner height precisely using offsetHeight + computed margin.
 * No more "+16 guess".
 */
function measureBannerHeight(
  html: string,
  referenceEl: HTMLElement,
  marginClass: 'mb-4' | 'mt-4'
): number {
  const tempDiv = document.createElement('div')
  tempDiv.style.width = referenceEl.style.width
  tempDiv.style.padding = referenceEl.style.padding
  tempDiv.style.position = 'absolute'
  tempDiv.style.visibility = 'hidden'
  tempDiv.className = 'prose dark:prose-invert'

  // Apply the actual margin class so getComputedStyle returns the real value
  const inner = document.createElement('div')
  inner.className = `w-full overflow-hidden ${marginClass}`
  inner.innerHTML = html
  tempDiv.appendChild(inner)

  document.body.appendChild(tempDiv)
  const height = inner.offsetHeight
  const style = getComputedStyle(inner)
  const marginTop = parseFloat(style.marginTop) || 0
  const marginBottom = parseFloat(style.marginBottom) || 0
  document.body.removeChild(tempDiv)

  return height + marginTop + marginBottom
}

// ── Core pagination (#1, #4, #7, #8, #13) ─────────────────────────────────
/**
 * Calculates pagination for HTML content based on PDF configuration.
 * Must run in a browser environment with DOM access.
 *
 * Call `waitForFonts()` and `waitForImages(measureElement)` before this
 * for accurate results.
 */
export function calculatePagination({
  fullHtml,
  pdfConfig,
  headerBanner,
  footerBanner,
  measureElement
}: PaginationOptions): string[] {
  // ── Inject HTML into a wrapper matching real page structure (#2, #14)
  measureElement.innerHTML = `<div class="relative" style="padding-top:${CONTENT_PADDING_TOP_PX}px; padding-bottom:${CONTENT_PADDING_BOTTOM_PX}px">${fullHtml}</div>`

  // The actual elements to paginate are inside the wrapper
  const wrapper = measureElement.firstElementChild as HTMLElement
  const elements = Array.from(wrapper.children) as HTMLElement[]

  // ── Page height calculation (#1, #6, #7)
  const key = `${pdfConfig.format}-${pdfConfig.orientation}`
  const totalPageHeightPx = mmToPx(formatHeights[key] || 297)
  const marginPx = inchToPx(pdfConfig.margin)

  // ── Banner heights (#11)
  let headerBannerHeight = 0
  let footerBannerHeight = 0

  if (headerBanner) {
    headerBannerHeight = measureBannerHeight(headerBanner, measureElement, 'mb-4')
  }
  if (footerBanner) {
    footerBannerHeight = measureBannerHeight(footerBanner, measureElement, 'mt-4')
  }

  // ── Usable content height per page
  const usableHeight =
    totalPageHeightPx
    - (marginPx * 2)              // top + bottom page margin
    - CONTENT_PADDING_PX          // pt-6 + pb-20 (named constants, #7)
    - headerBannerHeight          // precise banner (#11)
    - footerBannerHeight          // precise banner (#11)
    - SAFETY_BUFFER_PX            // absorb drift (#8)

  // ── Paginate elements
  const pages: string[] = []
  let currentPageHTML = ''
  let currentHeight = 0

  elements.forEach((el) => {
    // Handle manual page break
    if (el.classList.contains('page-break')) {
      if (currentPageHTML !== '') {
        pages.push(currentPageHTML)
        currentPageHTML = ''
        currentHeight = 0
      }
      return
    }

    // Use offsetHeight for integer-based stability (#4)
    const elHeight = el.offsetHeight

    // Handle oversized elements (#13):
    // If a single element is taller than the page, give it its own page
    if (elHeight > usableHeight) {
      if (currentPageHTML !== '') {
        pages.push(currentPageHTML)
        currentPageHTML = ''
        currentHeight = 0
      }
      pages.push(el.outerHTML)
      return
    }

    if (currentHeight + elHeight > usableHeight && currentPageHTML !== '') {
      pages.push(currentPageHTML)
      currentPageHTML = ''
      currentHeight = 0
    }

    currentPageHTML += el.outerHTML
    currentHeight += elHeight
  })

  if (currentPageHTML) pages.push(currentPageHTML)

  return pages
}

/**
 * Triggers the browser print dialog with a specific filename.
 */
export function printPDF(name: string): void {
  const originalTitle = document.title
  document.title = name

  setTimeout(() => {
    window.print()
    setTimeout(() => {
      document.title = originalTitle
    }, 1000)
  }, 100)
}
