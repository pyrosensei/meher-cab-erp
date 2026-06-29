export interface Trip {
  id: string
  driverId: string
  driverName: string
  vehicleId: string
  vehicleNumber: string
  customerId: string
  customerName: string
  customerPhone: string
  pickup: { address: string; lat: number; lng: number }
  drop: { address: string; lat: number; lng: number }
  status: 'completed' | 'in-progress' | 'scheduled' | 'cancelled'
  fare: number
  distance: number
  duration: number
  startTime: string
  endTime: string | null
  paymentMethod: 'cash' | 'upi' | 'card' | 'wallet'
  rating: number | null
  vehicleType: 'Sedan' | 'SUV' | 'Hatchback' | 'Premium'
}

const pickupDropLocations = [
  { address: 'IGI Airport T3, Delhi', lat: 28.5562, lng: 77.1000 },
  { address: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167 },
  { address: 'India Gate, Delhi', lat: 28.6129, lng: 77.2295 },
  { address: 'Hauz Khas Village, Delhi', lat: 28.5494, lng: 77.2001 },
  { address: 'Saket Select City Walk, Delhi', lat: 28.5286, lng: 77.2189 },
  { address: 'Dwarka Sector 21, Delhi', lat: 28.5523, lng: 77.0580 },
  { address: 'Rohini Sector 11, Delhi', lat: 28.7334, lng: 77.1116 },
  { address: 'Nehru Place, Delhi', lat: 28.5491, lng: 77.2533 },
  { address: 'Lajpat Nagar Market, Delhi', lat: 28.5694, lng: 77.2432 },
  { address: 'Rajouri Garden, Delhi', lat: 28.6492, lng: 77.1231 },
  { address: 'Cyber Hub, Gurugram', lat: 28.4945, lng: 77.0889 },
  { address: 'DLF Mall of India, Noida', lat: 28.5675, lng: 77.3260 },
  { address: 'Atta Market, Noida Sector 18', lat: 28.5707, lng: 77.3219 },
  { address: 'Huda City Centre, Gurugram', lat: 28.4595, lng: 77.0266 },
  { address: 'Golf Course Road, Gurugram', lat: 28.4449, lng: 77.1013 },
  { address: 'Indirapuram, Ghaziabad', lat: 28.6411, lng: 77.3640 },
  { address: 'Greater Kailash 1, Delhi', lat: 28.5494, lng: 77.2434 },
  { address: 'Vasant Kunj Mall, Delhi', lat: 28.5207, lng: 77.1562 },
  { address: 'Chandni Chowk, Delhi', lat: 28.6506, lng: 77.2334 },
  { address: 'Pitampura, Delhi', lat: 28.7027, lng: 77.1461 },
  { address: 'Karol Bagh Market, Delhi', lat: 28.6519, lng: 77.1901 },
  { address: 'Pragati Maidan, Delhi', lat: 28.6171, lng: 77.2506 },
  { address: 'Red Fort, Delhi', lat: 28.6562, lng: 77.2410 },
  { address: 'Lotus Temple, Delhi', lat: 28.5535, lng: 77.2588 },
  { address: 'Qutub Minar, Delhi', lat: 28.5244, lng: 77.1855 },
  { address: 'Janakpuri, Delhi', lat: 28.6219, lng: 77.0846 },
  { address: 'Mayur Vihar Phase 1, Delhi', lat: 28.5921, lng: 77.2976 },
  { address: 'Vasant Vihar, Delhi', lat: 28.5600, lng: 77.1597 },
  { address: 'Ambience Mall, Gurugram', lat: 28.5043, lng: 77.0963 },
  { address: 'New Delhi Railway Station', lat: 28.6424, lng: 77.2195 },
]

const customerFirstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Muhammad', 'Sai',
  'Ananya', 'Diya', 'Priya', 'Neha', 'Pooja', 'Shreya', 'Kavya', 'Riya',
  'Ishaan', 'Kabir', 'Dhruv', 'Arnav', 'Meera', 'Aisha', 'Tara', 'Zara',
  'Rohan', 'Krish', 'Dev', 'Raj', 'Simran', 'Nisha',
]

