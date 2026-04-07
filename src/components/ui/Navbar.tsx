import React from 'react'

interface NavbarProps {
  currentView: 'home' | 'documentation' | 'markdown-guide'
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onGoToHome: () => void
  onGoToEditor: () => void
  onGoToDocs: () => void
  onGoToGuide: () => void
}

export default function Navbar({
  currentView,
  theme,
  onToggleTheme,
  onGoToHome,
  onGoToEditor,
  onGoToDocs,
  onGoToGuide
}: NavbarProps) {
  return (
    <nav className="fixed top-6 left-6 right-6 z-50 bg-white/70 dark:bg-[#0b0d12]/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/50 rounded-2xl shadow-lg max-w-7xl mx-auto transition-all duration-300">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onGoToHome}>
          <img 
            src={theme === 'dark' ? "/bikdocs logo white.svg" : "/bikdocs logo dark.svg"} 
            alt="BikDocs" 
            className="h-12 w-auto transition-transform group-hover:scale-110" 
          />
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={onGoToDocs}
            className={`text-sm font-bold transition-all ${
              currentView === 'documentation' 
                ? 'text-brand-600 dark:text-brand-400' 
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            Features
          </button>
          <button
            onClick={onGoToGuide}
            className={`text-sm font-bold transition-all ${
              currentView === 'markdown-guide' 
                ? 'text-brand-600 dark:text-brand-400' 
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            Syntax Guide
          </button>
          <div className="relative group/link">
            <span className="text-sm font-bold text-zinc-400 dark:text-zinc-600 cursor-not-allowed">Templates</span>
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover/link:opacity-100 transition-all duration-200 whitespace-nowrap">
              Coming Soon
            </span>
          </div>
          <div className="relative group/link">
            <span className="text-sm font-bold text-zinc-400 dark:text-zinc-600 cursor-not-allowed">Pricing</span>
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover/link:opacity-100 transition-all duration-200 whitespace-nowrap">
              Coming Soon
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
            title="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>
          <button
            onClick={onGoToEditor}
            className="px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-all active:scale-95 shadow-lg shadow-brand-500/20"
          >
            Start Writing
          </button>
        </div>
      </div>
    </nav>
  )
}
