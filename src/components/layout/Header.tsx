import { Bell, Search, ChevronDown, Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { useState, useRef } from 'react'
import clsx from 'clsx'
import NotificationPanel from '../ui/NotificationPanel'
import SearchModal from '../ui/SearchModal'

const ROUTE_TITLES: Record<string, string> = {
  '/':               'Painel Analítico',
  '/formularios':    'Formulários',
  '/presidentes':    'Presidentes',
  '/familias':       'Famílias',
  '/aprovados':      'Aprovados',
  '/feedbacks':      'Feedbacks Anônimos',
  '/historico':      'Histórico Completo',
  '/perfil':         'Meu Perfil',
  // Presidente
  '/registros':      'Registros de Visitas',
  '/meu-indicador':  'Meu Indicador',
  '/meu-ranking':    'Ranking',
  // Morador
  '/notificacoes':   'Notificações',
  '/acompanhamento': 'Acompanhamento',
  '/ranking':        'Ranking',
  '/ser-presidente': 'Ser Presidente',
  '/feedback':       'Feedback',
}

const ROUTE_SUBS: Record<string, string> = {
  '/':               'Visão geral do ciclo atual',
  '/formularios':    'Gerencie formulários e coleta de dados',
  '/presidentes':    'Gestão e acompanhamento de presidentes',
  '/familias':       'Listagem e pontuação das famílias',
  '/aprovados':      'Seleção do ciclo finalizada',
  '/feedbacks':      'Mensagens anônimas da comunidade',
  '/historico':      'Linha do tempo de eventos e ciclos',
  '/perfil':         'Visualize e edite seus dados',
  '/registros':      'Histórico e sincronização de visitas',
  '/meu-indicador':  'Verifique o nível do seu progresso',
  '/meu-ranking':    'Classificação geral de presidentes',
  '/notificacoes':   'Seus avisos e comunicados',
  '/acompanhamento': 'Acompanhe seu processo e eventos',
  '/ranking':        'Seu nível de engajamento na comunidade',
  '/ser-presidente': 'Candidate-se a líder comunitário',
  '/feedback':       'Envie sua opinião anonimamente',
}

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout }               = useAuth()
  const { unreadNotifications }        = useApp()
  const location                       = useLocation()
  const [dropOpen, setDropOpen]        = useState(false)
  const [notifOpen, setNotifOpen]      = useState(false)
  const [searchOpen, setSearchOpen]    = useState(false)
  const bellRef = useRef<HTMLButtonElement>(null)

  const title    = ROUTE_TITLES[location.pathname] || 'Laço Favela'
  const subtitle = ROUTE_SUBS[location.pathname]

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-gray-400 hidden sm:block">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
            >
              <Search size={15} />
              <span className="hidden lg:block">Buscar...</span>
              <kbd className="hidden lg:block px-1.5 py-0.5 rounded border border-gray-200 text-[10px]">⌘K</kbd>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Search size={18} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                ref={bellRef}
                onClick={() => { setNotifOpen(v => !v); setDropOpen(false) }}
                className="relative p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
              <NotificationPanel
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                anchorRef={bellRef}
              />
            </div>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => { setDropOpen(v => !v); setNotifOpen(false) }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center text-xs font-bold text-gold">
                  {user?.name?.charAt(0)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user?.name}
                </span>
                <ChevronDown size={14} className={clsx('text-gray-400 transition-transform', dropOpen && 'rotate-180')} />
              </button>

              {dropOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-hover z-20 py-1.5 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={() => { setDropOpen(false); logout() }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sair da conta
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
