import React, { useState } from 'react'

interface MobileEditorBarProps {
  editorRef: React.RefObject<any>
}

export default function MobileEditorBar({ editorRef }: MobileEditorBarProps) {
  const [showMore, setShowMore] = useState(false)

  const getEditor = () => editorRef.current

  const selectAll = () => {
    const editor = getEditor()
    if (!editor) return
    const model = editor.getModel()
    if (!model) return
    const lineCount = model.getLineCount()
    const lastLineLength = model.getLineLength(lineCount)
    editor.setSelection({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: lineCount,
      endColumn: lastLineLength + 1
    })
    editor.focus()
  }

  const undo = () => {
    const editor = getEditor()
    if (!editor) return
    editor.trigger('mobile-toolbar', 'undo', null)
    editor.focus()
  }

  const redo = () => {
    const editor = getEditor()
    if (!editor) return
    editor.trigger('mobile-toolbar', 'redo', null)
    editor.focus()
  }

  const wrapSelection = (prefix: string, suffix: string) => {
    const editor = getEditor()
    if (!editor) return
    const selection = editor.getSelection()
    const model = editor.getModel()
    if (!selection || !model) return

    const selectedText = model.getValueInRange(selection)
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`

    editor.executeEdits('mobile-toolbar', [{
      range: selection,
      text: replacement,
      forceMoveMarkers: true
    }])
    editor.focus()
  }

  const insertAtLineStart = (prefix: string) => {
    const editor = getEditor()
    if (!editor) return
    const selection = editor.getSelection()
    if (!selection) return

    const lineNumber = selection.startLineNumber
    editor.executeEdits('mobile-toolbar', [{
      range: {
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: 1
      },
      text: prefix,
      forceMoveMarkers: true
    }])
    editor.focus()
  }

  const btnClass = "flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 active:scale-90 active:bg-brand-100 dark:active:bg-brand-500/20 transition-all border-none cursor-pointer shrink-0"
  const btnActiveClass = "flex items-center justify-center w-9 h-9 rounded-lg bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 active:scale-90 transition-all border-none cursor-pointer shrink-0"

  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white dark:bg-[#1a1c23] border-b border-gray-200 dark:border-[#2d3139] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Core actions */}
      <button className={btnClass} onClick={selectAll} title="Select All">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 12h8M12 8v8" strokeWidth="0" />
          <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" fontWeight="bold">A</text>
        </svg>
      </button>

      <button className={btnClass} onClick={undo} title="Undo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>

      <button className={btnClass} onClick={redo} title="Redo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      </button>

      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 shrink-0" />

      {/* Formatting */}
      <button className={btnClass} onClick={() => wrapSelection('**', '**')} title="Bold">
        <span className="text-sm font-extrabold">B</span>
      </button>

      <button className={btnClass} onClick={() => wrapSelection('*', '*')} title="Italic">
        <span className="text-sm font-bold italic">I</span>
      </button>

      <button className={btnClass} onClick={() => wrapSelection('~~', '~~')} title="Strikethrough">
        <span className="text-sm font-bold line-through">S</span>
      </button>

      <button className={btnClass} onClick={() => wrapSelection('`', '`')} title="Inline Code">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </button>

      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 shrink-0" />

      {/* Structure */}
      <button className={btnClass} onClick={() => insertAtLineStart('## ')} title="Heading">
        <span className="text-xs font-extrabold">H2</span>
      </button>

      <button className={btnClass} onClick={() => insertAtLineStart('- ')} title="Bullet List">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="4" cy="6" r="1" fill="currentColor" />
          <circle cx="4" cy="12" r="1" fill="currentColor" />
          <circle cx="4" cy="18" r="1" fill="currentColor" />
        </svg>
      </button>

      <button className={btnClass} onClick={() => wrapSelection('[', '](url)')} title="Link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>

      <button className={btnClass} onClick={() => insertAtLineStart('> ')} title="Quote">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
        </svg>
      </button>
    </div>
  )
}
