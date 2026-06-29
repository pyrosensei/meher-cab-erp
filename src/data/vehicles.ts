export interface Vehicle {
  id: string
  registrationNumber: string
  make: string
  model: string
  year: number
  color: string
  type: 'Sedan' | 'SUV' | 'Hatchback' | 'Premium'
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric'
  status: 'active' | 'maintenance' | 'inactive' | 'out-of-service'
  healthScore: number
  fuelLevel: number
  mileage: number
  totalKm: number
  lastService: string
  nextService: string
  insuranceExpiry: string
  fitnessExpiry: string
  driverId: string | null
  driverName: string | null
  location: { lat: number; lng: number }
  currentSpeed: number
  features: string[]
}

const vehicleModels: { make: string; model: string; type: Vehicle['type'] }[] = [
  { make: 'Maruti Suzuki', model: 'Swift Dzire', type: 'Sedan' },
  { make: 'Maruti Suzuki', model: 'Ciaz', type: 'Sedan' },
  { make: 'Maruti Suzuki', model: 'Ertiga', type: 'SUV' },
  { make: 'Maruti Suzuki', model: 'Baleno', type: 'Hatchback' },
  { make: 'Hyundai', model: 'Aura', type: 'Sedan' },
  { make: 'Hyundai', model: 'Verna', type: 'Sedan' },
  { make: 'Hyundai', model: 'Creta', type: 'SUV' },
  { make: 'Hyundai', model: 'i20', type: 'Hatchback' },
  { make: 'Toyota', model: 'Etios', type: 'Sedan' },
  { make: 'Toyota', model: 'Innova Crysta', type: 'Premium' },
  { make: 'Toyota', model: 'Fortuner', type: 'Premium' },
  { make: 'Honda', model: 'City', type: 'Sedan' },
  { make: 'Honda', model: 'Amaze', type: 'Sedan' },
  { make: 'Tata', model: 'Tigor EV', type: 'Sedan' },
  { make: 'Tata', model: 'Nexon EV', type: 'SUV' },
  { make: 'Mahindra', model: 'XUV700', type: 'Premium' },
  { make: 'Mahindra', model: 'Scorpio N', type: 'SUV' },
  { make: 'Kia', model: 'Seltos', type: 'SUV' },
  { make: 'Kia', model: 'Carens', type: 'SUV' },
  { make: 'MG', model: 'Hector', type: 'SUV' },
  { make: 'Volkswagen', model: 'Virtus', type: 'Sedan' },
  { make: 'Skoda', model: 'Slavia', type: 'Sedan' },
  { make: 'Maruti Suzuki', model: 'Brezza', type: 'SUV' },
  { make: 'Hyundai', model: 'Venue', type: 'SUV' },
  { make: 'Toyota', model: 'Glanza', type: 'Hatchback' },
]

const colors = ['White', 'Silver', 'Black', 'Grey', 'Blue', 'Red', 'Brown']

const driverNames = [
  'Amit Kumar', 'Rahul Singh', 'Suresh Sharma', 'Vikram Verma', 'Pradeep Gupta',
  'Manoj Yadav', 'Rajesh Chauhan', 'Sanjay Joshi', 'Deepak Pandey', 'Arun Mishra',
  'Vinod Tiwari', 'Ramesh Rawat', 'Naveen Negi', 'Rohit Malik', 'Sunil Saini',
  'Ajay Choudhary', 'Prakash Thakur', 'Ravi Bhat', 'Ashok Reddy', 'Vikas Iyer',
  'Dinesh Mehta', 'Mukesh Patel', 'Santosh Srivastava', 'Bharat Dwivedi', 'Gopal Saxena'
]

// Delhi NCR coordinates spread
const delhiCenter = { lat: 28.6139, lng: 77.2090 }

export const vehicles: Vehicle[] = vehicleModels.map((vm, i) => {
  const statuses: Vehicle['status'][] = ['active', 'active', 'active', 'maintenance', 'inactive']
  const fuelTypes: Vehicle['fuelType'][] = ['Petrol', 'Diesel', 'CNG', 'Electric']
  const status = statuses[i % statuses.length]
  const year = 2019 + Math.floor(Math.random() * 6)
  const fuelType = vm.model.includes('EV') ? 'Electric' : fuelTypes[i % 3]

  return {
    id: `VEH-${String(i + 1).padStart(3, '0')}`,
    registrationNumber: `DL ${Math.floor(Math.random() * 9 + 1)}C${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${String(Math.floor(Math.random() * 9000 + 1000))}`,
    make: vm.make,
    model: vm.model,
    year,
    color: colors[i % colors.length],
    type: vm.type,
    fuelType,
    status,
    healthScore: Math.floor(60 + Math.random() * 40),
    fuelLevel: Math.floor(15 + Math.random() * 85),
    mileage: Number((8 + Math.random() * 14).toFixed(1)),
    totalKm: Math.floor(20000 + Math.random() * 130000),
    lastService: new Date(2025, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toISOString(),
    nextService: new Date(2025, 6 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toISOString(),
    insuranceExpiry: new Date(2025, 6 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    fitnessExpiry: new Date(2026, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    driverId: status === 'active' ? `DRV-${String(i + 1).padStart(3, '0')}` : null,
    driverName: status === 'active' ? driverNames[i] : null,
    location: {
      lat: delhiCenter.lat + (Math.random() - 0.5) * 0.3,
      lng: delhiCenter.lng + (Math.random() - 0.5) * 0.3,
    },
    currentSpeed: status === 'active' ? Math.floor(Math.random() * 60 + 10) : 0,
    features: ['AC', 'GPS', status === 'active' ? 'Dashcam' : 'First Aid Kit', vm.type === 'Premium' ? 'Leather Seats' : 'Music System'].filter(Boolean),
  }
})
