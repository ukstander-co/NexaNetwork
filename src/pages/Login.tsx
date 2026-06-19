import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, UserPlus, ShieldCheck, Sparkles, Star, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import AuthLoadingOverlay from '../components/AuthLoadingOverlay';
// @ts-ignore
import ukstanderAffiliateBg from '../assets/images/ukstander_affiliate_bg_1781414243307.jpg';

export default function Login() {
  const [email, setEmail] = useState(() => localStorage.getItem('remembered_email') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('remembered_password') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError, 'Response was:', responseText);
        toast.error(`Server error (${response.status}): ${responseText.slice(0, 120)}...`);
        setIsSubmitting(false);
        return;
      }
      
      if (response.ok) {
        toast.success('Access Granted. Redirecting...', {
           duration: 2000,
           icon: '⚡',
           style: {
             borderRadius: '1rem',
             background: '#0B192C',
             color: '#fff',
             fontWeight: 'bold',
             fontSize: '13px',
           },
         });

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('remembered_email', email);
        localStorage.setItem('remembered_password', password);

        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user');
          }
        }, 1500);
      } else {
        toast.error(data.error || 'Authentication Failed', {
          style: {
            borderRadius: '1rem',
            background: '#fff',
            color: '#0B192C',
            fontWeight: 'bold',
            fontSize: '13px',
            border: '2px solid #fee2e2'
          }
        });
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(`Connection Error: ${error?.message || 'Please try again'}`);
    } finally {
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  return (
    <div className="min-h-screen w-full lg:max-h-screen lg:overflow-hidden bg-slate-50 flex flex-col font-sans relative">
      <AuthLoadingOverlay isVisible={isSubmitting} message="Authenticating" />

      <Helmet>
        <title>Login | UKStander</title>
        <meta name="description" content="Securely sign in to UKStander to access your premium Amazon best sellers and custom affiliate rewards dashboard." />
      </Helmet>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
        
        {/* Left Side: Branding & Info (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 p-12 xl:p-20 flex-col justify-between relative overflow-hidden bg-[#0B192C]">
          <div className="absolute inset-0 opacity-20">
            <img src={ukstanderAffiliateBg} alt="Background" fetchPriority="high" className="w-full h-full object-cover mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/80 to-transparent" />
          </div>
          
          <div className="relative z-10">
            <Logo dark={true} size="text-4xl" />
            <div className="mt-8 space-y-4">
              <span className="px-4 py-2 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-full">
                Amazon Affiliate Integrated
              </span>
              <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight mt-6 font-display">
                Curating the UK's<br />
                <span className="text-[#febd69]">Finest Deals.</span>
              </h1>
              <p className="text-slate-300 text-lg font-medium max-w-lg leading-relaxed mt-4">
                Join thousands of shoppers saving time and money. We verify top ratings and uncover hidden Amazon gems tailored for you.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
            {[
              { icon: Star, title: "Top Rated", desc: "Peer-reviewed items only" },
              { icon: TrendingUp, title: "Price Drops", desc: "Real-time discounts" },
              { icon: Award, title: "Verified", desc: "Amazon affiliate verified" },
              { icon: ShieldCheck, title: "Secure", desc: "Safe browsing hub" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-[#febd69]" />
                </div>
                <div className="text-white font-bold text-sm">{feature.title}</div>
                <p className="text-slate-400 text-xs mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="relative z-10 mt-12 text-slate-400 text-sm">
            © {new Date().getFullYear()} UKStander.shop
          </div>
        </div>

        {/* Right Side: Login Form (Mobile optimized) */}
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
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0B192C] tracking-tight mb-2">Welcome Back</h2>
                  <p className="text-slate-600 text-sm font-medium">Log in to access your curated deals dashboard.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                      <label htmlFor="password" className="text-xs font-bold text-slate-700">Password</label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0B192C] text-white py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4 mt-0.5" />
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    New to UKStander?{' '}
                    <Link to="/signup" className="text-red-600 font-bold hover:text-red-700 transition-colors inline-flex items-center">
                      Create an account <ChevronRight className="w-3.5 h-3.5 ml-0.5 mt-0.5" />
                    </Link>
                  </p>
                </div>
              </div>
              
              {/* Trust Badge Mobile */}
              <div className="mt-8 flex items-center justify-center gap-2 text-slate-600 lg:hidden text-center">
                 <ShieldCheck className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Amazon Affiliate Verified</span>
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}
