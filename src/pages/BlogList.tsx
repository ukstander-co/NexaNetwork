import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Tag, MessageSquare, Heart, Sparkles, ChevronDown, ExternalLink } from 'lucide-react';
import { m as motion } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiClient } from '../utils/apiClient';
import { getProductSeoUrl } from '../utils/seo';

export default function BlogList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const uniqueTags = useMemo(() => {
    const s = new Set<string>();
    blogs.forEach((b: any) => {
      if (b.tags) {
        b.tags.split(',').forEach((t: string) => {
          const clean = t.trim();
          if (clean && clean.length > 1) {
            s.add(clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase());
          }
        });
      }
    });
    return ['All', ...Array.from(s)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    if (selectedTag === 'All') return blogs;
    return blogs.filter((b: any) => 
      b.tags && b.tags.split(',').some((t: string) => t.trim().toLowerCase() === selectedTag.toLowerCase())
    );
  }, [blogs, selectedTag]);

  const getUserEmail = () => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u)?.email : 'shopper.uk@gmail.com';
    } catch { return 'shopper.uk@gmail.com'; }
  };
  const userEmail = getUserEmail();
  
  const getWishlist = () => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch { return []; }
  };
  const [wishlist, setWishlist] = useState<string[]>(getWishlist());

  useEffect(() => {
    const cachedBlogsStr = localStorage.getItem('shadow_blogs_list');
    const cachedProductsStr = localStorage.getItem('shadow_products_list_blog');
    
    if (cachedBlogsStr) {
      try {
        setBlogs(JSON.parse(cachedBlogsStr));
        setLoading(false);
      } catch (e) {
        console.error("Failed to parse cached blogs", e);
      }
    }
    
    if (cachedProductsStr) {
      try {
        setAllProducts(JSON.parse(cachedProductsStr));
      } catch (e) {
        console.error("Failed to parse cached products", e);
      }
    }

    apiClient.request('/api/blogs', { cacheTTL: 30000, useOfflineFallback: true })
      .then(data => {
        if (Array.isArray(data)) {
          console.log("[BlogList] Data received:", data.length, "blogs");
          setBlogs(data);
          localStorage.setItem('shadow_blogs_list', JSON.stringify(data));
        } else {
          console.error("[BlogList] Fetched data is not an array:", data);
          setBlogs([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blogs:", err);
        if (!cachedBlogsStr) {
          setBlogs([]);
        }
        setLoading(false);
      });

    apiClient.request('/api/products', { cacheTTL: 30000, useOfflineFallback: true })
      .then(data => {
        if (Array.isArray(data)) {
          setAllProducts(data);
          localStorage.setItem('shadow_products_list_blog', JSON.stringify(data));
        }
      })
      .catch(console.error);
  }, []);

  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    allProducts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ["All Categories", ...Array.from(cats)];
  }, [allProducts]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        userEmail={userEmail}
        wishlist={wishlist}
        dynamicCategories={dynamicCategories}
        onSearch={(term, category) => {
          navigate(`/user?q=${encodeURIComponent(term)}&category=${encodeURIComponent(category)}`);
        } }
        onFilterWishlist={() => navigate('/user?wishlist=true')}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-6 text-center max-w-sm">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-600/20 rounded-full"></div>
              <div className="absolute top-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
            <div>
              <p className="text-slate-900 font-black uppercase tracking-[0.2em] text-xs mb-2">Curating Excellence</p>
              <p className="text-slate-400 text-sm font-medium">AI is currently researching the latest UK market trends and SEO-ranking guides...</p>
            </div>
          </div>
        </div>
      ) : (
        <main className="flex-1 pb-24">
          {/* High-End Immersive Hero */}
          <section className="relative overflow-hidden bg-[#0B192C] pt-20 pb-32 mb-12">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-indigo-500 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-red-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Live UK Shopping Intelligence</span>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-8">
                    Smart Guides for <span className="text-indigo-400">UK Buyers.</span>
                  </h1>
                  <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-10">
                    Discover hand-curated shopping guides, deep tech reviews, and budget optimization strategies—all refreshed daily by our UKStander AI engine.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => {
                        if (blogs && blogs.length > 0) {
                          navigate(`/blog/${blogs[0].slug}`);
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
                    >
                       Trending Stories <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="flex -space-x-3 mt-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B192C] bg-slate-800 flex items-center justify-center overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Expert" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-[#0B192C] bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white">
                        +1K
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="hidden lg:block relative"
                >
                  <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10">
                    <img 
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800" 
                      alt="UK Lifestyle" 
                      className="w-full aspect-[4/5] object-cover"
                    />
                    <div className="absolute inset-x-4 bottom-4 p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 text-white">
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Editor's Pick</p>
                       <h3 className="text-xl font-bold mb-2 leading-tight tracking-tight">The 2026 Home Setup: Optimising for Efficiency</h3>
                       <div className="flex items-center gap-4 text-[10px] font-bold text-white/60">
                          <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Lifestyle</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 12 Comments</span>
                       </div>
                    </div>
                  </div>
                  {/* Floating Depth Elements */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl"></div>
                </motion.div>
              </div>

              {/* Scroll Indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              >
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Explore Guides</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ChevronDown className="w-5 h-5 text-indigo-500/50" />
                </motion.div>
              </motion.div>
            </div>
          </section>

          <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
            {/* Scrollable Tag Filtering Bar on Mobile */}
            {blogs.length > 0 && uniqueTags.length > 1 && (
              <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-6 pt-2 mb-2 scrollbar-none" id="mobile-tag-scrollbar">
                {uniqueTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTag(tag);
                    }}
                    className={`px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all shrink-0 cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'bg-white border-slate-200 text-slate-650'
                    }`}
                    style={selectedTag === tag ? { backgroundColor: '#4F46E5', borderColor: '#4F46E5', color: '#ffffff' } : undefined}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {filteredBlogs.length === 0 ? (
              <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-12 md:p-24 text-center border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                  <Tag className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-3">No articles found</h2>
                <p className="text-slate-500 max-w-sm mx-auto text-xs md:text-sm font-medium">We couldn't find any UK shopping guides under the "{selectedTag}" category. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {filteredBlogs.map((blog, idx) => (
                    <motion.div 
                      key={blog.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => navigate(`/blog/${blog.slug}`)}
                      className="group block h-full bg-white rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 active:scale-[0.98] relative cursor-pointer"
                    >
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img 
                          src={blog.banner_image || "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=600"} 
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest bg-indigo-600 px-4 py-2 rounded-xl">Read Guide</span>
                            <div className="flex gap-2">
                               <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"><Heart className="w-4 h-4" /></div>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   console.log("[BlogList] Buy Now clicked. Blog title:", blog.title);
                                   let targetId = blog.product_id; let match: any = null;
                                   
                                   if (!targetId && allProducts.length > 0 && blog?.title) {
                                     const blogTitleLower = blog.title.toLowerCase();
                                     match = allProducts.find(p => 
                                       (p?.ai_title && (
                                         blogTitleLower.includes(p.ai_title.toLowerCase()) || 
                                         p.ai_title.toLowerCase().includes(blogTitleLower)
                                       )) ||
                                       (p?.name && (
                                         blogTitleLower.includes(p.name.toLowerCase()) || 
                                         p.name.toLowerCase().includes(blogTitleLower)
                                       ))
                                     );
                                     
                                     if (!match) {
                                       const blogWords = blogTitleLower.split(' ').filter(w => w.length > 3);
                                       match = allProducts.find(p => {
                                         const pTitle = p?.ai_title || p?.name;
                                         if (!pTitle) return false;
                                         const pTitleLower = pTitle.toLowerCase();
                                         return blogWords.some(word => pTitleLower.includes(word));
                                       });
                                     }

                                     if (match) {
                                       console.log("[BlogList] Found match:", match.ai_title || match.name);
                                       targetId = match.id;
                                     }
                                   }

                                   if (targetId) {
                                     const finalTitle = match?.ai_title || match?.name || blog.title;
                                     navigate(getProductSeoUrl(targetId, finalTitle));
                                   } else if (blog.affiliate_link) {
                                     window.open(blog.affiliate_link, '_blank', 'noopener,noreferrer');
                                   } else {
                                     window.open(`https://www.amazon.co.uk/s?k=${encodeURIComponent(blog.title)}`, '_blank', 'noopener,noreferrer');
                                   }
                                 }}
                                 className="h-8 px-4 rounded-full bg-emerald-500 backdrop-blur-md flex items-center gap-2 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all border border-white/20 whitespace-nowrap cursor-pointer"
                               >
                                 Buy Now <ExternalLink className="w-3 h-3" />
                               </button>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-4 left-4 flex gap-2">
                          <div className="bg-white/90 backdrop-blur-md text-[#0B192C] text-[9px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full shadow-xl">
                            UK Guide 2026
                          </div>
                        </div>
                      </div>
                      <div className="p-5 sm:p-8">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-0.5 bg-indigo-600"></div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Curation</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                             <Sparkles className="w-3 h-3 text-indigo-400" /> AI Verified
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-4 leading-[1.1] tracking-tight">
                          {blog.title}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-8 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                          {blog.seo_description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-8">
                           {(blog.tags || '').split(',').slice(0, 3).map((tag: string) => (
                             <span key={tag} className="text-[9px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                               #{tag.trim().replace(/\s/g, '')}
                             </span>
                           ))}
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Calendar className="w-4 h-4 text-slate-400" />
                             </div>
                             <div>
                               <p className="text-[10px] font-black text-slate-900 uppercase">Published</p>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                 {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Today'}
                               </span>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 console.log("[BlogList] Quick Buy clicked. Blog title:", blog.title); let match: any = null;
                                 let targetId = blog.product_id;
                                 
                                 if (!targetId && allProducts.length > 0 && blog?.title) {
                                   const blogTitleLower = blog.title.toLowerCase();
                                   match = allProducts.find(p => 
                                     (p?.ai_title && (
                                       blogTitleLower.includes(p.ai_title.toLowerCase()) || 
                                       p.ai_title.toLowerCase().includes(blogTitleLower)
                                     )) ||
                                     (p?.name && (
                                       blogTitleLower.includes(p.name.toLowerCase()) || 
                                       p.name.toLowerCase().includes(blogTitleLower)
                                     ))
                                   );
                                   
                                   if (!match) {
                                     const blogWords = blogTitleLower.split(' ').filter(w => w.length > 3);
                                     match = allProducts.find(p => {
                                       const pTitle = p?.ai_title || p?.name;
                                       if (!pTitle) return false;
                                       const pTitleLower = pTitle.toLowerCase();
                                       return blogWords.some(word => pTitleLower.includes(word));
                                     });
                                   }

                                   if (match) {
                                     console.log("[BlogList] Found match:", match.ai_title || match.name);
                                     targetId = match.id;
                                   }
                                 }

                                 if (targetId) {
                                   const finalTitle = match?.ai_title || match?.name || blog.title;
                                   navigate(getProductSeoUrl(targetId, finalTitle));
                                 } else if (blog.affiliate_link) {
                                   window.open(blog.affiliate_link, '_blank', 'noopener,noreferrer');
                                 } else {
                                   window.open(`https://www.amazon.co.uk/s?k=${encodeURIComponent(blog.title)}`, '_blank', 'noopener,noreferrer');
                                 }
                               }}
                               className="h-10 px-6 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border border-emerald-100 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                             >
                               Quick Buy <ExternalLink className="w-3.5 h-3.5" />
                             </button>
                             <motion.div 
                               whileHover={{ scale: 1.1, rotate: 90 }}
                               className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500"
                             >
                               <ChevronRight className="w-5 h-5" />
                             </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}
