import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)}, ${formatTime(date)}`
}

export function getTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(d)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    online: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    available: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'in-progress': 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    'on-trip': 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    scheduled: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    maintenance: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    offline: 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20',
    inactive: 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20',
    cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
    'out-of-service': 'bg-red-500/10 text-red-600 border-red-500/20',
  }
  return colors[status.toLowerCase()] || 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
