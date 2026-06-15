import { type ReactNode } from 'react'
import clsx from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Card from './Card'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: ReactNode
  iconBg?: string
  trend?: number
  trendLabel?: string
  className?: string
}

export default function StatCard({ label, value, sub, icon, iconBg = 'bg-navy/10', trend, trendLabel, className }: StatCardProps) {
  const isPositive = (trend ?? 0) > 0
  const isNeutral  = (trend ?? 0) === 0

  return (
    <Card className={clsx('flex items-start gap-4', className)}>
      {icon && (
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-0.5 leading-none">{value}</p>
        {(sub || trend !== undefined) && (
          <div className="flex items-center gap-2 mt-1.5">
            {trend !== undefined && (
              <span className={clsx(
                'inline-flex items-center gap-0.5 text-xs font-medium',
                isNeutral  ? 'text-gray-400' :
                isPositive ? 'text-emerald-600' : 'text-red-500',
              )}>
                {isNeutral  ? <Minus size={12} /> :
                 isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {trend > 0 ? `+${trend}` : trend}
              </span>
            )}
            {sub && <p className="text-xs text-gray-400">{sub}</p>}
            {trendLabel && <p className="text-xs text-gray-400">{trendLabel}</p>}
          </div>
        )}
      </div>
    </Card>
  )
}
