import { useRef, useEffect } from 'react'
import { Bell, CheckCheck, MessageSquare, AlertTriangle, CheckCircle2, Zap, X } from 'lucide-react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'

const TIPO_CONFIG = {
  feedback:  { icon: <MessageSquare size={14} />,  bg: 'bg-purple-100', color: 'text-purple-600' },
  alerta:    { icon: <AlertTriangle  size={14} />,  bg: 'bg-amber-100',  color: 'text-amber-600' },
  aprovacao: { icon: <CheckCircle2   size={14} />,  bg: 'bg-emerald-100',color: 'text-emerald-600' },
  ciclo:     { icon: <Zap            size={14} />,  bg: 'bg-blue-100',   color: 'text-blue-600' },
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (days  > 0) return `${days}d atrás`
  if (hours > 0) return `${hours}h atrás`
  if (mins  > 0) return `${mins}min atrás`
  return 'agora'
}

interface Props {
  open: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLButtonElement | null>
}

export default function NotificationPanel({ open, onClose, anchorRef }: Props) {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotifications } = useApp()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose, anchorRef])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-hover z-50 animate-fade-in overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-gray-600" />
          <span className="text-sm font-semibold text-gray-900">Notificações</span>
          {unreadNotifications > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadNotifications > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Marcar todas como lidas"
            >
              <CheckCheck size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            Nenhuma notificação
          </div>
        ) : notifications.map(n => {
          const config = TIPO_CONFIG[n.tipo]
          return (
            <button
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={clsx(
                'w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0',
                !n.lida && 'bg-blue-50/40'
              )}
            >
              <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                <span className={config.color}>{config.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={clsx('text-xs font-semibold leading-tight', !n.lida ? 'text-gray-900' : 'text-gray-600')}>
                    {n.titulo}
                  </p>
                  {!n.lida && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{n.descricao}</p>
                <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.criadaEm)}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