const customerLastNames = [
  'Chopra', 'Malhotra', 'Khanna', 'Mehra', 'Kohli', 'Bajaj', 'Tandon', 'Grover',
  'Chawla', 'Bedi', 'Sahni', 'Luthra', 'Walia', 'Ahuja', 'Oberoi', 'Khurana',
  'Dhawan', 'Nair', 'Menon', 'Pillai', 'Rao', 'Hegde', 'Kulkarni', 'Deshmukh',
  'Jain', 'Agarwal', 'Bansal', 'Garg', 'Mittal', 'Gupta',
]

const driverNames = [
  'Amit Kumar', 'Rahul Singh', 'Suresh Sharma', 'Vikram Verma', 'Pradeep Gupta',
  'Manoj Yadav', 'Rajesh Chauhan', 'Sanjay Joshi', 'Deepak Pandey', 'Arun Mishra',
  'Vinod Tiwari', 'Ramesh Rawat', 'Naveen Negi', 'Rohit Malik', 'Sunil Saini',
  'Ajay Choudhary', 'Prakash Thakur', 'Ravi Bhat', 'Ashok Reddy', 'Vikas Iyer',
  'Dinesh Mehta', 'Mukesh Patel', 'Santosh Srivastava', 'Bharat Dwivedi', 'Gopal Saxena',
  'Kishan Agarwal', 'Mohan Kapoor', 'Naresh Sethi', 'Pawan Arora', 'Tarun Batra',
]

const paymentMethods: Trip['paymentMethod'][] = ['cash', 'upi', 'upi', 'card', 'wallet']
const vehicleTypes: Trip['vehicleType'][] = ['Sedan', 'Sedan', 'SUV', 'Hatchback', 'Premium']
const statuses: Trip['status'][] = ['completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'in-progress', 'scheduled', 'cancelled']

function generatePhone(): string {
  const prefixes = ['98', '99', '97', '96', '95', '88', '87']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const rest = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
  return `+91 ${prefix}${rest}`
}

export const trips: Trip[] = Array.from({ length: 300 }, (_, i) => {
  const pickupIdx = Math.floor(Math.random() * pickupDropLocations.length)
  let dropIdx = Math.floor(Math.random() * pickupDropLocations.length)
  while (dropIdx === pickupIdx) dropIdx = Math.floor(Math.random() * pickupDropLocations.length)

  const driverIdx = Math.floor(Math.random() * 30)
  const status = statuses[i % statuses.length]
  const distance = Number((3 + Math.random() * 35).toFixed(1))
  const duration = Math.floor(distance * (2.5 + Math.random() * 2))
  const fare = Math.floor(distance * (12 + Math.random() * 8) + 50)
  const daysAgo = Math.floor(Math.random() * 90)
  const startTime = new Date(Date.now() - daysAgo * 86400000 - Math.floor(Math.random() * 86400000))

  const cfn = customerFirstNames[Math.floor(Math.random() * customerFirstNames.length)]
  const cln = customerLastNames[Math.floor(Math.random() * customerLastNames.length)]

  return {
    id: `TRP-${String(i + 1).padStart(4, '0')}`,
    driverId: `DRV-${String(driverIdx + 1).padStart(3, '0')}`,
    driverName: driverNames[driverIdx],
    vehicleId: `VEH-${String(Math.min(driverIdx + 1, 25)).padStart(3, '0')}`,
    vehicleNumber: `DL ${Math.floor(Math.random() * 9 + 1)}C ${String(Math.floor(Math.random() * 9000 + 1000))}`,
    customerId: `CUS-${String(i + 1).padStart(4, '0')}`,
    customerName: `${cfn} ${cln}`,
    customerPhone: generatePhone(),
    pickup: pickupDropLocations[pickupIdx],
    drop: pickupDropLocations[dropIdx],
    status,
    fare,
    distance,
    duration,
    startTime: startTime.toISOString(),
    endTime: status === 'completed' ? new Date(startTime.getTime() + duration * 60000).toISOString() : null,
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    rating: status === 'completed' ? Number((3 + Math.random() * 2).toFixed(1)) : null,
    vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
  }
})
