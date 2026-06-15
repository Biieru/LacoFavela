import { useState } from 'react'
import { Plus, RefreshCw, WifiOff, FileCheck, FileX } from 'lucide-react'
import { PRESIDENTE_VISITAS } from '../../data/mockData'
import { useToast } from '../../context/ToastContext'
import { exportToCsv } from '../../utils/exportCsv'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import StatCard from '../../components/ui/StatCard'
import ExportMenu from '../../components/ui/ExportMenu'
import clsx from 'clsx'

type Visita = typeof PRESIDENTE_VISITAS[0]

function dayLabel(iso: string) {
  const d   = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function Registros() {
  const toast = useToast()
  const [visitas, setVisitas] = useState<Visita[]>(PRESIDENTE_VISITAS)
  const [adding, setAdding]   = useState(false)
  const [newForm, setNewForm] = useState({ familia: '', hora: '', formulario: true })

  const stats = {
    sincronizadas:  visitas.filter(v => v.sync).length,
    offline:        visitas.filter(v => !v.sync).length,
    comFormulario:  visitas.filter(v => v.formulario).length,
    semFormulario:  visitas.filter(v => !v.formulario).length,
  }

  const handleAdd = () => {
    if (!newForm.familia.trim()) { toast.error('Informe a família.'); return }
    const nova: Visita = {
      id:         `v${Date.now()}`,
      familia:    newForm.familia,
      data:       new Date().toISOString(),
      hora:       newForm.hora || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      sync:       false,
      formulario: newForm.formulario,
    }
    setVisitas(prev => [nova, ...prev])
    toast.success('Visita registrada!', `${nova.familia} — salva offline.`)
    setAdding(false)
    setNewForm({ familia: '', hora: '', formulario: true })
  }

  const syncAll = () => {
    setVisitas(prev => prev.map(v => ({ ...v, sync: true })))
    toast.success('Sincronização concluída!', 'Todas as visitas estão atualizadas.')
  }

  const visitaRows = () => visitas.map(v => ({
    'Família':    v.familia,
    'Data':       new Date(v.data).toLocaleDateString('pt-BR'),
    'Horário':    v.hora,
    'Formulário': v.formulario ? 'Sim' : 'Não',
    'Status':     v.sync ? 'Sincronizado' : 'Offline',
  }))

  const handleExportarCsv = () => {
    exportToCsv('registros_visitas', visitaRows())
    toast.success('Exportado!', `${visitas.length} visita(s) exportadas.`)
  }

  const handleExportarPdf = async () => {
    const { exportToPdf } = await import('../../utils/exportPdfLoader')
    await exportToPdf({
      title:    'Registros de Visitas',
      subtitle: `${visitas.length} visita(s) · ${mesAtual} · Laço Favela`,
      filename: 'registros_visitas',
      columns: [
        { header: 'Família',    key: 'Família' },
        { header: 'Data',       key: 'Data',       width: 25 },
        { header: 'Horário',    key: 'Horário',    width: 20 },
        { header: 'Formulário', key: 'Formulário', width: 25 },
        { header: 'Status',     key: 'Status',     width: 28 },
      ],
      rows: visitaRows(),
    })
    toast.success('PDF gerado!', `${visitas.length} visita(s).`)
  }

  const mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-5 max-w-[900px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-gray-900 text-lg">Registros de Visitas</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {visitas.length} famílias visitadas em {mesAtual}
          </p>
        </div>
        <div className="flex gap-2">
          {stats.offline > 0 && (
            <Button variant="outline" size="sm" icon={<RefreshCw size={14} />} onClick={syncAll}>
              Sincronizar ({stats.offline})
            </Button>
          )}
          <ExportMenu onExportCsv={handleExportarCsv} onExportPdf={handleExportarPdf} />
          <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setAdding(true)}>
            Nova Visita
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Sincronizadas"  value={stats.sincronizadas} iconBg="bg-emerald-50" icon={<RefreshCw size={18} className="text-emerald-600" />} />
        <StatCard label="Offline"        value={stats.offline}       iconBg="bg-amber-50"   icon={<WifiOff   size={18} className="text-amber-600" />} />
        <StatCard label="Com Formulário" value={stats.comFormulario} iconBg="bg-navy/10"    icon={<FileCheck size={18} className="text-navy" />} />
        <StatCard label="Sem Formulário" value={stats.semFormulario} iconBg="bg-red-50"     icon={<FileX    size={18} className="text-red-500" />} />
      </div>

      {/* Lista */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">
            Histórico de Visitas — {new Date().toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })}
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {visitas.map(v => (
            <div key={v.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
              <div className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                v.sync ? 'bg-emerald-100' : 'bg-amber-100',
              )}>
                {v.sync
                  ? <RefreshCw size={14} className="text-emerald-600" />
                  : <WifiOff   size={14} className="text-amber-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{v.familia}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {dayLabel(v.data)}, {v.hora} · {v.formulario ? 'Formulário enviado' : 'Salvo offline'}
                </p>
              </div>
              <Badge variant={v.sync ? 'success' : 'warning'} dot>
                {v.sync ? 'Sincronizado' : 'Offline'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal nova visita */}
      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Registrar Nova Visita"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setAdding(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleAdd}>Registrar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Família"
            placeholder="Ex: Família Santos"
            required
            value={newForm.familia}
            onChange={e => setNewForm(p => ({ ...p, familia: e.target.value }))}
            autoFocus
          />
          <Input
            label="Horário da visita"
            type="time"
            value={newForm.hora}
            onChange={e => setNewForm(p => ({ ...p, hora: e.target.value }))}
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newForm.formulario}
              onChange={e => setNewForm(p => ({ ...p, formulario: e.target.checked }))}
              className="rounded border-gray-300 text-navy"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Formulário preenchido</p>
              <p className="text-xs text-gray-400">Marque se o formulário foi enviado nesta visita</p>
            </div>
          </label>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
            A visita será salva <strong>offline</strong> e sincronizada quando houver conexão.
          </div>
        </div>
      </Modal>
    </div>
  )
}
