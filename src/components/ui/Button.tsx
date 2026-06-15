import clsx from 'clsx'
import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  children?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-navy text-white hover:bg-navy-light active:scale-[.98] shadow-sm hover:shadow',
  secondary: 'bg-gold  text-navy font-semibold hover:bg-gold-light active:scale-[.98] shadow-sm hover:shadow-glow',
  ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:scale-[.98] shadow-sm',
  outline:   'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 active:scale-[.98]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8  px-3   text-xs  gap-1.5',
  md: 'h-10 px-4   text-sm  gap-2',
  lg: 'h-12 px-5   text-sm  gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/50',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  )
}
