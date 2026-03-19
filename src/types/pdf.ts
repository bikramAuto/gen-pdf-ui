export type PDFFormat = 'letter' | 'a4' | 'legal'
export type PDFOrientation = 'portrait' | 'landscape'

export interface PDFConfig {
  format: PDFFormat
  orientation: PDFOrientation
  margin: number
  headerText: string
  footerText: string
}
