import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Presidente, Familia, Formulario, Aprovado, Feedback, HistoricoEvento } from '../types'
import {
  MOCK_PRESIDENTES, MOCK_FAMILIAS, MOCK_FORMULARIOS,
  MOCK_APROVADOS, MOCK_FEEDBACKS, MOCK_HISTORICO,
} from '../data/mockData'

interface Ciclo {
  id: string
  nome: string
  periodo: string
  metaFamilias: number
  dataInicio: string
  dataEncerramento: string
  status: 'ativo' | 'encerrado' | 'planejado'
}

interface Notification {
  id: string
  tipo: 'feedback' | 'alerta' | 'aprovacao' | 'ciclo'
  titulo: string
  descricao: string
  lida: boolean
  criadaEm: string
}

interface AppContextValue {
  presidentes:   Presidente[]
  familias:      Familia[]
  formularios:   Formulario[]
  aprovados:     Aprovado[]
  feedbacks:     Feedback[]
  historico:     HistoricoEvento[]
  ciclos:        Ciclo[]
  notifications: Notification[]

  // Presidentes
  addPresidente:    (p: Omit<Presidente, 'id'>) => void
  updatePresidente: (id: string, data: Partial<Presidente>) => void
  removePresidente: (id: string) => void

  // Formularios
  addFormulario:    (f: Omit<Formulario, 'id'>) => void
  updateFormulario: (id: string, data: Partial<Formulario>) => void
  removeFormulario: (id: string) => void

  // Aprovados
  gerarAprovados:   (familiaIds: string[]) => void
  updateAprovado:   (id: string, data: Partial<Aprovado>) => void

  // Feedbacks
  markFeedbackRead:    (id: string) => void
  markAllFeedbackRead: () => void

  // Ciclos
  addCiclo: (c: Omit<Ciclo, 'id'>) => void

  // Notifications
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  unreadNotifications: number
}

const AppContext = createContext<AppContextValue | null>(null)

