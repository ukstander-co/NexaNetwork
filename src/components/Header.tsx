import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LogOut, Search, Filter, Star, Clock, User, ChevronDown, MapPin, Menu, ShoppingCart, Zap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTranslation } from '../hooks/useTranslation';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<any>(null);
  
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const { countryName, flagEmoji, languageCode, changeLanguage, availableLanguages } = useGeolocation();
  const { t } = useTranslation();

  useEffect(() => {
    fetch('/api/global-settings')
      .then(res => res.json())
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
      <header className="bg-[#0B192C] text-white flex flex-col w-full z-40 sticky top-0 shadow-lg">
        {/* Top Main Nav */}
        <div className="flex flex-col lg:flex-row items-center px-4 py-2 gap-2 lg:gap-6">
          
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            {/* Mobile Menu Toggle (Simplified) - Hidden/Removed in mobile view */}
            <button onClick={() => setIsDrawerOpen(true)} className="hidden p-1 hover:bg-white/10 rounded-md">
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo Section */}
            <div className="flex items-center hover:outline hover:outline-1 hover:outline-white rounded-sm px-1 cursor-pointer shrink-0 py-1" onClick={() => navigate('/user')}>
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
                      <p className="text-xs font-bold text-slate-800 truncate leading-tight">{userEmail}</p>
                      <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider mt-0.5 flex items-center"><Star className="w-2.5 h-2.5 mr-0.5" fill="currentColor"/> Premium</p>
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
            <div className="hidden lg:flex items-center h-10 hover:outline hover:outline-1 hover:outline-white rounded-sm px-2 cursor-pointer shrink-0">
              <MapPin className="w-4 h-4 mt-2 mr-1 text-slate-300" />
              <div className="flex flex-col leading-tight">
                <span className="text-[12px] text-slate-300 mb-0.5">{t('curated_for')}</span>
                <span className="text-sm font-bold text-white truncate max-w-[120px]">{countryName}</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full flex-1 flex h-10 rounded-full overflow-hidden border border-slate-700/50 relative focus-within:ring-2 focus-within:ring-red-600 bg-white group" ref={searchRef}>
              <select 
                value={searchBarCategory}
                onChange={(e) => setSearchBarCategory(e.target.value)}
                className="hidden sm:block bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2 outline-none border-r border-slate-300 cursor-pointer h-full max-w-[120px] rounded-l-full truncate"
              >
                {dynamicCategories.map(cat => <option key={cat} value={cat}>{cat === 'All Categories' ? t('all_categories') : cat}</option>)}
             </select>
             
             <input 
                type="text" 
                placeholder={t('search_placeholder')} 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setShowHistory(true)}
                onKeyDown={handleSearchSubmit}
                className="flex-1 px-4 text-slate-900 outline-none h-full text-sm rounded-l-full sm:rounded-l-none"
             />
             
             <button onClick={executeSearch} className="bg-red-600 hover:bg-red-700 w-12 flex items-center justify-center transition-colors rounded-r-full">
                <Search className="w-5 h-5 text-white" />
             </button>

             {/* Search Autocomplete & Mobile Category Drawer */}
             {showHistory && (
                <div className="fixed inset-x-0 top-[110px] lg:top-[60px] bottom-0 lg:bottom-auto lg:absolute lg:top-[110%] lg:left-0 lg:right-0 bg-white lg:shadow-2xl lg:rounded-lg lg:py-2 lg:border lg:border-slate-200 z-[60] overflow-y-auto w-full shadow-xl">
                  
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
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 mt-2 flex items-center"><Zap className="w-3 h-3 mr-1 text-red-500" /> Trending in {countryName}</p>
                  {['smartphones', 'running shoes', 'laptop stand', 'wireless headphones', 'coffee machine'].map((trend) => (
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

                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <>
                      <div className="h-px bg-slate-100 my-2 mx-3"></div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 flex items-center mt-2"><Clock className="w-3 h-3 mr-1" /> Recent Searches</p>
                      {searchHistory.map((hist, i) => (
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
                  </div>
                </div>
             )}
          </div>

          {/* Right Section Icons & Menus */}
          <div className="hidden lg:flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Language */}
            <div 
              className="flex items-center h-10 hover:outline hover:outline-1 hover:outline-white rounded-sm px-2 cursor-pointer relative"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            >
              <div className="text-sm font-bold flex items-center text-white select-none">
                <span className="text-lg leading-none mr-1.5">{flagEmoji}</span>
                <span className="uppercase text-xs tracking-wider">{languageCode}</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-1 text-slate-400 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isLanguageMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 shadow-2xl rounded-md p-1.5 z-[60] animate-in fade-in zoom-in-95 origin-top-right">
                  <div className="py-1 max-h-60 overflow-y-auto scrollbar-hide flex flex-col gap-0.5">
                    {availableLanguages.map((lang) => (
                      <button 
                        key={lang.code}
                        onClick={(e) => { e.stopPropagation(); changeLanguage(lang.code); setIsLanguageMenuOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors rounded-sm ${languageCode === lang.code ? 'font-bold text-slate-900 bg-slate-100 border-l-2 border-[#febd69]' : 'text-slate-600 hover:bg-slate-50 border-l-2 border-transparent'}`}
                      >
                        {lang.name}
                        {languageCode === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-[#f3a847]"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Account & Dropdown */}
            <div className="relative">
              <div 
                className="flex flex-col leading-tight h-10 hover:outline hover:outline-1 hover:outline-white rounded-sm px-2 cursor-pointer justify-center" 
                onClick={() => {
                  if (userEmail === 'Guest') {
                    navigate('/login');
                  } else {
                    setIsMenuOpen(!isMenuOpen);
                  }
                }}
              >
                <span className="text-[11px] text-slate-300">
                  {userEmail === 'Guest' ? 'Welcome' : `${t('hello')} ${userEmail.split('@')[0]}`}
                </span>
                <span className="text-sm font-bold text-white flex items-center">
                  {userEmail === 'Guest' ? 'Sign In / Register' : t('account_lists')} 
                  {userEmail !== 'Guest' && <ChevronDown className="w-3 h-3 ml-0.5 mt-0.5 text-slate-400" />}
                </span>
              </div>
              
              {isMenuOpen && userEmail !== 'Guest' && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 shadow-2xl rounded-lg p-2 z-[60] animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userEmail}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-800 truncate leading-tight">{userEmail}</p>
                      <p className="text-[11px] text-red-600 font-bold uppercase tracking-wider mt-0.5 flex items-center"><Star className="w-3 h-3 mr-1" fill="currentColor"/> Premium Member</p>
                    </div>
                  </div>
                  <div className="py-2">
                    <button onClick={() => { if (onFilterWishlist) onFilterWishlist(); else navigate('/user?wishlist=true'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center">
                      <Heart className="w-4 h-4 mr-3 text-red-500" /> Your Wishlist ({wishlist.length})
                    </button>
                    <button onClick={() => navigate('/user/profile')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center">
                      <User className="w-4 h-4 mr-3 text-slate-400" /> Your Account
                    </button>
                  </div>
                  <div className="h-px bg-slate-100 mx-2"></div>
                  <div className="py-2">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium flex items-center">
                      <LogOut className="w-4 h-4 mr-3" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Deals */}
            <div className="hidden lg:flex flex-col leading-tight h-10 hover:outline hover:outline-1 hover:outline-white rounded-sm px-2 cursor-pointer justify-center" onClick={() => { if (onFilterTopDrops) onFilterTopDrops(); else navigate('/user?topdrops=true'); }}>
                <span className="text-[11px] text-slate-300">Today's</span>
                <span className="text-sm font-bold text-white">Top Drops</span>
            </div>

            {/* Wishlist toggle pretending to be the Cart */}
            <div className="flex items-end h-10 hover:outline hover:outline-1 hover:outline-white rounded-sm px-2 cursor-pointer" onClick={() => { if (onFilterWishlist) onFilterWishlist(); else navigate('/user?wishlist=true'); }}>
                <div className="relative flex items-center pb-1">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-red-500 font-black text-sm absolute -top-1 leading-none">{wishlist.length}</span>
                    <ShoppingCart className="w-8 h-8 text-white mt-1" />
                  </div>
                </div>
                <span className="text-sm font-bold text-white mb-1 ml-1 hidden sm:block leading-none">Wishlist</span>
            </div>
          </div>
        </div>

        {/* Sub Header / Quick Links */}
        <div className="hidden md:flex bg-[#012169] text-white items-center px-4 py-1.5 gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-b border-slate-800">
          <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white px-1.5 py-0.5 rounded-sm font-bold shrink-0">
            <Menu className="w-5 h-5" /> All
          </button>
          
          {/* Quick Links */}
          {headerLinks.map((link: any, idx: number) => {
            if (link.isWishlist || link.label.toLowerCase().includes('wishlist')) {
              return (
                <span 
                  key={idx} 
                  onClick={() => { if (onFilterWishlist) onFilterWishlist(); else navigate('/user?wishlist=true'); }}
                  className="hover:outline hover:outline-1 hover:outline-white px-1.5 py-0.5 rounded-sm cursor-pointer font-medium"
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
                  className="hover:outline hover:outline-1 hover:outline-white px-1.5 py-0.5 rounded-sm cursor-pointer text-slate-200"
                >
                  {link.label}
                </span>
              );
            }
            return (
              <a 
                key={idx} 
                href={link.href || '#'}
                className="hover:outline hover:outline-1 hover:outline-white px-1.5 py-0.5 rounded-sm cursor-pointer text-slate-200"
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
            <span key={cat} onClick={() => handleCategorySelect(cat)} className="hover:outline hover:outline-1 hover:outline-white px-1.5 py-0.5 rounded-sm cursor-pointer text-slate-200 transition-all font-medium">
              {cat}
            </span>
          ))}

          <span className="hover:outline hover:outline-1 hover:outline-white px-1.5 py-0.5 rounded-sm cursor-pointer text-white font-bold hidden md:inline-block ml-auto">
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
