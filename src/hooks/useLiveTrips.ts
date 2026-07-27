'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Trip } from '@/data/trips'

const LOCATIONS = [
  { address: 'IGI Airport T3, Delhi', lat: 28.5562, lng: 77.1000 },
  { address: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167 },
  { address: 'India Gate, Delhi', lat: 28.6129, lng: 77.2295 },
  { address: 'Hauz Khas Village, Delhi', lat: 28.5494, lng: 77.2001 },
  { address: 'Saket Select City Walk, Delhi', lat: 28.5286, lng: 77.2189 },
  { address: 'Dwarka Sector 21, Delhi', lat: 28.5523, lng: 77.0580 },
  { address: 'Cyber Hub, Gurugram', lat: 28.4945, lng: 77.0889 },
  { address: 'DLF Mall of India, Noida', lat: 28.5675, lng: 77.3260 },
  { address: 'Golf Course Road, Gurugram', lat: 28.4449, lng: 77.1013 },
  { address: 'New Delhi Railway Station', lat: 28.6424, lng: 77.2195 },
  { address: 'Huda City Centre, Gurugram', lat: 28.4595, lng: 77.0266 },
  { address: 'Rajouri Garden, Delhi', lat: 28.6492, lng: 77.1231 },
  { address: 'Lajpat Nagar Market, Delhi', lat: 28.5694, lng: 77.2432 },
  { address: 'Chandni Chowk, Delhi', lat: 28.6506, lng: 77.2334 },
  { address: 'Vasant Kunj Mall, Delhi', lat: 28.5207, lng: 77.1562 },
  { address: 'Pitampura, Delhi', lat: 28.7027, lng: 77.1461 },
  { address: 'Indirapuram, Ghaziabad', lat: 28.6411, lng: 77.3640 },
  { address: 'Greater Kailash 1, Delhi', lat: 28.5494, lng: 77.2434 },
  { address: 'Mayur Vihar Phase 1, Delhi', lat: 28.5921, lng: 77.2976 },
  { address: 'Red Fort, Delhi', lat: 28.6562, lng: 77.2410 },
]

const DRIVER_NAMES = [
  'Amit Kumar', 'Rahul Singh', 'Suresh Sharma', 'Vikram Verma', 'Pradeep Gupta',
  'Manoj Yadav', 'Rajesh Chauhan', 'Sanjay Joshi', 'Deepak Pandey', 'Arun Mishra',
  'Vinod Tiwari', 'Ramesh Rawat', 'Naveen Negi', 'Rohit Malik', 'Sunil Saini',
  'Ajay Choudhary', 'Prakash Thakur', 'Ravi Bhat', 'Ashok Reddy', 'Vikas Iyer',
  'Dinesh Mehta', 'Mukesh Patel', 'Santosh Srivastava', 'Bharat Dwivedi', 'Gopal Saxena',
]

const CUSTOMER_FIRST = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Muhammad', 'Sai',
  'Ananya', 'Diya', 'Priya', 'Neha', 'Pooja', 'Shreya', 'Kavya', 'Riya',
  'Ishaan', 'Kabir', 'Dhruv', 'Arnav', 'Meera', 'Aisha', 'Tara', 'Zara',
  'Rohan', 'Krish', 'Dev', 'Raj', 'Simran', 'Nisha',
]

const CUSTOMER_LAST = [
  'Chopra', 'Malhotra', 'Khanna', 'Mehra', 'Kohli', 'Bajaj', 'Tandon', 'Grover',
  'Chawla', 'Bedi', 'Sahni', 'Luthra', 'Walia', 'Ahuja', 'Oberoi', 'Khurana',
  'Dhawan', 'Nair', 'Menon', 'Pillai', 'Rao', 'Hegde', 'Kulkarni', 'Deshmukh',
  'Jain', 'Agarwal', 'Bansal', 'Garg', 'Mittal', 'Gupta',
]

const VEHICLE_TYPES: Trip['vehicleType'][] = ['Sedan', 'Sedan', 'SUV', 'Hatchback', 'Premium']
const PAYMENT_METHODS: Trip['paymentMethod'][] = ['cash', 'upi', 'upi', 'card', 'wallet']

