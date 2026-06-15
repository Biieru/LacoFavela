import type {
  Presidente, Familia, Formulario, Aprovado,
  Feedback, HistoricoEvento, DashboardStats
} from '../types'

export const MOCK_PRESIDENTES: Presidente[] = [
  { id: 'p1', name: 'André Costa',    setor: 'Setor A', cotas: 48, metaCotas: 50, visitas: 32, eventos: 8, finalizacao: 96, score: 94, status: 'ativo' },
  { id: 'p2', name: 'Maria Silva',    setor: 'Setor B', cotas: 45, metaCotas: 50, visitas: 28, eventos: 7, finalizacao: 90, score: 89, status: 'ativo' },
  { id: 'p3', name: 'Ana Lima',       setor: 'Setor C', cotas: 36, metaCotas: 50, visitas: 21, eventos: 5, finalizacao: 72, score: 74, status: 'ativo' },
  { id: 'p4', name: 'Felipe Ramos',   setor: 'Setor D', cotas: 21, metaCotas: 50, visitas: 15, eventos: 3, finalizacao: 42, score: 52, status: 'alerta' },
  { id: 'p5', name: 'João Mendes',    setor: 'Setor E', cotas: 18, metaCotas: 50, visitas: 10, eventos: 2, finalizacao: 36, score: 41, status: 'alerta' },
  { id: 'p6', name: 'Carla Souza',    setor: 'Setor F', cotas: 44, metaCotas: 50, visitas: 30, eventos: 9, finalizacao: 88, score: 91, status: 'ativo' },
  { id: 'p7', name: 'Roberto Dias',   setor: 'Setor G', cotas: 8,  metaCotas: 50, visitas: 5,  eventos: 1, finalizacao: 16, score: 22, status: 'penalizado' },
  { id: 'p8', name: 'Priscila Nunes', setor: 'Setor H', cotas: 38, metaCotas: 50, visitas: 24, eventos: 6, finalizacao: 76, score: 78, status: 'ativo' },
  { id: 'p9', name: 'Lucas Ferreira', setor: 'Setor I', cotas: 50, metaCotas: 50, visitas: 35, eventos: 11, finalizacao: 100, score: 98, status: 'ativo' },
  { id: 'p10', name: 'Tatiane Borges', setor: 'Setor J', cotas: 29, metaCotas: 50, visitas: 18, eventos: 4, finalizacao: 58, score: 63, status: 'ativo' },
  { id: 'p11', name: 'Marcos Vieira', setor: 'Setor K', cotas: 12, metaCotas: 50, visitas: 8, eventos: 2, finalizacao: 24, score: 30, status: 'alerta' },
  { id: 'p12', name: 'Sandra Oliveira', setor: 'Setor L', cotas: 41, metaCotas: 50, visitas: 26, eventos: 7, finalizacao: 82, score: 83, status: 'ativo' },
]

