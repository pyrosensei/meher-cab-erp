"use client";

import { useEffect, useRef, useState } from "react";
import { getToken } from "@/lib/auth";
import { useAppStore } from "@/lib/store";

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const setDashboardData = useAppStore((state) => state.setDashboardData);
  const token = getToken();

  useEffect(() => {
    if (!token) return;

    // Use ws:// for http and wss:// for https based on current location
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname === "localhost" ? "localhost:8000" : window.location.host;
    
    // Connect to the WebSocket endpoint on the backend
    ws.current = new WebSocket(`${protocol}//${host}/ws/dashboard?token=${token}`);

    ws.current.onopen = () => setIsConnected(true);
    
    ws.current.onclose = (e) => {
      setIsConnected(false);
      // 4001 indicates auth failure, clear token
      if (e.code === 4001) {
        localStorage.removeItem("sentinel_token");
        window.location.href = "/login";
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.stats && data.recent_logs && data.metric_history) {
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message", err);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [token, setDashboardData]);

  return { isConnected };
}
