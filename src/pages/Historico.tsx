import { useState } from 'react'
import { Download, Database, Calendar, CheckCircle2, FileText, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { exportToCsv } from '../utils/exportCsv'
import { exportToPdf } from '../utils/exportPdf'
import { MOCK_CICLO_STATS } from '../data/mockData'
import type { HistoricoEvento } from '../types'
import Button from '../components/ui/Button'
import ExportMenu from '../components/ui/ExportMenu'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import clsx from 'clsx'

const TIPO_CONFIG: Record<HistoricoEvento['tipo'], {
  icon: React.ReactNode; bg: string; border: string; dot: string
  badge: 'success' | 'info' | 'gold' | 'neutral'; label: string
}> = {
  ciclo:      { icon: <Zap          size={16} />, bg: 'bg-navy/10',    border: 'border-navy/20',     dot: 'bg-navy',          badge: 'info',    label: 'Ciclo' },
  evento:     { icon: <Calendar     size={16} />, bg: 'bg-gold/15',   border: 'border-gold/30',    dot: 'bg-gold',          badge: 'gold',   label: 'Evento' },
  aprovacao:  { icon: <CheckCircle2 size={16} />, bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500',   badge: 'success', label: 'Aprovação' },
  formulario: { icon: <FileText     size={16} />, bg: 'bg-purple-50',  border: 'border-purple-200',  dot: 'bg-purple-500',    badge: 'neutral', label: 'Formulário' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Historico() {
  const { historico, ciclos } = useApp()
  const toast = useToast()
  const [todosOpen, setTodosOpen] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState<HistoricoEvento['tipo'] | 'todos'>('todos')

  const cicloStats = MOCK_CICLO_STATS
  const totalCiclos   = cicloStats.length
  const totalFamilias = cicloStats.reduce((acc, c) => acc + c.familiasBeneficiadas, 0)
  const totalEventos  = cicloStats.reduce((acc, c) => acc + c.eventosRealizados, 0)

  const filteredHistorico = historico.filter(h => filtroTipo === 'todos' || h.tipo === filtroTipo)

  const historicoRows = () => historico.map(h => ({
    'Data': formatDate(h.data), 'Tipo': TIPO_CONFIG[h.tipo].label,
    'Título': h.titulo, 'Descrição': h.descricao, 'Ciclo': h.ciclo ?? '-',
  }))
  const cicloRows = () => cicloStats.map(c => ({
    'Ciclo': c.ciclo, 'Período': c.mes,
    'Famílias Cadastradas': c.familiasCadastradas,
    'Famílias Beneficiadas': c.familiasBeneficiadas,
    'Eventos Realizados': c.eventosRealizados,
    'Taxa de Aprovação': `${c.taxaAprovacao}%`,
  }))

  const handleExportarHistoricoCsv = () => {
    exportToCsv('historico', historicoRows())
    toast.success('Histórico exportado!', `${historico.length} evento(s) no arquivo CSV.`)
  }
  const handleExportarHistoricoPdf = () => {
    exportToPdf({
      title:    'Histórico de Eventos',
      subtitle: `${historico.length} evento(s) · Favela Club`,
      filename: 'historico',
      columns: [
        { header: 'Data',       key: 'Data',       width: 32 },
        { header: 'Tipo',       key: 'Tipo',        width: 22 },
        { header: 'Título',     key: 'Título' },
        { header: 'Ciclo',      key: 'Ciclo',       width: 18 },
      ],
      rows: historicoRows(),
    })
    toast.success('PDF gerado!')
  }

  const handleExportarTodosDadosCsv = () => {
    exportToCsv('todos_os_ciclos', cicloRows())
    toast.success('Dados exportados!', 'Arquivo com todos os ciclos gerado.')
  }
  const handleExportarTodosDadosPdf = () => {
    exportToPdf({
      title:    'Resumo por Ciclo',
      subtitle: `${cicloStats.length} ciclo(s) · Favela Club`,
      filename: 'ciclos_resumo',
      columns: [
        { header: 'Ciclo',                 key: 'Ciclo',                  width: 20 },
        { header: 'Período',               key: 'Período',                width: 28 },
        { header: 'Fam. Cadastradas',      key: 'Famílias Cadastradas',   width: 30 },
        { header: 'Fam. Beneficiadas',     key: 'Famílias Beneficiadas',  width: 30 },
        { header: 'Eventos',               key: 'Eventos Realizados',     width: 22 },
        { header: 'Taxa Aprovação',        key: 'Taxa de Aprovação',      width: 25 },
      ],
      rows: cicloRows(),
    })
    toast.success('PDF gerado!', 'Resumo de ciclos.')
  }

  return (
    <div className="space-y-6 max-w-[1000px]">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="md" className="text-center">
          <p className="text-3xl font-black text-navy">{totalCiclos}</p>
          <p className="text-xs text-gray-500 mt-1">Total de Ciclos</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-3xl font-black text-emerald-600">{totalFamilias}</p>
          <p className="text-xs text-gray-500 mt-1">Famílias Beneficiadas</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-3xl font-black text-gold-dark">{totalEventos}</p>
          <p className="text-xs text-gray-500 mt-1">Eventos Realizados</p>
        </Card>
      </div>

      {/* Actions + Filtros */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-gray-900 text-lg mr-2">Linha do Tempo</h3>
          {(['todos', 'ciclo', 'evento', 'aprovacao', 'formulario'] as const).map(t => (
            <button key={t} onClick={() => setFiltroTipo(t)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                filtroTipo === t ? 'bg-navy text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              )}>
              {t === 'todos' ? 'Todos' : TIPO_CONFIG[t as HistoricoEvento['tipo']].label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Database size={14} />} onClick={() => setTodosOpen(true)}>
            Todos os dados
          </Button>
          <ExportMenu
            label="Exportar Histórico"
            variant="secondary"
            onExportCsv={handleExportarHistoricoCsv}
            onExportPdf={handleExportarHistoricoPdf}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />
        <div className="space-y-4 pl-14">
          {filteredHistorico.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">Nenhum evento encontrado.</p>
          ) : filteredHistorico.map((evento, idx) => {
            const config = TIPO_CONFIG[evento.tipo]
            return (
              <div key={evento.id} className="relative animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className={clsx('absolute -left-[3.25rem] top-4 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center', config.dot)}>
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className={clsx('rounded-2xl border p-5 bg-white shadow-card transition-all hover:shadow-hover', config.border)}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', config.bg)}>
                        <span className={clsx(
                          evento.tipo === 'ciclo' ? 'text-navy' : evento.tipo === 'evento' ? 'text-amber-600' :
                          evento.tipo === 'aprovacao' ? 'text-emerald-600' : 'text-purple-600'
                        )}>{config.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge variant={config.badge}>{config.label}</Badge>
                          {evento.ciclo && <Badge variant="neutral">{evento.ciclo}</Badge>}
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">{evento.titulo}</p>
                        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{evento.descricao}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">{formatDate(evento.data)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Resumo por ciclo */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Resumo por Ciclo</h3>
          <ExportMenu size="sm" onExportCsv={handleExportarTodosDadosCsv} onExportPdf={handleExportarTodosDadosPdf} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['CICLO','PERÍODO','FAM. CADASTRADAS','FAM. BENEFICIADAS','EVENTOS','TAXA APROVAÇÃO'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cicloStats.map(c => (
                <tr key={c.ciclo} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5"><Badge variant="info">{c.ciclo}</Badge></td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{c.mes}</td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{c.familiasCadastradas}</td>
                  <td className="px-4 py-3.5 text-sm font-medium text-emerald-600">{c.familiasBeneficiadas}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{c.eventosRealizados}</td>
                  <td className="px-4 py-3.5">
                    <span className={clsx('text-sm font-semibold', c.taxaAprovacao >= 10 ? 'text-emerald-600' : 'text-amber-500')}>
                      {c.taxaAprovacao}%
                    </span>
                  </td>
                </tr>
              ))}
              {/* Ciclos adicionados pelo usuário */}
              {ciclos.filter(c => !cicloStats.some(cs => cs.ciclo === c.nome)).map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5"><Badge variant={c.status === 'ativo' ? 'success' : 'neutral'}>{c.nome}</Badge></td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{c.periodo}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-400">—</td>
                  <td className="px-4 py-3.5 text-sm text-gray-400">—</td>
                  <td className="px-4 py-3.5 text-sm text-gray-400">—</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={c.status === 'ativo' ? 'success' : c.status === 'planejado' ? 'info' : 'neutral'} dot>
                      {c.status === 'ativo' ? 'Ativo' : c.status === 'planejado' ? 'Planejado' : 'Encerrado'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Todos os dados */}
      <Modal open={todosOpen} onClose={() => setTodosOpen(false)} title="Todos os Dados" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Selecione o conjunto de dados e o formato que deseja exportar:</p>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                label: 'Histórico completo', desc: `${historico.length} eventos`,
                onCsv: handleExportarHistoricoCsv, onPdf: handleExportarHistoricoPdf,
              },
              {
                label: 'Resumo por ciclo', desc: `${cicloStats.length} ciclos`,
                onCsv: handleExportarTodosDadosCsv, onPdf: handleExportarTodosDadosPdf,
              },
            ].map(item => (
              <div key={item.label}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-navy/20 transition-all">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <ExportMenu
                  onExportCsv={() => { item.onCsv(); setTodosOpen(false) }}
                  onExportPdf={() => { item.onPdf(); setTodosOpen(false) }}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
