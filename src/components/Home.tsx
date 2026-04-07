import React, { useState } from 'react'
import Modal from './ui/Modal'
import Navbar from './ui/Navbar'
import '../styles/global.css'

interface Feature {
  icon: React.ReactNode
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: 'Real-time WYSIWYG Preview',
    desc: 'See your document exactly as it will appear when printed, with live updates as you type.'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Physical-page Layouts',
    desc: 'Support for A4, Letter, and Legal formats with accurate page breaks and pagination.'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656L17 13" />
      </svg>
    ),
    title: 'Custom Branding',
    desc: 'Upload your own HTML banners for professional headers and footers tailored to your brand.'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: 'Export PDF/Images',
    desc: 'High-fidelity export to PDF with clickable links, proper metadata, and optimized file sizes.'
  },
]

const STATS = [
  { label: 'Documents Created', value: '10k+' },
  { label: 'Active Users', value: '1M+' },
  { label: 'Uptime', value: '99.9%' },
  { label: 'Rating', value: '4.9/5' },
]

const DOC_TYPES = [
  { id: 'tech', label: 'Technical Doc', title: 'Technical Specifications', desc: 'Precision Markdown offers professional-grade formatting for developers and engineers.' },
  { id: 'creative', label: 'Creative Writing', title: 'Storyboarding & Scripts', desc: 'A clean interface that lets your creativity flow without technical distractions.' },
  { id: 'business', label: 'Business Reports', title: 'Annual Financial Overview', desc: 'Formal layouts and charts integration for your most important business data.' },
  { id: 'whitepaper', label: 'White Papers', title: 'Decentralized Intelligence', desc: 'Academic-level document structure with citations and complex table support.' },
]