export const MOCK_FAMILIAS: Familia[] = [
  { id: 'f1',  name: 'Família Santos',   presidenteId: 'p1', presidenteName: 'André Costa',    filhos: 3, maeSolo: false, rendaFamiliar: 1200, participacoes: 12, score: 88, preAprovado: true,  status: 'ativa',  criterio: 'alta-participacao' },
  { id: 'f2',  name: 'Família Oliveira', presidenteId: 'p2', presidenteName: 'Maria Silva',    filhos: 2, maeSolo: true,  rendaFamiliar: 800,  participacoes: 9,  score: 76, preAprovado: true,  status: 'ativa',  criterio: 'mae-solo' },
  { id: 'f3',  name: 'Família Pereira',  presidenteId: 'p3', presidenteName: 'Ana Lima',       filhos: 4, maeSolo: false, rendaFamiliar: 650,  participacoes: 7,  score: 72, preAprovado: false, status: 'ativa',  criterio: 'tres-filhos' },
  { id: 'f4',  name: 'Família Costa',    presidenteId: 'p1', presidenteName: 'André Costa',    filhos: 1, maeSolo: true,  rendaFamiliar: 550,  participacoes: 11, score: 81, preAprovado: true,  status: 'ativa',  criterio: 'renda-baixa' },
  { id: 'f5',  name: 'Família Alves',    presidenteId: 'p6', presidenteName: 'Carla Souza',    filhos: 5, maeSolo: false, rendaFamiliar: 900,  participacoes: 6,  score: 65, preAprovado: false, status: 'ativa',  criterio: 'tres-filhos' },
  { id: 'f6',  name: 'Família Gomes',    presidenteId: 'p9', presidenteName: 'Lucas Ferreira', filhos: 2, maeSolo: false, rendaFamiliar: 1400, participacoes: 14, score: 92, preAprovado: true,  status: 'ativa',  criterio: 'alta-participacao' },
  { id: 'f7',  name: 'Família Rocha',    presidenteId: 'p4', presidenteName: 'Felipe Ramos',   filhos: 3, maeSolo: true,  rendaFamiliar: 700,  participacoes: 4,  score: 55, preAprovado: false, status: 'ativa',  criterio: 'mae-solo' },
  { id: 'f8',  name: 'Família Lima',     presidenteId: 'p8', presidenteName: 'Priscila Nunes', filhos: 0, maeSolo: false, rendaFamiliar: 1600, participacoes: 8,  score: 70, preAprovado: false, status: 'ativa',  criterio: 'geral' },
  { id: 'f9',  name: 'Família Barbosa',  presidenteId: 'p2', presidenteName: 'Maria Silva',    filhos: 4, maeSolo: true,  rendaFamiliar: 480,  participacoes: 10, score: 84, preAprovado: true,  status: 'ativa',  criterio: 'renda-baixa' },
  { id: 'f10', name: 'Família Carvalho', presidenteId: 'p12', presidenteName: 'Sandra Oliveira', filhos: 2, maeSolo: false, rendaFamiliar: 1100, participacoes: 13, score: 87, preAprovado: true, status: 'ativa', criterio: 'alta-participacao' },
  { id: 'f11', name: 'Família Teixeira', presidenteId: 'p3', presidenteName: 'Ana Lima',       filhos: 3, maeSolo: false, rendaFamiliar: 750,  participacoes: 5,  score: 60, preAprovado: false, status: 'pendente', criterio: 'tres-filhos' },
  { id: 'f12', name: 'Família Mendes',   presidenteId: 'p5', presidenteName: 'João Mendes',    filhos: 1, maeSolo: true,  rendaFamiliar: 620,  participacoes: 3,  score: 48, preAprovado: false, status: 'inativa', criterio: 'mae-solo' },
]

export const MOCK_FORMULARIOS: Formulario[] = [
  {
    id: 'form1',
    titulo: 'Cadastro de Família - Ciclo 4',
    descricao: 'Formulário de cadastro para o ciclo atual de benefícios.',
    tipo: 'cadastro',
    status: 'ativo',
    respostas: 234,
    criadoEm: '2025-04-01T09:00:00',
    encerraEm: '2025-06-30T23:59:59',
    campos: [
      { id: 'c1', label: 'Nome completo', tipo: 'texto', obrigatorio: true },
      { id: 'c2', label: 'Número de filhos', tipo: 'numero', obrigatorio: true },
      { id: 'c3', label: 'Renda familiar (R$)', tipo: 'numero', obrigatorio: true },
      { id: 'c4', label: 'Mãe solo?', tipo: 'selecao', obrigatorio: true, opcoes: ['Sim', 'Não'] },
    ],
  },
  {
    id: 'form2',
    titulo: 'Pesquisa de Satisfação - Evento Maio',
    descricao: 'Avaliação do evento comunitário realizado em maio.',
    tipo: 'pesquisa',
    status: 'encerrado',
    respostas: 87,
    criadoEm: '2025-05-20T14:00:00',
    encerraEm: '2025-05-31T23:59:59',
    campos: [
      { id: 'c1', label: 'Como avalia o evento?', tipo: 'selecao', obrigatorio: true, opcoes: ['Ótimo', 'Bom', 'Regular', 'Ruim'] },
      { id: 'c2', label: 'Comentários adicionais', tipo: 'textarea', obrigatorio: false },
    ],
  },
  {
    id: 'form3',
    titulo: 'Inscrição - Evento Comunitário Junho',
    descricao: 'Inscrições para o próximo evento da comunidade.',
    tipo: 'evento',
    status: 'ativo',
    respostas: 56,
    criadoEm: '2025-06-01T08:00:00',
    encerraEm: '2025-06-20T23:59:59',
    campos: [
      { id: 'c1', label: 'Nome', tipo: 'texto', obrigatorio: true },
      { id: 'c2', label: 'Família', tipo: 'texto', obrigatorio: true },
      { id: 'c3', label: 'Número de participantes', tipo: 'numero', obrigatorio: true },
    ],
  },
]

