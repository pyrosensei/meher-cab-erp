'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import {
  LayoutDashboard,
  Users,
  Car,
  MapPin,
  Navigation,
  Bot,
  BarChart3,
  FileText,
  Bell,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Drivers', href: '/dashboard/drivers', icon: Users },
  { label: 'Vehicles', href: '/dashboard/vehicles', icon: Car },
  { label: 'Trips', href: '/dashboard/trips', icon: MapPin },
  { label: 'Live Tracking', href: '/dashboard/tracking', icon: Navigation },
  { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: Bot },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/dashboard/reports', icon: FileText },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
]

const bottomNavItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[var(--border)] bg-white"
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-[var(--border)] px-4">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-transparent overflow-hidden">
              <img src="/logo.png" alt="Meher Cabs Logo" className="h-full w-full object-contain" />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="text-[15px] font-semibold tracking-tight">Meher Cabs</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              const linkContent = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-[var(--foreground)] text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                  )}
                >
                  <Icon className={cn(
                    'h-[18px] w-[18px] shrink-0 transition-colors duration-200',
                    active ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--foreground)]'
                  )} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {active && item.label === 'AI Assistant' && !sidebarCollapsed && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                      AI
                    </span>
                  )}
                </Link>
              )

              if (sidebarCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return linkContent
            })}
          </div>
        </nav>

        {/* Bottom Nav */}
        <div className="border-t border-[var(--border)] px-3 py-3 space-y-1">
          {bottomNavItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-[var(--foreground)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return linkContent
          })}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-white shadow-sm hover:bg-[var(--secondary)] transition-colors duration-200"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3 text-[var(--text-secondary)]" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-[var(--text-secondary)]" />
          )}
        </button>
      </motion.aside>
    </TooltipProvider>
  )
}
