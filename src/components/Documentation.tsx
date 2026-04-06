import React, { useState, useEffect, useRef } from 'react'
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
        <div className="bg-zinc-900 rounded-xl p-6 font-mono text-sm text-brand-300">
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
            <div key={size} className="px-4 py-2 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-bold text-xs border border-brand-100 dark:border-brand-800">
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
             <svg className="w-8 h-8 text-brand-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
             <div>
                <div className="font-bold text-sm">Raster Images</div>
                <div className="text-[10px] text-zinc-500">Export pages as high-res PNG/JPG</div>
             </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'security',
    title: 'Security & Auth',
    content: (
      <div className="space-y-6">
        <p className="text-zinc-600 dark:text-zinc-400">
          BikDocs is built with a security-first mindset. Every authenticated request is cryptographically bound to your device, ensuring your documents and identity remain protected.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-300">DPoP Proof-of-Possession</h4>
            </div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70 leading-relaxed">Every API request includes a DPoP (Demonstrating Proof-of-Possession) token signed with your device&apos;s ECDSA P-256 key pair, preventing token theft and replay attacks.</p>
          </div>
          <div className="p-5 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              <h4 className="font-bold text-sm text-brand-700 dark:text-brand-300">ECDSA Key Pair</h4>
            </div>
            <p className="text-xs text-brand-600/80 dark:text-brand-400/70 leading-relaxed">A unique ECDSA P-256 key pair is generated in-browser using the Web Crypto API. Private keys never leave your device — only the public key is shared with the server.</p>
          </div>
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <h4 className="font-bold text-sm text-amber-700 dark:text-amber-300">Silent Token Refresh</h4>
            </div>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/70 leading-relaxed">Expired access tokens are automatically refreshed in the background using DPoP-protected refresh tokens. You&apos;ll never be interrupted by a login prompt mid-session.</p>
          </div>
          <div className="p-5 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <h4 className="font-bold text-sm text-brand-700 dark:text-brand-300">Content Sanitization</h4>
            </div>
            <p className="text-xs text-brand-600/80 dark:text-brand-400/70 leading-relaxed">All rendered Markdown is sanitized through DOMPurify before display, blocking XSS attacks from malicious content while preserving safe HTML elements.</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-transparent">
          <h4 className="font-bold mb-2">How DPoP Authentication Works</h4>
          <ol className="list-decimal pl-6 space-y-2 text-sm text-zinc-500">
            <li>On login or OAuth, a unique <strong>ECDSA P-256 key pair</strong> is generated in your browser.</li>
            <li>The public key is bound to your session on the server during authentication.</li>
            <li>For every API request, BikDocs creates a <strong>signed DPoP JWT proof</strong> containing the request method, URL, timestamp, and a SHA-256 hash of the access token.</li>
            <li>The server verifies the proof&apos;s signature matches the registered public key, ensuring the request originates from the same device that authenticated.</li>
            <li>If a stolen token is used from another device, it will be <strong>rejected</strong> because it lacks the correct private key to sign the DPoP proof.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'cloud',
    title: 'Cloud Sync',
    content: (
      <div className="space-y-6">
        <p className="text-zinc-600 dark:text-zinc-400">
          BikDocs operates on a local-first model — your work is always saved to your browser&apos;s local storage first, with optional cloud sync when you sign in.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 text-center">
            <svg className="w-8 h-8 mx-auto mb-3 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
            <h4 className="font-bold text-sm mb-1">Templates</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">Save layout settings — page format, margins, headers, and footers — as reusable templates across documents.</p>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 text-center">
            <svg className="w-8 h-8 mx-auto mb-3 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <h4 className="font-bold text-sm mb-1">Sync</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">Push your current document to the cloud with one click. Changes are synced to the same server-side copy.</p>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 text-center">
            <svg className="w-8 h-8 mx-auto mb-3 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h4 className="font-bold text-sm mb-1">Snapshots</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">Create point-in-time snapshots of your document for versioning, without overwriting the original.</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-transparent">
          <h4 className="font-bold mb-2">Local-First Architecture</h4>
          <p className="text-sm text-zinc-500">Your content, filename, theme, layout settings, and images (stored in IndexedDB) are always persisted in local storage. Even without internet or an account, all features work offline. Cloud sync simply replicates your data to the server for cross-device access.</p>
        </div>
      </div>
    )
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    content: (
      <div className="space-y-6">
        <p className="text-zinc-600 dark:text-zinc-400">
          Speed up your workflow with these essential keyboard shortcuts available in the editor.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800">
                <th className="border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-left font-bold">Action</th>
                <th className="border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-left font-bold">macOS</th>
                <th className="border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-left font-bold">Windows / Linux</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Save / Sync', '⌘ + S', 'Ctrl + S'],
                ['Download as Markdown', '⌘ + Shift + S', 'Ctrl + Shift + S'],
                ['Export to PDF', '⌘ + P', 'Ctrl + P'],
                ['Toggle Bold', '⌘ + B', 'Ctrl + B'],
                ['Toggle Italic', '⌘ + I', 'Ctrl + I'],
                ['Undo', '⌘ + Z', 'Ctrl + Z'],
                ['Redo', '⌘ + Shift + Z', 'Ctrl + Shift + Z'],
                ['Find & Replace', '⌘ + H', 'Ctrl + H'],
              ].map(([action, mac, win], i) => (
                <tr key={action} className={i % 2 !== 0 ? 'bg-zinc-50 dark:bg-zinc-800/30' : ''}>
                  <td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 font-medium">{action}</td>
                  <td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 font-mono text-xs text-brand-600 dark:text-brand-400">{mac}</td>
                  <td className="border border-zinc-200 dark:border-zinc-700 px-4 py-2 font-mono text-xs text-brand-600 dark:text-brand-400">{win}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    id: 'mobile',
    title: 'Mobile Editing',
    content: (
      <div className="space-y-6">
        <p className="text-zinc-600 dark:text-zinc-400">
          BikDocs includes a dedicated touch-friendly toolbar for mobile users. Since phones lack physical keyboards for shortcuts like <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-xs">Ctrl+A</code> or <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-xs">Ctrl+B</code>, the mobile editing bar provides one-tap access to all essential actions.
        </p>
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border border-brand-100 dark:border-brand-800/50">
          <h4 className="font-bold text-sm text-brand-700 dark:text-brand-300 mb-3">Mobile Toolbar Actions</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { icon: '☰', label: 'Select All', desc: 'Select entire document' },
              { icon: '↺', label: 'Undo', desc: 'Reverse last action' },
              { icon: '↻', label: 'Redo', desc: 'Redo undone action' },
              { icon: 'B', label: 'Bold', desc: 'Wrap in **bold**' },
              { icon: 'I', label: 'Italic', desc: 'Wrap in *italic*' },
              { icon: 'S', label: 'Strikethrough', desc: 'Wrap in ~~strike~~' },
              { icon: '</>', label: 'Code', desc: 'Wrap in `backticks`' },
              { icon: 'H2', label: 'Heading', desc: 'Insert ## at line start' },
              { icon: '•', label: 'Bullet List', desc: 'Insert - at line start' },
              { icon: '🔗', label: 'Link', desc: 'Wrap as [text](url)' },
              { icon: '❝', label: 'Blockquote', desc: 'Insert > at line start' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/40">
                <span className="w-7 h-7 rounded-md bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-extrabold shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{item.label}</div>
                  <div className="text-[10px] text-zinc-400 truncate">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
            <h4 className="font-bold text-sm mb-2">Automatic Detection</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">The mobile toolbar appears automatically on screens narrower than 768px. No setup required — it adapts instantly when you switch between devices.</p>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
            <h4 className="font-bold text-sm mb-2">Full Undo Support</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">All toolbar actions integrate with Monaco&apos;s native undo stack. Tap Undo to reverse any formatting applied via the toolbar — everything is tracked seamlessly.</p>
          </div>
        </div>
      </div>
    )
  }
]

export default function Documentation({ onBack, onGoToEditor, onGoToGuide, theme, onToggleTheme }: { onBack: () => void, onGoToEditor: () => void, onGoToGuide: () => void, theme: 'light' | 'dark', onToggleTheme: () => void }) {
  const [activeSection, setActiveSection] = useState(DOCS[0].id)
  const isClickScrolling = useRef(false)

  const handleScrollTo = (id: string) => {
    isClickScrolling.current = true
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Allow observer to resume after the smooth scroll finishes
      setTimeout(() => { isClickScrolling.current = false }, 800)
    }
  }

  // Scroll-sync: observe which section is currently visible
  useEffect(() => {
    const sectionIds = DOCS.map(d => d.id)
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0d12] text-zinc-900 dark:text-zinc-100 font-[Inter,system-ui,sans-serif]">
      {/* Background Texture (same as Home for consistency) */}
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
            <img 
              src={theme === 'dark' ? "/bikdocs logo white.svg" : "/bikdocs logo dark.svg"} 
              alt="BikDocs" 
              className="h-10 w-auto" 
            />
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
              onClick={onGoToGuide}
              className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              title="Syntax Guide"
            >
              <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="hidden md:inline">Syntax Guide</span>
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
              className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-lg shadow-brand-500/25 transition-all active:scale-95"
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-32 space-y-1">
              {DOCS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleScrollTo(doc.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ease-out ${
                    activeSection === doc.id 
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 border border-transparent'
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
                    <span className="w-1.5 h-8 bg-brand-500 rounded-full" />
                    {doc.title}
                  </h2>
                  <div className="prose dark:prose-invert">
                    {doc.content}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-40 p-12 rounded-[32px] bg-brand-600 text-white text-center shadow-2xl shadow-brand-500/20">
               <h3 className="text-3xl font-bold mb-6">Ready to create?</h3>
               <p className="text-brand-100 mb-8 max-w-xs mx-auto">Start your first document today and see the precision for yourself.</p>
               <button 
                onClick={onGoToEditor}
                className="px-10 py-4 rounded-full bg-white text-brand-600 font-bold shadow-xl hover:bg-brand-50 transition-all active:scale-95"
               >
                Open Editor
               </button>
            </div>
          </main>
        </div>
      </div>

      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-10 relative z-10 bg-white dark:bg-[#0b0d12]">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onBack}
            >
               <img 
                 src={theme === 'dark' ? "/bikdocs logo white.svg" : "/bikdocs logo dark.svg"} 
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