export const MOCK_APROVADOS: Aprovado[] = [
  { id: 'a1',  familiaId: 'f1',  familiaName: 'Família Santos',   presidenteName: 'André Costa',     pontuacao: 88, criterio: 'Alta Participação', status: 'aprovado', ciclo: 'Ciclo 4', dataAprovacao: '2025-04-20' },
  { id: 'a2',  familiaId: 'f2',  familiaName: 'Família Oliveira', presidenteName: 'Maria Silva',     pontuacao: 76, criterio: 'Mãe Solo',          status: 'aprovado', ciclo: 'Ciclo 4', dataAprovacao: '2025-04-20' },
  { id: 'a3',  familiaId: 'f4',  familiaName: 'Família Costa',    presidenteName: 'André Costa',     pontuacao: 81, criterio: 'Renda Baixa',       status: 'aprovado', ciclo: 'Ciclo 4', dataAprovacao: '2025-04-20' },
  { id: 'a4',  familiaId: 'f6',  familiaName: 'Família Gomes',    presidenteName: 'Lucas Ferreira',  pontuacao: 92, criterio: 'Alta Participação', status: 'aprovado', ciclo: 'Ciclo 4', dataAprovacao: '2025-04-20' },
  { id: 'a5',  familiaId: 'f9',  familiaName: 'Família Barbosa',  presidenteName: 'Maria Silva',     pontuacao: 84, criterio: 'Renda Baixa',       status: 'aprovado', ciclo: 'Ciclo 4', dataAprovacao: '2025-04-20' },
  { id: 'a6',  familiaId: 'f10', familiaName: 'Família Carvalho', presidenteName: 'Sandra Oliveira', pontuacao: 87, criterio: 'Alta Participação', status: 'pendente', ciclo: 'Ciclo 4' },
  { id: 'a7',  familiaId: 'f3',  familiaName: 'Família Pereira',  presidenteName: 'Ana Lima',        pontuacao: 72, criterio: '+3 Filhos',         status: 'pendente', ciclo: 'Ciclo 4' },
]

export const MOCK_FEEDBACKS: Feedback[] = [
  { id: 'fb1', tipo: 'denuncia',  mensagem: 'O presidente do meu setor está priorizando famílias sem seguir os critérios corretos. Algumas famílias com alta participação não estão sendo consideradas.', recebidoEm: '2025-04-20T14:32:00', lido: false, setor: 'Setor D' },
  { id: 'fb2', tipo: 'sugestao',  mensagem: 'Seria muito útil se o formulário de cadastro de família tivesse um campo para registrar necessidade especial de saúde.', recebidoEm: '2025-04-19T21:16:00', lido: false },
  { id: 'fb3', tipo: 'elogio',    mensagem: 'O presidente João Silva tem sido muito atencioso com as famílias do setor Norte. Trabalho com dedicação.', recebidoEm: '2025-04-13T15:13:00', lido: true, setor: 'Setor A' },
  { id: 'fb4', tipo: 'sugestao',  mensagem: 'Poderiam criar um aplicativo mobile para facilitar o acesso das famílias às informações dos ciclos.', recebidoEm: '2025-04-10T09:22:00', lido: true },
  { id: 'fb5', tipo: 'elogio',    mensagem: 'O evento de março foi excelente! Muitas famílias participaram e o espaço estava muito bem organizado.', recebidoEm: '2025-04-08T18:45:00', lido: true },
  { id: 'fb6', tipo: 'denuncia',  mensagem: 'Vi famílias que não comparecem nos eventos sendo aprovadas enquanto outras que sempre participam ficam de fora.', recebidoEm: '2025-04-05T11:20:00', lido: true, setor: 'Setor B' },
]

