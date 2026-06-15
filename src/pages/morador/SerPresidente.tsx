import { useState } from 'react'
import { CheckCircle2, Home, AlertCircle, Send } from 'lucide-react'
import { NIVEIS_ENGAJAMENTO, MORADOR_PONTOS_ATUAL } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import clsx from 'clsx'

const REQUISITOS = [
  { id: 'r1', texto: 'Ser morador cadastrado há pelo menos 6 meses',       atendido: true  },
  { id: 'r2', texto: 'Nível de engajamento mínimo: Nível 2',                atendido: true  },
  { id: 'r3', texto: 'Não ter pendências no sistema',                       atendido: true  },
  { id: 'r4', texto: 'Comprometer-se com reuniões mensais obrigatórias',    atendido: true  },
]

export default function SerPresidente() {
  const { user }  = useAuth()
  const toast     = useToast()
  const [motivacao, setMotivacao] = useState('')
  const [enviado,   setEnviado]   = useState(false)
  const [loading,   setLoading]   = useState(false)

  const nivelAtual  = [...NIVEIS_ENGAJAMENTO].reverse().find(n => MORADOR_PONTOS_ATUAL >= n.minPontos) ?? NIVEIS_ENGAJAMENTO[0]
  const todosAtendidos = REQUISITOS.every(r => r.atendido)
  const chars = motivacao.length

  const handleEnviar = async () => {
    if (!motivacao.trim()) { toast.error('Preencha sua motivação antes de enviar.'); return }
    if (motivacao.trim().length < 30) { toast.error('Descreva melhor sua motivação (mínimo 30 caracteres).'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setEnviado(true)
    toast.success('Candidatura enviada!', 'Em breve você receberá um retorno.')
  }

  if (enviado) {
    return (
      <div className="max-w-[700px]">
        <Card padding="lg" className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Candidatura enviada!</h2>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Sua candidatura foi recebida com sucesso. Em breve você receberá uma notificação com o resultado da avaliação.
          </p>
          <div className="mt-6 p-4 rounded-xl bg-gray-50 text-sm text-gray-600 max-w-xs mx-auto">
            Prazo de análise: <strong>até 5 dias úteis</strong>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-[1000px]">
      {/* Banner */}
      <div className="rounded-2xl bg-navy p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
        <div className="flex items-center gap-4 relative">
          <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center shrink-0">
            <Home size={24} className="text-gold" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Seja um Líder Comunitário!</h2>
            <p className="text-white/60 text-sm mt-0.5">
              Represente sua comunidade e ajude a transformar o Laço Favela. Sua candidatura é avaliada pela equipe e pela própria comunidade.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Requisitos */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-4">Requisitos</h3>
          <div className="space-y-3">
            {REQUISITOS.map(req => (
              <div key={req.id} className="flex items-start gap-3">
                <CheckCircle2 size={18} className={req.atendido ? 'text-emerald-500 shrink-0 mt-0.5' : 'text-gray-300 shrink-0 mt-0.5'} />
                <p className={clsx('text-sm', req.atendido ? 'text-gray-700' : 'text-gray-400')}>{req.texto}</p>
              </div>
            ))}
          </div>

          {todosAtendidos ? (
            <div className="mt-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <p className="text-sm font-medium text-emerald-700">Você cumpre todos os requisitos!</p>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
              <AlertCircle size={16} className="text-amber-500 shrink-0" />
              <p className="text-sm text-amber-700">Você não cumpre todos os requisitos ainda.</p>
            </div>
          )}
        </Card>

        {/* Dados da inscrição */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 mb-4">Dados da Inscrição</h3>
          <div className="space-y-3">
            {[
              { label: 'Nome',              value: user?.name ?? '—' },
              { label: 'Comunidade',        value: 'Filinha — Setor A' },
              { label: 'Nível',             value: `Nível ${nivelAtual.nivel} — ${nivelAtual.nome}` },
              { label: 'Tempo na comunidade', value: '2 anos e 4 meses' },
              { label: 'Pontos',            value: `${MORADOR_PONTOS_ATUAL} pts` },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-medium text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Motivação */}
      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-1">Por que você quer ser presidente?</h3>
        <p className="text-xs text-gray-500 mb-4">Sua motivação</p>
        <div className="relative">
          <textarea
            value={motivacao}
            onChange={e => setMotivacao(e.target.value.slice(0, 500))}
            placeholder="Conte sua motivação, planos e o que melhoraria na comunidade..."
            rows={6}
            disabled={!todosAtendidos}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors resize-none',
              todosAtendidos ? 'border-gray-200 hover:border-gray-300' : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60',
            )}
          />
          <p className={clsx(
            'text-xs mt-1.5 text-right',
            chars > 450 ? 'text-amber-500' : 'text-gray-400'
          )}>
            {chars}/500 caracteres
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          {!todosAtendidos && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle size={12} /> Complete os requisitos para candidatar-se.
            </p>
          )}
          <Button
            variant="primary"
            icon={<Send size={14} />}
            onClick={handleEnviar}
            loading={loading}
            disabled={!todosAtendidos || !motivacao.trim()}
            className="ml-auto"
          >
            Enviar candidatura
          </Button>
        </div>
      </Card>
    </div>
  )
}
