import React, { useState, useEffect } from 'react'
import '../styles/global.css'

const FEATURES = [
  {
    icon: '✏️',
    title: 'Monaco Code Editor',
    desc: 'Full-featured code editor powered by Monaco (the engine behind VS Code). Features syntax highlighting for Markdown, code folding, bracket pair colorization, word wrap, smooth cursor animation, and JetBrains Mono font.',
    color: 'blue',
  },
  {
    icon: '👁️',
    title: 'Live Preview with Auto-Pagination',
    desc: 'Real-time Markdown preview rendered as paginated PDF-like pages. Content is automatically split across pages based on your selected paper format, orientation, and margins — matching exactly what the final PDF will look like.',
    color: 'purple',
  },
  {
    icon: '📄',
    title: 'PDF Export',
    desc: 'Export your document as a professional PDF via the browser print dialog. The preview already shows you the exact page breaks, headers, footers, and timestamps that will appear in the exported file.',
    color: 'red',
  },
  {
    icon: '📐',
    title: 'Page Size & Orientation',
    desc: 'Choose from A4, Letter, or Legal page formats in either Portrait or Landscape orientation. The preview and PDF output adapt instantly to your selection.',
    color: 'teal',
  },
  {
    icon: '📏',
    title: 'Configurable Margins',
    desc: 'Set page margins from 0.2 to 1.0 inches. Margins are applied consistently across both the screen preview and the exported PDF.',
    color: 'amber',
  },
  {
    icon: '🖼️',
    title: 'Image Insertion & Storage',
    desc: 'Insert images directly into your Markdown. Images are automatically compressed to WebP format, hashed with SHA-256, and stored locally in IndexedDB — keeping your documents self-contained without external dependencies.',
    color: 'green',
  },
  {
    icon: '🧹',
    title: 'Automatic Image Cleanup',
    desc: 'When you remove an image from your Markdown, the application automatically detects and deletes unused images from IndexedDB storage, keeping your local storage clean.',
    color: 'orange',
  },
  {
    icon: '📑',
    title: 'Manual Page Breaks',
    desc: 'Insert explicit page breaks at any point in your document using the toolbar button. The break is inserted as an HTML div that the pagination engine recognizes and respects.',
    color: 'indigo',
  },
  {
    icon: '🏷️',
    title: 'Header & Footer Text',
    desc: 'Add custom header and footer text that appears on every page of the PDF. Configured through the Layout Settings modal, this text is rendered in a monospace font at the top and bottom of each page.',
    color: 'cyan',
  },
  {
    icon: '🎨',
    title: 'HTML Banner Upload',
    desc: 'Upload custom HTML files as header or footer banners. Design rich, branded headers and footers with full HTML/CSS and they will be rendered on every page of your document.',
    color: 'pink',
  },
  {
    icon: '🕐',
    title: 'PDF Timestamp',
    desc: 'Toggle an automatic date/time stamp on every page of the PDF. Displayed in the top-left corner, it shows the current date and time when the document was exported.',
    color: 'slate',
  },
  {
    icon: '#️⃣',
    title: 'Page Numbers',
    desc: 'Toggle automatic page numbering on every page. Page numbers are rendered as "current/total" in the bottom-right corner of each page.',
    color: 'violet',
  },
  {
    icon: '🌗',
    title: 'Dark / Light Mode',
    desc: 'Switch between dark and light themes with one click. The editor, preview, and all modals adapt to your preference. PDF export always renders in light mode for print clarity.',
    color: 'gray',
  },
  {
    icon: '📂',
    title: 'Open & Download Markdown',
    desc: 'Open any .md, .markdown, or .txt file from your local filesystem. Download your current work as a .md file at any time, with a rename dialog before saving.',
    color: 'emerald',
  },
  {
    icon: '↔️',
    title: 'Resizable Split Pane',
    desc: 'Drag the divider between the editor and preview to adjust their proportions (20% to 80%). On mobile, toggle between editor and preview tabs. Collapse the editor entirely to focus on the preview.',
    color: 'sky',
  },
  {
    icon: '📊',
    title: 'Status Bar',
    desc: 'A bottom status bar shows your current filename, unsaved changes indicator, and live statistics: line count, word count, and character count — all updating in real time as you type.',
    color: 'fuchsia',
  },
  {
    icon: '☁️',
    title: 'Cloud Document Sync',
    desc: 'Sign in to save and sync documents to the cloud. Create new documents, sync changes to existing ones, or save snapshots as new copies. Access your saved documents from any device.',
    color: 'blue',
  },
  {
    icon: '🎭',
    title: 'Template Library',
    desc: 'Save your layout settings (theme, margins, format, orientation, banners, etc.) as reusable templates. Load templates to quickly apply consistent formatting across multiple documents.',
    color: 'indigo',
  },
  {
    icon: '🔐',
    title: 'User Authentication',
    desc: 'Create an account and sign in to unlock cloud features. Signup sends a secure set-password link to your email. JWT-based authentication keeps your sessions secure.',
    color: 'red',
  },
  {
    icon: '💬',
    title: 'Toast Notifications',
    desc: 'Non-intrusive toast notifications confirm your actions — saving, syncing, loading, and errors are all communicated through dismissible toasts.',
    color: 'amber',
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    desc: 'Fully responsive layout that works on desktop, tablet, and mobile. The toolbar adapts with collapsible menus, mobile tab switching between editor and preview, and dynamic page scaling.',
    color: 'teal',
  },
  {
    icon: '🖨️',
    title: 'Print-Optimized Output',
    desc: 'Print styles force light mode, reset prose colors, and enforce consistent line-height. Each page uses overflow:hidden and break-inside:avoid to prevent content spill and awkward splits.',
    color: 'gray',
  },
  {
    icon: '🧩',
    title: 'Syntax Highlighting',
    desc: 'Code blocks in your Markdown are syntax highlighted using highlight.js with the GitHub theme. Supports all popular programming languages out of the box.',
    color: 'purple',
  },
  {
    icon: '📋',
    title: 'GFM Tables',
    desc: 'Full support for GitHub Flavored Markdown tables with styled borders, alternating row colors, and responsive widths. Tables look professional in both the preview and exported PDF.',
    color: 'green',
  },
]

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-blue-500/20', dot: 'bg-blue-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', ring: 'ring-purple-500/20', dot: 'bg-purple-500' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', ring: 'ring-red-500/20', dot: 'bg-red-500' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', ring: 'ring-teal-500/20', dot: 'bg-teal-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20', dot: 'bg-amber-500' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', ring: 'ring-green-500/20', dot: 'bg-green-500' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', ring: 'ring-orange-500/20', dot: 'bg-orange-500' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', ring: 'ring-indigo-500/20', dot: 'bg-indigo-500' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', ring: 'ring-cyan-500/20', dot: 'bg-cyan-500' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', ring: 'ring-pink-500/20', dot: 'bg-pink-500' },
  slate: { bg: 'bg-slate-500/10', text: 'text-slate-400', ring: 'ring-slate-500/20', dot: 'bg-slate-500' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', ring: 'ring-violet-500/20', dot: 'bg-violet-500' },
  gray: { bg: 'bg-gray-500/10', text: 'text-gray-400', ring: 'ring-gray-500/20', dot: 'bg-gray-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20', dot: 'bg-emerald-500' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', ring: 'ring-sky-500/20', dot: 'bg-sky-500' },
  fuchsia: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', ring: 'ring-fuchsia-500/20', dot: 'bg-fuchsia-500' },
}

export default function DocsPage({ onGoToEditor }: { onGoToEditor: () => void }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => { document.documentElement.classList.remove('dark') }
  }, [])

  const categories = [
    { id: null, label: 'All Features' },
    { id: 'editor', label: 'Editor' },
    { id: 'pdf', label: 'PDF & Export' },
    { id: 'cloud', label: 'Cloud & Auth' },
    { id: 'ui', label: 'UI & Design' },
  ]

  const categoryMap: Record<string, string[]> = {
    editor: ['Monaco Code Editor', 'Syntax Highlighting', 'GFM Tables', 'Manual Page Breaks', 'Image Insertion & Storage', 'Automatic Image Cleanup', 'Open & Download Markdown'],
    pdf: ['Live Preview with Auto-Pagination', 'PDF Export', 'Page Size & Orientation', 'Configurable Margins', 'Header & Footer Text', 'HTML Banner Upload', 'PDF Timestamp', 'Page Numbers', 'Print-Optimized Output'],
    cloud: ['Cloud Document Sync', 'Template Library', 'User Authentication'],
    ui: ['Dark / Light Mode', 'Resizable Split Pane', 'Status Bar', 'Toast Notifications', 'Responsive Design'],
  }

  const filtered = FEATURES.filter((f) => {
    const matchesSearch = !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || categoryMap[activeCategory]?.includes(f.title)
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-gray-100 font-sans">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/8 rounded-full blur-[120px]" />

        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-16">
          <nav className="flex items-center justify-between mb-16">
            <span className="text-lg font-bold text-white">BikDocs</span>
            <button
              onClick={onGoToEditor}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Editor
            </button>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Documentation
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Every Feature,{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Documented
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A complete Markdown editor with live preview, PDF export, cloud sync, and powerful layout controls — all in your browser.
            </p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-40 bg-[#0a0b0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search features..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-none cursor-pointer ${activeCategory === cat.id
                  ? 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30'
                  : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                  }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((feature) => {
            const colors = COLOR_MAP[feature.color] || COLOR_MAP.gray
            return (
              <div
                key={feature.title}
                className={`group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 cursor-default`}
              >
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center text-xl ring-1 ${colors.ring} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold text-white mb-1.5 leading-snug">{feature.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
                <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent ${colors.dot.replace('bg-', 'via-')}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No features match your search.</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 pt-12 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Features', value: FEATURES.length.toString() },
              { label: 'Components', value: '8' },
              { label: 'API Modules', value: '3' },
              { label: 'Export Formats', value: '2' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            BikDocs — Desktop Markdown Editor
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/bikramAuto/gen-pdf-ui" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              GitHub
            </a>
            <button onClick={onGoToEditor} className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer bg-transparent border-none">
              Editor
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
