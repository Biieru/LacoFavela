import { useState, useMemo } from 'react'
import { Download, UserCheck, Search, Eye, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { exportToCsv } from '../utils/exportCsv'
import { exportToPdf } from '../utils/exportPdf'
import type { Familia } from '../types'
import Button from '../components/ui/Button'
import ExportMenu from '../components/ui/ExportMenu'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import StatCard from '../components/ui/StatCard'
import clsx from 'clsx'

type CategoriaFilter = 'todos' | 'alta-participacao' | 'mae-solo' | 'tres-filhos' | 'renda-baixa'

const CRITERIO_LABELS: Record<string, string> = {
  'alta-participacao': 'Alta Participação',
  'mae-solo':          'Mãe Solo',
  'tres-filhos':       '+3 Filhos',
  'renda-baixa':       'Renda Baixa',
  'geral':             'Geral',
}
const CRITERIO_BADGE: Record<string, 'success' | 'info' | 'gold' | 'danger' | 'neutral'> = {
  'alta-participacao': 'success',
  'mae-solo':          'info',
  'tres-filhos':       'gold',
  'renda-baixa':       'danger',
  'geral':             'neutral',
}

export default function Familias() {
  const { familias, gerarAprovados } = useApp()
  const toast    = useToast()
  const navigate = useNavigate()

  const [categoria, setCategoria] = useState<CategoriaFilter>('todos')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<Set<string>>(new Set())
  const [viewing, setViewing]     = useState<Familia | null>(null)

  const stats = useMemo(() => ({
    total:        familias.length,
    altaParticip: familias.filter(f => f.criterio === 'alta-participacao').length,
    maeSolo:      familias.filter(f => f.maeSolo).length,
    semParticip:  familias.filter(f => f.participacoes === 0).length,
  }), [familias])

  const filtered = useMemo(() =>
    familias
      .filter(f =>
        (categoria === 'todos' || f.criterio === categoria) &&
        (search === '' || f.name.toLowerCase().includes(search.toLowerCase()) || f.presidenteName.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => b.score - a.score),
    [familias, categoria, search]
  )

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(f => f.id)))
  }

  const handleGerarAprovados = () => {
    if (selected.size === 0) return
    gerarAprovados([...selected])
    toast.success(
      `${selected.size} família(s) enviadas para aprovação`,
      'Acesse a página de Aprovados para revisar.'
    )
    setSelected(new Set())
    setTimeout(() => navigate('/aprovados'), 1200)
  }

  const familiaRows = () => filtered.map(f => ({
    'Família':    f.name,
    'Presidente': f.presidenteName,
    'Filhos':     f.filhos,
    'Mãe Solo':   f.maeSolo ? 'Sim' : 'Não',
    'Participações': f.participacoes,
    'Score':      f.score,
    'Critério':   CRITERIO_LABELS[f.criterio],
    'Status':     f.status,
  }))

  const handleExportarCsv = () => {
    exportToCsv('familias', filtered.map(f => ({
      ...familiaRows().find(r => r['Família'] === f.name),
      'Renda Familiar': f.rendaFamiliar,
      'Pré-Aprovado': f.preAprovado ? 'Sim' : 'Não',
    })))
    toast.success('Exportado!', `${filtered.length} família(s) no arquivo CSV.`)
  }

  const handleExportarPdf = () => {
    exportToPdf({
      title:    'Lista de Famílias',
      subtitle: `${filtered.length} família(s) cadastrada(s) · Laço Favela`,
      filename: 'familias',
      columns: [
        { header: 'Família',      key: 'Família' },
        { header: 'Presidente',   key: 'Presidente', width: 35 },
        { header: 'Filhos',       key: 'Filhos',     width: 15 },
        { header: 'Mãe Solo',     key: 'Mãe Solo',   width: 18 },
        { header: 'Participações',key: 'Participações', width: 26 },
        { header: 'Score',        key: 'Score',      width: 16 },
        { header: 'Status',       key: 'Status',     width: 20 },
      ],
      rows: familiaRows(),
    })
    toast.success('PDF gerado!', `${filtered.length} família(s).`)
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar família..."
            className="h-9 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors w-52" />
        </div>
        <div className="flex gap-2">
          <ExportMenu label="Exportar lista" onExportCsv={handleExportarCsv} onExportPdf={handleExportarPdf} />
          <Button variant="secondary" size="sm" icon={<UserCheck size={14} />}
            disabled={selected.size === 0} onClick={handleGerarAprovados}>
            Gerar Aprovados {selected.size > 0 && `(${selected.size})`}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Famílias"  value={stats.total}        iconBg="bg-navy/10" />
        <StatCard label="Alta Participação"  value={stats.altaParticip} iconBg="bg-emerald-50" />
        <StatCard label="Mães Solo"          value={stats.maeSolo}      iconBg="bg-blue-50" />
        <StatCard label="Sem Participação"   value={stats.semParticip}  iconBg="bg-red-50" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {([
          { key: 'todos',             label: 'Todos' },
          { key: 'alta-participacao', label: 'Alta Participação' },
          { key: 'mae-solo',          label: 'Mães Solo' },
          { key: 'tres-filhos',       label: '+3 Filhos' },
          { key: 'renda-baixa',       label: 'Renda Baixa' },
        ] as { key: CategoriaFilter; label: string }[]).map(opt => (
          <button key={opt.key} onClick={() => setCategoria(opt.key)}
            className={clsx('px-4 py-2 rounded-xl text-sm font-medium transition-all',
              categoria === opt.key ? 'bg-navy text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            )}>
            {opt.label}
          </button>
        ))}
      </div>

      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Ranking de Famílias</h3>
          <p className="text-xs text-gray-400">Ordenado por pontuação de engajamento</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={selectAll}
                    className="rounded border-gray-300 text-navy focus:ring-navy/30" />
                </th>
                {['RANK','FAMÍLIA','PRESIDENTE RESP.','FILHOS','PART.','PRES. (%)','SCORE','PRÉ-APROV.'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-16 text-center text-sm text-gray-400">Nenhuma família encontrada.</td></tr>
              ) : filtered.map((f, idx) => (
                <tr key={f.id}
                  className={clsx('border-b border-gray-50 hover:bg-gray-50/50 transition-colors', selected.has(f.id) && 'bg-blue-50/30')}>
                  <td className="px-4 py-3.5">
                    <input type="checkbox" checked={selected.has(f.id)} onChange={() => toggleSelect(f.id)}
                      className="rounded border-gray-300 text-navy focus:ring-navy/30" />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                      idx === 0 ? 'bg-gold text-navy' : idx === 1 ? 'bg-gray-200 text-gray-600' : idx === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                    )}>{idx + 1}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-800">{f.name}</p>
                    <Badge variant={CRITERIO_BADGE[f.criterio]} className="mt-0.5">{CRITERIO_LABELS[f.criterio]}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{f.presidenteName}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{f.filhos}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{f.participacoes}</td>
                  <td className="px-4 py-3.5">
                    <span className={clsx('text-sm font-semibold',
                      f.participacoes >= 10 ? 'text-emerald-600' : f.participacoes >= 5 ? 'text-amber-500' : 'text-red-500'
                    )}>{Math.round((f.participacoes / 14) * 100)}%</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${f.score}%`, backgroundColor: f.score >= 80 ? '#162550' : f.score >= 60 ? '#f5a623' : '#ef4444' }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{f.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {f.preAprovado ? <Badge variant="success" dot>Pré-aprovado</Badge> : <Badge variant="neutral">Pendente</Badge>}
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setViewing(f)} className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-navy/10 transition-colors"><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-400">
            {selected.size} família(s) selecionada(s) de {filtered.length}
          </p>
          <Button variant="secondary" size="sm" icon={<UserCheck size={14} />}
            disabled={selected.size === 0} onClick={handleGerarAprovados}>
            Confirmar seleção e gerar aprovados
          </Button>
        </div>
      </Card>

      {/* Detalhe */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Detalhes da Família" size="md">
        {viewing && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{viewing.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">Presidente: {viewing.presidenteName}</p>
              </div>
              <Badge variant={CRITERIO_BADGE[viewing.criterio]}>{CRITERIO_LABELS[viewing.criterio]}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Score',          value: viewing.score,                                      highlight: true },
                { label: 'Participações',  value: viewing.participacoes },
                { label: 'Filhos',         value: viewing.filhos },
                { label: 'Renda Familiar', value: `R$ ${viewing.rendaFamiliar.toLocaleString('pt-BR')}` },
                { label: 'Mãe Solo',       value: viewing.maeSolo ? 'Sim' : 'Não' },
                { label: 'Status',         value: viewing.status },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className={clsx('text-sm font-semibold mt-0.5', item.highlight ? 'text-navy text-lg' : 'text-gray-800')}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
              <Star size={16} className={viewing.preAprovado ? 'text-gold' : 'text-gray-300'} fill={viewing.preAprovado ? '#f5a623' : 'none'} />
              <span className="text-sm font-medium text-gray-700">
                {viewing.preAprovado ? 'Família pré-aprovada para o ciclo atual' : 'Não pré-aprovada ainda'}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