export const MOCK_HISTORICO: HistoricoEvento[] = [
  { id: 'h1', data: '2025-04-20T14:35:00', titulo: 'Ciclo 3 — 35 famílias aprovadas publicadas',      descricao: 'Taxa de aprovação: 7,5%. Principais critérios: engajamento e vulnerabilidade.', tipo: 'aprovacao', ciclo: 'Ciclo 3' },
  { id: 'h2', data: '2025-04-15T09:00:00', titulo: 'Ciclo 3 Iniciado — Formulários enviados',          descricao: '12 presidentes notificados para preenchimento. Prazo: 30/04/2025.', tipo: 'formulario', ciclo: 'Ciclo 3' },
  { id: 'h3', data: '2025-03-01T18:50:00', titulo: 'Evento comunitário — Praça Central',               descricao: '256 famílias participantes. Todos os presidentes presentes.', tipo: 'evento' },
  { id: 'h4', data: '2025-02-10T14:03:00', titulo: 'Ciclo 2 finalizado',                               descricao: '42 famílias aprovadas. Distribuição de cestas básicas realizada.', tipo: 'ciclo', ciclo: 'Ciclo 2' },
  { id: 'h5', data: '2025-01-05T10:00:00', titulo: 'Ciclo 2 Iniciado',                                  descricao: '10 presidentes onboardados. Metas de cotas definidas para o ciclo.', tipo: 'formulario', ciclo: 'Ciclo 2' },
  { id: 'h6', data: '2024-11-15T16:20:00', titulo: 'Evento de Natal — Quadra da Comunidade',            descricao: '320 famílias participantes. Distribuição de presentes para crianças.', tipo: 'evento' },
  { id: 'h7', data: '2024-10-01T09:00:00', titulo: 'Ciclo 1 finalizado',                               descricao: '27 famílias aprovadas. Primeiro ciclo do projeto realizado com sucesso.', tipo: 'ciclo', ciclo: 'Ciclo 1' },
]

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  familiasCadastradas: 487,
  variacaoFamilias: 12,
  presidentesAtivos: 12,
  variacaoPresidentes: -2,
  aprovacoesExecutadas: 48,
  variacaoAprovacoes: 6,
  feedbacksRecentes: 5,
  feedbacksNaoLidos: 2,
}

export const MOCK_PARTICIPACOES_MES = [
  { mes: 'Janeiro',  familias: 380, eventos: 3 },
  { mes: 'Fevereiro', familias: 410, eventos: 4 },
  { mes: 'Março',    familias: 456, eventos: 5 },
  { mes: 'Abril',    familias: 487, eventos: 3 },
]

export const MOCK_DISTRIBUICAO_PERFIL = [
  { name: 'Mães Solo',      value: 28, color: '#162550' },
  { name: 'Utilitas',        value: 22, color: '#1e3270' },
  { name: 'Pessoas Idosas',  value: 18, color: '#f5a623' },
  { name: 'Outros',          value: 32, color: '#e5e7eb' },
]

// ── Morador data ────────────────────────────────────────────────
export const MOCK_MORADOR_NOTIFICACOES = [
  { id: 'mn1', titulo: 'Manutenção',  mensagem: 'O elevador passará por manutenção amanhã.',                                                  lida: false, criadaEm: '2025-06-14T10:00:00', tipo: 'aviso' as const },
  { id: 'mn2', titulo: 'Assembleia', mensagem: 'Assembleia geral marcada para o dia 20.',                                                      lida: true,  criadaEm: '2025-06-12T08:30:00', tipo: 'evento' as const },
  { id: 'mn3', titulo: 'Resultado do Ciclo 3', mensagem: 'As famílias aprovadas no Ciclo 3 foram publicadas. Confira sua situação.',           lida: true,  criadaEm: '2025-06-10T14:00:00', tipo: 'ciclo' as const },
  { id: 'mn4', titulo: 'Lembrete de Reunião', mensagem: 'Reunião comunitária amanhã às 18h no Centro Comunitário.',                           lida: false, criadaEm: '2025-06-09T16:00:00', tipo: 'evento' as const },
]

export const MOCK_EVENTOS_COMUNIDADE = [
  { id: 'ev1', titulo: 'Reunião Comunitária',   data: '2025-06-15T18:00:00', local: 'Sítio do Centro Comunitário de Filhos', tipo: 'reuniao' as const },
  { id: 'ev2', titulo: 'Ação para Crianças',    data: '2025-06-18T10:00:00', local: '5ão na Praça Central LAÇO',           tipo: 'acao'    as const },
  { id: 'ev3', titulo: 'Distribuição de Cestas', data: '2025-06-22T09:00:00', local: 'Sede da Associação',                  tipo: 'acao'    as const },
  { id: 'ev4', titulo: 'Assembleia Geral',       data: '2025-06-25T19:00:00', local: 'Salão da Igreja Central',             tipo: 'reuniao' as const },
]

