export type UserRole = 'admin' | 'presidente' | 'morador'

export interface User {
  id: string
  name: string
  role: UserRole
  setor?: string
  avatar?: string
}

export interface Presidente {
  id: string
  name: string
  setor: string
  cotas: number
  metaCotas: number
  visitas: number
  eventos: number
  finalizacao: number
  score: number
  status: 'ativo' | 'alerta' | 'penalizado'
  avatar?: string
}

export interface Familia {
  id: string
  name: string
  presidenteId: string
  presidenteName: string
  filhos: number
  maeSolo: boolean
  rendaFamiliar: number
  participacoes: number
  score: number
  preAprovado: boolean
  status: 'ativa' | 'inativa' | 'pendente'
  criterio: 'alta-participacao' | 'mae-solo' | 'tres-filhos' | 'renda-baixa' | 'geral'
}

export interface Formulario {
  id: string
  titulo: string
  descricao: string
  tipo: 'cadastro' | 'pesquisa' | 'evento' | 'feedback'
  status: 'ativo' | 'rascunho' | 'encerrado'
  respostas: number
  criadoEm: string
  encerraEm?: string
  campos: FormularioCampo[]
}

export interface FormularioCampo {
  id: string
  label: string
  tipo: 'texto' | 'numero' | 'selecao' | 'checkbox' | 'data' | 'textarea'
  obrigatorio: boolean
  opcoes?: string[]
}

export interface Aprovado {
  id: string
  familiaId: string
  familiaName: string
  presidenteName: string
  pontuacao: number
  criterio: string
  status: 'aprovado' | 'pendente' | 'recusado'
  ciclo: string
  dataAprovacao?: string
}

export interface Feedback {
  id: string
  tipo: 'denuncia' | 'sugestao' | 'elogio'
  mensagem: string
  recebidoEm: string
  lido: boolean
  setor?: string
}

export interface HistoricoEvento {
  id: string
  data: string
  titulo: string
  descricao: string
  tipo: 'ciclo' | 'evento' | 'aprovacao' | 'formulario'
  ciclo?: string
}

export interface CicloStats {
  ciclo: string
  mes: string
  familiasCadastradas: number
  familiasBeneficiadas: number
  eventosRealizados: number
  taxaAprovacao: number
}

export interface DashboardStats {
  familiasCadastradas: number
  variacaoFamilias: number
  presidentesAtivos: number
  variacaoPresidentes: number
  aprovacoesExecutadas: number
  variacaoAprovacoes: number
  feedbacksRecentes: number
  feedbacksNaoLidos: number
}
