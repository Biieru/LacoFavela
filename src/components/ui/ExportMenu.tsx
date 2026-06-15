import { useState, useRef, useEffect } from 'react'
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface ExportMenuProps {
  onExportCsv?: () => void
  onExportPdf?: () => void
  label?:       string
  size?:        'sm' | 'md'
  variant?:     'primary' | 'secondary' | 'outline'
}

const VARIANT_CLS = {
  primary:   'bg-navy text-white hover:bg-navy-light border border-navy',
  secondary: 'bg-gold text-navy font-bold hover:bg-gold-dark border border-gold-dark',
  outline:   'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200',
}
const SIZE_CLS = { sm: 'h-8 text-xs px-3', md: 'h-9 text-sm px-4' }

export default function ExportMenu({
  onExportCsv,
  onExportPdf,
  label     = 'Exportar',
  size      = 'sm',
  variant   = 'outline',
}: ExportMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative inline-flex">
      {/* Main button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-xl font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-navy/20',
          VARIANT_CLS[variant],
          SIZE_CLS[size],
        )}
      >
        <Download size={size === 'sm' ? 13 : 15} />
        {label}
        <ChevronDown size={12} className={clsx('transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-48 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden animate-fade-in">
          {onExportCsv && (
            <button
              onClick={() => { onExportCsv(); setOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <FileSpreadsheet size={15} className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-medium">Exportar CSV</p>
                <p className="text-[11px] text-gray-400">Planilha editável</p>
              </div>
            </button>
          )}

          {onExportCsv && onExportPdf && (
            <div className="h-px bg-gray-100 mx-3" />
          )}

          {onExportPdf && (
            <button
              onClick={() => { onExportPdf(); setOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition-colors text-left"
            >
              <FileText size={15} className="text-red-500 shrink-0" />
              <div>
                <p className="font-medium">Exportar PDF</p>
                <p className="text-[11px] text-gray-400">Documento imprimível</p>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
