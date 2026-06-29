'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  User, Mail, Phone, MapPin, Calendar, Award, 
  TrendingUp, Clock, Edit, Shield, Briefcase, Activity, Target
} from 'lucide-react'

const activityLog = [
  { action: 'Approved leave request for Amit Kumar', time: '2 hours ago', icon: Award },
  { action: 'Generated Monthly Revenue Report', time: '5 hours ago', icon: FileTextIcon },
  { action: 'Assigned Vehicle DL 3C 4521 to Rahul Singh', time: 'Yesterday', icon: Briefcase },
  { action: 'Updated pricing configuration for peak hours', time: 'Yesterday', icon: SettingsIcon },
  { action: 'Resolved customer complaint #TC-4092', time: '2 days ago', icon: Shield },
  { action: 'Completed fleet maintenance review', time: '3 days ago', icon: Activity },
]

export default function ProfilePage() {
  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      <PageHeader 
        title="Admin Profile" 
        description="View and manage your personal information and activity."
      />

      {/* Profile Header */}
      <motion.div 
         variants={fadeUp}
         initial="hidden"
         animate="visible"
         className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm relative"
      >
         {/* Cover */}
         <div className="h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
         
         <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-6">
               <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-md bg-white">
                     <AvatarFallback className="bg-gradient-to-br from-[var(--foreground)] to-slate-700 text-white text-3xl font-semibold">
                        RS
                     </AvatarFallback>
                  </Avatar>
                  <div className="pb-2">
                     <h2 className="text-2xl font-bold text-[var(--foreground)]">Rajesh Sharma</h2>
                     <p className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2 mt-1">
                        <Briefcase className="h-4 w-4" /> Chief Fleet Manager
                     </p>
                  </div>
               </div>
               <div className="pb-2 flex gap-3">
                  <Button variant="outline" className="rounded-xl border-[var(--border)] font-medium">
                     <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[var(--border)]">
               <div className="space-y-1">
                  <p className="text-xs text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Tenure</p>
                  <p className="text-xl font-bold">4.5 <span className="text-sm font-medium text-[var(--text-secondary)]">years</span></p>
               </div>
               <div className="space-y-1">
                  <p className="text-xs text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> Fleet Growth</p>
                  <p className="text-xl font-bold">+120%</p>
               </div>
               <div className="space-y-1">
                  <p className="text-xs text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center gap-1.5"><UsersIcon className="h-3.5 w-3.5" /> Team Size</p>
                  <p className="text-xl font-bold">30 <span className="text-sm font-medium text-[var(--text-secondary)]">drivers</span></p>
               </div>
               <div className="space-y-1">
                  <p className="text-xs text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> KPI Score</p>
                  <p className="text-xl font-bold text-emerald-600">96/100</p>
               </div>
            </div>
         </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
         {/* Left Column */}
         <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="md:col-span-2 space-y-6"
         >
            {/* Personal Information Form */}
            <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 shadow-sm">
               <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><User className="h-5 w-5 text-[var(--text-secondary)]" /> Personal Information</h3>
               <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label>Full Name</Label>
                     <Input readOnly defaultValue="Rajesh Sharma" className="rounded-xl h-11 bg-slate-50 border-transparent focus-visible:ring-0" />
                  </div>
                  <div className="space-y-2">
                     <Label>Employee ID</Label>
                     <Input readOnly defaultValue="EMP-2021-042" className="rounded-xl h-11 bg-slate-50 border-transparent focus-visible:ring-0 font-mono" />
                  </div>
                  <div className="space-y-2">
                     <Label>Email Address</Label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                        <Input readOnly defaultValue="rajesh@mehercabs.in" className="rounded-xl h-11 bg-slate-50 border-transparent focus-visible:ring-0 pl-10" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label>Phone Number</Label>
                     <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                        <Input readOnly defaultValue="+91 98765 43210" className="rounded-xl h-11 bg-slate-50 border-transparent focus-visible:ring-0 pl-10" />
                     </div>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                     <Label>Office Location</Label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                        <Input readOnly defaultValue="Headquarters - Sector 15, Noida" className="rounded-xl h-11 bg-slate-50 border-transparent focus-visible:ring-0 pl-10" />
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Performance Goals */}
            <motion.div variants={staggerItem} className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 shadow-sm">
               <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Activity className="h-5 w-5 text-[var(--text-secondary)]" /> Q2 Performance Goals</h3>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                        <span className="font-medium text-[var(--foreground)]">Fleet Utilization</span>
                        <span className="text-[var(--text-secondary)]">Target: 85% • Current: <strong className="text-emerald-600 font-semibold">82%</strong></span>
                     </div>
                     <Progress value={82} className="h-2.5 bg-slate-100" indicatorClassName="bg-emerald-500" />
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                        <span className="font-medium text-[var(--foreground)]">Customer Satisfaction (CSAT)</span>
                        <span className="text-[var(--text-secondary)]">Target: 4.8 • Current: <strong className="text-sky-600 font-semibold">4.65</strong></span>
                     </div>
                     <Progress value={92} className="h-2.5 bg-slate-100" indicatorClassName="bg-sky-500" />
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                        <span className="font-medium text-[var(--foreground)]">Maintenance Costs Reduction</span>
                        <span className="text-[var(--text-secondary)]">Target: 15% • Current: <strong className="text-amber-500 font-semibold">12%</strong></span>
                     </div>
                     <Progress value={80} className="h-2.5 bg-slate-100" indicatorClassName="bg-amber-500" />
                  </div>
               </div>
            </motion.div>
         </motion.div>

         {/* Right Column */}
         <motion.div 
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="space-y-6"
         >
            {/* Roles & Permissions */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
               <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-[var(--text-secondary)]" /> Roles & Access</h3>
               <div className="space-y-2">
                  <Badge className="w-full justify-center bg-slate-100 text-[var(--foreground)] hover:bg-slate-200 border-none rounded-lg py-2">Super Admin Access</Badge>
                  <Badge variant="outline" className="w-full justify-center rounded-lg py-2 font-normal">Financial Reports (Read/Write)</Badge>
                  <Badge variant="outline" className="w-full justify-center rounded-lg py-2 font-normal">Driver Management (Read/Write)</Badge>
                  <Badge variant="outline" className="w-full justify-center rounded-lg py-2 font-normal">System Config (Full Access)</Badge>
               </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
               <h3 className="text-sm font-semibold mb-5 flex items-center gap-2"><Clock className="h-4 w-4 text-[var(--text-secondary)]" /> Recent Activity</h3>
               <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-slate-200">
                  {activityLog.map((log, i) => (
                     <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
                        <div className="h-6 w-6 shrink-0 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center relative z-10">
                           <log.icon className="h-3 w-3 text-slate-500" />
                        </div>
                        <div className="pt-0.5">
                           <p className="text-xs font-medium leading-relaxed">{log.action}</p>
                           <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{log.time}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <Button variant="ghost" className="w-full mt-4 text-xs font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl">
                  View All Activity
               </Button>
            </div>
         </motion.div>
      </div>
    </div>
  )
}

function FileTextIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
}
function SettingsIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
}
function UsersIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
