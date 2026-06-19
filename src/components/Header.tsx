import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LogOut, Search, Filter, Star, Clock, User, ChevronDown, MapPin, Menu, ShoppingCart, Zap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTranslation } from '../hooks/useTranslation';
import { apiClient } from '../utils/apiClient';

interface HeaderProps {
  userEmail: string;
  wishlist: string[];
  dynamicCategories?: string[];
  onSearch?: (term: string, category: string) => void;
  onFilterWishlist?: () => void;
  onFilterTopDrops?: () => void;
  initialSearch?: string;
  initialCategory?: string;
}

export default function Header({ 
  userEmail, 
  wishlist, 
  dynamicCategories = ["All Categories"],
  onSearch,
  onFilterWishlist,
  onFilterTopDrops,
  initialSearch = "",
  initialCategory = "All Categories"
}: HeaderProps) {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchBarCategory, setSearchBarCategory] = useState(initialCategory);
  const [searchHistory, setSearchHistory] = useState<string[]>(JSON.parse(localStorage.getItem('searchHistory') || '[]'));
  const [showHistory, setShowHistory] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<any>(null);
  
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const { countryName, flagEmoji, languageCode, changeLanguage, availableLanguages } = useGeolocation();
  const { t } = useTranslation();

  const displayName = useMemo(() => {
    if (userEmail === 'Guest') return 'Sign In';
    try {
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        const parsed = JSON.parse(cachedUser);
        if (parsed && parsed.name) {
          return parsed.name;
        }
      }
    } catch (e) {
      console.error("Error reading user from localStorage", e);
    }
    return userEmail.split('@')[0];
  }, [userEmail]);

  // Search autocomplete timeout logic
  useEffect(() => {
    if (showHistory && searchInput.trim() === '') {
      searchTimeoutRef.current = setTimeout(() => {
        setShowHistory(false);
      }, 3000);
    } else {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [showHistory, searchInput]);

  const trendingQueries = useMemo(() => ['smartphones', 'running shoes', 'laptop stand', 'wireless headphones', 'coffee machine'], []);

  const filteredTrending = useMemo(() => {
    if (!searchInput.trim()) return trendingQueries;
    return trendingQueries.filter(t => t.toLowerCase().includes(searchInput.trim().toLowerCase()));
  }, [searchInput, trendingQueries]);

  const filteredHistory = useMemo(() => {
    if (!searchInput.trim()) return searchHistory;
    return searchHistory.filter(h => h.toLowerCase().includes(searchInput.trim().toLowerCase()));
  }, [searchInput, searchHistory]);

  useEffect(() => {
    apiClient.request('/api/global-settings', { cacheTTL: 60000, useOfflineFallback: true })
      .then(data => setGlobalSettings(data))
      .catch(console.error);
  }, []);

  const headerLinks = useMemo(() => {
    if (globalSettings?.header_links) {
      try {
        return JSON.parse(globalSettings.header_links);
      } catch (e) {
        console.error("JSON parse of header_links failed", e);
      }
    }
    return [
      { label: "My Wishlist", href: "#", isWishlist: true },
      { label: "Today's Deals", href: "#" },
      { label: "Customer Service", href: "/contact" }
    ];
  }, [globalSettings]);

  const headerPromo = globalSettings?.header_promo || "New Releases in UK";

  // Close search history & category dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const newHist = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5);
    setSearchHistory(newHist);
    localStorage.setItem('searchHistory', JSON.stringify(newHist));
  };

  const executeSearch = () => {
    saveSearch(searchInput);
    setShowHistory(false);
    
    if (onSearch) {
      onSearch(searchInput, searchBarCategory);
    } else {
      // If we are not on the search page, navigate to it
      if (searchBarCategory !== "All Categories") {
        navigate(`/category/${encodeURIComponent(searchBarCategory)}?q=${encodeURIComponent(searchInput)}`);
      } else {
        navigate(`/user?q=${encodeURIComponent(searchInput)}`);
      }
    }
  };

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCategorySelect = (category: string) => {
    if (category === "All Categories") {
      navigate('/user');
    } else {
      navigate(`/category/${encodeURIComponent(category)}`);
    }
  };

  return (
    <>
      <header className="bg-slate-950 text-white flex flex-col w-full z-40 sticky top-0 shadow-[0_4px_30px_rgba(0,0,0,0.15)] border-b border-slate-800/45 backdrop-blur-md">
        {/* Top Main Nav */}
        <div className="flex flex-col lg:flex-row items-center px-4 py-2.5 gap-2 lg:gap-6 max-w-[1600px] mx-auto w-full">
          
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            {/* Mobile Menu Toggle (Simplified) - Hidden/Removed in mobile view */}
            <button onClick={() => setIsDrawerOpen(true)} className="hidden p-1 hover:bg-white/10 rounded-md">
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo Section */}
            <div className="flex items-center hover:bg-white/5 rounded-xl px-2.5 cursor-pointer shrink-0 py-1.5 transition-colors border border-transparent hover:border-slate-850" onClick={() => navigate('/user')}>
               <Logo dark={true} size="text-xl md:text-2xl" />
            </div>

            {/* Mobile Only: Quick Icons */}
            <div className="flex lg:hidden items-center gap-3 relative">
              <button onClick={() => { if (onFilterWishlist) onFilterWishlist(); else navigate('/user?wishlist=true'); }} className="relative p-1">
                <Heart className={`w-6 h-6 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1 rounded-full">{wishlist.length}</span>}
              </button>
              <button 
                onClick={() => {
                  if (userEmail === 'Guest') {
                    navigate('/login');
                  } else {
                    setIsMenuOpen(!isMenuOpen);
                  }
                }} 
                className="p-1 text-white hover:text-slate-200 transition-colors"
                id="mobile-avatar-button"
              >
                <User className="w-6 h-6" />
              </button>

              {isMenuOpen && userEmail !== 'Guest' && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 shadow-2xl rounded-xl p-2 z-[60] animate-in fade-in slide-in-from-top-2 text-slate-900 origin-top-right">
                  <div className="px-3 py-2.5 border-b border-slate-100 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userEmail}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 truncate leading-tight">{displayName}</p>
                      <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">{userEmail}</p>
                      <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider mt-1 flex items-center"><Star className="w-2.5 h-2.5 mr-0.5" fill="currentColor"/> Premium</p>
                    </div>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { 
                        if (onFilterWishlist) onFilterWishlist(); 
                        else navigate('/user?wishlist=true'); 
                        setIsMenuOpen(false); 
                      }} 
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center gap-2 rounded-lg"
                    >
                      <Heart className="w-4 h-4 text-red-500" /> Your Wishlist ({wishlist.length})
                    </button>
                    <button 
                      onClick={() => { 
                        navigate('/user/profile'); 
                        setIsMenuOpen(false); 
                      }} 
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center gap-2 rounded-lg scroll-mt-2"
                    >
                      <User className="w-4 h-4 text-slate-400" /> Your Account
                    </button>
                  </div>
                  <div className="h-px bg-slate-100 mx-2"></div>
                  <div className="py-1">
                    <button 
                      onClick={() => { 
                        handleLogout(); 
                        setIsMenuOpen(false); 
                      }} 
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-red-650 transition-colors font-medium flex items-center gap-2 rounded-lg"
                    >
                      <LogOut className="w-4 h-4 text-slate-400" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Location Delivery (Desktop) */}
            <div className="hidden lg:flex items-center h-11 hover:bg-white/5 rounded-xl px-3 cursor-pointer shrink-0 transition-all border border-transparent hover:border-slate-800">
              <MapPin className="w-4.5 h-4.5 mt-0.5 mr-2 text-red-500 animate-pulse" />
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">{t('curated_for')}</span>
                <span className="text-xs font-black text-white truncate max-w-[120px]">{countryName}</span>
              </div>
            </div>
          </div>

          {/* Search Bar - Premium Modern Design */}
          <div className="w-full flex-1 flex h-11 sm:h-12 rounded-full overflow-hidden border border-slate-800 relative focus-within:border-red-500/80 focus-within:shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-slate-900/90 transition-all duration-300 group" ref={searchRef}>
              
             <div className="pl-4 pr-1 sm:pr-2 flex items-center justify-center text-slate-400 group-focus-within:text-red-500 transition-colors">
                <Search className="w-4.5 h-4.5" />
             </div>

             <input 
                type="text" 
                placeholder={t('search_placeholder')} 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setShowHistory(true)}
                onClick={() => setShowHistory(true)}
                onKeyDown={handleSearchSubmit}
                className="flex-1 px-1 sm:px-2 text-white outline-none h-full text-[14px] bg-transparent font-medium placeholder-slate-500 w-full"
             />
             
             {/* Desktop Category Selector */}
             <div className="hidden sm:flex items-center h-[70%] my-auto relative cursor-pointer border-l border-slate-800 hover:bg-slate-800/40 transition-colors group/cat">
               <select 
                 value={searchBarCategory}
                 onChange={(e) => setSearchBarCategory(e.target.value)}
                 className="bg-transparent text-slate-300 text-[12px] font-bold pl-4 pr-8 outline-none cursor-pointer h-full max-w-[150px] appearance-none z-10"
               >
                 {dynamicCategories.map(cat => <option key={cat} value={cat} className="bg-slate-900 text-slate-100">{cat === 'All Categories' ? t('all_categories') : cat}</option>)}
               </select>
               <div className="absolute right-3 top-0 bottom-0 pointer-events-none flex items-center justify-center text-slate-400 group-hover/cat:text-slate-300 transition-colors">
                  <ChevronDown className="w-3.5 h-3.5" />
               </div>
             </div>

             <button onClick={executeSearch} className="hidden sm:flex px-6 items-center justify-center bg-red-650 hover:bg-red-700 text-white transition-all h-full font-bold text-xs uppercase tracking-wider">
                Search
             </button>
             
             {/* Mobile Explicit Search Button */}
             <button onClick={executeSearch} className="sm:hidden pr-3 pl-2 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
                <div className="bg-slate-800 p-1.5 rounded-full">
                  <Search className="w-4 h-4" />
                </div>
             </button>

             {/* Search Autocomplete & Mobile Category Drawer */}
             {showHistory && (
                <div className="fixed inset-x-0 top-[110px] lg:top-[60px] bottom-0 lg:bottom-auto lg:absolute lg:top-[110%] lg:left-0 lg:right-0 bg-white lg:shadow-2xl lg:rounded-2xl lg:py-2.5 lg:border lg:border-slate-200 z-[60] overflow-y-auto w-full shadow-xl">
                  
                  {/* Mobile Only: Categories Drawer View (Compact) */}
                  <div className="block sm:hidden border-b border-slate-100 p-4 bg-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center shrink-0">
                      <Filter className="w-3.5 h-3.5 mr-1.5" /> Department
                    </p>
                    <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
                       {dynamicCategories.map(cat => (
                          <button key={cat} onClick={() => {
                             setSearchBarCategory(cat);
                             handleCategorySelect(cat);
                             setShowHistory(false);
                          }} className="whitespace-nowrap bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-[11px] font-bold hover:border-red-600 hover:text-red-600 transition-all">
                             {cat}
                          </button>
                       ))}
                    </div>
                  </div>

                  <div className="p-2 sm:p-0 text-slate-900">
                  {/* Trending Queries Based on Location */}
                  {filteredTrending.length > 0 && (
                    <>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 mt-2 flex items-center"><Zap className="w-3 h-3 mr-1 text-red-500 animate-bounce" /> Trending in {countryName}</p>
                      {filteredTrending.map((trend) => (
                        <button 
                          key={trend}
                          onClick={() => { 
                             setSearchInput(trend); 
                             setShowHistory(false);
                             if (onSearch) {
                               onSearch(trend, searchBarCategory);
                             } else {
                               navigate(`/user?q=${encodeURIComponent(trend)}`);
                             }
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center group"
                        >
                          <Search className="w-4 h-4 mr-2 text-slate-300 group-hover:text-red-600" /> {trend}
                          <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm group-hover:text-red-600 group-hover:bg-red-50">Hot</span>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Search History */}
                  {filteredHistory.length > 0 && (
                    <>
                      {filteredTrending.length > 0 && <div className="h-px bg-slate-100 my-2 mx-3"></div>}
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 flex items-center mt-2"><Clock className="w-3 h-3 mr-1" /> Recent Searches</p>
                      {filteredHistory.map((hist, i) => (
                        <button 
                          key={i}
                          onClick={() => { 
                            setSearchInput(hist); 
                            setShowHistory(false);
                            if (onSearch) {
                              onSearch(hist, searchBarCategory);
                            } else {
                              navigate(`/user?q=${encodeURIComponent(hist)}`);
                            }
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center"
                        >
                          <Search className="w-3 h-3 mr-2 text-slate-400" /> {hist}
                        </button>
                      ))}
                    </>
                  )}
                  
                  {filteredHistory.length === 0 && filteredTrending.length === 0 && searchInput.trim() !== '' && (
                    <div className="p-4 text-center text-sm text-slate-500">
                      Press enter to search for <span className="font-bold text-slate-700">"{searchInput}"</span>
                    </div>
                  )}
                  </div>
                </div>
             )}
          </div>

          {/* Right Section Icons & Menus */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Language */}
            <div 
              className="flex items-center h-11 hover:bg-white/5 border border-transparent hover:border-slate-850 rounded-xl px-3 cursor-pointer relative transition-all"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            >
              <div className="text-sm font-bold flex items-center text-white select-none">
                <span className="text-[17px] leading-none mr-2">{flagEmoji}</span>
                <span className="uppercase text-[11px] tracking-wider font-extrabold text-slate-300">{languageCode}</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-1 select-none text-slate-400 transition-transform duration-300 ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isLanguageMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 shadow-2xl rounded-xl p-1.5 z-[60] animate-in fade-in zoom-in-95 origin-top-right">
                  <div className="py-1 max-h-60 overflow-y-auto scrollbar-hide flex flex-col gap-0.5">
                    {availableLanguages.map((lang) => (
                      <button 
                        key={lang.code}
                        onClick={(e) => { e.stopPropagation(); changeLanguage(lang.code); setIsLanguageMenuOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between transition-colors rounded-lg ${languageCode === lang.code ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {lang.name}
                        {languageCode === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Account & Dropdown */}
            <div className="relative">
              <div 
                className="flex flex-col leading-tight h-11 hover:bg-white/5 border border-transparent hover:border-slate-850 rounded-xl px-3 cursor-pointer justify-center transition-all" 
                onClick={() => {
                  if (userEmail === 'Guest') {
                    navigate('/login');
                  } else {
                    setIsMenuOpen(!isMenuOpen);
                  }
                }}
              >
                <span className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">
                  {userEmail === 'Guest' ? 'Welcome' : `${t('hello')}`}
                </span>
                <span className="text-xs font-black text-white flex items-center gap-1">
                  {userEmail === 'Guest' ? 'Sign In' : displayName} 
                  {userEmail !== 'Guest' && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </span>
              </div>
              
              {isMenuOpen && userEmail !== 'Guest' && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 shadow-2xl rounded-2xl p-2.5 z-[60] animate-in fade-in slide-in-from-top-2 origin-top-right text-slate-900">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userEmail}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden animate-in fade-in">
                      <p className="text-xs font-extrabold text-slate-800 truncate leading-tight">{displayName}</p>
                      <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">{userEmail}</p>
                      <p className="text-[9px] text-red-600 font-extrabold uppercase tracking-wider mt-1 flex items-center"><Star className="w-2.5 h-2.5 mr-0.5 fill-red-500 text-red-500 animate-pulse"/> Premium Member</p>
                    </div>
                  </div>
                  <div className="py-2 space-y-0.5">
                    <button onClick={() => { if (onFilterWishlist) onFilterWishlist(); else navigate('/user?wishlist=true'); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors font-bold flex items-center rounded-xl">
                      <Heart className="w-4 h-4 mr-2.5 text-red-500" /> Your Wishlist ({wishlist.length})
                    </button>
                    <button onClick={() => navigate('/user/profile')} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors font-bold flex items-center rounded-xl">
                      <User className="w-4 h-4 mr-2.5 text-slate-400" /> Your Account
                    </button>
                  </div>
                  <div className="h-px bg-slate-100 mx-2"></div>
                  <div className="py-1">
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-bold flex items-center rounded-xl">
                      <LogOut className="w-4 h-4 mr-2.5 text-red-500" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Deals */}
            <div className="hidden lg:flex flex-col leading-tight h-11 hover:bg-white/5 border border-transparent hover:border-slate-850 rounded-xl px-3 cursor-pointer justify-center transition-all" onClick={() => { if (onFilterTopDrops) onFilterTopDrops(); else navigate('/user?topdrops=true'); }}>
                <span className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">Today's</span>
                <span className="text-xs font-black text-rose-500 flex items-center gap-1">Top Drops <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500 animate-pulse" /></span>
            </div>

            {/* Wishlist toggle pretending to be the Cart */}
            <div className="flex items-center h-11 bg-red-650 hover:bg-red-700 rounded-xl px-4 cursor-pointer transition-all shadow-md shadow-red-900/10 border border-red-500/20 text-white" onClick={() => { if (onFilterWishlist) onFilterWishlist(); else navigate('/user?wishlist=true'); }}>
                <div className="relative flex items-center justify-center shrink-0">
                   <Heart className={`w-[18px] h-[18px] mr-1.5 ${wishlist.length > 0 ? 'fill-white animate-bounce' : 'text-white'}`} strokeWidth={2.5} />
                   {wishlist.length > 0 && (
                     <span className="absolute -top-[11px] -right-[5px] bg-white text-red-600 text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full border border-red-700">
                       {wishlist.length}
                     </span>
                   )}
                </div>
                <span className="text-xs font-black uppercase tracking-wider hidden xl:block leading-none">Wishlist</span>
            </div>
          </div>
        </div>

        {/* Sub Header / Quick Links */}
        <div className="hidden md:flex bg-slate-900 text-slate-200 items-center px-4 py-2 gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap text-xs shadow-inner [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-b border-slate-800/60 font-semibold uppercase tracking-wider">
          <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-1.5 hover:bg-white/5 px-2.5 py-1 rounded-lg font-black shrink-0 transition-all text-slate-300">
            <Menu className="w-4.5 h-4.5 text-slate-400" /> All
          </button>
          
          {/* Quick Links */}
          {headerLinks.map((link: any, idx: number) => {
            if (link.isWishlist || link.label.toLowerCase().includes('wishlist')) {
              return (
                <span 
                  key={idx} 
                  onClick={() => { if (onFilterWishlist) onFilterWishlist(); else navigate('/user?wishlist=true'); }}
                  className="hover:bg-white/5 px-2.5 py-1 rounded-lg cursor-pointer text-slate-300 hover:text-white transition-all shrink-0"
                >
                  {link.label}
                </span>
              );
            }
            if (link.href && link.href.startsWith('/')) {
              return (
                <span 
                  key={idx}
                  onClick={() => navigate(link.href)}
                  className="hover:bg-white/5 px-2.5 py-1 rounded-lg cursor-pointer text-slate-300 hover:text-white transition-all shrink-0"
                >
                  {link.label}
                </span>
              );
            }
            return (
              <a 
                key={idx} 
                href={link.href || '#'}
                className="hover:bg-white/5 px-2.5 py-1 rounded-lg cursor-pointer text-slate-300 hover:text-white transition-all shrink-0"
              >
                {link.label}
              </a>
            );
          })}

          {/* Popular Categories Only */}
          {dynamicCategories.filter(cat => 
            cat !== 'All Categories' && 
            ['Electronics', 'Home & Kitchen', 'Computers', 'Health & Beauty'].includes(cat)
          ).slice(0, 4).map(cat => (
            <span key={cat} onClick={() => handleCategorySelect(cat)} className="hover:bg-white/5 px-2.5 py-1 rounded-lg cursor-pointer text-slate-400 hover:text-white transition-all shrink-0">
              {cat}
            </span>
          ))}

          <span className="hover:bg-white/5 px-3 py-1 rounded-lg cursor-default text-red-400 font-extrabold hidden md:inline-block ml-auto normal-case tracking-normal">
            {headerPromo}
          </span>
        </div>

        {/* Mobile-Only Horizontal Scroll of Categories (Pill-styled) - Compressed to a beautiful tiny Category Selector Dropdown */}
        <div className="md:hidden bg-slate-50 border-b border-slate-200/50 py-2.5 px-4 flex items-center justify-between">
           <div className="flex items-center gap-1.5 min-w-0">
             <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Category:</span>
             <span className="text-xs font-extrabold text-[#0B192C] bg-[#febd69]/30 border border-[#febd69]/40 px-2.5 py-0.5 rounded-full truncate max-w-[160px]">
               {initialCategory === 'All Categories' ? t('all_categories') || 'All Categories' : initialCategory}
             </span>
           </div>
           
           <div className="relative shrink-0" ref={categoryDropdownRef}>
             <button 
               onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
               className="flex items-center gap-1 px-3 py-1.5 bg-[#0B192C] hover:bg-red-700 text-white rounded-full text-xs font-black transition-all shadow-sm shrink-0"
               id="mobile-category-menu"
             >
               <Filter className="w-3.5 h-3.5 text-[#febd69]" />
               <span>Category</span>
               <ChevronDown className={`w-3 h-3 transition-transform duration-300 ml-0.5 ${isCategoryDropdownOpen ? 'rotate-180': ''}`} />
             </button>
             
             {isCategoryDropdownOpen && (
               <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 shadow-2xl rounded-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-slate-900 origin-top-right">
                 <div className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">Select Department</div>
                 <div className="max-h-60 overflow-y-auto space-y-0.5">
                   {dynamicCategories.map((cat) => {
                     const isSelected = initialCategory === cat;
                     return (
                       <button
                         key={cat}
                         onClick={() => {
                           handleCategorySelect(cat);
                           setIsCategoryDropdownOpen(false);
                         }}
                         className={`w-full text-left px-3 py-2 text-xs rounded-xl font-bold transition-all flex items-center justify-between ${
                           isSelected 
                             ? 'bg-blue-50 text-blue-600 border border-blue-100 font-black' 
                             : 'text-slate-700 hover:bg-slate-50'
                         }`}
                       >
                         <span className="truncate">{cat === 'All Categories' ? t('all_categories') || 'All Categories' : cat}</span>
                         {isSelected && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 ml-1"></span>}
                       </button>
                     );
                   })}
                 </div>
               </div>
             )}
           </div>
        </div>
      </header>

      {/* Responsive Left Navigation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative flex w-full max-w-xs flex-col bg-[#0B192C] text-white p-6 shadow-2xl animate-in slide-in-from-left duration-300 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <Logo dark={true} size="text-xl" />
              <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">×</button>
            </div>

            <div className="flex items-center gap-2 px-1 text-slate-300 mb-4">
              <MapPin className="w-4 h-4 text-[#febd69]" />
              <span className="text-xs font-bold">{countryName} delivery active</span>
            </div>

            <div className="mb-6 relative">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter'){ executeSearch(); setIsDrawerOpen(false); } }}
                className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-[#febd69] text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              
              {searchHistory.length > 0 && (
                <div className="mt-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">Recent Searches</span>
                  <div className="flex flex-col gap-1">
                    {searchHistory.filter(h => h.toLowerCase().includes(searchInput.toLowerCase())).slice(0, 4).map((hist, idx) => (
                      <button
                        key={`mob-hist-${idx}`}
                        className="text-left px-2 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md flex items-center gap-2 group transition-colors"
                        onClick={() => {
                          setSearchInput(hist);
                          setTimeout(() => { executeSearch(); setIsDrawerOpen(false); }, 50);
                        }}
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#febd69]" />
                        <span className="truncate">{hist}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-2">Shop Curation Department</span>
            {dynamicCategories.map(cat => (
              <button 
                key={cat} 
                onClick={() => {
                  handleCategorySelect(cat);
                  setIsDrawerOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/5 text-slate-200 transition-colors flex items-center"
              >
                {cat}
              </button>
            ))}

            <div className="h-px bg-white/10 my-4"></div>

            <button 
              onClick={() => { if (onFilterWishlist) onFilterWishlist(); else navigate('/user?wishlist=true'); setIsDrawerOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/5 text-rose-400 font-bold transition-colors flex items-center gap-2"
            >
              <Heart className="w-4 h-4" /> My Wishlist ({wishlist.length})
            </button>

            <button 
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 text-red-400 font-bold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
