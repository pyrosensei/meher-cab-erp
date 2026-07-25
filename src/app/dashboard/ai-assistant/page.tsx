'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Send, Bot, User, Copy, RotateCcw, 
  MessageSquare, Lightbulb, 
  TrendingUp, AlertCircle, Check, ExternalLink
} from 'lucide-react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: string[]
}

const suggestedPrompts = [
  { label: "Show me today's fleet performance", icon: TrendingUp },
  { label: "Which drivers have the lowest ratings?", icon: AlertCircle },
  { label: "Predict tomorrow's revenue", icon: Lightbulb },
  { label: "What vehicles need maintenance?", icon: MessageSquare },
]

// Call the real backend API; fall back to a graceful error message
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function sendToAPI(
  message: string,
  history: { role: string; content: string }[]
): Promise<{ reply: string; sources: string[] }> {
  const response = await fetch('/api/v1/chat/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.json()
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  // Track whether backend is reachable (for graceful degradation UI)
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messageIdRef = useRef(0)

  const { scrollYProgress } = useScroll({ container: scrollRef })
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const ballTop = useTransform(scaleY, [0, 1], ["0%", "100%"])

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Check backend health on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then(r => r.ok ? setBackendOnline(true) : setBackendOnline(false))
      .catch(() => setBackendOnline(false))
  }, [])

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const nextMessageId = () => {
    messageIdRef.current += 1
    return `message-${messageIdRef.current}`
  }

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: nextMessageId(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Build history from existing messages for context
    const history = messages.map(m => ({ role: m.role, content: m.content }))

    // Add placeholder assistant message
    const assistantId = nextMessageId()
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      sources: [],
    }])

    try {
      const { reply, sources } = await sendToAPI(text, history)
      // Replace placeholder with real reply
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, content: reply, sources: sources ?? [] } : m
      ))
    } catch {
      // Graceful fallback — never leave empty message
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: "I couldn't connect to the AI service. Make sure the backend is running at `localhost:8000`." }
          : m
      ))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 rounded-tl-3xl bg-white overflow-hidden shadow-inner">
      <div className="p-6 pb-4 border-b border-[var(--border)] shrink-0 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
         <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
               <div className="p-2 bg-slate-900 rounded-lg shadow-md">
                 <Bot className="h-5 w-5 text-white" /> 
               </div>
               Fleet AI Intelligence
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
               Ask questions about your fleet, predict revenue, or get maintenance insights.
            </p>
         </div>
         <div className="flex items-center gap-3">
            {/* Backend status indicator */}
            {backendOnline !== null && (
              <span className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border',
                backendOnline 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              )}>
                <span className={cn('h-1.5 w-1.5 rounded-full', backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
                {backendOnline ? 'AI Connected' : 'Backend Offline'}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => setMessages([])} className="rounded-xl border-[var(--border)] h-9 text-xs shadow-sm hover:shadow-md transition-shadow">
              <RotateCcw className="mr-2 h-3.5 w-3.5" /> Clear Chat
            </Button>
         </div>
      </div>

      <div className="flex-1 relative bg-slate-50 overflow-hidden">
        {/* Animated Scroll Line & Ball — visible only when there are messages */}
        {messages.length > 0 && (
          <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-200 hidden md:block rounded-full z-0 overflow-hidden shadow-inner">
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-slate-800 origin-top h-full rounded-full" 
              style={{ scaleY }}
            />
            <motion.div 
              className="absolute left-1/2 w-4 h-4 bg-slate-900 rounded-full shadow-[0_0_15px_rgba(15,23,42,0.8)] -translate-x-1/2 z-10 border-2 border-white"
              style={{ top: ballTop, y: "-50%" }}
            />
          </div>
        )}

        <div 
           ref={scrollRef}
           className="h-full overflow-y-auto p-6 scroll-smooth relative z-10"
        >
          <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pl-12">
            
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center pt-12 pb-8">
                 <div className="h-20 w-20 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex items-center justify-center mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-50" />
                    <Bot className="h-10 w-10 text-slate-800 relative z-10" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">How can I help you today?</h2>
                 <p className="text-sm text-slate-500 mb-10 text-center max-w-sm">
                    I can analyze fleet performance, predict revenue, and help you make data-driven decisions using live ERP data.
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    {suggestedPrompts.map((prompt, i) => (
                       <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={i}
                       >
                          <Button 
                             variant="outline" 
                             onClick={() => handleSend(prompt.label)}
                             className="w-full justify-start h-auto py-4 px-5 rounded-2xl border-slate-200 bg-white hover:border-slate-800 hover:bg-slate-50 transition-all text-left whitespace-normal shadow-sm hover:shadow-md group"
                          >
                             <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors mr-4 shrink-0">
                                <prompt.icon className="h-4 w-4 text-slate-600" />
                             </div>
                             <span className="text-sm font-semibold text-slate-700">{prompt.label}</span>
                          </Button>
                       </motion.div>
                    ))}
                 </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                 {messages.map((message) => (
                    <motion.div
                       key={message.id}
                       initial={{ opacity: 0, y: 20, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       transition={{ type: "spring", stiffness: 200, damping: 20 }}
                       className={cn(
                          "flex gap-5 w-full",
                          message.role === 'user' ? "justify-end" : "justify-start"
                       )}
                    >
                       {message.role === 'assistant' && (
                          <div className="h-10 w-10 shrink-0 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mt-1 z-10">
                             <Bot className="h-5 w-5 text-slate-700" />
                          </div>
                       )}
                       
                       <div className={cn(
                          "group relative max-w-[85%] sm:max-w-[80%] px-6 py-5 text-sm leading-relaxed shadow-sm",
                          message.role === 'user' 
                             ? "bg-slate-800 text-white rounded-3xl rounded-br-lg shadow-md" 
                             : "bg-white border border-slate-200 text-slate-800 rounded-3xl rounded-bl-lg shadow-sm"
                       )}>
                          {message.role === 'assistant' && message.content === '' ? (
                             // Loading dots while waiting for AI response
                             <div className="flex gap-1 items-center h-5">
                                <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                             </div>
                          ) : (
                             message.role === 'user' ? <p>{message.content}</p> : (
                                <>
                                 <div className="text-sm leading-relaxed">
                                  <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      h3: ({...props}) => <h3 className="font-bold mb-2 uppercase tracking-wide text-xs text-slate-500" {...props} />,
                                      p: ({...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                      strong: ({...props}) => <strong className="font-semibold text-slate-900" {...props} />,
                                      ul: ({...props}) => <ul className="list-none space-y-1 my-2" {...props} />,
                                      li: ({...props}) => (
                                        <li className="flex items-start">
                                          <span className="mr-2.5 text-slate-400 mt-[3px] text-[10px]">●</span>
                                          <span {...props} />
                                        </li>
                                      ),
                                      ol: ({...props}) => <ol className="list-decimal pl-4 space-y-1 my-2" {...props} />
                                    }}
                                  >
                                    {message.content}
                                  </ReactMarkdown>
                                 </div>
                                  {/* RAG source citations */}
                                  {message.sources && message.sources.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                                      {message.sources.map((src, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                                          <ExternalLink className="h-2.5 w-2.5" />
                                          {src.replace('.json', '')}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </>
                             )
                          )}
                          
                          {message.role === 'assistant' && message.content !== '' && !isLoading && (
                             <div className="absolute -bottom-3 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                   size="icon" 
                                   variant="outline" 
                                   className="h-7 w-7 rounded-full bg-white shadow-md border-slate-200"
                                   onClick={() => copyToClipboard(message.id, message.content)}
                                >
                                   {copiedId === message.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-slate-400" />}
                                </Button>
                             </div>
                          )}
                       </div>
                       
                       {message.role === 'user' && (
                          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center mt-1 border border-white shadow-sm z-10">
                             <User className="h-5 w-5 text-slate-500" />
                          </div>
                       )}
                    </motion.div>
                 ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-[var(--border)] z-10 shrink-0 shadow-[0_-4px_20px_rgb(0,0,0,0.02)]">
         <div className="max-w-3xl mx-auto relative flex items-center">
            <Input 
               placeholder="Ask anything about your fleet..." 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(input)}
               disabled={isLoading}
               className="h-14 pl-5 pr-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white text-base shadow-inner focus:shadow-md transition-all duration-300"
            />
            <Button 
               size="icon"
               onClick={() => handleSend(input)}
               disabled={!input.trim() || isLoading}
               className="absolute right-2 h-10 w-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-transform active:scale-95 disabled:opacity-50"
            >
               <Send className="h-4 w-4" />
            </Button>
         </div>
         <p className="text-center text-xs text-slate-400 mt-2 font-medium">
           Powered by NVIDIA NIM · LLaMA 3.1 8B · RAG enabled
         </p>
      </div>
    </div>
  )
}
