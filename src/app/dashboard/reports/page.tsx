'use client'

import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, Download, Calendar, TrendingUp, 
  Users, Car, DollarSign, Wrench, FileSpreadsheet, Eye
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const reportTypes = [
  { 
     id: 'rev', title: 'Revenue & Financials', 
     description: 'Detailed breakdown of income, driver payouts, and operational costs.',
     icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10',
     lastGenerated: new Date(Date.now() - 86400000)
  },
  { 
     id: 'trip', title: 'Trip Analytics', 
     description: 'Analysis of completed trips, cancelled bookings, and route efficiency.',
     icon: TrendingUp, color: 'text-sky-500', bg: 'bg-sky-500/10',
     lastGenerated: new Date(Date.now() - 172800000)
  },
  { 
     id: 'drv', title: 'Driver Performance', 
     description: 'Individual driver metrics, ratings, acceptance rates, and earnings.',
     icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10',
     lastGenerated: new Date(Date.now() - 43200000)
  },
  { 
     id: 'veh', title: 'Vehicle Utilization', 
     description: 'Active hours, distance covered, and fuel efficiency metrics per vehicle.',
     icon: Car, color: 'text-amber-500', bg: 'bg-amber-500/10',
     lastGenerated: new Date(Date.now() - 259200000)
  },
  { 
     id: 'maint', title: 'Maintenance Logs', 
     description: 'Service history, upcoming maintenance schedules, and repair costs.',
     icon: Wrench, color: 'text-rose-500', bg: 'bg-rose-500/10',
     lastGenerated: new Date(Date.now() - 604800000)
  },
  { 
     id: 'comp', title: 'Compliance Status', 
     description: 'Insurance expiries, fitness certificates, and driver document status.',
     icon: FileText, color: 'text-slate-600', bg: 'bg-slate-500/10',
     lastGenerated: new Date(Date.now() - 1209600000)
  },
]

const recentReports = [
  { name: 'Monthly_Revenue_May2025.pdf', type: 'Financial', size: '2.4 MB', date: new Date(Date.now() - 43200000) },
  { name: 'Driver_Payouts_W24.csv', type: 'Driver', size: '856 KB', date: new Date(Date.now() - 86400000) },
  { name: 'Maintenance_Forecast_Q3.pdf', type: 'Vehicle', size: '1.2 MB', date: new Date(Date.now() - 172800000) },
  { name: 'Route_Optimization_Analysis.xlsx', type: 'Trip', size: '4.1 MB', date: new Date(Date.now() - 259200000) },
]

export default function ReportsPage() {
  return (
    <div className="space-y-8 pb-10">
      <PageHeader 
        title="Reports center" 
        description="Generate, view, and export operational reports."
      >
        <div className="flex items-center gap-3">
           <Select defaultValue="june">
             <SelectTrigger className="w-[140px] h-9 rounded-xl bg-white border-[var(--border)] text-sm">
               <Calendar className="mr-2 h-4 w-4 text-[var(--text-secondary)]" />
               <SelectValue placeholder="Month" />
             </SelectTrigger>
             <SelectContent className="rounded-xl">
               <SelectItem value="june">June 2026</SelectItem>
               <SelectItem value="may">May 2026</SelectItem>
               <SelectItem value="april">April 2026</SelectItem>
             </SelectContent>
           </Select>
        </div>
      </PageHeader>

      <motion.div 
         variants={staggerContainer}
         initial="hidden"
         animate="visible"
         className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
         {reportTypes.map((report) => (
            <motion.div
               key={report.id}
               variants={staggerItem}
               className="group rounded-2xl border border-[var(--border)] bg-white p-5 hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300 flex flex-col h-full"
            >
               <div className="flex items-start gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${report.bg}`}>
                     <report.icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <div>
                     <h3 className="font-semibold text-base">{report.title}</h3>
                     <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed line-clamp-2">
                        {report.description}
                     </p>
                  </div>
               </div>
               
               <div className="mt-auto pt-5 border-t border-[var(--border)] flex items-center justify-between">
                  <p className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                     Last: {formatDate(report.lastGenerated)}
                  </p>
                  <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs font-medium bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-[var(--foreground)]">
                     Generate
                  </Button>
               </div>
            </motion.div>
         ))}
      </motion.div>

      <motion.div
         variants={fadeUp}
         initial="hidden"
         animate="visible"
         className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden"
      >
         <div className="px-6 py-5 border-b border-[var(--border)] bg-slate-50/50">
            <h3 className="font-semibold">Recent Downloads</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Previously generated reports available for quick access</p>
         </div>
         <div className="divide-y divide-[var(--border)]">
            {recentReports.map((file, i) => (
               <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                        {file.name.endsWith('.pdf') ? <FileText className="h-5 w-5 text-rose-500" /> : 
                         file.name.endsWith('.csv') ? <FileSpreadsheet className="h-5 w-5 text-emerald-500" /> : 
                         <FileSpreadsheet className="h-5 w-5 text-sky-500" />}
                     </div>
                     <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                           <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-medium uppercase rounded bg-white">
                              {file.type}
                           </Badge>
                           <span className="text-xs text-[var(--text-secondary)]">•</span>
                           <span className="text-xs text-[var(--text-secondary)]">{file.size}</span>
                           <span className="text-xs text-[var(--text-secondary)]">•</span>
                           <span className="text-xs text-[var(--text-secondary)]">{formatDate(file.date)}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-slate-200 text-slate-500">
                        <Eye className="h-4 w-4" />
                     </Button>
                     <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg hover:bg-slate-100 bg-white">
                        <Download className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            ))}
         </div>
      </motion.div>
    </div>
  )
}
