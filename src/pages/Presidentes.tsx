import { useState } from 'react'
import { Download, Plus, Search, Edit2, Eye, AlertTriangle, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { exportToCsv } from '../utils/exportCsv'
import { exportToPdf } from '../utils/exportPdf'
import type { Presidente } from '../types'
import Button from '../components/ui/Button'
import ExportMenu from '../components/ui/ExportMenu'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import clsx from 'clsx'

type SortKey = 'score' | 'visitas' | 'eventos' | 'cotas'
type StatusFilter = 'todos' | 'ativo' | 'alerta' | 'penalizado'

const STATUS_MAP = {
  ativo:      { label: 'Ativo',       variant: 'success' as const },
  alerta:     { label: 'Alerta',      variant: 'warning' as const },
  penalizado: { label: 'Penalizado',  variant: 'danger'  as const },
}

const SETORES = ['Setor A','Setor B','Setor C','Setor D','Setor E','Setor F','Setor G','Setor H','Setor I','Setor J','Setor K','Setor L']

function ScoreBar({ value }: { value: number }) {
  const color = value >= 80 ? '#162550' : value >= 50 ? '#f5a623' : '#ef4444'
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{value}</span>
    </div>
  )
}

const emptyForm = { name: '', setor: 'Setor A', metaCotas: '50' }

