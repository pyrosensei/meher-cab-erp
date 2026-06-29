'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { KpiCard } from '@/components/shared/kpi-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { cn, formatCurrency, getTimeAgo } from '@/lib/utils'
import { recentActivity } from '@/data/notifications'
import { dailyRevenueData, fleetHealthData, weeklyTripData } from '@/data/analytics'
import {
  IndianRupee, MapPin, Users, Car, Brain, Activity, TrendingUp,
  ArrowUpRight, Zap, Clock, ChevronRight, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const aiInsights = [
  "Revenue is up 12% this week — Gurugram routes performing exceptionally well.",
  "3 vehicles need maintenance within 7 days. Schedule recommended.",
  "Peak demand expected tomorrow 5–8 PM. Deploy 5 additional vehicles.",
  "Driver Amit Kumar has completed 187 trips this month — top performer.",
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 shadow-lg">
        <p className="text-xs text-[var(--text-secondary)]">{label}</p>
        <p className="text-sm font-semibold">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [insightIndex, setInsightIndex] = useState(0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good afternoon, Rajesh</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Here's how your fleet is performing today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="rounded-full px-3 py-1.5 text-xs font-medium border-emerald-200 bg-emerald-50 text-emerald-600">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block pulse-dot" />
            System Online
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-[var(--border)] text-sm"
          >
            <Clock className="mr-2 h-3.5 w-3.5" />
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <KpiCard
          title="Today's Revenue"
          value={87400}
          format="currency"
          change={12.5}
          icon={IndianRupee}
          delay={0}
        />
        <KpiCard
          title="Total Trips"
          value={156}
          format="raw"
          change={8.2}
          icon={MapPin}
          delay={0.1}
        />
        <KpiCard
          title="Drivers Online"
          value={18}
          format="raw"
          change={-2.1}
          changeLabel="vs yesterday"
          icon={Users}
          delay={0.2}
        />
        <KpiCard
          title="Vehicles Active"
          value={21}
          format="raw"
          change={5.0}
          icon={Car}
          delay={0.3}
        />
      </motion.div>

      {/* AI Insights + Fleet Health */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* AI Insights - Reverted to clean but with beautiful white glassmorphism */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl border border-white/50 bg-white/40 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden"
        >
          {/* Subtle ambient gradient behind the glass */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-100/30 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between mb-5 border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100">
                <Sparkles className="h-5 w-5 text-sky-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">AI Fleet Intelligence</h3>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Real-time Analysis</p>
              </div>
            </div>
            <Link href="/dashboard/ai-assistant">
              <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold shadow-sm transition-all">
                Open Assistant <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          
          <div className="relative z-10 grid sm:grid-cols-2 gap-3">
            {aiInsights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="flex items-start gap-3 rounded-xl bg-white/80 border border-slate-100/50 p-4 shadow-sm backdrop-blur-md"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 border border-sky-100">
                  <Zap className="h-3.5 w-3.5 text-sky-500" />
                </div>
                <p className="text-sm leading-relaxed text-slate-700 font-medium">{insight}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fleet Health */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-[var(--border)] bg-white p-6"
        >
          <h3 className="text-sm font-semibold mb-1">Fleet Health</h3>
          <p className="text-[11px] text-[var(--text-secondary)] mb-6">Vehicle condition overview</p>
          <div className="flex justify-center mb-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={fleetHealthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                  strokeWidth={0}
                >
                  {fleetHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {fleetHealthData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[var(--text-secondary)]">{item.status}</span>
                </div>
                <span className="text-sm font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue Trend */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-[var(--border)] bg-white p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold">Revenue Trend</h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Last 30 days performance</p>
            </div>
            <Badge variant="outline" className="rounded-full text-[11px] font-medium text-emerald-600 border-emerald-200 bg-emerald-50">
              <TrendingUp className="mr-1 h-3 w-3" /> +12.5%
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyRevenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#000000"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Trip Volume */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-[var(--border)] bg-white p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold">Weekly Trip Volume</h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Trips per day this week</p>
            </div>
            <Badge variant="outline" className="rounded-full text-[11px] font-medium">
              1,118 total
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyTripData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="trips" fill="#000000" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Activity Feed + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Activity Feed - Upgraded to a sleek timeline */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Live Operations Feed</h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">Real-time fleet events</p>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4 relative"
          >
            {/* Timeline track */}
            <div className="absolute left-6 top-2 bottom-2 w-px bg-[var(--border)] hidden sm:block" />
            
            {recentActivity.map((item) => (
              <motion.div
                key={item.id}
                variants={staggerItem}
                className="group relative flex items-start gap-4 rounded-xl transition-all duration-300"
              >
                <div className={cn(
                  'relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-white shadow-sm transition-transform duration-300 group-hover:scale-110',
                  item.type === 'trip' ? 'text-sky-500 border-sky-100' :
                  item.type === 'driver' ? 'text-emerald-500 border-emerald-100' :
                  'text-amber-500 border-amber-100'
                )}>
                  {item.type === 'trip' ? <MapPin className="h-5 w-5" /> :
                   item.type === 'driver' ? <Users className="h-5 w-5" /> :
                   <Car className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0 bg-[var(--secondary)]/50 group-hover:bg-[var(--secondary)] border border-transparent group-hover:border-[var(--border)] rounded-2xl p-3.5 transition-all duration-300">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--foreground)]">{item.action}</span>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)] border border-[var(--border)]">{item.subject}</span>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-[var(--text-secondary)] bg-white px-2 py-0.5 rounded-full border border-[var(--border)] shadow-sm">
                      {getTimeAgo(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-1.5 leading-relaxed">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Quick Actions - Upgraded to Bento Grid layout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm flex flex-col"
        >
          <div className="mb-6 pb-4 border-b border-[var(--border)]">
            <h3 className="text-sm font-semibold tracking-tight">Quick Actions</h3>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Frequently used tools</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[
              { label: 'New Trip', href: '/dashboard/trips', icon: MapPin, colSpan: 'col-span-2' },
              { label: 'Live Map', href: '/dashboard/tracking', icon: Activity, colSpan: 'col-span-1' },
              { label: 'Drivers', href: '/dashboard/reports', icon: Users, colSpan: 'col-span-1' },
              { label: 'AI Chat', href: '/dashboard/ai-assistant', icon: Brain, colSpan: 'col-span-1' },
              { label: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp, colSpan: 'col-span-1' },
            ].map((action, i) => (
              <Link key={i} href={action.href} className={action.colSpan}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex h-full flex-col items-start justify-between rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/30 hover:bg-[var(--foreground)] p-4 transition-all duration-300"
                >
                  <div className="flex w-full items-center justify-between mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white group-hover:bg-white/10 shadow-sm transition-colors">
                      <action.icon className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-white transition-colors" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-white/50 transition-colors opacity-0 group-hover:opacity-100 translate-x-[-10px] translate-y-[10px] group-hover:translate-x-0 group-hover:translate-y-0" />
                  </div>
                  <span className="text-[13px] font-semibold text-[var(--foreground)] group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
