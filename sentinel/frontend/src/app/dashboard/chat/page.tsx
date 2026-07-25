"use client";

import { useState, useRef, useEffect } from "react";
import { getToken } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Bot, User, Send, ServerCrash, 
  Activity, Zap, AlertTriangle, FileText,
  AlertCircle
} from "lucide-react";

interface Turn {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  error?: boolean;
}

const SUGGESTIONS = [
  { icon: ServerCrash, text: "What errors happened in the last 5 minutes?" },
  { icon: Activity, text: "Summarize recent system activity" },
  { icon: Zap, text: "What is the average CPU usage?" },
  { icon: AlertTriangle, text: "Are there any warnings I should know about?" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check health on mount
    fetch("/api/health")
      .then(r => setIsBackendHealthy(r.ok))
      .catch(() => setIsBackendHealthy(false));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (overrideInput?: string) => {
    const text = overrideInput || input;
    if (!text.trim() || isLoading) return;

    setInput("");
    
    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const token = getToken();
      const res = await fetch("/api/v1/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text,
          // exclude sources/errors from history payload
          history: messages.filter(m => !m.error).map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to reach AI service");
      }

      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.reply,
        sources: data.sources
      }]);
      
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: err.message || "Couldn't reach the AI service — check that the backend is running on localhost:8000 and the NVIDIA API key is set.",
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Intelligence</h2>
          <p className="text-sm text-muted-foreground">Ask questions about your telemetry data in plain English</p>
        </div>
        {isBackendHealthy !== null && (
          <Badge 
            variant={isBackendHealthy ? "emerald" : "amber"} 
            className="gap-1.5 px-3 py-1 shadow-sm"
          >
            {isBackendHealthy && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
            {isBackendHealthy ? "AI Connected" : "Backend Offline"}
          </Badge>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden shadow-lg border-border/50">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8"
              >
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-white border border-border rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <Bot className="h-8 w-8 text-sky-500" />
                  </div>
                  <h3 className="text-xl font-semibold">How can I help you monitor today?</h3>
                  <p className="text-muted-foreground">I analyze live logs and metrics to answer your questions.</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3 w-full">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      onClick={() => handleSubmit(s.text)}
                      className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl shadow-sm hover:shadow hover:border-sky-200 transition-all text-left group"
                    >
                      <div className="p-2 bg-sky-50 rounded-lg group-hover:bg-sky-100 transition-colors">
                        <s.icon className="h-4 w-4 text-sky-600" />
                      </div>
                      <span className="text-sm font-medium text-foreground leading-snug">{s.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center shadow-sm ${
                      m.role === "user" ? "bg-foreground text-background" : "bg-white border border-border text-sky-500"
                    }`}>
                      {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    
                    <div className="flex flex-col max-w-[80%]">
                      <div className={`px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${
                        m.role === "user" 
                          ? "bg-foreground text-background rounded-3xl rounded-tr-sm" 
                          : m.error 
                            ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-3xl rounded-tl-sm flex items-start gap-2"
                            : "bg-white border border-border rounded-3xl rounded-tl-sm prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-50 prose-pre:border"
                      }`}>
                        {m.error && <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />}
                        {m.role === "assistant" && !m.error ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content}
                          </ReactMarkdown>
                        ) : (
                          m.content
                        )}
                      </div>
                      
                      {/* Source Citations */}
                      {m.sources && m.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2 ml-2">
                          {m.sources.map((src, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-border rounded-full text-[11px] text-muted-foreground shadow-sm">
                              <FileText className="h-3 w-3" />
                              {src}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-white border border-border text-sky-500 flex items-center justify-center shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-border rounded-3xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-1">
                      <motion.div className="h-2 w-2 bg-sky-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.div className="h-2 w-2 bg-sky-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.div className="h-2 w-2 bg-sky-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </div>
                  </motion.div>
                )}
                <div ref={endRef} className="h-2" />
              </div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-4 bg-white border-t border-border">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="relative max-w-4xl mx-auto flex items-center"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the system..."
              className="pr-12 h-12 rounded-2xl shadow-sm border-border focus-visible:ring-sky-500"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-1 h-10 w-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-none transition-transform active:scale-95 disabled:bg-slate-200"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
