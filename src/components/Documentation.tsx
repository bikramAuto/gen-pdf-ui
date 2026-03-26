import React, { useState } from 'react'
import '../styles/global.css'

interface DocSection {
  id: string
  title: string
  content: React.ReactNode
}

const DOCS: DocSection[] = [
  {
    id: 'intro',
    title: 'Introduction',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          BikDocs is a premium Markdown editor designed specifically for professional document creation and high-fidelity PDF export. Unlike traditional Markdown editors, BikDocs treats your document as a physical medium, providing real-time feedback on layouts, page breaks, and print styling.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
            <h4 className="font-bold mb-2">Editor View</h4>
            <p className="text-sm text-zinc-500">A clean, distraction-free Markdown environment with syntax highlighting.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
            <h4 className="font-bold mb-2">Print View</h4>
            <p className="text-sm text-zinc-500">A physical-page representation showing exactly how your PDF will look.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'wysiwyg',
    title: 'WYSIWYG Preview',
    content: (
      <div className="space-y-6">
        <p className="text-zinc-600 dark:text-zinc-400">
          The core of BikDocs is our real-time rendering engine. As you type in the editor, the preview pane updates instantly, rendering your Markdown into a format that honors physical page dimensions.
        </p>
        <div className="bg-zinc-900 rounded-xl p-6 font-mono text-sm text-indigo-300">
          <div className="opacity-50 mb-2">// Sample Markdown</div>
          <div className="text-white"># My Professional Report</div>
          <div className="mt-2 text-zinc-400">This updates instantly in the preview...</div>
        </div>
        <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
          <li>Live synchronization between editor and preview.</li>
          <li>Auto-scroll ensures you see what you&apos;re editing.</li>
          <li>Accurate typography and margin rendering.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'layouts',
    title: 'Physical Layouts',
    content: (
      <div className="space-y-6">
        <p className="text-zinc-600 dark:text-zinc-400">
          BikDocs supports standard physical page formats. You can change the layout at any time, and the editor will re-calculate page breaks automatically.
        </p>
        <div className="flex gap-4">
          {['A4', 'Letter', 'Legal'].map(size => (
            <div key={size} className="px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-100 dark:border-indigo-800">
              {size} Format
            </div>
          ))}
        </div>
        <div className="p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-transparent">
          <h4 className="font-bold mb-2">Smart Page Breaks</h4>
          <p className="text-sm text-zinc-500">Prevent awkward content splits with the <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">.page-break</code> class or standard Markdown horizontal rules.</p>
        </div>
      </div>
    )
  },
  {
    id: 'branding',
    title: 'Custom Branding',
    content: (
      <div className="space-y-6">
        <p className="text-zinc-600 dark:text-zinc-400">
          Elevate your documents with custom branding. You can inject raw HTML into the headers and footers of every page.
        </p>
        <div className="bg-zinc-900 rounded-xl p-6 font-mono text-sm text-emerald-400">
          <div className="opacity-50 mb-2">&lt;!-- Custom Header --&gt;</div>
          <div>&lt;div style=&quot;display: flex; justify-content: space-between;&quot;&gt;</div>
          <div className="pl-4">&lt;img src=&quot;logo.png&quot; height=&quot;20&quot; /&gt;</div>
          <div className="pl-4">&lt;span&gt;Confidential&lt;/span&gt;</div>
          <div>&lt;/div&gt;</div>
        </div>
        <p className="text-sm text-zinc-500">
          Use styles like <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">position: absolute</code> and <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">z-index</code> to create complex background watermarks or sidebars.
        </p>
      </div>
    )
  },
  {
    id: 'export',
    title: 'PDF & Image Export',
    content: (
      <div className="space-y-6">
        <p className="text-zinc-600 dark:text-zinc-400">
          Our export engine produces high-fidelity PDFs that preserve links, high-resolution images, and complex layouts.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
             <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
             <div>
                <div className="font-bold text-sm">Vector PDF</div>
                <div className="text-[10px] text-zinc-500">Searchable text & clear graphics</div>
             </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
             <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
             <div>
                <div className="font-bold text-sm">Raster Images</div>
                <div className="text-[10px] text-zinc-500">Export pages as high-res PNG/JPG</div>
             </div>
          </div>
        </div>
      </div>
    )
  }
]

export default function Documentation({ onBack, onGoToEditor, theme, onToggleTheme }: { onBack: () => void, onGoToEditor: () => void, theme: 'light' | 'dark', onToggleTheme: () => void }) {
  const [activeSection, setActiveSection] = useState(DOCS[0].id)

  const handleScrollTo = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0d12] text-zinc-900 dark:text-zinc-100 font-[Inter,system-ui,sans-serif]">
      {/* Background Texture (same as DocsPage for consistency) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.2] dark:opacity-[0.05]" 
          style={{ 
            backgroundImage: `linear-gradient(${theme === 'light' ? '#e5e7eb' : 'rgba(255,255,255,0.2)'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'light' ? '#e5e7eb' : 'rgba(255,255,255,0.2)'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#0b0d12]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#0b0d12]/70 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-lg tracking-tight">BikDocs</span>
            <span className="ml-2 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Docs</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onToggleTheme}
              className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-50 transition-colors"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>
            <button 
              onClick={onBack}
              className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              Back Home
            </button>
            <button 
              onClick={onGoToEditor}
              className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
            >
              Start Writing
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-32 space-y-1">
              {DOCS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleScrollTo(doc.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeSection === doc.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                  }`}
                >
                  {doc.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 max-w-2xl">
            <h1 className="text-4xl font-black mb-4">Documentation</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-16">Everything you need to know about building perfect documents with BikDocs.</p>

            <div className="space-y-32">
              {DOCS.map((doc) => (
                <section key={doc.id} id={doc.id} className="scroll-mt-32">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                    {doc.title}
                  </h2>
                  <div className="prose dark:prose-invert">
                    {doc.content}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-40 p-12 rounded-[32px] bg-indigo-600 text-white text-center shadow-2xl shadow-indigo-500/20">
               <h3 className="text-3xl font-bold mb-6">Ready to create?</h3>
               <p className="text-indigo-100 mb-8 max-w-xs mx-auto">Start your first document today and see the precision for yourself.</p>
               <button 
                onClick={onGoToEditor}
                className="px-10 py-4 rounded-full bg-white text-indigo-600 font-bold shadow-xl hover:bg-indigo-50 transition-all active:scale-95"
               >
                Open Editor
               </button>
            </div>
          </main>
        </div>
      </div>

      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-10 relative z-10 bg-white dark:bg-[#0b0d12]">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">B</div>
               <span className="font-bold text-sm tracking-tight">BikDocs</span>
            </div>
            <p className="text-xs text-zinc-400">&copy; 2026 BikDocs. All rights reserved.</p>
         </div>
      </footer>
    </div>
  )
}
