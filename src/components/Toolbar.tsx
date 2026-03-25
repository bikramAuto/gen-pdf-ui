import React, { useState, useRef, useEffect } from 'react'
import type { User } from '../api/users'
import type { PDFConfig } from '../types/pdf'
import Modal from './ui/Modal'

interface ToolbarProps {
  theme: 'dark' | 'light'
  isDirty: boolean
  fileName: string
  onNew: () => void
  onOpen: () => void
  onDownload: () => void
  onDownloadPDF: () => void
  onInsertImage: () => void
  onToggleTheme: () => void
  onInsertPageBreak: () => void
  showPDFTimestamp: boolean
  onTogglePDFTimestamp: () => void
  showPageNumbers: boolean
  onTogglePageNumbers: () => void
  pdfConfig: PDFConfig
  onUpdatePDFConfig: (config: Partial<PDFConfig>) => void
  activeTab: 'editor' | 'preview'
  onTabChange: (tab: 'editor' | 'preview') => void
  isEditorCollapsed: boolean
  onToggleEditor: () => void

  onOpenAuth: (mode: 'signin' | 'signup') => void
  user: User | null
  onLogout: () => void
  onSaveDocument: () => void
  onSaveDocumentSnapshot: () => void
  onSaveTemplate: () => void
  onSaveTemplateAs: () => void
  isSaving: boolean
  templateId: string | null
  documentId: string | null
  onOpenTemplates: () => void
  onOpenDocuments: () => void
  onOpenLayout: () => void
}

