'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, MapPin, Gauge } from 'lucide-react'
import { AuthForm } from '@/components/auth/AuthForm'

const CAR_IMAGES = ['/car1.png', '/car2.png', '/car3.png', '/car4.png']

export default function LoginPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAR_IMAGES.length)
    }, 5000) // Change image every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Cinematic Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden bg-slate-950"
      >
        {/* Subtle animated background gradients instead of stretched image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
           <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-slate-800/40 blur-[120px]" />
           <div className="absolute top-[60%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[100px]" />
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1 shadow-lg overflow-hidden">
              <img src="/logo.png" alt="Mehar Cab Services" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">Mehar Cab Services</span>
          </div>
        </div>

        {/* Car Showcase - Floating Aspect Ratio Container */}
        <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-8">
           <div className="relative w-full max-w-lg aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm group">
              <AnimatePresence initial={false} mode="wait">
                 <motion.div
                   key={currentImageIndex}
                   initial={{ opacity: 0, scale: 1.05 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ duration: 0.8, ease: 'easeOut' }}
                   className="absolute inset-0 bg-cover bg-center"
                   style={{ backgroundImage: `url("${CAR_IMAGES[currentImageIndex]}")` }}
                 />
              </AnimatePresence>
              {/* Inner glass overlay to blend edges slightly */}
              <div className="absolute inset-0 border border-white/20 rounded-3xl mix-blend-overlay pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
           </div>
           
           {/* Carousel indicators */}
           <div className="flex gap-3 mt-8">
              {CAR_IMAGES.map((_, i) => (
                 <button 
                    key={i} 
                    onClick={() => setCurrentImageIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/30 hover:bg-white/50'}`} 
                 />
              ))}
           </div>
        </div>

        <div className="relative z-10 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl font-bold leading-[1.1] tracking-tight"
          >
            The future of
            <br />
            fleet mobility.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-white/80 max-w-md leading-relaxed drop-shadow-sm"
          >
            Empowering our operations team with real-time tracking, intelligent routing, and unparalleled fleet control.
          </motion.p>

          {/* Interactive Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap gap-3 pt-6"
          >
            {[
              { icon: Car, text: '25 Active Vehicles' },
              { icon: MapPin, text: 'Real-time Tracking' },
              { icon: Gauge, text: 'Performance Analytics' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 text-sm text-white shadow-xl cursor-default transition-colors"
              >
                <feature.icon className="h-4 w-4" />
                {feature.text}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Professional login form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2 relative bg-slate-50"
      >
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
           {/* Subtle background pattern for professional look */}
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                 <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1"/>
                 </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>

        <div className="w-full max-w-[420px] z-10 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden flex justify-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1 border shadow-sm">
                <img src="/logo.png" alt="Mehar Cabs Logo" className="h-full w-full object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight">Mehar Cabs</span>
            </div>
          </div>

          <AuthForm />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium"
          >
            <span>Secured by Mehar IT Systems</span>
            <div className="h-1 w-1 rounded-full bg-slate-300" />
            <span>v2.4.0</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
