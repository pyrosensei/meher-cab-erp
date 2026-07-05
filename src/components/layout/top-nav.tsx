'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, ChevronRight, Sun, Moon, Command } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const routeLabels: Record<string, { label: string; description: string }> = {
  '/dashboard': { label: 'Dashboard', description: 'Fleet overview & live metrics' },
  '/dashboard/drivers': { label: 'Drivers', description: 'Manage your driver roster' },
  '/dashboard/vehicles': { label: 'Vehicles', description: 'Fleet inventory & health' },
  '/dashboard/trips': { label: 'Trips', description: 'Trip history & management' },
  '/dashboard/tracking': { label: 'Live Tracking', description: 'Real-time GPS positions' },
  '/dashboard/ai-assistant': { label: 'AI Assistant', description: 'Intelligent fleet insights' },
  '/dashboard/analytics': { label: 'Analytics', description: 'Performance & revenue trends' },
  '/dashboard/reports': { label: 'Reports', description: 'Generate fleet reports' },
  '/dashboard/notifications': { label: 'Notifications', description: 'Alerts & updates' },
  '/dashboard/settings': { label: 'Settings', description: 'Configure your preferences' },
  '/dashboard/profile': { label: 'Profile', description: 'Your account details' },
}

export function TopNav() {
  const pathname = usePathname()
  const { notificationCount, currentUser, setSearchOpen } = useAppStore()
  const [date, setDate] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setDate(now.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }))
    }
    update()
  }, [])

  const currentRoute = routeLabels[pathname] || routeLabels['/dashboard']

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-white/90 backdrop-blur-xl px-6 gap-4"
    >
      {/* Left: Breadcrumb + page title */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] shrink-0">
          <Link
            href="/dashboard"
            className="hover:text-[var(--foreground)] transition-colors font-medium"
          >
            Home
          </Link>
          {pathname !== '/dashboard' && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-semibold text-[var(--foreground)]">{currentRoute.label}</span>
            </>
          )}
        </div>

        {/* Page description pill — hidden on small screens */}
        <AnimatePresence mode="wait">
          <motion.span
            key={pathname}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:flex items-center text-[11px] text-[var(--text-secondary)] bg-[var(--secondary)] rounded-full px-2.5 py-1 ml-1"
          >
            {currentRoute.description}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Date pill */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-secondary)] bg-[var(--secondary)] rounded-xl px-3 py-2 mr-1">
          <span>{date}</span>
        </div>

        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(true)}
          className="h-9 w-9 rounded-xl hover:bg-[var(--secondary)] relative"
          title="Search (⌘K)"
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
            <AnimatePresence>
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </Link>

        {/* Separator */}
        <div className="mx-1 h-6 w-px bg-[var(--border)]" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-[var(--secondary)] transition-colors duration-200 outline-none">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[var(--foreground)] text-white text-xs font-semibold">
                  {currentUser.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold leading-none">{currentUser.name}</p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{currentUser.role}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
            <DropdownMenuLabel className="px-3 py-2">
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{currentUser.role}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="rounded-lg cursor-pointer">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="rounded-lg cursor-pointer">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="rounded-lg cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50">
                Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