export default function Toolbar({
  theme,
  isDirty,
  fileName,
  onNew,
  onOpen,
  onDownload,
  onDownloadPDF,
  onInsertImage,
  onToggleTheme,
  onInsertPageBreak,
  showPDFTimestamp,
  onTogglePDFTimestamp,
  showPageNumbers,
  onTogglePageNumbers,
  pdfConfig,
  onUpdatePDFConfig,
  activeTab,
  onTabChange,
  isEditorCollapsed,
  onToggleEditor,

  onOpenAuth,
  user,
  onLogout,
  onSaveDocument,
  onSaveDocumentSnapshot,
  onSaveTemplate,
  onSaveTemplateAs,
  isSaving,
  templateId,
  documentId,
  onOpenTemplates,
  onOpenDocuments,
  onOpenLayout,
}: ToolbarProps) {

  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [formatOpen, setFormatOpen] = useState(false)
  const [orientOpen, setOrientOpen] = useState(false)
  const [marginOpen, setMarginOpen] = useState(false)
  const [hubOpen, setHubOpen] = useState(false)

  const profileMenuRef = useRef<HTMLDivElement>(null)
  const layoutRef = useRef<HTMLDivElement>(null)
  const formatRef = useRef<HTMLDivElement>(null)
  const orientRef = useRef<HTMLDivElement>(null)
  const marginRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false)
      }
      if (formatOpen && formatRef.current && !formatRef.current.contains(e.target as Node)) {
        setFormatOpen(false)
      }
      if (orientOpen && orientRef.current && !orientRef.current.contains(e.target as Node)) {
        setOrientOpen(false)
      }
      if (marginOpen && marginRef.current && !marginRef.current.contains(e.target as Node)) {
        setMarginOpen(false)
      }
      if (hubOpen && hubRef.current && !hubRef.current.contains(e.target as Node)) {
        setHubOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [profileMenuOpen, formatOpen, orientOpen, marginOpen, hubOpen])

  const btnBase = "flex items-center justify-center gap-1.5 h-9 px-1.5 sm:px-2.5 rounded-lg cursor-pointer border border-transparent bg-transparent text-gray-600 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white active:scale-95 shrink-0"

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between h-auto md:h-14 px-1.5 md:px-5 bg-white dark:bg-[#1a1c23] border-b border-gray-200 dark:border-[#2d3139] shrink-0 relative z-50 gap-1.5 md:gap-4 py-1.5 md:py-0">

      {/* TOP ROW (Mobile) / Branding + Nav + Account (Desktop) */}
      <div className="flex items-center justify-between md:contents order-first pb-1 md:pb-0">
        {/* CENTER-ISH (Tabs & Title) */}
        <div className="flex flex-col items-start min-w-0 md:mx-4 flex-1">
          <div className="flex items-center gap-1.5">
            {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_6px_rgba(245,158,11,0.6)]" title="Unsaved changes" />}
            <span className="text-sm font-semibold text-gray-800 dark:text-white truncate max-w-[100px] xs:max-w-[150px] md:max-w-[200px]">{fileName}</span>
          </div>
          {/* Mobile Tabs */}
          <div className="flex md:hidden bg-gray-100 dark:bg-white/5 p-0.5 rounded-md mt-1 shrink-0">
            <button
              className={`px-3 py-0.5 text-[10px] font-semibold rounded border-none cursor-pointer transition-all ${activeTab === 'editor' ? 'bg-white dark:bg-[#2d3139] text-blue-600 dark:text-blue-400 shadow-sm' : 'bg-transparent text-gray-500 dark:text-gray-400'}`}
              onClick={() => onTabChange('editor')}
            >Edit</button>
            <button
              className={`px-3 py-0.5 text-[10px] font-semibold rounded border-none cursor-pointer transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-[#2d3139] text-blue-600 dark:text-blue-400 shadow-sm' : 'bg-transparent text-gray-500 dark:text-gray-400'}`}
              onClick={() => onTabChange('preview')}
            >Preview</button>
          </div>
        </div>

        {/* RIGHT (Actions & Profile) */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0 ml-2">
          <div className="relative flex items-center" ref={hubRef}>
            <button
              className={`h-8 md:h-9 px-3 md:px-5 flex items-center gap-2 rounded-lg shadow-sm border-none cursor-pointer font-bold text-[11px] md:text-[13px] transition-all
                ${documentId
                  ? 'bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 text-white'
                  : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 text-white'}
                ${isSaving ? 'animate-pulse pointer-events-none' : ''}
                ${!user ? 'opacity-40' : ''}`}
              onClick={() => setHubOpen(prev => !prev)}
              disabled={!user || isSaving}
            >
              {isSaving ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : <IconSave />}
              <span className="hidden sm:inline">Save</span>
              <span className="sm:hidden text-[10px]">Save</span>
              <div className="ml-1 opacity-60">
                <IconChevronDown />
              </div>
            </button>

            {/* THE ACTION HUB DROPDOWN */}
            {/* THE ACTION HUB MODAL */}
            <Modal isOpen={hubOpen} onClose={() => setHubOpen(false)} maxWidthClass="max-w-[340px]" zIndex={10002}>
              <div className="flex flex-col">
                <div className="mb-4 text-center">
                  <h3 className="text-[18px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Save & Export</h3>
                  <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium">Choose how you'd like to save your work</p>
                </div>

                {/* Section: Download Locally */}
                <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <IconDownload size={10} />
                  Download to local
                </div>
                <button
                  className="flex items-center gap-3 w-full px-3 py-2 border-none bg-transparent rounded-lg cursor-pointer text-gray-800 dark:text-white text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
                  onClick={() => { onDownload(); setHubOpen(false) }}
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <IconFileText />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold">Markdown File</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">Best for further editing</span>
                  </div>
                </button>
                <button
                  className="flex items-center gap-3 w-full px-3 py-2 border-none bg-transparent rounded-lg cursor-pointer text-gray-800 dark:text-white text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
                  onClick={() => { onDownloadPDF(); setHubOpen(false) }}
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <IconPDF />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold">PDF Document</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">Best for sharing or printing</span>
                  </div>
                </button>

                <div className="h-px bg-gray-100 dark:bg-zinc-800/50 my-2 mx-2" />

                {/* Section: Template Library */}
                <div className="px-3 pt-1 pb-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <IconLayout size={10} />
                  Template Library
                </div>
                <button
                  className="flex items-center gap-3 w-full px-3 py-2 border-none bg-transparent rounded-lg cursor-pointer text-gray-800 dark:text-white text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
                  onClick={() => { templateId ? onSaveTemplate() : onSaveTemplateAs(); setHubOpen(false) }}
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    {templateId ? <IconCloud /> : <IconCopy />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold">
                      {templateId ? 'Sync Template' : 'Snapshot'}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                      {templateId ? 'Sync layout changes' : 'Save layout as snapshot'}
                    </span>
                  </div>
                </button>

                <div className="h-px bg-gray-100 dark:bg-zinc-800/50 my-2 mx-2" />

                {/* Section: Project Content */}
                <div className="px-3 pt-1 pb-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <IconFile size={10} />
                  Project Content
                </div>
                <button
                  className="flex items-center gap-3 w-full px-3 py-2 border-none bg-transparent rounded-lg cursor-pointer text-gray-800 dark:text-white text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
                  onClick={() => { onSaveDocument(); setHubOpen(false); }}
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    {documentId ? <IconCloud /> : <IconSave />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold">
                      {documentId ? 'Sync' : 'Snapshot'}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                      {documentId ? 'Sync your changes' : 'Save a copy or new version'}
                    </span>
                  </div>
                </button>
              </div>
            </Modal>
          </div>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 hidden md:block" />

          <div className="relative" ref={profileMenuRef}>
            <button
              className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full cursor-pointer transition-all hover:ring-2 hover:ring-blue-500/40 active:scale-95 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm border-none overflow-hidden"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              title={user ? `Logged in as ${user.name}` : "Profile & Settings"}
            >
              {user ? (
                <span className="text-[10px] md:text-sm font-bold uppercase">{user.name.charAt(0)}</span>
              ) : (
                <span className="text-[10px] md:text-sm font-bold">U</span>
              )}
            </button>

            {/* PROFILE MENU MODAL */}
            <Modal isOpen={profileMenuOpen} onClose={() => setProfileMenuOpen(false)} maxWidthClass="max-w-[320px]" zIndex={10002}>
              <div className="flex flex-col w-full px-1">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-800/50 mt-1 mb-4 text-center pb-4">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Account</p>
                  {user ? (
                    <>
                      <p className="text-[15px] font-bold text-gray-900 dark:text-white truncate tracking-tight">{user.name}</p>
                      <p className="text-[12px] opacity-70 text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </>
                  ) : (
                    <p className="text-[14px] font-bold text-gray-900 dark:text-white truncate mb-1">Guest Session</p>
                  )}
                </div>

                <div className="space-y-1 mb-2">
                  <button
                    className="flex items-center gap-3 w-full px-3 py-2.5 border-none bg-transparent rounded-[12px] cursor-pointer text-gray-800 dark:text-white text-left hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                    onClick={() => { onToggleTheme(); }}
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:text-yellow-500 transition-colors">
                      {theme === 'dark' ? <IconSun /> : <IconMoon />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">Switch appearance</span>
                    </div>
                  </button>
                </div>

                <div className="h-px bg-gray-100 dark:bg-zinc-800/50 my-3 mx-2" />

                <div className="space-y-1">
                  {!user ? (
                    <>
                      <button
                        className="flex items-center gap-3 w-full px-3 py-2.5 border-none bg-transparent rounded-[12px] cursor-pointer text-gray-800 dark:text-white text-left hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                        onClick={() => { setProfileMenuOpen(false); onOpenAuth('signin'); }}
                      >
                        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          <IconSignIn />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold">Sign In</span>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500">Access your account</span>
                        </div>
                      </button>

                      <button
                        className="flex items-center gap-3 w-full px-3 py-2.5 border-none bg-transparent rounded-[12px] cursor-pointer text-gray-800 dark:text-white text-left hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                        onClick={() => { setProfileMenuOpen(false); onOpenAuth('signup'); }}
                      >
                        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <IconSignUp />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold">Sign Up</span>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500">Create new account</span>
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="flex items-center gap-3 w-full px-3 py-2.5 border-none bg-transparent rounded-[12px] cursor-pointer text-gray-800 dark:text-white text-left hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                        onClick={() => { setProfileMenuOpen(false); onOpenTemplates(); }}
                      >
                        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          <IconCloud />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold">My Templates</span>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500">Load layout from templates</span>
                        </div>
                      </button>

                      <button
                        className="flex items-center gap-3 w-full px-3 py-2.5 border-none bg-transparent rounded-[12px] cursor-pointer text-gray-800 dark:text-white text-left hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                        onClick={() => { setProfileMenuOpen(false); onOpenDocuments(); }}
                      >
                        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          <IconFile />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold">My Documents</span>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500">Access your saved files</span>
                        </div>
                      </button>

                      <div className="h-px bg-gray-100 dark:bg-zinc-800/50 my-3 mx-2" />

                      <button
                        className="flex items-center gap-3 w-full px-3 py-2.5 border-none bg-transparent rounded-[12px] cursor-pointer text-red-600 dark:text-red-400 text-left hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                        onClick={() => { setProfileMenuOpen(false); onLogout(); }}
                      >
                        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-red-50 dark:bg-red-500/5 text-red-500 transition-colors">
                          <IconSignOut />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold">Log Out</span>
                          <span className="text-[11px] opacity-70">Sign out of session</span>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW (Mobile) / Actions (Desktop) */}
      <div className="relative flex items-center shrink min-w-0 order-last md:order-first border-t border-gray-100 dark:border-gray-800 md:border-none pt-1 md:pt-0">
        <div className="flex items-center gap-0.5 md:gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="hidden md:flex items-center text-blue-600 dark:text-blue-400 mr-2 md:mr-3">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="2" y="4" width="20" height="16" rx="4" fill="currentColor" opacity="0.15" />
              <path d="M6 8h12M6 12h8M6 16h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>

          <button
            className={`${btnBase} hidden md:flex ${isEditorCollapsed ? '!text-blue-600 dark:!text-blue-400 !bg-blue-50 dark:!bg-blue-500/10' : ''}`}
            onClick={onToggleEditor}
          >
            <IconSidebar collapsed={isEditorCollapsed} />
          </button>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5 hidden md:block" />

          <button className={btnBase} onClick={onNew} title="New Document">
            <IconNew />
            <span className="hidden lg:inline text-xs font-medium">New</span>
          </button>

          <button className={btnBase} onClick={onOpen} title="Open Locally">
            <IconOpen />
            <span className="hidden lg:inline text-xs font-medium">Open</span>
          </button>

          <button className={btnBase} onClick={onOpenLayout} title="Layout Settings">
            <IconLayout />
            <span className="hidden lg:inline text-xs font-medium">Layout</span>
          </button>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />


          <button className={btnBase} onClick={onInsertImage} title="Insert Image">
            <IconImage />
            <span className="hidden lg:inline text-xs font-medium">Image</span>
          </button>

          <button className={btnBase} onClick={onInsertPageBreak} title="Insert Page Break">
            <IconPageBreak />
            <span className="hidden lg:inline text-xs font-medium">Break</span>
          </button>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

          <button
            className={`${btnBase} ${showPDFTimestamp ? '!text-blue-600 dark:!text-blue-400 !bg-blue-50 dark:!bg-blue-500/10 shadow-inner' : ''}`}
            onClick={onTogglePDFTimestamp}
            title="Toggle PDF Timestamp"
          >
            <IconClock />
            <span className="hidden lg:inline text-xs font-medium">Timestamp</span>
          </button>

          <button
            className={`${btnBase} ${showPageNumbers ? '!text-blue-600 dark:!text-blue-400 !bg-blue-50 dark:!bg-blue-500/10 shadow-inner' : ''}`}
            onClick={onTogglePageNumbers}
            title="Toggle PDF Page Numbers"
          >
            <IconHash />
            <span className="hidden lg:inline text-xs font-medium">Page #</span>
          </button>


        </div>

        {/* Action Controls (Fixed position to prevent clipping) */}
        <div className="flex items-center shrink-0 pr-1 md:pr-0">
          {/* Mobile Template Icons */}
          <div className="flex xl:hidden items-center gap-0.5 md:gap-1.5 ml-1">
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

            {/* Format Icon */}
            <div className="relative" ref={formatRef}>
              <button
                className={`${btnBase} ${formatOpen ? '!text-blue-600 dark:!text-blue-400 !bg-blue-50 dark:!bg-blue-500/10' : ''}`}
                onClick={() => { setFormatOpen(!formatOpen); setOrientOpen(false); setMarginOpen(false); }}
                title="Page Size"
              >
                <IconPageSize />
              </button>
              {formatOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-32 bg-white dark:bg-[#1e2028] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-2 z-[9999] animate-in fade-in slide-in-from-top-2">
                  {['a4', 'letter', 'legal'].map(s => (
                    <button
                      key={s}
                      className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase rounded-lg transition-colors ${pdfConfig.format === s ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      onClick={() => { onUpdatePDFConfig({ format: s as any }); setFormatOpen(false); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Orientation Icon */}
            <div className="relative" ref={orientRef}>
              <button
                className={`${btnBase} ${orientOpen ? '!text-blue-600 dark:!text-blue-400 !bg-blue-50 dark:!bg-blue-500/10' : ''}`}
                onClick={() => { setOrientOpen(!orientOpen); setFormatOpen(false); setMarginOpen(false); }}
                title="Page Orientation"
              >
                <IconRotate />
              </button>
              {orientOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-32 bg-white dark:bg-[#1e2028] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-2 z-[9999] animate-in fade-in slide-in-from-top-2">
                  {['portrait', 'landscape'].map(o => (
                    <button
                      key={o}
                      className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase rounded-lg transition-colors ${pdfConfig.orientation === o ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      onClick={() => { onUpdatePDFConfig({ orientation: o as any }); setOrientOpen(false); }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Margin Icon */}
            <div className="relative" ref={marginRef}>
              <button
                className={`${btnBase} ${marginOpen ? '!text-blue-600 dark:!text-blue-400 !bg-blue-50 dark:!bg-blue-500/10' : ''}`}
                onClick={() => { setMarginOpen(!marginOpen); setFormatOpen(false); setOrientOpen(false); }}
                title="Page Margin"
              >
                <IconMargin />
              </button>
              {marginOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-32 bg-white dark:bg-[#1e2028] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-2 z-[9999] animate-in fade-in slide-in-from-top-2">
                  {[0.2, 0.5, 0.8, 1.0].map(m => (
                    <button
                      key={m}
                      className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase rounded-lg transition-colors ${pdfConfig.margin === m ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      onClick={() => { onUpdatePDFConfig({ margin: m }); setMarginOpen(false); }}
                    >
                      {m.toFixed(1)} in
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Template Selects (Merged into the main flow for desktop) */}   <div className="hidden xl:flex items-center gap-1.5 ml-1">
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-md px-2 py-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Size</span>
              <select
                className="bg-transparent border-none text-gray-800 dark:text-gray-200 text-xs font-medium outline-none cursor-pointer dark:[color-scheme:dark]"
                value={pdfConfig.format}
                onChange={(e) => onUpdatePDFConfig({ format: e.target.value as any })}
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </div>

            <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-md px-2 py-1">
              <select
                className="bg-transparent border-none text-gray-800 dark:text-gray-200 text-xs font-medium outline-none cursor-pointer dark:[color-scheme:dark]"
                value={pdfConfig.orientation}
                onChange={(e) => onUpdatePDFConfig({ orientation: e.target.value as any })}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-md px-2 py-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Margin</span>
              <select
                className="bg-transparent border-none text-gray-800 dark:text-gray-200 text-xs font-medium outline-none cursor-pointer dark:[color-scheme:dark]"
                value={pdfConfig.margin}
                onChange={(e) => onUpdatePDFConfig({ margin: parseFloat(e.target.value) })}
              >
                <option value="0.2">0.2 in</option>
                <option value="0.5">0.5 in</option>
                <option value="0.8">0.8 in</option>
                <option value="1.0">1.0 in</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#1a1c23] to-transparent md:hidden" />
      </div>
    </div>
  )
}

/* ── Icons ── */

function IconChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconNew() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  )
}

function IconOpen() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconImage() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function IconPageBreak() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M4 12h16" strokeDasharray="4 2" />
      <path d="M14 2v6h6" />
    </svg>
  )
}

function IconSave() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

function IconCloud() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.1-3.9-4.5-.4-3.5-3.4-6-6.1-6-2.1 0-4 1.4-4.8 3.4-2.1.4-3.7 2.2-3.7 4.5 0 2.5 2 4.5 4.5 4.5h10.5M12 12v6M9 15l3 3 3-3" />
    </svg>
  )
}

function IconSaveAs() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v6" />
      <polyline points="7 3 7 8 15 8" />
      <path d="M17 17l3 3m0-3l-3 3" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconHash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconDownload({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function IconPDF() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15h2" />
      <path d="M9 11h2" />
      <path d="M9 19h2" />
    </svg>
  )
}

function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function IconSignIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  )
}

function IconSignUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  )
}

function IconSignOut() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}

function IconHTML({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13v4" />
      <path d="M12 13v4" />
      <path d="M16 13v4" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  )
}

function IconRotate() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  )
}

function IconMargin() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 7h10v10H7z" opacity="0.3" />
      <path d="M7 12h10M12 7v10" />
    </svg>
  )
}

function IconPageSize() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22h6M4 12h16" opacity="0.3" />
    </svg>
  )
}

function IconLayout({ size = 15 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-panel-top"><rect width="18" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /></svg>
  )
}

function IconSidebar({ collapsed }: { collapsed?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      {!collapsed && <line x1="9" y1="3" x2="9" y2="21" />}
    </svg>
  )
}

function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function IconFile({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function IconFileText() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1V11a2 2 0 0 1-2-2 2 2 0 0 1 2-2v.09a1.65 1.65 0 0 0 1-1.51 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2v-.09a1.65 1.65 0 0 0-1-1.51z" />
    </svg>
  )
}
