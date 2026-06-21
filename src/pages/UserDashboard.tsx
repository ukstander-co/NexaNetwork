import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LogOut,
  Search,
  ShieldCheck,
  Tag,
  ExternalLink,
  Filter,
  Star,
  Loader2,
  ArrowDownUp,
  Heart,
  Clock,
  User,
  ChevronDown,
  MapPin,
  Menu,
  ShoppingCart,
  Zap,
  Home,
  MessageSquare,
  Bell,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Logo from "../components/Logo";
import { useGeolocation } from "../hooks/useGeolocation";
import { useTranslation } from "../hooks/useTranslation";
import { apiClient } from "../utils/apiClient";
import { getProductSeoUrl } from "../utils/seo";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Dyson V15 Detect Absolute",
    price: 699.99,
    category: "Home & Kitchen",
    rating: 4.8,
    reviews: 1245,
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://example.com/buy/1",
    ai_tags: "#vacuums, #dyson",
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 Headphones",
    price: 319.0,
    category: "Electronics",
    rating: 4.7,
    reviews: 3420,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://example.com/buy/2",
    ai_tags: "#sony, #headphones, #audio",
  },
  {
    id: 3,
    name: "Ninja Dual Zone Air Fryer",
    price: 149.0,
    category: "Home & Kitchen",
    rating: 4.9,
    reviews: 8902,
    image:
      "https://images.unsplash.com/photo-1626806787426-5910811b6325?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://example.com/buy/3",
    ai_tags: "#cooking, #ninja, #airfryer",
  },
  {
    id: 4,
    name: "Apple iPad Air (5th Gen)",
    price: 579.0,
    category: "Computers",
    rating: 4.8,
    reviews: 5431,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://example.com/buy/4",
    ai_tags: "#apple, #ipad, #tablet",
  },
  {
    id: 5,
    name: "Nespresso Vertuo Plus",
    price: 79.0,
    category: "Home & Kitchen",
    rating: 4.6,
    reviews: 2190,
    image:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://example.com/buy/5",
    ai_tags: "#coffee, #nespresso",
  },
  {
    id: 6,
    name: 'Samsung 55" QLED 4K TV',
    price: 549.0,
    category: "Electronics",
    rating: 4.5,
    reviews: 1102,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://example.com/buy/6",
    ai_tags: "#tv, #samsung, #4k",
  },
  {
    id: 7,
    name: "CeraVe Moisturising Cream",
    price: 12.5,
    category: "Health & Beauty",
    rating: 4.8,
    reviews: 15400,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://example.com/buy/7",
    ai_tags: "#skincare, #cerave",
  },
  {
    id: 8,
    name: "Logitech MX Master 3S",
    price: 89.99,
    category: "Computers",
    rating: 4.8,
    reviews: 4200,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91aca2de3?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://example.com/buy/8",
    ai_tags: "#mouse, #logitech, #productivity",
  },
];

// Local configurations match apiClient definitions

