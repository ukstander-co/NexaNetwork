import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, ShieldCheck, Sparkles, Star, Award, TrendingUp, HelpCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { m as motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import AuthLoadingOverlay from '../components/AuthLoadingOverlay';
// import ukstanderAffiliateBg from '../assets/images/bg_optimized.jpg';
const ukstanderAffiliateBg = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        toast.error(`Server error (${response.status}): ${responseText.slice(0, 120)}...`);
        setStatus('error');
        return;
      }

      if (response.ok) {
        toast.success(data.message || 'Recovery link dispatched!', {
          duration: 4000,
          style: {
            borderRadius: '1rem',
            background: '#0B192C',
            color: '#fff',
            fontSize: '13px'
          }
        });
        setStatus('success');
      } else {
        toast.error(data.error || 'Account not found', {
          style: {
             borderRadius: '1rem',
             fontSize: '13px',
             border: '2px solid #fee2e2'
          }
        });
        setStatus('error');
      }
    } catch (error: any) {
      toast.error(`Connection Failed: ${error?.message || 'Please try again'}`);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen w-full lg:max-h-screen lg:overflow-hidden bg-slate-50 flex flex-col font-sans relative">
      <AuthLoadingOverlay isVisible={status === 'loading'} message="Sending Link" />

      <Helmet>
        <title>Account Recovery | UKStander</title>
        <meta name="description" content="Recover your authentication protocol. Enter your email to receive secure account synchronization credentials." />
      </Helmet>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
        
        {/* Left Side: Branding & Info (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 p-12 xl:p-20 flex-col justify-between relative overflow-hidden bg-[#431407]">
          <div className="absolute inset-0 opacity-20">
            <img src={ukstanderAffiliateBg} alt="Background" fetchPriority="high" className="w-full h-full object-cover mix-blend-overlay grayscale contrast-125 rounded-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#431407] via-[#431407]/80 to-[#7c2d12]/90" />
          </div>
          
          <div className="relative z-10">
            <Logo dark={true} size="text-4xl" />
            <div className="mt-8 space-y-4">
              <span className="px-4 py-2 bg-orange-600 text-white text-xs font-black uppercase tracking-widest rounded-full">
                Secure Recovery Lane
              </span>
              <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight mt-6 font-display">
                Restore<br />
                <span className="text-[#fdba74]">Active Session.</span>
              </h1>
              <p className="text-orange-100/80 text-lg font-medium max-w-lg leading-relaxed mt-4">
                Don't worry, happen to the best of us! Provide your registered account email, and we'll send a secure link to reset your credentials.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
            {[
              { icon: ShieldCheck, title: "256-bit Secure", desc: "Encrypted links" },
              { icon: HelpCircle, title: "24/7 Support", desc: "Always available" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-[#fdba74]" />
                </div>
                <div className="text-white font-bold text-sm">{feature.title}</div>
                <p className="text-orange-200/60 text-xs mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="relative z-10 mt-12 text-orange-200/50 text-sm">
            © {new Date().getFullYear()} UKStander.shop
          </div>
        </div>

        {/* Right Side: Recovery Form (Mobile optimized) */}
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
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-2">Reset Password</h2>
                  <p className="text-slate-500 text-sm font-medium">Enter your email to receive recovery instructions.</p>
                </div>

                {status === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 pt-2"
                  >
                    <div className="bg-green-50 text-green-800 p-5 rounded-2xl border border-green-200 font-bold text-sm leading-relaxed">
                      We have dispatched the reset link to your verfied email address. Please inspect your inbox.
                    </div>
                    <Link 
                      to="/login" 
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all group"
                    >
                      <ArrowLeft className="w-4 h-4 text-orange-500 group-hover:-translate-x-1 transition-transform" /> Return to Login
                    </Link>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        className="w-full bg-[#0B192C] text-white py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
                      >
                        <span>Send Recovery Link</span>
                        <Send className="w-4 h-4 mt-0.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    Remembered your password?{' '}
                    <Link to="/login" className="text-orange-600 font-bold hover:text-orange-700 transition-colors inline-flex items-center">
                      <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Log in
                    </Link>
                  </p>
                </div>
              </div>
              
              {/* Trust Badge Mobile */}
              <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 lg:hidden">
                 <ShieldCheck className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-widest">Account Protected</span>
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}
