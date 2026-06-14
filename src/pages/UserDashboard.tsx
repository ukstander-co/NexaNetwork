import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LogOut, Search, ShieldCheck, Tag, ExternalLink, Filter, Star, Loader2, ArrowDownUp, Heart, Clock, User, ChevronDown, MapPin, Menu, ShoppingCart, Zap } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Logo from '../components/Logo';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTranslation } from '../hooks/useTranslation';

const MOCK_PRODUCTS = [
  { id: 1, name: "Dyson V15 Detect Absolute", price: 699.99, category: "Home & Kitchen", rating: 4.8, reviews: 1245, discount: "15% off", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=400", affiliateLink: "https://example.com/buy/1", ai_tags: "#vacuums, #dyson" },
  { id: 2, name: "Sony WH-1000XM5 Headphones", price: 319.00, category: "Electronics", rating: 4.7, reviews: 3420, discount: "Trending", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400", affiliateLink: "https://example.com/buy/2", ai_tags: "#sony, #headphones, #audio" },
  { id: 3, name: "Ninja Dual Zone Air Fryer", price: 149.00, category: "Home & Kitchen", rating: 4.9, reviews: 8902, discount: "Best Seller", image: "https://images.unsplash.com/photo-1626806787426-5910811b6325?auto=format&fit=crop&q=80&w=400", affiliateLink: "https://example.com/buy/3", ai_tags: "#cooking, #ninja, #airfryer" },
  { id: 4, name: "Apple iPad Air (5th Gen)", price: 579.00, category: "Computers", rating: 4.8, reviews: 5431, discount: "Limited Stock", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400", affiliateLink: "https://example.com/buy/4", ai_tags: "#apple, #ipad, #tablet" },
  { id: 5, name: "Nespresso Vertuo Plus", price: 79.00, category: "Home & Kitchen", rating: 4.6, reviews: 2190, discount: "Special Offer", image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=400", affiliateLink: "https://example.com/buy/5", ai_tags: "#coffee, #nespresso" },
  { id: 6, name: "Samsung 55\" QLED 4K TV", price: 549.00, category: "Electronics", rating: 4.5, reviews: 1102, discount: "Flash Sale", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400", affiliateLink: "https://example.com/buy/6", ai_tags: "#tv, #samsung, #4k" },
  { id: 7, name: "CeraVe Moisturising Cream", price: 12.50, category: "Health & Beauty", rating: 4.8, reviews: 15400, discount: "Daily Essential", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400", affiliateLink: "https://example.com/buy/7", ai_tags: "#skincare, #cerave" },
  { id: 8, name: "Logitech MX Master 3S", price: 89.99, category: "Computers", rating: 4.8, reviews: 4200, discount: "Top Rated", image: "https://images.unsplash.com/photo-1527864550417-7fd91aca2de3?auto=format&fit=crop&q=80&w=400", affiliateLink: "https://example.com/buy/8", ai_tags: "#mouse, #logitech, #productivity" },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [search, setSearch] = useState(searchParams.get('q') || "");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || "");
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState('relevance');
  
  const [redirectingProduct, setRedirectingProduct] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New features state
  const [wishlist, setWishlist] = useState<string[]>(JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [showTopDropsOnly, setShowTopDropsOnly] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // AI & Personalized Micro-service state keys
  const [isAiGroup, setIsAiGroup] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(JSON.parse(localStorage.getItem('searchHistory') || '[]'));
  const [showHistory, setShowHistory] = useState(false);
  const [searchBarCategory, setSearchBarCategory] = useState("All Categories");

  // Mobile Drawer Navigation 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Shopping Assistant widget keys
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [widgetMessages, setWidgetMessages] = useState<any[]>([
    { role: "assistant", content: "Hi! I am your AI Curation Assistant. How can I help you find perfect UK shopping deals today? Go ahead and ask me anything." }
  ]);
  const [widgetInput, setWidgetInput] = useState("");
  const [widgetStatus, setWidgetStatus] = useState<"ai" | "connecting" | "admin">("ai");
  const [widgetLoading, setWidgetLoading] = useState(false);

  const [globalSettings, setGlobalSettings] = useState<any>(null);

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

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000",
      tag: "Prime Exclusive",
      title: "The Best Tech,<br/>Curated For You.",
      desc: "Discover top-rated electronics, home essentials, and fashion with unbeatable discounts.",
      btn: "Shop Tech",
      query: "tech"
    },
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000",
      tag: "Summer Sale",
      title: "Refresh Your<br/>Wardrobe.",
      desc: "Up to 50% off on premium clothing and accessories for a limited time.",
      btn: "Shop Fashion",
      query: "fashion"
    },
    {
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=2000",
      tag: "Home Essentials",
      title: "Upgrade Your<br/>Living Space.",
      desc: "Find the best deals on smart home devices and elegant furniture.",
      btn: "Shop Home",
      query: "home"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const { countryName, flagEmoji, languageCode, changeLanguage, availableLanguages } = useGeolocation();
  const { t } = useTranslation();

  const userEmail = JSON.parse(localStorage.getItem('user') || '{}')?.email || 'Guest';

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(decodeURIComponent(categoryId));
    } else {
      setSelectedCategory("All Categories");
    }
  }, [categoryId]);

  // 1. Fetch User Profile & A/B testing cohort bucket on startup
  useEffect(() => {
    if (userEmail) {
      fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      })
        .then(res => res.json())
        .then(prof => {
        })
        .catch(console.error);
    }
  }, [userEmail]);

  // 2. Synchronize Local Wishlist entries with SQL persistent schema
  useEffect(() => {
    if (userEmail) {
      fetch('/api/wishlist/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, productIds: wishlist })
      })
        .then(() => {
          fetch(`/api/wishlist?email=${encodeURIComponent(userEmail)}`)
            .then(res => res.json())
            .then(srvWish => {
              if (Array.isArray(srvWish)) {
                const merged = Array.from(new Set([...wishlist, ...srvWish]));
                setWishlist(merged);
                localStorage.setItem('wishlist', JSON.stringify(merged));
              }
            })
            .catch(console.error);
        })
        .catch(console.error);
    }
  }, [userEmail]);

  // 3. Continuous Price Alert Polling (In-App Glassmorphism Toast notifications)
  /*
  useEffect(() => {
    if (!userEmail) return;
    const alertInterval = setInterval(() => {
      fetch(`/api/price-alerts?email=${encodeURIComponent(userEmail)}`)
        .then(res => res.json())
        .then(alerts => {
          if (Array.isArray(alerts) && alerts.length > 0) {
            setPriceAlerts(alerts.slice(0, 1));
          }
        })
        .catch(console.error);
    }, 15000);
    return () => clearInterval(alertInterval);
  }, [userEmail]);

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (priceAlerts.length > 0) {
      const timer = setTimeout(() => {
        setPriceAlerts(prev => prev.slice(0, -1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [priceAlerts]);
  */

  // 4. Shopping Assistant chat synchrononization/polling when and if admin is takeover connecting
  useEffect(() => {
    if (!isWidgetOpen || !userEmail || widgetStatus === 'ai') return;
    const chatInterval = setInterval(() => {
      fetch(`/api/chat-poll?email=${encodeURIComponent(userEmail)}`)
        .then(res => res.json())
        .then(srv => {
          if (srv.status) {
            setWidgetStatus(srv.status);
          }
          if (Array.isArray(srv.messages) && srv.messages.length > 0) {
            setWidgetMessages(srv.messages);
          }
        })
        .catch(console.error);
    }, 4500);
    return () => clearInterval(chatInterval);
  }, [isWidgetOpen, userEmail, widgetStatus]);

  // Scroll to bottom of chat automatically when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [widgetMessages, widgetLoading]);

  // 5. Connect Dynamic Search & Personalization Ranking query
  useEffect(() => {
    setLoading(true);
    fetch('/api/products/search-and-rank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        search: search,
        category: selectedCategory,
        maxPrice: maxPrice
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsAiGroup(data.isAiGroup || false);
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to query search-and-rank API", e);
        // Fallback robust local recovery
        fetch('/api/products')
          .then(res => res.json())
          .then(standardData => {
            const mapped = standardData.map((p: any) => ({
              id: `db-${p.id}`,
              name: p.ai_title || "Premium product",
              description: p.ai_description,
              price: parseFloat(p.price) || 0,
              category: p.category || "General",
              rating: Number(p.rating) || 4.7, 
              reviews: Number(p.reviews_count) || (150 + (Number(p.id) % 10) * 12),
              clicks: Number(p.views_count) || (350 + Number(p.id)),
              discount: "Exclusive Deal",
              image: p.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
              affiliateLink: p.affiliate_link,
              ai_tags: p.ai_tags,
              additionalImages: p.additional_images ? JSON.parse(p.additional_images) : []
            }));
            setProducts([...mapped, ...MOCK_PRODUCTS.map(p => ({...p, clicks: 120, additionalImages: []}))]);
            setLoading(false);
          })
          .catch(() => {
            setProducts(MOCK_PRODUCTS.map(p => ({...p, clicks: 200, additionalImages: []})));
            setLoading(false);
          });
      });
  }, [search, selectedCategory, maxPrice, userEmail]);

  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ["All Categories", ...Array.from(cats)];
  }, [products]);

  const handleCategorySelect = (category: string) => {
    // track category click behavior first
    if (userEmail && category !== "All Categories") {
      fetch('/api/user-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, type: 'click', detail: category })
      }).catch(console.error);
    }

    if (category === "All Categories") {
      navigate('/user');
    } else {
      navigate(`/category/${encodeURIComponent(category)}`);
    }
    setShowWishlistOnly(false);
    setShowTopDropsOnly(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const strId = id.toString();
    const updated = wishlist.includes(strId) ? wishlist.filter(wId => wId !== strId) : [...wishlist, strId];
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));

    // Persist to SQLite securely so background drops matching works
    if (userEmail) {
      fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, productId: strId })
      }).catch(console.error);
    }
  };

  // Chat widgets interactive click triggers
  const handleWidgetSend = () => {
    if (!widgetInput.trim() || widgetLoading) return;
    const text = widgetInput;
    setWidgetInput("");

    const newMsgs = [...widgetMessages, { role: "user", content: text }];
    setWidgetMessages(newMsgs);
    setWidgetLoading(true);

    fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, messages: newMsgs })
    })
      .then(res => res.json())
      .then(data => {
        setWidgetLoading(false);
        if (data.reply) {
          setWidgetMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        }
        if (data.currentStatus) {
          setWidgetStatus(data.currentStatus);
        }
      })
      .catch(e => {
        console.error(e);
        setWidgetLoading(false);
        setWidgetMessages(prev => [...prev, { role: "assistant", content: "I am having minor network speed fluctuations. Could you please say that again?" }]);
      });
  };

  const handleRequestHuman = () => {
    setWidgetLoading(true);
    const triggerMsg = [...widgetMessages, { role: "user", content: "I want to connect to a real support assistant or human admin takeover." }];
    setWidgetMessages(triggerMsg);

    fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, messages: triggerMsg })
    })
      .then(res => res.json())
      .then(data => {
        setWidgetLoading(false);
        if (data.reply) {
          setWidgetMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        }
        if (data.currentStatus) {
          setWidgetStatus(data.currentStatus);
        }
      })
      .catch(e => {
        console.error(e);
        setWidgetLoading(false);
      });
  };

  const handleProductView = (product: any) => {
    if (userEmail) {
      fetch('/api/user-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          type: 'view',
          detail: product.category,
          price: product.price
        })
      }).catch(console.error);
    }
    navigate(`/product/${product.id.toString().replace('db-','')}`, { state: { product } });
  };

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const newHist = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5);
    setSearchHistory(newHist);
    localStorage.setItem('searchHistory', JSON.stringify(newHist));
  };

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const executeSearch = () => {
    saveSearch(searchInput);
    setShowHistory(false);
    setSearch(searchInput);
    setSelectedCategory(searchBarCategory);
    setShowTopDropsOnly(false);
    
    // Redirect if it's not all categories to sync UI nicely, or we can just stay on page
    if (searchBarCategory !== "All Categories") {
       navigate(`/category/${encodeURIComponent(searchBarCategory)}`);
       // update the states again just in case navigate overrides
       setTimeout(() => {
         setSearch(searchInput);
         setSelectedCategory(searchBarCategory);
       }, 50);
    } else {
       navigate('/user');
       setTimeout(() => {
         setSearch(searchInput);
         setSelectedCategory("All Categories");
       }, 50);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      if (showWishlistOnly && !wishlist.includes(p.id.toString())) return false;
      
      const nameMatch = p.name ? p.name.toLowerCase().includes(search.toLowerCase()) : false;
      const descMatch = p.description ? p.description.toLowerCase().includes(search.toLowerCase()) : false;
      const tagMatch = p.ai_tags ? p.ai_tags.toLowerCase().includes(search.toLowerCase()) : false;
      
      const matchesSearch = nameMatch || descMatch || tagMatch;
      const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory;
      const matchesPrice = p.price <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === 'price-low') {
      result.sort((a,b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a,b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a,b) => b.rating - a.rating);
    } else if (sortBy === 'clicks') {
      result.sort((a,b) => (b.clicks || 0) - (a.clicks || 0));
    }
    
    if (showTopDropsOnly) {
      result = result.slice(0, 10); // Show only top 10 for Top Drops
    }
    
    return result;
  }, [search, selectedCategory, maxPrice, products, sortBy, showWishlistOnly, showTopDropsOnly, wishlist]);

  const isHomeMode = search === "" && selectedCategory === "All Categories" && !showWishlistOnly && !showTopDropsOnly;

  const dynamicCategoriesList = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ["All Categories", ...Array.from(cats)];
  }, [products]);

  const handleHeaderSearch = (term: string, category: string) => {
    setSearchInput(term);
    setSearch(term);
    setSelectedCategory(category);
    setShowTopDropsOnly(false);
    setShowWishlistOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-[#F8FAFC] relative overflow-hidden">
      {/* Ambient 3D Glowing Elements & Radial Technical Grid */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Deep Soft Glowing 3D Orbs */}
        <div className="absolute top-0 right-10 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200/20 to-rose-200/25 rounded-full blur-[140px] -mr-32 -mt-32" />
        <div className="absolute top-[35%] left-[-150px] w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/15 via-blue-100/10 to-emerald-250/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 right-[5%] w-[550px] h-[550px] bg-gradient-to-bl from-violet-200/20 via-sky-200/15 to-pink-200/15 rounded-full blur-[125px]" />
        
        {/* Diagonal Soft Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#0B192C 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
      </div>

      <Header 
        userEmail={userEmail}
        wishlist={wishlist}
        dynamicCategories={dynamicCategoriesList}
        onSearch={handleHeaderSearch}
        onFilterWishlist={() => { setShowWishlistOnly(true); setShowTopDropsOnly(false); setSelectedCategory("All Categories"); setSearch(""); }}
        onFilterTopDrops={() => { setShowTopDropsOnly(true); setShowWishlistOnly(false); setSortBy('clicks'); setSelectedCategory("All Categories"); setSearch(""); }}
        initialSearch={searchInput}
        initialCategory={selectedCategory}
      />

      {/* Main Content */}
      <main className={`mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-8 mb-12 relative z-0 ${isHomeMode ? 'max-w-[1600px] !p-0' : 'max-w-7xl'}`}>
        
        {/* Sidebar Filters - Glass Card */}
        {!isHomeMode && (
        <aside className="w-full md:w-64 shrink-0 space-y-6 bg-white/60 backdrop-blur-lg border border-white/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit sticky top-24">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2"><Filter className="w-4 h-4"/> Categories</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {dynamicCategories.map(category => (
                <li key={category}>
                  <button 
                    onClick={() => handleCategorySelect(category)}
                    className={`text-left w-full hover:text-blue-700 transition-colors ${selectedCategory === category && !showWishlistOnly ? 'font-bold text-blue-700' : ''}`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-200/50">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2"><ArrowDownUp className="w-4 h-4"/> Sort By</h3>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2.5 bg-white/70 backdrop-blur-md border border-white/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-slate-700"
            >
              <option value="relevance">Top Relevance</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="pt-6 border-t border-slate-200/50">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Max Price (Under £{maxPrice})</h3>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="0" 
                max="1000" 
                step="50"
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </aside>
        )}

        {/* Product Catalog */}
        <div className={`flex-1 min-h-[500px] ${isHomeMode ? 'w-full' : ''}`}>
          {isHomeMode ? (
             <div className="flex flex-col gap-8 pb-12 bg-slate-100/50 relative">
                {/* 3D Auto Sliding Hero Poster */}
                <div className="relative w-full h-[400px] md:h-[600px] -mt-4 mb-4 [perspective:1000px] overflow-hidden bg-slate-900 border-b border-white/10 shadow-2xl">
                   {heroSlides.map((slide, index) => {
                     const isCurrent = index === currentSlide;
                     const isPrev = index === (currentSlide - 1 + heroSlides.length) % heroSlides.length;
                     const isNext = index === (currentSlide + 1) % heroSlides.length;

                     // Determine 3D transforms
                     let transformStyle = '';
                     let zIndex = 0;
                     let opacity = 0;

                     if (isCurrent) {
                       transformStyle = 'translateX(0) scale(1) rotateY(0deg)';
                       zIndex = 40;
                       opacity = 1;
                     } else if (isPrev) {
                       transformStyle = 'translateX(-50%) scale(0.8) rotateY(30deg)';
                       zIndex = 20;
                       opacity = 0.5;
                     } else if (isNext) {
                       transformStyle = 'translateX(50%) scale(0.8) rotateY(-30deg)';
                       zIndex = 20;
                       opacity = 0.5;
                     }

                     return (
                       <div 
                         key={index} 
                         className="absolute inset-0 transition-all duration-700 ease-out origin-center"
                         style={{ transform: transformStyle, zIndex, opacity, visibility: opacity > 0 ? 'visible' : 'hidden' }}
                       >
                         <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/50 to-transparent z-10 pointer-events-none"></div>
                         <img src={slide.image} alt={slide.title.replace('<br/>',' ')} className="w-full h-full object-cover opacity-80" />
                         <div className="absolute top-0 left-0 bottom-0 w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center z-[70] pointer-events-auto">
                            <span className="text-[#febd69] font-bold tracking-widest uppercase mb-2 drop-shadow-md">{slide.tag}</span>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-xl" dangerouslySetInnerHTML={{ __html: slide.title }}></h1>
                            <p className="text-slate-200 text-lg mb-8 max-w-md drop-shadow-md font-medium">{slide.desc}</p>
                            <button onClick={() => { setSearchInput(slide.query); executeSearch(); }} className="bg-[#febd69] text-slate-900 font-bold px-8 py-3.5 rounded-full w-fit hover:bg-[#f3a847] transition-colors shadow-[0_0_20px_rgba(254,189,105,0.4)] hover:shadow-[0_0_30px_rgba(254,189,105,0.6)] hover:scale-105 transform duration-200 select-none cursor-pointer">
                              {slide.btn}
                            </button>
                         </div>
                       </div>
                     );
                   })}
                   
                   {/* Slide Navigation Dots */}
                   <div className="absolute bottom-48 left-0 right-0 flex justify-center gap-3 z-40">
                     {heroSlides.map((_, idx) => (
                       <button 
                         key={idx}
                         onClick={() => setCurrentSlide(idx)}
                         className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-10 bg-[#febd69] shadow-[0_0_10px_rgba(254,189,105,0.8)]' : 'w-2.5 bg-white/40 hover:bg-white/70'}`}
                       />
                     ))}
                   </div>

                   {/* Subtle bottom fade */}
                   <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-slate-100 via-slate-100/40 to-transparent z-30 pointer-events-none"></div>
                </div>

                {/* Main Content Area with Amazon-like overlap */}
                <div className="max-w-[1600px] mx-auto w-full px-4 -mt-20 z-40 relative flex flex-col gap-8">

                  {/* Bento Grid layout for categories/highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Top Ranked Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100 hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between" onClick={() => { setSortBy('rating'); executeSearch(); }}>
                       <div>
                         <h3 className="text-xl font-bold text-slate-800 mb-4">Top Ranked</h3>
                         <div className="grid grid-cols-2 gap-2">
                           {[...products].sort((a,b) => b.rating - a.rating).slice(0,4).map((p) => (
                             <div 
                               key={p.id} 
                               className="bg-slate-50 p-2 border border-slate-100 hover:border-orange-500 rounded-md transition-all cursor-pointer flex flex-col justify-between items-center h-28"
                               onClick={(e) => { e.stopPropagation(); handleProductView(p); }}
                             >
                               <img src={p.image} className="w-full h-16 object-contain mix-blend-multiply" alt={p.name} />
                               <span className="text-[10px] text-slate-600 font-bold truncate w-full text-center mt-1">{p.name}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                       <p className="text-blue-600 hover:text-orange-600 text-sm mt-4 font-semibold">See highly rated deals</p>
                    </div>

                    {/* Most Popular Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100 hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between" onClick={() => { setSortBy('relevance'); executeSearch(); }}>
                       <div>
                         <h3 className="text-xl font-bold text-slate-800 mb-4">Most Popular</h3>
                         <div className="grid grid-cols-2 gap-2">
                           {[...products].sort((a,b) => b.reviews - a.reviews).slice(0,4).map((p) => (
                             <div 
                               key={p.id} 
                               className="bg-slate-50 p-2 border border-slate-100 hover:border-orange-500 rounded-md transition-all cursor-pointer flex flex-col justify-between items-center h-28"
                               onClick={(e) => { e.stopPropagation(); handleProductView(p); }}
                             >
                               <img src={p.image} className="w-full h-16 object-contain mix-blend-multiply" alt={p.name} />
                               <span className="text-[10px] text-slate-600 font-bold truncate w-full text-center mt-1">{p.name}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                       <p className="text-blue-600 hover:text-orange-600 text-sm mt-4 font-semibold">Explore trending items</p>
                    </div>

                    {/* Max Visitors (Clicks) Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100 hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between" onClick={() => { setSortBy('clicks'); executeSearch(); }}>
                       <div>
                         <h3 className="text-xl font-bold text-slate-800 mb-4">Daily Max Visitors</h3>
                         <div className="grid grid-cols-2 gap-2">
                           {[...products].sort((a,b) => (b.clicks||0) - (a.clicks||0)).slice(0,4).map((p) => (
                             <div 
                               key={p.id} 
                               className="bg-slate-50 p-2 border border-slate-100 hover:border-orange-500 rounded-md transition-all cursor-pointer flex flex-col justify-between items-center h-28"
                               onClick={(e) => { e.stopPropagation(); handleProductView(p); }}
                             >
                               <img src={p.image} className="w-full h-16 object-contain mix-blend-multiply" alt={p.name} />
                               <span className="text-[10px] text-slate-600 font-bold truncate w-full text-center mt-1">{p.name}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                       <p className="text-blue-600 hover:text-orange-600 text-sm mt-4 font-semibold">See what others view</p>
                    </div>

                    {/* Deals Under $50 Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100 hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between" onClick={() => { setMaxPrice(50); executeSearch(); }}>
                       <div>
                         <h3 className="text-xl font-bold text-slate-800 mb-4">Deals Under £50</h3>
                         <div className="grid grid-cols-2 gap-2">
                           {products.filter(p => p.price <= 50).slice(0,4).map((p) => (
                             <div 
                               key={p.id} 
                               className="bg-slate-50 p-2 border border-slate-100 hover:border-orange-500 rounded-md transition-all cursor-pointer flex flex-col justify-between items-center h-28"
                               onClick={(e) => { e.stopPropagation(); handleProductView(p); }}
                             >
                               <img src={p.image} className="w-full h-16 object-contain mix-blend-multiply" alt={p.name} />
                               <span className="text-[10px] text-slate-600 font-bold truncate w-full text-center mt-1">{p.name}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                       <p className="text-blue-600 hover:text-orange-600 text-sm mt-4 font-semibold">Shop budget finds</p>
                    </div>
                  </div>

                  {/* Horizontal Sliders for Categories */}
                  {dynamicCategories.filter(c => c !== "All Categories").map(cat => (
                     <div key={cat} className="bg-white p-6 rounded-lg shadow-md border border-slate-100">
                        <div className="flex justify-between items-end mb-4">
                           <h3 className="text-xl font-bold text-slate-800">{cat} Essentials</h3>
                           <button onClick={() => { handleCategorySelect(cat); }} className="text-blue-600 hover:text-orange-600 text-sm font-semibold">See more</button>
                        </div>
                        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                           {products.filter(p => p.category === cat).map(product => (
                              <div key={product.id} className="min-w-[180px] w-[180px] cursor-pointer group" onClick={() => handleProductView(product)}>
                                 <div className="bg-slate-50 rounded-md p-4 mb-2 border border-slate-100 group-hover:border-slate-300 transition-colors h-40 flex items-center justify-center">
                                     <img src={product.image} className="max-h-full object-contain" alt={product.name}/>
                                 </div>
                                 <h4 className="text-slate-800 font-medium text-sm line-clamp-2 leading-tight group-hover:text-orange-600 mt-1">{product.name}</h4>
                                 <div className="text-slate-900 font-bold mt-1">£{parseFloat(product.price).toFixed(2)}</div>
                              </div>
                           ))}
                        </div>
                     </div>
                  ))}

                </div>
             </div>
          ) : (
          <>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-800">
                  {showWishlistOnly ? 'My Wishlist' : 'Curation'} 
                  {!loading && <span className="text-slate-500 text-lg font-normal ml-2">({filteredProducts.length})</span>}
                </h2>
                {!showWishlistOnly && (
                  <div className="flex items-center">
                    {isAiGroup ? (
                      <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-bold shadow-xs border border-red-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span> AI Personalized Mode Active
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold border border-slate-200">
                        Curated Standard Mode Active (Control)
                      </span>
                    )}
                  </div>
                )}
             </div>
             {showWishlistOnly && (
               <button onClick={() => setShowWishlistOnly(false)} className="text-sm text-blue-600 font-semibold hover:underline cursor-pointer">
                 Show all products
               </button>
             )}
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[420px] relative">
                     <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent z-10"></div>
                     <div className="h-52 bg-slate-200/60 animate-pulse"></div>
                     <div className="p-5 flex flex-col flex-1">
                        <div className="w-20 h-3 bg-slate-200/80 rounded-full mb-3 animate-pulse"></div>
                        <div className="w-full h-5 bg-slate-200/80 rounded-lg mb-2 animate-pulse"></div>
                        <div className="w-3/4 h-5 bg-slate-200/80 rounded-lg mb-4 animate-pulse"></div>
                        <div className="w-full h-3 bg-slate-200/80 rounded-full mb-2 animate-pulse"></div>
                        <div className="w-2/3 h-3 bg-slate-200/80 rounded-full mb-4 animate-pulse"></div>
                        <div className="mt-auto flex justify-between items-end">
                           <div className="w-16 h-8 bg-slate-200/80 rounded-lg animate-pulse"></div>
                           <div className="w-24 h-4 bg-slate-200/80 rounded-full animate-pulse"></div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          ) : filteredProducts.length === 0 ? (
             <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer relative" onClick={() => handleProductView(product)}>
                  
                  {/* Wishlist Toggle */}
                  <button 
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur shadow-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${wishlist.includes(product.id.toString()) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  </button>

                  <div className="p-4 bg-white flex justify-center items-center h-52 relative overflow-hidden border-b border-slate-50">
                     <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 flex items-center shadow-sm rounded-full z-10">
                        <Tag className="w-3 h-3 mr-1" /> {product.discount}
                     </div>
                     {product.reviews > 400 && (
                       <div className="absolute top-3 right-12 bg-slate-900 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 flex items-center shadow-sm rounded-full z-10">
                          Hot Seller
                       </div>
                     )}
                     <img src={product.image} alt={product.name} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center text-[10px] text-blue-700 mb-1.5 font-bold tracking-wide uppercase">{product.category}</div>
                    <h3 className="font-semibold text-base text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight mb-2">{product.name}</h3>

                    {product.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed flex-1">{product.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-[#FFD814] text-[#FFD814]" />
                        <Star className="w-3.5 h-3.5 fill-[#FFD814] text-[#FFD814]" />
                        <Star className="w-3.5 h-3.5 fill-[#FFD814] text-[#FFD814]" />
                        <Star className="w-3.5 h-3.5 fill-[#FFD814] text-[#FFD814]" />
                        <span className="text-[11px] text-blue-600 hover:underline font-medium ml-1.5">{product.reviews}</span>
                      </div>
                      <div className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex items-center">
                        <Zap className="w-3 h-3 mr-0.5" /> {product.clicks} views
                      </div>
                    </div>

                    <div className="mt-auto flex items-end justify-between">
                      <div className="text-2xl font-black text-slate-900 leading-none">£{parseFloat(product.price).toFixed(2)}</div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleProductView(product); }}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Shopping Assistant Floating widget bubble */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {isWidgetOpen ? (
          <div className="w-80 md:w-96 h-[500px] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            {/* Widget Header */}
            <div className="bg-[#0B192C] text-white p-4 flex items-center justify-between relative">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center border border-red-500/30">
                  <span className="text-base font-extrabold text-red-500">AI</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight">Shopping Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${widgetStatus === 'admin' ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                    <span className="text-[10px] text-slate-300 capitalize font-semibold">
                      {widgetStatus === 'ai' && 'AI Assistant Mode'}
                      {widgetStatus === 'connecting' && 'Connecting to Admin...'}
                      {widgetStatus === 'admin' && 'Live Admin Connected'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsWidgetOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold leading-none mr-1 cursor-pointer">×</button>
            </div>

            {/* Chat message panel container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 flex flex-col" ref={chatEndRef}>
              {widgetMessages.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={i} className={`flex flex-col max-w-[80%] ${isUser ? 'align-end self-end text-right' : 'align-start self-start text-left'}`}>
                    <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${isUser ? 'bg-red-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                      {msg.content}
                    </div>
                  </div>
                )
              })}
              {widgetLoading && (
                <div className="self-start bg-slate-100 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2 font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" /> Assistant is matching...
                </div>
              )}
            </div>

            {/* Chat Controls Input Area */}
            <div className="p-3 border-t border-slate-200/50 bg-white">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={widgetInput}
                  onChange={(e) => setWidgetInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleWidgetSend(); }}
                  disabled={widgetStatus === 'connecting'}
                  placeholder={widgetStatus === 'connecting' ? 'Admin is connecting...' : 'Ask about product details or deals...'}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-500"
                />
                <button 
                  onClick={handleWidgetSend}
                  disabled={widgetLoading || !widgetInput.trim() || widgetStatus === 'connecting'}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  Send
                </button>
              </div>

              {/* Manual human support takeover escalation button option */}
              {widgetStatus === 'ai' && (
                <button 
                  onClick={() => handleRequestHuman()}
                  className="w-full text-center text-[10px] text-blue-600 hover:text-orange-600 font-bold transition-colors mt-2 block cursor-pointer"
                >
                  Need live human help? Click to connect with Admin
                </button>
              )}
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsWidgetOpen(true)}
            className="bg-[#0B192C] hover:bg-red-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border border-white/10"
          >
            <ShoppingCart className="w-6 h-6 text-white animate-bounce" />
          </button>
        )}
      </div>
    </div>
  );
}

