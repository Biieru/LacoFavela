import { CheckCircle2, Clock, Circle, Calendar, MapPin, ChevronRight } from 'lucide-react'
import { MOCK_PROCESSO_MORADOR, MOCK_EVENTOS_COMUNIDADE } from '../../data/mockData'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import clsx from 'clsx'

type EtapaStatus = 'concluido' | 'pendente'

const STATUS_CONFIG: Record<EtapaStatus, { icon: React.ReactNode; color: string; bg: string; ring: string }> = {
  concluido: { icon: <CheckCircle2 size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-500', ring: 'ring-emerald-200' },
  pendente:  { icon: <Circle       size={20} />, color: 'text-gray-300',    bg: 'bg-gray-200',    ring: 'ring-gray-100' },
}

const EVENTO_TYPE: Record<string, string> = {
  reuniao: 'Reunião',
  acao:    'Ação',
  evento:  'Evento',
}

function formatDate(iso: string) {
  if (!iso) return 'A definir'
  return new Date(iso).toLocaleString('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatEventDate(iso: string) {
  const d = new Date(iso)
  return {
    dia:      d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    diaSem:   d.toLocaleDateString('pt-BR', { weekday: 'short' }),
    hora:     d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    diaNum:   d.getDate(),
    mes:      d.toLocaleDateString('pt-BR', { month: 'short' }),
  }
}

export default function Acompanhamento() {
  const proc    = MOCK_PROCESSO_MORADOR
  const eventos = MOCK_EVENTOS_COMUNIDADE

  const etapasConc  = proc.etapas.filter(e => e.status === 'concluido').length
  const pctProgresso = Math.round((etapasConc / proc.etapas.length) * 100)

  return (
    <div className="space-y-6 max-w-[1100px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Histórico do processo */}
        <div className="lg:col-span-2 space-y-4">
          <Card padding="md">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Histórico de Processo</h3>
                <p className="text-sm text-gray-500 mt-0.5">{proc.nome}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Início: {new Date(proc.inicio).toLocaleDateString('pt-BR')} —{' '}
                  Fim: {new Date(proc.fim).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex items-center gap-2 mt-1.5 justify-end">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-navy rounded-full transition-all duration-700" style={{ width: `${pctProgresso}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{pctProgresso}%</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-6 pl-14">
                {proc.etapas.map((etapa, idx) => {
                  const config = STATUS_CONFIG[etapa.status]
                  const isLast = idx === proc.etapas.length - 1
                  return (
                    <div key={etapa.id} className="relative">
                      {/* Dot */}
                      <div className={clsx(
                        'absolute -left-[3.5rem] top-0.5 w-10 h-10 rounded-full flex items-center justify-center ring-4 bg-white',
                        config.ring,
                      )}>
                        <span className={config.color}>{config.icon}</span>
                      </div>

                      <div                     className={clsx(
                        'rounded-xl p-4 transition-all',
                        etapa.status === 'concluido'
                          ? 'bg-gray-50 border border-gray-100'
                          : 'bg-white border border-dashed border-gray-200 opacity-60',
                      )}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={clsx('text-sm font-semibold',
                                etapa.status === 'concluido' ? 'text-gray-800' : 'text-gray-400'
                              )}>
                                {etapa.titulo}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{etapa.descricao}</p>
                          </div>
                          {etapa.data && (
                            <p className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
                              {formatDate(etapa.data)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {pctProgresso === 100 && (
              <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-medium text-center">
                ✓ Processo concluído com sucesso!
              </div>
            )}
          </Card>
        </div>

        {/* Próximos eventos */}
        <div className="space-y-3">
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-4">Próximos Eventos</h3>
            <div className="space-y-3">
              {eventos.map(ev => {
                const { diaNum, mes, hora } = formatEventDate(ev.data)
                return (
                  <div key={ev.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-navy/30 hover:bg-navy/3 transition-all cursor-pointer group">
                    <div className="w-11 h-11 rounded-xl bg-navy flex flex-col items-center justify-center text-white shrink-0">
                      <p className="text-sm font-bold leading-none">{diaNum}</p>
                      <p className="text-[9px] text-white/70 uppercase leading-none mt-0.5">{mes}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-navy transition-colors line-clamp-1">
                        {ev.titulo}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Clock size={10} /> {hora}
                      </div>
                      <div className="flex items-start gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin size={10} className="shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{ev.local}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-navy transition-colors shrink-0 mt-1" />
                  </div>
                )
              })}
            </div>
          </Card>

          <Card padding="md">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Legenda</p>
            <div className="space-y-2">
              {([
                { status: 'concluido', label: 'Etapa concluída' },
                { status: 'pendente',  label: 'Pendente' },
              ] as const).map(item => (
                <div key={item.status} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className={clsx('w-2.5 h-2.5 rounded-full', STATUS_CONFIG[item.status].bg)} />
                  {item.label}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
