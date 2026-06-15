import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const NAVY  = [22, 37, 80]   as [number, number, number]
const GOLD  = [245, 166, 35] as [number, number, number]
const WHITE = [255, 255, 255] as [number, number, number]
const LIGHT = [248, 249, 252] as [number, number, number]
const GRAY  = [100, 116, 139] as [number, number, number]

export interface PdfColumn {
  header: string
  key:    string
  width?: number
}

export interface PdfOptions {
  title:     string
  subtitle?: string
  columns:   PdfColumn[]
  rows:      Record<string, string | number>[]
  filename:  string
}

export function exportToPdf(opts: PdfOptions) {
  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pw   = doc.internal.pageSize.getWidth()

  // ── Header band ──────────────────────────────────────────────
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, pw, 28, 'F')

  // Logo badge "FC"
  doc.setFillColor(...GOLD)
  doc.roundedRect(12, 7, 14, 14, 3, 3, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...NAVY)
  doc.text('FC', 19, 16, { align: 'center' })

  // Platform name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...WHITE)
  doc.text('FAVELA CLUB', 30, 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(200, 210, 230)
  doc.text('Platform', 30, 18)

  // Date top-right
  const now = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.setFontSize(7)
  doc.setTextColor(180, 200, 230)
  doc.text(now, pw - 12, 14, { align: 'right' })

  // ── Title block ───────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...NAVY)
  doc.text(opts.title, 12, 42)

  if (opts.subtitle) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...GRAY)
    doc.text(opts.subtitle, 12, 49)
  }

  const startY = opts.subtitle ? 54 : 48

  // ── Table ─────────────────────────────────────────────────────
  autoTable(doc, {
    startY,
    margin: { left: 12, right: 12 },
    head:   [opts.columns.map(c => c.header)],
    body:   opts.rows.map(row => opts.columns.map(c => row[c.key] ?? '—')),
    columnStyles: Object.fromEntries(
      opts.columns.map((c, i) => [i, { cellWidth: c.width ?? 'auto' }])
    ),
    headStyles: {
      fillColor:  NAVY,
      textColor:  WHITE,
      fontStyle:  'bold',
      fontSize:    9,
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize:   9,
      cellPadding: 3.5,
      textColor:  [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: LIGHT,
    },
    tableLineColor: [226, 232, 240],
    tableLineWidth: 0.2,
    showHead: 'everyPage',
  })

  // ── Footer ────────────────────────────────────────────────────
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const h = doc.internal.pageSize.getHeight()
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.3)
    doc.line(12, h - 12, pw - 12, h - 12)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...GRAY)
    doc.text('Favela Club — Documento gerado automaticamente', 12, h - 6)
    doc.text(`${i} / ${pageCount}`, pw - 12, h - 6, { align: 'right' })
  }

  doc.save(`${opts.filename}.pdf`)
}