const INITIAL_CICLOS: Ciclo[] = [
  { id: 'c1', nome: 'Ciclo 1', periodo: 'Out/24', metaFamilias: 30, dataInicio: '2024-10-01', dataEncerramento: '2024-12-31', status: 'encerrado' },
  { id: 'c2', nome: 'Ciclo 2', periodo: 'Fev/25', metaFamilias: 45, dataInicio: '2025-02-01', dataEncerramento: '2025-04-30', status: 'encerrado' },
  { id: 'c3', nome: 'Ciclo 3', periodo: 'Mai/25', metaFamilias: 50, dataInicio: '2025-05-01', dataEncerramento: '2025-07-31', status: 'ativo' },
]

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', tipo: 'feedback',  titulo: 'Nova denúncia recebida',           descricao: 'Uma nova denúncia anônima foi enviada sobre o Setor D.',    lida: false, criadaEm: '2025-04-20T14:32:00' },
  { id: 'n2', tipo: 'alerta',    titulo: 'Presidente em alerta',             descricao: 'Felipe Ramos está com score abaixo do esperado (52).',      lida: false, criadaEm: '2025-04-19T10:00:00' },
  { id: 'n3', tipo: 'aprovacao', titulo: '5 famílias aprovadas',             descricao: 'Ciclo 3 — aprovações publicadas com sucesso.',              lida: false, criadaEm: '2025-04-18T09:00:00' },
  { id: 'n4', tipo: 'ciclo',     titulo: 'Ciclo 3 encerrando em breve',      descricao: 'O ciclo atual encerra em 31/07. Prepare os relatórios.',    lida: true,  criadaEm: '2025-04-15T08:00:00' },
  { id: 'n5', tipo: 'feedback',  titulo: 'Nova sugestão recebida',           descricao: 'Sugestão sobre campo de saúde no formulário de cadastro.',  lida: true,  criadaEm: '2025-04-10T11:00:00' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [presidentes,   setPresidentes]   = useState(MOCK_PRESIDENTES)
  const [familias,      setFamilias]      = useState(MOCK_FAMILIAS)
  const [formularios,   setFormularios]   = useState(MOCK_FORMULARIOS)
  const [aprovados,     setAprovados]     = useState(MOCK_APROVADOS)
  const [feedbacks,     setFeedbacks]     = useState(MOCK_FEEDBACKS)
  const [historico,     setHistorico]     = useState(MOCK_HISTORICO)
  const [ciclos,        setCiclos]        = useState(INITIAL_CICLOS)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  // Presidentes
  const addPresidente = useCallback((p: Omit<Presidente, 'id'>) => {
    const novo = { ...p, id: `p${Date.now()}` }
    setPresidentes(prev => [...prev, novo])
  }, [])

  const updatePresidente = useCallback((id: string, data: Partial<Presidente>) => {
    setPresidentes(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }, [])

  const removePresidente = useCallback((id: string) => {
    setPresidentes(prev => prev.filter(p => p.id !== id))
  }, [])

  // Formularios
  const addFormulario = useCallback((f: Omit<Formulario, 'id'>) => {
    const novo = { ...f, id: `form${Date.now()}` }
    setFormularios(prev => [novo, ...prev])
  }, [])

  const updateFormulario = useCallback((id: string, data: Partial<Formulario>) => {
    setFormularios(prev => prev.map(f => f.id === id ? { ...f, ...data } : f))
  }, [])

  const removeFormulario = useCallback((id: string) => {
    setFormularios(prev => prev.filter(f => f.id !== id))
  }, [])

  // Aprovados
  const gerarAprovados = useCallback((familiaIds: string[]) => {
    const cicloAtivo = ciclos.find(c => c.status === 'ativo')?.nome ?? 'Ciclo Atual'
    const novas: Aprovado[] = familias
      .filter(f => familiaIds.includes(f.id))
      .filter(f => !aprovados.some(a => a.familiaId === f.id))
      .map(f => ({
        id:             `a${Date.now()}-${f.id}`,
        familiaId:      f.id,
        familiaName:    f.name,
        presidenteName: f.presidenteName,
        pontuacao:      f.score,
        criterio:       f.criterio === 'alta-participacao' ? 'Alta Participação'
                      : f.criterio === 'mae-solo'          ? 'Mãe Solo'
                      : f.criterio === 'tres-filhos'       ? '+3 Filhos'
                      : f.criterio === 'renda-baixa'       ? 'Renda Baixa'
                      : 'Geral',
        status:         'pendente' as const,
        ciclo:          cicloAtivo,
      }))

    if (novas.length === 0) return

    setAprovados(prev => [...novas, ...prev])

    const evento: HistoricoEvento = {
      id:        `h${Date.now()}`,
      data:      new Date().toISOString(),
      titulo:    `${novas.length} família(s) enviadas para aprovação`,
      descricao: `Ciclo: ${cicloAtivo}. Famílias: ${novas.map(n => n.familiaName).join(', ')}.`,
      tipo:      'aprovacao',
      ciclo:     cicloAtivo,
    }
    setHistorico(prev => [evento, ...prev])

    const notif: Notification = {
      id:        `notif${Date.now()}`,
      tipo:      'aprovacao',
      titulo:    `${novas.length} família(s) enviadas para aprovação`,
      descricao: `Aguardando revisão no ciclo ${cicloAtivo}.`,
      lida:      false,
      criadaEm:  new Date().toISOString(),
    }
    setNotifications(prev => [notif, ...prev])
  }, [familias, aprovados, ciclos])

  const updateAprovado = useCallback((id: string, data: Partial<Aprovado>) => {
    setAprovados(prev => prev.map(a => a.id === id ? { ...a, ...data } : a))
  }, [])

  // Feedbacks
  const markFeedbackRead = useCallback((id: string) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, lido: true } : f))
  }, [])

  const markAllFeedbackRead = useCallback(() => {
    setFeedbacks(prev => prev.map(f => ({ ...f, lido: true })))
  }, [])

  // Ciclos
  const addCiclo = useCallback((c: Omit<Ciclo, 'id'>) => {
    const novo = { ...c, id: `c${Date.now()}` }
    setCiclos(prev => [...prev, novo])

    const evento: HistoricoEvento = {
      id:        `h${Date.now()}`,
      data:      new Date().toISOString(),
      titulo:    `${novo.nome} iniciado`,
      descricao: `Meta de ${novo.metaFamilias} famílias. Período: ${novo.periodo}.`,
      tipo:      'ciclo',
      ciclo:     novo.nome,
    }
    setHistorico(prev => [evento, ...prev])
  }, [])

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, lida: true })))
  }, [])

  const unreadNotifications = notifications.filter(n => !n.lida).length

  return (
    <AppContext.Provider value={{
      presidentes, familias, formularios, aprovados, feedbacks, historico, ciclos, notifications,
      addPresidente, updatePresidente, removePresidente,
      addFormulario, updateFormulario, removeFormulario,
      gerarAprovados, updateAprovado,
      markFeedbackRead, markAllFeedbackRead,
      addCiclo,
      markNotificationRead, markAllNotificationsRead,
      unreadNotifications,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
