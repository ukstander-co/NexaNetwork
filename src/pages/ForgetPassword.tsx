import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Send, ShoppingBag, ShieldCheck, Sparkles, Star, Award, TrendingUp, Clock, HelpCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import Lottie from 'lottie-react';
import Footer from '../components/Footer';
import AuthLoadingOverlay from '../components/AuthLoadingOverlay';
// @ts-ignore
import ukstanderAffiliateBg from '../assets/images/ukstander_affiliate_bg_1781414243307.jpg';

const ANIM_URL = "https://lottie.host/5053cfb5-6a56-4c54-a69c-29369f69741e/kZk7B1AEmI.json";

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(ANIM_URL)
      .then(res => {
        if (!res.ok) throw new Error('Fetch failed');
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        }
        throw new Error('Not JSON');
      })
      .then(setAnimationData)
      .catch((err) => {
        console.warn("Lottie loading failed, using fallback icon", err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/auth/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Recovery link dispatched!', {
          duration: 4000,
          style: {
            borderRadius: '1rem',
            background: '#0B192C',
            color: '#fff',
            fontSize: '12px'
          }
        });
        setStatus('success');
      } else {
        toast.error(data.error || 'Node not found', {
          style: {
             borderRadius: '1rem',
             fontSize: '12px'
          }
        });
        setStatus('error');
      }
    } catch (error) {
      console.error("Submission failed", error);
      toast.error('Protocol Sync Failed');
      setStatus('error');
    }
  };

  return (
    <div className="h-screen w-full max-h-screen overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0]/40 to-[#cbd5e1]/30 flex flex-col justify-between font-sans relative text-slate-900">
      <AuthLoadingOverlay isVisible={status === 'loading'} message="Encrypting Protocol Reset" />

      <Helmet>
        <title>Account Recovery | UKStander - Synchronize Authentication</title>
        <meta name="description" content="Recover your authentication protocol. Enter your email to receive secure account synchronization credentials." />
        <meta name="keywords" content="UKStander account recovery, forgot password, authentication sync, secure reset protocol" />
      </Helmet>

      {/* Dynamic Background Elements & 3D Interactive Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        
        {/* Deep Glowing 3D Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 90, 180],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-10 w-[550px] h-[550px] bg-gradient-to-tr from-amber-200/30 to-rose-200/30 rounded-full blur-[135px] -mr-32 -mt-32" 
        />
        
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [180, 90, 0],
            x: [0, 60, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-200/30 to-indigo-200/30 rounded-full blur-[145px] -ml-36 -mb-36" 
        />

        {/* Diagonal Soft grid overlay for depth */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#0B192C 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
        
        {/* Subtle geometric lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="url(#line-grad-forget)" strokeWidth="0.75" strokeDasharray="5,5" />
          <defs>
            <linearGradient id="line-grad-forget" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating 3D Micro Glass-Morphism Widget 1: Help Query */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="slate-widget absolute top-[18%] left-[12%] hidden xl:flex items-center gap-2.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-lg px-4 py-2.5 rounded-2xl"
        >
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-md">
            <HelpCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none">HELP NODE</span>
            <span className="text-[11px] text-slate-800 font-black leading-none block mt-1">24/7 Security Sync</span>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10 w-full max-w-6xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-8 lg:gap-14 items-center">
          
          {/* Logo, Branding and recovery messaging */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:col-span-6 flex-col justify-center items-start text-left space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-amber-100">
                Authorized Recovery Lane
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl xl:text-4xl font-black text-[#0B192C] tracking-tight leading-tight font-display">
                Restore Active Session<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-600 to-red-600">Re-align Security Keys</span>
              </h2>
              <p className="text-slate-600 text-sm font-semibold max-w-lg leading-relaxed">
                Provide your registered account email, and we'll instantly transmit a cryptographically signed link to reset your authorized credentials.
              </p>
            </div>

            {/* Glossy 3D Asset Frame */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full aspect-[4/3] max-w-[400px] rounded-[2.5rem] overflow-hidden border border-white/50 shadow-[0_30px_60px_rgba(0,0,0,0.08)] bg-white/70 backdrop-blur-md p-2.5 self-start"
            >
              <img 
                src={ukstanderAffiliateBg} 
                alt="UKStander Amazon Best Sellers Graphic" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[2rem] select-none scale-105"
              />
              {/* Inner floating widget */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#0B192C]/95 backdrop-blur-md rounded-2.5xl p-4 flex items-center justify-between text-white border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                    <ShieldCheck className="w-4.5 h-4.5 text-amber-400" />
                  </div>
                  <div>
                    <h5 className="text-[10px] text-slate-300 font-extrabold tracking-widest leading-none">Security Service</h5>
                    <p className="text-[11px] font-bold text-white mt-1 leading-none">ukstander-restore-service</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-bold tracking-widest text-amber-500 bg-white/10 rounded px-2 py-1 uppercase leading-none border border-amber-500/10">KEYS SYNCED</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Secure Forget Password Panel */}
          <div className="col-span-1 lg:col-span-6 flex justify-center items-center w-full">
            <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 40 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="w-full max-w-[390px]"
            >
          {/* Main 3D Card */}
          <div className="group bg-white/85 backdrop-blur-md border border-white/60 rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.06)] overflow-hidden relative">
            {/* Top Accent Bar */}
            <div className="h-1.5 bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-600 w-full" />
            
            <div className="p-6 pb-2 text-center">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="w-14 h-14 bg-[#0B192C] rounded-[1.2rem] flex items-center justify-center mx-auto mb-3 shadow-[0_15px_30px_rgba(11,25,44,0.2)]"
              >
                {animationData ? (
                  <Lottie animationData={animationData} loop={true} className="w-8 h-8" />
                ) : (
                  <ShoppingBag className="w-7 h-7 text-white" />
                )}
              </motion.div>
              
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-[#0B192C] tracking-tighter font-display leading-tight">Access Recovery</h1>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px]">Provide Registration Secrets</p>
              </div>
            </div>

            {/* Form Area or Success state */}
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 pb-8 text-center space-y-4 pt-4"
              >
                <div className="bg-emerald-50 text-emerald-700 p-5 rounded-[1.2rem] border border-emerald-100 font-bold text-xs leading-relaxed shadow-sm">
                  We have dispatched the synchronization link to your verified email address. Please inspect your inbox.
                </div>
                <Link 
                  to="/login" 
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-100 bg-white text-[#0B192C] font-black text-[9px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all cursor-pointer shadow-sm group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-amber-500" /> Return to Login
                </Link>
              </motion.div>
            ) : (
              <form 
                onSubmit={handleSubmit} 
                className="px-6 pb-6 pt-3 space-y-4"
                aria-label="Secure Reset Email Form"
              >
                <div className="space-y-1">
                  <label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 leading-none">Target Email</label>
                  <div className="relative group/field">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/field:text-amber-500 transition-colors" />
                    <input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="hello@domain.com"
                      className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 pl-11 pr-5 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none placeholder:text-slate-300 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-3.5 pt-1">
                  <button 
                    type="submit"
                    className="w-full bg-[#0B192C] text-white py-3 rounded-[1.2rem] font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 shadow-[0_12px_24px_rgba(11,25,44,0.25)] hover:shadow-[0_18px_32px_rgba(11,25,44,0.35)] hover:bg-[#152e4f] hover:scale-[1.01] active:scale-98 transition-all cursor-pointer group/btn"
                  >
                    <span className="group-hover:mr-1 transition-all">Dispatch Link</span>
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="h-px bg-slate-100 flex-1" />
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.25em] whitespace-nowrap">Remembered access?</span>
                    <div className="h-px bg-slate-100 flex-1" />
                  </div>

                  <Link 
                    to="/login" 
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-[1.2rem] border-2 border-slate-50 text-slate-400 font-extrabold text-[9px] uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-amber-600 transition-all cursor-pointer shadow-sm"
                  >
                    Back to Authentication <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
                  </Link>
                </div>
              </form>
            )}

            {/* Bottom Accent Panel */}
            <div className="bg-[#0B192C] p-4 flex items-center justify-between border-t border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
               <div className="flex items-center gap-3 relative z-10">
                 <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shadow-glow animate-pulse" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8.5px] font-black text-white uppercase tracking-widest">AMAZON ACCREDITED</span>
                    <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest">Active Curation Feeds</span>
                 </div>
               </div>
               <div className="flex items-center gap-2 relative z-10 opacity-50 hover:opacity-100 transition-opacity">
                 <Sparkles className="w-3 h-3 text-amber-500" />
               </div>
            </div>
          </div>
            </motion.div>
          </div>
          
        </div>
      </div>

      <Footer minimal />
    </div>
  );
}
