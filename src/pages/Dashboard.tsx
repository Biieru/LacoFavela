import { useState } from 'react'
import { Users, Home, CheckCircle, MessageSquare, Download, Plus, X } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { MOCK_PARTICIPACOES_MES, MOCK_DISTRIBUICAO_PERFIL } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { exportToCsv } from '../utils/exportCsv'
import { exportToPdf } from '../utils/exportPdf'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import ExportMenu from '../components/ui/ExportMenu'
import { useAuth } from '../context/AuthContext'

const COLORS = ['#162550', '#1e3270', '#f5a623', '#e5e7eb']

function ScoreBar({ value }: { value: number }) {
  const color = value >= 80 ? '#162550' : value >= 50 ? '#f5a623' : '#ef4444'
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold text-gray-600 w-8 text-right">{value}</span>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-hover border border-gray-100 px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { user }  = useAuth()
  const { presidentes, familias, aprovados, feedbacks, ciclos, addCiclo } = useApp()
  const toast     = useToast()

  const [novoCicloOpen, setNovoCicloOpen] = useState(false)
  const [cicloForm, setCicloForm] = useState({
    nome: '', periodo: '', metaFamilias: '', dataInicio: '', dataEncerramento: '',
  })

  const cicloAtivo    = ciclos.find(c => c.status === 'ativo')
  const topPresidentes = [...presidentes].sort((a, b) => b.score - a.score).slice(0, 5)
  const naoLidos       = feedbacks.filter(f => !f.lido).length

  const stats = {
    familiasCadastradas:   familias.length,
    variacaoFamilias:      12,
    presidentesAtivos:     presidentes.filter(p => p.status === 'ativo').length,
    variacaoPresidentes:   -2,
    aprovacoesExecutadas:  aprovados.filter(a => a.status === 'aprovado').length,
    variacaoAprovacoes:    6,
    feedbacksRecentes:     feedbacks.length,
    feedbacksNaoLidos:     naoLidos,
  }

  const handleExportarCsv = () => {
    exportToCsv('dashboard_ciclo', [
      { 'Famílias Cadastradas': familias.length },
      { 'Presidentes Ativos': stats.presidentesAtivos },
      { 'Aprovações': stats.aprovacoesExecutadas },
      { 'Feedbacks': feedbacks.length },
      ...topPresidentes.map(p => ({
        'Presidente': p.name, 'Setor': p.setor,
        'Score': p.score, 'Cotas': `${p.cotas}/${p.metaCotas}`,
        'Status': p.status,
      })),
    ])
    toast.success('Exportado com sucesso!', 'Arquivo CSV gerado.')
  }

  const handleExportarPdf = () => {
    exportToPdf({
      title:    'Dashboard — Resumo do Ciclo',
      subtitle: cicloAtivo ? `${cicloAtivo.nome} · ${cicloAtivo.periodo}` : 'Visão geral',
      filename: 'dashboard_ciclo',
      columns: [
        { header: 'Presidente',  key: 'Presidente' },
        { header: 'Setor',       key: 'Setor' },
        { header: 'Score',       key: 'Score',  width: 18 },
        { header: 'Cotas',       key: 'Cotas',  width: 22 },
        { header: 'Status',      key: 'Status', width: 25 },
      ],
      rows: topPresidentes.map(p => ({
        'Presidente': p.name, 'Setor': p.setor,
        'Score': p.score, 'Cotas': `${p.cotas}/${p.metaCotas}`,
        'Status': p.status,
      })),
    })
    toast.success('PDF gerado!', 'Arquivo PDF gerado.')
  }

  const handleNovoCiclo = () => {
    if (!cicloForm.nome || !cicloForm.periodo || !cicloForm.dataInicio || !cicloForm.dataEncerramento) {
      toast.error('Preencha todos os campos obrigatórios.')
      return
    }
    addCiclo({
      nome:              cicloForm.nome,
      periodo:           cicloForm.periodo,
      metaFamilias:      Number(cicloForm.metaFamilias) || 50,
      dataInicio:        cicloForm.dataInicio,
      dataEncerramento:  cicloForm.dataEncerramento,
      status:            'planejado',
    })
    toast.success('Ciclo criado!', `${cicloForm.nome} adicionado com sucesso.`)
    setNovoCicloOpen(false)
    setCicloForm({ nome: '', periodo: '', metaFamilias: '', dataInicio: '', dataEncerramento: '' })
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-gray-500">
            {cicloAtivo ? `${cicloAtivo.nome} — ${cicloAtivo.periodo}` : 'Sem ciclo ativo'}&nbsp;·&nbsp;
            <span className={cicloAtivo ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
              {cicloAtivo ? 'Em andamento' : 'Aguardando'}
            </span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <ExportMenu onExportCsv={handleExportarCsv} onExportPdf={handleExportarPdf} />
          {user?.role === 'admin' && (
            <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setNovoCicloOpen(true)}>
              Novo Ciclo
            </Button>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Famílias Cadastradas" value={stats.familiasCadastradas} sub="vs. mês anterior" trend={stats.variacaoFamilias}      icon={<Home         size={20} className="text-navy" />}         iconBg="bg-navy/10" />
        <StatCard label="Presidentes Ativos"   value={stats.presidentesAtivos}   sub="Falta 2"          trend={stats.variacaoPresidentes}   icon={<Users        size={20} className="text-gold-dark" />}    iconBg="bg-gold/15" />
        <StatCard label="Aprovações Executadas" value={stats.aprovacoesExecutadas} sub="Últimos 30 dias" trend={stats.variacaoAprovacoes}    icon={<CheckCircle  size={20} className="text-emerald-600" />}  iconBg="bg-emerald-50" />
        <StatCard label="Feedbacks Recentes"   value={stats.feedbacksRecentes}   sub={`${naoLidos} não lidos`}                               icon={<MessageSquare size={20} className="text-purple-600" />} iconBg="bg-purple-50" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" padding="md">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900">Participações por Mês</h3>
              <p className="text-xs text-gray-400">Famílias presentes vs. eventos</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-navy inline-block" />Famílias</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gold inline-block" />Eventos</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_PARTICIPACOES_MES} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="familias" name="Famílias" fill="#162550" radius={[6, 6, 0, 0]} />
              <Bar dataKey="eventos"  name="Eventos"  fill="#f5a623" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card padding="md">
          <div className="mb-5">
            <h3 className="font-semibold text-gray-900">Distribuição por Perfil</h3>
            <p className="text-xs text-gray-400">Composição das famílias</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={MOCK_DISTRIBUICAO_PERFIL} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {MOCK_DISTRIBUICAO_PERFIL.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {MOCK_DISTRIBUICAO_PERFIL.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: COLORS[i] }} />
                  {item.name}
                </span>
                <span className="font-semibold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="md">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900">Ranking de Presidentes</h3>
              <p className="text-xs text-gray-400">Ordenado por score do ciclo</p>
            </div>
          </div>
          <div className="space-y-3">
            {topPresidentes.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  idx === 0 ? 'bg-gold text-navy' : idx === 1 ? 'bg-gray-200 text-gray-600' : idx === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                }`}>{idx + 1}</span>
                <span className="text-sm font-medium text-gray-700 w-32 shrink-0 truncate">{p.name}</span>
                <ScoreBar value={p.score} />
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900">Status de Cotas</h3>
              <p className="text-xs text-gray-400">Progresso atual por presidente</p>
            </div>
          </div>
          <div className="space-y-3">
            {topPresidentes.map(p => {
              const pct = Math.round((p.cotas / p.metaCotas) * 100)
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-28 shrink-0 truncate">{p.name}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? '#162550' : pct >= 50 ? '#f5a623' : '#ef4444' }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 w-14 text-right shrink-0">{p.cotas}/{p.metaCotas}</span>
                  <Badge variant={p.status === 'ativo' ? 'success' : p.status === 'alerta' ? 'warning' : 'danger'} dot>
                    {p.status === 'ativo' ? 'Ativo' : p.status === 'alerta' ? 'Alerta' : 'Penaliz.'}
                  </Badge>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Ciclos ativos */}
      {ciclos.length > 0 && (
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-4">Ciclos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ciclos.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{c.nome}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.periodo} · Meta: {c.metaFamilias} famílias</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(c.dataInicio).toLocaleDateString('pt-BR')} →{' '}
                    {new Date(c.dataEncerramento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge variant={c.status === 'ativo' ? 'success' : c.status === 'planejado' ? 'info' : 'neutral'} dot>
                  {c.status === 'ativo' ? 'Ativo' : c.status === 'planejado' ? 'Planejado' : 'Encerrado'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Novo Ciclo Modal */}
      <Modal
        open={novoCicloOpen}
        onClose={() => setNovoCicloOpen(false)}
        title="Criar Novo Ciclo"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setNovoCicloOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleNovoCiclo}>Criar Ciclo</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nome do Ciclo" placeholder="Ex: Ciclo 4" required value={cicloForm.nome}
              onChange={e => setCicloForm(p => ({ ...p, nome: e.target.value }))} />
            <Input label="Período" placeholder="Ex: Jul/25" required value={cicloForm.periodo}
              onChange={e => setCicloForm(p => ({ ...p, periodo: e.target.value }))} />
          </div>
          <Input label="Meta de Famílias" type="number" placeholder="Ex: 50" value={cicloForm.metaFamilias}
            onChange={e => setCicloForm(p => ({ ...p, metaFamilias: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Data de Início" type="date" required value={cicloForm.dataInicio}
              onChange={e => setCicloForm(p => ({ ...p, dataInicio: e.target.value }))} />
            <Input label="Data de Encerramento" type="date" required value={cicloForm.dataEncerramento}
              onChange={e => setCicloForm(p => ({ ...p, dataEncerramento: e.target.value }))} />
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700">
            O ciclo será criado com status <strong>Planejado</strong>. Você poderá ativá-lo posteriormente.
          </div>
        </div>
      </Modal>
    </div>
  )
}
