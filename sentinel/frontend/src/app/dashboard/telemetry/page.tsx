"use client";

import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, Info, XOctagon } from "lucide-react";
import { useEffect, useRef } from "react";

export default function TelemetryPage() {
  const recentLogs = useAppStore((state) => state.recentLogs);
  const endOfListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [recentLogs]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live Telemetry</h2>
          <p className="text-sm text-muted-foreground">Streaming logs from the mock container</p>
        </div>
        <Badge variant="emerald" className="gap-1.5 px-3 py-1 text-sm font-medium shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Feed
        </Badge>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col bg-[#0d1117] border-slate-800 shadow-2xl">
        <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2 flex items-center gap-2 text-xs font-mono text-slate-400">
          <Activity className="h-3 w-3" />
          stdout / stderr
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed">
          <AnimatePresence initial={false}>
            {recentLogs.map((log, i) => {
              const isError = log.level === "ERROR";
              const isWarning = log.level === "WARNING";
              
              return (
                <motion.div
                  key={`${log.timestamp}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-3 py-1 border-b border-slate-800/50 last:border-0 ${
                    isError ? 'bg-red-500/10' : isWarning ? 'bg-amber-500/5' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-slate-500 shrink-0 select-none">
                    {log.timestamp.slice(11, 19)}
                  </span>
                  <span className={`shrink-0 w-16 font-semibold flex items-center gap-1.5 ${
                    isError ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-sky-400'
                  }`}>
                    {isError && <XOctagon className="h-3 w-3" />}
                    {isWarning && <AlertTriangle className="h-3 w-3" />}
                    {!isError && !isWarning && <Info className="h-3 w-3" />}
                    {log.level}
                  </span>
                  <span className={`flex-1 ${
                    isError ? 'text-red-100' : isWarning ? 'text-amber-100' : 'text-slate-300'
                  }`}>
                    {log.message}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={endOfListRef} className="h-4" />
        </div>
      </Card>
    </div>
  );
}
