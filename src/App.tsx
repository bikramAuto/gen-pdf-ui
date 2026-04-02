import { useState, useEffect, useCallback, useRef } from 'react'
import Toolbar from './components/Toolbar'
import Editor from './components/Editor'
import MobileEditorBar from './components/MobileEditorBar'
import Preview from './components/Preview'
import StatusBar from './components/StatusBar'
import AuthModal from './components/AuthModal'
import SetPassword from './components/SetPassword'
import { ToastContainer, useToast } from './components/Toast'
import { User } from './api/users'
import { createTemplate, updateTemplate, getTemplates, getTemplateById, SavedTemplate, TemplatePayload, TemplateListItem } from './api/templates'
import { createDocument, updateDocument, STATUS, DocumentPayload, getDocuments, DocumentListItem, FullDocument } from './api/documents'
import { compressImage, storeImage, deleteImage, getAllHashes } from './utils/imageStorage'
import { PDFConfig, PDFFormat, PDFOrientation } from './types/pdf'
import { printPDF } from './utils/pdfUtils'
import Modal from './components/ui/Modal'
import { dpopManager } from './utils/dpop'

import './styles/global.css'

const DEFAULT_CONTENT = ``;

type Theme = 'dark' | 'light'


export default function App({ onGoToHome, theme, onToggleTheme }: { onGoToHome?: () => void, theme: 'light' | 'dark', onToggleTheme: () => void }) {
  useEffect(() => {
    dpopManager.init();
  }, []);

  const queryParams = new URLSearchParams(window.location.search)
  const isSetPasswordView = queryParams.has('id')

  const [content, setContent] = useState(() => localStorage.getItem('editorContent') || DEFAULT_CONTENT)
  const [fileName, setFileName] = useState(() => localStorage.getItem('editorFileName') || 'Untitled.md')
  const [isDirty, setIsDirty] = useState(false)
  const [splitPos, setSplitPos] = useState(() => Number(localStorage.getItem('editorSplitPos')) || 50)
  const [showPDFTimestamp, setShowPDFTimestamp] = useState(() => localStorage.getItem('editorShowPDFTimestamp') !== 'false')
  const [showPageNumbers, setShowPageNumbers] = useState(() => localStorage.getItem('editorShowPageNumbers') !== 'false')
  const [pdfConfig, setPdfConfig] = useState<PDFConfig>(() => {
    const saved = localStorage.getItem('editorPdfConfig')
    return saved ? JSON.parse(saved) : {
      format: 'a4',
      orientation: 'portrait',
      margin: 0.5,
      headerText: '',
      footerText: ''
    }
  })
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(() => localStorage.getItem('editorIsEditorCollapsed') === 'true')

  // Modal State
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [tempFileName, setTempFileName] = useState('')
  const [pendingAction, setPendingAction] = useState<'md' | 'pdf' | null>(null)

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  // Banner State
  const [headerBanner, setHeaderBanner] = useState(() => localStorage.getItem('editorHeaderBanner') || '')
  const [footerBanner, setFooterBanner] = useState(() => localStorage.getItem('editorFooterBanner') || '')

  // Persistence Effects
  useEffect(() => { localStorage.setItem('editorContent', content) }, [content])
  useEffect(() => { localStorage.setItem('editorFileName', fileName) }, [fileName])
  useEffect(() => { localStorage.getItem('editorTheme') }, [theme])
  useEffect(() => { localStorage.setItem('editorSplitPos', splitPos.toString()) }, [splitPos])
  useEffect(() => { localStorage.setItem('editorShowPDFTimestamp', showPDFTimestamp.toString()) }, [showPDFTimestamp])
  useEffect(() => { localStorage.setItem('editorShowPageNumbers', showPageNumbers.toString()) }, [showPageNumbers])
  useEffect(() => { localStorage.setItem('editorPdfConfig', JSON.stringify(pdfConfig)) }, [pdfConfig])
  useEffect(() => { localStorage.setItem('editorIsEditorCollapsed', isEditorCollapsed.toString()) }, [isEditorCollapsed])
  useEffect(() => { localStorage.setItem('editorHeaderBanner', headerBanner) }, [headerBanner])
  useEffect(() => { localStorage.setItem('editorFooterBanner', footerBanner) }, [footerBanner])

  // Save As Modal State
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false)
  const [saveAsName, setSaveAsName] = useState('')

  // Saved Templates Modal State
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false)
  const [savedTemplates, setSavedTemplates] = useState<TemplateListItem[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [templatePage, setTemplatePage] = useState(1)
  const [templateTotal, setTemplateTotal] = useState(0)
  const [templateSearch, setTemplateSearch] = useState('')
  const TEMPLATE_LIMIT = 10

  // Saved Documents Modal State
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false)
  const [savedDocs, setSavedDocs] = useState<DocumentListItem[]>([])
  const [isLoadingDocs, setIsLoadingDocs] = useState(false)
  const [docPage, setDocPage] = useState(1)
  const [docTotal, setDocTotal] = useState(0)
  const [docSearch, setDocSearch] = useState('')
  const [docHasMore, setDocHasMore] = useState(true)
  const DOC_LIMIT = 10

  // Toast
  const { toasts, showToast, dismissToast } = useToast()

  // User Auth State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  // Templates State
  const [templateId, setTemplateId] = useState<string | null>(() => {
    return localStorage.getItem('templateId')
  })
  const [templateName, setTemplateName] = useState<string | null>(() => {
    return localStorage.getItem('templateName')
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (templateId) localStorage.setItem('templateId', templateId)
    else localStorage.removeItem('templateId')

    if (templateName) localStorage.setItem('templateName', templateName)
    else localStorage.removeItem('templateName')
  }, [templateId, templateName])

  // Document State
  const [documentId, setDocumentId] = useState<string | null>(() => {
    return localStorage.getItem('documentId')
  })

  useEffect(() => {
    if (documentId) localStorage.setItem('documentId', documentId)
    else localStorage.removeItem('documentId')
  }, [documentId])

  // Doc Name Modal State (used for both New and Save)
  const [isDocNameModalOpen, setIsDocNameModalOpen] = useState(false)
  const [docNameInput, setDocNameInput] = useState('')
  const [pendingDocAction, setPendingDocAction] = useState<'new' | 'save' | 'snapshot' | null>(null)

  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false)

  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const headerBannerInputRef = useRef<HTMLInputElement>(null)
  const footerBannerInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<any>(null)

  // Theme class is handled by Root component
  useEffect(() => {
    // We can still do side effects here if needed, but Root handles the class
  }, [theme])

  // Detect mobile for initial splitPos or pane handling
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null)
      setAuthMode('signin')
      setIsAuthModalOpen(true)
    }
    const handleApiError = (e: any) => {
      const { message } = e.detail || { message: 'An unexpected error occurred' }
      showToast(message, 'error')
    }

    window.addEventListener('auth-expired', handleAuthExpired)
    window.addEventListener('api-error', handleApiError)

    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired)
      window.removeEventListener('api-error', handleApiError)
    }
  }, [showToast])

  const handleNew = useCallback(() => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) return
    // Prompt for the new document's title before clearing content
    setDocNameInput('Untitled')
    setPendingDocAction('new')
    setIsDocNameModalOpen(true)
  }, [isDirty])

  const handleOpenClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result
      if (typeof text === 'string') {
        setContent(text)
        setFileName(file.name)
        setIsDirty(false)
      }
    }
    reader.readAsText(file)
  }, [])

  const finalizeMDDownload = useCallback((name: string) => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    // Ensure .md extension
    const finalName = name.toLowerCase().endsWith('.md') ? name : `${name}.md`
    a.download = finalName
    a.click()
    URL.revokeObjectURL(url)
    setIsDirty(false)
    setFileName(finalName)
  }, [content])

  const handleDownload = useCallback(() => {
    setTempFileName(fileName.replace(/\.md$/i, ''))
    setPendingAction('md')
    setIsRenameModalOpen(true)
  }, [fileName])

  const handleInsertPageBreak = useCallback(() => {
    const pbTag = '\n<div class="page-break"></div>\n'
    if (editorRef.current) {
      const editor = editorRef.current
      const selection = editor.getSelection()
      const range = {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn
      }
      editor.executeEdits('insert-page-break', [
        { range, text: pbTag, forceMoveMarkers: true }
      ])
    } else {
      setContent(prev => prev + pbTag)
    }
    setIsDirty(true)
  }, [])

  const finalizePDFDownload = useCallback((name: string) => {
    printPDF(name)
    setFileName(name.toLowerCase().endsWith('.md') ? name : `${name}.md`)
  }, [])

  const handleDownloadPDF = useCallback(() => {
    setTempFileName(fileName.replace(/\.md$/i, ''))
    setPendingAction('pdf')
    setIsRenameModalOpen(true)
  }, [fileName])

  const handleInsertImageClick = useCallback(() => {
    imageInputRef.current?.click()
  }, [])

  const handleImageSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // New pipeline: Compress -> Hash -> Store in IndexedDB
      const compressedBlob = await compressImage(file);
      const hash = await storeImage(compressedBlob);
      const imgMarkdown = `![${file.name}](${hash})`;

      if (editorRef.current) {
        const editor = editorRef.current
        const selection = editor.getSelection()
        const range = {
          startLineNumber: selection.startLineNumber,
          startColumn: selection.startColumn,
          endLineNumber: selection.endLineNumber,
          endColumn: selection.endColumn
        }
        editor.executeEdits('insert-image', [
          { range, text: imgMarkdown, forceMoveMarkers: true }
        ])
      } else {
        setContent(prev => prev + '\n' + imgMarkdown + '\n')
      }
      setIsDirty(true)
    } catch (err) {
      console.error('Image processing failed:', err);
    }

    // Reset input so the same file can be re-selected
    e.target.value = ''
  }, [])

  const handleHeaderBannerSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result
      if (typeof text === 'string') setHeaderBanner(text)
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  const handleFooterBannerSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result
      if (typeof text === 'string') setFooterBanner(text)
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  const handleChange = useCallback((value: string) => {
    setContent(value)
    setIsDirty(true)
  }, [])

  const toggleTheme = useCallback(() => {
    onToggleTheme()
  }, [onToggleTheme])

  const handleLogout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('token')
    setTemplateId(null)
    setDocumentId(null)
  }, [])

  const buildLayout = useCallback(() => {
    return {
      content,
      fileName,
      theme,
      splitPos,
      showPDFTimestamp,
      showPageNumbers,
      pdfConfig,
      isEditorCollapsed,
      headerBanner,
      footerBanner,
    }
  }, [content, fileName, theme, splitPos, showPDFTimestamp, showPageNumbers, pdfConfig, isEditorCollapsed, headerBanner, footerBanner])

  const buildTemplateLayout = useCallback(() => {
    const layout = buildLayout()
    const { content, fileName, ...templateLayout } = layout as any
    return templateLayout
  }, [buildLayout])



  const handleDocNameConfirm = useCallback(async (name: string, overrideAction?: 'new' | 'save' | 'snapshot') => {
    const action = overrideAction || pendingDocAction
    const trimmed = name.trim()
    if (!trimmed) return
    const finalFileName = trimmed.endsWith('.md') ? trimmed : `${trimmed}.md`
    setIsDocNameModalOpen(false)

    if (action === 'new') {
      // Reset EVERYTHING and start fresh with the chosen name
      setContent(DEFAULT_CONTENT)
      setFileName(finalFileName)
      setDocumentId(null)
      setTemplateId(null)
      setTemplateName(null)
      setIsDirty(false)
      // Note: We deliberately do NOT reset 'theme' as per user request
      setSplitPos(50)
      setShowPDFTimestamp(true)
      setShowPageNumbers(true)
      setIsEditorCollapsed(false)
      setPdfConfig({ format: 'a4', orientation: 'portrait', margin: 0.5, headerText: '', footerText: '' })
      setHeaderBanner('')
      setFooterBanner('')

      // Clear related localStorage items to ensure clean state
      localStorage.removeItem('editorContent')
      localStorage.setItem('editorFileName', finalFileName)
      localStorage.removeItem('documentId')
      localStorage.removeItem('templateId')
      localStorage.removeItem('templateName')

      showToast(`Started fresh document "${trimmed}"`, 'success')
      return
    }

    if ((action === 'save' || action === 'snapshot') && user) {
      setFileName(finalFileName)
      setIsSaving(true)
      try {
        let activeTemplateId = templateId;

        // If template is unsaved/not-snapshotted, create it first
        if (!activeTemplateId) {
          const payload: TemplatePayload = {
            name: trimmed, // set template name to document name
            layout: buildTemplateLayout()
          }
          const res = await createTemplate(user.id, payload)
          if (res.id) {
            activeTemplateId = res.id
            setTemplateId(res.id)
            setTemplateName(trimmed)
          }
        }

        const docPayload: DocumentPayload = {
          userId: user.id,
          title: trimmed,
          content: content,
          layoutId: activeTemplateId || '', // reference the current active template
          status: STATUS.DRAFT,
        }

        // If snapshot, ALWAYS create new. Otherwise, update if documentId exists.
        if (documentId && action === 'save') {
          await updateDocument(user.id, documentId, docPayload)
        } else {
          const docRes = await createDocument(user.id, docPayload)
          if (docRes.id) setDocumentId(docRes.id)
        }

        setIsDirty(false)
        showToast(action === 'snapshot' ? 'Document saved as new snapshot!' : 'Document synced!', 'success')
      } catch (err) {
        console.error('Save failed:', err)
        // Global error handler will show the message
      } finally {
        setIsSaving(false)
      }
    }
  }, [pendingDocAction, user, templateId, documentId, content, buildTemplateLayout, showToast])

  const handleRenameDocument = useCallback(async (newName: string) => {
    const trimmed = newName.trim()
    if (!trimmed) return
    const finalFileName = trimmed.endsWith('.md') ? trimmed : `${trimmed}.md`
    setFileName(finalFileName)

    if (user && documentId) {
      try {
        const docPayload: DocumentPayload = {
          userId: user.id,
          title: trimmed,
          content: content,
          layoutId: templateId || '',
          status: STATUS.DRAFT,
        }
        await updateDocument(user.id, documentId, docPayload)
        showToast('Document renamed!', 'success')
      } catch (err) {
        console.error('Rename failed:', err)
      }
    }
  }, [user, documentId, content, templateId, showToast])

  const handleSaveDocument = useCallback(async () => {
    if (!user) return
    // Directly save with current fileName (no modal)
    const name = fileName.replace(/\.md$/i, '')
    setPendingDocAction('save')
    handleDocNameConfirm(name, 'save')
  }, [user, fileName, handleDocNameConfirm])

  const handleSaveDocumentSnapshot = useCallback(async () => {
    if (!user) return
    // Directly save as snapshot with " Copy" suffix (no modal)
    const name = fileName.replace(/\.md$/i, '') + ' Copy'
    setPendingDocAction('snapshot')
    handleDocNameConfirm(name, 'snapshot')
  }, [user, fileName, handleDocNameConfirm])

  const handleSaveTemplate = useCallback(async () => {
    if (!user || !templateId) return
    setIsSaving(true)
    try {
      const payload: TemplatePayload = {
        name: templateName || 'Untitled Template',
        layout: buildTemplateLayout()
      }
      await updateTemplate(user.id, templateId, payload)
      showToast('Template settings synced!', 'success')
    } catch (err) {
      console.error('Template save failed:', err)
      showToast('Failed to sync template settings', 'error')
    } finally {
      setIsSaving(false)
    }
  }, [user, templateId, templateName, buildTemplateLayout, showToast])

  const handleSaveAsClick = useCallback(() => {
    if (!user) return
    setSaveAsName(fileName.replace(/\.md$/i, ''))
    setIsSaveAsModalOpen(true)
  }, [user, fileName])

  const handleOpenTemplates = useCallback(async (page: number = 1) => {
    if (!user) return
    setIsTemplatesModalOpen(true)
    setIsLoadingTemplates(true)
    try {
      const result = await getTemplates(user.id, page, TEMPLATE_LIMIT)
      const templates = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : []
      setSavedTemplates(templates)
      setTemplatePage(result.page || page)
      setTemplateTotal(result.total || 0)
    } catch (err) {
      console.error('Failed to fetch templates:', err)
      setSavedTemplates([])
    } finally {
      setIsLoadingTemplates(false)
    }
  }, [user])

  const handleOpenDocuments = useCallback(async (page: number = 1) => {
    if (!user) return
    setIsDocsModalOpen(true)
    setIsLoadingDocs(true)
    try {
      const result = await getDocuments(user.id, undefined, page, DOC_LIMIT)
      const docs = Array.isArray(result) ? result : (result?.data || [])
      setSavedDocs(docs as DocumentListItem[])
      setDocPage(page)
      if (!Array.isArray(result)) {
        setDocTotal(result.total || 0)
        setDocHasMore(page * DOC_LIMIT < result.total)
      } else {
        setDocHasMore(result.length === DOC_LIMIT)
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err)
      setSavedDocs([])
    } finally {
      setIsLoadingDocs(false)
    }
  }, [user])

  const handleLoadDocument = useCallback(async (doc: DocumentListItem) => {
    if (!user) return
    try {
      const result = await getDocuments(user.id, doc.id)
      const fullDoc = (Array.isArray(result) ? result[0] : result.data?.[0]) as FullDocument
      if (!fullDoc) return

      // Load Document Data
      setContent(fullDoc.content || '')
      setFileName(fullDoc.title || 'Untitled.md')
      setDocumentId(fullDoc.id)
      setIsDirty(false)

      // Load Linked Template Data if available
      if (fullDoc.template) {
        const template = fullDoc.template
        const layout = typeof template.layout === 'string' ? JSON.parse(template.layout) : template.layout

        if (layout.theme && layout.theme !== theme) onToggleTheme()
        if (layout.splitPos !== undefined) setSplitPos(layout.splitPos)
        if (layout.showPDFTimestamp !== undefined) setShowPDFTimestamp(layout.showPDFTimestamp)
        if (layout.showPageNumbers !== undefined) setShowPageNumbers(layout.showPageNumbers)
        if (layout.pdfConfig) setPdfConfig(prev => ({ ...prev, ...layout.pdfConfig }))
        if (layout.isEditorCollapsed !== undefined) setIsEditorCollapsed(layout.isEditorCollapsed)
        if (layout.headerBanner !== undefined) setHeaderBanner(layout.headerBanner)
        if (layout.footerBanner !== undefined) setFooterBanner(layout.footerBanner)

        setTemplateId(template.id)
        setTemplateName(template.name)
      } else {
        // If document has no template, we might want to keep the current one or clear it.
        // Usually, loading a document should probably set the template it was saved with.
        setTemplateId(null)
        setTemplateName(null)
      }

      setIsDocsModalOpen(false)
      showToast(`Loaded document "${fullDoc.title}"`, 'success')
    } catch (err) {
      console.error('Failed to load document:', err)
    }
  }, [user, showToast])

  const handleLoadTemplate = useCallback(async (pref: TemplateListItem) => {
    if (!user) return
    try {
      const response = await getTemplateById(user.id, pref.id) as any
      const fullPref = Array.isArray(response) ? response[0] : (response?.data?.[0] || response?.data || response)

      if (!fullPref) {
        showToast('Template not found', 'error')
        return
      }

      const layout = typeof fullPref.layout === 'string' ? JSON.parse(fullPref.layout) : (fullPref.layout || {})

      // Apply layout settings ONLY. Do NOT overwrite current content or documentId.
      if (layout.theme && layout.theme !== theme) onToggleTheme()
      if (layout.splitPos !== undefined) setSplitPos(layout.splitPos)
      if (layout.showPDFTimestamp !== undefined) setShowPDFTimestamp(layout.showPDFTimestamp)
      if (layout.showPageNumbers !== undefined) setShowPageNumbers(layout.showPageNumbers)
      if (layout.pdfConfig) {
        const cfg = typeof layout.pdfConfig === 'string' ? JSON.parse(layout.pdfConfig) : layout.pdfConfig
        setPdfConfig(prev => ({ ...prev, ...cfg }))
      }
      if (layout.isEditorCollapsed !== undefined) setIsEditorCollapsed(layout.isEditorCollapsed)
      if (layout.headerBanner !== undefined) setHeaderBanner(layout.headerBanner)
      if (layout.footerBanner !== undefined) setFooterBanner(layout.footerBanner)

      setTemplateId(fullPref.id || pref.id)
      setTemplateName(fullPref.name || pref.name || 'Untitled Template')
      setIsTemplatesModalOpen(false)
      showToast(`Applied layout from "${fullPref.name || pref.name || 'Untitled'}"`, 'success')
    } catch (err) {
      console.error('Failed to load template:', err)
      // Global error handler will show the message
    }
  }, [user, showToast])

  const handleSaveAsConfirm = useCallback(async (name: string) => {
    if (!user) return
    setIsSaveAsModalOpen(false)
    setIsSaving(true)
    try {
      const payload: TemplatePayload = { name, layout: buildTemplateLayout() }
      const res = await createTemplate(user.id, payload)
      if (res.id) {
        setTemplateId(res.id)
        setTemplateName(name)
      }
      setIsDirty(false)
      showToast(`"${name}" saved as new template!`, 'success')
    } catch (err) {
      console.error('Save As failed:', err)
      // Global error handler will show the message
    } finally {
      setIsSaving(false)
    }
  }, [user, buildTemplateLayout, showToast])

  // Splitter drag logic 
  const onMouseDown = useCallback(() => {
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setSplitPos(Math.min(Math.max(pct, 20), 80))
    }
    const onUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  // Image Cleanup Logic
  const cleanupImages = useCallback(async () => {
    try {
      // Find all hashes in current content
      const hashRegex = /!\[.*?\]\s*\(([a-f0-9]{64})\)/g;
      const matches = [...content.matchAll(hashRegex)];
      const activeHashes = new Set(matches.map(m => m[1]));

      // Get all hashes from DB
      const allHashes = await getAllHashes();

      // Delete unused ones
      for (const hash of allHashes) {
        if (!activeHashes.has(hash)) {
          await deleteImage(hash);
        }
      }
    } catch (err) {
      console.error('Image cleanup failed:', err);
    }
  }, [content]);

  // Run cleanup when content is stable (not dirty) or periodically
  useEffect(() => {
    // Only cleanup when not editing/dirty to avoid race conditions or performance issues
    if (!isDirty && content) {
      cleanupImages();
    }
  }, [isDirty]); // Trigger on "save" or stabilization

  if (isSetPasswordView) {
    return (
      <div className={theme}>
        <SetPassword />
      </div>
    )
  }

  return (
    <div className={`h-screen ${theme === 'dark' ? 'bg-[#0b0d12] bg-gradient-to-b from-[#0b0d12] to-[#0a0b0f]' : 'bg-gray-50'} text-gray-900 dark:text-gray-100 font-ui font-antialiased print:h-auto print:overflow-visible print:bg-white relative overflow-hidden`}>
      {/* Subtle Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-[99999]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <style>{`
        @keyframes modalEnter {
          from { opacity: 0; transform: scale(0.98) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-enter {
          animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Linear-Tier Design System */
        :root {
          --zinc-50: #fafafa;
          --zinc-100: #f4f4f5;
          --zinc-200: #e4e4e7;
          --zinc-300: #d4d4d8;
          --zinc-400: #a1a1aa;
          --zinc-500: #71717a;
          --zinc-600: #52525b;
          --zinc-700: #3f3f46;
          --zinc-800: #27272a;
          --zinc-900: #18181b;
          --zinc-950: #09090b;
        }

        .font-ui {
          font-feature-settings: 'cv02', 'cv03', 'cv04', 'ss01';
          letter-spacing: -0.01em;
        }

        .premium-input {
          @apply bg-zinc-100/5 dark:bg-white/[0.02] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-[13px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:border-zinc-900/30 dark:focus:border-white/30 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200;
        }

        .premium-button-primary {
          @apply bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-5 py-2 rounded-xl text-[13px] font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm;
        }

        .premium-button-secondary {
          @apply bg-transparent text-zinc-500 dark:text-zinc-400 px-5 py-2 rounded-xl text-[13px] font-medium transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-[0.98];
        }



        @page {
          size: ${pdfConfig.format} ${pdfConfig.orientation};
          margin: 0 !important;
        }
        @media print {
          body {
            margin: 0;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Force light mode colors during print even if app is in dark mode */
          .dark {
            background: white !important;
            color: black !important;
          }

          .preview-page-container {
            gap: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }

          .preview-content {
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
            overflow: hidden !important;
            break-inside: avoid;
            page-break-after: always;
            page-break-inside: avoid;
          }

          /* Enforce consistent line-height in print (#10) */
          .prose {
            line-height: 1.5 !important;
          }

          /* Reset prose-invert variables to light mode values during print */
          .dark .prose {
            --tw-prose-body: #374151 !important;
            --tw-prose-headings: #111827 !important;
            --tw-prose-lead: #4b5563 !important;
            --tw-prose-links: #2563eb !important;
            --tw-prose-bold: #111827 !important;
            --tw-prose-counters: #6b7280 !important;
            --tw-prose-bullets: #d1d5db !important;
            --tw-prose-hr: #e5e7eb !important;
            --tw-prose-quotes: #111827 !important;
            --tw-prose-quote-borders: #e5e7eb !important;
            --tw-prose-captions: #6b7280 !important;
            --tw-prose-code: #111827 !important;
            --tw-prose-pre-code: #374151 !important;
            --tw-prose-pre-bg: #f9fafb !important;
            --tw-prose-th-borders: #d1d5db !important;
            --tw-prose-td-borders: #e5e7eb !important;
          }

          /* Increase contrast for header/footer text in print */
          .text-gray-400 {
            color: #4b5563 !important;
          }
        }
      `}</style>

      {/* Main Web UI: Adapted for print by hiding sidebars directly instead of a separate portal */}
      <div className="flex flex-col h-full overflow-hidden text-gray-900 dark:text-gray-100 print:overflow-visible print:h-auto print:block">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".md,.markdown,.txt"
          onChange={handleFileChange}
        />
        <input
          type="file"
          ref={imageInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageSelected}
        />


        <div className="print:hidden">
          <Toolbar
            theme={theme}
            isDirty={isDirty}
            fileName={fileName}
            onNew={handleNew}
            onOpen={handleOpenClick}
            onDownload={handleDownload}
            onDownloadPDF={handleDownloadPDF}
            onInsertImage={handleInsertImageClick}
            onInsertPageBreak={handleInsertPageBreak}
            onToggleTheme={toggleTheme}
            showPDFTimestamp={showPDFTimestamp}
            onTogglePDFTimestamp={() => setShowPDFTimestamp(!showPDFTimestamp)}
            showPageNumbers={showPageNumbers}
            onTogglePageNumbers={() => setShowPageNumbers(!showPageNumbers)}
            pdfConfig={pdfConfig}
            onUpdatePDFConfig={(updates) => setPdfConfig(prev => ({ ...prev, ...updates }))}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isEditorCollapsed={isEditorCollapsed}
            onToggleEditor={() => setIsEditorCollapsed(!isEditorCollapsed)}

            onOpenAuth={(mode: 'signin' | 'signup') => {
              setAuthMode(mode)
              setIsAuthModalOpen(true)
            }}
            user={user}
            onLogout={handleLogout}
            onSaveDocument={handleSaveDocument}
            onSaveDocumentSnapshot={handleSaveDocumentSnapshot}
            onSaveTemplate={handleSaveTemplate}
            onSaveTemplateAs={handleSaveAsClick}
            isSaving={isSaving}
            templateId={templateId}
            documentId={documentId}
            onOpenTemplates={handleOpenTemplates}
            onOpenDocuments={handleOpenDocuments}
            onOpenLayout={() => setIsLayoutModalOpen(true)}
            onRename={handleRenameDocument}
          />
        </div>
        <div
          ref={containerRef}
          className="flex flex-1 overflow-hidden relative print:overflow-visible print:block print:h-auto print:w-full"
        >
          <div
            className={`print:hidden flex flex-col h-full bg-white dark:bg-[#16181d] shadow-sm relative z-[1] transition-transform duration-300 md:transition-none md:translate-x-0 absolute md:relative w-full md:w-auto ${isEditorCollapsed ? 'md:hidden' : ''}`}
            style={{
              width: isMobile ? '100%' : `${splitPos}%`,
              transform: isMobile ? (activeTab === 'editor' ? 'translateX(0)' : 'translateX(-100%)') : 'none',
              position: isMobile ? 'absolute' : 'relative',
              left: 0,
              top: 0
            }}
          >
            {isMobile && activeTab === 'editor' && (
              <MobileEditorBar editorRef={editorRef} />
            )}
            <Editor
              value={content}
              onChange={handleChange}
              theme={theme}
              onMount={(editor) => {
                editorRef.current = editor

                // Add paste listener for images
                const container = editor.getDomNode();
                if (container) {
                  const onPaste = async (e: ClipboardEvent) => {
                    const items = e.clipboardData?.items;
                    if (!items) return;

                    let containsImage = false;
                    for (const item of items) {
                      if (item.type.startsWith('image/')) {
                        containsImage = true;
                        break;
                      }
                    }

                    if (containsImage) {
                      // Only intercept if there's an image. Let Monaco handle text paste normally.
                      e.preventDefault();
                      e.stopImmediatePropagation();

                      for (const item of items) {
                        if (item.type.startsWith('image/')) {
                          const file = item.getAsFile();
                          if (file) {
                            try {
                              const compressed = await compressImage(file);
                              const hash = await storeImage(compressed);
                              const markdown = `![pasted-image](${hash})`;

                              // Ensure editor/model still exists before attempting to edit
                              if (editor && editor.getModel()) {
                                const selection = editor.getSelection();
                                editor.executeEdits('paste-image', [{
                                  range: selection,
                                  text: markdown,
                                  forceMoveMarkers: true
                                }]);
                                setIsDirty(true);
                              }
                            } catch (err) {
                              console.error('Paste image failed:', err);
                            }
                          }
                        }
                      }
                    }
                  };

                  container.addEventListener('paste', onPaste);
                  editor.onDidDispose(() => {
                    container.removeEventListener('paste', onPaste);
                  });
                }
              }}
            />
          </div>

          {/* Splitter */}
          <div
            className={`print:hidden hidden md:flex w-[6px] bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-500 cursor-col-resize shrink-0 relative z-[10] transition-colors items-center justify-center group active:bg-blue-600 ${isEditorCollapsed ? '!hidden' : ''}`}
            onMouseDown={onMouseDown}
          >
            <div className="w-[2px] h-[24px] bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-white transition-colors" />
          </div>

          <div
            className="flex flex-col h-full bg-gray-50 dark:bg-[#0f1115] relative z-[0] transition-transform duration-300 md:transition-none md:translate-x-0 absolute md:relative w-full md:w-auto print:!absolute print:!inset-0 print:!w-full print:!h-auto print:!block print:!transform-none print:z-50 print:bg-white"
            style={{
              width: isMobile ? '100%' : (isEditorCollapsed ? '100%' : `${100 - splitPos}%`),
              transform: isMobile ? (activeTab === 'preview' ? 'translateX(0)' : 'translateX(100%)') : 'none',
              position: isMobile ? 'absolute' : 'relative',
              left: 0,
              top: 0
            }}
          >
            <Preview
              content={content}
              pdfConfig={pdfConfig}
              showPDFTimestamp={showPDFTimestamp}
              showPageNumbers={showPageNumbers}
              headerBanner={headerBanner}
              footerBanner={footerBanner}
            />
          </div>
        </div>

        <div className="print:hidden">
          <StatusBar
            content={content}
            fileName={fileName}
            isDirty={isDirty}
          />
        </div>
      </div>

      {/* Rename Modal: Glass Style */}
      {/* Rename Modal: Glass Style */}
      <Modal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} maxWidthClass="max-w-[360px]" zIndex={10001}>
        <h3 className="text-[16px] font-semibold text-zinc-900 dark:text-zinc-100 mb-1 tracking-tight">Rename document</h3>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 font-medium">Choose a new name for your file.</p>

        <div className="relative mb-6">
          <input
            type="text"
            className="premium-input w-full pr-12 font-medium"
            value={tempFileName}
            onChange={(e) => setTempFileName(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (pendingAction === 'md') finalizeMDDownload(tempFileName)
                else if (pendingAction === 'pdf') finalizePDFDownload(tempFileName)
                setIsRenameModalOpen(false)
              }
            }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            {pendingAction === 'md' ? '.md' : '.pdf'}
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="premium-button-secondary"
            onClick={() => setIsRenameModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="premium-button-primary"
            onClick={() => {
              if (pendingAction === 'md') finalizeMDDownload(tempFileName)
              else if (pendingAction === 'pdf') finalizePDFDownload(tempFileName)
              setIsRenameModalOpen(false)
            }}
          >
            Rename
          </button>
        </div>
      </Modal>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(userData: User) => setUser(userData)}
      />

      {/* Save As Modal: Glass Style */}
      {/* Save As Modal: Glass Style */}
      <Modal isOpen={isSaveAsModalOpen} onClose={() => setIsSaveAsModalOpen(false)} maxWidthClass="max-w-[360px]" zIndex={10001}>
        <h3 className="text-[16px] font-semibold text-zinc-900 dark:text-zinc-100 mb-1 tracking-tight">Save as template</h3>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 font-medium">Save current layout for future use.</p>

        <input
          type="text"
          className="premium-input w-full mb-6 font-medium"
          value={saveAsName}
          onChange={(e) => setSaveAsName(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && saveAsName.trim()) {
              handleSaveAsConfirm(saveAsName.trim())
            }
          }}
          placeholder="Template name..."
        />

        <div className="flex justify-end gap-2">
          <button
            className="premium-button-secondary"
            onClick={() => setIsSaveAsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="premium-button-primary"
            disabled={!saveAsName.trim()}
            onClick={() => handleSaveAsConfirm(saveAsName.trim())}
          >
            Save
          </button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Templates Modal: Glass Style */}
      {/* Templates Modal: Glass Style */}
      <Modal isOpen={isTemplatesModalOpen} onClose={() => setIsTemplatesModalOpen(false)} maxWidthClass="max-w-xl" zIndex={10001}>
        <div className="mb-4">
          <h3 className="text-[16px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Saved templates</h3>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium">Applied layout settings to current document</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors">
            <IconSearch size={14} />
          </div>
          <input
            type="text"
            placeholder="Search templates..."
            className="premium-input w-full pl-10 h-10 text-[13px]"
            value={templateSearch}
            onChange={(e) => setTemplateSearch(e.target.value)}
          />
        </div>

        <div className="overflow-y-auto pr-1 flex-1 min-h-[50vh] custom-scrollbar">
          {isLoadingTemplates ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-6 h-6 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin opacity-20" />
              <span className="text-[13px] font-medium text-zinc-400">Loading templates...</span>
            </div>
          ) : savedTemplates.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-[13px] font-medium">No templates saved yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {savedTemplates.map(pref => (
                <button
                  key={pref.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all text-left group ${pref.id === templateId
                    ? 'bg-zinc-900/[0.03] dark:bg-white/[0.05]'
                    : 'hover:bg-zinc-100 dark:hover:bg-white/[0.02]'
                    }`}
                  onClick={() => handleLoadTemplate(pref)}
                >
                  <div className="flex items-center gap-3">
                    <IconCloud size={16} className={pref.id === templateId ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'} />
                    <div>
                      <p className={`text-[13px] font-medium ${pref.id === templateId ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}`}>{pref.name || 'Untitled'}</p>
                    </div>
                  </div>
                  {pref.id === templateId && (
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {templateTotal > TEMPLATE_LIMIT && (
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-100 dark:border-white/[0.05]">
            <button
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors group"
              onClick={() => handleOpenTemplates(templatePage - 1)}
              disabled={templatePage <= 1}
              title="Previous Page"
            >
              <IconChevronLeft size={14} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
            </button>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Page</span>
              <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 translate-y-[-1px]">
                {templatePage} <span className="text-zinc-300 dark:text-zinc-700 mx-1 font-light">/</span> {Math.ceil(templateTotal / TEMPLATE_LIMIT)}
              </span>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors group"
              onClick={() => handleOpenTemplates(templatePage + 1)}
              disabled={templatePage * TEMPLATE_LIMIT >= templateTotal}
              title="Next Page"
            >
              <IconChevronRight size={14} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
            </button>
          </div>
        )}
      </Modal>

      {/* Documents Modal: Glass Style */}
      {/* Documents Modal: Glass Style */}
      <Modal isOpen={isDocsModalOpen} onClose={() => setIsDocsModalOpen(false)} maxWidthClass="max-w-xl" zIndex={10001}>
        <div className="mb-4">
          <h3 className="text-[16px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Your documents</h3>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium">Access your work from anywhere</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors">
            <IconSearch size={14} />
          </div>
          <input
            type="text"
            placeholder="Search documents..."
            className="premium-input w-full pl-10 h-10 text-[13px]"
            value={docSearch}
            onChange={(e) => setDocSearch(e.target.value)}
          />
        </div>

        <div className="overflow-y-auto pr-1 flex-1 min-h-[50vh] custom-scrollbar">
          {isLoadingDocs ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-6 h-6 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin opacity-20" />
              <span className="text-[13px] font-medium text-zinc-400">Loading documents...</span>
            </div>
          ) : savedDocs.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-[13px] font-medium">No documents saved yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {savedDocs.map(doc => (
                <button
                  key={doc.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all text-left group ${doc.id === documentId
                    ? 'bg-zinc-900/[0.03] dark:bg-white/[0.05]'
                    : 'hover:bg-zinc-100 dark:hover:bg-white/[0.02]'
                    }`}
                  onClick={() => handleLoadDocument(doc)}
                >
                  <div className="flex items-center gap-3">
                    <IconFile size={16} className={doc.id === documentId ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'} />
                    <div>
                      <p className={`text-[13px] font-medium ${doc.id === documentId ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}`}>{doc.title || 'Untitled.md'}</p>
                    </div>
                  </div>
                  {doc.id === documentId && (
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {(docPage > 1 || docHasMore) && (
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-zinc-100 dark:border-white/[0.05]">
            <button
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors group"
              onClick={() => handleOpenDocuments(docPage - 1)}
              disabled={docPage <= 1}
              title="Previous Page"
            >
              <IconChevronLeft size={14} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
            </button>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Page</span>
              <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 translate-y-[-1px]">
                {docPage} <span className="text-zinc-300 dark:text-zinc-700 mx-1 font-light">/</span> {Math.ceil(docTotal / DOC_LIMIT) || 1}
              </span>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors group"
              onClick={() => handleOpenDocuments(docPage + 1)}
              disabled={docPage * DOC_LIMIT >= docTotal}
              title="Next Page"
            >
              <IconChevronRight size={14} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
            </button>
          </div>
        )}
      </Modal>

      {/* Layout Modal: Glass Style */}
      {/* Layout Modal: Glass Style */}
      <Modal isOpen={isLayoutModalOpen} onClose={() => setIsLayoutModalOpen(false)} maxWidthClass="max-w-[420px]" zIndex={10001}>
        {/* Header */}
        <div className="text-center mb-6 relative z-10 shrink-0">
          <h2 className="text-[24px] tracking-tight mb-1.5">
            <span className="font-semibold text-zinc-900 dark:text-white">Layout </span>
            <span className="font-normal text-zinc-500 dark:text-zinc-400">Settings</span>
          </h2>
          <p className="text-[13px] text-zinc-500 font-medium tracking-tight">Configure document appearance and exports</p>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-4 pb-2 w-full">

          {/* Header Configuration */}
          <div className="bg-zinc-50/80 dark:bg-[#14161A] border border-zinc-200/80 dark:border-zinc-800/80 rounded-[24px] p-5 space-y-4 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span className="text-[12px] font-semibold text-zinc-900 dark:text-white tracking-widest uppercase">Header</span>
            </div>

            <div className="relative group">
              <div className="absolute top-3 left-4 text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pointer-events-none z-10">Text</div>
              <textarea
                className="w-full bg-white dark:bg-[#1A1C20]/80 border border-zinc-200 dark:border-zinc-800/50 outline-none text-zinc-900 dark:text-white text-[13px] font-medium placeholder-zinc-400 dark:placeholder-zinc-600 rounded-[16px] min-h-[70px] pt-7 px-4 focus:border-blue-500/50 dark:focus:border-blue-500/50 transition-colors resize-none shadow-sm dark:shadow-none custom-input"
                placeholder="Appears at the top of every page..."
                value={pdfConfig.headerText}
                onChange={(e) => setPdfConfig(prev => ({ ...prev, headerText: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-1">HTML Banner</span>
                {headerBanner && (
                  <button onClick={() => setHeaderBanner('')} className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 text-[10px] font-semibold transition-colors">REMOVE</button>
                )}
              </div>
              {!headerBanner ? (
                <button
                  onClick={() => headerBannerInputRef.current?.click()}
                  className="w-full h-[60px] bg-white dark:bg-[#1A1C20]/80 border border-dashed border-zinc-300 dark:border-zinc-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-[16px] flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group"
                >
                  <IconHTML size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[12px] font-semibold">Upload HTML file</span>
                </button>
              ) : (
                <div className="relative rounded-[16px] overflow-hidden group border border-blue-500/30 dark:border-blue-400/30 bg-blue-50/50 dark:bg-blue-500/5 shadow-sm p-4 flex flex-col justify-center h-[60px]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <IconHTML size={16} className="text-blue-500 dark:text-blue-400" />
                      <span className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">HTML file active</span>
                    </div>
                    <button
                      onClick={() => headerBannerInputRef.current?.click()}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-[11px] font-semibold transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
              <input ref={headerBannerInputRef} type="file" className="hidden" accept=".html,.htm" onChange={handleHeaderBannerSelected} />
            </div>
          </div>

          {/* Footer Configuration */}
          <div className="bg-zinc-50/80 dark:bg-[#14161A] border border-zinc-200/80 dark:border-zinc-800/80 rounded-[24px] p-5 space-y-4 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span className="text-[12px] font-semibold text-zinc-900 dark:text-white tracking-widest uppercase">Footer</span>
            </div>

            <div className="relative group">
              <div className="absolute top-3 left-4 text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pointer-events-none z-10">Text</div>
              <textarea
                className="w-full bg-white dark:bg-[#1A1C20]/80 border border-zinc-200 dark:border-zinc-800/50 outline-none text-zinc-900 dark:text-white text-[13px] font-medium placeholder-zinc-400 dark:placeholder-zinc-600 rounded-[16px] min-h-[70px] pt-7 px-4 focus:border-blue-500/50 dark:focus:border-blue-500/50 transition-colors resize-none shadow-sm dark:shadow-none custom-input"
                placeholder="Appears at the bottom of every page..."
                value={pdfConfig.footerText}
                onChange={(e) => setPdfConfig(prev => ({ ...prev, footerText: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-1">HTML Banner</span>
                {footerBanner && (
                  <button onClick={() => setFooterBanner('')} className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 text-[10px] font-semibold transition-colors">REMOVE</button>
                )}
              </div>
              {!footerBanner ? (
                <button
                  onClick={() => footerBannerInputRef.current?.click()}
                  className="w-full h-[60px] bg-white dark:bg-[#1A1C20]/80 border border-dashed border-zinc-300 dark:border-zinc-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-[16px] flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group"
                >
                  <IconHTML size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[12px] font-semibold">Upload HTML file</span>
                </button>
              ) : (
                <div className="relative rounded-[16px] overflow-hidden group border border-blue-500/30 dark:border-blue-400/30 bg-blue-50/50 dark:bg-blue-500/5 shadow-sm p-4 flex flex-col justify-center h-[60px]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <IconHTML size={16} className="text-blue-500 dark:text-blue-400" />
                      <span className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">HTML file active</span>
                    </div>
                    <button
                      onClick={() => footerBannerInputRef.current?.click()}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-[11px] font-semibold transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
              <input ref={footerBannerInputRef} type="file" className="hidden" accept=".html,.htm" onChange={handleFooterBannerSelected} />
            </div>
          </div>

        </div>

        {/* Footer action */}
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50 relative z-10 shrink-0">
          <button
            className="w-full bg-blue-500 hover:bg-blue-400 text-white shadow-[0_4px_14px_rgba(59,130,246,0.3)] transition-colors py-[14px] rounded-[14px] text-[14px] font-semibold"
            onClick={() => setIsLayoutModalOpen(false)}
          >
            Confirm Settings
          </button>
        </div>
      </Modal>

      {/* Doc Name Modal — Glass Style */}
      {/* Doc Name Modal — Glass Style */}
      <Modal isOpen={isDocNameModalOpen} onClose={() => setIsDocNameModalOpen(false)} maxWidthClass="max-w-[360px]" zIndex={10001}>
        <h3 className="text-[16px] font-semibold text-zinc-900 dark:text-zinc-100 mb-1 tracking-tight">
          {pendingDocAction === 'new' ? 'Create document' : 'Save to cloud'}
        </h3>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 font-medium">
          {pendingDocAction === 'new' ? 'Start fresh with a new file.' : 'Choose a name to sync your work.'}
        </p>

        <div className="relative mb-6">
          <input
            id="doc-name-input"
            type="text"
            autoFocus
            className="premium-input w-full pr-12 font-medium"
            placeholder="Document name..."
            value={docNameInput}
            onChange={(e) => setDocNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && docNameInput.trim()) {
                handleDocNameConfirm(docNameInput)
              }
              if (e.key === 'Escape') setIsDocNameModalOpen(false)
            }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 opacity-50 uppercase tracking-wider">.md</span>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="premium-button-secondary"
            onClick={() => setIsDocNameModalOpen(false)}
          >
            Cancel
          </button>
          <button
            id="doc-name-confirm-btn"
            className="premium-button-primary"
            disabled={!docNameInput.trim()}
            onClick={() => handleDocNameConfirm(docNameInput)}
          >
            {pendingDocAction === 'new' ? 'Create' : 'Save'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

function IconX({ size = 18, className = "" }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconCloud({ size = 18, className = "" }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.5 19a3.5 3.5 0 0 0 .5-6.975A5.992 5.992 0 0 0 7 9a6 6 0 0 0-6 6 5 5 0 0 0 5 5h11.5z" />
    </svg>
  )
}

function IconSearch({ size = 18, className = "" }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconChevronLeft({ size = 16, className = "" }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconChevronRight({ size = 16, className = "" }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function IconFile({ size = 18, className = "" }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function IconImage({ size = 18, className = "" }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function IconHTML({ size = 16, className = "" }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13v4" />
      <path d="M12 13v4" />
      <path d="M16 13v4" />
    </svg>
  )
}
