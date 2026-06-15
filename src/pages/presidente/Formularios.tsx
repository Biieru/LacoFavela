import { Eye, Edit2, FileText } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { exportToCsv } from '../../utils/exportCsv'
import Badge from '../../components/ui/Badge'
import ExportMenu from '../../components/ui/ExportMenu'
import clsx from 'clsx'

const STATUS_BADGE: Record<string, 'success' | 'neutral' | 'danger'> = {
  ativo: 'success', rascunho: 'neutral', encerrado: 'danger',
}
const STATUS_LABELS: Record<string, string> = {
  ativo: 'Ativo', rascunho: 'Rascunho', encerrado: 'Encerrado',
}

export default function PresidenteFormularios() {
  const { formularios } = useApp()
  const toast = useToast()

  const handleDownloadCsv = (titulo: string) => {
    exportToCsv(`formulario_${titulo}`, [{ Formulário: titulo, Baixado: new Date().toLocaleDateString('pt-BR') }])
    toast.success('Download CSV iniciado!', titulo)
  }

  const handleDownloadPdf = async (titulo: string, status: string, respostas: number) => {
    const { exportToPdf } = await import('../../utils/exportPdfLoader')
    await exportToPdf({
      title:    titulo,
      subtitle: `Status: ${status} · ${respostas} resposta(s) · Laço Favela`,
      filename: `formulario_${titulo.replace(/\s/g, '_')}`,
      columns: [
        { header: 'Campo',  key: 'Campo' },
        { header: 'Valor',  key: 'Valor' },
      ],
      rows: [
        { 'Campo': 'Formulário',  'Valor': titulo },
        { 'Campo': 'Status',      'Valor': status },
        { 'Campo': 'Respostas',   'Valor': respostas },
        { 'Campo': 'Exportado em','Valor': new Date().toLocaleDateString('pt-BR') },
      ],
    })
    toast.success('PDF gerado!', titulo)
  }

  return (
    <div className="space-y-5 max-w-[800px]">
      <div className="space-y-2">
        {formularios.map(f => (
          <div
            key={f.id}
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-card px-5 py-4 hover:shadow-hover transition-shadow group"
          >
            <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
              <FileText size={16} className="text-navy" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{f.titulo}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={STATUS_BADGE[f.status]}>{STATUS_LABELS[f.status]}</Badge>
                {f.encerraEm && (
                  <span className="text-xs text-gray-400">
                    Prazo: {new Date(f.encerraEm).toLocaleDateString('pt-BR')}
                  </span>
                )}
                <span className="text-xs text-gray-400">{f.respostas} respostas</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                title="Visualizar"
                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Eye size={15} />
              </button>
              {f.status !== 'encerrado' && (
                <button
                  title="Preencher"
                  className="p-2 rounded-lg text-gray-400 hover:text-gold-dark hover:bg-gold/15 transition-colors"
                >
                  <Edit2 size={15} />
                </button>
              )}
              <ExportMenu
                size="sm"
                variant="outline"
                onExportCsv={() => handleDownloadCsv(f.titulo)}
                onExportPdf={() => handleDownloadPdf(f.titulo, f.status, f.respostas)}
              />
            </div>
          </div>
        ))}

        {formularios.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            <FileText size={28} className="mx-auto mb-2 text-gray-200" />
            Nenhum formulário disponível.
          </div>
        )}
      </div>
    </div>
  )
}
