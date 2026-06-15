import { Trophy, FileText, Star } from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts'
import { PRESIDENTE_STATS, HISTORICO_COTAS, METAS_RECOMPENSAS } from '../../data/mockData'
import { exportToPdf } from '../../utils/exportPdf'
import { exportToCsv } from '../../utils/exportCsv'
import { useToast } from '../../context/ToastContext'
import Card from '../../components/ui/Card'
import ExportMenu from '../../components/ui/ExportMenu'
import clsx from 'clsx'

const META_ICONS = {
  trophy: <Trophy  size={16} />,
  file:   <FileText size={16} />,
  star:   <Star    size={16} />,
}

const DONUT_DATA = [
  { name: 'Realizadas', value: PRESIDENTE_STATS.cotaRealizada },
  { name: 'Restantes',  value: PRESIDENTE_STATS.cotaMes - PRESIDENTE_STATS.cotaRealizada },
]
const DONUT_COLORS = ['#162550', '#e5e7eb']

export default function MeuIndicador() {
  const toast = useToast()
  const pct = Math.round((PRESIDENTE_STATS.cotaRealizada / PRESIDENTE_STATS.cotaMes) * 100)

  const cotaRows = HISTORICO_COTAS.map(c => ({
    'Mês': c.mes, 'Percentual': `${c.pct}%`,
    'Status': c.pct >= 100 ? 'Meta atingida' : c.pct >= 80 ? 'Bom progresso' : 'Abaixo da meta',
  }))

  const handleExportarCsv = () => {
    exportToCsv('meu_indicador', cotaRows)
    toast.success('Exportado!', 'Histórico de cotas em CSV.')
  }

  const handleExportarPdf = () => {
    exportToPdf({
      title:    'Meu Indicador de Desempenho',
      subtitle: `${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} · Laço Favela`,
      filename: 'meu_indicador',
      columns: [
        { header: 'Mês',        key: 'Mês' },
        { header: 'Percentual', key: 'Percentual', width: 28 },
        { header: 'Status',     key: 'Status' },
      ],
      rows: cotaRows,
    })
    toast.success('PDF gerado!', 'Indicador exportado.')
  }

  return (
    <div className="space-y-5 max-w-[1100px]">
      <div className="flex justify-end">
        <ExportMenu onExportCsv={handleExportarCsv} onExportPdf={handleExportarPdf} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-5">
          {/* Donut cota */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-5">
              Cotas de visitas — {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h3>

            <div className="flex items-center gap-8 flex-wrap">
              <div className="relative w-40 h-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DONUT_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={72}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {DONUT_DATA.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} visitas`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-2xl font-black text-navy">{pct}%</p>
                  <p className="text-[10px] text-gray-400">{PRESIDENTE_STATS.cotaRealizada} pts</p>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">{PRESIDENTE_STATS.cotaMes - PRESIDENTE_STATS.cotaRealizada} visitas</span> para completar a cota
                </p>
                <p className="text-xs text-gray-400">
                  {PRESIDENTE_STATS.diasRestantes} dias restantes neste mês
                </p>
                {[
                  { label: 'Visitas realizadas', value: PRESIDENTE_STATS.cotaRealizada, color: 'bg-navy' },
                  { label: 'Meta do mês',         value: PRESIDENTE_STATS.cotaMes,       color: 'bg-gray-200' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className={clsx('w-3 h-3 rounded-sm', item.color)} />
                    {item.label}: <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Histórico de cotas */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-4">Histórico de cotas</h3>
            <div className="space-y-3">
              {HISTORICO_COTAS.map(c => (
                <div key={c.mes} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-36 shrink-0">{c.mes}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${c.pct}%`,
                        backgroundColor: c.pct >= 100 ? '#10b981' : c.pct >= 80 ? '#162550' : '#f5a623',
                      }}
                    />
                  </div>
                  <span className={clsx(
                    'text-sm font-bold w-12 text-right shrink-0',
                    c.pct >= 100 ? 'text-emerald-600' : c.pct >= 80 ? 'text-navy' : 'text-amber-500',
                  )}>
                    {c.pct}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar direita */}
        <div className="space-y-4">
          {/* Metas e recompensas */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-4">Metas e Recompensas</h3>
            <div className="space-y-3">
              {METAS_RECOMPENSAS.map((meta, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center text-navy shrink-0">
                    {META_ICONS[meta.icon as keyof typeof META_ICONS]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{meta.titulo}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{meta.recompensa}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Desempenho mensal */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-4">Desempenho Mensal</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Metas de visitas (meta)', value: PRESIDENTE_STATS.cotaMes,          color: '' },
                { label: 'Visitas realizadas',       value: PRESIDENTE_STATS.cotaRealizada,    color: 'text-navy font-bold' },
                { label: 'Famílias sem visita',       value: PRESIDENTE_STATS.cotaMes - PRESIDENTE_STATS.cotaRealizada, color: 'text-red-500 font-bold' },
                { label: 'Formulários enviados',      value: 12,                                color: '' },
                { label: 'Taxa de cobertura',         value: `${Math.round((PRESIDENTE_STATS.cotaRealizada / PRESIDENTE_STATS.cotaMes) * 100)}%`, color: 'text-navy font-bold' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <p className="text-xs text-gray-600">{item.label}</p>
                  <p className={clsx('text-sm', item.color || 'text-gray-800')}>{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
