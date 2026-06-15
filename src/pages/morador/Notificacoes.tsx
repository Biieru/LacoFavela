import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, Info, Calendar, Zap, ArrowLeft } from 'lucide-react'
import { MOCK_MORADOR_NOTIFICACOES } from '../../data/mockData'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import clsx from 'clsx'

type MoradorNotificacao = typeof MOCK_MORADOR_NOTIFICACOES[0]

const TIPO_CONFIG = {
  aviso:  { icon: <Info     size={16} />, bg: 'bg-amber-50',   color: 'text-amber-600',  border: 'border-amber-200' },
  evento: { icon: <Calendar size={16} />, bg: 'bg-blue-50',    color: 'text-blue-600',   border: 'border-blue-200' },
  ciclo:  { icon: <Zap      size={16} />, bg: 'bg-navy/10',    color: 'text-navy',       border: 'border-navy/20' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function MoradorNotificacoes() {
  const navigate = useNavigate()
  const [notifs, setNotifs] = useState<MoradorNotificacao[]>(MOCK_MORADOR_NOTIFICACOES)

  const naoLidas = notifs.filter(n => !n.lida).length

  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n))
  const markAll  = ()           => setNotifs(prev => prev.map(n => ({ ...n, lida: true })))

  return (
    <div className="space-y-5 max-w-[700px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
            <Bell size={18} className="text-navy" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Notificações</h2>
            <p className="text-xs text-gray-500">
              {naoLidas > 0 ? `${naoLidas} não lida${naoLidas > 1 ? 's' : ''}` : 'Todas em dia'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {naoLidas > 0 && (
            <Button variant="outline" size="sm" icon={<CheckCheck size={14} />} onClick={markAll}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notifs.length === 0 ? (
          <Card>
            <div className="py-16 text-center">
              <Bell size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Nenhuma notificação</p>
            </div>
          </Card>
        ) : notifs.map(n => {
          const config = TIPO_CONFIG[n.tipo]
          return (
            <div key={n.id}
              className={clsx(
                'rounded-2xl border p-5 transition-all shadow-card',
                !n.lida ? `${config.bg} ${config.border}` : 'bg-white border-gray-100',
              )}>
              <div className="flex items-start gap-3">
                <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', !n.lida ? 'bg-white' : 'bg-gray-100')}>
                  <span className={config.color}>{config.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={clsx('text-sm font-semibold', !n.lida ? 'text-gray-900' : 'text-gray-700')}>
                          {n.titulo}
                        </p>
                        {!n.lida && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{n.mensagem}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatDate(n.criadaEm)}</p>
                    </div>
                    {!n.lida && (
                      <button onClick={() => markRead(n.id)}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy transition-colors">
        <ArrowLeft size={14} /> Voltar para Home
      </button>
    </div>
  )
}
