import React, { useState, useEffect } from 'react'
import '../styles/global.css'

// ── Feature Data ────────────────────────────────────────────────────────────
interface Feature {
  icon: string
  title: string
  desc: string
  category: 'core' | 'pdf' | 'cloud' | 'ui'
}

const FEATURES: Feature[] = [
  // ── Core / Editor ──
  { icon: '✏️', title: 'Monaco Code Editor', desc: 'Full-featured code editor powered by Monaco — syntax highlighting, code folding, bracket colorization, smooth cursor, JetBrains Mono font.', category: 'core' },
  { icon: '🧩', title: 'Syntax Highlighting', desc: 'Code blocks are highlighted using highlight.js with the GitHub theme. All popular programming languages supported.', category: 'core' },
  { icon: '📋', title: 'GFM Tables', desc: 'GitHub Flavored Markdown tables with styled borders, alternating row colors, and responsive widths.', category: 'core' },
  { icon: '🖼️', title: 'Image Insertion & Storage', desc: 'Images auto-compressed to WebP, SHA-256 hashed, stored in IndexedDB. Self-contained, no external hosting.', category: 'core' },
  { icon: '🧹', title: 'Auto Image Cleanup', desc: 'Unused images detected and removed from IndexedDB automatically when deleted from Markdown.', category: 'core' },
  { icon: '📂', title: 'Open & Download Markdown', desc: 'Open .md/.txt files locally, download your work as .md with rename dialog.', category: 'core' },
  { icon: '📑', title: 'Manual Page Breaks', desc: 'Insert explicit page breaks that the pagination engine recognizes and respects.', category: 'core' },

  // ── PDF & Export ──
  { icon: '👁️', title: 'Live Auto-Pagination', desc: 'Content auto-splits across pages matching your selected format, orientation, and margins — WYSIWYG preview.', category: 'pdf' },
  { icon: '📄', title: 'PDF Export', desc: 'Professional PDF export via browser print dialog. Headers, footers, and timestamps render exactly as previewed.', category: 'pdf' },
  { icon: '📐', title: 'Page Format & Orientation', desc: 'A4, Letter, or Legal in Portrait or Landscape. Preview and PDF adapt instantly.', category: 'pdf' },
  { icon: '📏', title: 'Configurable Margins', desc: 'Set margins from 0.2 to 1.0 inches, consistent across screen preview and exported PDF.', category: 'pdf' },
  { icon: '🏷️', title: 'Header & Footer Text', desc: 'Custom text on every page — monospace font, centered, configured via Layout Settings.', category: 'pdf' },
  { icon: '🎨', title: 'HTML Banner Upload', desc: 'Upload rich HTML header/footer banners for branded, professional-looking document exports.', category: 'pdf' },
  { icon: '🕐', title: 'PDF Timestamp', desc: 'Automatic date/time stamp on every exported page. Toggle on/off from the toolbar.', category: 'pdf' },
  { icon: '#️⃣', title: 'Page Numbers', desc: 'Auto page numbering — "current/total" in bottom-right corner of each page.', category: 'pdf' },
  { icon: '🖨️', title: 'Print-Optimized Output', desc: 'Forced light mode, consistent line-height, overflow clipping, and break-inside-avoid for clean print output.', category: 'pdf' },

  // ── Cloud & Auth ──
  { icon: '☁️', title: 'Cloud Document Sync', desc: 'Save, sync, and snapshot documents to the cloud. Access from any device.', category: 'cloud' },
  { icon: '🎭', title: 'Template Library', desc: 'Save layout settings as reusable templates. Load them for instant consistent formatting.', category: 'cloud' },
  { icon: '🔐', title: 'User Authentication', desc: 'JWT-based auth with email set-password links. Secure sign-in unlocks cloud features.', category: 'cloud' },

  // ── UI & Design ──
  { icon: '🌗', title: 'Dark / Light Mode', desc: 'One-click theme toggle. Editor, preview, and modals adapt. PDF always exports in light mode.', category: 'ui' },
  { icon: '↔️', title: 'Resizable Split Pane', desc: 'Drag to resize editor and preview (20–80%). Collapse editor to focus on preview. Mobile tab switching.', category: 'ui' },
  { icon: '📊', title: 'Status Bar', desc: 'Live filename, unsaved indicator, line/word/character counts — all updating in real time.', category: 'ui' },
  { icon: '💬', title: 'Toast Notifications', desc: 'Non-intrusive toasts for save, sync, load, and error feedback. Dismissible.', category: 'ui' },
  { icon: '📱', title: 'Responsive Design', desc: 'Works on desktop, tablet, and mobile with adaptive toolbar, tab switching, and dynamic scaling.', category: 'ui' },
]

const CATEGORIES = [
  { id: null,    label: 'All',           count: FEATURES.length, desc: 'Everything the editor offers' },
  { id: 'core',  label: 'Core Editor',   count: FEATURES.filter(f => f.category === 'core').length,  desc: 'Writing & editing essentials' },
  { id: 'pdf',   label: 'PDF & Export',  count: FEATURES.filter(f => f.category === 'pdf').length,   desc: 'Layout, pagination, and export' },
  { id: 'cloud', label: 'Cloud & Auth',  count: FEATURES.filter(f => f.category === 'cloud').length, desc: 'Sync, templates, and accounts' },
  { id: 'ui',    label: 'UI & Design',   count: FEATURES.filter(f => f.category === 'ui').length,    desc: 'Theming, layout, and responsiveness' },
] as const

