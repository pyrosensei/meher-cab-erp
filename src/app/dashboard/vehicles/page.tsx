'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { vehicles, Vehicle } from '@/data/vehicles'
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
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, Filter, Fuel, Gauge, Shield, Wrench, 
  Calendar, MapPin, User, Car, Activity, Zap, ChevronRight
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vehicle Management" 
        description="Monitor vehicle health, fuel levels, and maintenance schedules."
      >
        <Button className="rounded-xl bg-[var(--foreground)] text-white hover:bg-[var(--foreground)]/90">
          <Wrench className="mr-2 h-4 w-4" />
          Schedule Maintenance
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
            placeholder="Search by make, model, or registration..." 
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Vehicle Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {filteredVehicles.map(vehicle => (
            <motion.div
              key={vehicle.id}
              variants={staggerItem}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-5 transition-all duration-300 flex flex-col"
              onClick={() => setSelectedVehicle(vehicle)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)]">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">{vehicle.registrationNumber}</p>
                  </div>
                </div>
                <StatusBadge status={vehicle.status} />
              </div>
              
              <div className="flex gap-2 mb-5">
                <Badge variant="outline" className="text-[10px] uppercase font-medium tracking-wider rounded-md bg-slate-50">
                  {vehicle.type}
                </Badge>
                <Badge variant="outline" className="text-[10px] uppercase font-medium tracking-wider rounded-md bg-slate-50">
                  {vehicle.fuelType}
                </Badge>
              </div>

              <div className="space-y-4 mt-auto">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-[var(--text-secondary)]"><Activity className="h-3 w-3" /> Health</span>
                    <span className={vehicle.healthScore > 80 ? 'text-emerald-600' : vehicle.healthScore > 50 ? 'text-amber-500' : 'text-red-500'}>{vehicle.healthScore}%</span>
                  </div>
                  <Progress 
                    value={vehicle.healthScore} 
                    className="h-1.5"
                    indicatorClassName={vehicle.healthScore > 80 ? 'bg-emerald-500' : vehicle.healthScore > 50 ? 'bg-amber-500' : 'bg-red-500'}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                      {vehicle.fuelType === 'Electric' ? <Zap className="h-3 w-3" /> : <Fuel className="h-3 w-3" />}
                      {vehicle.fuelType === 'Electric' ? 'Battery' : 'Fuel'}
                    </span>
                    <span className={vehicle.fuelLevel > 20 ? '' : 'text-red-500'}>{vehicle.fuelLevel}%</span>
                  </div>
                  <Progress 
                    value={vehicle.fuelLevel} 
                    className="h-1.5"
                    indicatorClassName={vehicle.fuelLevel > 20 ? (vehicle.fuelType === 'Electric' ? 'bg-sky-500' : 'bg-[var(--foreground)]') : 'bg-red-500'}
                  />
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <User className="h-3.5 w-3.5" />
                    <span>{vehicle.driverName || 'Unassigned'}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[var(--foreground)] transition-colors" />
                </div>
              </div>
              
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredVehicles.length === 0 && (
          <div className="col-span-full py-12 text-center text-[var(--text-secondary)]">
            <p className="text-lg font-medium text-[var(--foreground)]">No vehicles found</p>
            <p className="mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </motion.div>

      {/* Vehicle Detail Sheet */}
      <Sheet open={!!selectedVehicle} onOpenChange={(open) => !open && setSelectedVehicle(null)}>
        <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden rounded-l-3xl border-l border-[var(--border)] bg-[var(--secondary)]">
          {selectedVehicle && (
            <ScrollArea className="h-full">
              <div className="bg-white px-6 py-8 border-b border-[var(--border)] relative overflow-hidden">
                <div className="absolute -right-6 -top-6 h-32 w-32 bg-slate-50 rounded-full flex items-center justify-center opacity-50">
                   <Car className="h-16 w-16 text-slate-200" />
                </div>
                <SheetHeader className="text-left relative z-10 space-y-4">
                  <div>
                    <Badge variant="outline" className="mb-3 bg-slate-50">{selectedVehicle.type}</Badge>
                    <SheetTitle className="text-2xl">{selectedVehicle.make} {selectedVehicle.model}</SheetTitle>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm font-medium">{selectedVehicle.registrationNumber}</span>
                       <StatusBadge status={selectedVehicle.status} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-6">
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Year</p>
                      <p className="text-sm font-medium mt-1">{selectedVehicle.year}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Color</p>
                      <p className="text-sm font-medium mt-1">{selectedVehicle.color}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Mileage</p>
                      <p className="text-sm font-medium mt-1">{selectedVehicle.mileage} {selectedVehicle.fuelType === 'Electric' ? 'km/kWh' : 'km/l'}</p>
                    </div>
                  </div>
                </SheetHeader>
              </div>

              <div className="p-6 space-y-6">
                <section className="space-y-4 rounded-2xl bg-white p-5 border border-[var(--border)]">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Condition & Metrics
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Overall Health</span>
                        <span className="font-medium">{selectedVehicle.healthScore}%</span>
                      </div>
                      <Progress value={selectedVehicle.healthScore} className="h-2" 
                         indicatorClassName={selectedVehicle.healthScore > 80 ? 'bg-emerald-500' : selectedVehicle.healthScore > 50 ? 'bg-amber-500' : 'bg-red-500'} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">{selectedVehicle.fuelType === 'Electric' ? 'Battery Level' : 'Fuel Level'}</span>
                        <span className="font-medium">{selectedVehicle.fuelLevel}%</span>
                      </div>
                      <Progress value={selectedVehicle.fuelLevel} className="h-2" 
                        indicatorClassName={selectedVehicle.fuelLevel > 20 ? (selectedVehicle.fuelType === 'Electric' ? 'bg-sky-500' : 'bg-[var(--foreground)]') : 'bg-red-500'}/>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-[var(--border)]">
                       <span className="text-[var(--text-secondary)] flex items-center gap-2"><Gauge className="h-4 w-4"/> Odometer</span>
                       <span className="font-medium">{selectedVehicle.totalKm.toLocaleString('en-IN')} km</span>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 rounded-2xl bg-white p-5 border border-[var(--border)]">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Compliance & Service
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)] flex items-center gap-2"><Shield className="h-4 w-4"/> Insurance Expiry</span>
                      <span className="font-medium">{formatDate(selectedVehicle.insuranceExpiry)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)] flex items-center gap-2"><Wrench className="h-4 w-4"/> Last Service</span>
                      <span className="font-medium">{formatDate(selectedVehicle.lastService)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)] flex items-center gap-2"><Calendar className="h-4 w-4"/> Next Service Due</span>
                      <span className="font-medium">{formatDate(selectedVehicle.nextService)}</span>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 rounded-2xl bg-white p-5 border border-[var(--border)]">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" /> Assignment
                  </h4>
                  {selectedVehicle.driverName ? (
                     <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-slate-50">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium">
                              {selectedVehicle.driverName.substring(0,2).toUpperCase()}
                           </div>
                           <div>
                              <p className="text-sm font-medium">{selectedVehicle.driverName}</p>
                              <p className="text-xs text-[var(--text-secondary)]">ID: {selectedVehicle.driverId}</p>
                           </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 rounded-lg">View</Button>
                     </div>
                  ) : (
                     <p className="text-sm text-[var(--text-secondary)]">No driver currently assigned to this vehicle.</p>
                  )}
                </section>
                
                <section className="space-y-4 rounded-2xl bg-white p-5 border border-[var(--border)]">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Car className="h-4 w-4" /> Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                     {selectedVehicle.features.map(f => (
                        <Badge key={f} variant="secondary" className="rounded-md font-normal">{f}</Badge>
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
