export interface Notification {
  id: string
  title: string
  message: string
  type: 'alert' | 'trip' | 'maintenance' | 'system' | 'driver'
  read: boolean
  timestamp: string
  icon: string
  priority: 'high' | 'medium' | 'low'
}

export const notifications: Notification[] = [
  {
    id: 'NOT-001',
    title: 'Vehicle Maintenance Due',
    message: 'DL 3C 4521 (Swift Dzire) is due for maintenance service. Schedule before July 15.',
    type: 'maintenance',
    read: false,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    icon: 'wrench',
    priority: 'high',
  },
  {
    id: 'NOT-002',
    title: 'New Trip Assigned',
    message: 'Trip TRP-0287 assigned to Amit Kumar. Pickup from IGI Airport T3.',
    type: 'trip',
    read: false,
    timestamp: new Date(Date.now() - 900000).toISOString(),
    icon: 'map-pin',
    priority: 'medium',
  },
  {
    id: 'NOT-003',
    title: 'Driver Rating Alert',
    message: 'Vikram Verma\'s rating has dropped below 4.0. Review recommended.',
    type: 'driver',
    read: false,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    icon: 'star',
    priority: 'high',
  },
  {
    id: 'NOT-004',
    title: 'Insurance Expiring Soon',
    message: '3 vehicles have insurance expiring within 30 days. Review and renew.',
    type: 'alert',
    read: false,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    icon: 'shield-alert',
    priority: 'high',
  },
  {
    id: 'NOT-005',
    title: 'Daily Report Generated',
    message: 'Yesterday\'s fleet performance report is ready for review.',
    type: 'system',
    read: false,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    icon: 'file-text',
    priority: 'low',
  },
  {
    id: 'NOT-006',
    title: 'Trip Completed',
    message: 'Trip TRP-0285 completed successfully. ₹847 earned. Rating: 4.8★',
    type: 'trip',
    read: true,
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    icon: 'check-circle',
    priority: 'low',
  },
  {
    id: 'NOT-007',
    title: 'Speed Alert',
    message: 'Deepak Pandey exceeded speed limit (92 km/h) near Dwarka Sector 21.',
    type: 'alert',
    read: true,
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    icon: 'gauge',
    priority: 'high',
  },
  {
    id: 'NOT-008',
    title: 'New Driver Onboarded',
    message: 'Tarun Batra has completed onboarding. Documents verified.',
    type: 'driver',
    read: true,
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    icon: 'user-plus',
    priority: 'medium',
  },
  {
    id: 'NOT-009',
    title: 'Fuel Level Low',
    message: 'DL 7C 8923 (Hyundai Creta) fuel level at 12%. Refueling needed.',
    type: 'maintenance',
    read: true,
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    icon: 'fuel',
    priority: 'medium',
  },
  {
    id: 'NOT-010',
    title: 'System Update',
    message: 'Meher Fleet ERP v2.4.1 deployed. New analytics dashboard available.',
    type: 'system',
    read: true,
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    icon: 'settings',
    priority: 'low',
  },
  {
    id: 'NOT-011',
    title: 'Trip Cancelled',
    message: 'Trip TRP-0234 cancelled by customer. No charges applied.',
    type: 'trip',
    read: true,
    timestamp: new Date(Date.now() - 57600000).toISOString(),
    icon: 'x-circle',
    priority: 'low',
  },
  {
    id: 'NOT-012',
    title: 'Weekly Revenue Summary',
    message: 'This week\'s revenue: ₹4,82,350. Up 12% from last week.',
    type: 'system',
    read: true,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    icon: 'trending-up',
    priority: 'medium',
  },
]

export interface ActivityItem {
  id: string
  action: string
  subject: string
  detail: string
  timestamp: string
  type: 'trip' | 'driver' | 'vehicle' | 'system'
}

export const recentActivity: ActivityItem[] = [
  { id: '1', action: 'Trip Completed', subject: 'Amit Kumar', detail: 'CP → IGI Airport T3 • ₹1,240', timestamp: new Date(Date.now() - 120000).toISOString(), type: 'trip' },
  { id: '2', action: 'Driver Online', subject: 'Rahul Singh', detail: 'Rohini Sector 11', timestamp: new Date(Date.now() - 300000).toISOString(), type: 'driver' },
  { id: '3', action: 'New Booking', subject: 'Aarav Chopra', detail: 'Cyber Hub → DLF Mall', timestamp: new Date(Date.now() - 480000).toISOString(), type: 'trip' },
  { id: '4', action: 'Vehicle Serviced', subject: 'DL 3C 4521', detail: 'Regular maintenance completed', timestamp: new Date(Date.now() - 600000).toISOString(), type: 'vehicle' },
  { id: '5', action: 'Trip Started', subject: 'Vikram Verma', detail: 'Karol Bagh → Saket', timestamp: new Date(Date.now() - 900000).toISOString(), type: 'trip' },
  { id: '6', action: 'Rating Received', subject: 'Pradeep Gupta', detail: '★ 4.9 from Neha Malhotra', timestamp: new Date(Date.now() - 1200000).toISOString(), type: 'driver' },
  { id: '7', action: 'Fuel Alert', subject: 'DL 7C 8923', detail: 'Fuel level below 15%', timestamp: new Date(Date.now() - 1500000).toISOString(), type: 'vehicle' },
  { id: '8', action: 'Trip Completed', subject: 'Sanjay Joshi', detail: 'Noida Sec 18 → CP • ₹680', timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'trip' },
]
