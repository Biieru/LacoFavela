import { useState } from 'react'
import { Plus, FileText, Users, Clock, BarChart2, Trash2, Eye, ToggleRight, GripVertical, X, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { exportToCsv } from '../utils/exportCsv'
import type { Formulario, FormularioCampo } from '../types'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import EmptyState from '../components/ui/EmptyState'
import clsx from 'clsx'

const TIPO_LABELS: Record<string, string>  = { cadastro: 'Cadastro', pesquisa: 'Pesquisa', evento: 'Evento', feedback: 'Feedback' }
const TIPO_BADGE: Record<string, 'info' | 'gold' | 'success' | 'neutral'> = { cadastro: 'info', pesquisa: 'gold', evento: 'success', feedback: 'neutral' }
const STATUS_BADGE: Record<string, 'success' | 'neutral' | 'danger'> = { ativo: 'success', rascunho: 'neutral', encerrado: 'danger' }
const STATUS_LABELS: Record<string, string> = { ativo: 'Ativo', rascunho: 'Rascunho', encerrado: 'Encerrado' }

const CAMPO_TIPOS: { value: FormularioCampo['tipo']; label: string }[] = [
  { value: 'texto',    label: 'Texto curto' },
  { value: 'textarea', label: 'Texto longo' },
  { value: 'numero',   label: 'Número' },
  { value: 'selecao',  label: 'Seleção' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'data',     label: 'Data' },
]

function CampoBuilder({ campos, onChange }: { campos: FormularioCampo[]; onChange: (c: FormularioCampo[]) => void }) {
  const addCampo = () => {
    onChange([...campos, {
      id: `c${Date.now()}`, label: '', tipo: 'texto', obrigatorio: false,
    }])
  }

  const updateCampo = (idx: number, data: Partial<FormularioCampo>) => {
    onChange(campos.map((c, i) => i === idx ? { ...c, ...data } : c))
  }

  const removeCampo = (idx: number) => {
    onChange(campos.filter((_, i) => i !== idx))
  }

  const addOpcao = (idx: number) => {
    const campo = campos[idx]
    const opcoes = [...(campo.opcoes ?? []), '']
    updateCampo(idx, { opcoes })
  }

  const updateOpcao = (campoIdx: number, opcaoIdx: number, value: string) => {
    const campo   = campos[campoIdx]
    const opcoes  = (campo.opcoes ?? []).map((o, i) => i === opcaoIdx ? value : o)
    updateCampo(campoIdx, { opcoes })
  }

  const removeOpcao = (campoIdx: number, opcaoIdx: number) => {
    const campo  = campos[campoIdx]
    const opcoes = (campo.opcoes ?? []).filter((_, i) => i !== opcaoIdx)
    updateCampo(campoIdx, { opcoes })
  }

  return (
    <div className="space-y-3">
      {campos.map((campo, idx) => (
        <div key={campo.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <div className="flex items-start gap-2">
            <GripVertical size={16} className="text-gray-300 mt-2.5 shrink-0 cursor-grab" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  value={campo.label}
                  onChange={e => updateCampo(idx, { label: e.target.value })}
                  placeholder={`Campo ${idx + 1} — nome/label`}
                  className="flex-1 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                />
                <select
                  value={campo.tipo}
                  onChange={e => updateCampo(idx, { tipo: e.target.value as FormularioCampo['tipo'], opcoes: undefined })}
                  className="h-9 px-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 text-gray-700"
                >
                  {CAMPO_TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 whitespace-nowrap cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={campo.obrigatorio}
                    onChange={e => updateCampo(idx, { obrigatorio: e.target.checked })}
                    className="rounded border-gray-300 text-navy"
                  />
                  Obrigatório
                </label>
                <button onClick={() => removeCampo(idx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <X size={14} />
                </button>
              </div>

              {campo.tipo === 'selecao' && (
                <div className="space-y-2 pl-2">
                  <p className="text-xs text-gray-500 font-medium">Opções de seleção</p>
                  {(campo.opcoes ?? []).map((op, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        value={op}
                        onChange={e => updateOpcao(idx, oi, e.target.value)}
                        placeholder={`Opção ${oi + 1}`}
                        className="flex-1 h-8 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                      <button onClick={() => removeOpcao(idx, oi)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOpcao(idx)}
                    className="text-xs text-navy hover:underline flex items-center gap-1"
                  >
                    <Plus size={11} /> Adicionar opção
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addCampo}
        className="w-full h-10 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-navy/40 hover:text-navy transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={14} /> Adicionar campo
      </button>
    </div>
  )
}

export default function Formularios() {
  const { formularios, addFormulario, updateFormulario, removeFormulario } = useApp()
  const toast = useToast()

  const [viewing, setViewing]   = useState<Formulario | null>(null)
  const [creating, setCreating] = useState(false)
  const [filter, setFilter]     = useState<'todos' | Formulario['status']>('todos')

  const [newTitle, setNewTitle] = useState('')
  const [newDesc,  setNewDesc]  = useState('')
  const [newTipo,  setNewTipo]  = useState<Formulario['tipo']>('cadastro')
  const [newData,  setNewData]  = useState('')
  const [campos,   setCampos]   = useState<FormularioCampo[]>([])

  const filtered = formularios.filter(f => filter === 'todos' || f.status === filter)

  const handleCreate = () => {
    if (!newTitle.trim()) { toast.error('O título é obrigatório.'); return }
    if (campos.some(c => !c.label.trim())) { toast.error('Todos os campos precisam de label.'); return }

    addFormulario({
      titulo:    newTitle,
      descricao: newDesc,
      tipo:      newTipo,
      status:    'ativo',
      respostas: 0,
      criadoEm:  new Date().toISOString(),
      encerraEm: newData || undefined,
      campos,
    })
    toast.success('Formulário criado!', `"${newTitle}" publicado com sucesso.`)
    setCreating(false)
    setNewTitle(''); setNewDesc(''); setNewTipo('cadastro'); setNewData(''); setCampos([])
  }

  const handleDelete = (f: Formulario) => {
    removeFormulario(f.id)
    toast.warning('Formulário removido', `"${f.titulo}" foi excluído.`)
  }

  const handleToggle = (f: Formulario) => {
    const novoStatus: Formulario['status'] = f.status === 'ativo' ? 'encerrado' : 'ativo'
    updateFormulario(f.id, { status: novoStatus })
    toast.info(
      novoStatus === 'ativo' ? 'Formulário reativado' : 'Formulário encerrado',
      `"${f.titulo}"`,
    )
  }

  const handleExportar = (f: Formulario) => {
    exportToCsv(`formulario_${f.id}`, [
      { 'Título': f.titulo, 'Tipo': f.tipo, 'Status': f.status, 'Respostas': f.respostas, 'Criado em': f.criadoEm },
      ...f.campos.map(c => ({ 'Campo': c.label, 'Tipo': c.tipo, 'Obrigatório': c.obrigatorio ? 'Sim' : 'Não' })),
    ])
    toast.success('Exportado!', `Dados de "${f.titulo}" baixados.`)
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {(['todos', 'ativo', 'rascunho', 'encerrado'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={clsx('px-4 py-2 rounded-xl text-sm font-medium transition-all',
                filter === s ? 'bg-navy text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              )}>
              {s === 'todos' ? 'Todos' : STATUS_LABELS[s]}
              <span className={clsx('ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full',
                filter === s ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              )}>
                {s === 'todos' ? formularios.length : formularios.filter(f => f.status === s).length}
              </span>
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setCreating(true)}>
          Novo Formulário
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FileText size={28} />}
            title="Nenhum formulário encontrado"
            description="Crie seu primeiro formulário para começar a coletar dados da comunidade."
            action={<Button variant="secondary" icon={<Plus size={14} />} onClick={() => setCreating(true)}>Criar Formulário</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(f => (
            <Card key={f.id} padding="md" className="group flex flex-col gap-4 hover:shadow-hover transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={TIPO_BADGE[f.tipo]}>{TIPO_LABELS[f.tipo]}</Badge>
                  <Badge variant={STATUS_BADGE[f.status]} dot>{STATUS_LABELS[f.status]}</Badge>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setViewing(f)} className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-navy/10 transition-colors" title="Ver detalhes"><Eye size={14} /></button>
                  <button onClick={() => handleExportar(f)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Exportar"><Download size={14} /></button>
                  <button onClick={() => handleToggle(f)} className="p-1.5 rounded-lg text-gray-400 hover:text-gold-dark hover:bg-gold/15 transition-colors" title="Ativar/Encerrar"><ToggleRight size={14} /></button>
                  <button onClick={() => handleDelete(f)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Excluir"><Trash2 size={14} /></button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">{f.titulo}</h3>
                {f.descricao && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{f.descricao}</p>}
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1.5"><Users size={13} />{f.respostas} respostas</span>
                <span className="flex items-center gap-1.5"><BarChart2 size={13} />{f.campos.length} campos</span>
                {f.encerraEm && (
                  <span className="flex items-center gap-1.5 ml-auto"><Clock size={13} />{new Date(f.encerraEm).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={creating} onClose={() => setCreating(false)} title="Criar Novo Formulário" size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreating(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleCreate} disabled={!newTitle.trim()}>Publicar Formulário</Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Título" placeholder="Ex: Cadastro de Família — Ciclo 4" value={newTitle}
              onChange={e => setNewTitle(e.target.value)} required autoFocus />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <select value={newTipo} onChange={e => setNewTipo(e.target.value as Formulario['tipo'])}
                className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy">
                {Object.entries(TIPO_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)}
              placeholder="Descreva o objetivo do formulário..." rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy hover:border-gray-300 transition-colors resize-none" />
          </div>

          <Input label="Data de encerramento (opcional)" type="date" value={newData}
            onChange={e => setNewData(e.target.value)} />

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Campos do formulário</label>
              <span className="text-xs text-gray-400">{campos.length} campo(s)</span>
            </div>
            <CampoBuilder campos={campos} onChange={setCampos} />
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.titulo} size="md">
        {viewing && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge variant={TIPO_BADGE[viewing.tipo]}>{TIPO_LABELS[viewing.tipo]}</Badge>
              <Badge variant={STATUS_BADGE[viewing.status]} dot>{STATUS_LABELS[viewing.status]}</Badge>
            </div>
            {viewing.descricao && <p className="text-sm text-gray-600">{viewing.descricao}</p>}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Respostas</p>
                <p className="text-2xl font-bold text-navy mt-0.5">{viewing.respostas}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Campos</p>
                <p className="text-2xl font-bold text-navy mt-0.5">{viewing.campos.length}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Criado em</p>
                <p className="text-sm font-semibold text-navy mt-0.5">{new Date(viewing.criadoEm).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            {viewing.campos.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Campos</p>
                <div className="space-y-2">
                  {viewing.campos.map(campo => (
                    <div key={campo.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50">
                      <span className="text-sm text-gray-700">{campo.label || '(sem nome)'}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral">{campo.tipo}</Badge>
                        {campo.obrigatorio && <Badge variant="danger">Obrigatório</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" icon={<Download size={13} />} onClick={() => { handleExportar(viewing); setViewing(null) }} className="w-full">
              Exportar dados deste formulário
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
