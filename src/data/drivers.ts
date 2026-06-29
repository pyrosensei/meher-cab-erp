export interface Driver {
  id: string
  name: string
  phone: string
  email: string
  avatar: string
  rating: number
  totalTrips: number
  totalEarnings: number
  status: 'online' | 'on-trip' | 'offline'
  currentTrip: string | null
  vehicleId: string | null
  vehicleNumber: string | null
  licenseNumber: string
  joinDate: string
  address: string
  emergencyContact: string
  documents: { type: string; status: 'verified' | 'pending' | 'expired' }[]
  weeklyEarnings: number[]
  completionRate: number
  acceptanceRate: number
  cancellationRate: number
}

const firstNames = [
  'Amit', 'Rahul', 'Suresh', 'Vikram', 'Pradeep', 'Manoj', 'Rajesh', 'Sanjay',
  'Deepak', 'Arun', 'Vinod', 'Ramesh', 'Naveen', 'Rohit', 'Sunil', 'Ajay',
  'Prakash', 'Ravi', 'Ashok', 'Vikas', 'Dinesh', 'Mukesh', 'Santosh', 'Bharat',
  'Gopal', 'Kishan', 'Mohan', 'Naresh', 'Pawan', 'Tarun'
]

const lastNames = [
  'Kumar', 'Singh', 'Sharma', 'Verma', 'Gupta', 'Yadav', 'Chauhan', 'Joshi',
  'Pandey', 'Mishra', 'Tiwari', 'Rawat', 'Negi', 'Malik', 'Saini', 'Choudhary',
  'Thakur', 'Bhat', 'Reddy', 'Iyer', 'Mehta', 'Patel', 'Srivastava', 'Dwivedi',
  'Saxena', 'Agarwal', 'Kapoor', 'Sethi', 'Arora', 'Batra'
]

const areas = [
  'Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Saket', 'Dwarka',
  'Rohini', 'Pitampura', 'Janakpuri', 'Vasant Kunj', 'Greater Kailash',
  'Hauz Khas', 'Nehru Place', 'Rajouri Garden', 'Patel Nagar', 'Moti Nagar',
  'Punjabi Bagh', 'Model Town', 'Civil Lines', 'Chandni Chowk', 'Paharganj',
  'Noida Sector 18', 'Noida Sector 62', 'Gurugram Sector 29', 'Gurugram DLF Phase 3',
  'Faridabad NIT', 'Ghaziabad Indirapuram', 'Mayur Vihar', 'Preet Vihar',
  'Vasant Vihar', 'Defence Colony'
]

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function generatePhone(seed: number): string {
  const prefixes = ['98', '99', '97', '96', '95', '88', '87', '86', '85', '70']
  const prefix = prefixes[Math.floor(pseudoRandom(seed) * prefixes.length)]
  const rest = Math.floor(pseudoRandom(seed + 1) * 100000000).toString().padStart(8, '0')
  return `+91 ${prefix}${rest}`
}

function generateLicense(seed: number): string {
  const states = ['DL', 'HR', 'UP', 'RJ']
  const state = states[Math.floor(pseudoRandom(seed) * states.length)]
  const num = Math.floor(pseudoRandom(seed + 1) * 9000 + 1000)
  const year = Math.floor(pseudoRandom(seed + 2) * 10 + 2014)
  return `${state}-${num}${year}`
}

export const drivers: Driver[] = firstNames.map((firstName, i) => {
  const lastName = lastNames[i]
  const name = `${firstName} ${lastName}`
  const initials = `${firstName[0]}${lastName[0]}`
  const statuses: Driver['status'][] = ['online', 'on-trip', 'offline']
  const status = statuses[i % 3]
  const rating = Number((3.5 + pseudoRandom(i) * 1.5).toFixed(1))
  const totalTrips = Math.floor(500 + pseudoRandom(i + 1) * 4500)
  const totalEarnings = totalTrips * (180 + Math.floor(pseudoRandom(i + 2) * 120))

  return {
    id: `DRV-${String(i + 1).padStart(3, '0')}`,
    name,
    phone: generatePhone(i + 10),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mehercabs.in`,
    avatar: initials,
    rating,
    totalTrips,
    totalEarnings,
    status,
    currentTrip: status === 'on-trip' ? `TRP-${String(Math.floor(pseudoRandom(i + 3) * 300) + 1).padStart(4, '0')}` : null,
    vehicleId: i < 25 ? `VEH-${String(i + 1).padStart(3, '0')}` : null,
    vehicleNumber: i < 25 ? `DL ${Math.floor(pseudoRandom(i + 4) * 9 + 1)}C ${String(Math.floor(pseudoRandom(i + 5) * 9000 + 1000))}` : null,
    licenseNumber: generateLicense(i + 20),
    joinDate: new Date(2020 + Math.floor(pseudoRandom(i + 6) * 5), Math.floor(pseudoRandom(i + 7) * 12), Math.floor(pseudoRandom(i + 8) * 28) + 1).toISOString(),
    address: `${Math.floor(pseudoRandom(i + 9) * 200 + 1)}, ${areas[Math.floor(pseudoRandom(i + 10) * areas.length)]}, Delhi NCR`,
    emergencyContact: generatePhone(i + 30),
    documents: [
      { type: 'Driving License', status: pseudoRandom(i + 11) > 0.1 ? 'verified' : 'pending' },
      { type: 'Aadhaar Card', status: 'verified' },
      { type: 'PAN Card', status: pseudoRandom(i + 12) > 0.15 ? 'verified' : 'pending' },
      { type: 'Police Verification', status: pseudoRandom(i + 13) > 0.2 ? 'verified' : 'expired' },
    ],
    weeklyEarnings: Array.from({ length: 7 }, (_, day) => Math.floor(800 + pseudoRandom(i * 10 + day) * 2200)),
    completionRate: Number((85 + pseudoRandom(i + 14) * 15).toFixed(1)),
    acceptanceRate: Number((78 + pseudoRandom(i + 15) * 22).toFixed(1)),
    cancellationRate: Number((pseudoRandom(i + 16) * 8).toFixed(1)),
  }
})
