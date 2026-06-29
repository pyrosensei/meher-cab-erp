export const revenueData = [
  { month: 'Jan', revenue: 1820000, trips: 2840, expenses: 1240000 },
  { month: 'Feb', revenue: 1950000, trips: 3010, expenses: 1290000 },
  { month: 'Mar', revenue: 2180000, trips: 3350, expenses: 1380000 },
  { month: 'Apr', revenue: 2050000, trips: 3200, expenses: 1320000 },
  { month: 'May', revenue: 2340000, trips: 3580, expenses: 1450000 },
  { month: 'Jun', revenue: 2510000, trips: 3820, expenses: 1520000 },
  { month: 'Jul', revenue: 2680000, trips: 4020, expenses: 1580000 },
  { month: 'Aug', revenue: 2420000, trips: 3720, expenses: 1490000 },
  { month: 'Sep', revenue: 2790000, trips: 4180, expenses: 1630000 },
  { month: 'Oct', revenue: 2950000, trips: 4400, expenses: 1710000 },
  { month: 'Nov', revenue: 3100000, trips: 4650, expenses: 1780000 },
  { month: 'Dec', revenue: 3280000, trips: 4890, expenses: 1850000 },
]

export const weeklyTripData = [
  { day: 'Mon', trips: 145, revenue: 87000 },
  { day: 'Tue', trips: 132, revenue: 79200 },
  { day: 'Wed', trips: 158, revenue: 94800 },
  { day: 'Thu', trips: 142, revenue: 85200 },
  { day: 'Fri', trips: 178, revenue: 106800 },
  { day: 'Sat', trips: 195, revenue: 117000 },
  { day: 'Sun', trips: 168, revenue: 100800 },
]

export const hourlyTripData = Array.from({ length: 24 }, (_, i) => {
  const peakHours = [8, 9, 10, 17, 18, 19, 20]
  const isPeak = peakHours.includes(i)
  const base = isPeak ? 18 : i < 6 ? 3 : 10
  return {
    hour: `${String(i).padStart(2, '0')}:00`,
    trips: base + Math.floor(Math.random() * 8),
  }
})

export const vehicleTypeDistribution = [
  { type: 'Sedan', count: 12, percentage: 48 },
  { type: 'SUV', count: 8, percentage: 32 },
  { type: 'Hatchback', count: 3, percentage: 12 },
  { type: 'Premium', count: 2, percentage: 8 },
]

export const fuelTypeDistribution = [
  { type: 'Petrol', count: 10, color: '#000000' },
  { type: 'Diesel', count: 8, color: '#404040' },
  { type: 'CNG', count: 5, color: '#808080' },
  { type: 'Electric', count: 2, color: '#0EA5E9' },
]

export const driverPerformance = [
  { name: 'Amit K.', trips: 187, rating: 4.9, earnings: 142000 },
  { name: 'Rahul S.', trips: 175, rating: 4.8, earnings: 138000 },
  { name: 'Suresh S.', trips: 168, rating: 4.7, earnings: 131000 },
  { name: 'Vikram V.', trips: 162, rating: 4.6, earnings: 126000 },
  { name: 'Pradeep G.', trips: 158, rating: 4.8, earnings: 122000 },
  { name: 'Manoj Y.', trips: 149, rating: 4.5, earnings: 118000 },
  { name: 'Rajesh C.', trips: 144, rating: 4.7, earnings: 115000 },
  { name: 'Sanjay J.', trips: 139, rating: 4.4, earnings: 110000 },
]

export const fleetHealthData = [
  { status: 'Excellent', count: 10, color: '#10B981' },
  { status: 'Good', count: 8, color: '#6B7280' },
  { status: 'Fair', count: 4, color: '#F59E0B' },
  { status: 'Poor', count: 3, color: '#EF4444' },
]

export const dailyRevenueData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    revenue: Math.floor(70000 + Math.random() * 60000),
    trips: Math.floor(120 + Math.random() * 80),
  }
})

export const paymentMethodData = [
  { method: 'UPI', amount: 1450000, percentage: 45 },
  { method: 'Cash', amount: 970000, percentage: 30 },
  { method: 'Card', amount: 485000, percentage: 15 },
  { method: 'Wallet', amount: 325000, percentage: 10 },
]

export const tripStatusData = [
  { status: 'Completed', count: 4200, percentage: 84 },
  { status: 'Cancelled', count: 400, percentage: 8 },
  { status: 'In Progress', count: 250, percentage: 5 },
  { status: 'Scheduled', count: 150, percentage: 3 },
]
