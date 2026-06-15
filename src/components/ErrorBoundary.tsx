import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props  { children: ReactNode }
interface State  { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro na aplicação:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-card p-8 text-center">
            <p className="text-lg font-bold text-navy mb-2">Algo deu errado</p>
            <p className="text-sm text-gray-500 mb-6">
              Não foi possível carregar o Laço Favela. Tente limpar o cache ou acesse{' '}
              <a href="/login" className="text-navy underline">/login</a>.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('fc_user')
                window.location.href = '/login'
              }}
              className="px-5 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
