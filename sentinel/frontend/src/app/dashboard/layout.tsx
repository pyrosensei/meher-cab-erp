"use client";

import { useAppStore } from "@/lib/store";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth, removeToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Activity, 
  BotMessageSquare, 
  LogOut, 
  Shield, 
  Menu 
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, token } = useAuth();
  const router = useRouter();
  
  // This hook connects to the WebSocket if token is present
  useWebSocket();

  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const pathname = usePathname();

  if (!isLoaded || !token) return null;

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Telemetry", href: "/dashboard/telemetry", icon: Activity, badge: "LIVE" },
    { label: "Intelligence", href: "/dashboard/chat", icon: BotMessageSquare, badge: "AI" },
  ];

  return (
    <div className="flex h-screen w-full bg-secondary/20 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 256 }}
        className="flex-shrink-0 bg-background border-r border-border flex flex-col z-20 relative"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 bg-white border border-border">
              <img src="/logo.png" alt="Meher Cabs" className="h-full w-full object-contain p-0.5" />
            </div>
            {!sidebarCollapsed && <span className="font-bold tracking-tight text-lg">Meher Cabs</span>}
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-hover-bg rounded-lg text-muted-foreground transition-colors absolute right-[-14px] top-[14px] bg-background border border-border shadow-sm z-30"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "relative flex items-center gap-3 px-3 h-10 rounded-xl transition-colors group cursor-pointer",
                  isActive ? "text-sky-600 font-medium" : "text-muted-foreground hover:bg-hover-bg hover:text-foreground"
                )}>
                  {/* Active Indicator Background */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-sky-50 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <item.icon className={cn("h-5 w-5 shrink-0 relative z-10", isActive && "text-sky-500")} />
                  
                  {!sidebarCollapsed && (
                    <span className="relative z-10 flex-1 truncate">{item.label}</span>
                  )}

                  {!sidebarCollapsed && item.badge && (
                    <span className={cn(
                      "relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0",
                      item.badge === "LIVE" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"
                    )}>
                      {item.badge === "LIVE" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-14 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button 
            onClick={() => {
              removeToken();
              router.push("/login");
            }}
            className="flex items-center gap-3 px-3 h-10 w-full rounded-xl text-muted-foreground hover:bg-hover-bg hover:text-foreground transition-colors group relative"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
            {sidebarCollapsed && (
              <div className="absolute left-14 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Nav placeholder / Breadcrumbs */}
        <header className="h-16 flex items-center px-6 border-b border-border bg-background/80 backdrop-blur-sm z-10">
          <div className="font-medium text-sm text-muted-foreground">
            {pathname === "/dashboard" ? "Overview" : 
             pathname === "/dashboard/telemetry" ? "Telemetry Stream" : 
             pathname === "/dashboard/chat" ? "AI Intelligence" : ""}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
