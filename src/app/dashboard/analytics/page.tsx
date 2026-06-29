'use client'

import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { PageHeader } from '@/components/shared/page-header'
import { cn, formatCurrency } from '@/lib/utils'
import { 
  revenueData, weeklyTripData, vehicleTypeDistribution, 
  fuelTypeDistribution, driverPerformance, hourlyTripData, dailyRevenueData 
} from '@/data/analytics'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  TrendingUp, BarChart3, PieChart as PieChartIcon, 
  Activity, Download, Calendar 
} from 'lucide-react'
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 shadow-lg">
        <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
           <div key={index} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <p className="text-sm font-semibold">
                 {entry.name}: {entry.name.toLowerCase().includes('revenue') ? formatCurrency(entry.value) : entry.value}
              </p>
           </div>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Fleet Analytics" 
        description="Comprehensive insights into revenue, trips, and performance."
      >
        <div className="flex items-center gap-3">
           <Select defaultValue="month">
             <SelectTrigger className="w-[160px] h-9 rounded-xl bg-white border-[var(--border)] text-sm">
               <Calendar className="mr-2 h-4 w-4 text-[var(--text-secondary)]" />
               <SelectValue placeholder="Select Period" />
             </SelectTrigger>
             <SelectContent className="rounded-xl">
               <SelectItem value="week">This Week</SelectItem>
               <SelectItem value="month">This Month</SelectItem>
               <SelectItem value="quarter">This Quarter</SelectItem>
               <SelectItem value="year">This Year</SelectItem>
             </SelectContent>
           </Select>
           <Button variant="outline" size="sm" className="rounded-xl border-[var(--border)] h-9">
             <Download className="mr-2 h-4 w-4" /> Export
           </Button>
        </div>
      </PageHeader>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2"
      >
        {/* Revenue vs Expenses */}
        <motion.div variants={staggerItem} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2"><IndianRupeeIcon className="h-4 w-4 text-[var(--text-secondary)]" /> Revenue Trend</h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Monthly revenue vs expenses</p>
            </div>
            <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-600 border-emerald-200">
               +14% YoY
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(val) => `₹${val/100000}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#000000" strokeDasharray="4 4" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Trips */}
        <motion.div variants={staggerItem} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[var(--text-secondary)]" /> Weekly Trip Volume</h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Completed trips by day</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyTripData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
              <Bar dataKey="trips" name="Trips" fill="#000000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Drivers */}
        <motion.div variants={staggerItem} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[var(--text-secondary)]" /> Top Performers</h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Based on trips completed</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={driverPerformance.slice(0, 5)} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#000', fontWeight: 500 }} width={70} />
              <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
              <Bar dataKey="trips" name="Trips" fill="#000000" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Vehicle Distribution */}
        <motion.div variants={staggerItem} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2"><PieChartIcon className="h-4 w-4 text-[var(--text-secondary)]" /> Fleet Composition</h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">By fuel type</p>
            </div>
          </div>
          <div className="flex h-[260px] items-center">
             <div className="flex-1 h-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={fuelTypeDistribution}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={90}
                     paddingAngle={2}
                     dataKey="count"
                     stroke="none"
                   >
                     {fuelTypeDistribution.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip content={<CustomTooltip />} />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="w-32 flex flex-col justify-center gap-4">
                {fuelTypeDistribution.map((item, i) => (
                   <div key={i} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <div>
                         <p className="text-xs font-medium">{item.type}</p>
                         <p className="text-[10px] text-[var(--text-secondary)]">{item.count} vehicles</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </motion.div>
        
        {/* Full width Area chart */}
        <motion.div variants={staggerItem} className="md:col-span-2 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-[var(--text-secondary)]" /> Daily Revenue (30 Days)</h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Detailed daily revenue breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyRevenueData}>
              <defs>
                <linearGradient id="colorDailyRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} minTickGap={30} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(val) => `₹${val/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorDailyRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </div>
  )
}

function IndianRupeeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </svg>
  )
}
