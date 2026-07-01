# Mehar Cab ERP — Frontend Analysis

## 1. Complete Page List

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Login page with car carousel and AuthForm |
| `/dashboard` | `src/app/dashboard/page.tsx` | Main dashboard — KPI cards, charts, AI insights |
| `/dashboard/ai-assistant` | `src/app/dashboard/ai-assistant/page.tsx` | AI chatbot with RAG |
| `/dashboard/analytics` | `src/app/dashboard/analytics/page.tsx` | Revenue, trip, and performance analytics |
| `/dashboard/drivers` | `src/app/dashboard/drivers/page.tsx` | Driver list and management |
| `/dashboard/vehicles` | `src/app/dashboard/vehicles/page.tsx` | Vehicle fleet management |
| `/dashboard/trips` | `src/app/dashboard/trips/page.tsx` | Trip history and management |
| `/dashboard/tracking` | `src/app/dashboard/tracking/page.tsx` | Live GPS map tracking |
| `/dashboard/notifications` | `src/app/dashboard/notifications/page.tsx` | Notification centre |
| `/dashboard/reports` | `src/app/dashboard/reports/page.tsx` | Reports section |
| `/dashboard/settings` | `src/app/dashboard/settings/page.tsx` | Settings |
| `/dashboard/profile` | `src/app/dashboard/profile/page.tsx` | User profile |

## 2. Mock Datasets

| Variable | File | TypeScript Type |
|---|---|---|
| `drivers` | `src/data/drivers.ts` | `Driver[]` — 30 records generated procedurally |
| `vehicles` | `src/data/vehicles.ts` | `Vehicle[]` — 25 records from vehicleModels array |
| `trips` | `src/data/trips.ts` | `Trip[]` — 300 records generated procedurally |
| `notifications` | `src/data/notifications.ts` | `Notification[]` — 12 hardcoded records |
| `recentActivity` | `src/data/notifications.ts` | `ActivityItem[]` — 8 hardcoded records |
| `aiResponses` | `src/data/ai-responses.ts` | `Record<string, string>` — 5 keyword-matched responses |
| `revenueData` | `src/data/analytics.ts` | monthly revenue array |
| `weeklyTripData` | `src/data/analytics.ts` | per-day trip and revenue array |
| `fleetHealthData` | `src/data/analytics.ts` | vehicle condition distribution |
| `dailyRevenueData` | `src/data/analytics.ts` | 30-day revenue timeseries |
| `driverPerformance` | `src/data/analytics.ts` | top driver performance array |

## 3. Data Fetching Calls

**None found.** All pages use static mock data imported directly from `src/data/`. No `fetch()`, `axios`, `useSWR`, or `useQuery` calls exist in any component.

The AI chatbot previously simulated streaming with `setInterval`. It has been updated to call `POST /api/v1/chat/`.

## 4. Chatbot Component

- **File:** `src/app/dashboard/ai-assistant/page.tsx`
- **State:** `messages`, `input`, `isLoading`, `copiedId`, `backendOnline`
- **API endpoint:** `POST /api/v1/chat/`
- **Request:** `{ message: string, history: {role, content}[] }`
- **Response:** `{ reply: string, sources: string[] }`
- **Animation:** Framer Motion `useScroll` + `useSpring` drives a timeline ball as you scroll through chat history

## 5. TypeScript Domain Interfaces

### Driver
```ts
interface Driver {
  id: string; name: string; phone: string; email: string; avatar: string;
  rating: number; totalTrips: number; totalEarnings: number;
  status: 'online' | 'on-trip' | 'offline';
  currentTrip: string | null; vehicleId: string | null; vehicleNumber: string | null;
  licenseNumber: string; joinDate: string; address: string; emergencyContact: string;
  documents: { type: string; status: 'verified' | 'pending' | 'expired' }[];
  weeklyEarnings: number[]; completionRate: number; acceptanceRate: number; cancellationRate: number;
}
```

### Vehicle
```ts
interface Vehicle {
  id: string; registrationNumber: string; make: string; model: string; year: number;
  color: string; type: 'Sedan' | 'SUV' | 'Hatchback' | 'Premium';
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
  status: 'active' | 'maintenance' | 'inactive' | 'out-of-service';
  healthScore: number; fuelLevel: number; mileage: number; totalKm: number;
  lastService: string; nextService: string; insuranceExpiry: string; fitnessExpiry: string;
  driverId: string | null; driverName: string | null;
  location: { lat: number; lng: number }; currentSpeed: number; features: string[];
}
```

### Trip
```ts
interface Trip {
  id: string; driverId: string; driverName: string; vehicleId: string; vehicleNumber: string;
  customerId: string; customerName: string; customerPhone: string;
  pickup: { address: string; lat: number; lng: number };
  drop: { address: string; lat: number; lng: number };
  status: 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
  fare: number; distance: number; duration: number; startTime: string; endTime: string | null;
  paymentMethod: 'cash' | 'upi' | 'card' | 'wallet';
  rating: number | null; vehicleType: 'Sedan' | 'SUV' | 'Hatchback' | 'Premium';
}
```

### Notification + ActivityItem
```ts
interface Notification {
  id: string; title: string; message: string;
  type: 'alert' | 'trip' | 'maintenance' | 'system' | 'driver';
  read: boolean; timestamp: string; icon: string; priority: 'high' | 'medium' | 'low';
}
interface ActivityItem {
  id: string; action: string; subject: string; detail: string; timestamp: string;
  type: 'trip' | 'driver' | 'vehicle' | 'system';
}
```
