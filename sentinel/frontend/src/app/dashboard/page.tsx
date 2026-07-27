"use client";

import { useAppStore } from "@/lib/store";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Car, Users, Clock, IndianRupee, ServerCrash, Database } from "lucide-react";
import { motion } from "framer-motion";

function KpiCard({ title, value, unit = "", icon: Icon, delay }: { title: string, value: number, unit?: string, icon: any, delay: number }) {
  const animatedValue = useAnimatedCounter(value, { maximumFractionDigits: 1 });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="h-8 w-8 bg-secondary rounded-lg flex items-center justify-center">
            <Icon className="h-4 w-4 text-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {animatedValue}{unit}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Updated just now</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardOverview() {
  const stats = useAppStore((state) => state.stats);
  const metricHistory = useAppStore((state) => state.metricHistory);

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fleet Operations</h2>
          <p className="text-sm text-muted-foreground">Real-time cab fleet telemetry from Delhi NCR</p>
        </div>
        <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-full shadow-sm text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Feed
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Active Trips" value={stats.avg_active_trips} icon={Car} delay={0.1} />
        <KpiCard title="Fleet Health" value={stats.avg_fleet_health} unit="%" icon={Users} delay={0.2} />
        <KpiCard title="Drivers Online" value={stats.avg_drivers_online} icon={Clock} delay={0.3} />
        <KpiCard title="Revenue / Hr" value={stats.avg_revenue_per_hour} unit="₹" icon={IndianRupee} delay={0.4} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Fleet Metrics Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis 
                    dataKey="t" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#737373' }} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#737373' }} 
                    dx={-10}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="active_trips" 
                    name="Active Trips"
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTrips)" 
                    isAnimationActive={false}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="fleet_health" 
                    name="Fleet Health %"
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorHealth)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <KpiCard title="Recent Errors" value={stats.error_count} icon={ServerCrash} delay={0.6} />
        <KpiCard title="Docs Ingested" value={stats.total_docs} icon={Database} delay={0.7} />
      </div>
    </div>
  );
}
