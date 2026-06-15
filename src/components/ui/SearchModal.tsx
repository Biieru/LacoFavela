import { useState, useEffect, useRef } from 'react'
import { Search, Users, Home, CheckCircle, FileText, X, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import clsx from 'clsx'

interface SearchResult {
  type: 'presidente' | 'familia' | 'aprovado' | 'formulario'
  id: string
  label: string
  sub: string
  route: string
}

const TYPE_CONFIG = {
  presidente: { icon: <Users    size={14} />, color: 'text-navy',    bg: 'bg-navy/10',    label: 'Presidente' },
  familia:    { icon: <Home     size={14} />, color: 'text-blue-600',  bg: 'bg-blue-50',  label: 'Família' },
  aprovado:   { icon: <CheckCircle size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Aprovado' },
  formulario: { icon: <FileText size={14} />, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Formulário' },
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: Props) {
  const { presidentes, familias, aprovados, formularios } = useApp()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const results: SearchResult[] = query.trim().length < 2 ? [] : [
    ...presidentes
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.setor.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(p => ({ type: 'presidente' as const, id: p.id, label: p.name, sub: p.setor, route: '/presidentes' })),
    ...familias
      .filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(f => ({ type: 'familia' as const, id: f.id, label: f.name, sub: f.presidenteName, route: '/familias' })),
    ...aprovados
      .filter(a => a.familiaName.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 2)
      .map(a => ({ type: 'aprovado' as const, id: a.id, label: a.familiaName, sub: a.criterio, route: '/aprovados' })),
    ...formularios
      .filter(f => f.titulo.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 2)
      .map(f => ({ type: 'formulario' as const, id: f.id, label: f.titulo, sub: f.tipo, route: '/formularios' })),
  ]

  const handleSelect = (r: SearchResult) => {
    navigate(r.route)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 animate-slide-up overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar presidentes, famílias, formulários..."
            className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          )}
          <kbd className="hidden sm:block px-2 py-0.5 rounded border border-gray-200 text-[10px] text-gray-400">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="py-10 text-center">
              <Search size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Digite para buscar</p>
              <p className="text-xs text-gray-300 mt-1">Presidentes, famílias, formulários...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400">Nenhum resultado para "<strong>{query}</strong>"</p>
            </div>
          ) : results.map(r => {
            const config = TYPE_CONFIG[r.type]
            return (
              <button
                key={`${r.type}-${r.id}`}
                onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left group"
              >
                <div className={clsx('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', config.bg)}>
                  <span className={config.color}>{config.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{r.label}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span className={clsx('font-medium', config.color)}>{config.label}</span>
                    · {r.sub}
                  </p>
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
