import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
}

export default function Card({ hover, padding = 'md', className, children, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={clsx(
        'bg-white rounded-2xl shadow-card border border-gray-100',
        paddingMap[padding],
        hover && 'transition-all duration-200 hover:shadow-hover hover:-translate-y-0.5 cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}
