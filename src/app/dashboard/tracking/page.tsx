'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { vehicles as vehiclesData, Vehicle } from '@/data/vehicles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Search, Navigation, Gauge, MapPin, 
  User, Car, Clock, AlertCircle 
} from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { useLiveTracking } from '@/hooks/useLiveTracking'

import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })

// Custom icon setup for Leaflet marker to fix default icon issues in Next.js
const customMarkerHtml = `
  <div style="background: #0ea5e9; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(14, 165, 233, 0.6); position: relative;">
     <div style="position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; border-radius: 50%; background: rgba(14, 165, 233, 0.3); animation: pulse 2s infinite;"></div>
  </div>
`
const selectedMarkerHtml = `
  <div style="background: #ffffff; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #000; box-shadow: 0 0 15px rgba(0,0,0, 0.4); position: relative;">
     <div style="position: absolute; top: -3px; left: -3px; right: -3px; bottom: -3px; border-radius: 50%; border: 2px solid #000; animation: pulse-border 1.5s infinite;"></div>
  </div>
`

// Delhi NCR Center
const center = { lat: 28.6139, lng: 77.2090 }

export default function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [mounted, setMounted] = useState(false)
  const [L, setL] = useState<any>(null)

  const { vehicles, lastUpdate, activeVehicles } = useLiveTracking(vehiclesData)

  useEffect(() => {
    setMounted(true)
    import('leaflet').then(leaflet => {
      setL(leaflet)
    })
  }, [])

  const filteredVehicles = vehicles.filter(v => 
    v.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.driverName && v.driverName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const activeCount = vehicles.filter(v => v.status === 'active').length
  const maintCount = vehicles.filter(v => v.status === 'maintenance').length

  const getCustomIcon = (isSelected: boolean) => {
    if (!L) return undefined
    return L.divIcon({
      html: isSelected ? selectedMarkerHtml : customMarkerHtml,
      className: '',
      iconSize: isSelected ? [18, 18] : [14, 14],
      iconAnchor: isSelected ? [9, 9] : [7, 7]
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 rounded-tl-3xl bg-white overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-border { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
      `}} />
      <div className="p-6 pb-0 border-b border-[var(--border)] shrink-0">
         <PageHeader 
            title="Live GPS Tracking" 
            description="Real-time map view of your entire fleet."
         />
         <div className="h-4"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full sm:w-[320px] md:w-[380px] shrink-0 border-r border-[var(--border)] bg-white flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
        >
          <div className="p-4 border-b border-[var(--border)]">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <Input 
                placeholder="Search vehicles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl bg-[var(--secondary)] border-transparent focus:bg-white focus:border-[var(--border)] transition-colors"
              />
            </div>
            
            <div className="flex gap-2">
               <Badge variant="outline" className="flex-1 justify-center rounded-lg py-1.5 border-emerald-200 bg-emerald-50 text-emerald-600 text-xs">
                  {activeCount} Active
               </Badge>
               <Badge variant="outline" className="flex-1 justify-center rounded-lg py-1.5 border-amber-200 bg-amber-50 text-amber-600 text-xs">
                  {maintCount} In Shop
               </Badge>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] font-medium text-[var(--text-secondary)]">
              <Clock className="h-3 w-3" />
              <span>Last updated: {Math.floor((Date.now() - lastUpdate) / 1000)}s ago</span>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              <AnimatePresence>
                {filteredVehicles.map(vehicle => (
                  <motion.div
                    layout
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={cn(
                      "group p-3 rounded-xl cursor-pointer border transition-all duration-200",
                      selectedVehicle?.id === vehicle.id 
                        ? "bg-slate-50 border-[var(--border)] shadow-sm" 
                        : "border-transparent hover:bg-slate-50/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                       <p className="font-semibold text-sm">{vehicle.make} {vehicle.model}</p>
                       <StatusBadge status={vehicle.status} />
                    </div>
                    <p className="text-xs font-mono text-[var(--text-secondary)] mb-2">{vehicle.registrationNumber}</p>
                    <div className="flex items-center justify-between text-xs">
                       <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                          <User className="h-3.5 w-3.5" />
                          <span>{vehicle.driverName || 'Unassigned'}</span>
                       </div>
                       {vehicle.status === 'active' && (
                          <div className="flex items-center gap-1 text-emerald-600 font-medium">
                             <Gauge className="h-3.5 w-3.5" />
                             {vehicle.currentSpeed} km/h
                          </div>
                       )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </motion.div>

        {/* Map Area */}
        <div className="flex-1 relative bg-[#111]">
          {mounted && (
            <MapContainer 
              center={[center.lat, center.lng]} 
              zoom={11} 
              style={{ height: '100%', width: '100%', zIndex: 0 }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              
              {vehicles.map(vehicle => {
                if (!vehicle.location) return null;
                const isSelected = selectedVehicle?.id === vehicle.id;
                
                return (
                  <Marker 
                    key={vehicle.id + '-' + Math.floor(lastUpdate/3000)}
                    position={[vehicle.location.lat, vehicle.location.lng]}
                    icon={getCustomIcon(isSelected)}
                    eventHandlers={{
                      click: () => setSelectedVehicle(vehicle)
                    }}
                  >
                    <Popup className="custom-popup" closeButton={false}>
                       <div className="p-1">
                          <p className="font-bold text-sm m-0">{vehicle.make} {vehicle.model}</p>
                          <p className="text-xs text-gray-500 m-0 mt-1">{vehicle.registrationNumber}</p>
                       </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          )}

          {/* Floating Info Card */}
          <AnimatePresence>
            {selectedVehicle && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute top-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden z-20"
              >
                <div className="p-5 border-b border-[var(--border)]">
                   <div className="flex justify-between items-start mb-3">
                      <div>
                         <h3 className="font-semibold text-lg">{selectedVehicle.make} {selectedVehicle.model}</h3>
                         <p className="text-xs font-mono text-[var(--text-secondary)] mt-0.5">{selectedVehicle.registrationNumber}</p>
                      </div>
                      <StatusBadge status={selectedVehicle.status} />
                   </div>
                   
                   {selectedVehicle.driverName ? (
                      <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                         <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-medium shadow-sm">
                            {selectedVehicle.driverName.substring(0,2).toUpperCase()}
                         </div>
                         <div>
                            <p className="text-sm font-medium">{selectedVehicle.driverName}</p>
                            <p className="text-[10px] text-[var(--text-secondary)]">ID: {selectedVehicle.driverId}</p>
                         </div>
                      </div>
                   ) : (
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-slate-50 p-3 rounded-xl border border-slate-100">
                         <AlertCircle className="h-4 w-4" /> No driver assigned
                      </div>
                   )}
                </div>
                
                <div className="p-5 grid grid-cols-2 gap-4 bg-slate-50">
                   <div className="space-y-1">
                      <p className="text-[10px] uppercase font-semibold text-[var(--text-secondary)] flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5"/> Speed</p>
                      <p className="font-medium text-lg">
                         {selectedVehicle.status === 'active' ? selectedVehicle.currentSpeed : 0} <span className="text-xs text-[var(--text-secondary)] font-normal">km/h</span>
                      </p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] uppercase font-semibold text-[var(--text-secondary)] flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5"/> Odometer</p>
                      <p className="font-medium text-lg">
                         {formatNumber(selectedVehicle.totalKm)} <span className="text-xs text-[var(--text-secondary)] font-normal">km</span>
                      </p>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
