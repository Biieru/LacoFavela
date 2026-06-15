import { useState } from 'react'
import { MapPin, Users, Plus, Search } from 'lucide-react'
import { PRESIDENTE_FAMILIAS } from '../../data/mockData'
import { useToast } from '../../context/ToastContext'
import { exportToCsv } from '../../utils/exportCsv'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import ExportMenu from '../../components/ui/ExportMenu'
import clsx from 'clsx'

type FStatusVal = 'visitada' | 'pendente'
type FCatVal    = 'mae-solo' | 'tres-filhos' | 'renda-baixa' | 'alta-participacao' | 'geral'

interface PFamilia {
  id:        string
  nome:      string
  endereco:  string
  membros:   number
  status:    FStatusVal
  categoria: FCatVal
}

type StatusFilter = 'todos' | FStatusVal

const CAT_BADGE: Record<FCatVal, 'info' | 'gold' | 'success' | 'neutral' | 'danger'> = {
  'mae-solo': 'info', 'tres-filhos': 'gold', 'renda-baixa': 'danger',
  'alta-participacao': 'success', geral: 'neutral',
}
const CAT_LABELS: Record<FCatVal, string> = {
  'mae-solo': 'Mãe solo', 'tres-filhos': '+3 filhos',
  'renda-baixa': 'Renda baixa', 'alta-participacao': 'Alta participação', geral: 'Geral',
}

const STATUS_BADGE: Record<FStatusVal, 'success' | 'warning'> = {
  visitada: 'success', pendente: 'warning',
}

export default function PresidenteFamilias() {
  const toast = useToast()
  const [familias, setFamilias] = useState<PFamilia[]>(PRESIDENTE_FAMILIAS as PFamilia[])
  const [filter, setFilter]     = useState<StatusFilter>('todos')
  const [search, setSearch]     = useState('')
  const [adding, setAdding]     = useState(false)
  const [newForm, setNewForm]   = useState({ nome: '', endereco: '', membros: '', categoria: 'geral' as FCatVal })

  const filtered = familias.filter(f =>
    (filter === 'todos' || f.status === filter) &&
    (search === '' || f.nome.toLowerCase().includes(search.toLowerCase()))
  )

  const handleAdd = () => {
    if (!newForm.nome.trim()) { toast.error('O nome da família é obrigatório.'); return }
    const nova: PFamilia = {
      id:        `pf${Date.now()}`,
      nome:      newForm.nome,
      endereco:  newForm.endereco || '—',
      membros:   Number(newForm.membros) || 1,
      status:    'pendente',
      categoria: newForm.categoria,
    }
    setFamilias(prev => [...prev, nova])
    toast.success('Família adicionada!', nova.nome)
    setAdding(false)
    setNewForm({ nome: '', endereco: '', membros: '', categoria: 'geral' })
  }

  const toggleStatus = (id: string) => {
    setFamilias(prev => prev.map(f =>
      f.id === id ? { ...f, status: f.status === 'visitada' ? 'pendente' : 'visitada' } : f
    ))
  }

  const familiaRows = () => filtered.map(f => ({
    'Família':   f.nome,
    'Endereço':  f.endereco,
    'Membros':   f.membros,
    'Status':    f.status === 'visitada' ? 'Visitada' : 'Pendente',
    'Categoria': CAT_LABELS[f.categoria],
  }))

  const handleExportarCsv = () => {
    exportToCsv('minhas_familias', familiaRows())
    toast.success('Exportado!', `${filtered.length} família(s) exportadas.`)
  }

  const handleExportarPdf = async () => {
    const { exportToPdf } = await import('../../utils/exportPdfLoader')
    await exportToPdf({
      title:    'Minhas Famílias',
      subtitle: `${filtered.length} família(s) cadastrada(s) · Laço Favela`,
      filename: 'minhas_familias',
      columns: [
        { header: 'Família',   key: 'Família' },
        { header: 'Membros',   key: 'Membros',   width: 18 },
        { header: 'Status',    key: 'Status',    width: 22 },
        { header: 'Categoria', key: 'Categoria', width: 28 },
      ],
      rows: familiaRows(),
    })
    toast.success('PDF gerado!', `${filtered.length} família(s).`)
  }

  return (
    <div className="space-y-5 max-w-[900px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-gray-900 text-lg">
            Lista de Famílias
            <span className="ml-2 w-6 h-6 rounded-full bg-navy text-white text-xs font-bold inline-flex items-center justify-center">
              {familias.length}
            </span>
          </h2>
        </div>
        <div className="flex gap-2">
          <ExportMenu onExportCsv={handleExportarCsv} onExportPdf={handleExportarPdf} />
          <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setAdding(true)}>
            Adicionar família
          </Button>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar família..."
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as StatusFilter)}
          className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/20"
        >
          <option value="todos">Todos os status</option>
          <option value="visitada">Visitadas</option>
          <option value="pendente">Pendentes</option>
        </select>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400 bg-white rounded-2xl border border-gray-100">
            Nenhuma família encontrada.
          </div>
        ) : filtered.map(f => (
          <div
            key={f.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-card px-5 py-4 flex items-start gap-4 hover:shadow-hover transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center font-bold text-navy shrink-0">
              {f.nome.charAt(8)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{f.nome}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="shrink-0" /> {f.endereco}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Users size={11} /> {f.membros} membros
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                onClick={() => toggleStatus(f.id)}
                className="focus:outline-none"
                title="Clique para alternar status"
              >
                <Badge variant={STATUS_BADGE[f.status]} dot>
                  {f.status === 'visitada' ? 'Visitada' : 'Pendente'}
                </Badge>
              </button>
              <Badge variant={CAT_BADGE[f.categoria]}>
                {CAT_LABELS[f.categoria]}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Modal adicionar */}
      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Adicionar Família"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setAdding(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleAdd}>Adicionar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome da família" placeholder="Ex: Família Santos" required
            value={newForm.nome} onChange={e => setNewForm(p => ({ ...p, nome: e.target.value }))} autoFocus />
          <Input label="Endereço" placeholder="Rua, número, bairro, cidade"
            value={newForm.endereco} onChange={e => setNewForm(p => ({ ...p, endereco: e.target.value }))} />
          <Input label="Número de membros" type="number" placeholder="Ex: 4"
            value={newForm.membros} onChange={e => setNewForm(p => ({ ...p, membros: e.target.value }))} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <select value={newForm.categoria} onChange={e => setNewForm(p => ({ ...p, categoria: e.target.value as FCatVal }))}
              className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy">
              <option value="geral">Geral</option>
              <option value="mae-solo">Mãe Solo</option>
              <option value="tres-filhos">+3 Filhos</option>
              <option value="renda-baixa">Renda Baixa</option>
              <option value="alta-participacao">Alta Participação</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
