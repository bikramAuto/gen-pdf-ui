import React from 'react'
import Modal from './Modal'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export default function ErrorModal({
  isOpen,
  onClose,
  title,
  message,
  actionLabel = 'Close',
  onAction
}: ErrorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-[400px]" zIndex={20000}>
      <div className="text-center py-4 relative z-10">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        
        <h3 className="text-[22px] font-semibold text-zinc-900 dark:text-white mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">
          {message}
        </p>

        <button
          onClick={onAction || onClose}
          className="w-full h-[52px] rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all shadow-md dark:shadow-none"
        >
          {actionLabel}
        </button>
      </div>
    </Modal>
  )
}
