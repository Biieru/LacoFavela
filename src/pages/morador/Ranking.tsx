import { Star, Trophy, TrendingUp, Zap, Users, Target } from 'lucide-react'
import { NIVEIS_ENGAJAMENTO, MOCK_RANKING_COMUNIDADE, MORADOR_PONTOS_ATUAL, COMO_GANHAR_PONTOS } from '../../data/mockData'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import clsx from 'clsx'

export default function Ranking() {
  const nivelAtual   = [...NIVEIS_ENGAJAMENTO].reverse().find(n => MORADOR_PONTOS_ATUAL >= n.minPontos) ?? NIVEIS_ENGAJAMENTO[0]
  const proximoNivel = NIVEIS_ENGAJAMENTO.find(n => n.nivel === nivelAtual.nivel + 1)

  const pctAtual = proximoNivel
    ? Math.round(((MORADOR_PONTOS_ATUAL - nivelAtual.minPontos) / (proximoNivel.minPontos - nivelAtual.minPontos)) * 100)
    : 100

  const minhaPos = MOCK_RANKING_COMUNIDADE.find(r => r.isMe)?.id
  const minhaPosNum = MOCK_RANKING_COMUNIDADE.findIndex(r => r.isMe) + 1

  return (
    <div className="space-y-6 max-w-[1000px]">
      {/* Card principal de nível */}
      <Card padding="md">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center shrink-0">
            <Star size={28} className="text-gold-dark" fill="#d4880a" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="gold">Nível {nivelAtual.nivel}</Badge>
              <h2 className="text-xl font-black text-gray-900">{nivelAtual.nome}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">{nivelAtual.descricao}</p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span>{MORADOR_PONTOS_ATUAL} pts</span>
                {proximoNivel && <span>{proximoNivel.minPontos} pts (Nível {proximoNivel.nivel})</span>}
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-navy to-gold rounded-full transition-all duration-700"
                  style={{ width: `${pctAtual}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5">
                <span className="text-gray-400">{MORADOR_PONTOS_ATUAL}/{proximoNivel?.minPontos ?? MORADOR_PONTOS_ATUAL} pts</span>
                {proximoNivel && (
                  <span className="text-navy font-medium flex items-center gap-1">
                    <TrendingUp size={11} />
                    +{proximoNivel.minPontos - MORADOR_PONTOS_ATUAL} pts para o próximo nível
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Posição */}
          <div className="text-center px-5 py-3 rounded-2xl bg-navy/5 border border-navy/10">
            <p className="text-4xl font-black text-navy">{minhaPosNum}°</p>
            <p className="text-xs text-gray-500 mt-0.5">de {MOCK_RANKING_COMUNIDADE.length} moradores</p>
            <div className="flex items-center gap-1 text-xs text-gold-dark font-medium mt-1 justify-center">
              <Users size={11} />
              <span>na comunidade</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Níveis de engajamento */}
        <div className="lg:col-span-2">
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-4">Níveis de Engajamento</h3>
            <div className="space-y-2.5">
              {NIVEIS_ENGAJAMENTO.map(nivel => {
                const isAtual    = nivel.nivel === nivelAtual.nivel
                const isConcluido = nivel.nivel < nivelAtual.nivel
                const isPendente  = nivel.nivel > nivelAtual.nivel

                return (
                  <div key={nivel.nivel}
                    className={clsx(
                      'flex items-center gap-4 p-4 rounded-xl border transition-all',
                      isAtual    ? 'bg-gold/10 border-gold/40 shadow-sm' :
                      isConcluido? 'bg-gray-50 border-gray-100' :
                      'border-dashed border-gray-200 opacity-60',
                    )}>
                    <div className={clsx(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm',
                      isAtual    ? 'bg-gold text-navy' :
                      isConcluido? 'bg-navy text-white' :
                      'bg-gray-200 text-gray-400',
                    )}>
                      {isConcluido ? '✓' : nivel.nivel}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={clsx('text-sm font-semibold',
                          isAtual ? 'text-amber-800' : isConcluido ? 'text-gray-700' : 'text-gray-400'
                        )}>
                          Nível {nivel.nivel} – {nivel.nome}
                        </p>
                        {isAtual && <Badge variant="gold" dot>Você está aqui</Badge>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">A partir de {nivel.minPontos} pontos</p>
                    </div>
                    {isAtual && <Zap size={18} className="text-gold-dark shrink-0" />}
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">Cada nível representa impacto positivo na sua comunidade.</p>
          </Card>
        </div>

        {/* Sidebar direita */}
        <div className="space-y-4">
          {/* Ranking da comunidade */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-gold-dark" />
              Ranking da comunidade
            </h3>
            <div className="space-y-2">
              {MOCK_RANKING_COMUNIDADE.map((morador, idx) => (
                <div key={morador.id}
                  className={clsx(
                    'flex items-center gap-3 p-2.5 rounded-xl transition-all',
                    morador.isMe ? 'bg-navy/10 border border-navy/20' : 'hover:bg-gray-50',
                  )}>
                  <span className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    idx === 0 ? 'bg-gold text-navy' :
                    idx === 1 ? 'bg-gray-300 text-gray-700' :
                    idx === 2 ? 'bg-amber-100 text-amber-700' :
                    morador.isMe ? 'bg-navy text-white' : 'bg-gray-100 text-gray-500',
                  )}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-xs font-medium truncate', morador.isMe ? 'text-navy font-semibold' : 'text-gray-700')}>
                      {morador.nome}{morador.isMe ? ' (você)' : ''}
                    </p>
                  </div>
                  <span className={clsx('text-xs font-bold shrink-0', morador.isMe ? 'text-navy' : 'text-gray-500')}>
                    {morador.pontos} pts
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Como ganhar pontos */}
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target size={16} className="text-navy" />
              Como ganhar pontos
            </h3>
            <div className="space-y-2">
              {COMO_GANHAR_PONTOS.map(item => (
                <div key={item.acao} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-navy shrink-0" />
                    <p className="text-xs text-gray-600">{item.acao}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 shrink-0">+{item.pontos} pts</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