const CATEGORY_META: Record<string, { title: string; subtitle: string }> = {
  core:  { title: 'Core Editor',  subtitle: 'The foundation — writing, editing, and Markdown processing' },
  pdf:   { title: 'PDF & Export', subtitle: 'Page layout, pagination, and professional document export' },
  cloud: { title: 'Cloud & Auth', subtitle: 'Sync documents to the cloud and manage your account' },
  ui:    { title: 'UI & Design',  subtitle: 'Theming, responsive layout, and status feedback' },
}

// ── Component ───────────────────────────────────────────────────────────────
export default function DocsPage({ onGoToEditor }: { onGoToEditor: () => void }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => { document.documentElement.classList.remove('dark') }
  }, [])

  const filtered = FEATURES.filter((f) => {
    const matchesSearch = !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || f.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Group features by category for section headings
  const groupedByCategory = activeCategory
    ? { [activeCategory]: filtered }
    : filtered.reduce<Record<string, Feature[]>>((acc, f) => {
        ;(acc[f.category] ??= []).push(f)
        return acc
      }, {})

  return (
    <div className="min-h-screen bg-[#08090d] text-gray-100 font-[Inter,system-ui,sans-serif] relative">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }}
      />

      {/* Hero */}
      <header className="relative overflow-hidden z-10">
        {/* Subtle radial glow */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gradient-radial from-blue-500/[0.07] to-transparent blur-[80px]" />
        <div className="absolute top-[-100px] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.04] blur-[100px]" />

        <div className="relative max-w-5xl mx-auto px-6 pt-10 pb-14">
          <nav className="flex items-center justify-between mb-20">
            <button
              onClick={() => { setSearch(''); setActiveCategory(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="text-[17px] font-semibold text-white/90 tracking-tight cursor-pointer bg-transparent border-none hover:text-white transition-colors duration-200"
            >
              BikDocs
            </button>
            <button
              onClick={onGoToEditor}
              className="group px-5 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] text-[13px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              Open Editor
              <span className="inline-block ml-1.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300">→</span>
            </button>
          </nav>

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/[0.08] border border-blue-400/[0.12] text-blue-300/80 text-[11px] font-semibold uppercase tracking-[0.15em] mb-5">
              <span className="w-1 h-1 rounded-full bg-blue-400/80 animate-pulse" />
              Documentation
            </div>
            <h1 className="text-[2.75rem] md:text-[3.25rem] font-extrabold text-white/95 tracking-[-0.02em] leading-[1.1] mb-4">
              Every feature,{' '}
              <span className="bg-gradient-to-r from-blue-300 via-violet-300 to-purple-300 bg-clip-text text-transparent">
                explained
              </span>
            </h1>
            <p className="text-[15px] text-gray-500 max-w-lg mx-auto leading-relaxed font-normal">
              A complete Markdown editor with live preview, PDF export, cloud sync, and powerful layout controls.
            </p>
          </div>
        </div>
      </header>

      {/* Sticky Filters */}
      <div className="sticky top-0 z-40 bg-[#08090d]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search features..."
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-full pl-9 pr-4 py-2 text-[13px] text-gray-300 placeholder:text-gray-600 focus:outline-none focus:bg-white/[0.06] focus:border-white/[0.12] transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {!search && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-600 font-medium">
                {filtered.length} features
              </span>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-white/[0.1] text-white border-white/[0.12] shadow-[0_0_12px_rgba(255,255,255,0.04)]'
                    : 'bg-transparent text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/[0.04]'
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
                <span className={`ml-1.5 text-[10px] ${activeCategory === cat.id ? 'text-gray-400' : 'text-gray-700'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Sections */}
      <main className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        {Object.entries(groupedByCategory).map(([catId, features]) => {
          const meta = CATEGORY_META[catId]
          return (
            <section key={catId} className="mb-14 last:mb-0">
              {/* Section heading */}
              {meta && (
                <div className="mb-6 flex items-baseline gap-3">
                  <h2 className="text-[13px] font-bold text-white/70 uppercase tracking-[0.12em]">{meta.title}</h2>
                  <span className="text-[12px] text-gray-600 font-normal hidden sm:inline">— {meta.subtitle}</span>
                </div>
              )}

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="group relative rounded-xl border border-white/[0.04] bg-white/[0.015] p-5 hover:bg-white/[0.035] hover:border-white/[0.08] transition-all duration-300 cursor-default backdrop-blur-[2px]"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative flex items-start gap-3.5">
                      {/* Icon pill */}
                      <div className="shrink-0 w-10 h-10 rounded-[10px] bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-lg backdrop-blur-sm group-hover:bg-white/[0.08] group-hover:border-white/[0.1] group-hover:scale-105 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                        {feature.icon}
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <h3 className="text-[13px] font-semibold text-white/90 mb-1 leading-snug tracking-[-0.01em]">{feature.title}</h3>
                        <p className="text-[12px] text-gray-500 leading-[1.6] font-normal">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-600 text-sm">No features match your search.</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 pt-10 border-t border-white/[0.04]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Features', value: FEATURES.length.toString() },
              { label: 'Components', value: '8' },
              { label: 'API Modules', value: '3' },
              { label: 'Export Formats', value: '2' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white/80 tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-[0.15em] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-7 mt-6 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-700 font-medium">BikDocs — Desktop Markdown Editor</p>
          <div className="flex items-center gap-5">
            <a href="https://github.com/bikramAuto/gen-pdf-ui" target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors duration-200 font-medium">
              GitHub
            </a>
            <button onClick={onGoToEditor} className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors duration-200 cursor-pointer bg-transparent border-none font-medium">
              Editor
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
