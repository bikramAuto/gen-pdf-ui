import React, { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  maxWidthClass?: string
  zIndex?: number
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidthClass = 'max-w-[420px]',
  zIndex = 10001
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 flex items-center justify-center px-4 font-ui`} style={{ zIndex }}>
      <div 
        className="absolute inset-0 bg-zinc-900/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      <div className={`relative w-full ${maxWidthClass} rounded-[32px] p-[1px] animate-modal-enter shadow-2xl`}>
        {/* Glow behind the modal border - Nature theme green tints */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-300/40 via-white/50 to-zinc-200/50 dark:from-brand-500/20 dark:via-zinc-800/20 dark:to-zinc-900/50 rounded-[32px]" />
        
        <div className="relative bg-white/95 dark:bg-[#0F1115]/95 backdrop-blur-[40px] rounded-[31px] p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col max-h-[90vh] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-none border border-black/5 dark:border-none">
          {/* Top-left brand green orb */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-400/20 dark:bg-brand-500/15 blur-[60px] rounded-full pointer-events-none" />
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-brand-600 dark:text-zinc-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors z-[60]"
            title="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {children}
        </div>
      </div>
    </div>
  )
}
