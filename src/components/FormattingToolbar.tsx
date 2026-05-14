import React from 'react'

interface FormattingToolbarProps {
  editorRef: React.RefObject<any>
}

export default function FormattingToolbar({ editorRef }: FormattingToolbarProps) {
  const getEditor = () => editorRef.current

  const wrapSelection = (prefix: string, suffix: string) => {
    const editor = getEditor()
    if (!editor) return
    const selection = editor.getSelection()
    const model = editor.getModel()
    if (!selection || !model) return

    const selectedText = model.getValueInRange(selection)
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`

    editor.executeEdits('toolbar-formatting', [{
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
    editor.executeEdits('toolbar-formatting', [{
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

  const btnClass = "flex items-center justify-center h-8 px-3 rounded-md bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all border-none cursor-pointer shrink-0 text-[11px] font-bold tracking-tight active:scale-95"

  return (
    <div className="hidden lg:flex items-center justify-center gap-1 px-4 py-1.5 bg-gray-50/50 dark:bg-[#1a1c23]/50 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-[50]">
      <button className={btnClass} onClick={() => wrapSelection('**', '**')} title="Bold (Ctrl+B)">
        <span className="font-extrabold uppercase">Bold</span>
      </button>

      <button className={btnClass} onClick={() => wrapSelection('*', '*')} title="Italic (Ctrl+I)">
        <span className="italic uppercase">Italic</span>
      </button>

      <button className={btnClass} onClick={() => wrapSelection('~~', '~~')} title="Strikethrough">
        <span className="line-through uppercase">Strike</span>
      </button>

      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-1" />

      <button className={btnClass} onClick={() => insertAtLineStart('# ')} title="Heading 1">
        <span className="uppercase font-extrabold">H1</span>
      </button>

      <button className={btnClass} onClick={() => insertAtLineStart('## ')} title="Heading 2">
        <span className="uppercase font-extrabold">H2</span>
      </button>

      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-1" />

      <button className={btnClass} onClick={() => insertAtLineStart('- ')} title="Bullet List">
        <span className="uppercase">List</span>
      </button>

      <button className={btnClass} onClick={() => insertAtLineStart('1. ')} title="Numbered List">
        <span className="uppercase">Number</span>
      </button>

      <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-1" />

      <button className={btnClass} onClick={() => wrapSelection('[', '](url)')} title="Link">
        <span className="uppercase underline decoration-brand-500/50 underline-offset-2">Link</span>
      </button>

      <button className={btnClass} onClick={() => insertAtLineStart('> ')} title="Quote">
        <span className="uppercase">Quote</span>
      </button>
      
      <button className={btnClass} onClick={() => wrapSelection('`', '`')} title="Inline Code">
        <span className="uppercase font-mono">Code</span>
      </button>
    </div>
  )
}
