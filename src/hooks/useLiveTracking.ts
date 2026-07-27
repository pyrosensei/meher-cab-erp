'use client'

import { useState, useEffect } from 'react'
import type { Vehicle } from '@/data/vehicles'

const BOUNDS = { latMin: 28.4, latMax: 28.75, lngMin: 76.95, lngMax: 77.4 }
const STATUSES: Vehicle['status'][] = ['active', 'active', 'active', 'maintenance', 'inactive']
const INITIAL_VEHICLES_CACHE_KEY = 'useLiveTracking:initialVehicles'

function clampToBounds(lat: number, lng: number) {
  return {
    lat: Math.min(BOUNDS.latMax, Math.max(BOUNDS.latMin, lat)),
    lng: Math.min(BOUNDS.lngMax, Math.max(BOUNDS.lngMin, lng)),
  }
}

interface UseLiveTrackingReturn {
  vehicles: Vehicle[]
  lastUpdate: number
  activeVehicles: number
}

export function useLiveTracking(initialVehicles: Vehicle[]): UseLiveTrackingReturn {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const cached = sessionStorage.getItem(INITIAL_VEHICLES_CACHE_KEY)
      if (cached) return JSON.parse(cached) as Vehicle[]
    } catch { /* ignore */ }
    const stamped = initialVehicles.map((v) => ({ ...v }))
    try {
      sessionStorage.setItem(INITIAL_VEHICLES_CACHE_KEY, JSON.stringify(stamped))
    } catch { /* ignore */ }
    return stamped
  })

  const [lastUpdate, setLastUpdate] = useState<number>(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) => {
        const next = prev.map((v) => {
          let status = v.status
          const roll = Math.random()
          if (roll < 0.03) {
            const idx = STATUSES.indexOf(status)
            status = STATUSES[(idx + 1) % STATUSES.length]
          }

          let lat = v.location.lat
          let lng = v.location.lng
          let currentSpeed = v.currentSpeed

          if (status === 'active') {
            const speedKmph = 20 + Math.random() * 60
            currentSpeed = Math.round(speedKmph)
            const intervalHours = 3 / 3600
            const kmPerDegree = 111
            const distanceKm = speedKmph * intervalHours
            const deltaDeg = distanceKm / kmPerDegree

            const angle = Math.random() * 2 * Math.PI
            lat += deltaDeg * Math.cos(angle)
            lng += deltaDeg * Math.sin(angle)

            const clamped = clampToBounds(lat, lng)
            lat = clamped.lat
            lng = clamped.lng
          } else {
            if (currentSpeed > 0) {
              currentSpeed = Math.max(0, currentSpeed - Math.floor(Math.random() * 10 + 5))
            }
          }

          return { ...v, status, currentSpeed, location: { lat, lng } }
        })
        return next
      })
      setLastUpdate(Date.now())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const activeVehicles = vehicles.filter(
    (v) => v.status === 'active'
  ).length

  return { vehicles, lastUpdate, activeVehicles }
}