export default function UserDashboard() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState("relevance");

  const [redirectingProduct, setRedirectingProduct] = useState<any | null>(
    null,
  );
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New features state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const userLocal = localStorage.getItem("user");
    const uEmail = userLocal
      ? JSON.parse(userLocal)?.email || "Guest"
      : "Guest";
    return JSON.parse(
      localStorage.getItem(`wishlist_${uEmail}`) ||
        localStorage.getItem("wishlist") ||
        "[]",
    );
  });
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [showTopDropsOnly, setShowTopDropsOnly] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // AI & Personalized Micro-service state keys
  const [isAiGroup, setIsAiGroup] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(
    JSON.parse(localStorage.getItem("searchHistory") || "[]"),
  );
  const [showHistory, setShowHistory] = useState(false);
  const [searchBarCategory, setSearchBarCategory] = useState("All Categories");

  // Mobile Drawer Navigation
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileFiltersExpanded, setIsMobileFiltersExpanded] = useState(false);

  // Shopping Assistant widget keys
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [widgetMessages, setWidgetMessages] = useState<any[]>([
    {
      role: "assistant",
      content:
        "Hi! I am your AI Curation Assistant. How can I help you find perfect UK shopping deals today? Go ahead and ask me anything.",
    },
  ]);
  const [widgetInput, setWidgetInput] = useState("");
  const [widgetStatus, setWidgetStatus] = useState<
    "ai" | "connecting" | "admin"
  >("ai");
  const [widgetLoading, setWidgetLoading] = useState(false);

  const [globalSettings, setGlobalSettings] = useState<any>(null);
  const [isUserActiveSession, setIsUserActiveSession] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  const activateSession = () => {
    if (!isUserActiveSession) {
      setIsUserActiveSession(true);
      console.log(
        "[Shadow Copy Engine] Direct user interaction detected. Upgrading lazy session to server-live Active status.",
      );
    }
  };

  // Smart idle engine to throttle background requests on user inactivity
  useEffect(() => {
    let idleTimeout: any;
    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        setIsIdle(true);
        console.log(
          "[Smart Idle Engine] No user activity detected for 30s. Background polling suspended.",
        );
      }, 30000);
    };

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keypress", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);
    window.addEventListener("scroll", resetIdleTimer);
    window.addEventListener("touchstart", resetIdleTimer);

    resetIdleTimer();

    return () => {
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keypress", resetIdleTimer);
      window.removeEventListener("click", resetIdleTimer);
      window.removeEventListener("scroll", resetIdleTimer);
      window.removeEventListener("touchstart", resetIdleTimer);
      clearTimeout(idleTimeout);
    };
  }, []);

  useEffect(() => {
    const cachedSettings = localStorage.getItem("shadow_global_settings");
    if (cachedSettings) {
      try {
        setGlobalSettings(JSON.parse(cachedSettings));
      } catch (e) {
        console.error("Failed to parse cached global settings", e);
      }
    }
    apiClient
      .request("/api/global-settings", {
        cacheTTL: 60000,
        useOfflineFallback: true,
      })
      .then((data) => {
        setGlobalSettings(data);
        localStorage.setItem("shadow_global_settings", JSON.stringify(data));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
    setSearchInput(q);
  }, [searchParams]);

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
      { label: "Customer Service", href: "/contact" },
    ];
  }, [globalSettings]);

  const headerPromo = globalSettings?.header_promo || "New Releases in UK";

  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000",
      tag: "Prime Exclusive",
      title: "The Best Tech,<br/>Curated For You.",
      desc: "Discover top-rated electronics, home essentials, and fashion curated for you.",
      btn: "Shop Tech",
      query: "tech",
    },
    {
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000",
      tag: "Summer Sale",
      title: "Refresh Your<br/>Wardrobe.",
      desc: "Up to 50% off on premium clothing and accessories for a limited time.",
      btn: "Shop Fashion",
      query: "fashion",
    },
    {
      image:
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=2000",
      tag: "Home Essentials",
      title: "Upgrade Your<br/>Living Space.",
      desc: "Find the best deals on smart home devices and elegant furniture.",
      btn: "Shop Home",
      query: "home",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const {
    countryName,
    flagEmoji,
    languageCode,
    changeLanguage,
    availableLanguages,
  } = useGeolocation();
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = user?.email || "Guest";
  const userName = user?.name || "Guest";

  const getDailyGreeting = () => {
    const dayIndex = new Date().getDay();
    const greetings = [
      "Happy Sunday! Relax and discover our finest premium collections today.",
      "Monday Motivation: Start your week with elite quality and amazing savings.",
      "Tuesday Treasures: Explore the latest trending arrivals and unique finds.",
      "Mid-week Inspiration: Discover premium style and effortless functionality.",
      "Thursday Thrills: Almost the weekend! Grab the most anticipated deals now.",
      "Friday Favorites: TGIF! Treat yourself to something truly special today.",
      "Saturday Spotlight: Weekend vibes only. Curated high-quality items for you."
    ];
    return greetings[dayIndex];
  };

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
      fetch("/api/user-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      })
        .then((res) => res.json())
        .then((prof) => {})
        .catch(console.error);
    }
  }, [userEmail]);

  // 2. Synchronize Local Wishlist entries with SQL persistent schema
  useEffect(() => {
    if (userEmail && userEmail !== "Guest") {
      const userWishlistKey = `wishlist_${userEmail}`;
      const localWish = JSON.parse(
        localStorage.getItem(userWishlistKey) || "[]",
      );
      setWishlist(localWish);

      fetch("/api/wishlist/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, productIds: localWish }),
      })
        .then(() => {
          fetch(`/api/wishlist?email=${encodeURIComponent(userEmail)}`)
            .then((res) => res.json())
            .then((srvWish) => {
              if (Array.isArray(srvWish)) {
                const merged = Array.from(new Set([...localWish, ...srvWish]));
                setWishlist(merged);
                localStorage.setItem(userWishlistKey, JSON.stringify(merged));
                localStorage.setItem("wishlist", JSON.stringify(merged));
              }
            })
            .catch(console.error);
        })
        .catch(console.error);
    } else {
      const guestWish = JSON.parse(
        localStorage.getItem("wishlist_Guest") || "[]",
      );
      setWishlist(guestWish);
      localStorage.setItem("wishlist", JSON.stringify(guestWish));
    }
  }, [userEmail]);

  // 4. Shopping Assistant chat synchrononization/polling when and if admin is takeover connecting
  useEffect(() => {
    if (!isWidgetOpen || !userEmail || widgetStatus === "ai" || isIdle) return;
    const chatInterval = setInterval(() => {
      if (document.visibilityState !== "visible" || isIdle) return; // Pause live chat polling if inactive background tab or idle
      fetch(`/api/chat-poll?email=${encodeURIComponent(userEmail)}`)
        .then((res) => res.json())
        .then((srv) => {
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
  }, [isWidgetOpen, userEmail, widgetStatus, isIdle]);

  // Scroll to bottom of chat automatically when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [widgetMessages, widgetLoading]);

  // 5. Connect Dynamic Search & Personalization Ranking query
  useEffect(() => {
    const cachedProductsStr = localStorage.getItem("shadow_products_list");
    const cachedTimeStr = localStorage.getItem("shadow_products_time");
    const cachedAiGroupStr = localStorage.getItem("shadow_is_ai_group");

    let cachedData: any[] = [];
    let isCacheFresh = false;

    if (cachedProductsStr) {
      try {
        cachedData = JSON.parse(cachedProductsStr);
        if (cachedTimeStr) {
          const age = Date.now() - parseInt(cachedTimeStr, 10);
          if (age < 120000) {
            // 2 minutes
            isCacheFresh = true;
          }
        }
      } catch (e) {
        console.error("Shadow Copy parsing failed", e);
      }
    }

    // A user is considered "Passive" if they are browsing the default viewport without active filters/searches
    const isPassive =
      !search &&
      (!selectedCategory || selectedCategory === "All Categories") &&
      !maxPrice;

    if (
      isPassive &&
      cachedData.length > 0 &&
      (isCacheFresh || !isUserActiveSession)
    ) {
      // Use shadow copy instantly, suppressing server-side queries for massive concurrency!
      setProducts(cachedData);
      setIsAiGroup(cachedAiGroupStr === "true");
      setLoading(false);
      console.log(
        "[Shadow Copy Engine] Rendered storefront catalog from local browser memory. Server request prevented.",
      );
      return;
    }

    setLoading(true);
    apiClient
      .request("/api/products/search-and-rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          search: search,
          category: selectedCategory,
          maxPrice: maxPrice,
        }),
        cacheTTL: 10000,
        useOfflineFallback: true,
      })
      .then((data) => {
        setIsAiGroup(data.isAiGroup || false);
        const resolvedProducts = data.products || [];
        setProducts(resolvedProducts);
        setLoading(false);

        // Store as client-side shadow copy for future visitors
        if (isPassive) {
          localStorage.setItem(
            "shadow_products_list",
            JSON.stringify(resolvedProducts),
          );
          localStorage.setItem("shadow_products_time", Date.now().toString());
          localStorage.setItem(
            "shadow_is_ai_group",
            String(data.isAiGroup || false),
          );
        }
      })
      .catch((e) => {
        console.error("Failed to query search-and-rank API", e);
        // Fallback robust local recovery
        apiClient
          .request("/api/products", {
            cacheTTL: 30000,
            useOfflineFallback: true,
          })
          .then((standardData) => {
            const mapped = standardData.map((p: any) => ({
              id: `db-${p.id}`,
              name: p.ai_title || "Premium product",
              description: p.ai_description,
              price: parseFloat(p.price) || 0,
              category: p.category || "General",
              rating: Number(p.rating) || 4.7,
              reviews:
                Number(p.reviews_count) || 150 + (Number(p.id) % 10) * 12,
              clicks: Number(p.views_count) || 350 + Number(p.id),
              image:
                p.image_url ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
              affiliateLink: p.affiliate_link,
              ai_tags: p.ai_tags,
              additionalImages: (() => {
                if (!p.additional_images) return [];
                const str = p.additional_images.trim();
                if (str.startsWith('[')) {
                  try {
                    const parsed = JSON.parse(str);
                    if (Array.isArray(parsed)) return parsed;
                  } catch (e) {}
                }
                return str.split(',').map((img: any) => String(img).trim()).filter(Boolean);
              })(),
            }));
            const combined = [
              ...mapped,
              ...MOCK_PRODUCTS.map((p) => ({
                ...p,
                clicks: 120,
                additionalImages: [],
              })),
            ];
            setProducts(combined);
            setLoading(false);

            if (isPassive) {
              localStorage.setItem(
                "shadow_products_list",
                JSON.stringify(combined),
              );
              localStorage.setItem(
                "shadow_products_time",
                Date.now().toString(),
              );
            }
          })
          .catch(() => {
            setProducts(
              MOCK_PRODUCTS.map((p) => ({
                ...p,
                clicks: 200,
                additionalImages: [],
              })),
            );
            setLoading(false);
          });
      });
  }, [search, selectedCategory, maxPrice, userEmail, isUserActiveSession]);

  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All Categories", ...Array.from(cats)];
  }, [products]);

  const handleCategorySelect = (category: string) => {
    activateSession();
    // track category click behavior first
    if (userEmail && category !== "All Categories") {
      fetch("/api/user-interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          type: "click",
          detail: category,
        }),
      }).catch(console.error);
    }

    if (category === "All Categories") {
      navigate("/user");
    } else {
      navigate(`/category/${encodeURIComponent(category)}`);
    }
    setShowWishlistOnly(false);
    setShowTopDropsOnly(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("wishlist"); // Clear current active wishlist cache
    navigate("/login");
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    activateSession();
    const strId = id.toString();
    const updated = wishlist.includes(strId)
      ? wishlist.filter((wId) => wId !== strId)
      : [...wishlist, strId];
    setWishlist(updated);
    localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(updated));
    localStorage.setItem("wishlist", JSON.stringify(updated));

    // Persist to SQLite securely so background drops matching works
    if (userEmail && userEmail !== "Guest") {
      fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, productId: strId }),
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

    fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, messages: newMsgs }),
    })
      .then((res) => res.json())
      .then((data) => {
        setWidgetLoading(false);
        if (data.reply) {
          setWidgetMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.reply },
          ]);
        }
        if (data.currentStatus) {
          setWidgetStatus(data.currentStatus);
        }
      })
      .catch((e) => {
        console.error(e);
        setWidgetLoading(false);
        setWidgetMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I am having minor network speed fluctuations. Could you please say that again?",
          },
        ]);
      });
  };

  const handleRequestHuman = () => {
    setWidgetLoading(true);
    const triggerMsg = [
      ...widgetMessages,
      {
        role: "user",
        content:
          "I want to connect to a real support assistant or human admin takeover.",
      },
    ];
    setWidgetMessages(triggerMsg);

    fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, messages: triggerMsg }),
    })
      .then((res) => res.json())
      .then((data) => {
        setWidgetLoading(false);
        if (data.reply) {
          setWidgetMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.reply },
          ]);
        }
        if (data.currentStatus) {
          setWidgetStatus(data.currentStatus);
        }
      })
      .catch((e) => {
        console.error(e);
        setWidgetLoading(false);
      });
  };

  const handleProductView = (product: any) => {
    activateSession();
    if (userEmail) {
      fetch("/api/user-interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          type: "view",
          detail: product.category,
          price: product.price,
        }),
      }).catch(console.error);
    }
    navigate(getProductSeoUrl(product.id, product.name || product.ai_title), {
      state: { product },
    });
  };

  const handlePrefetch = (id: any) => {
    if (isIdle || !id) return;
    const cleanId = id.toString().replace("db-", "");
    fetch(`/api/products/${cleanId}`).catch(() => {});
  };

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const newHist = [term, ...searchHistory.filter((h) => h !== term)].slice(
      0,
      5,
    );
    setSearchHistory(newHist);
    localStorage.setItem("searchHistory", JSON.stringify(newHist));
  };

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  const executeSearch = () => {
    activateSession();
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
      navigate("/user");
      setTimeout(() => {
        setSearch(searchInput);
        setSelectedCategory("All Categories");
      }, 50);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (showWishlistOnly && !wishlist.includes(p.id.toString())) return false;

      const nameMatch = p.name
        ? p.name.toLowerCase().includes(search.toLowerCase())
        : false;
      const descMatch = p.description
        ? p.description.toLowerCase().includes(search.toLowerCase())
        : false;
      const tagMatch = p.ai_tags
        ? p.ai_tags.toLowerCase().includes(search.toLowerCase())
        : false;

      const matchesSearch = nameMatch || descMatch || tagMatch;
      const matchesCategory =
        selectedCategory === "All Categories" ||
        p.category === selectedCategory;
      const matchesPrice = p.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "clicks") {
      result.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    }

    if (showTopDropsOnly) {
      result = result.slice(0, 10); // Show only top 10 for Top Drops
    }

    return result;
  }, [
    search,
    selectedCategory,
    maxPrice,
    products,
    sortBy,
    showWishlistOnly,
    showTopDropsOnly,
    wishlist,
  ]);

  const isHomeMode =
    search === "" &&
    selectedCategory === "All Categories" &&
    !showWishlistOnly &&
    !showTopDropsOnly;

  const dynamicCategoriesList = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
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
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(#0B192C 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <Header
        userEmail={userEmail}
        wishlist={wishlist}
        dynamicCategories={dynamicCategoriesList}
        onSearch={handleHeaderSearch}
        onFilterWishlist={() => {
          setShowWishlistOnly(true);
          setShowTopDropsOnly(false);
          setSelectedCategory("All Categories");
          setSearch("");
        }}
        initialSearch={searchInput}
        initialCategory={selectedCategory}
      />

      {/* Main Content */}
      <main
        className={`mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-8 mb-12 relative z-0 ${isHomeMode ? "max-w-[1600px] !p-0" : "max-w-7xl"}`}
      >
        {/* Sidebar Filters - Desktop (Sticky Glass Card) & Mobile (Collapsible Glass Bar) */}
        {!isHomeMode && (
          <>
            {/* Desktop Only: Sticky Sidebar */}
            <aside className="hidden md:block w-64 shrink-0 space-y-6 bg-white/60 backdrop-blur-lg border border-white/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit sticky top-24">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Categories
                </h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  {dynamicCategories.map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => handleCategorySelect(category)}
                        className={`text-left w-full hover:text-blue-700 transition-colors ${selectedCategory === category && !showWishlistOnly ? "font-bold text-blue-700" : ""}`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-200/50">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ArrowDownUp className="w-4 h-4" /> Sort By
                </h3>
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
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Max Price (Under £{maxPrice})
                </h3>
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

            {/* Mobile Only: Beautiful, Premium Compact Collapsible Filters Card */}
            <div className="md:hidden w-full bg-white/80 backdrop-blur-lg border border-slate-200/60 rounded-2xl p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
              <button
                onClick={() =>
                  setIsMobileFiltersExpanded(!isMobileFiltersExpanded)
                }
                className="w-full px-4 py-3 flex items-center justify-between text-slate-850 hover:bg-slate-50 transition-colors rounded-xl"
              >
                <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider text-slate-800">
                  <Filter className="w-4 h-4 text-red-650" />
                  <span>Refine & Sort Deals</span>
                  {selectedCategory !== "All Categories" && (
                    <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 font-bold px-2 py-0.5 rounded-full truncate max-w-[120px]">
                      {selectedCategory}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="text-xs font-semibold">
                    {isMobileFiltersExpanded ? "Close" : "Filter"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${isMobileFiltersExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isMobileFiltersExpanded && (
                <div className="p-4 border-t border-slate-100 space-y-4 bg-white/40 animate-in slide-in-from-top-2 duration-300 rounded-b-xl">
                  {/* Category Pills Choice inside expanded selector */}
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">
                      Select Department
                    </h4>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {dynamicCategories.map((category) => {
                        const isSelected =
                          selectedCategory === category && !showWishlistOnly;
                        return (
                          <button
                            key={category}
                            onClick={() => {
                              handleCategorySelect(category);
                              setIsMobileFiltersExpanded(false);
                            }}
                            className={`text-[11px] px-3 py-1.5 rounded-full font-bold transition-all border ${
                              isSelected
                                ? "bg-[#0B192C] text-white border-[#0B192C] shadow-sm font-black"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sorter Selector */}
                  <div className="pt-3.5 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                      Sorting Order
                    </h4>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="relevance">Top Relevance</option>
                      <option value="price-low">Price (Low to High)</option>
                      <option value="price-high">Price (High to Low)</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>

                  {/* Pricing Range Slider */}
                  <div className="pt-3.5 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                      Max Price limit (Under £{maxPrice})
                    </h4>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Product Catalog */}
        <div className={`flex-1 min-h-[500px] ${isHomeMode ? "w-full" : ""}`}>
          {isHomeMode ? (
            <div className="flex flex-col gap-10 md:gap-14 pb-16 bg-[#FDFDFD] relative">
              {/* Etsy-like Storefront Header */}
              <div className="w-full flex justify-center py-6 sm:py-8 md:py-10 bg-[#FDFDFD]">
                <div className="max-w-[1400px] w-full px-4 sm:px-6 md:px-8">
                  <h1 className="text-2xl sm:text-3xl font-serif text-slate-900 text-center mb-8 sm:mb-10 tracking-tight">
                    {userName && userName !== 'Guest' 
                      ? `Welcome back, ${userName}! ${getDailyGreeting().split('!')[1] || getDailyGreeting().split(':')[1] || ""}` 
                      : getDailyGreeting()}
                  </h1>
                  
                  {/* Circle Category Bubbles */}
                  <div className="flex overflow-x-auto gap-4 sm:gap-6 justify-start md:justify-center pb-4 scrollbar-hide py-2 snap-x">
                    {dynamicCategories.filter((c) => c !== "All Categories").slice(0, 6).map((category, idx) => {
                      const catImage = products.find(p => p.category === category)?.image || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200";
                      
                      return (
                        <div 
                          key={category}
                          onClick={() => {
                            handleCategorySelect(category);
                          }}
                          className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0 snap-center"
                        >
                          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-slate-200 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all bg-slate-50 relative group-hover:-translate-y-1">
                            <img src={catImage} alt={category} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <span className="text-sm font-semibold text-slate-800 text-center max-w-[128px] truncate mt-1">
                            {category}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="max-w-[1400px] mx-auto w-full px-3 sm:px-6 md:px-8 relative flex flex-col gap-6 md:gap-10">
                {/* Premium Bento Grid layout for categories/highlights */}
                <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                  {[
                    {
                      title: "Top Ranked",
                      subtitle: "See highly rated deals",
                      items: [...products]
                        .sort((a, b) => b.rating - a.rating)
                        .slice(0, 2),
                      action: () => {
                        setSortBy("rating");
                        executeSearch();
                      },
                    },
                    {
                      title: "Most Popular",
                      subtitle: "Explore trending items",
                      items: [...products]
                        .sort((a, b) => b.reviews - a.reviews)
                        .slice(0, 2),
                      action: () => {
                        setSortBy("relevance");
                        executeSearch();
                      },
                    },
                    {
                      title: "Daily Max Visitors",
                      subtitle: "See what others view",
                      items: [...products]
                        .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                        .slice(0, 2),
                      action: () => {
                        setSortBy("clicks");
                        executeSearch();
                      },
                    },
                    {
                      title: "Deals Under £50",
                      subtitle: "Shop budget finds",
                      items: products.filter((p) => p.price <= 50).slice(0, 2),
                      action: () => {
                        setMaxPrice(50);
                        executeSearch();
                      },
                    },
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      className="min-w-[85vw] sm:min-w-0 bg-white p-5 sm:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col snap-center h-full group/card"
                      onClick={card.action}
                    >
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 tracking-tight border-b border-slate-100 pb-2.5 flex items-center justify-between">
                        {card.title}
                      </h3>
                      {card.items.length >= 2 ? (
                        <div className="grid grid-cols-2 gap-3 flex-1 mb-4">
                          {card.items.slice(0, 2).map((item, i) => (
                            <div
                              key={i}
                              className="bg-slate-50/70 hover:bg-rose-50/45 hover:shadow-xs border border-slate-100/60 hover:border-blue-400/45 active:scale-[0.97] transition-all duration-300 rounded-2xl p-3 flex flex-col items-center justify-between group/item cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductView(item);
                              }}
                              title={item.name}
                            >
                              <div className="h-14 sm:h-20 w-full flex items-center justify-center mb-1.5 relative">
                                <div className="absolute inset-0 bg-white/40 rounded-lg -z-10"></div>
                                <img
                                  src={item.image}
                                  className="max-h-full max-w-full object-contain mix-blend-multiply group-hover/item:scale-110 transition-transform duration-300"
                                  alt={item.name}
                                />
                              </div>
                              <span className="text-[10px] text-slate-500 group-hover/item:text-slate-950 font-medium truncate w-full text-center tracking-tight">
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex-1 flex justify-center items-center text-slate-400 text-xs py-8 italic">
                          Finding live curate deals...
                        </div>
                      )}
                      <p className="text-red-650 group-hover/card:text-red-700 text-xs mt-auto font-black flex items-center gap-1.5 transition-colors pt-2 uppercase tracking-wider">
                        {card.subtitle}{" "}
                        <ArrowRight className="w-3.5 h-3.5 group-hover/card:translate-x-1.5 transition-transform" />
                      </p>
                    </div>
                  ))}
                </div>

                {/* Horizontal Sliders for Categories */}
                {dynamicCategories
                  .filter((c) => c !== "All Categories")
                  .map((cat) => (
                    <div
                      key={cat}
                      className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.02)] border border-slate-100/85"
                    >
                      <div className="flex justify-between items-end mb-6 pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-none">
                            {cat} Essentials
                          </h3>
                          <p className="text-xs text-slate-400 font-medium mt-1">
                            Premium hand-picked curation from local British
                            departments
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            handleCategorySelect(cat);
                          }}
                          className="text-xs font-black text-red-600 hover:text-red-700 uppercase tracking-widest flex items-center gap-1 transition-all"
                        >
                          See more <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex overflow-x-auto gap-5 pb-2 scrollbar-hide snap-x snap-mandatory">
                        {products
                          .filter((p) => p.category === cat)
                          .map((product) => (
                            <div
                              key={product.id}
                              className="min-w-[200px] w-[200px] cursor-pointer group snap-center flex flex-col"
                              onClick={() => handleProductView(product)}
                            >
                              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-3 h-44 mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                <img
                                  src={product.image}
                                  className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-all duration-300"
                                  alt={product.name}
                                />
                              </div>
                              <h4 className="text-slate-800 font-medium text-xs line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors mt-1 mb-2">
                                {product.name}
                              </h4>
                              <div className="flex items-center justify-between mt-auto">
                                <div className="text-slate-900 font-bold text-sm">
                                  £{parseFloat(product.price).toFixed(2)}
                                </div>
                                <button
                                  className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWishlist(product.id.toString(), e); // Using wishlist as cart toggle logic for simplicity
                                  }}
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                </button>
                              </div>
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
                    {showWishlistOnly ? "My Wishlist" : "Curation"}
                    {!loading && (
                      <span className="text-slate-500 text-lg font-normal ml-2">
                        ({filteredProducts.length})
                      </span>
                    )}
                  </h2>
                  {!showWishlistOnly && (
                    <div className="flex items-center">
                      {isAiGroup ? (
                        <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-bold shadow-xs border border-red-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>{" "}
                          AI Personalized Mode Active
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
                  <button
                    onClick={() => setShowWishlistOnly(false)}
                    className="text-sm text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Show all products
                  </button>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[420px] relative"
                    >
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
                  <h3 className="text-xl font-bold text-slate-700 mb-2">
                    No products found
                  </h3>
                  <p className="text-slate-500">
                    Try adjusting your filters or search query.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer relative"
                      onClick={() => handleProductView(product)}
                      onMouseEnter={() => handlePrefetch(product.id)}
                    >
                      {/* Wishlist Toggle */}
                      <button
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur shadow-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${wishlist.includes(product.id.toString()) ? "fill-red-500 text-red-500" : "text-slate-400"}`}
                        />
                      </button>

                      <div className="p-4 bg-white flex justify-center items-center h-52 relative overflow-hidden border-b border-slate-50">
                        {product.reviews > 400 && (
                          <div className="absolute top-3 right-12 bg-slate-900 text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 flex items-center shadow-sm rounded-full z-10">
                            Hot Seller
                          </div>
                        )}
                        <img
                          src={product.image}
                          alt={`${product.name} - Premium ${product.category} Curation`}
                          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center text-[10px] text-red-650 mb-1.5 font-bold tracking-wide uppercase">
                          {product.category}
                        </div>
                        <h3 className="font-bold text-base text-slate-800 group-hover:text-red-650 transition-colors line-clamp-2 leading-tight mb-2">
                          {product.name}
                        </h3>

                        {product.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed flex-1">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-[#FFD814] text-[#FFD814]" />
                            <Star className="w-3.5 h-3.5 fill-[#FFD814] text-[#FFD814]" />
                            <Star className="w-3.5 h-3.5 fill-[#FFD814] text-[#FFD814]" />
                            <Star className="w-3.5 h-3.5 fill-[#FFD814] text-[#FFD814]" />
                            <span className="text-[11px] text-red-650 hover:underline font-extrabold ml-1.5">
                              {product.reviews} reviews
                            </span>
                          </div>
                          <div className="text-[10px] font-extrabold text-[#AA1C1C] bg-red-50 px-2.5 py-0.5 rounded-full flex items-center">
                            <Zap className="w-3 h-3 mr-0.5" /> {product.clicks}{" "}
                            views
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                          <div className="text-2xl font-black text-slate-900 leading-none">
                            £{parseFloat(product.price).toFixed(2)}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product.id.toString(), e);
                            }}
                            className="bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all focus:outline-none"
                          >
                            <ShoppingCart className="w-5 h-5" />
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
      <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end">
        {isWidgetOpen ? (
          <div className="w-80 md:w-96 h-[500px] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            {/* Widget Header */}
            <div className="bg-slate-950 border-b border-slate-800 text-white p-4 flex items-center justify-between relative">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center border border-red-500/30">
                  <span className="text-base font-extrabold text-red-500">
                    AI
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight">
                    Shopping Assistant
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${widgetStatus === "admin" ? "bg-indigo-400 animate-pulse" : "bg-emerald-400"}`}
                    ></span>
                    <span className="text-[10px] text-slate-300 capitalize font-semibold">
                      {widgetStatus === "ai" && "AI Assistant Mode"}
                      {widgetStatus === "connecting" &&
                        "Connecting to Admin..."}
                      {widgetStatus === "admin" && "Live Admin Connected"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsWidgetOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold leading-none mr-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Chat message panel container */}
            <div
              className="flex-1 p-4 overflow-y-auto space-y-3.5 flex flex-col"
              ref={chatEndRef}
            >
              {widgetMessages.map((msg, i) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={i}
                    className={`flex flex-col max-w-[80%] ${isUser ? "align-end self-end text-right" : "align-start self-start text-left"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${isUser ? "bg-red-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"}`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              {widgetLoading && (
                <div className="self-start bg-slate-100 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2 font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />{" "}
                  Assistant is matching...
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleWidgetSend();
                  }}
                  disabled={widgetStatus === "connecting"}
                  placeholder={
                    widgetStatus === "connecting"
                      ? "Admin is connecting..."
                      : "Ask about product details or deals..."
                  }
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={handleWidgetSend}
                  disabled={
                    widgetLoading ||
                    !widgetInput.trim() ||
                    widgetStatus === "connecting"
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  Send
                </button>
              </div>

              {/* Manual human support takeover escalation button option */}
              {widgetStatus === "ai" && (
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
            className="hidden md:flex bg-[#0B192C] hover:bg-red-700 text-white w-14 h-14 rounded-full items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border border-white/10"
          >
            <ShoppingCart className="w-6 h-6 text-white animate-bounce" />
          </button>
        )}
      </div>

      {/* Floating Glassmorphic Mobile Navigation Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md h-16 bg-[#0B192C]/95 backdrop-blur-md rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.3)] border border-white/10 md:hidden z-50 flex items-center justify-around px-2 text-white">
        <button
          onClick={() => {
            setShowWishlistOnly(false);
            setShowTopDropsOnly(false);
            setSelectedCategory("All Categories");
            setSearchInput("");
            setSearch("");
            setIsWidgetOpen(false);
            navigate("/user");
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full rounded-full transition-colors ${!showWishlistOnly && !showTopDropsOnly && !isWidgetOpen ? "text-red-500 font-extrabold scale-105" : "text-slate-400 hover:text-white"}`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={() => {
            setShowTopDropsOnly(true);
            setShowWishlistOnly(false);
            setSortBy("clicks");
            setSelectedCategory("All Categories");
            setSearch("");
            setIsWidgetOpen(false);
          }}
          className={`relative flex flex-col items-center justify-center flex-1 h-full rounded-full transition-colors ${showTopDropsOnly ? "text-red-500 font-extrabold scale-105" : "text-slate-400 hover:text-white"}`}
        >
          <Zap className="w-5 h-5 mb-0.5 animate-pulse text-yellow-400" />
          <span className="text-[10px] font-bold">Top Drops</span>
        </button>

        <button
          onClick={() => {
            setShowWishlistOnly(true);
            setShowTopDropsOnly(false);
            setSelectedCategory("All Categories");
            setSearch("");
            setIsWidgetOpen(false);
          }}
          className={`relative flex flex-col items-center justify-center flex-1 h-full rounded-full transition-colors ${showWishlistOnly ? "text-red-500 font-extrabold scale-105" : "text-slate-400 hover:text-white"}`}
        >
          <Heart
            className={`w-5 h-5 mb-0.5 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`}
          />
          <span className="text-[10px] font-bold">Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute top-2 right-5 bg-red-600 text-white text-[8px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-[#0B192C]">
              {wishlist.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsWidgetOpen(!isWidgetOpen)}
          className={`flex flex-col items-center justify-center flex-1 h-full rounded-full transition-colors ${isWidgetOpen ? "text-red-500 font-extrabold scale-105" : "text-slate-400 hover:text-white"}`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5 text-blue-400" />
          <span className="text-[10px] font-bold">AI Agent</span>
        </button>

        <button
          onClick={() => navigate("/user/profile")}
          className="flex flex-col items-center justify-center flex-1 h-full rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
}
