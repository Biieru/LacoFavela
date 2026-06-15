import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import clsx from 'clsx'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void
  success: (title: string, message?: string) => void
  error:   (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info:    (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle  size={18} />,
  error:   <XCircle      size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info          size={18} />,
}

const STYLES: Record<ToastType, string> = {
  success: 'bg-white border-l-4 border-emerald-500 text-emerald-700',
  error:   'bg-white border-l-4 border-red-500    text-red-700',
  warning: 'bg-white border-l-4 border-amber-500  text-amber-700',
  info:    'bg-white border-l-4 border-blue-500   text-blue-700',
}

const ICON_BG: Record<ToastType, string> = {
  success: 'text-emerald-500',
  error:   'text-red-500',
  warning: 'text-amber-500',
  info:    'text-blue-500',
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div className={clsx(
      'flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-hover min-w-[280px] max-w-sm animate-slide-up',
      STYLES[toast.type],
    )}>
      <span className={clsx('mt-0.5 shrink-0', ICON_BG[toast.type])}>
        {ICONS[toast.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
        {toast.message && <p className="text-xs text-gray-500 mt-0.5">{toast.message}</p>}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => remove(id), 4000)
  }, [remove])

  const value: ToastContextValue = {
    toast:   add,
    success: (t, m) => add('success', t, m),
    error:   (t, m) => add('error',   t, m),
    warning: (t, m) => add('warning', t, m),
    info:    (t, m) => add('info',    t, m),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onClose={() => remove(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
