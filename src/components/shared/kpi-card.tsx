'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerItem } from '@/lib/animations'
import { useAnimatedCounter } from '@/hooks/use-utils'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: number
  format?: 'currency' | 'number' | 'percentage' | 'raw'
  change?: number
  changeLabel?: string
  icon: LucideIcon
  delay?: number
  className?: string
}

export function KpiCard({
  title,
  value,
  format = 'number',
  change,
  changeLabel = 'vs last month',
  icon: Icon,
  delay = 0,
  className,
}: KpiCardProps) {
  const { display, ref } = useAnimatedCounter(value, 1.5, delay)

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return `${val}%`
      case 'raw':
        return val.toLocaleString('en-IN')
      default:
        return formatNumber(val)
    }
  }

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-6',
        'hover:shadow-lg hover:shadow-black/[0.03] transition-shadow duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[13px] font-medium text-[var(--text-secondary)] tracking-wide uppercase">
            {title}
          </p>
          <p ref={ref} className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            {formatValue(display)}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  change >= 0
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-600'
                )}
              >
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-[var(--text-secondary)]">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--secondary)] group-hover:bg-[var(--foreground)] transition-colors duration-300">
          <Icon className="h-5 w-5 text-[var(--text-secondary)] group-hover:text-white transition-colors duration-300" />
        </div>
      </div>
      {/* Subtle accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}
