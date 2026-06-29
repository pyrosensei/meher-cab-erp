'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bell, Search, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/drivers': 'Driver Management',
  '/dashboard/vehicles': 'Vehicle Management',
  '/dashboard/trips': 'Trip Management',
  '/dashboard/tracking': 'Live Tracking',
  '/dashboard/ai-assistant': 'AI Assistant',
  '/dashboard/analytics': 'Fleet Analytics',
  '/dashboard/reports': 'Reports',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/settings': 'Settings',
  '/dashboard/profile': 'Profile',
}

export function TopNav() {
  const pathname = usePathname()
  const { notificationCount, currentUser, setSearchOpen } = useAppStore()

  const currentLabel = routeLabels[pathname] || 'Dashboard'

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-white/80 backdrop-blur-xl px-6"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <span className="font-medium text-[var(--foreground)]">{currentLabel}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(true)}
          className="h-9 w-9 rounded-xl hover:bg-[var(--secondary)]"
        >
          <Search className="h-[18px] w-[18px] text-[var(--text-secondary)]" />
        </Button>

        {/* Notifications */}
        <Link href="/dashboard/notifications">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-xl hover:bg-[var(--secondary)]"
          >
            <Bell className="h-[18px] w-[18px] text-[var(--text-secondary)]" />
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white"
              >
                {notificationCount}
              </motion.span>
            )}
          </Button>
        </Link>

        {/* Separator */}
        <div className="mx-1 h-6 w-px bg-[var(--border)]" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-[var(--secondary)] transition-colors duration-200">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[var(--foreground)] text-white text-xs font-medium">
                  {currentUser.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{currentUser.role}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="text-red-500">Sign out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
