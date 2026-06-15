import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Preencha todos os campos.')
      return
    }
    setError('')
    setLoading(true)
    const result = await login(username.trim(), password.trim())
    setLoading(false)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Credenciais inválidas.')
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel */}
      <div className="hidden lg:flex w-[52%] bg-navy flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute bottom-[-15%] left-[-5%] w-80 h-80 rounded-full bg-gold/10" />
          <div className="absolute top-[40%] left-[30%] w-48 h-48 rounded-full bg-white/3" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gold flex items-center justify-center font-black text-navy text-[11px] leading-none">
              LAÇO
            </div>
            <div>
              <p className="font-black text-white text-xl tracking-tight">Laço Favela</p>
              <p className="text-white/50 text-xs uppercase tracking-widest">Família</p>
            </div>
          </div>
        </div>

        <div className="relative space-y-6">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight">
              Gestão Comunitária<br />
              <span className="text-gold">de verdade.</span>
            </h2>
            <p className="text-white/60 mt-4 text-base leading-relaxed max-w-sm">
              Conecte presidentes, famílias e administradores em uma plataforma transparente e eficiente.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Famílias', value: '487+' },
              { label: 'Presidentes', value: '12' },
              { label: 'Ciclos', value: '3' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-gold">{s.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-white/30 text-xs">
            © 2025 Laço Favela · Todos os direitos reservados
          </p>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center font-black text-gold text-[9px] leading-none">
              LAÇO
            </div>
            <p className="font-black text-navy text-xl">Laço Favela</p>
          </div>

          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-gray-900">Bem-vindo de volta</h1>
              <p className="text-gray-500 text-sm mt-1">Acesse sua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Usuário"
                placeholder="admin, presidente ou morador"
                value={username}
                onChange={e => { setUsername(e.target.value); setError('') }}
                leftIcon={<User size={16} />}
                autoComplete="username"
                autoFocus
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Senha</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••"
                    autoComplete="current-password"
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy hover:border-gray-300 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 animate-fade-in">
                  <AlertCircle size={15} className="shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full rounded-xl"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