export const MOCK_PROCESSO_MORADOR = {
  id:    'proc1',
  nome:  'Ciclo 1 – Doações',
  inicio:'2026-06-10',
  fim:   '2026-06-18',
  etapas: [
    { id: 'e1', titulo: 'Cadastro Realizado',  descricao: 'Seu cadastro foi registrado pelo Presidente da Rua no sistema.',      data: '2026-06-10T09:00:00', status: 'concluido' as const },
    { id: 'e2', titulo: 'Em análise',           descricao: 'Dados em verificação pela equipe da ONG Favela.',                     data: '2026-06-14T15:30:00', status: 'concluido' as const },
    { id: 'e3', titulo: 'Aprovado',             descricao: 'Dados validados com sucesso pela equipe responsável.',                data: '2026-06-16T10:53:00', status: 'concluido' as const },
    { id: 'e4', titulo: 'Benefício Entregue',   descricao: 'Benefício entregue ao responsável da família na data combinada.',    data: '',                    status: 'pendente' as const },
  ],
}

export const NIVEIS_ENGAJAMENTO = [
  { nivel: 1, nome: 'Iniciante',    minPontos: 0,  descricao: 'Bem-vindo à comunidade!' },
  { nivel: 2, nome: 'Participativo', minPontos: 10, descricao: 'Você está participando ativamente.' },
  { nivel: 3, nome: 'Engajado',     minPontos: 30, descricao: 'Você está se destacando na comunidade! Continue assim.' },
  { nivel: 4, nome: 'Liderança',    minPontos: 50, descricao: 'Você é uma referência de engajamento.' },
  { nivel: 5, nome: 'Referência',   minPontos: 80, descricao: 'Parabéns! Você é uma inspiração para todos.' },
]

export const MOCK_RANKING_COMUNIDADE = [
  { id: 'r1', nome: 'Nome a Sobrenome', pontos: 97 },
  { id: 'r2', nome: 'Nome a Sobrenome', pontos: 89 },
  { id: 'r3', nome: 'Nome a Sobrenome', pontos: 82 },
  { id: 'r4', nome: 'Nome a Sobrenome', pontos: 74 },
  { id: 'r5', nome: 'Carlos Morador',   pontos: 67, isMe: true },
]

export const MORADOR_PONTOS_ATUAL = 67

export const COMO_GANHAR_PONTOS = [
  { acao: 'Participar de reunião',          pontos: 10 },
  { acao: 'Enviar feedback',               pontos: 5  },
  { acao: 'Comparecer à ação de doações',  pontos: 8  },
  { acao: 'Indicar melhorias para a comunidade', pontos: 7 },
]

export const MOCK_ACESSO_RAPIDO = [
  { label: 'Acompanhar meu processo', rota: '/acompanhamento', icon: 'activity' },
  { label: 'Ver próximos eventos',    rota: '/acompanhamento', icon: 'calendar' },
  { label: 'Enviar feedback',         rota: '/feedback',       icon: 'message' },
  { label: 'Meu ranking',             rota: '/ranking',        icon: 'award' },
]
// ────────────────────────────────────────────────────────────────

// ── Presidente data ──────────────────────────────────────────────
export const PRESIDENTE_STATS = {
  cotaMes: 24, cotaRealizada: 18, diasRestantes: 20,
  rankingPos: 3, formulariosPendentes: 2,
}

export const PRESIDENTE_FAMILIAS = [
  { id: 'pf1', nome: 'Família Souza',     endereco: 'Rua Santo Laço, 22, Casa Amarela, Alto Santa Isabel, Recife', membros: 4, status: 'visitada'  as const, categoria: 'mae-solo'   as const },
  { id: 'pf2', nome: 'Família Pereira',   endereco: 'Rua da Força, 18, Casa Amarela, Alto Santa Isabel, Recife',  membros: 6, status: 'pendente'  as const, categoria: 'tres-filhos' as const },
  { id: 'pf3', nome: 'Família Rodrigues', endereco: 'Rua da Prece, 70, Casa Amarela, Alto Santa Isabel, Recife',  membros: 3, status: 'pendente'  as const, categoria: 'geral'      as const },
  { id: 'pf4', nome: 'Família Ibirha',    endereco: 'Rua Ubirá, 54, Casa Amarela, Alto Santa Isabel, Recife',     membros: 3, status: 'visitada'  as const, categoria: 'mae-solo'   as const },
  { id: 'pf5', nome: 'Família Gomes',     endereco: 'Rua da Cooperação, 49, Casa Amarela, Alto Santa Isabel, Recife', membros: 2, status: 'visitada' as const, categoria: 'geral' as const },
]

