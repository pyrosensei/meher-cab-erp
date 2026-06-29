'use client'

import { cn, getStatusColor } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const displayStatus = status
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full px-2.5 py-0.5 text-[11px] font-medium border capitalize',
        getStatusColor(status),
        className
      )}
    >
      {status === 'online' || status === 'active' || status === 'in-progress' || status === 'on-trip' ? (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current inline-block pulse-dot" />
      ) : null}
      {displayStatus}
    </Badge>
  )
}