export default function Home({ onGoToEditor, onGoToDocs, onGoToGuide, theme, onToggleTheme }: { onGoToEditor: () => void, onGoToDocs: () => void, onGoToGuide: () => void, theme: 'light' | 'dark', onToggleTheme: () => void }) {
  const [activeDocType, setActiveDocType] = useState(DOC_TYPES[0])
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'about' | null>(null)

  const renderModalContent = () => {
    switch (activeModal) {
      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Privacy Policy</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>Your privacy is paramount. BikDocs is designed as a local-first application, meaning your documents and data are stored directly on your device whenever possible.</p>
              <p>We do not sell, rent, or share your personal information with third parties. Any cloud-based features (like sharing or syncing) are explicitly opted-in and encrypted to ensure your work remains yours.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Primary storage is local to your browser.</li>
                <li>No tracking or invasive analytics are used.</li>
                <li>You maintain full ownership of all exported files.</li>
              </ul>
            </div>
          </div>
        )
      case 'terms':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Terms of Service</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>By using BikDocs, you agree to the following simple terms:</p>
              <ul className="list-decimal pl-6 space-y-2">
                <li><strong>Usage</strong>: The platform is provided "as is" for professional and personal documentation purposes.</li>
                <li><strong>Responsibility</strong>: You are responsible for the content you create and for maintaining backups of your critical documents.</li>
                <li><strong>Liability</strong>: While we strive for 100% accuracy in physical layouts, BikDocs is not liable for any discrepancies in printed or exported results.</li>
              </ul>
            </div>
          </div>
        )
      case 'about':
        return (
          <div className="space-y-6 text-center">
            <img 
              src={theme === 'dark' ? "/bikdocs logo white.svg" : "/bikdocs logo dark.svg"} 
              alt="BikDocs" 
              className="w-20 h-20 mx-auto mb-6 object-contain" 
            />
            <h2 className="text-2xl font-bold">About BikDocs</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              BikDocs was born out of frustration with existing Markdown editors that failed to understand physical page constraints. We believe that writing in plain text shouldn't mean sacrificing the beauty and precision of the final printed document.
            </p>
            <p className="text-sm text-zinc-500 mt-8">Version 2.0.4 • Built for Professionals</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0d12] text-zinc-900 dark:text-zinc-100 font-[Inter,system-ui,sans-serif] selection:bg-brand-100 dark:selection:bg-brand-900/30">
      {/* Background Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Main Grid */}
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(${theme === 'light' ? '#e5e7eb' : 'rgba(255,255,255,0.2)'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'light' ? '#e5e7eb' : 'rgba(255,255,255,0.2)'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Refined Central Glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-500/[0.08] dark:bg-brand-500/[0.15] rounded-full blur-[120px]" />
        <div className="absolute top-[5%] left-[45%] w-[400px] h-[400px] bg-brand-300/[0.05] dark:bg-brand-300/[0.1] rounded-full blur-[100px]" />

        {/* Bottom fade for the grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-transparent dark:to-[#0b0d12]" />
      </div>

      <Navbar 
        currentView="home"
        theme={theme}
        onToggleTheme={onToggleTheme}
        onGoToHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onGoToEditor={onGoToEditor}
        onGoToDocs={onGoToDocs}
        onGoToGuide={onGoToGuide}
      />

      <main className="relative z-10 pt-40">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800 text-brand-600 dark:text-brand-300 text-[11px] font-bold uppercase tracking-wider mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Beta Release 2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8 text-zinc-900 dark:text-white">
            Precision Markdown, <br />
            <span className="bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600 bg-clip-text text-transparent animate-gradient-x">
              Physical Results.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
            The only truly physical Markdown editor for professionals who demand perfect layouts and high-fidelity PDF results. Every pixel matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGoToEditor}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              Start Writing Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <button
              onClick={onGoToDocs}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              View Documentation
            </button>
          </div>
        </section>

        {/* Mockup */}
        <section className="max-w-6xl mx-auto px-6 mb-32 relative">
          <div className="absolute inset-0 bg-brand-500/10 blur-[120px] rounded-full -z-10" />
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden backdrop-blur-sm group">
            {/* Browser Header */}
            <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center px-6 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto bg-zinc-200 dark:bg-zinc-800 rounded-lg px-8 py-1 text-[10px] text-zinc-500 font-medium">
                bikdocs.in
              </div>
            </div>
            {/* Editor Content Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-[400px] md:h-[600px]">
              <div className="hidden md:block border-r border-zinc-200 dark:border-zinc-800 p-8 font-mono text-sm text-brand-600 dark:text-brand-400">
                <div className="opacity-50 space-y-2">
                  <div># Project Proposal</div>
                  <div className="text-zinc-400 dark:text-zinc-600 mt-4">## Executive Summary</div>
                  <div className="text-zinc-400 dark:text-zinc-600">This document outlines the strategic...</div>
                </div>
              </div>
              <div className="p-4 md:p-8 bg-zinc-50 dark:bg-zinc-950/50 flex items-center justify-center overflow-hidden">
                <div className="w-full max-w-sm mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 aspect-[1/1.41] p-6 md:p-8 transform scale-90 md:scale-100">
                  <h1 className="text-xl md:text-2xl font-bold mb-4">Project Proposal</h1>
                  <h2 className="text-md md:text-lg font-semibold mb-2">Executive Summary</h2>
                  <p className="text-[10px] md:text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    This document outlines the strategic initiatives for the upcoming fiscal year, focusing on market expansion and digital transformation.
                  </p>
                  <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[8px] md:text-[10px] text-zinc-400">
                    Proprietary & Confidential • Page 1
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 mb-40">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-4">Core Benefits</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white">Engineered for Document Perfection</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all hover:-translate-y-2">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h4 className="font-bold text-lg mb-4 text-zinc-900 dark:text-white">{f.title}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* High Fidelity Section */}
        <section className="max-w-7xl mx-auto px-6 mb-40 flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-8 text-zinc-900 dark:text-white">
              Write in plain text, <br />
              deliver in high-fidelity.
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
              Stop fighting with Word processors. Use the simplicity of Markdown to structure your thoughts, and let our engine handle the complex layout logic.
            </p>
            <ul className="space-y-4">
              {[
                'Export to production-ready PDF in one click',
                'Native support for SVGs and high-res images',
                'Perfect table rendering with auto-break support',
                'Consistent typography across all devices'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 font-medium">
                  <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full scale-110 md:scale-100">
            <div className="relative aspect-square bg-gradient-to-br from-brand-500/10 to-brand-300/10 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 bg-white/20 dark:bg-transparent backdrop-blur-3xl rounded-full border border-white dark:border-zinc-800" />
              <div className="relative w-2/3 h-3/4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 transform rotate-3 p-8 flex flex-col">
                <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 mb-2" />
                <div className="w-2/3 h-1 bg-zinc-100 dark:bg-zinc-800 mb-8" />
                <div className="flex-1 overflow-hidden">
                  <div className="w-full h-full bg-zinc-50 dark:bg-zinc-950/50 rounded-lg flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800">
                    <svg className="w-12 h-12 text-zinc-200 dark:text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-t border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-white/[0.02] mb-40">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {STATS.map((s, i) => (
                <div key={i}>
                  <div className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-2">{s.value}</div>
                  <div className="text-sm font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built for every doc type */}
        <section className="max-w-6xl mx-auto px-6 mb-40">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">Built for every document type</h3>
            <p className="text-zinc-500 dark:text-zinc-400">Flexibility without compromise for businesses, creatives, and technical writers.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 min-h-[400px]">
            <div className="w-full md:w-72 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar pb-4 md:pb-0">
              {DOC_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveDocType(type)}
                  className={`flex-1 text-left px-6 py-4 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${activeDocType.id === type.id
                      ? 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-brand-600 dark:text-white'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-[32px] border border-zinc-100 dark:border-zinc-800 p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <h4 className="text-2xl font-extrabold mb-4 text-zinc-900 dark:text-white">{activeDocType.title}</h4>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10">
                {activeDocType.desc}
              </p>
              <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 font-mono text-sm overflow-x-auto">
                <div className="flex gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="space-y-2 opacity-80">
                  <div className="text-brand-500">export default function</div>
                  <div className="pl-4 text-zinc-400">return document.create(&apos;{activeDocType.id}&apos;);</div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>

      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-20 relative z-10 bg-white dark:bg-[#0b0d12]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1">
              <div 
                className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <img 
                  src={theme === 'dark' ? "/bikdocs logo white.svg" : "/bikdocs logo dark.svg"} 
                  alt="BikDocs" 
                  className="h-10 w-auto" 
                />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                The premium physical Markdown editor for professionals who demand results.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-zinc-400">Product</h5>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-white transition-colors">Editor</a></li>
                <li className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400 dark:text-zinc-600 cursor-not-allowed">Pricing</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/50 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter">Soon</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400 dark:text-zinc-600 cursor-not-allowed">Templates</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/50 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter">Soon</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-zinc-400">Resources</h5>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={onGoToDocs}
                    className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button
                    onClick={onGoToGuide}
                    className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    Syntax Guide
                  </button>
                </li>
                <li><a href="#" className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-white transition-colors">API Ref</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-zinc-400">Company</h5>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => setActiveModal('about')}
                    className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('privacy')}
                    className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    Privacy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('terms')}
                    className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    Terms
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-zinc-400">&copy; 2026 BikDocs. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-zinc-400 hover:text-brand-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-indigo-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <Modal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        maxWidthClass={activeModal === 'about' ? 'max-w-[400px]' : 'max-w-[500px]'}
      >
        {renderModalContent()}
      </Modal>
    </div>
  )
}