export const PRESIDENTE_VISITAS = [
  { id: 'v1', familia: 'Família Santos',    data: new Date(Date.now() - 0         ).toISOString(), hora: '09:30', sync: true,  formulario: true  },
  { id: 'v2', familia: 'Família Oliveira',  data: new Date(Date.now() - 86400000  ).toISOString(), hora: '14:00', sync: false, formulario: false },
  { id: 'v3', familia: 'Família Rodrigues', data: new Date(Date.now() - 86400000  ).toISOString(), hora: '09:15', sync: true,  formulario: true  },
  { id: 'v4', familia: 'Família Pereira',   data: new Date(Date.now() - 86400000  ).toISOString(), hora: '11:20', sync: true,  formulario: true  },
  { id: 'v5', familia: 'Família Silva',     data: new Date(Date.now() - 86400000  ).toISOString(), hora: '12:30', sync: false, formulario: false },
  { id: 'v6', familia: 'Família Costa',     data: new Date(Date.now() - 172800000 ).toISOString(), hora: '10:00', sync: true,  formulario: true  },
  { id: 'v7', familia: 'Família Barbosa',   data: new Date(Date.now() - 172800000 ).toISOString(), hora: '15:45', sync: true,  formulario: true  },
  { id: 'v8', familia: 'Família Lima',      data: new Date(Date.now() - 259200000 ).toISOString(), hora: '08:30', sync: true,  formulario: false },
]

export const HISTORICO_COTAS = [
  { mes: 'Maio 2026',      pct: 75  },
  { mes: 'Abril 2026',     pct: 100 },
  { mes: 'Março 2026',     pct: 100 },
  { mes: 'Fevereiro 2026', pct: 83  },
  { mes: 'Janeiro 2026',   pct: 91  },
]

export const METAS_RECOMPENSAS = [
  { titulo: 'Atingir 100% da cota',        recompensa: '+8 no ranking · Destaque regional',       icon: 'trophy' },
  { titulo: 'Enviar todos os formulários', recompensa: '+5 no ranking · Prioridade no bônus',     icon: 'file' },
  { titulo: '3 meses seguidos 100%',       recompensa: 'Reconhecimento na sua comunidade global', icon: 'star' },
]

export const RANKING_PRESIDENTES = [
  { id: 'rp1', nome: 'Maria Costa',  setor: 'Rua da Praia',  familias: 32, pontos: 98, iniciais: 'MC', isMe: false },
  { id: 'rp2', nome: 'Ana Lima',     setor: 'Rua da Praia',  familias: 18, pontos: 91, iniciais: 'AL', isMe: false },
  { id: 'rp3', nome: 'André Alves',  setor: 'Rua da Praia',  familias: 25, pontos: 82, iniciais: 'AA', isMe: true  },
  { id: 'rp4', nome: 'Felipe Ramos', setor: 'Rua do Olha',   familias: 25, pontos: 76, iniciais: 'FR', isMe: false },
  { id: 'rp5', nome: 'Rafael Coelho',setor: 'Rua do Acesso', familias: 10, pontos: 61, iniciais: 'RC', isMe: false },
]

export const MINHA_PONTUACAO = {
  visitasRealizadas:  36,
  formulariosEnviados:18,
  cotaAtingida:       18,
  bonusPontualidade:  10,
  total:              82,
}
// ────────────────────────────────────────────────────────────────

export const MOCK_CICLO_STATS = [
  { ciclo: 'Ciclo 1', mes: 'Out/24', familiasCadastradas: 320, familiasBeneficiadas: 27, eventosRealizados: 8, taxaAprovacao: 8.4 },
  { ciclo: 'Ciclo 2', mes: 'Fev/25', familiasCadastradas: 420, familiasBeneficiadas: 42, eventosRealizados: 12, taxaAprovacao: 10.0 },
  { ciclo: 'Ciclo 3', mes: 'Abr/25', familiasCadastradas: 487, familiasBeneficiadas: 35, eventosRealizados: 14, taxaAprovacao: 7.2 },
]
