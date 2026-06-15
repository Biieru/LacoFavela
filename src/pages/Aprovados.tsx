import { useState, useMemo } from 'react'
import { Download, CheckCircle2, XCircle, Clock, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { exportToCsv } from '../utils/exportCsv'
import { exportToPdf } from '../utils/exportPdf'
import type { Aprovado } from '../types'
import Button from '../components/ui/Button'
import ExportMenu from '../components/ui/ExportMenu'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import clsx from 'clsx'

type StatusFilter = 'todos' | Aprovado['status']

const STATUS_MAP = {
  aprovado: { label: 'Aprovado', variant: 'success' as const, icon: <CheckCircle2 size={13} /> },
  pendente: { label: 'Pendente', variant: 'warning' as const, icon: <Clock        size={13} /> },
  recusado: { label: 'Recusado', variant: 'danger'  as const, icon: <XCircle      size={13} /> },
}

export default function Aprovados() {
  const { aprovados, updateAprovado } = useApp()
  const toast = useToast()

  const [statusFilter,   setStatusFilter]   = useState<StatusFilter>('todos')
  const [criterioFilter, setCriterioFilter] = useState('todos')
  const [search, setSearch]                 = useState('')

  const criterios = useMemo(() => ['todos', ...new Set(aprovados.map(a => a.criterio))], [aprovados])

  const filtered = useMemo(() =>
    aprovados.filter(a =>
      (statusFilter === 'todos' || a.status === statusFilter) &&
      (criterioFilter === 'todos' || a.criterio === criterioFilter) &&
      (search === '' || a.familiaName.toLowerCase().includes(search.toLowerCase()) || a.presidenteName.toLowerCase().includes(search.toLowerCase()))
    ).sort((a, b) => b.pontuacao - a.pontuacao),
    [aprovados, statusFilter, criterioFilter, search]
  )

  const stats = useMemo(() => ({
    aprovados: aprovados.filter(a => a.status === 'aprovado').length,
    pendentes: aprovados.filter(a => a.status === 'pendente').length,
    taxa:      aprovados.length > 0 ? Math.round((aprovados.filter(a => a.status === 'aprovado').length / aprovados.length) * 100) : 0,
  }), [aprovados])

  const handleStatus = (id: string, status: Aprovado['status'], nome: string) => {
    updateAprovado(id, {
      status,
      dataAprovacao: status === 'aprovado' ? new Date().toISOString().split('T')[0] : undefined,
    })
    if (status === 'aprovado') toast.success('Família aprovada!', nome)
    else if (status === 'recusado') toast.warning('Família recusada', nome)
    else toast.info('Status revertido', nome)
  }

  const aprovadoRows = () => filtered.map(a => ({
    'Família':    a.familiaName,
    'Presidente': a.presidenteName,
    'Pontuação':  a.pontuacao,
    'Critério':   a.criterio,
    'Status':     a.status,
    'Ciclo':      a.ciclo,
    'Aprovado em':a.dataAprovacao ?? '-',
  }))

  const handleExportarCsv = () => {
    exportToCsv('aprovados', aprovadoRows())
    toast.success('Exportado!', `${filtered.length} registro(s) no arquivo CSV.`)
  }

  const handleExportarPdf = () => {
    exportToPdf({
      title:    'Famílias Aprovadas',
      subtitle: `Ciclo 3 · ${filtered.length} registro(s) · Laço Favela`,
      filename: 'aprovados',
      columns: [
        { header: 'Família',    key: 'Família' },
        { header: 'Presidente', key: 'Presidente', width: 35 },
        { header: 'Pontuação',  key: 'Pontuação',  width: 20 },
        { header: 'Critério',   key: 'Critério',   width: 28 },
        { header: 'Status',     key: 'Status',     width: 20 },
        { header: 'Aprovado em',key: 'Aprovado em',width: 26 },
      ],
      rows: aprovadoRows(),
    })
    toast.success('PDF gerado!', `${filtered.length} registro(s).`)
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Ciclo header */}
      <Card padding="md">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Seleção do Ciclo</h2>
            <p className="text-sm text-gray-500 mt-0.5">Ciclo 3 — vigente</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-600">{stats.aprovados}</p>
              <p className="text-xs text-gray-500">Aprovadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-amber-500">{stats.pendentes}</p>
              <p className="text-xs text-gray-500">Pendentes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-navy">{stats.taxa}%</p>
              <p className="text-xs text-gray-500">Taxa</p>
            </div>
            <ExportMenu label="Exportar Histórico" onExportCsv={handleExportarCsv} onExportPdf={handleExportarPdf} />
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar família..."
            className="h-9 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors w-48" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['todos','aprovado','pendente','recusado'] as StatusFilter[]).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                statusFilter === s ? 'bg-navy text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              )}>
              {s === 'todos' ? `Todos (${aprovados.length})` : `${STATUS_MAP[s as Aprovado['status']].label} (${aprovados.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {criterios.map(c => (
            <button key={c} onClick={() => setCriterioFilter(c)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                criterioFilter === c ? 'bg-gold text-navy' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              )}>
              {c === 'todos' ? 'Todos' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">
            Famílias Aprovadas
            {filtered.length !== aprovados.length && (
              <span className="ml-2 text-xs text-gray-400 font-normal">
                ({filtered.length} de {aprovados.length})
              </span>
            )}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">#</th>
                {['FAMÍLIA','PRESIDENTE','PONTUAÇÃO','CRITÉRIO PRINCIPAL','STATUS','AÇÕES'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">Nenhuma família encontrada.</td></tr>
              ) : filtered.map((a, idx) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm text-gray-400 font-medium">{idx + 1}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-800">{a.familiaName}</p>
                    {a.dataAprovacao && <p className="text-xs text-gray-400 mt-0.5">{new Date(a.dataAprovacao).toLocaleDateString('pt-BR')}</p>}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{a.presidenteName}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-navy" style={{ width: `${a.pontuacao}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{a.pontuacao}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><Badge variant="info">{a.criterio}</Badge></td>
                  <td className="px-4 py-3.5"><Badge variant={STATUS_MAP[a.status].variant} dot>{STATUS_MAP[a.status].label}</Badge></td>
                  <td className="px-4 py-3.5">
                    {a.status === 'pendente' && (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleStatus(a.id, 'aprovado', a.familiaName)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium hover:bg-emerald-100 transition-colors flex items-center gap-1">
                          <CheckCircle2 size={12} /> Aprovar
                        </button>
                        <button onClick={() => handleStatus(a.id, 'recusado', a.familiaName)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors flex items-center gap-1">
                          <XCircle size={12} /> Recusar
                        </button>
                      </div>
                    )}
                    {a.status !== 'pendente' && (
                      <button onClick={() => handleStatus(a.id, 'pendente', a.familiaName)}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors">
                        Reverter
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
