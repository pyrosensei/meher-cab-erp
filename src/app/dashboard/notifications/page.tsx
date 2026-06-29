'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { PageHeader } from '@/components/shared/page-header'
import { cn, getTimeAgo } from '@/lib/utils'
import { notifications } from '@/data/notifications'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Bell, Check, CheckCheck, Trash2, MapPin, Star, 
  ShieldAlert, FileText, UserPlus, Fuel, 
  TrendingUp, XCircle, Gauge, AlertCircle, Wrench
} from 'lucide-react'

const FILTERS = ['All', 'Unread', 'Alerts', 'Trips', 'Maintenance', 'System']

const iconMap: Record<string, any> = {
  'shield-alert': ShieldAlert,
  'star': Star,
  'file-text': FileText,
  'user-plus': UserPlus,
  'fuel': Fuel,
  'wrench': Wrench,
  'trending-up': TrendingUp,
  'map-pin': MapPin,
  'alert-circle': AlertCircle,
}

const colorMap: Record<string, string> = {
  'critical': 'text-rose-500 bg-rose-50 border-rose-200',
  'high': 'text-amber-500 bg-amber-50 border-amber-200',
  'medium': 'text-sky-500 bg-sky-50 border-sky-200',
  'low': 'text-slate-500 bg-slate-50 border-slate-200',
}

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [items, setItems] = useState(notifications)

  const markAllRead = () => {
    setItems(items.map(i => ({ ...i, read: true })))
  }

  const toggleRead = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, read: !i.read } : i))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const filteredItems = items.filter(item => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Unread') return !item.read
    if (activeFilter === 'Alerts') return item.priority === 'high'
    return item.type === activeFilter.toLowerCase()
  })

  const unreadCount = items.filter(i => !i.read).length

  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      <PageHeader 
        title="Notifications" 
        description="Stay updated with alerts, trips, and system messages."
      >
        <Button variant="outline" onClick={markAllRead} disabled={unreadCount === 0} className="rounded-xl border-[var(--border)]">
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </PageHeader>

      <motion.div 
         variants={fadeUp}
         initial="hidden"
         animate="visible"
         className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
         {FILTERS.map(filter => (
            <Badge 
               key={filter}
               onClick={() => setActiveFilter(filter)}
               className={cn(
                  "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:bg-[var(--foreground)] hover:text-white",
                  activeFilter === filter 
                     ? "bg-[var(--foreground)] text-white shadow-sm" 
                     : "bg-white text-[var(--text-secondary)] border-[var(--border)] hover:bg-slate-100 hover:text-[var(--foreground)]"
               )}
               variant={activeFilter === filter ? "default" : "outline"}
            >
               {filter}
               {filter === 'Unread' && unreadCount > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                     {unreadCount}
                  </span>
               )}
            </Badge>
         ))}
      </motion.div>

      <motion.div 
         variants={staggerContainer}
         initial="hidden"
         animate="visible"
         className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm"
      >
         {filteredItems.length > 0 ? (
            <AnimatePresence mode="popLayout">
               <div className="divide-y divide-[var(--border)]">
                  {filteredItems.map(item => {
                     const Icon = iconMap[item.icon] || Bell
                     const colorClass = colorMap[item.priority] || colorMap.low

                     return (
                        <motion.div
                           key={item.id}
                           variants={staggerItem}
                           layout
                           initial={{ opacity: 0, backgroundColor: '#ffffff' }}
                           animate={{ opacity: 1, backgroundColor: item.read ? '#ffffff' : '#f8fafc' }}
                           exit={{ opacity: 0, height: 0, padding: 0, overflow: 'hidden' }}
                           className="group relative flex gap-4 p-5 hover:bg-slate-50 transition-colors"
                        >
                           {/* Unread dot */}
                           {!item.read && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-sky-500 rounded-r-full" />
                           )}

                           {/* Icon */}
                           <div className={cn(
                              "mt-1 h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border", 
                              colorClass
                           )}>
                              <Icon className="h-5 w-5" />
                           </div>

                           {/* Content */}
                           <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                 <div>
                                    <h4 className={cn("text-sm font-semibold mb-0.5", !item.read && "text-[var(--foreground)]")}>
                                       {item.title}
                                    </h4>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                                       {item.message}
                                    </p>
                                 </div>
                                 <span className="shrink-0 text-xs text-[var(--text-secondary)] whitespace-nowrap pt-0.5">
                                    {getTimeAgo(item.timestamp)}
                                 </span>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                    onClick={() => toggleRead(item.id)}
                                    className="text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1.5"
                                 >
                                    <Check className="h-3.5 w-3.5" /> 
                                    {item.read ? 'Mark as unread' : 'Mark as read'}
                                 </button>
                                 <button 
                                    onClick={() => deleteItem(item.id)}
                                    className="text-xs font-medium text-rose-500 hover:text-rose-600 flex items-center gap-1.5"
                                 >
                                    <Trash2 className="h-3 w-3" /> Delete
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                     )
                  })}
               </div>
            </AnimatePresence>
         ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-16 text-center"
            >
               <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-slate-400" />
               </div>
               <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">No notifications</h3>
               <p className="text-[var(--text-secondary)]">You're all caught up! No messages match this filter.</p>
            </motion.div>
         )}
      </motion.div>
    </div>
  )
}
