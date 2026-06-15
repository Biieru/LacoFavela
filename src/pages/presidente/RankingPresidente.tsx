import { Trophy, TrendingUp } from 'lucide-react'
import { RANKING_PRESIDENTES, MINHA_PONTUACAO } from '../../data/mockData'
import { useToast } from '../../context/ToastContext'
import Card from '../../components/ui/Card'
import ExportMenu from '../../components/ui/ExportMenu'
import { exportToCsv } from '../../utils/exportCsv'
import clsx from 'clsx'

const top3 = [...RANKING_PRESIDENTES].sort((a, b) => b.pontos - a.pontos).slice(0, 3)
const podiumOrder = [top3[1], top3[0], top3[2]] // 2°, 1°, 3°
const podiumHeight = ['h-20', 'h-28', 'h-16']
const podiumPos    = [2, 1, 3]

export default function RankingPresidente() {
  const toast = useToast()
  const eu = RANKING_PRESIDENTES.find(r => r.isMe)

  const rankingRows = () => RANKING_PRESIDENTES.map((p, i) => ({
    'Posição': `${i + 1}°`, 'Nome': p.nome, 'Setor': p.setor,
    'Famílias Visitadas': p.familias, 'Pontos': p.pontos,
  }))

  const handleExportarCsv = () => {
    exportToCsv('ranking_presidentes', rankingRows())
    toast.success('Exportado!', 'Ranking exportado em CSV.')
  }

  const handleExportarPdf = async () => {
    const { exportToPdf } = await import('../../utils/exportPdfLoader')
    await exportToPdf({
      title:    'Ranking de Presidentes',
      subtitle: `${RANKING_PRESIDENTES.length} presidente(s) classificados · Laço Favela`,
      filename: 'ranking_presidentes',
      columns: [
        { header: 'Pos.',      key: 'Posição',            width: 14 },
        { header: 'Nome',      key: 'Nome' },
        { header: 'Setor',     key: 'Setor',              width: 32 },
        { header: 'Famílias',  key: 'Famílias Visitadas', width: 24 },
        { header: 'Pontos',    key: 'Pontos',             width: 18 },
      ],
      rows: rankingRows(),
    })
    toast.success('PDF gerado!', 'Ranking exportado.')
  }

  return (
    <div className="space-y-5 max-w-[1100px]">
      <div className="flex justify-end">
        <ExportMenu onExportCsv={handleExportarCsv} onExportPdf={handleExportarPdf} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Classificação */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pódio */}
          <Card padding="md">
            <div className="flex items-end justify-center gap-4 pt-4 pb-2">
              {podiumOrder.map((p, i) => p && (
                <div key={p.id} className="flex flex-col items-center gap-2">
                  {/* Avatar */}
                  <div className={clsx(
                    'w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2',
                    podiumPos[i] === 1 ? 'bg-gold border-gold-dark text-navy scale-110' :
                    podiumPos[i] === 2 ? 'bg-gray-200 border-gray-300 text-gray-700' :
                    'bg-amber-100 border-amber-200 text-amber-700',
                  )}>
                    {p.iniciais}
                  </div>
                  <p className="text-xs font-semibold text-gray-700 text-center max-w-[80px] leading-tight">{p.nome}</p>

                  {/* Bloco */}
                  <div className={clsx(
                    'w-24 rounded-t-xl flex flex-col items-center justify-center',
                    podiumHeight[i],
                    podiumPos[i] === 1 ? 'bg-navy text-white' :
                    podiumPos[i] === 2 ? 'bg-gray-300 text-gray-700' :
                    'bg-gray-200 text-gray-600',
                  )}>
                    <p className="text-xl font-black">{podiumPos[i]}°</p>
                    <p className="text-xs font-semibold">{p.pontos} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Classificação geral */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Classificação Geral</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {RANKING_PRESIDENTES.map((p, idx) => (
                <div key={p.id} className={clsx(
                  'flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors',
                  p.isMe && 'bg-navy/5',
                )}>
                  <span className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    idx === 0 ? 'bg-gold text-navy' :
                    idx === 1 ? 'bg-gray-200 text-gray-600' :
                    idx === 2 ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-500',
                  )}>
                    {idx + 1}
                  </span>

                  <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy text-sm shrink-0">
                    {p.iniciais}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-sm font-semibold', p.isMe ? 'text-navy' : 'text-gray-800')}>
                      {p.nome}{p.isMe && ' (você)'}
                    </p>
                    <p className="text-xs text-gray-400">{p.setor} · {p.familias} famílias visitadas</p>
                  </div>

                  <span className={clsx('text-sm font-bold shrink-0', p.isMe ? 'text-navy' : 'text-gray-600')}>
                    {p.pontos} pts
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Minha pontuação */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-4">Minha Pontuação</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Visitas realizadas',   value: `+${MINHA_PONTUACAO.visitasRealizadas} pts` },
                { label: 'Formulários enviados', value: `+${MINHA_PONTUACAO.formulariosEnviados} pts` },
                { label: 'Cota atingida',        value: `+${MINHA_PONTUACAO.cotaAtingida} pts` },
                { label: 'Bônus pontualidade',   value: `+${MINHA_PONTUACAO.bonusPontualidade} pts` },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <p className="text-xs text-gray-600">{item.label}</p>
                  <p className="text-xs font-bold text-emerald-600">{item.value}</p>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm font-bold text-gray-900">Total</p>
                <p className="text-lg font-black text-navy">{MINHA_PONTUACAO.total} pts</p>
              </div>
            </div>
          </Card>

          {/* Como subir */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={15} className="text-navy" /> Como subir no Ranking
            </h3>
            <div className="space-y-2">
              {[
                { acao: 'Visita realizada',    pts: '+3 pts',       color: 'text-navy' },
                { acao: 'Formulário enviado',  pts: '+3 pts',       color: 'text-navy' },
                { acao: 'Cota 100% no mês',    pts: '+10 pts',      color: 'text-emerald-600' },
                { acao: 'Envio em até 24h',    pts: '+1 bônus',     color: 'text-gold-dark' },
              ].map(item => (
                <div key={item.acao} className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">{item.acao}</p>
                  <span className={clsx('text-xs font-bold', item.color)}>{item.pts}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