let tripCounter = 301

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generatePhone(): string {
  const prefixes = ['98', '99', '97', '96', '95', '88', '87']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const rest = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
  return `+91 ${prefix}${rest}`
}

function createTrip(): Trip {
  const pickup = randomPick(LOCATIONS)
  let drop = randomPick(LOCATIONS)
  while (drop.address === pickup.address) {
    drop = randomPick(LOCATIONS)
  }

  const driverIdx = Math.floor(Math.random() * DRIVER_NAMES.length)
  const driverName = DRIVER_NAMES[driverIdx]
  const cfn = randomPick(CUSTOMER_FIRST)
  const cln = randomPick(CUSTOMER_LAST)
  const distance = Number((3 + Math.random() * 35).toFixed(1))
  const duration = Math.floor(distance * (2.5 + Math.random() * 2))
  const fare = Math.floor(distance * (12 + Math.random() * 8) + 50)

  return {
    id: `TRP-${String(tripCounter++).padStart(4, '0')}`,
    driverId: `DRV-${String(driverIdx + 1).padStart(3, '0')}`,
    driverName,
    vehicleId: `VEH-${String(Math.min(driverIdx + 1, 25)).padStart(3, '0')}`,
    vehicleNumber: `DL ${Math.floor(Math.random() * 9 + 1)}C ${String(Math.floor(Math.random() * 9000 + 1000))}`,
    customerId: `CUS-${String(Math.floor(Math.random() * 9000 + 1000))}`,
    customerName: `${cfn} ${cln}`,
    customerPhone: generatePhone(),
    pickup,
    drop,
    status: 'scheduled',
    fare,
    distance,
    duration,
    startTime: new Date().toISOString(),
    endTime: null,
    paymentMethod: randomPick(PAYMENT_METHODS),
    rating: null,
    vehicleType: randomPick(VEHICLE_TYPES),
  }
}

const STATUS_CYCLE: Trip['status'][] = ['scheduled', 'in-progress', 'completed']
const CYCLE_TIME = [15000, 30000]

interface UseLiveTripsReturn {
  trips: Trip[]
}

export function useLiveTrips(): UseLiveTripsReturn {
  const [trips, setTrips] = useState<Trip[]>([])
  const timersRef = useRef<Map<string, number>>(new Map())

  const scheduleProgress = useCallback((tripId: string) => {
    setTrips((prev) => {
      const trip = prev.find((t) => t.id === tripId)
      if (!trip) return prev

      const statusIdx = STATUS_CYCLE.indexOf(trip.status)
      if (statusIdx < 0 || statusIdx >= STATUS_CYCLE.length - 1) return prev

      const nextStatus = STATUS_CYCLE[statusIdx + 1]
      const delay = CYCLE_TIME[0] + Math.random() * (CYCLE_TIME[1] - CYCLE_TIME[0])

      const timerId = window.setTimeout(() => {
        setTrips((current) =>
          current.map((t) => {
            if (t.id !== tripId) return t
            return {
              ...t,
              status: nextStatus,
              endTime: nextStatus === 'completed' ? new Date().toISOString() : null,
            }
          })
        )
        timersRef.current.delete(tripId)
      }, delay)

      timersRef.current.set(tripId, timerId)
      return prev
    })
  }, [])

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 7000
      return window.setTimeout(() => {
        const newTrip = createTrip()
        setTrips((prev) => [newTrip, ...prev])
        scheduleProgress(newTrip.id)

        setTrips((prev) => (prev.length > 50 ? prev.slice(0, 50) : prev))
        scheduleNext()
      }, delay)
    }

    const seedTimer = scheduleNext()

    const savedTimers = timersRef.current
    return () => {
      clearTimeout(seedTimer)
      savedTimers.forEach((timerId) => {
        if (timerId) clearTimeout(timerId)
      })
      savedTimers.clear()
    }
  }, [scheduleProgress])

  return { trips }
}
