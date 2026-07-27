'use client'

import { useState, useEffect, useRef } from 'react'

interface KPIState {
  value: number
  trend: 'up' | 'down' | 'stable'
}

interface LiveKPIs {
  revenue: KPIState
  activeTrips: KPIState
  fleetHealth: KPIState
  activeDrivers: KPIState
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function jitter(base: number, percent: number, min: number, max: number): [number, 'up' | 'down'] {
  const delta = base * (Math.random() - 0.5) * 2 * percent
  const next = clamp(base + delta, min, max)
  return [Math.round(next), next >= base ? 'up' : 'down']
}

export function useLiveKPIs(): LiveKPIs {
  const [kpis, setKpis] = useState<LiveKPIs>({
    revenue: { value: 185000, trend: 'up' },
    activeTrips: { value: 42, trend: 'up' },
    fleetHealth: { value: 87, trend: 'stable' },
    activeDrivers: { value: 28, trend: 'stable' },
  })

  const revenueBase = useRef(185000)
  const tripsBase = useRef(42)
  const healthBase = useRef(87)
  const driversBase = useRef(28)

  useEffect(() => {
    const interval = setInterval(() => {
      revenueBase.current += (Math.random() - 0.48) * 3000
      revenueBase.current = clamp(revenueBase.current, 170000, 200000)

      tripsBase.current += Math.random() > 0.6 ? 1 : -1
      tripsBase.current = clamp(tripsBase.current, 30, 55)

      healthBase.current += (Math.random() - 0.5) * 2
      healthBase.current = clamp(healthBase.current, 78, 96)

      driversBase.current += Math.random() > 0.7 ? 1 : -1
      driversBase.current = clamp(driversBase.current, 22, 30)

      const [rev, revDir] = jitter(revenueBase.current, 0.02, 170000, 200000)
      const [trips, tripsDir] = jitter(tripsBase.current, 0.1, 30, 55)
      const [health, healthDir] = jitter(healthBase.current, 0.03, 78, 96)
      const [drivers, driversDir] = jitter(driversBase.current, 0.06, 22, 30)

      setKpis({
        revenue: { value: rev, trend: revDir },
        activeTrips: { value: trips, trend: tripsDir },
        fleetHealth: { value: health, trend: healthDir },
        activeDrivers: { value: drivers, trend: driversDir },
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return kpis
}
