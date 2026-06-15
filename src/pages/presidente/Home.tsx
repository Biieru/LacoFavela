import { useNavigate } from 'react-router-dom'
import { ChevronRight, MapPin, Users, FileText, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import {
  PRESIDENTE_STATS, PRESIDENTE_VISITAS, PRESIDENTE_FAMILIAS,
} from '../../data/mockData'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import clsx from 'clsx'

function dayLabel(iso: string) {
  const d   = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

const CAT_LABELS: Record<string, string> = {
  'mae-solo': 'Mãe solo', 'tres-filhos': '+3 filhos',
  'renda-baixa': 'Renda baixa', 'alta-participacao': 'Alta participação', geral: 'Geral',
}

export default function PresidenteHome() {
  const { user }     = useAuth()
  const { formularios } = useApp()
  const navigate     = useNavigate()

  const pct = Math.round((PRESIDENTE_STATS.cotaRealizada / PRESIDENTE_STATS.cotaMes) * 100)
  const ultimasVisitas = PRESIDENTE_VISITAS.slice(0, 3)
  const formsAtivos = formularios.filter(f => f.status === 'ativo').slice(0, 3)

  return (
    <div className="space-y-5 max-w-[1200px]">
      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Olá, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-sm text-gray-500 mt-0.5">Bem-vindo ao seu painel de acompanhamento.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-5">
          {/* Progresso da cota */}
          <Card padding="md">
            <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Progresso da Cota · Junho</p>
              </div>
              <span className="text-xl font-bold text-gray-700">{pct}%</span>
            </div>

            <div className="flex items-end gap-6 mb-4">
              <div>
                <p className="text-5xl font-black text-navy leading-none">{PRESIDENTE_STATS.cotaRealizada}</p>
                <p className="text-gray-400 text-sm mt-1">/{PRESIDENTE_STATS.cotaMes} visitas realizadas</p>
              </div>
            </div>

            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: pct >= 100 ? '#10b981' : pct >= 75 ? '#162550' : pct >= 50 ? '#f5a623' : '#ef4444',
                }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Visitas realizadas', value: PRESIDENTE_STATS.cotaRealizada },
                { label: 'Faltam para meta',   value: PRESIDENTE_STATS.cotaMes - PRESIDENTE_STATS.cotaRealizada },
                { label: 'Dias restantes',      value: PRESIDENTE_STATS.diasRestantes },
                { label: 'Posição no Ranking',  value: `${PRESIDENTE_STATS.rankingPos}° lugar` },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl px-3 py-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Últimas visitas */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Últimas Visitas</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {ultimasVisitas.map(v => (
                <div key={v.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy text-sm shrink-0">
                    {v.familia.charAt(8)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{v.familia}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {dayLabel(v.data)}, {v.hora}
                      {v.formulario
                        ? ' · Formulário enviado'
                        : ' · Salvo offline'}
                    </p>
                  </div>
                  <Badge
                    variant={v.sync ? 'success' : 'warning'}
                    dot
                  >
                    {v.sync ? 'Sincronizado' : 'Offline'}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="px-5 pb-4 pt-2">
              <button
                onClick={() => navigate('/registros')}
                className="w-full py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors flex items-center justify-center gap-2"
              >
                Ver todas as visitas
                <ChevronRight size={14} />
              </button>
            </div>
          </Card>
        </div>

        {/* Sidebar direita */}
        <div className="space-y-4">
          {/* Formulários */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-navy" />
                <h3 className="font-semibold text-gray-900">Formulários</h3>
              </div>
              <button
                onClick={() => navigate('/formularios')}
                className="text-xs text-navy hover:underline flex items-center gap-1"
              >
                Ver mais <ExternalLink size={11} />
              </button>
            </div>
            <div className="space-y-2.5">
              {formsAtivos.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Nenhum formulário ativo</p>
              ) : formsAtivos.map(f => (
                <div key={f.id} className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm font-medium text-gray-800 truncate">{f.titulo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={f.status === 'ativo' ? 'success' : 'neutral'} className="text-[10px]">
                      {f.status === 'ativo' ? 'Ativo' : 'Rascunho'}
                    </Badge>
                    {f.encerraEm && (
                      <span className="text-[10px] text-gray-400">
                        Prazo: {new Date(f.encerraEm).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Minhas famílias rápido */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Minhas Famílias</h3>
              <button
                onClick={() => navigate('/familias')}
                className="text-xs text-navy hover:underline flex items-center gap-1"
              >
                Ver todas <ChevronRight size={11} />
              </button>
            </div>
            <div className="space-y-2">
              {PRESIDENTE_FAMILIAS.slice(0, 4).map(f => (
                <div key={f.id} className="flex items-center gap-2.5">
                  <div className={clsx(
                    'w-2 h-2 rounded-full shrink-0',
                    f.status === 'visitada' ? 'bg-emerald-500' : 'bg-amber-400',
                  )} />
                  <span className="text-sm text-gray-700 flex-1 truncate">{f.nome}</span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                    <Users size={11} /> {f.membros}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
