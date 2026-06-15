import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Users, Home, CheckCircle,
  MessageSquare, History, LogOut, ChevronRight, X,
  Bell, Activity, Trophy, Star, Send,
  ClipboardList, BarChart2,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types'

interface NavItem    { label: string; to: string; icon: React.ReactNode }
interface NavSection { section: string; items: NavItem[] }

const ADMIN_NAV: NavSection[] = [
  {
    section: 'PRINCIPAL',
    items: [
      { label: 'Dashboard',   to: '/',            icon: <LayoutDashboard size={18} /> },
      { label: 'Formulários', to: '/formularios', icon: <FileText        size={18} /> },
    ],
  },
  {
    section: 'GESTÃO',
    items: [
      { label: 'Presidentes', to: '/presidentes', icon: <Users       size={18} /> },
      { label: 'Famílias',    to: '/familias',    icon: <Home        size={18} /> },
      { label: 'Aprovados',   to: '/aprovados',   icon: <CheckCircle size={18} /> },
    ],
  },
  {
    section: 'COMUNICAÇÃO',
    items: [
      { label: 'Feedbacks', to: '/feedbacks', icon: <MessageSquare size={18} /> },
      { label: 'Histórico', to: '/historico', icon: <History       size={18} /> },
    ],
  },
]

const PRESIDENTE_NAV: NavSection[] = [
  {
    section: 'PRINCIPAL',
    items: [
      { label: 'Home',        to: '/',          icon: <Home          size={18} /> },
      { label: 'Famílias',    to: '/familias',  icon: <Users         size={18} /> },
      { label: 'Formulários', to: '/formularios', icon: <FileText    size={18} /> },
      { label: 'Registros',   to: '/registros', icon: <ClipboardList size={18} /> },
    ],
  },
  {
    section: 'DO SEU NÍVEL',
    items: [
      { label: 'Meu Indicador', to: '/meu-indicador', icon: <BarChart2 size={18} /> },
      { label: 'Ranking',       to: '/meu-ranking',   icon: <Trophy   size={18} /> },
    ],
  },
]

const MORADOR_NAV: NavSection[] = [
  {
    section: 'PRINCIPAL',
    items: [
      { label: 'Início',         to: '/',               icon: <Home     size={18} /> },
      { label: 'Notificações',   to: '/notificacoes',   icon: <Bell     size={18} /> },
      { label: 'Acompanhamento', to: '/acompanhamento', icon: <Activity size={18} /> },
    ],
  },
  {
    section: 'DESEMPENHO',
    items: [
      { label: 'Ranking',        to: '/ranking',        icon: <Trophy   size={18} /> },
      { label: 'Ser Presidente', to: '/ser-presidente', icon: <Star     size={18} /> },
      { label: 'Feedback',       to: '/feedback',       icon: <Send     size={18} /> },
    ],
  },
]

const NAV_BY_ROLE: Record<UserRole, NavSection[]> = {
  admin:      ADMIN_NAV,
  presidente: PRESIDENTE_NAV,
  morador:    MORADOR_NAV,
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin:      'Admin',
  presidente: 'Presidente',
  morador:    'Morador',
}

interface SidebarProps { open: boolean; onClose: () => void; onToggle: () => void }

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()

  const navSections     = user ? NAV_BY_ROLE[user.role] : []
  const canViewProfile  = user?.role === 'presidente' || user?.role === 'morador'

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={clsx(
        'fixed top-0 left-0 h-full z-40 flex flex-col bg-navy text-white',
        'transition-all duration-300 ease-in-out w-64',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'lg:relative lg:translate-x-0',
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center font-black text-navy text-[9px] leading-none shrink-0">
            LAÇO
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm leading-tight">Laço Favela</p>
            <p className="text-white/50 text-[10px] uppercase tracking-widest">Família</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* User card */}
        {canViewProfile ? (
          <button
            onClick={() => { navigate('/perfil'); onClose() }}
            className="flex items-center gap-3 px-4 py-3 mx-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-left group"
          >
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-bold text-navy text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate group-hover:text-gold transition-colors">
                {user?.name}
              </p>
              <p className="text-[11px] text-white/60">{user ? ROLE_LABELS[user.role] : ''}</p>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gold text-navy shrink-0">
              {user ? ROLE_LABELS[user.role] : ''}
            </span>
          </button>
        ) : (
          /* Admin — not clickable, sem link de perfil */
          <div className="flex items-center gap-3 px-4 py-3 mx-3 mt-3 rounded-xl bg-white/10">
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-bold text-navy text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-white/60">{user ? ROLE_LABELS[user.role] : ''}</p>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gold text-navy shrink-0">
              {user ? ROLE_LABELS[user.role] : ''}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 sidebar-scrollbar">
          {navSections.map(({ section, items }) => (
            <div key={section}>
              <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest px-3 mb-1.5">
                {section}
              </p>
              <ul className="space-y-0.5">
                {items.map(item => (
                  <li key={item.to + item.label}>
                    <NavLink
                      to={item.to}
                      onClick={onClose}
                      end={item.to === '/'}
                      className={({ isActive }) => clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-gold text-navy shadow-glow'
                          : 'text-white/70 hover:text-white hover:bg-white/10',
                      )}
                    >
                      {item.icon}
                      <span className="flex-1">{item.label}</span>
                      {location.pathname === item.to && (
                        <ChevronRight size={14} className="text-navy/60" />
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}
