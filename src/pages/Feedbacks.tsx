import { useState } from 'react'
import { CheckCheck, MessageSquare, AlertTriangle, ThumbsUp, Lightbulb, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { exportToCsv } from '../utils/exportCsv'
import { exportToPdf } from '../utils/exportPdf'
import type { Feedback } from '../types'
import Button from '../components/ui/Button'
import ExportMenu from '../components/ui/ExportMenu'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import clsx from 'clsx'

type TabFilter = 'todos' | 'nao-lidos' | Feedback['tipo']

const TIPO_CONFIG = {
  denuncia: { label: 'Denúncia', icon: <AlertTriangle size={14} />, badge: 'danger'  as const, bg: 'bg-red-50',     border: 'border-red-200' },
  sugestao: { label: 'Sugestão', icon: <Lightbulb    size={14} />, badge: 'gold'    as const, bg: 'bg-yellow-50',  border: 'border-yellow-200' },
  elogio:   { label: 'Elogio',   icon: <ThumbsUp     size={14} />, badge: 'success' as const, bg: 'bg-emerald-50', border: 'border-emerald-200' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Feedbacks() {
  const { feedbacks, markFeedbackRead, markAllFeedbackRead } = useApp()
  const toast = useToast()
  const [tab, setTab] = useState<TabFilter>('todos')

  const filtered = feedbacks.filter(f => {
    if (tab === 'todos')     return true
    if (tab === 'nao-lidos') return !f.lido
    return f.tipo === tab
  })

  const naoLidos = feedbacks.filter(f => !f.lido).length

  const handleMarkRead = (id: string) => {
    markFeedbackRead(id)
  }

  const handleMarkAllRead = () => {
    markAllFeedbackRead()
    toast.success('Todos os feedbacks marcados como lidos')
  }

  const feedbackRows = () => filtered.map(f => ({
    'Tipo':        f.tipo,
    'Mensagem':    f.mensagem,
    'Setor':       f.setor ?? '-',
    'Recebido em': formatDate(f.recebidoEm),
    'Lido':        f.lido ? 'Sim' : 'Não',
  }))

  const handleExportarCsv = () => {
    exportToCsv('feedbacks', feedbackRows())
    toast.success('Exportado!', `${filtered.length} feedback(s) exportados.`)
  }

  const handleExportarPdf = () => {
    exportToPdf({
      title:    'Feedbacks da Comunidade',
      subtitle: `${filtered.length} feedback(s) exportados · Laço Favela`,
      filename: 'feedbacks',
      columns: [
        { header: 'Tipo',        key: 'Tipo',        width: 20 },
        { header: 'Mensagem',    key: 'Mensagem' },
        { header: 'Setor',       key: 'Setor',        width: 25 },
        { header: 'Recebido em', key: 'Recebido em',  width: 30 },
        { header: 'Lido',        key: 'Lido',         width: 14 },
      ],
      rows: feedbackRows(),
    })
    toast.success('PDF gerado!', `${filtered.length} feedback(s).`)
  }

  return (
    <div className="space-y-6 max-w-[900px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {([
            { key: 'todos',     label: `Todos (${feedbacks.length})` },
            { key: 'nao-lidos', label: `Não lidos (${naoLidos})` },
            { key: 'denuncia',  label: 'Denúncias' },
            { key: 'sugestao',  label: 'Sugestões' },
            { key: 'elogio',    label: 'Elogios' },
          ] as { key: TabFilter; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={clsx('px-4 py-2 rounded-xl text-sm font-medium transition-all',
                tab === t.key ? 'bg-navy text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              )}>
              {t.label}
              {t.key === 'nao-lidos' && naoLidos > 0 && (
                <span className="ml-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] inline-flex items-center justify-center">{naoLidos}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {naoLidos > 0 && (
            <Button variant="outline" size="sm" icon={<CheckCheck size={14} />} onClick={handleMarkAllRead}>
              Marcar todos como lidos
            </Button>
          )}
          <ExportMenu onExportCsv={handleExportarCsv} onExportPdf={handleExportarPdf} />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center py-16 text-center">
              <MessageSquare size={32} className="text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500">Nenhum feedback encontrado</p>
            </div>
          </Card>
        ) : filtered.map(f => {
          const config = TIPO_CONFIG[f.tipo]
          return (
            <div key={f.id}
              className={clsx('rounded-2xl border p-5 transition-all shadow-card',
                !f.lido ? `${config.bg} ${config.border}` : 'bg-white border-gray-100'
              )}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', !f.lido ? 'bg-white' : 'bg-gray-100')}>
                    <span className={clsx(
                      f.tipo === 'denuncia' ? 'text-red-500' : f.tipo === 'sugestao' ? 'text-amber-500' : 'text-emerald-500'
                    )}>{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant={config.badge}>{config.label}</Badge>
                      {!f.lido && <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />}
                      {f.setor && <Badge variant="neutral">{f.setor}</Badge>}
                    </div>
                    <p className={clsx('text-sm leading-relaxed', !f.lido ? 'text-gray-800 font-medium' : 'text-gray-600')}>
                      {f.mensagem}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Recebido: {formatDate(f.recebidoEm)}</p>
                  </div>
                </div>
                {!f.lido && (
                  <button onClick={() => handleMarkRead(f.id)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Marcar como lido
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { tipo: 'denuncia', label: 'Denúncias', count: feedbacks.filter(f => f.tipo === 'denuncia').length, color: 'text-red-600' },
          { tipo: 'sugestao', label: 'Sugestões', count: feedbacks.filter(f => f.tipo === 'sugestao').length, color: 'text-amber-600' },
          { tipo: 'elogio',   label: 'Elogios',   count: feedbacks.filter(f => f.tipo === 'elogio').length,   color: 'text-emerald-600' },
        ].map(s => (
          <Card key={s.tipo} padding="md" className="text-center">
            <p className={clsx('text-3xl font-black', s.color)}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
