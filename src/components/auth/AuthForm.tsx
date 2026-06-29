'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('swetank@meharcabs.com')
  const [password, setPassword] = useState('demo1234')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Domain validation
    const emailDomain = email.split('@')[1]
    if (emailDomain !== 'meharcabs.com') {
      setError("Unauthorized access. Employee portal requires a valid @meharcabs.com corporate email address.")
      return
    }

    if (password.trim() === '') {
      setError("Password cannot be empty.")
      return
    }

    setLoading(true)
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    if (mode === 'signup') {
       // In a real app we'd create the account, here we just simulate it
       setMode('login')
       setLoading(false)
       setError(null)
       alert("Employee verification request sent. You can now login with these credentials.")
       return
    }

    // Success for login
    router.push('/dashboard')
  }

  return (
    <div className="w-full">
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
           {mode === 'login' ? 'Employee Portal' : 'Request Access'}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
           {mode === 'login' 
             ? 'Sign in with your authorized Mehar Cabs credentials.'
             : 'Create a password with your corporate email to verify employee credibility.'
           }
        </p>
      </motion.div>

      <AnimatePresence>
         {error && (
            <motion.div
               initial={{ opacity: 0, height: 0, marginBottom: 0 }}
               animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
               exit={{ opacity: 0, height: 0, marginBottom: 0 }}
               className="mt-6 overflow-hidden"
            >
               <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 flex items-start gap-3 text-sm font-medium">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onSubmit={handleSubmit}
        className={cn("space-y-5", !error && "mt-8")}
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Corporate Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="name@meharcabs.com"
            className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
              {mode === 'login' ? 'Password' : 'Create Password'}
            </Label>
            {mode === 'login' && (
               <button type="button" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
                 Reset password
               </button>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder={mode === 'login' ? 'Enter your password' : 'Choose a secure password'}
              className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 pr-10 text-sm focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5"
        >
          {loading ? (
             <>
               <Loader2 className="mr-2 h-5 w-5 animate-spin" />
               {mode === 'login' ? 'Authenticating...' : 'Verifying...'}
             </>
          ) : (
             <>
               {mode === 'login' ? 'Sign In' : 'Verify Credibility'}
               <ArrowRight className="ml-2 h-5 w-5" />
             </>
          )}
        </Button>

        <div className="text-center pt-2">
           <button 
             type="button"
             onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError(null)
             }}
             className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
           >
              {mode === 'login' 
                 ? "Don't have an account? Request access" 
                 : "Already verified? Sign in"}
           </button>
        </div>
      </motion.form>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
