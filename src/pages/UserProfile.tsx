import React, { useState, useEffect } from 'react';
import { User, Settings, Package, History, Heart, LogOut, Search, Edit3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

export default function UserProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [showDeleteWarn, setShowDeleteWarn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserEmail(user.email);
      setUserName(user.name || user.email.split('@')[0]);
    }
  }, [navigate]);

  useEffect(() => {
    if (userEmail) {
      fetch(`/api/user/settings?email=${encodeURIComponent(userEmail)}`)
        .then(res => res.json())
        .then(data => {
          if (data && typeof data.marketingEmails === 'boolean') {
            setMarketingEmails(data.marketingEmails);
          }
        })
        .catch(console.error);
    }
  }, [userEmail]);

  const handleMarketingToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setMarketingEmails(val);
    setSettingsStatus('Saving preferences...');
    fetch('/api/user/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, marketingEmails: val })
    })
      .then(res => res.json())
      .then(() => {
        setSettingsStatus('Preferences updated successfully!');
        setTimeout(() => setSettingsStatus(''), 3000);
      })
      .catch(err => {
        console.error(err);
        setSettingsStatus('Error saving preferences');
      });
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    fetch('/api/user/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete account");
        return res.json();
      })
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('wishlist');
        localStorage.removeItem('searchHistory');
        navigate('/login');
      })
      .catch(err => {
        console.error(err);
        alert("Failed to delete account. Please try again.");
        setIsDeleting(false);
        setShowDeleteWarn(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-[#0B192C] text-white py-4 px-6 border-b border-white/10 sticky top-0 z-10 flex justify-between items-center shadow-md">
        <Logo dark={true} size="text-2xl" />
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold hover:text-red-400 transition-colors bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 bg-white md:bg-white shadow-sm border border-slate-200 md:border-slate-200 rounded-3xl p-4 md:p-6 self-start md:sticky md:top-24">
           {/* Profile Header - Hide on mobile */}
           <div className="hidden md:flex flex-col items-center mb-8 border-b border-slate-100 pb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-lg mb-4">
                 {(userName || userEmail).charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-slate-900 truncate w-full text-center">{userName || userEmail.split('@')[0]}</h2>
              <p className="text-xs text-slate-500 truncate w-full text-center mt-1">{userEmail}</p>
           </div>
           
           {/* Horizontal scroll tab bar on mobile, vertical list on desktop */}
           <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0 scrollbar-none snap-x pointer-events-auto">
              {[
                { id: 'profile', icon: User, label: 'Details' },
                { id: 'history', icon: History, label: 'History' },
                { id: 'searches', icon: Search, label: 'Searches' },
                { id: 'wishlist', icon: Heart, label: 'Wishlist' },
                { id: 'settings', icon: Settings, label: 'Settings' }
              ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-full md:rounded-xl transition-all font-semibold text-xs md:text-sm shrink-0 snap-center border ${activeTab === tab.id ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-slate-600 bg-white hover:bg-slate-50 border-slate-200 md:border-transparent'}`}
                 >
                    <tab.icon className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                 </button>
              ))}
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-full md:rounded-xl transition-all font-semibold text-xs md:text-sm shrink-0 snap-center border text-red-650 bg-white hover:bg-red-50 border-red-200 md:border-transparent md:mt-4"
              >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" /> <span>Sign Out</span>
              </button>
           </nav>
        </aside>

        {/* Content Area */}
        <section className="flex-1 bg-white shadow-sm border border-slate-200 rounded-3xl p-6 md:p-8 min-h-[400px]">
           {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Account Details</h2>
                 
                 <div className="space-y-6 max-w-md">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                       <div className="flex items-center bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl">
                          <span className="flex-1 text-slate-600 font-medium truncate">{userEmail}</span>
                       </div>
                    </div>
                    
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                       <div className="flex items-center bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl relative group cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white">
                          <input type="password" value="********" readOnly className="bg-transparent flex-1 outline-none text-slate-600 font-medium" />
                          <button className="text-sm text-blue-600 font-bold px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors opacity-0 group-hover:opacity-100 absolute right-2 flex items-center">
                            <Edit3 className="w-3 h-3 mr-1" /> Update
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Browsing History</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Simulated history items */}
                    <div className="border border-slate-100 rounded-xl p-3 flex gap-3 items-center group cursor-pointer hover:border-blue-200">
                       <div className="w-16 h-16 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                         <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" alt="Shoes" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600">Premium Running Shoes</h4>
                         <span className="text-xs text-slate-500">Viewed yesterday</span>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'searches' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Search History</h2>
                 <ul className="space-y-2 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                    {['smartphones under 500', 'wireless headphones', 'coffee machine', 'running shoes'].map((term, i) => (
                       <li key={i} className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-slate-100 hover:border-blue-200 cursor-pointer group">
                          <span className="flex items-center text-sm font-medium text-slate-700 group-hover:text-blue-600 truncate"><Search className="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500" /> {term}</span>
                          <button className="text-xs text-slate-400 hover:text-red-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                       </li>
                    ))}
                 </ul>
              </div>
           )}

           {activeTab === 'wishlist' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Your Wishlist</h2>
                 <p className="text-slate-500">You can view and manage your full wishlist from the main shop dashboard.</p>
                 <button onClick={() => navigate('/user')} className="mt-4 text-blue-600 font-bold hover:underline flex items-center text-sm">
                    Go to Shop Dashboard <LogOut className="w-4 h-4 ml-1 rotate-180" />
                 </button>
              </div>
           )}

           {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 font-sans tracking-tight">Account Settings</h2>
                 
                 {settingsStatus && (
                    <div className="mb-4 text-xs font-semibold px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-2 animate-pulse">
                       <span>●</span> {settingsStatus}
                    </div>
                 )}

                 <div className="space-y-4 max-w-lg">
                    <div className="p-4 border border-slate-200 rounded-xl flex items-start justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors">
                       <div className="pr-2">
                          <h4 className="font-bold text-slate-800 text-sm">Marketing Emails</h4>
                          <p className="text-xs text-slate-500 mt-1">Receive alerts for top drops and personalized recommendations.</p>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={marketingEmails}
                            onChange={handleMarketingToggle}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                       </label>
                    </div>
                    
                    {!showDeleteWarn ? (
                       <div className="p-4 border border-red-200 rounded-xl flex items-start justify-between bg-red-50/25 hover:bg-red-50/50 transition-colors w-full">
                          <div className="pr-2">
                             <h4 className="font-bold text-red-800 text-sm">Delete Account</h4>
                             <p className="text-xs text-red-600 leading-relaxed mt-1">Permanently remove your account, wishlist, and curation records.</p>
                          </div>
                          <button 
                            onClick={() => setShowDeleteWarn(true)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors active:scale-95 shrink-0"
                          >
                             Delete Account
                          </button>
                       </div>
                    ) : (
                       <div className="p-5 border border-red-300 rounded-xl bg-gradient-to-br from-red-50 to-white animate-in zoom-in-95 duration-200 shadow-md w-full">
                          <h4 className="font-bold text-red-800 text-sm">⚠️ Extreme Caution Required</h4>
                          <p className="text-xs text-red-700 leading-relaxed mt-2 font-medium">
                             This operation is irreversible. Your active credentials, wishlist additions, search logs, and personalized profile vectors will be wiped from our database immediately.
                          </p>
                          <div className="mt-4 flex gap-3">
                             <button 
                               onClick={handleDeleteAccount}
                               disabled={isDeleting}
                               className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                             >
                                {isDeleting ? "Wiping Records..." : "Yes, Delete Permanently"}
                             </button>
                             <button 
                               onClick={() => setShowDeleteWarn(false)}
                               disabled={isDeleting}
                               className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-250"
                             >
                                Cancel
                             </button>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
