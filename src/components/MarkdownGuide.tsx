import React, { useState, useCallback, useEffect, useRef } from 'react'
import '../styles/global.css'

/* ─── Types ─── */
interface GuideSection {
  id: string
  title: string
  icon: React.ReactNode
  items: GuideSyntax[]
}

interface GuideSyntax {
  label: string
  syntax: string
  rendered: React.ReactNode
}

/* ─── Copy Button ─── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-zinc-300 transition-all opacity-0 group-hover/code:opacity-100"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
      )}
    </button>
  )
}

/* ─── Code Block ─── */
function CodeBlock({ code }: { code: string }) {
  return (
    <div className="group/code relative rounded-xl bg-zinc-950 dark:bg-zinc-950/80 border border-zinc-800 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-800/60">
        <div className="w-2 h-2 rounded-full bg-zinc-700" />
        <div className="w-2 h-2 rounded-full bg-zinc-700" />
        <div className="w-2 h-2 rounded-full bg-zinc-700" />
        <span className="ml-3 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Markdown</span>
      </div>
      <CopyButton text={code} />
      <pre className="px-4 py-4 text-sm font-mono text-indigo-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  )
}

/* ─── Rendered Preview ─── */
function RenderedPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 mt-3">
      <div className="flex items-center gap-1.5 mb-3">
        <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Rendered Output</span>
      </div>
      <div className="prose dark:prose-invert prose-sm max-w-none">
        {children}
      </div>
    </div>
  )
}

