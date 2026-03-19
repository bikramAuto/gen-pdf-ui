import { PDFConfig } from '../types/pdf'

// Calculation for page height in pixels
export const formatHeights: Record<string, number> = {
  'a4-portrait': 297,
  'a4-landscape': 210,
  'letter-portrait': 11 * 25.4,
  'letter-landscape': 8.5 * 25.4,
  'legal-portrait': 14 * 25.4,
  'legal-landscape': 8.5 * 25.4
}

export const formatWidths: Record<string, number> = {
  'a4-portrait': 210,
  'a4-landscape': 297,
  'letter-portrait': 8.5 * 25.4,
  'letter-landscape': 11 * 25.4,
  'legal-portrait': 8.5 * 25.4,
  'legal-landscape': 14 * 25.4
}

interface PaginationOptions {
  fullHtml: string
  pdfConfig: PDFConfig
  headerBanner?: string
  footerBanner?: string
  measureElement: HTMLElement
}

/**
 * Calculates pagination for HTML content based on PDF configuration.
 * This must be run in an environment with DOM access (the browser).
 */
export function calculatePagination({
  fullHtml,
  pdfConfig,
  headerBanner,
  footerBanner,
  measureElement
}: PaginationOptions): string[] {
  measureElement.innerHTML = fullHtml

  const key = `${pdfConfig.format}-${pdfConfig.orientation}`
  const totalPageHeightMm = formatHeights[key] || 297
  const totalHeightPx = (totalPageHeightMm * 96) / 25.4
  const marginPx = pdfConfig.margin * 96

  // Measure actual banner heights for accurate pagination
  let hHeight = 0
  let fHeight = 0

  if (headerBanner || footerBanner) {
    const tempDiv = document.createElement('div')
    tempDiv.style.width = measureElement.style.width
    tempDiv.style.padding = measureElement.style.padding
    tempDiv.style.position = 'absolute'
    tempDiv.style.visibility = 'hidden'
    tempDiv.className = 'prose dark:prose-invert'
    document.body.appendChild(tempDiv)

    if (headerBanner) {
      tempDiv.innerHTML = headerBanner
      hHeight = tempDiv.offsetHeight + 16 // +16 for mb-4
    }
    if (footerBanner) {
      tempDiv.innerHTML = footerBanner
      fHeight = tempDiv.offsetHeight + 16 // +16 for mt-4
    }
    document.body.removeChild(tempDiv)
  }

  const usableHeight = totalHeightPx - (marginPx * 2) - 48 - hHeight - fHeight
  const pages: string[] = []

  let currentPageHTML = ''
  let currentHeight = 0

  const elements = Array.from(measureElement.children) as HTMLElement[]

  elements.forEach((el) => {
    // Handle manual page break
    if (el.classList.contains('page-break')) {
      if (currentPageHTML !== '') {
        pages.push(currentPageHTML)
        currentPageHTML = ''
        currentHeight = 0
      }
      return
    }

    const elHeight = el.getBoundingClientRect().height

    if (currentHeight + elHeight > usableHeight && currentPageHTML !== '') {
      pages.push(currentPageHTML)
      currentPageHTML = ''
      currentHeight = 0
    }

    currentPageHTML += el.outerHTML
    currentHeight += elHeight
  })

  if (currentPageHTML) pages.push(currentPageHTML)

  return pages
}

/**
 * Triggers the browser print dialog with a specific filename.
 */
export function printPDF(name: string): void {
  const originalTitle = document.title
  document.title = name

  setTimeout(() => {
    window.print()
    // Restore title after print dialog closes (though print is often blocking)
    setTimeout(() => {
      document.title = originalTitle
    }, 1000)
  }, 100)
}
