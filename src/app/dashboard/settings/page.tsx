'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, Bell, Palette, Shield, Globe, 
  Mail, Smartphone, Moon, Sun, Monitor, Save, Check
} from 'lucide-react'

export default function SettingsPage() {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="space-y-6 pb-10 max-w-4xl">
      <PageHeader 
        title="Settings" 
        description="Manage your account, preferences, and system configuration."
      >
        <Button 
           onClick={handleSave}
           className="rounded-xl bg-[var(--foreground)] text-white hover:bg-[var(--foreground)]/90 h-10 w-32 transition-all"
        >
          {isSaved ? <><Check className="mr-2 h-4 w-4" /> Saved</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
        </Button>
      </PageHeader>

      <motion.div variants={fadeUp} initial="hidden" animate="visible">
         <Tabs defaultValue="general" className="w-full">
            <TabsList className="bg-transparent border-b border-[var(--border)] w-full justify-start h-12 p-0 rounded-none mb-6">
               <TabsTrigger value="general" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--foreground)] rounded-none h-full px-4 text-sm font-medium text-[var(--text-secondary)] data-[state=active]:text-[var(--foreground)]">
                  <Settings className="h-4 w-4 mr-2" /> General
               </TabsTrigger>
               <TabsTrigger value="notifications" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--foreground)] rounded-none h-full px-4 text-sm font-medium text-[var(--text-secondary)] data-[state=active]:text-[var(--foreground)]">
                  <Bell className="h-4 w-4 mr-2" /> Notifications
               </TabsTrigger>
               <TabsTrigger value="appearance" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--foreground)] rounded-none h-full px-4 text-sm font-medium text-[var(--text-secondary)] data-[state=active]:text-[var(--foreground)]">
                  <Palette className="h-4 w-4 mr-2" /> Appearance
               </TabsTrigger>
               <TabsTrigger value="security" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--foreground)] rounded-none h-full px-4 text-sm font-medium text-[var(--text-secondary)] data-[state=active]:text-[var(--foreground)]">
                  <Shield className="h-4 w-4 mr-2" /> Security
               </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 space-y-8 shadow-sm">
                  <div>
                     <h3 className="text-lg font-semibold mb-1">Company Profile</h3>
                     <p className="text-sm text-[var(--text-secondary)]">Manage your business information and contact details.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" defaultValue="Meher Cab Services" className="rounded-xl h-11 bg-slate-50" />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID / GSTIN</Label>
                        <Input id="taxId" defaultValue="07AAAAA0000A1Z5" className="rounded-xl h-11 bg-slate-50 font-mono uppercase" />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Support Email</Label>
                        <Input id="email" defaultValue="support@mehercabs.in" className="rounded-xl h-11 bg-slate-50" />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Support Phone</Label>
                        <Input id="phone" defaultValue="+91 98765 43210" className="rounded-xl h-11 bg-slate-50" />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address">Business Address</Label>
                        <Textarea id="address" defaultValue="Block B, Sector 15, Noida, Uttar Pradesh 201301" className="rounded-xl min-h-[100px] bg-slate-50" />
                     </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--border)]">
                     <h3 className="text-lg font-semibold mb-1">Localization</h3>
                     <p className="text-sm text-[var(--text-secondary)] mb-6">Set your regional preferences.</p>
                     
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Label>Timezone</Label>
                           <Select defaultValue="ist">
                              <SelectTrigger className="rounded-xl h-11 bg-slate-50">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                 <SelectItem value="ist">(UTC+05:30) Indian Standard Time</SelectItem>
                                 <SelectItem value="gmt">(UTC+00:00) Greenwich Mean Time</SelectItem>
                                 <SelectItem value="est">(UTC-05:00) Eastern Standard Time</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Label>Currency</Label>
                           <Select defaultValue="inr">
                              <SelectTrigger className="rounded-xl h-11 bg-slate-50">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                 <SelectItem value="inr">INR (₹) Indian Rupee</SelectItem>
                                 <SelectItem value="usd">USD ($) US Dollar</SelectItem>
                                 <SelectItem value="eur">EUR (€) Euro</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 space-y-8 shadow-sm">
                  <div>
                     <h3 className="text-lg font-semibold mb-1">Communication Channels</h3>
                     <p className="text-sm text-[var(--text-secondary)]">Choose how you want to be notified.</p>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex gap-4 items-start">
                           <Mail className="h-5 w-5 text-[var(--text-secondary)] mt-0.5" />
                           <div>
                              <h4 className="font-medium">Email Notifications</h4>
                              <p className="text-sm text-[var(--text-secondary)]">Receive daily summaries and critical alerts via email.</p>
                           </div>
                        </div>
                        <Switch defaultChecked />
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex gap-4 items-start">
                           <Bell className="h-5 w-5 text-[var(--text-secondary)] mt-0.5" />
                           <div>
                              <h4 className="font-medium">Push Notifications</h4>
                              <p className="text-sm text-[var(--text-secondary)]">In-app popups and browser notifications.</p>
                           </div>
                        </div>
                        <Switch defaultChecked />
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex gap-4 items-start">
                           <Smartphone className="h-5 w-5 text-[var(--text-secondary)] mt-0.5" />
                           <div>
                              <h4 className="font-medium">SMS Alerts</h4>
                              <p className="text-sm text-[var(--text-secondary)]">Only for emergency maintenance and SOS alerts.</p>
                           </div>
                        </div>
                        <Switch />
                     </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--border)] space-y-6">
                     <div>
                        <h3 className="text-lg font-semibold mb-1">Event Triggers</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">Select which events trigger a notification.</p>
                     </div>
                     
                     <div className="space-y-4">
                        {[
                           { label: 'New Trip Bookings', desc: 'When a new trip is scheduled or begins.' },
                           { label: 'Trip Cancellations', desc: 'When a driver or customer cancels a trip.' },
                           { label: 'Vehicle Maintenance Alerts', desc: 'When fuel is low or health score drops.' },
                           { label: 'Document Expiry', desc: '30 days before insurance or fitness expires.' },
                           { label: 'Daily Analytics Digest', desc: 'A morning summary of previous day performance.' },
                        ].map((item, i) => (
                           <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-slate-50/50">
                              <div>
                                 <h4 className="text-sm font-medium">{item.label}</h4>
                                 <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.desc}</p>
                              </div>
                              <Switch defaultChecked={i !== 4} />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 space-y-8 shadow-sm">
                  <div>
                     <h3 className="text-lg font-semibold mb-1">Theme Preferences</h3>
                     <p className="text-sm text-[var(--text-secondary)]">Customize the look and feel of your dashboard.</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                     <button className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-[var(--foreground)] bg-slate-50 gap-3">
                        <Sun className="h-8 w-8" />
                        <span className="text-sm font-medium">Light</span>
                     </button>
                     <button className="flex flex-col items-center justify-center p-6 rounded-2xl border border-[var(--border)] bg-slate-50 gap-3 hover:border-slate-300 transition-colors">
                        <Moon className="h-8 w-8 text-slate-400" />
                        <span className="text-sm font-medium text-slate-500">Dark</span>
                     </button>
                     <button className="flex flex-col items-center justify-center p-6 rounded-2xl border border-[var(--border)] bg-slate-50 gap-3 hover:border-slate-300 transition-colors">
                        <Monitor className="h-8 w-8 text-slate-400" />
                        <span className="text-sm font-medium text-slate-500">System</span>
                     </button>
                  </div>

                  <div className="pt-6 border-t border-[var(--border)] space-y-6">
                     <div>
                        <h3 className="text-lg font-semibold mb-1">Interface Options</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">Fine-tune your layout experience.</p>
                     </div>
                     
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-slate-50/50">
                           <div>
                              <h4 className="text-sm font-medium">Compact Mode</h4>
                              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Reduce spacing in tables and lists to fit more data.</p>
                           </div>
                           <Switch />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-slate-50/50">
                           <div>
                              <h4 className="text-sm font-medium">Reduce Animations</h4>
                              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Disable UI transitions and motion effects.</p>
                           </div>
                           <Switch />
                        </div>
                     </div>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 space-y-8 shadow-sm">
                  <div>
                     <h3 className="text-lg font-semibold mb-1">Account Security</h3>
                     <p className="text-sm text-[var(--text-secondary)]">Manage your password and authentication methods.</p>
                  </div>
                  
                  <div className="max-w-md space-y-4">
                     <div className="space-y-2">
                        <Label>Current Password</Label>
                        <Input type="password" placeholder="••••••••" className="rounded-xl h-11 bg-slate-50" />
                     </div>
                     <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input type="password" placeholder="••••••••" className="rounded-xl h-11 bg-slate-50" />
                     </div>
                     <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input type="password" placeholder="••••••••" className="rounded-xl h-11 bg-slate-50" />
                     </div>
                     <Button variant="outline" className="rounded-xl mt-2 w-full border-[var(--border)]">Update Password</Button>
                  </div>

                  <div className="pt-6 border-t border-[var(--border)] space-y-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-lg font-semibold mb-1">Two-Factor Authentication</h3>
                           <p className="text-sm text-[var(--text-secondary)]">Add an extra layer of security to your account.</p>
                        </div>
                        <Button variant="outline" className="rounded-xl border-[var(--border)]">Enable 2FA</Button>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--border)] space-y-4">
                     <div>
                        <h3 className="text-lg font-semibold mb-1">Active Sessions</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">Devices currently logged into your account.</p>
                     </div>
                     
                     <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                           <div className="flex gap-4 items-center">
                              <Monitor className="h-5 w-5 text-emerald-600" />
                              <div>
                                 <h4 className="text-sm font-medium flex items-center gap-2">Windows 11 • Chrome <Badge className="bg-emerald-500 hover:bg-emerald-600 px-1.5 py-0 h-4 text-[9px] uppercase">Current</Badge></h4>
                                 <p className="text-xs text-[var(--text-secondary)] mt-0.5">Noida, India • IP: 122.161.xx.xx</p>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-slate-50/50">
                           <div className="flex gap-4 items-center">
                              <Smartphone className="h-5 w-5 text-slate-400" />
                              <div>
                                 <h4 className="text-sm font-medium">iOS 17 • Safari</h4>
                                 <p className="text-xs text-[var(--text-secondary)] mt-0.5">Delhi, India • Last active: 2 hours ago</p>
                              </div>
                           </div>
                           <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-8 text-xs font-medium rounded-lg">Revoke</Button>
                        </div>
                     </div>
                  </div>
               </div>
            </TabsContent>
         </Tabs>
      </motion.div>
    </div>
  )
}
