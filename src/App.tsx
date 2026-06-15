import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'

// Admin pages
import Dashboard   from './pages/Dashboard'
import Formularios from './pages/Formularios'
import Presidentes from './pages/Presidentes'
import Familias    from './pages/Familias'
import Aprovados   from './pages/Aprovados'
import Feedbacks   from './pages/Feedbacks'
import Historico   from './pages/Historico'

// Presidente pages
import PresidenteHome       from './pages/presidente/Home'
import PresidenteFamilias   from './pages/presidente/Familias'
import PresidenteFormularios from './pages/presidente/Formularios'
import Registros            from './pages/presidente/Registros'
import MeuIndicador         from './pages/presidente/MeuIndicador'
import RankingPresidente    from './pages/presidente/RankingPresidente'

// Morador pages
import MoradorInicio        from './pages/morador/Inicio'
import MoradorNotificacoes  from './pages/morador/Notificacoes'
import Acompanhamento       from './pages/morador/Acompanhamento'
import RankingMorador       from './pages/morador/Ranking'
import SerPresidente        from './pages/morador/SerPresidente'
import FeedbackMorador      from './pages/morador/FeedbackMorador'

// Shared
import Perfil from './pages/Perfil'

import type { UserRole } from './types'

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

/** Renderiza o Home correto de acordo com o role */
function HomeByRole() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'morador')    return <MoradorInicio />
  if (user.role === 'presidente') return <PresidenteHome />
  return <Dashboard />
}

/** Famílias — componente diferente por role */
function FamiliasPage() {
  const { user } = useAuth()
  if (user?.role === 'presidente') return <PresidenteFamilias />
  return <Familias />
}

/** Formulários — componente diferente por role */
function FormulariosPage() {
  const { user } = useAuth()
  if (user?.role === 'presidente') return <PresidenteFormularios />
  return <Formularios />
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />

      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        {/* Home — dinâmico por role */}
        <Route index element={<HomeByRole />} />

        {/* Perfil — apenas presidente e morador (admin não tem perfil) */}
        <Route path="perfil" element={
          <ProtectedRoute roles={['presidente', 'morador']}><Perfil /></ProtectedRoute>
        } />

        {/* Famílias — admin vê a tela de admin, presidente vê a própria lista */}
        <Route path="familias" element={
          <ProtectedRoute roles={['admin', 'presidente']}><FamiliasPage /></ProtectedRoute>
        } />

        {/* Formulários — admin vê o builder, presidente vê os formulários do ciclo */}
        <Route path="formularios" element={
          <ProtectedRoute roles={['admin', 'presidente']}><FormulariosPage /></ProtectedRoute>
        } />

        {/* Admin + Presidente */}
        <Route path="aprovados" element={
          <ProtectedRoute roles={['admin', 'presidente']}><Aprovados /></ProtectedRoute>
        } />
        <Route path="historico" element={
          <ProtectedRoute roles={['admin', 'presidente']}><Historico /></ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="presidentes" element={
          <ProtectedRoute roles={['admin']}><Presidentes /></ProtectedRoute>
        } />
        <Route path="feedbacks" element={
          <ProtectedRoute roles={['admin']}><Feedbacks /></ProtectedRoute>
        } />

        {/* Presidente only */}
        <Route path="registros" element={
          <ProtectedRoute roles={['presidente']}><Registros /></ProtectedRoute>
        } />
        <Route path="meu-indicador" element={
          <ProtectedRoute roles={['presidente']}><MeuIndicador /></ProtectedRoute>
        } />
        <Route path="meu-ranking" element={
          <ProtectedRoute roles={['presidente']}><RankingPresidente /></ProtectedRoute>
        } />

        {/* Morador only */}
        <Route path="notificacoes" element={
          <ProtectedRoute roles={['morador']}><MoradorNotificacoes /></ProtectedRoute>
        } />
        <Route path="acompanhamento" element={
          <ProtectedRoute roles={['morador']}><Acompanhamento /></ProtectedRoute>
        } />
        <Route path="ranking" element={
          <ProtectedRoute roles={['morador']}><RankingMorador /></ProtectedRoute>
        } />
        <Route path="ser-presidente" element={
          <ProtectedRoute roles={['morador']}><SerPresidente /></ProtectedRoute>
        } />
        <Route path="feedback" element={
          <ProtectedRoute roles={['morador']}><FeedbackMorador /></ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
