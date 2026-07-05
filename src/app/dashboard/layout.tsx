'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/layout/sidebar'
import { TopNav } from '@/components/layout/top-nav'
import { useAppStore } from '@/lib/store'
import Link from 'next/link'
import { Bot, Sparkles } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarCollapsed } = useAppStore()
  const pathname = usePathname()
  const isAIPage = pathname === '/dashboard/ai-assistant'

  return (
    <div className="min-h-screen bg-[var(--page-bg)] relative">
      <Sidebar />

      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col min-h-screen"
      >
        <TopNav />

        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Global AI Chat FAB — hidden on the AI page itself */}
      <AnimatePresence>
        {!isAIPage && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Link href="/dashboard/ai-assistant">
              <motion.div
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--foreground)] text-white shadow-2xl cursor-pointer"
              >
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-2xl bg-[var(--foreground)] opacity-30 blur-md scale-110" />
                <Bot className="relative h-6 w-6" />

                {/* Pulse indicator */}
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
                </span>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
