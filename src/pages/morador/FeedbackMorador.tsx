import { useState } from 'react'
import { Shield, ThumbsUp, Lightbulb, AlertTriangle, Send, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import clsx from 'clsx'

type TipoFeedback = 'elogio' | 'sugestao' | 'denuncia'

const TIPOS: { key: TipoFeedback; label: string; icon: React.ReactNode; color: string; bg: string; border: string }[] = [
  { key: 'elogio',   label: 'Elogio',   icon: <ThumbsUp     size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-300' },
  { key: 'sugestao', label: 'Sugestão', icon: <Lightbulb    size={18} />, color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-300' },
  { key: 'denuncia', label: 'Denúncia', icon: <AlertTriangle size={18} />, color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-300' },
]

export default function FeedbackMorador() {
  const { feedbacks } = useApp()
  const toast = useToast()

  const [tipo,    setTipo]    = useState<TipoFeedback | null>(null)
  const [mensagem,setMensagem]= useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  const chars = mensagem.length

  const handleEnviar = async () => {
    if (!tipo)                  { toast.error('Selecione o tipo de feedback.'); return }
    if (mensagem.trim().length < 10) { toast.error('Mensagem muito curta (mínimo 10 caracteres).'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setEnviado(true)
    toast.success('Feedback enviado!', 'Obrigado pela sua contribuição.')
  }

  if (enviado) {
    return (
      <div className="max-w-[600px]">
        <Card padding="lg" className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Feedback enviado!</h2>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Sua mensagem foi recebida de forma completamente anônima. Obrigado por contribuir com a melhoria da comunidade.
          </p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => { setEnviado(false); setTipo(null); setMensagem('') }}
          >
            Enviar outro feedback
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-[700px]">
      {/* Aviso de anonimato */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-blue-50 border border-blue-200">
        <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Nenhum dado pessoal será associado ao seu feedback. Sua mensagem será enviada de forma <strong>completamente anônima</strong> e segura.
        </p>
      </div>

      <Card padding="md">
        {/* Tipo */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Tipo de Feedback:</p>
          <div className="grid grid-cols-3 gap-3">
            {TIPOS.map(t => (
              <button key={t.key} onClick={() => setTipo(t.key)}
                className={clsx(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  tipo === t.key
                    ? `${t.bg} ${t.border} shadow-sm`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                )}>
                <span className={tipo === t.key ? t.color : 'text-gray-400'}>{t.icon}</span>
                <span className={clsx('text-sm font-semibold', tipo === t.key ? t.color : 'text-gray-500')}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mensagem */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Sua mensagem</p>
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">Descreva aqui</p>
          <div className={clsx(
            'rounded-xl border-2 transition-all',
            tipo === 'elogio'   ? 'border-emerald-200 focus-within:border-emerald-400' :
            tipo === 'sugestao' ? 'border-amber-200   focus-within:border-amber-400' :
            tipo === 'denuncia' ? 'border-red-200     focus-within:border-red-400' :
            'border-gray-200 focus-within:border-navy/40',
          )}>
            <textarea
              value={mensagem}
              onChange={e => setMensagem(e.target.value.slice(0, 500))}
              placeholder="Ex: A entrega das doações poderia ser feita em outro horário..."
              rows={7}
              className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none bg-transparent"
            />
          </div>
          <p className={clsx('text-xs mt-1.5 text-right', chars > 450 ? 'text-amber-500' : 'text-gray-400')}>
            {chars}/500 caracteres
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Shield size={12} />
            100% anônimo · sem rastreamento
          </p>
          <Button
            variant="primary"
            icon={<Send size={14} />}
            onClick={handleEnviar}
            loading={loading}
            disabled={!tipo || mensagem.trim().length < 10}
          >
            Enviar anonimamente
          </Button>
        </div>
      </Card>
    </div>
  )
}
