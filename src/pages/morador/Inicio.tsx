import { useNavigate } from 'react-router-dom'
import { Activity, Calendar, MessageSquare, Award, ChevronRight, Bell, Clock, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { MOCK_EVENTOS_COMUNIDADE, MOCK_MORADOR_NOTIFICACOES, NIVEIS_ENGAJAMENTO, MORADOR_PONTOS_ATUAL } from '../../data/mockData'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import clsx from 'clsx'

const QUICK_ACTIONS = [
  { label: 'Meu Acompanhamento', desc: 'Veja o status do seu processo',     rota: '/acompanhamento', icon: Activity,     color: 'bg-navy/10 text-navy' },
  { label: 'Próximos Eventos',    desc: 'Reuniões e ações da comunidade',    rota: '/acompanhamento', icon: Calendar,     color: 'bg-gold/20 text-amber-700' },
  { label: 'Enviar Feedback',     desc: 'Envie sua opinião anonimamente',    rota: '/feedback',       icon: MessageSquare,color: 'bg-purple-100 text-purple-600' },
  { label: 'Meu Ranking',         desc: 'Veja sua posição e seus pontos',    rota: '/ranking',        icon: Award,        color: 'bg-emerald-100 text-emerald-600' },
]

const EVENTO_TIPO_COLOR = {
  reuniao: 'bg-blue-100 text-blue-700',
  acao:    'bg-emerald-100 text-emerald-700',
  evento:  'bg-purple-100 text-purple-700',
}

function formatEventDate(iso: string) {
  const d = new Date(iso)
  return {
    dia:  d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    hora: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  }
}

export default function MoradorInicio() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const nivelAtual = [...NIVEIS_ENGAJAMENTO].reverse().find(n => MORADOR_PONTOS_ATUAL >= n.minPontos) ?? NIVEIS_ENGAJAMENTO[0]
  const proximoNivel = NIVEIS_ENGAJAMENTO.find(n => n.nivel === nivelAtual.nivel + 1)
  const naoLidas = MOCK_MORADOR_NOTIFICACOES.filter(n => !n.lida).length
  const proxEventos = MOCK_EVENTOS_COMUNIDADE.slice(0, 3)

  const pctNivel = proximoNivel
    ? Math.round(((MORADOR_PONTOS_ATUAL - nivelAtual.minPontos) / (proximoNivel.minPontos - nivelAtual.minPontos)) * 100)
    : 100

  return (
    <div className="space-y-6 max-w-[1000px]">
      {/* Boas-vindas */}
      <div className="rounded-2xl bg-navy p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-gold/10" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/60 text-sm">Bem-vindo de volta,</p>
            <h1 className="text-2xl font-black text-white mt-0.5">{user?.name} 👋</h1>
            <p className="text-white/60 text-sm mt-1">Você está no <span className="text-gold font-semibold">Nível {nivelAtual.nivel} — {nivelAtual.nome}</span></p>
          </div>
          <div className="flex items-center gap-4">
            {naoLidas > 0 && (
              <button onClick={() => navigate('/notificacoes')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white text-sm">
                <Bell size={15} />
                <span>{naoLidas} nova{naoLidas > 1 ? 's' : ''}</span>
              </button>
            )}
            <div className="text-center">
              <p className="text-3xl font-black text-gold">{MORADOR_PONTOS_ATUAL}</p>
              <p className="text-white/50 text-xs">pontos</p>
            </div>
          </div>
        </div>

        {/* Barra de progresso do nível */}
        {proximoNivel && (
          <div className="relative mt-5">
            <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
              <span>Nível {nivelAtual.nivel} — {nivelAtual.nome}</span>
              <span>Nível {proximoNivel.nivel} — {proximoNivel.nome} ({proximoNivel.minPontos} pts)</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full transition-all duration-700" style={{ width: `${pctNivel}%` }} />
            </div>
            <p className="text-white/50 text-xs mt-1.5">
              +{proximoNivel.minPontos - MORADOR_PONTOS_ATUAL} pts para alcançar o próximo nível
            </p>
          </div>
        )}
      </div>

      {/* Acesso rápido */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3">Acesso rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(action => {
            const Icon = action.icon
            return (
              <button key={action.rota + action.label} onClick={() => navigate(action.rota)}
                className="group flex flex-col items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-hover hover:-translate-y-0.5 transition-all text-left">
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', action.color)}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{action.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{action.desc}</p>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors self-end mt-auto" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Próximos eventos */}
        <Card padding="md" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Próximos Eventos</h3>
            <button onClick={() => navigate('/acompanhamento')}
              className="text-xs text-navy hover:underline flex items-center gap-1">
              Ver todos <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {proxEventos.map(ev => {
              const { dia, hora } = formatEventDate(ev.data)
              return (
                <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-navy flex flex-col items-center justify-center text-white shrink-0">
                    <p className="text-xs font-bold leading-none">{dia.split(' ')[0]}</p>
                    <p className="text-[10px] text-white/70 uppercase leading-none mt-0.5">{dia.split(' ')[1]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800">{ev.titulo}</p>
                      <Badge variant={ev.tipo === 'reuniao' ? 'info' : 'success'} className="text-[10px]">
                        {ev.tipo === 'reuniao' ? 'Reunião' : 'Ação'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> {hora}
                      <span className="text-gray-300 mx-1">·</span>
                      <MapPin size={11} /> {ev.local}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Notificações recentes */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Notificações</h3>
            {naoLidas > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {naoLidas}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {MOCK_MORADOR_NOTIFICACOES.slice(0, 3).map(n => (
              <div key={n.id} className={clsx(
                'p-3 rounded-xl text-sm',
                !n.lida ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
              )}>
                <div className="flex items-start justify-between gap-2">
                  <p className={clsx('font-medium text-xs', !n.lida ? 'text-gray-900' : 'text-gray-600')}>{n.titulo}</p>
                  {!n.lida && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.mensagem}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/notificacoes')}
            className="w-full mt-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Ver todas as notificações
          </button>
        </Card>
      </div>
    </div>
  )
}
