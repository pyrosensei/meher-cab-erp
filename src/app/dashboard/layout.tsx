'use client'

import { motion } from 'framer-motion'
import { Sidebar } from '@/components/layout/sidebar'
import { TopNav } from '@/components/layout/top-nav'
import { useAppStore } from '@/lib/store'

import Link from 'next/link'
import { Bot } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarCollapsed } = useAppStore()

  return (
    <div className="min-h-screen bg-[var(--secondary)] relative">
      <Sidebar />
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col min-h-screen relative"
      >
        <TopNav />
        <main className="flex-1 p-6 relative">
          <motion.div
            key={typeof window !== 'undefined' ? window.location.pathname : ''}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
      
      {/* Global AI Chat FAB */}
      <Link href="/dashboard/ai-assistant">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 h-14 w-14 bg-[var(--foreground)] text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer z-50 ring-4 ring-white"
        >
          <Bot className="h-6 w-6" />
        </motion.div>
      </Link>
    </div>
  )
}
