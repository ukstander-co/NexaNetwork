import React, { useState, useEffect } from 'react';
import { Lock, Mail, User, ArrowRight, LogIn, ShoppingBag, ShieldCheck, Sparkles, TrendingUp, Star, Award, Clock, Heart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import Lottie from 'lottie-react';
import Footer from '../components/Footer';
import AuthLoadingOverlay from '../components/AuthLoadingOverlay';
// @ts-ignore
import ukstanderAffiliateBg from '../assets/images/ukstander_affiliate_bg_1781414243307.jpg';

const SIGNUP_ANIM_URL = "https://lottie.host/5053cfb5-6a56-4c54-a69c-29369f69741e/kZk7B1AEmI.json";

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(SIGNUP_ANIM_URL)
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
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Registration Protocol Initiated. Welcome!', {
          duration: 3000,
          icon: '💎',
          style: {
            borderRadius: '1rem',
            background: '#10B981',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          },
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.error || 'Registration failed', {
           style: {
             borderRadius: '1rem',
             fontWeight: 'bold',
             fontSize: '12px'
           }
        });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('An error occurred during registration.');
    } finally {
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  return (
    <div className="h-screen w-full max-h-screen overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0]/40 to-[#cbd5e1]/30 flex flex-col justify-between font-sans relative">
      <AuthLoadingOverlay isVisible={isSubmitting} message="Initializing Account Protocol" />

      <Helmet>
        <title>Create Account | UKStander - Join the Amazon Best Sellers Curation Hub</title>
        <meta name="description" content="Create an account on UKStander. Browse verified Amazon best sellers and get direct access to affiliate deals without checking separate shops." />
        <meta name="keywords" content="Amazon curation account, sign up UKStander, best sellers affiliate feed, shopping lists" />
      </Helmet>

      {/* Dynamic Background Elements & 3D Interactive Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        
        {/* Deep Glowing 3D Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-10 w-[550px] h-[550px] bg-gradient-to-tr from-[#a7f3d0]/30 to-[#93c5fd]/30 rounded-full blur-[130px] -ml-24 -mt-36" 
        />
        
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [-360, -180, 0],
            x: [0, 50, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-200/30 to-rose-200/30 rounded-full blur-[140px] -mr-32 -mb-32" 
        />

        {/* Diagonal Soft grid overlay for depth */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#0B192C 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
        
        {/* Subtle geometric lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <line x1="90%" y1="0%" x2="10%" y2="100%" stroke="url(#line-grad-signup)" strokeWidth="1" />
          <line x1="100%" y1="30%" x2="0%" y2="70%" stroke="url(#line-grad-signup)" strokeWidth="0.5" strokeDasharray="5,5" />
          <defs>
            <linearGradient id="line-grad-signup" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating 3D Micro Glass-Morphism Widget 1: Free Registration */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, -3, 3, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute top-[15%] right-[8%] hidden xl:flex items-center gap-2.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-lg px-4 py-2.5 rounded-2xl"
        >
          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-md">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none">FREE FOREVER</span>
            <span className="text-[11px] text-slate-800 font-black leading-none block mt-1">Instant Account Access</span>
          </div>
        </motion.div>

        {/* Floating 3D Micro Glass-Morphism Widget 2: Security Lock */}
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, 4, -4, 0] }}
          transition={{ repeat: Infinity, duration: 9, delay: 0.5, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[8%] hidden xl:flex items-center gap-2.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-lg px-4 py-2.5 rounded-2xl"
        >
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none">PEER SECURITY</span>
            <span className="text-[11px] text-slate-800 font-black leading-none block mt-1">GDPR & Privacy Compliant</span>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10 w-full max-w-6xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-8 lg:gap-14 items-center">
          
          {/* Logo, Branding and Amazon curated best sellers focus Layout */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:col-span-6 flex-col justify-center items-start text-left space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-100 animate-pulse">
                Sign Up To Unlock Exclusive Feeds
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl xl:text-4xl font-black text-[#0B192C] tracking-tight leading-tight font-display">
                Create Your Profile<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600">Save Time, Shop Directly</span>
              </h2>
              <p className="text-slate-600 text-sm font-semibold max-w-lg leading-relaxed">
                Why jump from seller to seller individually? Log custom category configurations and unlock our beautifully aggregated best seller updates sent directly from premium Amazon catalogs.
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
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="text-[10px] text-slate-300 font-extrabold tracking-widest leading-none">Verified Secure</h5>
                    <p className="text-[11px] font-bold text-white mt-1 leading-none">ukstander-authorized-node</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-bold tracking-widest text-emerald-400 bg-white/10 rounded px-2 py-1 uppercase leading-none border border-emerald-500/20">UK SECURE</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Secure Signup Panel */}
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
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 total-width" />
            
            <div className="p-6 pb-2 text-center">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: -3 }}
                className="w-14 h-14 bg-[#0B192C] rounded-[1.2rem] flex items-center justify-center mx-auto mb-3 shadow-[0_15px_30px_rgba(11,25,44,0.2)]"
              >
                {animationData ? (
                  <Lottie animationData={animationData} loop={true} className="w-8 h-8" />
                ) : (
                  <ShoppingBag className="w-7 h-7 text-white" />
                )}
              </motion.div>
              
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-[#0B192C] tracking-tighter font-display leading-tight">Create Account</h1>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px]">Join the Consolidated Curation Hub</p>
              </div>
            </div>

            {/* Form Area */}
            <form 
              onSubmit={handleSubmit} 
              className="px-6 pb-6 pt-3 space-y-4"
              aria-label="Secure Registration Form"
            >
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 leading-none">Official Name</label>
                  <div className="relative group/field">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/field:text-[#059669] transition-colors" />
                    <input 
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Jane Cooper"
                      className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 pl-11 pr-5 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#059669]/20 focus:ring-4 focus:ring-[#059669]/5 transition-all outline-none placeholder:text-slate-300 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 leading-none">Account Email</label>
                  <div className="relative group/field">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/field:text-[#059669] transition-colors" />
                    <input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="hello@domain.com"
                      className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 pl-11 pr-5 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#059669]/20 focus:ring-4 focus:ring-[#059669]/5 transition-all outline-none placeholder:text-slate-300 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-1 leading-none">Authorization Secret</label>
                  <div className="relative group/field">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/field:text-[#059669] transition-colors" />
                    <input 
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 pl-11 pr-5 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#059669]/20 focus:ring-4 focus:ring-[#059669]/5 transition-all outline-none placeholder:text-slate-300 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 pt-1">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0B192C] text-white py-3 rounded-[1.2rem] font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 shadow-[0_12px_24px_rgba(11,25,44,0.25)] hover:shadow-[0_18px_32px_rgba(11,25,44,0.35)] hover:bg-[#152e4f] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer group/btn"
                >
                  <span className="group-hover:mr-1 transition-all">
                    {isSubmitting ? 'Registering...' : 'Activate Account'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="h-px bg-slate-100 flex-1" />
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.25em] whitespace-nowrap">Already registered?</span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>

                <Link 
                  to="/login" 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-[1.2rem] border-2 border-slate-50 text-slate-400 font-extrabold text-[9px] uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-emerald-600 transition-all cursor-pointer shadow-sm"
                >
                  Sign Into Existing Account <LogIn className="w-3.5 h-3.5 text-emerald-500" />
                </Link>
              </div>
            </form>

            {/* Bottom Accent Panel */}
            <div className="bg-[#0B192C] p-4 flex items-center justify-between border-t border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
               <div className="flex items-center gap-3 relative z-10">
                 <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shadow-glow animate-pulse" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8.5px] font-black text-white uppercase tracking-widest">AMAZON ACCREDITED</span>
                    <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest">Active Curation Feeds</span>
                 </div>
               </div>
               <div className="flex items-center gap-2 relative z-10 opacity-50 hover:opacity-100 transition-opacity">
                 <Sparkles className="w-3 h-3 text-emerald-400" />
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
