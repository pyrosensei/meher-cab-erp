'use client'

import { useState, useEffect } from 'react'
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
  Zap,
  TrendingUp,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Fleet',
    items: [
      { label: 'Drivers', href: '/dashboard/drivers', icon: Users, badge: null },
      { label: 'Vehicles', href: '/dashboard/vehicles', icon: Car, badge: null },
      { label: 'Trips', href: '/dashboard/trips', icon: MapPin, badge: null },
      { label: 'Live Tracking', href: '/dashboard/tracking', icon: Navigation, badge: 'LIVE' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: Bot, badge: 'AI' },
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, badge: null },
      { label: 'Reports', href: '/dashboard/reports', icon: FileText, badge: null },
    ],
  },
]

const bottomNavItems = [
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
]

function NavLink({
  item,
  active,
  collapsed,
  notificationCount,
}: {
  item: { label: string; href: string; icon: React.ElementType; badge?: string | null }
  active: boolean
  collapsed: boolean
  notificationCount?: number
}) {
  const Icon = item.icon

  const content = (
    <Link
      href={item.href}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-[var(--foreground)] text-white shadow-sm'
          : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)]'
      )}
    >
      {/* Active indicator bar */}
      {active && (
        <motion.div
          layoutId="active-nav-indicator"
          className="absolute inset-0 rounded-xl bg-[var(--foreground)]"
          style={{ zIndex: -1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}

      <Icon
        className={cn(
          'h-[18px] w-[18px] shrink-0 transition-colors duration-200',
          active ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--foreground)]'
        )}
      />

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap flex-1"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge */}
      {!collapsed && item.badge && (
        <AnimatePresence>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              'ml-auto flex h-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
              item.badge === 'LIVE'
                ? 'bg-emerald-100 text-emerald-700'
                : active
                ? 'bg-white/20 text-white'
                : 'bg-[var(--foreground)] text-white'
            )}
          >
            {item.badge}
          </motion.span>
        </AnimatePresence>
      )}

      {/* Notification dot for collapsed */}
      {collapsed && notificationCount && notificationCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8} className="font-medium">
          {item.label}
          {item.badge && (
            <span className="ml-1.5 rounded px-1 py-0.5 text-[10px] bg-[var(--foreground)] text-white">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar, notificationCount } = useAppStore()
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [])

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
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden">
              <img src="/logo.png" alt="Meher Cabs" className="h-full w-full object-contain" />
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
                  <p className="text-[15px] font-semibold tracking-tight leading-none">Meher Cabs</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Fleet Management</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]"
                  >
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>
              {sidebarCollapsed && (
                <div className="mb-1.5 h-px bg-[var(--border)]" />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={isActive(item.href)}
                    collapsed={sidebarCollapsed}
                    notificationCount={item.href === '/dashboard/notifications' ? notificationCount : 0}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Live clock — only when expanded */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-3 mb-3 rounded-xl bg-[var(--secondary)] px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Current time</p>
                  <p className="text-lg font-semibold tracking-tight">{time}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" />
                  <span className="text-xs text-emerald-600 font-medium">Live</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Nav */}
        <div className="border-t border-[var(--border)] px-3 py-3 space-y-0.5">
          {bottomNavItems.map((item) => {
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
                    : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)]'
                )}
              >
                <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-white' : '')} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Notification badge */}
                {item.href === '/dashboard/notifications' && notificationCount > 0 && (
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white"
                      >
                        {notificationCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}
                {sidebarCollapsed && item.href === '/dashboard/notifications' && notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
                )}
              </Link>
            )

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>{item.label}</TooltipContent>
                </Tooltip>
              )
            }
            return linkContent
          })}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-white shadow-sm hover:bg-[var(--secondary)] transition-colors duration-200 z-10"
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
