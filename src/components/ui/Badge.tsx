import clsx from 'clsx'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gold'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const styles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-100  text-amber-700  border border-amber-200',
  danger:  'bg-red-100    text-red-700    border border-red-200',
  info:    'bg-blue-100   text-blue-700   border border-blue-200',
  neutral: 'bg-gray-100   text-gray-600   border border-gray-200',
  gold:    'bg-yellow-100 text-yellow-700 border border-yellow-200',
}

const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  neutral: 'bg-gray-400',
  gold:    'bg-yellow-500',
}

export default function Badge({ variant = 'neutral', children, className, dot }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
      styles[variant],
      className,
    )}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotStyles[variant])} />}
      {children}
    </span>
  )
}
