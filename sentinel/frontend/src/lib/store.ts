import { create } from "zustand";

export interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
  service: string;
}

export interface MetricSnapshot {
  t: string;
  active_trips: number;
  fleet_health: number;
  revenue_per_hour: number;
}

export interface DashboardStats {
  avg_active_trips: number;
  avg_fleet_health: number;
  avg_wait_time: number;
  avg_revenue_per_hour: number;
  avg_trip_completion: number;
  avg_drivers_online: number;
  error_count: number;
  total_docs: number;
  last_updated: string | null;
}

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Dashboard Live State
  stats: DashboardStats;
  recentLogs: LogEntry[];
  metricHistory: MetricSnapshot[];
  
  // Setters for WS push
  setDashboardData: (data: { stats: DashboardStats; recent_logs: LogEntry[]; metric_history: MetricSnapshot[] }) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  stats: {
    avg_active_trips: 0,
    avg_fleet_health: 0,
    avg_wait_time: 0,
    avg_revenue_per_hour: 0,
    avg_trip_completion: 0,
    avg_drivers_online: 0,
    error_count: 0,
    total_docs: 0,
    last_updated: null,
  },
  recentLogs: [],
  metricHistory: [],
  
  setDashboardData: (data) => set({
    stats: data.stats,
    recentLogs: data.recent_logs,
    metricHistory: data.metric_history,
  }),
}));
