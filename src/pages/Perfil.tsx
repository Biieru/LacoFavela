import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, X, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const RENDA_OPCOES = ['Menos de 1 salário mínimo', '1 salário mínimo', '2 salários mínimos', '3 ou mais salários mínimos']

const ROLE_LABELS: Record<string, string> = { admin: 'Administrador', presidente: 'Presidente', morador: 'Morador' }
const ROLE_BADGE:  Record<string, 'info' | 'gold' | 'success'> = { admin: 'info', presidente: 'gold', morador: 'success' }

// ── Campos do Presidente ────────────────────────────────────────
function PresidenteFields({ form, set }: { form: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <>
      <Input
        label="Nome Completo da Liderança"
        placeholder="Ex: André Alves de Oliveira"
        required
        value={form.nome}
        onChange={e => set('nome', e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Nome da organização que representa"
            placeholder="Ex: Iniciativa Filha"
            value={form.organizacao}
            onChange={e => set('organizacao', e.target.value)}
          />
        </div>
        <Input
          label="CNPJ da organização"
          placeholder="000.000.000-00"
          value={form.cnpj}
          onChange={e => set('cnpj', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Endereço"
            placeholder="Rua, número, bairro, cidade - UF"
            value={form.endereco}
            onChange={e => set('endereco', e.target.value)}
          />
        </div>
        <Input
          label="Telefone"
          placeholder="(83) 00000.0000"
          value={form.telefone}
          onChange={e => set('telefone', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Redes Sociais"
          placeholder="@seu.usuario"
          value={form.redes}
          onChange={e => set('redes', e.target.value)}
        />
        <Input
          label="Comunidade atuante"
          placeholder="Ex: Alto Santa Isabel"
          value={form.comunidade}
          onChange={e => set('comunidade', e.target.value)}
        />
        <Input
          label="Trabalho / Profissão"
          placeholder="Ex: Técnico em Informática"
          value={form.trabalho}
          onChange={e => set('trabalho', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Renda Familiar</label>
          <select
            value={form.renda}
            onChange={e => set('renda', e.target.value)}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          >
            {RENDA_OPCOES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <Input
          label="Quantidade de integrantes da casa"
          type="number"
          placeholder="Ex: 3"
          value={form.integrantes}
          onChange={e => set('integrantes', e.target.value)}
        />
      </div>
    </>
  )
}

// ── Campos do Morador ───────────────────────────────────────────
function MoradorFields({ form, set }: { form: Record<string, string>; set: (k: string, v: string) => void }) {
  return (
    <>
      <Input
        label="Nome Completo"
        placeholder="Seu nome completo"
        required
        value={form.nome}
        onChange={e => set('nome', e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="E-mail" type="email" value={form.email}
          onChange={e => set('email', e.target.value)} placeholder="seu@email.com" />
        <Input label="Telefone" value={form.telefone}
          onChange={e => set('telefone', e.target.value)} placeholder="(00) 00000-0000" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input label="Endereço" value={form.endereco}
            onChange={e => set('endereco', e.target.value)} placeholder="Rua, número, bairro, cidade - UF" />
        </div>
        <Input label="Comunidade" value={form.comunidade}
          onChange={e => set('comunidade', e.target.value)} placeholder="Ex: Filinha" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Renda Familiar</label>
          <select value={form.renda} onChange={e => set('renda', e.target.value)}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy">
            {RENDA_OPCOES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <Input label="Quantidade de Integrantes" type="number" value={form.integrantes}
          onChange={e => set('integrantes', e.target.value)} placeholder="Ex: 3" />
        <Input label="Presidente responsável" value={form.presidenteRua}
          onChange={e => set('presidenteRua', e.target.value)} placeholder="Nome do presidente" />
      </div>
    </>
  )
}

// ── Página ─────────────────────────────────────────────────────
export default function Perfil() {
  const { user }  = useAuth()
  const toast     = useToast()
  const navigate  = useNavigate()

  const [form, setForm] = useState<Record<string, string>>({
    nome:          user?.name ?? '',
    email:         'carlos@comunidade.com',
    telefone:      '(83) 00000.0000',
    endereco:      'Rua do Santa Laço, 00, Amarração, Recife - PE',
    comunidade:    'Alto Santa Isabel',
    renda:         '2 salários mínimos',
    integrantes:   '3',
    presidenteRua: 'André Alves',
    // presidente-specific
    organizacao:   'Iniciativa Filha',
    cnpj:          '000.000.000-00',
    redes:         '@apoioandirealves',
    trabalho:      'Técnico em Informática',
    setor:         user?.setor ?? '',
  })

  const [senha, setSenha]       = useState({ nova: '', confirma: '' })
  const [showNova, setShowNova] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)
  const [savedSenha,   setSavedSenha]   = useState(false)

  const set = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }))

  const handleSalvarPerfil = () => {
    if (!form.nome.trim()) { toast.error('O nome é obrigatório.'); return }
    setSavedProfile(true)
    toast.success('Perfil salvo!', 'Suas informações foram atualizadas.')
    setTimeout(() => setSavedProfile(false), 2000)
  }

  const handleSalvarSenha = () => {
    if (!senha.nova || !senha.confirma)  { toast.error('Preencha os campos de senha.'); return }
    if (senha.nova.length < 6)           { toast.error('A senha deve ter no mínimo 6 caracteres.'); return }
    if (senha.nova !== senha.confirma)   { toast.error('As senhas não conferem.'); return }
    setSavedSenha(true)
    setSenha({ nova: '', confirma: '' })
    toast.success('Senha alterada com sucesso!')
    setTimeout(() => setSavedSenha(false), 2000)
  }

  const isPresidente = user?.role === 'presidente'

  return (
    <div className="space-y-6 max-w-[900px]">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-2xl font-black text-gold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">{form.nome || user?.name}</h2>
              <Badge variant={ROLE_BADGE[user?.role ?? 'morador']}>
                {ROLE_LABELS[user?.role ?? 'morador']}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{form.email}</p>
          </div>
        </div>
      </div>

      {/* Dados pessoais */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-5">
          {isPresidente ? 'Dados do Presidente' : 'Dados do Morador'}
        </h3>

        <div className="space-y-4">
          {isPresidente
            ? <PresidenteFields form={form} set={set} />
            : <MoradorFields    form={form} set={set} />}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            icon={<X size={14} />}
            onClick={() => setForm(p => ({ ...p, nome: user?.name ?? '' }))}
          >
            Descartar
          </Button>
          <Button
            variant="primary"
            icon={savedProfile ? <CheckCircle2 size={14} /> : <Save size={14} />}
            onClick={handleSalvarPerfil}
          >
            {savedProfile ? 'Salvo!' : 'Salvar'}
          </Button>
        </div>
      </Card>

      {/* Alteração de Senha */}
      <Card padding="md">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center">
            <Lock size={16} className="text-navy" />
          </div>
          <h3 className="font-semibold text-gray-900">Alteração de Senha</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Nova senha</label>
            <div className="relative">
              <input
                type={showNova ? 'text' : 'password'}
                value={senha.nova}
                onChange={e => setSenha(p => ({ ...p, nova: e.target.value }))}
                placeholder="Digite a nova senha"
                className="w-full h-11 pl-4 pr-10 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy hover:border-gray-300 transition-colors"
              />
              <button type="button" onClick={() => setShowNova(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNova ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Confirme sua nova senha</label>
            <div className="relative">
              <input
                type={showConf ? 'text' : 'password'}
                value={senha.confirma}
                onChange={e => setSenha(p => ({ ...p, confirma: e.target.value }))}
                placeholder="Digite a senha novamente"
                className="w-full h-11 pl-4 pr-10 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy hover:border-gray-300 transition-colors"
              />
              <button type="button" onClick={() => setShowConf(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {senha.nova && senha.confirma && senha.nova !== senha.confirma && (
          <p className="text-xs text-red-500 mt-2">As senhas não conferem.</p>
        )}

        <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
          <Button variant="outline" icon={<X size={14} />}
            onClick={() => setSenha({ nova: '', confirma: '' })}>
            Descartar
          </Button>
          <Button
            variant="primary"
            icon={savedSenha ? <CheckCircle2 size={14} /> : <Lock size={14} />}
            onClick={handleSalvarSenha}
            disabled={!senha.nova || !senha.confirma}
          >
            {savedSenha ? 'Salva!' : 'Salvar nova senha'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
