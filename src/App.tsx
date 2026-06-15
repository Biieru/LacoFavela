import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import type { UserRole } from './types'

const Dashboard             = lazy(() => import('./pages/Dashboard'))
const Formularios           = lazy(() => import('./pages/Formularios'))
const Presidentes           = lazy(() => import('./pages/Presidentes'))
const Familias              = lazy(() => import('./pages/Familias'))
const Aprovados             = lazy(() => import('./pages/Aprovados'))
const Feedbacks             = lazy(() => import('./pages/Feedbacks'))
const Historico             = lazy(() => import('./pages/Historico'))
const PresidenteHome        = lazy(() => import('./pages/presidente/Home'))
const PresidenteFamilias    = lazy(() => import('./pages/presidente/Familias'))
const PresidenteFormularios = lazy(() => import('./pages/presidente/Formularios'))
const Registros             = lazy(() => import('./pages/presidente/Registros'))
const MeuIndicador          = lazy(() => import('./pages/presidente/MeuIndicador'))
const RankingPresidente     = lazy(() => import('./pages/presidente/RankingPresidente'))
const MoradorInicio         = lazy(() => import('./pages/morador/Inicio'))
const MoradorNotificacoes   = lazy(() => import('./pages/morador/Notificacoes'))
const Acompanhamento        = lazy(() => import('./pages/morador/Acompanhamento'))
const RankingMorador        = lazy(() => import('./pages/morador/Ranking'))
const SerPresidente         = lazy(() => import('./pages/morador/SerPresidente'))
const FeedbackMorador       = lazy(() => import('./pages/morador/FeedbackMorador'))
const Perfil                = lazy(() => import('./pages/Perfil'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh] text-navy font-medium">
      Carregando…
    </div>
  )
}

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

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route path="/" element={<AppLayout />}>
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
            <Suspense fallback={<PageLoader />}>
              <AppRoutes />
            </Suspense>
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
