import { create } from "zustand";

export interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
  service: string;
}

export interface MetricSnapshot {
  t: string;
  cpu: number;
  mem: number;
}

export interface DashboardStats {
  avg_cpu: number;
  avg_memory: number;
  avg_latency: number;
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
  cpuHistory: MetricSnapshot[];
  
  // Setters for WS push
  setDashboardData: (data: { stats: DashboardStats; recent_logs: LogEntry[]; cpu_history: MetricSnapshot[] }) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  stats: {
    avg_cpu: 0,
    avg_memory: 0,
    avg_latency: 0,
    error_count: 0,
    total_docs: 0,
    last_updated: null,
  },
  recentLogs: [],
  cpuHistory: [],
  
  setDashboardData: (data) => set({
    stats: data.stats,
    recentLogs: data.recent_logs,
    cpuHistory: data.cpu_history,
  }),
}));
