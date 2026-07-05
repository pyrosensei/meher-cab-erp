'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { drivers, Driver } from '@/data/drivers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, Filter, Star, Phone, MapPin, Car, 
  Calendar, TrendingUp, Award, Clock, ChevronRight, Mail 
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

export default function DriversPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          driver.phone.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Driver Management" 
        description="Manage your fleet's drivers, track performance, and view details."
      >
        <Button className="rounded-xl bg-[var(--foreground)] text-white hover:bg-[var(--foreground)]/90">
          <Award className="mr-2 h-4 w-4" />
          Top Performers
        </Button>
      </PageHeader>

      {/* Filters */}
      <motion.div 
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <Input 
            placeholder="Search drivers by name or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 rounded-xl border-[var(--border)] bg-white focus:bg-white transition-colors"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl bg-white border-[var(--border)]">
            <Filter className="mr-2 h-4 w-4 text-[var(--text-secondary)]" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="on-trip">On Trip</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Driver Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {filteredDrivers.map(driver => (
            <motion.div
              key={driver.id}
              variants={staggerItem}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-base card-interactive group relative overflow-hidden bg-white p-5 flex flex-col"
              onClick={() => setSelectedDriver(driver)}
            >
              {/* Subtle glass header accent */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-50 to-transparent opacity-50" />
              
              <div className="relative z-10 flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-[var(--border)]">
                    <AvatarFallback className="bg-gradient-to-br from-neutral-800 to-neutral-600 text-white font-medium">
                      {driver.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)]">{driver.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{driver.rating}</span>
                      <span className="text-xs text-[var(--text-secondary)]">({driver.totalTrips} trips)</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={driver.status} />
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Phone className="h-4 w-4" />
                  <span>{driver.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Car className="h-4 w-4" />
                  <span>{driver.vehicleNumber || 'No Vehicle Assigned'}</span>
                </div>
                {driver.status === 'on-trip' && driver.currentTrip && (
                  <div className="flex items-center gap-2 text-sm text-sky-600 font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>Trip {driver.currentTrip}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 mt-auto border-t border-[var(--border)] flex items-center justify-between text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                View Details <ChevronRight className="h-3.5 w-3.5 group-hover:text-[var(--foreground)] transition-colors" />
              </div>
              
              {/* Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredDrivers.length === 0 && (
          <div className="col-span-full py-12 text-center text-[var(--text-secondary)]">
            <p className="text-lg font-medium text-[var(--foreground)]">No drivers found</p>
            <p className="mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </motion.div>

      {/* Driver Detail Sheet */}
      <Sheet open={!!selectedDriver} onOpenChange={(open) => !open && setSelectedDriver(null)}>
        <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden rounded-l-3xl border-l border-[var(--border)] bg-[var(--page-bg)]">
          {selectedDriver && (
            <ScrollArea className="h-full">
              <div className="bg-white/80 backdrop-blur-xl px-6 py-8 border-b border-[var(--border)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <SheetHeader className="text-left relative z-10 space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-white shadow-xl">
                      <AvatarFallback className="bg-gradient-to-br from-neutral-800 to-neutral-600 text-white text-xl font-semibold">
                        {selectedDriver.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <SheetTitle className="text-2xl">{selectedDriver.name}</SheetTitle>
                      <StatusBadge status={selectedDriver.status} className="mt-2" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-1">
                      <p className="text-xs text-[var(--text-secondary)] uppercase font-medium tracking-wider">Total Trips</p>
                      <p className="text-lg font-semibold">{formatNumber(selectedDriver.totalTrips)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[var(--text-secondary)] uppercase font-medium tracking-wider">Total Earnings</p>
                      <p className="text-lg font-semibold">{formatCurrency(selectedDriver.totalEarnings)}</p>
                    </div>
                  </div>
                </SheetHeader>
              </div>

              <div className="p-6 space-y-8">
                {/* Contact Info */}
                <section className="space-y-4 rounded-2xl bg-white p-5 border border-[var(--border)]">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-[var(--text-secondary)]" />
                      <span>{selectedDriver.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-[var(--text-secondary)]" />
                      <span>{selectedDriver.email}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{selectedDriver.address}</span>
                    </div>
                  </div>
                </section>

                {/* Performance Metrics */}
                <section className="space-y-4 rounded-2xl bg-white p-5 border border-[var(--border)]">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Performance Metrics
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Completion Rate</span>
                        <span className="font-medium">{selectedDriver.completionRate}%</span>
                      </div>
                      <Progress value={selectedDriver.completionRate} className="h-2 bg-emerald-100 [&>div]:bg-emerald-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Acceptance Rate</span>
                        <span className="font-medium">{selectedDriver.acceptanceRate}%</span>
                      </div>
                      <Progress value={selectedDriver.acceptanceRate} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Cancellation Rate</span>
                        <span className="font-medium">{selectedDriver.cancellationRate}%</span>
                      </div>
                      <Progress value={selectedDriver.cancellationRate} className="h-2 bg-red-100 [&>div]:bg-red-500" />
                    </div>
                  </div>
                </section>

                {/* Documents */}
                <section className="space-y-4 rounded-2xl bg-white p-5 border border-[var(--border)]">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4" /> Documents
                  </h4>
                  <div className="space-y-3">
                    {selectedDriver.documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">{doc.type}</span>
                        <Badge 
                          variant="outline" 
                          className={
                            doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            doc.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                            'bg-red-50 text-red-600 border-red-200'
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
