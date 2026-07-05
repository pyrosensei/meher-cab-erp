'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { trips, Trip } from '@/data/trips'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Search, Filter, MapPin, Clock, IndianRupee, Star, 
  ArrowRight, Calendar, User, Car, CreditCard, 
  ChevronLeft, ChevronRight, Download
} from 'lucide-react'
import { cn, formatCurrency, formatDate, formatTime, getTimeAgo } from '@/lib/utils'

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const limit = 15

  const sortedTrips = [...trips].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  
  const filteredTrips = sortedTrips.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.pickup.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.drop.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredTrips.length / limit)
  const currentTrips = filteredTrips.slice((page - 1) * limit, page * limit)

  // Stats
  const totalCompleted = trips.filter(t => t.status === 'completed').length
  const totalRevenue = trips.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.fare, 0)
  const avgFare = totalRevenue / totalCompleted || 0
  const avgDistance = trips.reduce((acc, t) => acc + t.distance, 0) / trips.length || 0

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Trip Management" 
        description="Monitor active trips, review history, and manage bookings."
      >
        <Button variant="outline" className="rounded-xl border-[var(--border)]">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </PageHeader>

      {/* Stats row */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Trips', value: trips.length.toLocaleString(), icon: MapPin },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: IndianRupee },
          { label: 'Avg Fare', value: formatCurrency(avgFare), icon: CreditCard },
          { label: 'Avg Distance', value: `${avgDistance.toFixed(1)} km`, icon: NavigationIcon },
        ].map((stat, i) => (
          <motion.div key={i} variants={staggerItem} className="bg-white rounded-2xl border border-[var(--border)] p-4 flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-[var(--secondary)] flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-[var(--text-secondary)]" />
             </div>
             <div>
                <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-semibold mt-0.5">{stat.value}</p>
             </div>
          </motion.div>
        ))}
      </motion.div>

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
            placeholder="Search by ID, driver, customer, or location..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="pl-9 h-11 rounded-xl border-[var(--border)] bg-white focus:bg-white transition-colors"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl bg-white border-[var(--border)]">
            <Filter className="mr-2 h-4 w-4 text-[var(--text-secondary)]" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Trip List */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {currentTrips.map(trip => (
            <motion.div
              key={trip.id}
              variants={staggerItem}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onClick={() => setSelectedTrip(trip)}
              className="card-base card-interactive group relative overflow-hidden bg-white p-4 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 transition-all duration-300"
            >
              {/* Subtle glass side accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-200 to-transparent opacity-50" />
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 w-full">
                 {/* ID & Status */}
                 <div className="flex items-center gap-3 w-48 shrink-0">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                       <MapPin className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                       <p className="font-mono text-sm font-semibold text-[var(--foreground)]">{trip.id}</p>
                       <p className="text-xs text-[var(--text-secondary)] mt-0.5">{getTimeAgo(trip.startTime)}</p>
                    </div>
                 </div>

                 {/* Route */}
                 <div className="flex-1 flex items-center min-w-0 gap-3">
                    <div className="flex-1 truncate">
                       <p className="text-sm font-medium truncate">{trip.pickup.address.split(',')[0]}</p>
                       <p className="text-[11px] text-[var(--text-secondary)] truncate">{formatTime(trip.startTime)}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
                    <div className="flex-1 truncate">
                       <p className="text-sm font-medium truncate">{trip.drop.address.split(',')[0]}</p>
                       <p className="text-[11px] text-[var(--text-secondary)] truncate">
                          {trip.endTime ? formatTime(trip.endTime) : 'ETA: ' + trip.duration + 'm'}
                       </p>
                    </div>
                 </div>

                 {/* Driver & Vehicle */}
                 <div className="hidden md:block w-48 shrink-0">
                    <p className="text-sm font-medium truncate">{trip.driverName}</p>
                    <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                       <Car className="h-3 w-3" /> {trip.vehicleNumber}
                    </p>
                 </div>

                 {/* Fare & Status */}
                 <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-48 shrink-0">
                    <div className="text-left lg:text-right">
                       <p className="text-sm font-semibold">{formatCurrency(trip.fare)}</p>
                       <p className="text-xs text-[var(--text-secondary)]">{trip.distance} km • {trip.duration} min</p>
                    </div>
                    <StatusBadge status={trip.status} />
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {currentTrips.length === 0 && (
          <div className="py-12 text-center text-[var(--text-secondary)] bg-white rounded-2xl border border-[var(--border)]">
            <p className="text-lg font-medium text-[var(--foreground)]">No trips found</p>
            <p className="mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
         <div className="flex items-center justify-center gap-4 mt-6">
            <Button 
               variant="outline" 
               size="sm" 
               className="rounded-lg h-9 w-9 p-0"
               onClick={() => setPage(p => Math.max(1, p - 1))}
               disabled={page === 1}
            >
               <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
               Page {page} of {totalPages}
            </span>
            <Button 
               variant="outline" 
               size="sm" 
               className="rounded-lg h-9 w-9 p-0"
               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
               disabled={page === totalPages}
            >
               <ChevronRight className="h-4 w-4" />
            </Button>
         </div>
      )}

      {/* Trip Detail Sheet */}
      <Sheet open={!!selectedTrip} onOpenChange={(open) => !open && setSelectedTrip(null)}>
        <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden rounded-l-3xl border-l border-[var(--border)] bg-[var(--page-bg)]">
          {selectedTrip && (
            <ScrollArea className="h-full">
              <div className="bg-white/80 backdrop-blur-xl px-6 py-8 border-b border-[var(--border)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-100/30 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <SheetHeader className="text-left relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                     <div>
                        <Badge variant="outline" className="mb-2 bg-slate-50 font-mono">{selectedTrip.id}</Badge>
                        <SheetTitle className="text-xl">Trip Details</SheetTitle>
                     </div>
                     <StatusBadge status={selectedTrip.status} />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                     <div>
                        <p className="text-2xl font-bold">{formatCurrency(selectedTrip.fare)}</p>
                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium mt-1">Total Fare</p>
                     </div>
                     <div className="text-right">
                        <div className="flex items-center justify-end gap-1 mb-1">
                           {selectedTrip.rating ? (
                              Array.from({length: 5}).map((_, i) => (
                                 <Star key={i} className={cn("h-3.5 w-3.5", i < selectedTrip.rating! ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200")} />
                              ))
                           ) : (
                              <span className="text-sm text-[var(--text-secondary)] italic">Unrated</span>
                           )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] capitalize">{selectedTrip.paymentMethod} payment</p>
                     </div>
                  </div>
                </SheetHeader>
              </div>

              <div className="p-6 space-y-6">
                {/* Route */}
                <section className="space-y-4 rounded-2xl bg-white p-5 border border-[var(--border)]">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Route
                  </h4>
                  <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-slate-200">
                     <div className="relative">
                        <div className="absolute -left-6 top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-0.5">PICKUP • {formatTime(selectedTrip.startTime)}</p>
                        <p className="text-sm font-medium leading-tight">{selectedTrip.pickup.address}</p>
                     </div>
                     <div className="relative">
                        <div className="absolute -left-6 top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-4 ring-rose-50" />
                        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-0.5">
                           DROP • {selectedTrip.endTime ? formatTime(selectedTrip.endTime) : 'Pending'}
                        </p>
                        <p className="text-sm font-medium leading-tight">{selectedTrip.drop.address}</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                     <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Distance</p>
                        <p className="text-sm font-medium mt-0.5">{selectedTrip.distance} km</p>
                     </div>
                     <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Duration</p>
                        <p className="text-sm font-medium mt-0.5">{selectedTrip.duration} mins</p>
                     </div>
                  </div>
                </section>

                {/* People */}
                <section className="space-y-4 rounded-2xl bg-white p-5 border border-[var(--border)]">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" /> Participants
                  </h4>
                  <div className="space-y-4">
                     <div>
                        <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider mb-2">Driver</p>
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium">
                              {selectedTrip.driverName.substring(0,2).toUpperCase()}
                           </div>
                           <div>
                              <p className="text-sm font-medium">{selectedTrip.driverName}</p>
                              <p className="text-xs text-[var(--text-secondary)]">{selectedTrip.driverId}</p>
                           </div>
                        </div>
                     </div>
                     <Separator />
                     <div>
                        <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider mb-2">Customer</p>
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-medium">
                              {selectedTrip.customerName.substring(0,2).toUpperCase()}
                           </div>
                           <div>
                              <p className="text-sm font-medium">{selectedTrip.customerName}</p>
                              <p className="text-xs text-[var(--text-secondary)]">{selectedTrip.customerPhone}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                </section>

                {/* Vehicle */}
                <section className="space-y-4 rounded-2xl bg-white p-5 border border-[var(--border)]">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Car className="h-4 w-4" /> Vehicle
                  </h4>
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <Car className="h-5 w-5 text-slate-500" />
                     </div>
                     <div>
                        <p className="text-sm font-medium font-mono">{selectedTrip.vehicleNumber}</p>
                        <div className="flex gap-2 mt-1">
                           <Badge variant="outline" className="text-[10px] bg-slate-50 font-normal">{selectedTrip.vehicleType}</Badge>
                           <Badge variant="outline" className="text-[10px] bg-slate-50 font-normal">{selectedTrip.vehicleId}</Badge>
                        </div>
                     </div>
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

function NavigationIcon({ className }: { className?: string }) {
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
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  )
}