/* ─── Data ─── */
const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'headings',
    title: 'Headings',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
    items: [
      {
        label: 'Heading Levels',
        syntax: `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`,
        rendered: (
          <div className="space-y-1">
            <h1 className="text-2xl font-bold m-0">Heading 1</h1>
            <h2 className="text-xl font-bold m-0">Heading 2</h2>
            <h3 className="text-lg font-bold m-0">Heading 3</h3>
            <h4 className="text-base font-bold m-0">Heading 4</h4>
            <h5 className="text-sm font-bold m-0">Heading 5</h5>
            <h6 className="text-xs font-bold m-0">Heading 6</h6>
          </div>
        )
      }
    ]
  },
  {
    id: 'emphasis',
    title: 'Text Formatting',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    items: [
      {
        label: 'Bold & Italic',
        syntax: `**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~`,
        rendered: (
          <div className="space-y-1">
            <p><strong>Bold text</strong></p>
            <p><em>Italic text</em></p>
            <p><strong><em>Bold and italic</em></strong></p>
            <p><s>Strikethrough</s></p>
          </div>
        )
      },
      {
        label: 'Inline Code',
        syntax: 'Use `inline code` in a sentence.',
        rendered: <p>Use <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600 dark:text-indigo-400">inline code</code> in a sentence.</p>
      },
      {
        label: 'Subscript, Superscript & Highlight',
        syntax: `H~2~O (subscript)
X^2^ (superscript)
==Highlighted text==`,
        rendered: (
          <div className="space-y-1">
            <p>H<sub>2</sub>O (subscript)</p>
            <p>X<sup>2</sup> (superscript)</p>
            <p><mark className="bg-yellow-200 dark:bg-yellow-500/30 text-inherit px-1 rounded-sm">Highlighted text</mark></p>
          </div>
        )
      }
    ]
  },
  {
    id: 'lists',
    title: 'Lists',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
    items: [
      {
        label: 'Unordered List',
        syntax: `- First item
- Second item
  - Nested item
  - Another nested
- Third item`,
        rendered: (
          <ul className="list-disc pl-5 space-y-0.5">
            <li>First item</li>
            <li>Second item
              <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                <li>Nested item</li>
                <li>Another nested</li>
              </ul>
            </li>
            <li>Third item</li>
          </ul>
        )
      },
      {
        label: 'Ordered List',
        syntax: `1. First item
2. Second item
3. Third item`,
        rendered: (
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
          </ol>
        )
      },
      {
        label: 'Task List',
        syntax: `- [x] Completed task
- [ ] Incomplete task
- [ ] Another task`,
        rendered: (
          <ul className="space-y-1 pl-1">
            <li className="flex items-center gap-2"><input type="checkbox" checked readOnly className="rounded accent-indigo-500" /><span>Completed task</span></li>
            <li className="flex items-center gap-2"><input type="checkbox" readOnly className="rounded" /><span>Incomplete task</span></li>
            <li className="flex items-center gap-2"><input type="checkbox" readOnly className="rounded" /><span>Another task</span></li>
          </ul>
        )
      }
    ]
  },
  {
    id: 'links-images',
    title: 'Links & Images',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    items: [
      {
        label: 'Links',
        syntax: `[Link Text](https://example.com)
[Link with Title](https://example.com "Hover title")`,
        rendered: (
          <div className="space-y-1">
            <p><a href="#" className="text-indigo-600 dark:text-indigo-400 underline hover:no-underline">Link Text</a></p>
            <p><a href="#" title="Hover title" className="text-indigo-600 dark:text-indigo-400 underline hover:no-underline">Link with Title</a></p>
          </div>
        )
      },
      {
        label: 'Images',
        syntax: `![Alt text](image-url.jpg)
![Alt text](image-url.jpg "Image title")`,
        rendered: (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-dashed border-zinc-200 dark:border-zinc-700">
            <svg className="w-10 h-10 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-sm text-zinc-500">Image would render here with the given alt text</span>
          </div>
        )
      }
    ]
  },
  {
    id: 'blockquotes',
    title: 'Blockquotes',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
    items: [
      {
        label: 'Basic Blockquote',
        syntax: `> This is a blockquote.
> It can span multiple lines.`,
        rendered: (
          <blockquote className="border-l-4 border-indigo-400 pl-4 text-zinc-600 dark:text-zinc-400 italic">
            This is a blockquote.<br />It can span multiple lines.
          </blockquote>
        )
      },
      {
        label: 'Nested Blockquote',
        syntax: `> Outer quote
>> Nested quote
>>> Deeply nested`,
        rendered: (
          <blockquote className="border-l-4 border-indigo-400 pl-4 text-zinc-600 dark:text-zinc-400 italic">
            Outer quote
            <blockquote className="border-l-4 border-purple-400 pl-4 mt-2 not-italic">
              Nested quote
              <blockquote className="border-l-4 border-pink-400 pl-4 mt-2">
                Deeply nested
              </blockquote>
            </blockquote>
          </blockquote>
        )
      }
    ]
  },
  {
    id: 'code',
    title: 'Code Blocks',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    items: [
      {
        label: 'Fenced Code Block',
        syntax: "```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```",
        rendered: (
          <div className="rounded-lg bg-zinc-950 p-4 font-mono text-sm overflow-x-auto">
            <div className="text-blue-400">function</div>
            <div className="pl-2"><span className="text-yellow-300">greet</span><span className="text-zinc-400">(</span><span className="text-orange-300">name</span><span className="text-zinc-400">)</span> <span className="text-zinc-500">{'{'}</span></div>
            <div className="pl-4"><span className="text-purple-400">return</span> <span className="text-emerald-400">{`\`Hello, \${name}!\``}</span><span className="text-zinc-500">;</span></div>
            <div className="pl-2 text-zinc-500">{'}'}</div>
          </div>
        )
      },
      {
        label: 'Indented Code Block',
        syntax: `    // Indent with 4 spaces
    const x = 42;
    console.log(x);`,
        rendered: (
          <div className="rounded-lg bg-zinc-950 p-4 font-mono text-sm text-zinc-300">
            <div className="text-zinc-500">// Indent with 4 spaces</div>
            <div><span className="text-purple-400">const</span> x = <span className="text-orange-300">42</span>;</div>
            <div>console.<span className="text-yellow-300">log</span>(x);</div>
          </div>
        )
      }
    ]
  },
  {
    id: 'tables',
    title: 'Tables',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    items: [
      {
        label: 'Basic Table',
        syntax: `| Header 1  | Header 2  | Header 3  |
|-----------|-----------|-----------|
| Row 1     | Data      | Data      |
| Row 2     | Data      | Data      |
| Row 3     | Data      | Data      |`,
        rendered: (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-800">
                  <th className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-left font-bold">Header 1</th>
                  <th className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-left font-bold">Header 2</th>
                  <th className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-left font-bold">Header 3</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2">Row 1</td><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2">Data</td><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2">Data</td></tr>
                <tr className="bg-zinc-50 dark:bg-zinc-800/30"><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2">Row 2</td><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2">Data</td><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2">Data</td></tr>
                <tr><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2">Row 3</td><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2">Data</td><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2">Data</td></tr>
              </tbody>
            </table>
          </div>
        )
      },
      {
        label: 'Aligned Table',
        syntax: `| Left    | Center  | Right   |
|:--------|:-------:|--------:|
| Left    | Center  | Right   |
| aligned | aligned | aligned |`,
        rendered: (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-800">
                  <th className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-left font-bold">Left</th>
                  <th className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-center font-bold">Center</th>
                  <th className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-right font-bold">Right</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-left">Left</td><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-center">Center</td><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-right">Right</td></tr>
                <tr className="bg-zinc-50 dark:bg-zinc-800/30"><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-left">aligned</td><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-center">aligned</td><td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-right">aligned</td></tr>
              </tbody>
            </table>
          </div>
        )
      }
    ]
  },
  {
    id: 'hr',
    title: 'Horizontal Rules',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" /></svg>,
    items: [
      {
        label: 'Horizontal Rule',
        syntax: `---
***
___`,
        rendered: (
          <div className="space-y-4">
            <p className="text-sm text-zinc-500">All three produce a horizontal rule:</p>
            <hr className="border-zinc-200 dark:border-zinc-700" />
          </div>
        )
      }
    ]
  },
  {
    id: 'footnotes',
    title: 'Footnotes',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>,
    items: [
      {
        label: 'Footnote Reference',
        syntax: `Here is a sentence with a footnote.[^1]

[^1]: This is the footnote content.`,
        rendered: (
          <div>
            <p>Here is a sentence with a footnote.<sup className="text-indigo-500 font-bold cursor-pointer">1</sup></p>
            <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500">
              <sup className="text-indigo-500 font-bold">1</sup> This is the footnote content.
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'html',
    title: 'HTML & Special',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    items: [
      {
        label: 'Inline HTML',
        syntax: `<center>Centered text</center>
<mark>Highlighted text</mark>
<kbd>Ctrl</kbd> + <kbd>S</kbd>
<details>
  <summary>Click to expand</summary>
  Hidden content here.
</details>`,
        rendered: (
          <div className="space-y-3">
            <p className="text-center font-bold">Centered text</p>
            <p><mark className="bg-yellow-200 dark:bg-yellow-800/40 px-1 rounded">Highlighted text</mark></p>
            <p><kbd className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold shadow-sm">Ctrl</kbd> + <kbd className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold shadow-sm">S</kbd></p>
            <details className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <summary className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer font-medium text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Click to expand</summary>
              <div className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">Hidden content here.</div>
            </details>
          </div>
        )
      },
      {
        label: 'Escaped Characters',
        syntax: `\\*Not italic\\*
\\# Not a heading
\\[Not a link\\]`,
        rendered: (
          <div className="space-y-1">
            <p>*Not italic*</p>
            <p># Not a heading</p>
            <p>[Not a link]</p>
          </div>
        )
      }
    ]
  },
  {
    id: 'bikdocs',
    title: 'BikDocs Specials',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    items: [
      {
        label: 'Page Break',
        syntax: `<div class="page-break"></div>`,
        rendered: (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <div>
              <p className="font-bold text-sm text-indigo-700 dark:text-indigo-300">Forces a page break in PDF output</p>
              <p className="text-xs text-indigo-500/70 dark:text-indigo-400/50 mt-0.5">Content after this tag starts on a new page</p>
            </div>
          </div>
        )
      },
      {
        label: 'Custom HTML Headers/Footers',
        syntax: `<!-- Upload .html files via the toolbar
   for custom branded headers and footers
   on every page of your PDF export. -->`,
        rendered: (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656L17 13" /></svg>
            <div>
              <p className="font-bold text-sm text-emerald-700 dark:text-emerald-300">Custom branding for every page</p>
              <p className="text-xs text-emerald-500/70 dark:text-emerald-400/50 mt-0.5">Upload HTML templates via the {`Layout > Header/Footer`} toolbar menu</p>
            </div>
          </div>
        )
      }
    ]
  }
]

/* ─── Main Component ─── */
export default function MarkdownGuide({
  onBack,
  onGoToEditor,
  theme,
  onToggleTheme,
}: {
  onBack: () => void
  onGoToEditor: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}) {
  const [activeSection, setActiveSection] = useState(GUIDE_SECTIONS[0].id)
  const isClickScrolling = useRef(false)

  const handleScrollTo = (id: string) => {
    isClickScrolling.current = true
    setActiveSection(id)
    const element = document.getElementById(`guide-${id}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => { isClickScrolling.current = false }, 800)
    }
  }

  // Scroll-sync: observe which section is currently visible
  useEffect(() => {
    const sectionIds = GUIDE_SECTIONS.map(s => s.id)
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('guide-', '')
            setActiveSection(id)
            break
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )

    sectionIds.forEach(id => {
      const el = document.getElementById(`guide-${id}`)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0d12] text-zinc-900 dark:text-zinc-100 font-[Inter,system-ui,sans-serif]">
      {/* Background Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.2] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(${theme === 'light' ? '#e5e7eb' : 'rgba(255,255,255,0.2)'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'light' ? '#e5e7eb' : 'rgba(255,255,255,0.2)'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#0b0d12]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#0b0d12]/70 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <img 
              src="/0D983891-04BA-4617-BD54-EEAAA96B184A-Photoroom.png" 
              alt="BikDocs" 
              className="h-10 w-auto" 
            />
            <span className="ml-2 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
              Guide
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              title="Back Home"
            >
              <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden md:inline">Back Home</span>
            </button>
            <button
              onClick={onGoToEditor}
              className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
              title="Start Writing"
            >
              <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="hidden md:inline">Start Writing</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          {/* Sidebar */}
          <aside className="w-full md:w-56 lg:w-64 shrink-0">
            <div className="sticky top-32 space-y-0.5 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
              {GUIDE_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ease-out flex items-center gap-2.5 ${
                    activeSection === sec.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 border border-transparent'
                  }`}
                >
                  <span className={`transition-colors duration-300 ${activeSection === sec.id ? 'text-indigo-500' : 'text-zinc-300 dark:text-zinc-600'}`}>
                    {sec.icon}
                  </span>
                  {sec.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {/* Header */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-6">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Reference Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Markdown Syntax Guide</h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                A complete reference of Markdown syntax supported by BikDocs. Each example shows the raw syntax and its rendered output.
              </p>
            </div>

            {/* Quick Reference Card */}
            <div className="mb-16 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50">
              <h3 className="font-bold text-sm text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">Quick Reference</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { syntax: '# H1', desc: 'Heading 1' },
                  { syntax: '**bold**', desc: 'Bold text' },
                  { syntax: '*italic*', desc: 'Italic text' },
                  { syntax: '[text](url)', desc: 'Link' },
                  { syntax: '![alt](url)', desc: 'Image' },
                  { syntax: '`code`', desc: 'Inline code' },
                  { syntax: '> quote', desc: 'Blockquote' },
                  { syntax: '- item', desc: 'List' },
                  { syntax: '==high==', desc: 'Highlight' },
                  { syntax: '[^1]', desc: 'Footnote' },
                  { syntax: 'H~2~O', desc: 'Subscript' },
                  { syntax: '---', desc: 'Rule' },
                ].map((item) => (
                  <div key={item.syntax} className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm group/item hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900">
                    <code className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-950 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-800/50 shrink-0 group-hover/item:border-indigo-300 dark:group-hover/item:border-indigo-500 transition-colors">
                      {item.syntax}
                    </code>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold truncate tracking-tight">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-20">
              {GUIDE_SECTIONS.map((section) => (
                <section key={section.id} id={`guide-${section.id}`} className="scroll-mt-32">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
                      {section.icon}
                    </span>
                    {section.title}
                  </h2>

                  <div className="space-y-10">
                    {section.items.map((item, idx) => (
                      <div key={idx}>
                        <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          {item.label}
                        </h3>
                        <CodeBlock code={item.syntax} />
                        <RenderedPreview>{item.rendered}</RenderedPreview>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* CTA Footer */}
            <div className="mt-32 p-12 rounded-[32px] bg-indigo-600 text-white text-center shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0.1,_transparent_0)] bg-[size:40px_40px] opacity-10" />
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-6">Ready to try it out?</h3>
                <p className="text-indigo-100 mb-8 max-w-xs mx-auto">
                  Put this syntax to use in BikDocs and see your documents come to life.
                </p>
                <button
                  onClick={onGoToEditor}
                  className="px-10 py-4 rounded-full bg-white text-indigo-600 font-bold shadow-xl hover:bg-indigo-50 transition-all active:scale-95"
                >
                  Open Editor
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-10 relative z-10 bg-white dark:bg-[#0b0d12]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onBack}
          >
            <img 
              src="/0D983891-04BA-4617-BD54-EEAAA96B184A-Photoroom.png" 
              alt="BikDocs" 
              className="h-8 w-auto" 
            />
          </div>
          <p className="text-xs text-zinc-400">&copy; 2026 BikDocs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
