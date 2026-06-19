import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  ShieldAlert, 
  Users, 
  Settings, 
  Activity, 
  Sparkles, 
  Loader2, 
  MessageSquare, 
  Send, 
  Bell, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  ChevronRight,
  Edit2,
  Trash2,
  Check,
  FileText,
  LayoutDashboard,
  Globe,
  Plus,
  ExternalLink,
  Calendar,
  X,
  RefreshCw,
  Server,
  Terminal,
  Copy,
  Lock,
  Wifi,
  Play,
  CheckCircle2,
  Trash,
  Eye,
  Menu,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'insights' | 'products' | 'users' | 'pages' | 'chats' | 'trends' | 'alerts' | 'blogs' | 'deployment' | 'emails'>('insights');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // ImprovMX Email Forwarding States
  const [domainStatus, setDomainStatus] = useState<any>(null);
  const [domainAliases, setDomainAliases] = useState<any[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [emailStatusError, setEmailStatusError] = useState('');
  const [newAliasName, setNewAliasName] = useState('');
  const [newAliasForward, setNewAliasForward] = useState('ukstander.co@gmail.com');
  const [addingAlias, setAddingAlias] = useState(false);
  const [deletingAlias, setDeletingAlias] = useState<string | null>(null);

  // AI Trend Discovery Suggestions States
  const [trendSuggestions, setTrendSuggestions] = useState<any[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [trendsActionLoader, setTrendsActionLoader] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any | null>(null);
  
  // Predictive Trend Spotter States
  const [trendsSubTab, setTrendsSubTab] = useState<'hunt' | 'spotter'>('spotter');
  const [predictiveTrends, setPredictiveTrends] = useState<any[]>([]);
  const [loadingPredictive, setLoadingPredictive] = useState(false);
  const [generatingPredictive, setGeneratingPredictive] = useState(false);
  const [predictiveSearch, setPredictiveSearch] = useState('');
  const [approveForm, setApproveForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    affiliate_link: ''
  });
  
  // Optimizer Form Data
  const [formData, setFormData] = useState({
    affiliateLink: '',
    imageUrl: '',
    additionalImages: '',
    price: '',
    rawContext: ''
  });

  // Base Analytical Counts
  const [analytics, setAnalytics] = useState<any>({
    summary: "Generating system analysis...",
    chart: [],
    userCount: 0,
    clickCount: 0,
    productCount: 0,
    abGroupPercent: 60,
    viewsCount: 0,
    wishlistCount: 0
  });

  // Support Chats System
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [replyInput, setReplyInput] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Pages Curation States
  const [pagesList, setPagesList] = useState<any[]>([]);
  const [selectedPageKey, setSelectedPageKey] = useState<string>('privacy');
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [pageSaveSuccess, setPageSaveSuccess] = useState('');

  // Global Settings States
  const [globalSettings, setGlobalSettings] = useState<any>({
    header_promo: '',
    header_links: '',
    rainforest_api_key: '',
    rainforest_sort_by: 'average_customer_reviews',
    rainforest_min_rating: '0.0',
    rainforest_min_reviews: '0',
    footer_company_heading: '',
    footer_company_links: '',
    footer_support_heading: '',
    footer_support_links: '',
    footer_legal_heading: '',
    footer_legal_links: '',
    footer_resource_heading: '',
    footer_resource_links: '',
    footer_copyright: ''
  });
  const [globalSettingsSuccess, setGlobalSettingsSuccess] = useState('');
  const [globalSettingsLoading, setGlobalSettingsLoading] = useState(false);

  // Users Management States
  const [usersList, setUsersList] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user' });
  const [userSaveSuccess, setUserSaveSuccess] = useState('');

  // Blogs Management States
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    slug: '',
    product_id: '',
    banner_image: '',
    slider_images: '[]',
    affiliate_link: '',
    tags: '',
    seo_title: '',
    seo_description: '',
  });
  const [blogSaveSuccess, setBlogSaveSuccess] = useState('');
  const [blogLoading, setBlogLoading] = useState(false);

  // --- Oracle VM Easy Deployment & PM2 Helper ---
  const [deployIp, setDeployIp] = useState('79.72.94.8');
  const [deployPort, setDeployPort] = useState('3000');
  const [deployDomain, setDeployDomain] = useState('ukstander.duckdns.org');
  const [duckDnsToken, setDuckDnsToken] = useState('019eba66-3501-71e9-8995-576baba2f8b4');
  const [cfDomain, setCfDomain] = useState('ukstander.shop');
  const [activeDeploySubtab, setActiveDeploySubtab] = useState<'pm2' | 'autodeploy' | 'domain' | 'firewall' | 'easypanel'>('easypanel');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const fetchBlogs = () => {
    setBlogLoading(true);
    fetch('/api/admin/blogs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogsList(data);
        setBlogLoading(false);
      })
      .catch(err => {
        console.error(err);
        setBlogLoading(false);
      });
  };

  const handleEditBlogClick = (blog: any) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title || '',
      content: blog.content || '',
      slug: blog.slug || '',
      product_id: blog.product_id ? blog.product_id.toString() : '',
      banner_image: blog.banner_image || '',
      slider_images: blog.slider_images || '[]',
      affiliate_link: blog.affiliate_link || '',
      tags: blog.tags || '',
      seo_title: blog.seo_title || '',
      seo_description: blog.seo_description || '',
    });
    setBlogSaveSuccess('');
  };

  const handleCreateNewBlog = () => {
    setEditingBlog({ id: null }); // Signal new blog
    setBlogForm({
      title: '',
      content: '',
      slug: '',
      product_id: '',
      banner_image: '',
      slider_images: '[]',
      affiliate_link: '',
      tags: '',
      seo_title: '',
      seo_description: '',
    });
    setBlogSaveSuccess('');
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    setBlogSaveSuccess('');
    
    const payload = {
      ...blogForm,
      id: editingBlog?.id || null,
      product_id: blogForm.product_id ? parseInt(blogForm.product_id) : null
    };

    fetch('/api/admin/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBlogSaveSuccess(data.message);
          fetchBlogs();
          fetchAnalytics(); // Added to refresh count
          setTimeout(() => setEditingBlog(null), 1500);
        } else {
          alert(data.error || 'Failed to save blog');
        }
      })
      .catch(console.error);
  };

  const handleDeleteBlog = (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) fetchBlogs();
      })
      .catch(console.error);
  };

  // Products Management States
  const [productsList, setProductsList] = useState<any[]>([]);
  const [priceAlertsList, setPriceAlertsList] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    ai_title: '',
    price: '',
    category: '',
    ai_description: '',
    ai_tags: '',
    affiliate_link: '',
    image_url: ''
  });
  const [productSaveSuccess, setProductSaveSuccess] = useState('');

  const fetchGlobalSettings = () => {
    fetch('/api/global-settings')
      .then(res => res.json())
      .then(data => {
        setGlobalSettings({
          header_promo: data.header_promo || '',
          header_links: data.header_links || '',
          rainforest_api_key: data.rainforest_api_key || '',
          rainforest_sort_by: data.rainforest_sort_by || 'average_customer_reviews',
          rainforest_min_rating: data.rainforest_min_rating || '0.0',
          rainforest_min_reviews: data.rainforest_min_reviews || '0',
          footer_company_heading: data.footer_company_heading || '',
          footer_company_links: data.footer_company_links || '',
          footer_support_heading: data.footer_support_heading || '',
          footer_support_links: data.footer_support_links || '',
          footer_legal_heading: data.footer_legal_heading || '',
          footer_legal_links: data.footer_legal_links || '',
          footer_resource_heading: data.footer_resource_heading || '',
          footer_resource_links: data.footer_resource_links || '',
          footer_copyright: data.footer_copyright || ''
        });
      })
      .catch(console.error);
  };

  const handleSaveGlobalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalSettingsLoading(true);
    setGlobalSettingsSuccess('');
    
    fetch('/api/global-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(globalSettings)
    })
      .then(res => res.json())
      .then(data => {
        setGlobalSettingsLoading(false);
        if (data.success) {
          setGlobalSettingsSuccess('Global header and footer content successfully updated!');
          fetchGlobalSettings();
        } else {
          alert('Failed to save global settings changes.');
        }
      })
      .catch(err => {
        console.error(err);
        setGlobalSettingsLoading(false);
      });
  };

  // 1. Fetch Dynamic Analytics from Real SQLite Data
  const fetchAnalytics = () => {
    fetch('/api/admin/dashboard-insights')
      .then(res => res.json())
      .then(data => {
        setAnalytics({
          summary: data.performanceNarrative || "All systems normalized.",
          chart: data.dailyActivityData || [],
          userCount: data.userCount || 0,
          clickCount: data.clickCount || 0,
          productCount: data.productCount || 0,
          abGroupPercent: data.abGroupPercent || 60,
          viewsCount: data.viewsCount || 0,
          wishlistCount: data.wishlistCount || 0
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // 2. Poll Active Chats, Messages, and Helpdesk Escalations
  useEffect(() => {
    const pollInterval = setInterval(() => {
      // Fetch Active Support chats
      fetch('/api/admin/chats')
        .then(res => res.json())
        .then(chats => {
          if (Array.isArray(chats)) {
            setActiveChats(chats);
          }
        })
        .catch(console.error);

      // Fetch Notifications
      fetch('/api/admin/notifications')
        .then(res => res.json())
        .then(notifs => {
          if (Array.isArray(notifs)) {
            setNotifications(notifs);
          }
        })
        .catch(console.error);
    }, 4000);

    return () => clearInterval(pollInterval);
  }, []);

  // 3. Sync Chat Messages when a user chat is open
  useEffect(() => {
    if (!selectedUserEmail) return;
    const msgInterval = setInterval(() => {
      fetch(`/api/admin/chat-messages?email=${encodeURIComponent(selectedUserEmail)}`)
        .then(res => res.json())
        .then(msgs => {
          if (Array.isArray(msgs)) {
            setChatMessages(msgs);
          }
        })
        .catch(console.error);
    }, 3000);
    return () => clearInterval(msgInterval);
  }, [selectedUserEmail]);

  // Load datasets dynamically depending on active workspace tab
  useEffect(() => {
    if (activeTab === 'pages') {
      fetchPages();
      fetchGlobalSettings();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'trends') {
      fetchTrendSuggestions();
      fetchPredictiveTrends();
    } else if (activeTab === 'blogs') {
      fetchBlogs();
    } else if (activeTab === 'emails') {
      fetchEmailStatus();
    }
  }, [activeTab]);

  const fetchEmailStatus = () => {
    setLoadingEmails(true);
    setEmailStatusError('');
    Promise.all([
      fetch('/api/admin/email-forwarding/status').then(res => {
        if (!res.ok) throw new Error("Could not load ImprovMX status. Verify API keys.");
        return res.json();
      }),
      fetch('/api/admin/email-forwarding/aliases').then(res => {
        if (!res.ok) throw new Error("Could not load aliases. Verify server route.");
        return res.json();
      })
    ])
    .then(([statusData, aliasesData]) => {
      setDomainStatus(statusData.domain || statusData);
      if (aliasesData && Array.isArray(aliasesData.aliases)) {
        setDomainAliases(aliasesData.aliases);
      } else if (Array.isArray(aliasesData)) {
        setDomainAliases(aliasesData);
      }
    })
    .catch(err => {
      console.error(err);
      setEmailStatusError(err.message || "Failed to load ImprovMX data.");
    })
    .finally(() => {
      setLoadingEmails(false);
    });
  };

  const fetchPriceAlerts = () => {
    fetch('/api/admin/price-alerts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPriceAlertsList(data);
      })
      .catch(console.error);
  };

  const fetchTrendSuggestions = () => {
    setLoadingTrends(true);
    fetch('/api/admin/trend-suggestions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTrendSuggestions(data);
        }
        setLoadingTrends(false);
      })
      .catch(err => {
        console.error("Error loading trend suggestions:", err);
        setLoadingTrends(false);
      });
  };

  const fetchPredictiveTrends = () => {
    setLoadingPredictive(true);
    fetch('/api/admin/predictive-trends')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPredictiveTrends(data);
        }
        setLoadingPredictive(false);
      })
      .catch(err => {
        console.error("Error loading predictive trends:", err);
        setLoadingPredictive(false);
      });
  };

  // Fetch page content helper
  const fetchPages = () => {
    fetch('/api/admin/pages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPagesList(data);
          const current = data.find(p => p.page_key === selectedPageKey);
          if (current) {
            setPageTitle(current.title);
            setPageContent(current.content);
          } else if (data.length > 0) {
            setSelectedPageKey(data[0].page_key);
            setPageTitle(data[0].title);
            setPageContent(data[0].content);
          }
        }
      })
      .catch(console.error);
  };

  // Fetch users from database
  const fetchUsers = () => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsersList(data);
        }
      })
      .catch(console.error);
  };

  // Fetch products from database
  const fetchProducts = () => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProductsList(data);
        }
      })
      .catch(console.error);
  };

  // Select User Chat handler
  const handleSelectUserChat = (email: string) => {
    setSelectedUserEmail(email);
    setChatLoading(true);
    fetch(`/api/admin/chat-messages?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(msgs => {
        setChatMessages(msgs);
        setChatLoading(false);
      })
      .catch(() => setChatLoading(false));
  };

  // Takeover support chat
  const handleTakeoverChat = (email: string, targetStatus: "admin" | "ai") => {
    fetch('/api/admin/chat-takeover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, status: targetStatus })
    })
      .then(res => res.json())
      .then(() => {
        fetch('/api/admin/chats')
          .then(res => res.json())
          .then(chats => {
            if (Array.isArray(chats)) setActiveChats(chats);
          });
      })
      .catch(console.error);
  };

  // Send human response to user chat
  const handleSendReply = () => {
    if (!replyInput.trim() || !selectedUserEmail) return;
    const text = replyInput;
    setReplyInput('');

    fetch('/api/admin/chat-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: selectedUserEmail, content: text })
    })
      .then(res => res.json())
      .then(() => {
        setChatMessages(prev => [...prev, { role: 'assistant', content: text, created_at: new Date().toISOString() }]);
      })
      .catch(console.error);
  };

  // Dismiss notification
  const handleDismissNotification = (id: number) => {
    fetch('/api/admin/notifications/dismiss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      })
      .catch(console.error);
  };

  // Form Product optimization via Groq AI
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    
    try {
      const additionalImagesArray = formData.additionalImages.split(',').map(i => i.trim()).filter(i => i.length > 0);
      const res = await fetch('/api/admin/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          additionalImages: additionalImagesArray
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccess('Product generated, optimized with Groq tags, and published successfully!');
        setFormData({ affiliateLink: '', imageUrl: '', additionalImages: '', price: '', rawContext: '' });
        fetchAnalytics(); 
        if (activeTab === 'products') fetchProducts();
      } else {
        alert(data.error || 'Failed to generate product');
      }
    } catch (err) {
      alert('Error generating product.');
    } finally {
      setLoading(false);
    }
  };

  // Pages Curation actions
  const handlePageChange = (key: string) => {
    setSelectedPageKey(key);
    const page = pagesList.find(p => p.page_key === key);
    if (page) {
      setPageTitle(page.title);
      setPageContent(page.content);
    }
    setPageSaveSuccess('');
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    setPageSaveSuccess('');
    fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_key: selectedPageKey, title: pageTitle, content: pageContent })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPageSaveSuccess('Site Page Content updated successfully in database!');
          // Refresh local caches
          fetch('/api/admin/pages')
            .then(res => res.json())
            .then(pList => {
              if (Array.isArray(pList)) setPagesList(pList);
            });
        } else {
          alert('Failed to save page contents.');
        }
      })
      .catch(console.error);
  };

  // Users Manager actions
  const handleEditUserClick = (user: any) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, role: user.role });
    setUserSaveSuccess('');
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUserSaveSuccess('');
    fetch(`/api/admin/users/${editingUser.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserSaveSuccess('User credentials saved in Turso/SQLite!');
          fetchUsers();
          setTimeout(() => setEditingUser(null), 1200);
        } else {
          alert('Failed to save user updates.');
        }
      })
      .catch(console.error);
  };

  const handleDeleteUser = (id: number) => {
    if (!confirm('Are you absolutely sure you want to delete this user? This is irreversible.')) return;
    fetch(`/api/admin/users/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchUsers();
          if (editingUser?.id === id) setEditingUser(null);
        }
      })
      .catch(console.error);
  };

  // Products Manager Actions
  const handleEditProductClick = (prod: any) => {
    setEditingProduct(prod);
    setProductForm({
      ai_title: prod.ai_title || '',
      price: prod.price ? prod.price.toString() : '',
      category: prod.category || '',
      ai_description: prod.ai_description || '',
      ai_tags: prod.ai_tags || '',
      affiliate_link: prod.affiliate_link || '',
      image_url: prod.image_url || ''
    });
    setProductSaveSuccess('');
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProductSaveSuccess('');
    fetch(`/api/admin/products/${editingProduct.db_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProductSaveSuccess('Database listing updated successfully!');
          fetchProducts();
          fetchAnalytics();
          setTimeout(() => setEditingProduct(null), 1200);
        } else {
          alert('Failed to save items edits.');
        }
      })
      .catch(console.error);
  };

  const handleDeleteProduct = (dbId: number) => {
    if (!confirm('Are you absolutely sure you want to delete this product? It will vanish from the user curation directory.')) return;
    fetch(`/api/admin/products/${dbId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchProducts();
          fetchAnalytics();
          if (editingProduct?.db_id === dbId) setEditingProduct(null);
        }
      })
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-950 font-sans flex text-left">
      
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 flex flex-col shadow-xl lg:shadow-sm shrink-0 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0B192C] rounded-xl flex items-center justify-center shadow-md">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-[#0B192C] uppercase leading-none">Admin Control</h1>
              <span className="text-[9px] text-red-500 font-bold tracking-wider">SECURE DB ACTIVE</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
          <button 
            id="tab-insights"
            onClick={() => { setActiveTab('insights'); setIsSidebarOpen(false); }} 
            className={`w-full px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer text-left ${activeTab === 'insights' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'insights' ? 'text-white' : 'text-slate-500'}`} /> Analytics
          </button>
          
          <button 
            id="tab-products"
            onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} 
            className={`w-full px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer text-left ${activeTab === 'products' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'products' ? 'text-white' : 'text-slate-500'}`} /> Product Catalog ({analytics.productCount})
          </button>
          
          <button 
            id="tab-users"
            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} 
            className={`w-full px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer text-left ${activeTab === 'users' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-white' : 'text-slate-500'}`} /> User Management ({analytics.userCount})
          </button>
          
          <button 
            id="tab-pages"
            onClick={() => { setActiveTab('pages'); setIsSidebarOpen(false); }} 
            className={`w-full px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer text-left ${activeTab === 'pages' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <Settings className={`w-4 h-4 ${activeTab === 'pages' ? 'text-white' : 'text-slate-500'}`} /> Global Content Settings
          </button>
          
          <button 
            id="tab-chats"
            onClick={() => { setActiveTab('chats'); setIsSidebarOpen(false); }} 
            className={`w-full px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer text-left ${activeTab === 'chats' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-800 bg-slate-50 hover:bg-slate-100/80 shadow-sm border border-slate-100/50'}`}
          >
            <MessageSquare className={`w-4 h-4 ${activeTab === 'chats' ? 'text-white' : 'text-slate-600'}`} /> Support Takeovers ({activeChats.length})
          </button>

          <button 
            id="tab-trends"
            onClick={() => { setActiveTab('trends'); setIsSidebarOpen(false); }} 
            className={`w-full px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer text-left ${activeTab === 'trends' ? 'bg-emerald-700 text-white shadow-md' : 'text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-100/50'}`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'trends' ? 'text-white' : 'text-emerald-600 animate-pulse'}`} /> Trends & AI Hunting
          </button>
          
          <button 
            id="tab-alerts"
            onClick={() => { setActiveTab('alerts'); setIsSidebarOpen(false); }} 
            className={`w-full px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer text-left mt-2 ${activeTab === 'alerts' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <Bell className={`w-4 h-4 ${activeTab === 'alerts' ? 'text-white' : 'text-slate-500'}`} /> Deal Alert Subs
          </button>

          <button 
            id="tab-blogs"
            onClick={() => { setActiveTab('blogs'); setIsSidebarOpen(false); }} 
            className={`w-full px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer text-left mb-2 ${activeTab === 'blogs' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <FileText className={`w-4 h-4 ${activeTab === 'blogs' ? 'text-white' : 'text-slate-500'}`} /> Affiliate Blogs ({blogsList.length})
          </button>

          <button 
            id="tab-emails"
            onClick={() => { setActiveTab('emails'); setIsSidebarOpen(false); }} 
            className={`w-full px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer text-left mb-2 ${activeTab === 'emails' ? 'bg-[#0B192C] text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <Mail className={`w-4 h-4 ${activeTab === 'emails' ? 'text-white' : 'text-slate-500'}`} /> ImprovMX Emails
          </button>
        </div>

        {/* Bottom Sidebar Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="w-full bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold transition-all px-4 py-3 rounded-xl border border-slate-200 cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4 mr-2 text-slate-400" />
            Sign Out Desk
          </button>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        {/* Mobile Header Toggle (Visible only on small screens) */}
        <nav className="lg:hidden bg-[#0B192C] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center shadow-md border border-slate-700">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <h1 className="text-sm font-black tracking-widest text-white uppercase leading-none">Admin Panel</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </nav>

        <main className="max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Real-time Human Takeover Escalations Bell Alert Banners */}
        {notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start justify-between shadow-xs animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest">HELP COUNSEL ESCALATION REQUEST</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      User <span className="font-bold text-amber-950">{notif.user_email}</span> wants to connect to a live support representative or has requested human intervention.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => {
                          setActiveTab('chats');
                          handleSelectUserChat(notif.user_email);
                          handleTakeoverChat(notif.user_email, 'admin');
                          handleDismissNotification(notif.id);
                        }}
                        className="bg-amber-600 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
                      >
                        Accept & Intervene Live
                      </button>
                      <button 
                        onClick={() => handleDismissNotification(notif.id)}
                        className="bg-amber-100 text-amber-800 font-bold text-[10px] uppercase px-3.5 py-1.5 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-600">Active Alert</span>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Metric Blocks - Moved to Analytics Tab Only */}

        {/* Workspace Tab Bar of Feature Control Buttons */}
        {/* Tab-driven Workspace Canvas */}
        <div id="workspace-canvas" className="bg-transparent mt-4 transition-all duration-300">
          
          {/* TAB 1: Insights (Area chart, AI bullet list) */}
          {activeTab === 'insights' && (
            <div id="pane-insights" className="space-y-6 animate-fade-in">
              {/* Dynamic Metric Blocks (Analytics Only) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-blue-600 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Database Users</span>
                     <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{analytics.userCount}</div>
                  <p className="text-[10px] text-green-600 font-bold mt-1">100% Real-time database count</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-red-600 shadow-xs">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Autonomous Links</span>
                     <Globe className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{analytics.productCount}</div>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">Real database products list</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-emerald-600 shadow-xs">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Accumulated Clicks</span>
                     <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{analytics.clickCount}</div>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">Real recorded customer tracking</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-indigo-600 shadow-xs">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">A/B Personalization Group</span>
                     <Settings className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{analytics.abGroupPercent}% AI</div>
                  <p className="text-[10px] text-indigo-600 font-bold mt-1">Of active profiling accounts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 text-sm md:text-base">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      Dynamic Cohort Conversions & Clicks
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Real-time user behavior analysis across interest departments</p>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600 animate-spin" /> SQLite Fed Feed
                  </span>
                </div>

                {/* Area Chart mapping views vs conversions */}
                <div className="h-64 mt-2">
                  {analytics.chart.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                           <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#64748B' }} tickLine={false} axisLine={false} />
                        <YAxis style={{ fontSize: '10px', fontWeight: 'bold', fill: '#64748B' }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: '#0B192C', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                        <Area type="monotone" dataKey="views" name="Daily Impressions" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                        <Area type="monotone" dataKey="clicks" name="Product Clicks" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorConversions)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold bg-slate-50 border border-dashed rounded-xl">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Feeding live charts...
                    </div>
                  )}
                </div>

                {/* Synthesized NLP Executive Summary */}
                <div className="bg-[#0B192C] text-white p-5 rounded-2xl relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full filter blur-xl"></div>
                  <h4 className="text-xs font-black tracking-widest text-red-500 uppercase flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-red-500 animate-bounce" />
                    AI Executive Strategic Insight
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-mono whitespace-pre-line">
                    {typeof analytics.summary === 'string' ? analytics.summary : JSON.stringify(analytics.summary)}
                  </p>
                </div>
              </div>

              {/* Side Card: Quick stats overview */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
                <h3 className="font-extrabold text-slate-900 tracking-tight text-sm">System Operations</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500">Registered Accounts</span>
                    <span className="text-xs font-black text-slate-900">{analytics.userCount}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500">Cataloged Products</span>
                    <span className="text-xs font-black text-slate-900">{analytics.productCount}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500">Page views Tracked</span>
                    <span className="text-xs font-black text-slate-900">{analytics.viewsCount}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500">Wishlist Saves</span>
                    <span className="text-xs font-black text-slate-900">{analytics.wishlistCount}</span>
                  </div>
                </div>

                {/* LLaMA-3 Trend Spotter Promotion Status Widget */}
                <div className="bg-gradient-to-br from-indigo-950 via-[#0B192C] to-slate-900 text-white p-4.5 rounded-xl border border-indigo-900 shadow-sm relative overflow-hidden flex flex-col gap-3 mt-2">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full filter blur-xl"></div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#10B981] font-mono">LLaMA-3 Engine Active</span>
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-wide text-white">
                      UK Predictive Trend Spotter
                    </h4>
                    <p className="text-[9.5px] text-slate-300 leading-normal mt-1">
                      Engineered to analyze Google.co.uk patterns and discover commercial opportunities with high UK intent.
                    </p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('trends'); setTrendsSubTab('spotter'); }}
                    className="w-full bg-[#10B981] hover:bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-widest py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Open Trends Dashboard &rarr;
                  </button>
                </div>

                <div className="mt-auto bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-[10px] uppercase font-bold tracking-wider leading-relaxed text-center">
                  ● Core Node connected to AWS west-1 cluster
                </div>
              </div>
            </div>
          </div>
          )}

          {/* TAB 2: Products Manager (Add, list, edit, delete products) */}
          {activeTab === 'products' && (
            <div id="pane-products" className="space-y-6 animate-fade-in">
              {/* Product Edit Module Drawer (Modal banner if active) */}
              {editingProduct && (
                <div className="bg-indigo-50 border-2 border-indigo-200 p-6 rounded-2xl relative shadow-md">
                  <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 text-xs font-black text-indigo-500 hover:text-indigo-800 uppercase">Cancel Edit</button>
                  <h4 className="font-extrabold text-indigo-900 flex items-center gap-2 mb-4 text-xs uppercase tracking-wider">
                    <Edit2 className="w-4 h-4 text-indigo-600" /> Editing Catalog Item Node: (UID {editingProduct.db_id})
                  </h4>
                  {productSaveSuccess && <div className="mb-4 text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg text-xs font-bold">{productSaveSuccess}</div>}
                  <form onSubmit={handleSaveProductEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Product Custom Title</label>
                      <input required type="text" value={productForm.ai_title} onChange={e => setProductForm({...productForm, ai_title: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Category Code</label>
                      <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800">
                        <option value="Electronics">Electronics</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                        <option value="Computers">Computers</option>
                        <option value="Health & Beauty">Health & Beauty</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Standard Item Price (£)</label>
                      <input required type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Banner Image URL</label>
                      <input required type="text" value={productForm.image_url} onChange={e => setProductForm({...productForm, image_url: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Affiliate Redirection Link</label>
                      <input required type="text" value={productForm.affiliate_link} onChange={e => setProductForm({...productForm, affiliate_link: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Persuasive Description Copy</label>
                      <textarea rows={3} value={productForm.ai_description} onChange={e => setProductForm({...productForm, ai_description: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 leading-relaxed" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Catalog Hashtags</label>
                      <input type="text" value={productForm.ai_tags} onChange={e => setProductForm({...productForm, ai_tags: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800" />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer">Save Product Details</button>
                      <button type="button" onClick={() => setEditingProduct(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-lg cursor-pointer">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* AI Blog Sync utility */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tight flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" /> Content Automation Hub
                  </h4>
                  <p className="text-indigo-700/70 text-[11px] font-medium max-w-xl mt-1">
                    Synchronize your catalog. If you have products without blog posts, our AI will generate high-ranking UK shopping guides for them instantly.
                  </p>
                </div>
                <button 
                  onClick={async () => {
                    if (!confirm("Start AI blog generation for missing articles? This process may take a few minutes.")) return;
                    setLoading(true);
                    try {
                      const res = await fetch('/api/admin/sync-blogs', { method: 'POST' });
                      const data = await res.json();
                      setSuccess(data.message);
                      setLoading(false);
                    } catch (err) {
                      console.error(err);
                      setLoading(false);
                      alert("Failed to sync blogs. Check server logs.");
                    }
                  }}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Sync Missing Blogs
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* AI Publisher Column */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col h-fit">
                  <h3 className="font-extrabold text-slate-900 tracking-tight flex items-center gap-2 text-xs uppercase mb-3 text-red-600">
                    <Sparkles className="w-4 h-4 text-red-600 animate-pulse" /> Publish New item (Groq AI Optimizer)
                  </h3>
                  <p className="text-slate-500 text-[11px] mb-4">Paste specifications list data from a seller page, and the AI parses the characteristics, generates a trust title, tags and catalogs details dynamically.</p>
                  
                  {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold">{success}</div>}
                  
                  <form onSubmit={handleGenerate} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Merchant Redirect Link</label>
                      <input required type="url" value={formData.affiliateLink} onChange={e => setFormData({...formData, affiliateLink: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-red-500" placeholder="https://amazon.co.uk/dp/..." />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Banner Image URL</label>
                      <input required type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-red-500" placeholder="https://images.unsplash.com/..." />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Additional Slider Images (Comma Separated)</label>
                      <input type="text" value={formData.additionalImages} onChange={e => setFormData({...formData, additionalImages: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none" placeholder="https://image1.jpg, https://image2.jpg" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Standard Item Price (£)</label>
                      <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-red-500" placeholder="49.99" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Specs context / raw characteristics list</label>
                      <textarea required rows={3} value={formData.rawContext} onChange={e => setFormData({...formData, rawContext: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-red-500" placeholder="Paste Amazon product summary sheet..."></textarea>
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-[#0B192C] hover:bg-indigo-700 text-white font-bold text-xs uppercase py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Optimize & Publish
                    </button>
                  </form>
                </div>

                {/* Database Products List */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col h-[520px]">
                  <h3 className="font-extrabold text-slate-900 tracking-tight text-xs uppercase mb-3">Live Curation Catalog list</h3>
                  <p className="text-slate-500 text-[11px] mb-4">Click edit on any product listing below to edit standard parameters or delete them from the platform database.</p>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 border-t border-slate-100 pt-3">
                    {productsList.length === 0 ? (
                      <div className="text-center py-16 text-slate-400 text-xs font-semibold">No catalog entries found.</div>
                    ) : (
                      productsList.map((prod) => (
                        <div key={prod.id} className="p-3 bg-slate-50 border rounded-xl flex gap-3 hover:shadow-xs transition-shadow">
                          <img 
                            src={prod.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=150"} 
                            alt={prod.ai_title}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 object-cover bg-white border rounded-lg shrink-0"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md leading-none">{prod.category}</span>
                                <span className="text-xs font-black text-slate-900">£{prod.price}</span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 truncate max-w-[280px]">{prod.ai_title}</h4>
                            </div>
                            <div className="flex gap-2 mt-1">
                              <button onClick={() => handleEditProductClick(prod)} className="text-blue-600 hover:text-blue-800 text-[10px] font-bold flex items-center gap-1 hover:underline cursor-pointer">
                                <Edit2 className="w-3 h-3" /> Edit Row
                              </button>
                              <button onClick={() => handleDeleteProduct(prod.db_id)} className="text-red-500 hover:text-red-700 text-[10px] font-bold flex items-center gap-1 hover:underline cursor-pointer">
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Users Manager (Registered database users list, edit user profile fields) */}
          {activeTab === 'users' && (
            <div id="pane-users" className="space-y-6 animate-fade-in">
              {/* Editing block popup banner if active */}
              {editingUser && (
                <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl relative shadow-md">
                  <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-xs font-bold text-indigo-500 hover:text-indigo-800 uppercase">Cancel</button>
                  <h4 className="font-extrabold text-indigo-900 flex items-center gap-2 mb-4 text-xs uppercase tracking-wider">
                    <Edit2 className="w-4 h-4 text-indigo-600" /> Editing Database User Node: (UID {editingUser.id})
                  </h4>
                  {userSaveSuccess && <div className="mb-4 text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg text-xs font-bold">{userSaveSuccess}</div>}
                  <form onSubmit={handleSaveUserEdit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Registered Username</label>
                      <input required type="text" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Email Credentials</label>
                      <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Security Role</label>
                      <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800">
                        <option value="user">Standard User</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 flex gap-2">
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer">Save Credentials</button>
                      <button type="button" onClick={() => setEditingUser(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-lg cursor-pointer">Close</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Registered user records */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 tracking-tight text-sm">Database Registered Users list</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Real-time user credential accounts retrieved from database.</p>
                  </div>
                  <button onClick={fetchUsers} className="text-blue-600 hover:text-blue-700 text-xs font-bold transition-colors bg-blue-50 px-3 py-1.5 border border-blue-100 rounded-lg">Sync User Catalog List</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Full Username</th>
                        <th className="px-6 py-4">Credential Email</th>
                        <th className="px-6 py-4">Database Node Role</th>
                        <th className="px-6 py-4">Access Rights</th>
                        <th className="px-6 py-4">Actions Node</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {usersList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-10 text-slate-400">Querying database registry nodes...</td>
                        </tr>
                      ) : (
                        usersList.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-slate-900 font-black flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600">
                                {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                              </div>
                              {user.name}
                            </td>
                            <td className="px-6 py-4 text-slate-500">{user.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                {user.role === 'admin' ? "SysAdmin Node" : "Live Auth User"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-slate-500 font-medium">Standard</span>
                            </td>
                            <td className="px-6 py-4 flex gap-1.5 items-center">
                              <button onClick={() => handleEditUserClick(user)} className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 cursor-pointer">
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>
                              {user.email !== 'admin@system.com' && (
                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 text-[11px] font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md border border-red-101 cursor-pointer">
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Global Content Settings & Site Pages Curation */}
          {activeTab === 'alerts' && (
            <div id="pane-alerts" className="animate-fade-in bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="font-extrabold text-slate-900 tracking-tight text-xs uppercase mb-4">Deal Alert Subscriptions ({priceAlertsList.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-500 uppercase font-bold bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Old Price</th>
                      <th className="px-4 py-3">New Price</th>
                      <th className="px-4 py-3">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceAlertsList.map(a => (
                      <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{a.email}</td>
                        <td className="px-4 py-3 text-slate-700 truncate max-w-[200px]">{a.product_name}</td>
                        <td className="px-4 py-3 text-slate-600">£{a.old_price}</td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">£{a.new_price}</td>
                        <td className="px-4 py-3 text-slate-500">{new Date(a.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'blogs' && (
            <div id="pane-blogs" className="space-y-6 animate-fade-in text-left">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    Affiliate Blog Management
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Create, edit, and manage high-ranking UK shopping guides. You can link blogs to specific products for better conversion.
                  </p>
                </div>
                
                <button
                  onClick={handleCreateNewBlog}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all self-start md:self-center flex items-center gap-2 cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Write New Blog Post
                </button>
              </div>

              {editingBlog && (
                <div className="bg-white border-2 border-indigo-100 p-6 rounded-2xl relative shadow-xl">
                  <button onClick={() => setEditingBlog(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-2 mb-6 text-sm uppercase tracking-tight">
                    {editingBlog.id ? `Editing Article: ${blogForm.title}` : 'Drafting New Affiliate Shopping Guide'}
                  </h4>
                  
                  {blogSaveSuccess && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">{blogSaveSuccess}</div>}
                  
                  <form onSubmit={handleSaveBlog} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase font-black text-slate-500 mb-1.5">Article Headline (SEO Focused)</label>
                      <input required type="text" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all" placeholder="e.g., Why the Dyson V15 is the Best Vacuum for UK Pet Owners in 2026" />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-500 mb-1.5">URL Slug (Unique)</label>
                      <input required type="text" value={blogForm.slug} onChange={e => setBlogForm({...blogForm, slug: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all" placeholder="dyson-v15-pet-review-uk" />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-500 mb-1.5">Linked Product ID (Optional)</label>
                      <select value={blogForm.product_id} onChange={e => setBlogForm({...blogForm, product_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all">
                        <option value="">None</option>
                        {productsList.map(p => (
                          <option key={p.db_id} value={p.db_id}>{p.ai_title} (£{p.price})</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase font-black text-slate-500 mb-1.5">Article Content (Markdown Supported)</label>
                      <textarea required rows={12} value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 font-mono focus:bg-white focus:border-indigo-500 outline-none transition-all leading-relaxed" placeholder="Write your premium shopping guide here..." />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-500 mb-1.5">Banner Image URL</label>
                      <input type="text" value={blogForm.banner_image} onChange={e => setBlogForm({...blogForm, banner_image: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all" placeholder="https://..." />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-500 mb-1.5">Direct Affiliate Link</label>
                      <input type="text" value={blogForm.affiliate_link} onChange={e => setBlogForm({...blogForm, affiliate_link: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all" placeholder="https://amazon.co.uk/..." />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-500 mb-1.5">Tags (Comma Separated)</label>
                      <input type="text" value={blogForm.tags} onChange={e => setBlogForm({...blogForm, tags: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all" placeholder="#ukdeals, #luxury, #homecare" />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5">SEO Meta Title</label>
                        <input type="text" value={blogForm.seo_title} onChange={e => setBlogForm({...blogForm, seo_title: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:border-indigo-500 outline-none transition-all" placeholder="Max 60 chars" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5">SEO Meta Description</label>
                        <input type="text" value={blogForm.seo_description} onChange={e => setBlogForm({...blogForm, seo_description: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:border-indigo-500 outline-none transition-all" placeholder="Max 160 chars" />
                      </div>
                    </div>

                    <div className="md:col-span-2 flex gap-3 pt-4">
                      <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200">
                        {editingBlog.id ? 'Save Article Updates' : 'Publish New Shopping Guide'}
                      </button>
                      <button type="button" onClick={() => setEditingBlog(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[11px] uppercase tracking-widest py-3.5 rounded-xl transition-all">
                        Discard Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Blog Post Information</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Product</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {blogLoading ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-xs font-bold">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Retrieving article catalog...
                          </td>
                        </tr>
                      ) : blogsList.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                            No articles found in database.
                          </td>
                        </tr>
                      ) : blogsList.map((blog) => (
                        <tr key={blog.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <img src={blog.banner_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=100'} className="w-12 h-12 rounded-lg object-cover bg-slate-100" referrerPolicy="no-referrer" />
                              <div className="min-w-0">
                                <h5 className="font-extrabold text-slate-900 text-xs truncate group-hover:text-indigo-600 transition-colors">{blog.title}</h5>
                                <p className="text-[10px] text-slate-400 font-bold mt-0.5">/{blog.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            {blog.product_id ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100">
                                  <Sparkles className="w-3 h-3" /> Linked to Product #{blog.product_id}
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold text-slate-300">No linked item</span>
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleEditBlogClick(blog)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'pages' && (
            <div id="pane-pages" className="space-y-8 animate-fade-in">
              
              {/* Part 1: Global Header / Footer Navigation Manager */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h3 className="font-extrabold text-slate-900 tracking-tight text-xs uppercase flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-600" /> Dynamic Header & Footer Navigations content
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">Manage header/footer active columns, promotions banner badge, and global copyright notices dynamically.</p>
                </div>

                {globalSettingsSuccess && (
                  <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs font-bold">
                    {globalSettingsSuccess}
                  </div>
                )}

                <form onSubmit={handleSaveGlobalSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Subsection: Header */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <span>📢</span> Header Bar & Subheader Quicklinks
                    </h4>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Subheader Promo text</label>
                      <input 
                        required 
                        type="text" 
                        value={globalSettings.header_promo} 
                        onChange={e => setGlobalSettings({ ...globalSettings, header_promo: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                        placeholder="New Releases in UK"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Header Quick Links (Raw JSON Array)</label>
                      <textarea 
                        rows={3} 
                        value={globalSettings.header_links} 
                        onChange={e => setGlobalSettings({ ...globalSettings, header_links: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
                        placeholder='[{"label":"My Wishlist","href":"#","isWishlist":true}]'
                      />
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">{"Format example: [{\"label\":\"Today Deals\",\"href\":\"/deals\"}]"}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Footer Copyright Text</label>
                      <input 
                        required 
                        type="text" 
                        value={globalSettings.footer_copyright} 
                        onChange={e => setGlobalSettings({ ...globalSettings, footer_copyright: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                        placeholder="© 2026, UKStander.shop, Inc. or affiliates"
                      />
                    </div>
                    <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100 flex flex-col gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-800 uppercase mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> Rainforest Amazon API Key
                        </label>
                        <input 
                          type="password" 
                          value={globalSettings.rainforest_api_key} 
                          onChange={e => setGlobalSettings({ ...globalSettings, rainforest_api_key: e.target.value })} 
                          className="w-full bg-white border border-emerald-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                          placeholder="Paste your Rainforest API key here"
                        />
                        <p className="text-[9px] text-emerald-600 font-medium mt-1 leading-tight">
                          When the 100-request limit is reached, simply update this key with a new one from your Rainforest account to resume automated hunts.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-emerald-100/60 pt-3">
                        <div>
                          <label className="block text-[10px] font-bold text-emerald-800 uppercase mb-1">
                            Sort Amazon Search By
                          </label>
                          <select
                            value={globalSettings.rainforest_sort_by || 'average_customer_reviews'}
                            onChange={e => setGlobalSettings({ ...globalSettings, rainforest_sort_by: e.target.value })}
                            className="w-full bg-white border border-emerald-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                          >
                            <option value="average_customer_reviews">Top Reviewed (Highly Rated)</option>
                            <option value="featured">Featured / Default Amazon Sort</option>
                            <option value="most_recent">Most Recent / New Releases</option>
                            <option value="price_low_to_high">Price: Low to High</option>
                            <option value="price_high_to_low">Price: High to Low</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-emerald-800 uppercase mb-1">
                            Min Rating Filter (e.g. 4.2)
                          </label>
                          <input 
                            type="number" 
                            step="0.1"
                            min="0"
                            max="5"
                            value={globalSettings.rainforest_min_rating || '0.0'} 
                            onChange={e => setGlobalSettings({ ...globalSettings, rainforest_min_rating: e.target.value })} 
                            className="w-full bg-white border border-emerald-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                            placeholder="0.0 for no limit"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-emerald-800 uppercase mb-1">
                            Min Review Count Filter
                          </label>
                          <input 
                            type="number" 
                            min="0"
                            value={globalSettings.rainforest_min_reviews || '0'} 
                            onChange={e => setGlobalSettings({ ...globalSettings, rainforest_min_reviews: e.target.value })} 
                            className="w-full bg-white border border-emerald-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                            placeholder="0 for no limit"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subsection: Footer Grid columns */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <span>🧭</span> Footer Columns & Navigation Links Grid
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Col 1 Heading</label>
                        <input required type="text" value={globalSettings.footer_company_heading} onChange={e => setGlobalSettings({ ...globalSettings, footer_company_heading: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Col 1 Links JSON</label>
                        <input required type="text" value={globalSettings.footer_company_links} onChange={e => setGlobalSettings({ ...globalSettings, footer_company_links: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono focus:outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Col 2 Heading</label>
                        <input required type="text" value={globalSettings.footer_support_heading} onChange={e => setGlobalSettings({ ...globalSettings, footer_support_heading: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Col 2 Links JSON</label>
                        <input required type="text" value={globalSettings.footer_support_links} onChange={e => setGlobalSettings({ ...globalSettings, footer_support_links: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono focus:outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Col 3 Heading</label>
                        <input required type="text" value={globalSettings.footer_legal_heading} onChange={e => setGlobalSettings({ ...globalSettings, footer_legal_heading: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Col 3 Links JSON</label>
                        <input required type="text" value={globalSettings.footer_legal_links} onChange={e => setGlobalSettings({ ...globalSettings, footer_legal_links: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono focus:outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Col 4 Heading</label>
                        <input required type="text" value={globalSettings.footer_resource_heading} onChange={e => setGlobalSettings({ ...globalSettings, footer_resource_heading: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Col 4 Links JSON</label>
                        <input required type="text" value={globalSettings.footer_resource_links} onChange={e => setGlobalSettings({ ...globalSettings, footer_resource_links: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono focus:outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={globalSettingsLoading}
                      className="bg-indigo-650 bg-[#0B192C] text-white hover:bg-indigo-700 font-bold text-xs uppercase px-6 py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {globalSettingsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-green-300" />} Save Navigations & Footer Core Settings
                    </button>
                  </div>
                </form>
              </div>

              {/* Part 2: Static Page Overrides */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-3">Informational Pages</h4>
                  <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">Choose which page header/footer static informational pages you wish to override dynamically in the database.</p>
                  <div className="space-y-1.5">
                    {[
                      { key: 'privacy', label: 'Privacy Policy' },
                      { key: 'terms', label: 'Terms of Service' },
                      { key: 'disclosure', label: 'Affiliate Disclosure' },
                      { key: 'cookies', label: 'Cookies Policy' },
                      { key: 'contact', label: 'Contact Us Center' },
                      { key: 'data-rights', label: 'User Data Rights' },
                      { key: 'about-ukstander', label: 'About Us Page' },
                      { key: 'blog', label: 'Smart Shopping Blog' },
                      { key: 'affiliate', label: 'Affiliates Portal' },
                      { key: 'returns', label: 'Returns & Replacements' },
                    ].map((p) => (
                      <button 
                        key={p.key}
                        onClick={() => handlePageChange(p.key)}
                        type="button"
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between border ${selectedPageKey === p.key ? 'bg-indigo-50 text-indigo-700 border-indigo-100 font-black' : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-50'}`}
                      >
                        {p.label}
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editor Workspace Column */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col h-[520px]">
                  <h3 className="font-extrabold text-slate-900 tracking-tight text-xs uppercase mb-1">Curation Editor Panel</h3>
                  <p className="text-[11px] text-slate-400 mb-4">Editing Page Database Key: <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold">{selectedPageKey}</span></p>
                  
                  {pageSaveSuccess && <div className="mb-4 text-green-800 bg-green-50 border border-green-200 p-3.5 rounded-xl text-xs font-bold">{pageSaveSuccess}</div>}

                  <form onSubmit={handleSavePage} className="flex-1 flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">Site-Rendered Page Title</label>
                      <input 
                        required 
                        type="text" 
                        value={pageTitle} 
                        onChange={e => setPageTitle(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-500" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">Article Body Content (Formatted text paragraphs)</label>
                      <textarea 
                        required 
                        value={pageContent} 
                        onChange={e => setPageContent(e.target.value)} 
                        className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed font-mono resize-none" 
                        placeholder="Input standard body text for output..." 
                      />
                    </div>
                    <button type="submit" className="self-end bg-[#0B192C] hover:bg-indigo-700 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg flex items-center gap-1 cursor-pointer">
                      <Check className="w-4 h-4 text-emerald-400" /> Save Curation Page
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: Support Takeover Desk */}
          {activeTab === 'chats' && (
            <div id="pane-chats" className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Chats List Column */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden h-[510px]">
                <div className="bg-[#0b192c] text-white p-4 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-red-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest leading-none">Support Takeovers</h3>
                  </div>
                  <span className="text-[10px] bg-red-600/30 text-red-300 font-bold px-2 py-0.5 rounded-md">Live Escort</span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {activeChats.length === 0 ? (
                    <div className="text-center py-16 px-4">
                      <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <h4 className="text-xs font-bold text-slate-700">No Active Assistance Conversations</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Users are presently being handled fully by autonomous AI agents.</p>
                    </div>
                  ) : (
                    activeChats.map((chat) => (
                      <div 
                        key={chat.email} 
                        onClick={() => handleSelectUserChat(chat.email)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col gap-1.5 ${selectedUserEmail === chat.email ? 'bg-blue-50/50 border-r-4 border-r-blue-600' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-800 truncate max-w-[150px]">{chat.email}</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${chat.status === 'admin' ? 'bg-indigo-100 text-indigo-700' : chat.status === 'connecting' ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-emerald-50 text-emerald-700'}`}>
                            {chat.status}
                          </span>
                        </div>
                        {/* Takeover Control buttons */}
                        <div className="flex gap-2 mt-1">
                          {chat.status !== 'admin' ? (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleTakeoverChat(chat.email, 'admin'); }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold uppercase px-2 py-1 rounded-sm cursor-pointer"
                            >
                              Takeover Live
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleTakeoverChat(chat.email, 'ai'); }}
                              className="bg-slate-300 hover:bg-slate-400 text-slate-700 text-[9px] font-bold uppercase px-2 py-1 rounded-sm cursor-pointer"
                            >
                              Return to AI
                            </button>
                          )}
                          <span className="text-[9px] text-slate-400 self-center font-bold">Session Active</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Message Panel */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs h-[510px] flex flex-col">
                {selectedUserEmail ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 truncate max-w-[250px]">Chatting: {selectedUserEmail}</h4>
                        <span className="text-[9px] text-slate-500 font-bold">Human takeover mode active</span>
                      </div>
                      <button onClick={() => setSelectedUserEmail(null)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase">Disconnect View</button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-50/50">
                      {chatLoading ? (
                        <div className="text-center py-20 text-[10px] text-slate-400 flex items-center justify-center gap-1"><Loader2 className="w-4 h-4 animate-spin" strokeWidth={3} /> Syncing conversation nodes...</div>
                      ) : chatMessages.length === 0 ? (
                        <div className="text-center py-20 text-[10px] text-slate-400">Send first message greeting to establish secure endpoint.</div>
                      ) : (
                        chatMessages.map((msg, i) => {
                          const isUser = msg.role === 'user';
                          return (
                            <div key={i} className={`flex flex-col max-w-[80%] ${isUser ? 'align-start self-start text-left' : 'align-end self-end text-right ml-auto'}`}>
                              <span className="text-[9px] text-slate-400 uppercase font-black mb-0.5 px-1">{isUser ? 'User Shopper' : 'You (Admin)'}</span>
                              <div className={`p-3 rounded-2xl text-xs font-bold leading-relaxed shadow-sm ${isUser ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none' : 'bg-[#0B192C] text-white rounded-tr-none'}`}>
                                {msg.content}
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                    <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
                      <input 
                        type="text" 
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(); }}
                        placeholder="Type standard reply message..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      />
                      <button 
                        onClick={handleSendReply}
                        className="bg-[#0B192C] hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" /> Send
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                    <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Takeovers Workspace Area</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">Select an active assistance candidate conversation on the left panel to takeover controls and start chatting live.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div id="pane-trends" className="space-y-6 animate-fade-in text-left">
              {/* Header section with indicators and scrape triggers */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                    UK Retail Search & Trend Discovery Engine (Autopilot)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Autonomous deep crawler checking Google Trends UK, Amazon Hot Releases, and UK viral seasonal triggers. Under review suggestions will remain pending here until assigned an affiliate marker and approved.
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Autopilot Active
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Next scheduled scan: Daily 02:00 AM Vector Grid Sync
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input 
                      type="text" 
                      id="rf-search-term"
                      placeholder="Amazon UK Search (e.g. air fryer)" 
                      className="text-xs border border-slate-200 rounded-lg px-3 py-2 w-full max-w-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const term = (document.getElementById('rf-search-term') as HTMLInputElement)?.value || 'tech';
                        setLoadingTrends(true);
                        fetch('/api/admin/trigger-rainforest-sync', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ search_term: term })
                        })
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) {
                            setSuccess(data.message);
                            fetchTrendSuggestions();
                          } else {
                            alert(data.error || "Rainforest sync failed");
                          }
                        })
                        .finally(() => setLoadingTrends(false));
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <Globe className="w-3.5 h-3.5" /> Rainforest Sync
                    </button>
                  </div>
                </div>
                
                <button
                  id="btn-discover-now"
                  disabled={loadingTrends}
                  onClick={() => {
                    setLoadingTrends(true);
                    fetch('/api/admin/trend-suggestions/discover', { method: 'POST' })
                      .then(res => res.json())
                      .then(data => {
                        if (data.success) {
                          setSuccess(`Discovered and uploaded ${data.count || 10} new UK product trend suggestions successfully!`);
                          fetchTrendSuggestions();
                        } else {
                          alert(data.error || "Trend auto-discovery failed");
                        }
                      })
                      .catch(err => {
                        console.error(err);
                        alert("Failed to reach discovery server API.");
                      })
                      .finally(() => setLoadingTrends(false));
                  }}
                  className="bg-[#0B192C] hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all self-start md:self-center flex items-center gap-2 cursor-pointer flex-shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingTrends ? 'animate-spin' : ''}`} />
                  {loadingTrends ? 'Scanning search grids...' : 'Trigger Trend Scan Now'}
                </button>
              </div>

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center justify-between">
                  <span>{success}</span>
                  <button onClick={() => setSuccess('')} className="text-emerald-500 hover:text-emerald-700 uppercase text-[10px]">Dismiss</button>
                </div>
              )}

              {/* Toggle sub-tabs for Trends section */}
              <div className="flex border-b border-slate-200 mt-2">
                <button
                  onClick={() => setTrendsSubTab('spotter')}
                  className={`px-6 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${trendsSubTab === 'spotter' ? 'border-indigo-600 text-indigo-600 font-extrabold shadow-2xs' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  Predictive Trend Spotter (LLaMA-3 Analytics)
                </button>
                <button
                  onClick={() => setTrendsSubTab('hunt')}
                  className={`px-6 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${trendsSubTab === 'hunt' ? 'border-indigo-600 text-indigo-600 font-extrabold shadow-2xs' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <Globe className="w-4 h-4 text-emerald-500" />
                  Candidate Products Hunt & Vetting
                </button>
              </div>

              {trendsSubTab === 'hunt' && (
                /* Main Grid display area */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-left">
                
                {/* Left Side: Candidates list */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <h4 className="text-xs uppercase font-black tracking-widest text-slate-500">
                      Discovered Candidates ({trendSuggestions.length})
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold">Unpublished retail items awaiting vetting</span>
                  </div>

                  {loadingTrends && trendSuggestions.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-bold">Synchronizing trending UK commerce databases...</p>
                    </div>
                  ) : trendSuggestions.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                      <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-bold">No trending suggestions exist currently.</p>
                      <button 
                        onClick={() => {
                          setLoadingTrends(true);
                          fetch('/api/admin/trend-suggestions/discover', { method: 'POST' })
                            .then(res => res.json())
                            .then(() => fetchTrendSuggestions())
                            .catch(err => console.error(err))
                            .finally(() => setLoadingTrends(false));
                        }} 
                        className="mt-3 text-indigo-600 hover:text-indigo-800 font-bold text-xs"
                      >
                        Click here to seed candidates
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {trendSuggestions.map((sug) => {
                        const isPending = sug.status === 'pending';
                        const isApproved = sug.status === 'approved';
                        const isRejected = sug.status === 'rejected';

                        return (
                          <div 
                            key={sug.id} 
                            onClick={() => {
                              setSelectedSuggestion(sug);
                              setApproveForm({
                                title: sug.suggested_title,
                                description: sug.suggested_description,
                                price: sug.price.toString(),
                                category: sug.category,
                                image_url: sug.image_url,
                                affiliate_link: sug.source_or_amazon_link || ''
                              });
                            }}
                            className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${selectedSuggestion?.id === sug.id ? 'border-indigo-600 ring-2 ring-indigo-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'}`}
                          >
                            <div className="flex flex-col sm:flex-row gap-4">
                              <img 
                                src={sug.image_url} 
                                alt={sug.suggested_title} 
                                className="w-full sm:w-20 sm:h-20 h-32 rounded-lg object-cover bg-slate-100 flex-shrink-0 border border-slate-100"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1">
                                  <span className="text-[9px] uppercase font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                    {sug.category}
                                  </span>
                                  
                                  {isPending && (
                                    <span className="text-[9px] uppercase font-black bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">
                                      Pending Approval
                                    </span>
                                  )}
                                  {isApproved && (
                                    <span className="text-[9px] uppercase font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                                      Approved
                                    </span>
                                  )}
                                  {isRejected && (
                                    <span className="text-[9px] uppercase font-black bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100">
                                      Rejected
                                    </span>
                                  )}
                                </div>

                                <h5 className="font-extrabold text-slate-900 text-xs mt-1 truncate">
                                  {sug.suggested_title}
                                </h5>
                                
                                <span className="text-[10px] font-black text-slate-700 block mt-0.5">
                                  Estimated Retail: £{parseFloat(sug.price).toFixed(2)}
                                </span>

                                <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-medium">
                                  {sug.suggested_description}
                                </p>

                                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2 text-[10px] text-slate-600 font-bold leading-normal">
                                  <span className="text-slate-400 font-black uppercase text-[9px] block">UK Search Trigger:</span>
                                  {sug.trend_reason}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Side: Vetting Form Panel */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-fit self-start">
                  {selectedSuggestion ? (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs uppercase font-black tracking-wider text-slate-700">
                            Vetting Workflow Console
                          </h4>
                          <button 
                            onClick={() => setSelectedSuggestion(null)} 
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase">
                          Candidacy ID: #{selectedSuggestion.id}
                        </p>
                      </div>

                      {selectedSuggestion.status === 'approved' ? (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs font-bold leading-relaxed text-center">
                          <Check className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                          This seasonal trend alternative has already been approved and merged into the active storefront products database successfully!
                        </div>
                      ) : selectedSuggestion.status === 'rejected' ? (
                        <div className="bg-slate-50 border border-slate-100 text-slate-500 p-4 rounded-xl text-xs font-bold leading-relaxed text-center">
                          <X className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                          This suggestion was rejected. You can edit fields and re-approve below to override and bring to listing!
                        </div>
                      ) : null}

                      {/* Display original reference link */}
                      <div className="bg-[#0B192C] text-white p-3 rounded-xl text-xs flex items-center justify-between gap-2 border border-slate-800">
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] uppercase font-black text-slate-400 block">External retail seed:</span>
                          <span className="font-bold text-[10px] truncate block text-slate-200">
                            {selectedSuggestion.source_or_amazon_link}
                          </span>
                        </div>
                        <a 
                          href={selectedSuggestion.source_or_amazon_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg text-white flex-shrink-0 transition-all flex items-center justify-center"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {/* Form Details */}
                      <div className="space-y-3 text-left">
                        <div>
                          <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">
                            Editable Display Title
                          </label>
                          <input 
                            type="text" 
                            value={approveForm.title} 
                            onChange={(e) => setApproveForm({ ...approveForm, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">
                              Price (£)
                            </label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={approveForm.price} 
                              onChange={(e) => setApproveForm({ ...approveForm, price: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">
                              Category
                            </label>
                            <select 
                              value={approveForm.category} 
                              onChange={(e) => setApproveForm({ ...approveForm, category: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                            >
                              <option value="Electronics">Electronics</option>
                              <option value="Home & Kitchen">Home & Kitchen</option>
                              <option value="Health & Beauty">Health & Beauty</option>
                              <option value="Computers">Computers</option>
                              <option value="Fashion & Accessories">Fashion & Accessories</option>
                              <option value="Garden & Outdoors">Garden & Outdoors</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">
                            Listing Rich Description
                          </label>
                          <textarea 
                            rows={3}
                            value={approveForm.description} 
                            onChange={(e) => setApproveForm({ ...approveForm, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">
                            Cover Image URL
                          </label>
                          <input 
                            type="text" 
                            value={approveForm.image_url} 
                            onChange={(e) => setApproveForm({ ...approveForm, image_url: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                          />
                          <div className="mt-2 text-center rounded-lg overflow-hidden border border-slate-100 bg-slate-50 max-h-24 flex items-center justify-center">
                            <img 
                              src={approveForm.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=150"} 
                              alt="Thumbnail preview" 
                              className="object-cover h-24 w-full"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <label className="block text-[10px] uppercase font-black text-rose-600 mb-1">
                            Your Amazon Associates Affiliate Link
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. https://www.amazon.co.uk/dp/B08XM1X3GG?tag=yourtag-21" 
                            value={approveForm.affiliate_link} 
                            onChange={(e) => setApproveForm({ ...approveForm, affiliate_link: e.target.value })}
                            className="w-full bg-rose-50/50 border border-rose-200 rounded-lg px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white placeholder-rose-300"
                          />
                          <span className="text-[9px] text-slate-400 font-bold block mt-1 leading-normal">
                            Mandatory field. Your UK Associate custom tag is automatically appended to ensure referral credits accrue correctly on customer click-outs.
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-3 pt-2">
                        <button
                          onClick={() => {
                            if (!approveForm.affiliate_link) {
                              alert("Please input your custom Amazon UK affiliate link to ensure credit is captured upon customer checkouts!");
                              return;
                            }
                            
                            setTrendsActionLoader('approving');
                            fetch('/api/admin/trend-suggestions/approve', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                id: selectedSuggestion.id,
                                title: approveForm.title,
                                description: approveForm.description,
                                price: approveForm.price,
                                category: approveForm.category,
                                image_url: approveForm.image_url,
                                affiliate_link: approveForm.affiliate_link
                              })
                            })
                              .then(res => res.json())
                              .then(data => {
                                if (data.success) {
                                  setSuccess(`Published ${approveForm.title} live! AI is now writing the SEO blog post...`);
                                  
                                  // Phase 2: AI Blog Generation
                                  setTrendsActionLoader('generating_blog');
                                  return fetch('/api/admin/blogs/generate-ai', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ suggestionId: selectedSuggestion.id })
                                  });
                                } else {
                                  throw new Error(data.error || "Publishing failed");
                                }
                              })
                              .then(res => res.json())
                              .then(data => {
                                if (data.success) {
                                  setSuccess("Success: Product published and AI Blog Post generated perfectly!");
                                  setSelectedSuggestion(null);
                                  fetchTrendSuggestions();
                                  fetchBlogs();
                                  fetchAnalytics();
                                } else {
                                  alert("Product published, but AI blog post failed: " + (data.error || "Unknown error"));
                                  setSelectedSuggestion(null);
                                  fetchTrendSuggestions();
                                }
                              })
                              .catch(err => {
                                console.error(err);
                                alert("Error: " + err.message);
                              })
                              .finally(() => setTrendsActionLoader(null));
                          }}
                          disabled={!!trendsActionLoader || selectedSuggestion.status === 'approved'}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs p-4 rounded-xl shadow-lg shadow-emerald-100 transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Sparkles className={`w-4 h-4 ${trendsActionLoader === 'generating_blog' ? 'animate-spin' : ''}`} />
                          {trendsActionLoader === 'approving' ? 'Publishing Live...' : 
                           trendsActionLoader === 'generating_blog' ? 'AI Writing Article...' : 
                           'Publish Live & Create AI Blog'}
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (!confirm("Are you sure you want to dismiss this trend candidate recommendation?")) return;
                              setTrendsActionLoader('rejecting');
                              fetch('/api/admin/trend-suggestions/reject', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: selectedSuggestion.id })
                              })
                                .then(res => res.json())
                                .then(data => {
                                  if (data.success) {
                                    setSuccess("Successfully rejected the trend suggestion");
                                    setSelectedSuggestion(null);
                                    fetchTrendSuggestions();
                                  } else {
                                    alert(data.error || "Rejection failed");
                                  }
                                })
                                .catch(err => {
                                  console.error(err);
                                  alert("Failed to connect to backend reject api.");
                                })
                                .finally(() => setTrendsActionLoader(null));
                            }}
                            disabled={!!trendsActionLoader || selectedSuggestion.status === 'rejected'}
                            className="flex-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-bold text-xs px-4 py-3 rounded-lg transition-all text-center cursor-pointer"
                          >
                            Reject & Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Sparkles className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                      <h4 className="text-xs uppercase font-black text-slate-700">Suggestion Inspector</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Click on any discovered UK retail item from the checklist to pre-populate catalogs, configure associate tokens, and publish instantly.
                      </p>
                    </div>
                  )}
                </div>

              </div>
              )}

              {trendsSubTab === 'spotter' && (
                <div className="space-y-6 animate-fade-in text-left">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
                      <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Predictive Engine</div>
                      <div className="text-xl font-extrabold text-indigo-600 mt-1">Groq LLaMA-3</div>
                      <div className="text-[10px] text-emerald-600 mt-1 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active & Synced Routine
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
                      <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Daily Trend Volume</div>
                      <div className="text-xl font-extrabold text-slate-800 mt-1">{predictiveTrends.length} Payloads</div>
                      <div className="text-[10px] text-indigo-600 mt-1 font-bold">Target criteria: 30-40 daily</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
                      <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Market Context</div>
                      <div className="text-xl font-extrabold text-slate-800 mt-1">United Kingdom</div>
                      <div className="text-[10px] text-slate-500 mt-1 font-bold">Strict Google.co.uk patterns</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
                      <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Top Intent category</div>
                      <div className="text-xl font-extrabold text-amber-600 mt-1">Seasonal / Commercial</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-bold">High conversion opportunity</div>
                    </div>
                  </div>

                  {/* Filter and Trigger Bar */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search LLaMA-3 trends..."
                        value={predictiveSearch}
                        onChange={(e) => setPredictiveSearch(e.target.value)}
                        className="text-xs border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    
                    <button
                      onClick={() => {
                        setGeneratingPredictive(true);
                        fetch('/api/admin/predictive-trends/generate', { method: 'POST' })
                          .then(res => res.json())
                          .then(data => {
                            if (data.success) {
                              setPredictiveTrends(data.trends || []);
                              setSuccess(`Expert Predictive Agent refreshed UK trends successfully!`);
                            } else {
                              alert("Generation failed: " + (data.error || "Unknown error"));
                            }
                          })
                          .catch(err => {
                            console.error(err);
                            alert("Failed to communicate with Groq LLaMA-3 Engine.");
                          })
                          .finally(() => setGeneratingPredictive(false));
                      }}
                      disabled={generatingPredictive}
                      className="bg-[#0B192C] hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                    >
                      <Sparkles className={`w-4 h-4 ${generatingPredictive ? 'animate-spin text-amber-400' : 'text-indigo-400'}`} />
                      {generatingPredictive ? 'LLaMA-3 Spotting Trends...' : 'Force Regenerate Trends via LLaMA-3'}
                    </button>
                  </div>

                  {/* Trends List & Cards */}
                  {loadingPredictive ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-bold">Synchronising Predictive Spotter analytics...</p>
                    </div>
                  ) : predictiveTrends.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                      <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-bold">No predictive trends loaded currently.</p>
                      <button
                        onClick={() => {
                          setLoadingPredictive(true);
                          fetch('/api/admin/predictive-trends')
                            .then(res => res.json())
                            .then(data => {
                              if (Array.isArray(data)) setPredictiveTrends(data);
                            })
                            .finally(() => setLoadingPredictive(false));
                        }}
                        className="mt-2 text-indigo-600 font-bold text-xs hover:underline cursor-pointer"
                      >
                        Click to reload database results
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-wider text-slate-500">
                              <th className="px-6 py-4">Trend ID</th>
                              <th className="px-6 py-4">Topic / Trend Title</th>
                              <th className="px-6 py-4">Category</th>
                              <th className="px-6 py-4">Target Date Range</th>
                              <th className="px-6 py-4 text-center">Volume Intent</th>
                              <th className="px-6 py-4">SEO Tags / Keywords</th>
                              <th className="px-6 py-4">Niche Product Ideas</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                            {(() => {
                              const filtered = predictiveTrends.filter(t => 
                                !predictiveSearch || 
                                t.topic.toLowerCase().includes(predictiveSearch.toLowerCase()) || 
                                t.category.toLowerCase().includes(predictiveSearch.toLowerCase()) || 
                                t.trend_id.toLowerCase().includes(predictiveSearch.toLowerCase())
                              );
                              if (filtered.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold">
                                      No matching trends found.
                                    </td>
                                  </tr>
                                );
                              }
                              return filtered.map((trend) => (
                                <tr key={trend.id || trend.trend_id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4 font-mono text-[10px] text-slate-500 whitespace-nowrap font-bold">{trend.trend_id}</td>
                                  <td className="px-6 py-4 font-black text-slate-900 focus:outline-none">
                                    <div className="flex items-center gap-1.5">
                                      {trend.topic}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-indigo-50 text-indigo-700 uppercase tracking-wider border border-indigo-100/50">
                                      {trend.category}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap font-bold">{trend.target_date_range}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span style={{
                                      backgroundColor: trend.search_volume_intent?.toLowerCase().includes('exponential') ? '#FEF2F2' : trend.search_volume_intent?.toLowerCase().includes('high') ? '#FFFBEB' : '#EFF6FF',
                                      color: trend.search_volume_intent?.toLowerCase().includes('exponential') ? '#DC2626' : trend.search_volume_intent?.toLowerCase().includes('high') ? '#D97706' : '#2563EB',
                                      borderColor: trend.search_volume_intent?.toLowerCase().includes('exponential') ? '#FEE2E2' : trend.search_volume_intent?.toLowerCase().includes('high') ? '#FEF3C7' : '#DBEAFE'
                                    }} className="px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider">
                                      {trend.search_volume_intent}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 max-w-xs">
                                    <div className="flex flex-wrap gap-1">
                                      {Array.isArray(trend.recommended_keywords) && trend.recommended_keywords.map((kw: string, i: number) => (
                                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono font-bold">#{kw}</span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 max-w-xs">
                                    <div className="flex flex-wrap gap-1">
                                      {Array.isArray(trend.product_niche_ideas) && trend.product_niche_ideas.map((idea: string, i: number) => (
                                        <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100/50 px-2 py-0.5 rounded-lg font-bold">{idea}</span>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'emails' && (
            <div id="pane-emails" className="space-y-6 animate-fade-in text-left font-sans">
              {/* Header Title card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                    <Mail className="w-5 h-5 text-indigo-600 animate-pulse" />
                    UKStander Email Forwarding Center (ImprovMX Integration)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                    Verify domain propagation, monitor MX/SPF settings to prevent bounce backs, and instantly provision custom professional email aliases for ukstander.shop.
                  </p>
                </div>
                <button
                  onClick={fetchEmailStatus}
                  disabled={loadingEmails}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap self-start"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingEmails ? 'animate-spin' : ''}`} />
                  Refresh Connection
                </button>
              </div>

              {emailStatusError && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-700 text-xs flex items-center gap-3 font-semibold">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  <div>
                    <span className="font-bold">ImprovMX Status Error: </span>
                    {emailStatusError}
                  </div>
                </div>
              )}

              {loadingEmails && !domainStatus ? (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-200">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Fetching secure domain routing credentials from ImprovMX server...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left column: Domain health & diagnostics */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                      <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider mb-4">Domain Diagnostic Health</h4>
                      
                      {domainStatus ? (
                        <div className="space-y-4 text-xs text-slate-600 font-semibold font-sans">
                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="font-bold text-slate-700">Domain:</span>
                            <span className="font-mono text-indigo-600 font-extrabold">{domainStatus.domain || 'ukstander.shop'}</span>
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="font-bold text-slate-700">ImprovMX Status:</span>
                            {domainStatus.active ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">FORWARDING ACTIVE</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">PENDING DNS SETUP</span>
                            )}
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="font-bold text-slate-700">MX Setting:</span>
                            {domainStatus.mx && (domainStatus.mx.valid || domainStatus.mx.correct) ? (
                              <span className="flex items-center gap-1 font-bold text-green-600">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 font-bold text-rose-600">
                                <AlertCircle className="w-3.5 h-3.5" /> Action Required
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="font-bold text-slate-700">SPF Setting:</span>
                            {domainStatus.spf && (domainStatus.spf.valid || domainStatus.spf.correct) ? (
                              <span className="flex items-center gap-1 font-bold text-green-600">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 font-bold text-rose-600">
                                <AlertCircle className="w-3.5 h-3.5" /> No SPF Record
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 font-medium">No domain status retrieved. Click Refresh to query.</p>
                      )}
                    </div>

                    <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200">
                      <h4 className="text-xs font-black uppercase text-amber-800 tracking-wider mb-2">📌 Setup Guide (URDU / ENG)</h4>
                      <p className="text-[11px] text-amber-900 font-bold mb-3 leading-relaxed">
                        Agar email bounce ho rahi ha "Address not found", toh iska matlab DNS configure hy par slow hy ya records missing hn:
                      </p>
                      <ol className="list-decimal list-inside text-[11px] text-amber-900 space-y-2 leading-relaxed font-semibold">
                        <li>
                          <span className="font-bold">Add SPF in Hostinger (Crucial):</span> Go to Hostinger DNS Panel, create a new record:
                          <div className="bg-white p-2 rounded-lg border border-amber-100 font-mono text-[9px] mt-1 select-all break-all text-slate-700 font-medium">
                            TXT | Name: @ | Value: v=spf1 include:spf.improvmx.com ~all
                          </div>
                        </li>
                        <li>
                          <span className="font-bold">MX Records setting checker:</span> Ensure MX records point strictly to:
                          <div className="bg-white p-2 rounded-lg border border-amber-100 font-mono text-[9px] mt-1 space-y-1 text-slate-700 font-medium pb-2">
                            <div>mx1.improvmx.com (Priority 10)</div>
                            <div>mx2.improvmx.com (Priority 20)</div>
                          </div>
                        </li>
                        <li>
                          <span className="font-bold">Wait for Propagation:</span> Changes take 5 to 60 minutes to go live across international servers.
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Right column: Create and Manage Aliases */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Create New Alias card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                      <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider mb-4">Create New Custom Alias</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Alias Name (e.g. info, query)</label>
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              value={newAliasName}
                              onChange={(e) => setNewAliasName(e.target.value)}
                              placeholder="contact"
                              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 pr-28 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold font-mono text-slate-800 bg-slate-50"
                            />
                            <span className="absolute right-3 text-xs text-slate-400 font-black">@ukstander.shop</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Forwards Target Email</label>
                          <input
                            type="email"
                            value={newAliasForward}
                            onChange={(e) => setNewAliasForward(e.target.value)}
                            placeholder="ukstander.co@gmail.com"
                            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-slate-700 bg-slate-50"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => {
                            if (!newAliasName) {
                              alert("Please enter an alias name (e.g. 'help').");
                              return;
                            }
                            setAddingAlias(true);
                            fetch('/api/admin/email-forwarding/aliases', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ alias: newAliasName.trim(), forward: newAliasForward.trim() })
                            })
                            .then(res => res.json())
                            .then(data => {
                              if (data.success) {
                                setSuccess(`Instantly created email alias ${newAliasName}@ukstander.shop!`);
                                setNewAliasName('');
                                fetchEmailStatus();
                              } else {
                                alert(data.error || "Could not save alias in ImprovMX.");
                              }
                            })
                            .catch(err => {
                              console.error(err);
                              alert("Failed to connect to backend alias API.");
                            })
                            .finally(() => setAddingAlias(false));
                          }}
                          disabled={addingAlias}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
                        >
                          {addingAlias ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Creating Live Routing...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Activate Email Alias
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Custom aliases roster */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                      <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider mb-4">Active Custom Forwarding Roster</h4>
                      
                      {domainAliases.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-xs">
                          <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="font-semibold">No custom aliases retrieved from ImprovMX yet.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
                                <th className="pb-3 select-none">Sender Alias Email Address</th>
                                <th className="pb-3 select-none font-sans">Forwarding Destination Target</th>
                                <th className="pb-3 select-none text-center">Live Status</th>
                                <th className="pb-3 text-right">Task</th>
                              </tr>
                            </thead>
                            <tbody>
                              {domainAliases.map((al: any) => (
                                <tr key={al.alias} className="border-b border-slate-100/60 hover:bg-slate-50/50">
                                  <td className="py-3 font-mono font-bold text-slate-800">
                                    {al.alias}@ukstander.shop
                                  </td>
                                  <td className="py-3 text-slate-600 font-semibold font-mono">
                                    {al.forward}
                                  </td>
                                  <td className="py-3 text-center">
                                    <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 uppercase">
                                      Active
                                    </span>
                                  </td>
                                  <td className="py-3 text-right">
                                    <button
                                      onClick={() => {
                                        if (!confirm(`Are you absolutely sure you want to permanently delete alias: ${al.alias}@ukstander.shop?`)) return;
                                        setDeletingAlias(al.alias);
                                        fetch(`/api/admin/email-forwarding/aliases/${al.alias}`, {
                                          method: 'DELETE'
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                          if (data.success) {
                                            setSuccess(`Permanently removed ${al.alias}@ukstander.shop alias.`);
                                            fetchEmailStatus();
                                          } else {
                                            alert(data.error || "Deletion call failed.");
                                          }
                                        })
                                        .catch(err => {
                                          console.error(err);
                                          alert("Failed to submit deletion parameter.");
                                        })
                                        .finally(() => setDeletingAlias(null));
                                      }}
                                      disabled={deletingAlias === al.alias}
                                      className="text-rose-500 hover:text-rose-700 disabled:opacity-50 transition-all font-bold tracking-tight uppercase text-[10px] cursor-pointer"
                                    >
                                      {deletingAlias === al.alias ? 'Deleting...' : 'Delete'}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          

        </div>

      </main></div></div>);
}
