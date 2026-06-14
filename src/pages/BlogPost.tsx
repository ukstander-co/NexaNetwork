import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { 
  Calendar, 
  User, 
  Heart, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  ShieldCheck,
  Send,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [commentStatus, setCommentStatus] = useState('');
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
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

  const fetchBlog = () => {
    fetch(`/api/blogs/${slug}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlog();
    
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(console.error);
  }, [slug]);

  useEffect(() => {
    if (blog) {
      document.title = `${blog.seo_title || blog.title} | UKStander Shopping Blog`;
      
      // Dynamic Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', blog.seo_description || blog.title);
    }
  }, [blog]);

  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    allProducts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ["All Categories", ...Array.from(cats)];
  }, [allProducts]);

  const handleLike = () => {
    if (liked) return;
    fetch(`/api/blogs/${blog.id}/like`, { method: 'POST' })
      .then(() => {
        setLiked(true);
        setBlog({ ...blog, likes: (blog.likes || 0) + 1 });
      });
  };

  const handleDislike = () => {
    if (disliked) return;
    fetch(`/api/blogs/${blog.id}/dislike`, { method: 'POST' })
      .then(() => {
        setDisliked(true);
        setBlog({ ...blog, dislikes: (blog.dislikes || 0) + 1 });
      });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !userEmail) return;

    setCommentStatus('Posting...');
    fetch(`/api/blogs/${blog.id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, comment: commentInput })
    })
      .then(res => res.json())
      .then(() => {
        setCommentInput('');
        setCommentStatus('Comment posted!');
        fetchBlog();
        setTimeout(() => setCommentStatus(''), 3000);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Article Not Found</h2>
          <Link to="/blog" className="text-indigo-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <Header 
        userEmail={userEmail}
        wishlist={wishlist}
        dynamicCategories={dynamicCategories}
        onSearch={(term, category) => {
          navigate(`/user?q=${encodeURIComponent(term)}&category=${encodeURIComponent(category)}`);
        } }
        onFilterWishlist={() => navigate('/user?wishlist=true')}
        onFilterTopDrops={() => navigate('/user?topdrops=true')}
      />

      <main className="flex-1">
        {/* Article Breadcrumbs */}
        <div className="bg-slate-50 border-b border-slate-100 py-4 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-indigo-600">Shopping Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 truncate max-w-[200px]">{blog.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative pt-12 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex flex-wrap gap-3">
                  {(blog.tags || 'UKStander, Curation, Premium').split(',').map((tag: string) => (
                    <span key={tag} className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-indigo-100">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] md:leading-[1.05] selection:bg-indigo-200 font-display">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-8 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-900 overflow-hidden border-2 border-white shadow-xl">
                       <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Author" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Curated By</p>
                      <p className="text-sm font-black text-slate-900">Felix Thompson</p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-200 hidden md:block" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Refreshed</p>
                    <p className="text-sm font-black text-slate-900">
                       {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently'}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-slate-200 hidden md:block" />
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-black text-slate-900">Verified Deal</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group col-span-1"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-emerald-50 rounded-[4rem] group-hover:scale-105 transition-transform duration-700 blur-2xl opacity-50" />
                <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-[3rem] border border-slate-200/50 shadow-2xl">
                  <img 
                    src={blog.banner_image} 
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                    <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 shadow-xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1">UK Availability</p>
                      <p className="text-xl font-black text-slate-900">In Stock Now</p>
                    </div>
                    <button 
                      onClick={handleLike}
                      className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-red-500 shadow-2xl hover:scale-110 transition-transform active:scale-95"
                    >
                      <Heart className={`w-6 h-6 ${liked ? 'fill-red-500' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 pb-32">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10 md:space-y-16">
            {/* SEO Premium Summary */}
            <div className="relative p-6 sm:p-10 bg-white border border-slate-100 rounded-3xl md:rounded-[2.5rem] shadow-sm overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative flex items-start gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-indigo-600">The UKStander Verdict</h3>
                  <p className="text-base sm:text-xl font-medium text-slate-700 leading-relaxed italic">
                    "{blog.seo_description}"
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Only Direct Product Call To Action */}
            <div className="block lg:hidden relative p-1 bg-gradient-to-tr from-indigo-600 via-indigo-600 to-emerald-400 rounded-3xl shadow-xl overflow-hidden group" id="mobile-post-cta-card">
              <div className="bg-[#0B192C] text-white rounded-[1.375rem] p-6 space-y-4">
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase tracking-widest text-[#a5b4fc] mb-1">UK Direct Curation</p>
                   <h4 className="text-xl font-bold font-display leading-tight">
                     Secure this curated deal from verified retailers.
                   </h4>
                </div>
                <button
                  onClick={() => {
                    let targetId = blog.product_id;
                    if (!targetId && allProducts.length > 0 && blog?.title) {
                      const blogTitleLower = blog.title.toLowerCase();
                      let match = allProducts.find(p => 
                        p?.ai_title && (
                          blogTitleLower.includes(p.ai_title.toLowerCase()) || 
                          p.ai_title.toLowerCase().includes(blogTitleLower)
                        )
                      );
                      if (!match) {
                         const blogWords = blogTitleLower.split(' ').filter(w => w.length > 3);
                         match = allProducts.find(p => {
                           if (!p?.ai_title) return false;
                           const pTitleLower = p.ai_title.toLowerCase();
                           return blogWords.some(word => pTitleLower.includes(word));
                         });
                      }
                      if (match) {
                        targetId = match.id;
                      }
                    }
                    if (targetId) {
                      const cleanId = targetId.toString().replace('db-', '');
                      navigate(`/product/db-${cleanId}`);
                    } else if (blog.affiliate_link) {
                      window.open(blog.affiliate_link, '_blank', 'noopener,noreferrer');
                    } else {
                      window.open(`https://www.amazon.co.uk/s?k=${encodeURIComponent(blog.title)}`, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="w-full bg-white text-[#0B192C] py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                >
                  View Product Details <ChevronRight className="w-4 h-4 text-indigo-600 font-bold" />
                </button>
              </div>
            </div>

            {/* Comprehensive Content Body */}
            <article className="prose prose-slate max-w-none 
              prose-h2:text-2xl sm:prose-h2:text-4xl prose-h2:font-black prose-h2:tracking-tight prose-h2:text-slate-900 prose-h2:mt-12 sm:prose-h2:mt-16 prose-h2:mb-6 sm:prose-h2:mb-8 prose-h2:font-display
              prose-p:text-base sm:prose-p:text-xl prose-p:leading-[1.7] sm:prose-p:leading-[1.8] prose-p:text-slate-600 prose-p:font-medium prose-p:mb-6 sm:prose-p:mb-8
              prose-img:rounded-3xl sm:prose-img:rounded-[2.5rem] prose-img:shadow-xl sm:prose-img:shadow-2xl prose-img:my-10 sm:prose-img:my-16
              prose-a:text-indigo-600 prose-a:font-black prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-900 prose-strong:font-extrabold
              prose-ul:space-y-4 sm:prose-ul:space-y-6 prose-li:text-base sm:prose-li:text-lg prose-li:text-slate-600 prose-li:font-medium
            ">
              <Markdown>{blog.content}</Markdown>
            </article>

            {/* Special Trust Reinforcement (Psychological Section) */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-[3rem] p-12 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100 rounded-full -mr-24 -mt-24 group-hover:scale-125 transition-transform duration-1000" />
               <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                  <div className="shrink-0">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl shadow-emerald-200">
                      <Zap className="w-10 h-10 text-emerald-600 fill-emerald-600" />
                    </div>
                  </div>
                  <div className="space-y-4 text-center md:text-left">
                    <h4 className="text-2xl font-black text-slate-900 font-display">Stop Comparing. Start Experiencing.</h4>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                      {(() => {
                        const messages = [
                          "The UKStander engine has scanned millions of data points to confirm that this product is the absolute best in its price category. There is no need to waste your precious time checking quality or sourcing—we have completed the research so you can buy with confidence.",
                          "We know your time is premium. We have already verified this product's price and quality. You can stop worrying about checking market trends; UKStander has confirmed the best deal for you.",
                          "Expert decision: Our AI has compared the top 10 products in this category and the results are clear. This product is the finest combination of perfection, price, and durability. Trust with complete peace of mind."
                        ];
                        // Using a simple hash of blog title to keep it consistent per blog but "random" across blogs
                        const index = (blog.title?.length || 0) % messages.length;
                        return messages[index];
                      })()}
                    </p>
                  </div>
               </div>
            </div>

            {/* High-Resolution Gallery */}
            {blog.slider_images && blog.slider_images.length > 0 && (
              <div className="space-y-8 pt-16 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Close-Up Inspection</h3>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-1">Verified Product Visuals</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-100">
                      4K Resolution
                    </div>
                  </div>
                </div>
                <div className="columns-1 md:columns-2 gap-8 space-y-8">
                  {blog.slider_images.map((img: string, i: number) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      className="relative rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 break-inside-avoid"
                    >
                       <img 
                        src={img} 
                        alt={`Inspection ${i+1}`} 
                        className="w-full h-auto object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Community Engagement */}
            <div className="space-y-12 pt-16 border-t border-slate-100">
               <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Community Feedback</h3>
                 <div className="flex items-center gap-1">
                   <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                   <span className="text-sm font-black text-slate-900">{blog.likes || 0} Saved</span>
                 </div>
               </div>

                {/* Comment Interaction */}
                {userEmail ? (
                 <div className="bg-slate-50 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200/50">
                   <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0B192C] flex items-center justify-center text-white font-black text-base sm:text-lg shrink-0">
                       {userEmail[0].toUpperCase()}
                     </div>
                     <form onSubmit={handleComment} className="w-full flex-1 space-y-4 sm:space-y-6">
                       <div className="space-y-1 text-[10px] sm:text-xs">
                         <p className="font-black uppercase tracking-widest text-slate-400">Replying as</p>
                         <p className="font-black text-slate-900">{userEmail}</p>
                       </div>
                       <textarea 
                         value={commentInput}
                         onChange={e => setCommentInput(e.target.value)}
                         placeholder="Join the discussion regarding this curation..."
                         className="w-full bg-white border border-slate-200 rounded-2xl md:rounded-[1.5rem] p-4 sm:p-6 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium min-h-[120px]"
                       />
                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                         <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                           {commentStatus || "Please adhere to community guidelines"}
                         </p>
                         <button type="submit" className="bg-[#0B192C] text-white px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 cursor-pointer">
                           Send Comment <Send className="w-3.5 h-3.5" />
                         </button>
                       </div>
                     </form>
                   </div>
                 </div>
                ) : (
                 <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl md:rounded-[2.5rem] p-6 sm:p-12 text-center">
                    <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-2">Want to join the conversation?</h4>
                    <p className="text-slate-500 text-sm font-medium mb-6 sm:mb-8">Sign in to share your thoughts with other UK shoppers.</p>
                    <Link to="/login" className="bg-indigo-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all inline-flex items-center gap-2 shadow-lg shadow-indigo-100">
                      Join UKStander <ChevronRight className="w-4 h-4" />
                    </Link>
                 </div>
                )}

               {/* Render Comments */}
               <div className="space-y-10">
                 {blog.comments && blog.comments.map((c: any) => (
                    <div key={c.id} className="group flex gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-black text-lg shadow-sm group-hover:border-indigo-200 transition-colors shrink-0">
                        {c.user_email[0].toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-slate-900">{c.user_email}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Active Now'}
                          </p>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {c.comment}
                        </p>
                      </div>
                    </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Premium Sidebar Content */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-10">
              {/* Main Call to Action Card */}
              <div className="relative p-1 bg-gradient-to-tr from-indigo-600 via-indigo-600 to-emerald-400 rounded-[3rem] shadow-2xl shadow-indigo-200 group overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="bg-[#0B192C] text-white rounded-[2.8rem] p-10 relative z-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">UK Direct</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                       <ExternalLink className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-3xl font-black leading-tight selection:bg-indigo-600 font-display">
                      Secure this deal before prices fluctuate.
                    </h4>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      Our real-time engine monitors UK retailer inventory. Availability and direct pricing verified.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      console.log("[BuyNow] Clicked. Blog title:", blog.title);
                      let targetId = blog.product_id;
                      
                      // Enhanced Matching Logic
                      if (!targetId && allProducts.length > 0 && blog?.title) {
                        const blogTitleLower = blog.title.toLowerCase();
                        
                        // 1. Exact or include match
                        let match = allProducts.find(p => 
                          p?.ai_title && (
                            blogTitleLower.includes(p.ai_title.toLowerCase()) || 
                            p.ai_title.toLowerCase().includes(blogTitleLower)
                          )
                        );
                        
                        // 2. Try partial word matches if no direct match
                        if (!match) {
                           const blogWords = blogTitleLower.split(' ').filter(w => w.length > 3);
                           match = allProducts.find(p => {
                             if (!p?.ai_title) return false;
                             const pTitleLower = p.ai_title.toLowerCase();
                             return blogWords.some(word => pTitleLower.includes(word));
                           });
                        }

                        if (match) {
                          console.log("[BuyNow] Found match in catalog:", match.ai_title);
                          targetId = match.id;
                        }
                      }

                      if (targetId) {
                        // Ensure ID format is correct for URL (stripping any existing db- prefix and re-adding)
                        const cleanId = targetId.toString().replace('db-', '');
                        console.log("[BuyNow] Navigating to product page:", cleanId);
                        navigate(`/product/db-${cleanId}`);
                      } else if (blog.affiliate_link) {
                        console.log("[BuyNow] Opening affiliate link:", blog.affiliate_link);
                        window.open(blog.affiliate_link, '_blank', 'noopener,noreferrer');
                      } else {
                        const searchUrl = `https://www.amazon.co.uk/s?k=${encodeURIComponent(blog.title)}`;
                        console.log("[BuyNow] Search fallback to Amazon UK:", searchUrl);
                        window.open(searchUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="w-full bg-white text-[#0B192C] py-5 rounded-[1.8rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all shadow-xl hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    View Product Details <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="pt-6 space-y-4">
                    {[
                      { icon: ShieldCheck, text: "Verified UK Retailer Link" },
                      { icon: TrendingUp, text: "Lowest Price Match" },
                      { icon: Award, text: "UKStander Quality Shield" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 group/item">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-white/10 transition-colors">
                           <item.icon className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/item:text-white transition-colors">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Newsletter Contextual Card */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/30 rounded-full filter blur-3xl" />
                <div className="relative z-10 space-y-6">
                  <h4 className="text-xl font-black">Stay updated on UK shopping shifts.</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Subscribe to receive weekly deal rotations, SEO insights, and exclusive budget optimization reports.
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Email" 
                      className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 text-xs font-medium focus:outline-none focus:border-indigo-500"
                    />
                    <button className="bg-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                       Join
                    </button>
                  </div>
                </div>
              </div>

              {/* Author/Transparency Info */}
              <div className="space-y-6 px-4">
                <div className="h-px bg-slate-100 w-full" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Affiliate Disclosure</p>
                <p className="text-[10px] leading-relaxed text-slate-400 font-medium">
                  We generate commissions through curated partner links. This does not impact our editorial integrity or your final purchase price.
                </p>
                <Link to="/info/disclosure" className="text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Read Full Policy <ArrowLeft className="w-3 h-3 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