export default function Presidentes() {
  const { presidentes, addPresidente, updatePresidente, removePresidente } = useApp()
  const toast = useToast()

  const [sort,     setSort]     = useState<SortKey>('score')
  const [status,   setStatus]   = useState<StatusFilter>('todos')
  const [search,   setSearch]   = useState('')
  const [editing,  setEditing]  = useState<Presidente | null>(null)
  const [editMeta, setEditMeta] = useState('')
  const [editSetor,setEditSetor]= useState('')
  const [editStatus, setEditStatus] = useState<Presidente['status']>('ativo')
  const [viewPres, setViewPres] = useState<Presidente | null>(null)
  const [creating, setCreating] = useState(false)
  const [newForm,  setNewForm]  = useState(emptyForm)
  const [delConfirm, setDelConfirm] = useState<Presidente | null>(null)

  const filtered = presidentes
    .filter(p =>
      (status === 'todos' || p.status === status) &&
      (search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.setor.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => b[sort] - a[sort])

  const openEdit = (p: Presidente) => {
    setEditing(p); setEditMeta(String(p.metaCotas)); setEditSetor(p.setor); setEditStatus(p.status)
  }

  const saveEdit = () => {
    if (!editing) return
    updatePresidente(editing.id, {
      metaCotas: Number(editMeta) || editing.metaCotas,
      setor: editSetor || editing.setor,
      status: editStatus,
    })
    toast.success('Alterações salvas!', `${editing.name} atualizado.`)
    setEditing(null)
  }

  const handleCreate = () => {
    if (!newForm.name.trim()) { toast.error('O nome é obrigatório.'); return }
    addPresidente({
      name:        newForm.name,
      setor:       newForm.setor,
      cotas:       0,
      metaCotas:   Number(newForm.metaCotas) || 50,
      visitas:     0,
      eventos:     0,
      finalizacao: 0,
      score:       0,
      status:      'ativo',
    })
    toast.success('Presidente adicionado!', `${newForm.name} cadastrado com sucesso.`)
    setCreating(false)
    setNewForm(emptyForm)
  }

  const handleDelete = () => {
    if (!delConfirm) return
    removePresidente(delConfirm.id)
    toast.warning('Presidente removido', `${delConfirm.name} foi excluído.`)
    setDelConfirm(null)
  }

  const pdfRows = () => filtered.map(p => ({
    'Nome': p.name, 'Setor': p.setor, 'Score': p.score,
    'Cotas': `${p.cotas}/${p.metaCotas}`, 'Visitas': p.visitas, 'Status': p.status,
  }))

  const handleExportarCsv = () => {
    exportToCsv('presidentes', filtered.map(p => ({
      'Nome': p.name, 'Setor': p.setor, 'Score': p.score,
      'Cotas': p.cotas, 'Meta Cotas': p.metaCotas,
      'Visitas': p.visitas, 'Eventos': p.eventos,
      'Finalização': `${p.finalizacao}%`, 'Status': p.status,
    })))
    toast.success('Exportado!', `${filtered.length} presidente(s) no arquivo CSV.`)
  }

  const handleExportarPdf = () => {
    exportToPdf({
      title:    'Lista de Presidentes',
      subtitle: `${filtered.length} presidente(s) · Favela Club`,
      filename: 'presidentes',
      columns: [
        { header: 'Nome',    key: 'Nome' },
        { header: 'Setor',   key: 'Setor',   width: 28 },
        { header: 'Score',   key: 'Score',   width: 18 },
        { header: 'Cotas',   key: 'Cotas',   width: 22 },
        { header: 'Visitas', key: 'Visitas', width: 20 },
        { header: 'Status',  key: 'Status',  width: 22 },
      ],
      rows: pdfRows(),
    })
    toast.success('PDF gerado!', `${filtered.length} presidente(s).`)
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar presidente..."
            className="h-9 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors w-52" />
        </div>
        <div className="flex gap-2">
          <ExportMenu label="Exportar lista" onExportCsv={handleExportarCsv} onExportPdf={handleExportarPdf} />
          <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setCreating(true)}>Novo Presidente</Button>
        </div>
      </div>

      <Card padding="sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-500 mr-1">Ordenar:</span>
            {(['score','visitas','eventos','cotas'] as SortKey[]).map(key => (
              <button key={key} onClick={() => setSort(key)}
                className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                  sort === key ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-100'
                )}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-gray-200" />
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-500 mr-1">Status:</span>
            {(['todos','ativo','alerta','penalizado'] as StatusFilter[]).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  status === s ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-100'
                )}>
                {s === 'todos' ? 'Todos' : s === 'ativo' ? 'Ativos' : s === 'alerta' ? 'Alerta' : 'Com penalização'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['RANK','PRESIDENTE','SETOR','COTAS','VISITAS','EVENTOS','FINAL. (%)','SCORE','STATUS','AÇÕES'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-16 text-center text-sm text-gray-400">Nenhum presidente encontrado.</td></tr>
              ) : filtered.map((p, idx) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                      idx === 0 ? 'bg-gold text-navy' : idx === 1 ? 'bg-gray-200 text-gray-600' : idx === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                    )}>{idx + 1}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-xs font-bold text-navy shrink-0">{p.name.charAt(0)}</div>
                      <span className="text-sm font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{p.setor}</td>
                  <td className="px-4 py-3.5"><span className="text-sm font-medium text-gray-800">{p.cotas}</span><span className="text-xs text-gray-400">/{p.metaCotas}</span></td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{p.visitas}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{p.eventos}</td>
                  <td className="px-4 py-3.5">
                    <span className={clsx('text-sm font-semibold',
                      p.finalizacao >= 80 ? 'text-emerald-600' : p.finalizacao >= 50 ? 'text-amber-500' : 'text-red-500'
                    )}>{p.finalizacao}%</span>
                  </td>
                  <td className="px-4 py-3.5"><ScoreBar value={p.score} /></td>
                  <td className="px-4 py-3.5"><Badge variant={STATUS_MAP[p.status].variant} dot>{STATUS_MAP[p.status].label}</Badge></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewPres(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-navy/10 transition-colors" title="Ver detalhes"><Eye size={15} /></button>
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-gold-dark hover:bg-gold/15 transition-colors" title="Editar"><Edit2 size={15} /></button>
                      <button onClick={() => setDelConfirm(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Excluir"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">{filtered.length} presidente(s) encontrado(s)</p>
        </div>
      </Card>

      {presidentes.filter(p => p.status !== 'ativo').length > 0 && (
        <Card padding="md" className="border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Presidentes que precisam de atenção</p>
              <p className="text-xs text-amber-600 mt-0.5">
                {presidentes.filter(p => p.status === 'alerta').length} em alerta ·{' '}
                {presidentes.filter(p => p.status === 'penalizado').length} penalizado(s)
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Novo Presidente */}
      <Modal open={creating} onClose={() => setCreating(false)} title="Novo Presidente" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreating(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleCreate}>Cadastrar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome completo" placeholder="Ex: Maria Santos" required value={newForm.name}
            onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))} autoFocus />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Setor</label>
            <select value={newForm.setor} onChange={e => setNewForm(p => ({ ...p, setor: e.target.value }))}
              className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy">
              {SETORES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Input label="Meta de Cotas" type="number" placeholder="50" value={newForm.metaCotas}
            onChange={e => setNewForm(p => ({ ...p, metaCotas: e.target.value }))} />
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700">
            O presidente iniciará com score 0. Os dados serão atualizados conforme as atividades forem registradas.
          </div>
        </div>
      </Modal>

      {/* Editar */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar Presidente" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button variant="primary" onClick={saveEdit}>Salvar Alterações</Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy">{editing.name.charAt(0)}</div>
              <div>
                <p className="font-semibold text-gray-900">{editing.name}</p>
                <p className="text-xs text-gray-500">Score atual: {editing.score}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Setor</label>
              <select value={editSetor} onChange={e => setEditSetor(e.target.value)}
                className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy">
                {SETORES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Input label="Meta de Cotas" type="number" value={editMeta} onChange={e => setEditMeta(e.target.value)} placeholder="50" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(['ativo','alerta','penalizado'] as Presidente['status'][]).map(s => (
                  <button key={s} onClick={() => setEditStatus(s)}
                    className={clsx('py-2 rounded-xl text-xs font-medium border transition-all capitalize',
                      editStatus === s ? 'border-navy bg-navy text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    )}>
                    {STATUS_MAP[s].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Detalhes */}
      <Modal open={!!viewPres} onClose={() => setViewPres(null)} title="Detalhes do Presidente" size="md">
        {viewPres && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center font-bold text-gold text-2xl">{viewPres.name.charAt(0)}</div>
              <div>
                <p className="text-xl font-bold text-gray-900">{viewPres.name}</p>
                <p className="text-sm text-gray-500">{viewPres.setor}</p>
                <Badge variant={STATUS_MAP[viewPres.status].variant} dot className="mt-1">{STATUS_MAP[viewPres.status].label}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Score',      value: viewPres.score },
                { label: 'Cotas',      value: `${viewPres.cotas}/${viewPres.metaCotas}` },
                { label: 'Visitas',    value: viewPres.visitas },
                { label: 'Eventos',    value: viewPres.eventos },
                { label: 'Finalização',value: `${viewPres.finalizacao}%` },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            <ExportMenu
              label="Exportar dados deste presidente"
              variant="outline"
              size="md"
              onExportCsv={() => {
                exportToCsv('presidente', [{ Nome: viewPres.name, Setor: viewPres.setor, Score: viewPres.score, Cotas: viewPres.cotas, Status: viewPres.status }])
                toast.success('Exportado!'); setViewPres(null)
              }}
              onExportPdf={() => {
                exportToPdf({
                  title: `Presidente — ${viewPres.name}`,
                  subtitle: viewPres.setor,
                  filename: `presidente_${viewPres.name.replace(/\s/g, '_')}`,
                  columns: [
                    { header: 'Campo', key: 'Campo' },
                    { header: 'Valor', key: 'Valor' },
                  ],
                  rows: [
                    { 'Campo': 'Nome',    'Valor': viewPres.name },
                    { 'Campo': 'Setor',   'Valor': viewPres.setor },
                    { 'Campo': 'Score',   'Valor': viewPres.score },
                    { 'Campo': 'Cotas',   'Valor': `${viewPres.cotas}/${viewPres.metaCotas}` },
                    { 'Campo': 'Visitas', 'Valor': viewPres.visitas },
                    { 'Campo': 'Status',  'Valor': viewPres.status },
                  ],
                })
                toast.success('PDF gerado!'); setViewPres(null)
              }}
            />
          </div>
        )}
      </Modal>

      {/* Confirmar exclusão */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Confirmar Exclusão" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDelConfirm(null)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete}>Excluir</Button>
          </>
        }
      >
        {delConfirm && (
          <p className="text-sm text-gray-600">
            Tem certeza que deseja excluir <strong>{delConfirm.name}</strong>? Esta ação não pode ser desfeita.
          </p>
        )}
      </Modal>
    </div>
  )
}
