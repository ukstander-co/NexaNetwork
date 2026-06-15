import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, LogIn, ShieldCheck, Sparkles, TrendingUp, Star, Award, Heart, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import AuthLoadingOverlay from '../components/AuthLoadingOverlay';
// @ts-ignore
import ukstanderAffiliateBg from '../assets/images/ukstander_affiliate_bg_1781414243307.jpg';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        toast.error(`Server error (${response.status}): ${responseText.slice(0, 120)}...`);
        setIsSubmitting(false);
        return;
      }
      
      if (response.ok) {
        localStorage.setItem('remembered_email', email);
        localStorage.setItem('remembered_password', password);
        toast.success('Registration Initiated. Welcome!', {
          duration: 3000,
          icon: '💎',
          style: {
            borderRadius: '1rem',
            background: '#10B981',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '13px',
          },
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.error || 'Registration failed', {
           style: {
             borderRadius: '1rem',
             fontWeight: 'bold',
             fontSize: '13px',
             border: '2px solid #fee2e2'
           }
        });
      }
    } catch (error: any) {
      toast.error(`An error occurred: ${error?.message || 'Please try again'}`);
    } finally {
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  return (
    <div className="min-h-screen w-full lg:max-h-screen lg:overflow-hidden bg-slate-50 flex flex-col font-sans relative">
      <AuthLoadingOverlay isVisible={isSubmitting} message="Creating Account" />

      <Helmet>
        <title>Create Account | UKStander</title>
        <meta name="description" content="Create an account on UKStander. Browse verified Amazon best sellers and get direct access to affiliate deals without checking separate shops." />
      </Helmet>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row-reverse w-full max-w-[1600px] mx-auto">
        
        {/* Right Side: Branding & Info (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 p-12 xl:p-20 flex-col justify-between relative overflow-hidden bg-[#052e16]">
          <div className="absolute inset-0 opacity-20">
            <img src={ukstanderAffiliateBg} alt="Background" className="w-full h-full object-cover mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#052e16] via-[#052e16]/80 to-[#042f2e]/90" />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-end">
               <Logo dark={true} size="text-4xl" />
            </div>
            <div className="mt-8 space-y-4 text-right">
              <span className="px-4 py-2 bg-[#10B981] text-white text-xs font-black uppercase tracking-widest rounded-full inline-block">
                Exclusive Deals Await
              </span>
              <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight mt-6 font-display">
                Join the<br />
                <span className="text-[#34d399]">Curation Hub.</span>
              </h1>
              <p className="text-emerald-100/80 text-lg font-medium max-w-lg leading-relaxed mt-4 ml-auto">
                Stop jumping from site to site. We group, verify, and curate the best Amazon finds all in one convenient place. Create your premium profile free forever.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
            {[
              { icon: Heart, title: "Free Forever", desc: "Instant account access" },
              { icon: ShieldCheck, title: "Secure", desc: "Privacy compliant" },
              { icon: TrendingUp, title: "Top Finds", desc: "Hand-picked for you" },
              { icon: Award, title: "Amazon Affiliate", desc: "Authentic tracking" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right flex flex-col items-end">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-[#34d399]" />
                </div>
                <h3 className="text-white font-bold text-sm">{feature.title}</h3>
                <p className="text-emerald-200/60 text-xs mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="relative z-10 mt-12 text-emerald-200/50 text-sm text-right">
            © {new Date().getFullYear()} UKStander.shop
          </div>
        </div>

        {/* Left Side: Signup Form (Mobile optimized) */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 bg-slate-50 relative">
           
           {/* Mobile Top Branding */}
           <div className="w-full flex justify-center mt-4 mb-8 lg:hidden">
             <Logo size="text-3xl" />
           </div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="w-full max-w-[420px]"
           >
              <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-2">Create Account</h2>
                  <p className="text-slate-500 text-sm font-medium">Join the aggregated best-seller ranking hub.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Jane Doe"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                     <label htmlFor="password" className="text-xs font-bold text-slate-700 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0B192C] text-white py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      <span>{isSubmitting ? 'Registering...' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4 mt-0.5" />
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    Already registered?{' '}
                    <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors inline-flex items-center">
                      Sign in directly <ChevronRight className="w-3.5 h-3.5 ml-0.5 mt-0.5" />
                    </Link>
                  </p>
                </div>
              </div>
              
              {/* Trust Badge Mobile */}
              <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 lg:hidden">
                 <ShieldCheck className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-widest">Amazon Affiliate Verified</span>
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}
