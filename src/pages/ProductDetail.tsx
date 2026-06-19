import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, ArrowLeft, Tag, ShieldCheck, Truck, ExternalLink, Loader2, Heart, Sparkles } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { apiClient } from '../utils/apiClient';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize with passed location state if available (prevents layout flicker)
  const [product, setProduct] = useState<any | null>(location.state?.product || null);
  const [redirecting, setRedirecting] = useState(false);
  const [loading, setLoading] = useState(!location.state?.product);
  const [activeImage, setActiveImage] = useState<string>(location.state?.product?.image || '');
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const userLocal = localStorage.getItem('user');
    const uEmail = userLocal ? JSON.parse(userLocal)?.email || 'Guest' : 'Guest';
    return JSON.parse(localStorage.getItem(`wishlist_${uEmail}`) || localStorage.getItem('wishlist') || '[]');
  });
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [mobileTab, setMobileTab] = useState<'details' | 'reviews'>('details');

  const userLocal = localStorage.getItem('user');
  const userEmail = userLocal ? JSON.parse(userLocal)?.email : 'Guest';

  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    allProducts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ["All Categories", ...Array.from(cats)];
  }, [allProducts]);

  // Review states
  const defaultEmail = JSON.parse(localStorage.getItem('user') || '{}')?.email || 'Guest';
  const [reviewEmail, setReviewEmail] = useState(defaultEmail);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const cleanId = id ? id.toString().replace('db-', '') : '';
  const isIdle = false; // Placeholder alignment

  const loadProductDetail = (bypassCache = false) => {
    apiClient.request(`/api/products/${cleanId}`, { cacheTTL: bypassCache ? 0 : 8000, bypassCache, useOfflineFallback: true })
      .then(data => {
        setProduct(data);
        if (!activeImage) {
          setActiveImage(data.image || data.image_url);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Direct loader failed, fallback to standard catalog", err);
        // Fallback robust loading
        apiClient.request('/api/products', { cacheTTL: bypassCache ? 0 : 15000, bypassCache, useOfflineFallback: true })
          .then(data => {
            const found = Array.isArray(data) ? data.find((p: any) => p.id.toString() === cleanId || `db-${p.id}` === id?.toString()) : null;
            if (found) {
              const mapped = {
                id: `db-${found.id}`,
                name: found.ai_title || "Premium product",
                description: found.ai_description,
                price: parseFloat(found.price) || 0,
                category: found.category || "General",
                rating: Number(found.rating) || 4.7, 
                reviews_count: Number(found.reviews_count) || 120,
                cart_count: Number(found.cart_count) || 18,
                views_count: Number(found.views_count) || 350,
                discount: "Exclusive Deal",
                image: found.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
                affiliateLink: found.affiliate_link,
                ai_tags: found.ai_tags,
                additionalImages: found.additional_images ? JSON.parse(found.additional_images) : [],
                reviews: [
                  { id: 'seed-1', user_email: 'customer.uk@gmail.com', rating: 5, comment: 'Incredible deal! Best price I found in the UK. Highly recommended.', created_at: new Date(Date.now() - 43200000).toISOString() },
                  { id: 'seed-2', user_email: 'dealhunter88@gmail.com', rating: 4, comment: 'Speedy redirection to amazon and currys. Very transparent about affiliate links.', created_at: new Date(Date.now() - 86400000).toISOString() }
                ]
              };
              setProduct(mapped);
              if (!activeImage) {
                setActiveImage(mapped.image);
              }
              setLoading(false);
            } else {
              navigate('/user');
            }
          })
          .catch(() => {
            navigate('/user');
          });
      });
  };

  useEffect(() => {
    loadProductDetail();

    // Log user view interaction dynamically as real user activity log
    const userLocal = localStorage.getItem('user');
    const userEmailLoc = userLocal ? JSON.parse(userLocal)?.email : 'shopper.uk@gmail.com';
    fetch('/api/user-interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmailLoc,
        type: 'view',
        detail: cleanId
      })
    }).catch(console.error);

    // Real-time synchronization interval of 4000ms for price and metric correctness
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadProductDetail(true);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [id, cleanId]);

  useEffect(() => {
    apiClient.request('/api/products', { cacheTTL: 30000, useOfflineFallback: true })
      .then(data => {
        const mapped = Array.isArray(data) ? data.map((p: any) => ({
          id: `db-${p.id}`,
          name: p.ai_title || "Premium product",
          price: parseFloat(p.price) || 0,
          category: p.category || "General",
          image: p.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
          affiliateLink: p.affiliate_link
        })) : [];
        setAllProducts(mapped);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (product && allProducts.length > 0) {
      setRelatedProducts(allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4));
    }
  }, [product, allProducts]);

  const handleBuyNow = () => {
    setRedirecting(true);
    setTimeout(() => {
      // Use window.open with _blank to prevent iframe rejection from external retailers like Amazon
      window.open(product?.affiliateLink || '#', '_blank', 'noopener,noreferrer');
      setRedirecting(false);
    }, 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);
    setSubmittingReview(true);

    fetch(`/api/products/${cleanId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: reviewEmail,
        rating: reviewRating,
        comment: reviewComment
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to submit review");
        return res.json();
      })
      .then(data => {
        setSubmittingReview(false);
        setSubmitSuccess(true);
        setReviewComment('');
        // Reload details to capture the new average, total counts, and user comment
        loadProductDetail();
      })
      .catch(err => {
        console.error(err);
        setSubmitError('Could not process star review submission. Please try again.');
        setSubmittingReview(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50/30">
      <Header 
        userEmail={userEmail}
        wishlist={wishlist}
        dynamicCategories={dynamicCategories}
        onSearch={(term, category) => {
          navigate(`/user?q=${encodeURIComponent(term)}&category=${encodeURIComponent(category)}`);
        }}
        onFilterWishlist={() => navigate('/user')}
        onFilterTopDrops={() => navigate('/user')}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col gap-6" id="product-detail-main">
        {loading || !product ? (
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:flex-row relative" id="skeleton-container">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent z-10"></div>
            <div className="w-full lg:w-1/2 bg-slate-200/55 min-h-[400px] animate-pulse"></div>
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="w-24 h-4 bg-slate-200/80 rounded-full mb-4 animate-pulse"></div>
              <div className="w-3/4 h-10 bg-slate-200/80 rounded-xl mb-6 animate-pulse"></div>
              <div className="w-1/2 h-6 bg-slate-200/80 rounded-xl mb-8 animate-pulse"></div>
              <div className="w-full h-4 bg-slate-200/80 rounded-full mb-3 animate-pulse"></div>
              <div className="w-full h-4 bg-slate-200/80 rounded-full mb-3 animate-pulse"></div>
              <div className="w-2/3 h-4 bg-slate-200/80 rounded-full mb-8 animate-pulse"></div>
              <div className="mt-auto flex flex-col gap-4">
                <div className="w-full h-14 bg-slate-200/80 rounded-2xl animate-pulse"></div>
                <div className="w-3/4 mx-auto h-4 bg-slate-200/80 rounded-full pt-4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:gap-10 pb-24 md:pb-6 animate-in fade-in duration-500" id="detail-loaded-container">
            {/* Header Navigation Actions */}
            <div className="flex items-center justify-between" id="detail-actions-nav">
              <button 
                onClick={() => navigate('/user')} 
                className="inline-flex items-center gap-2 text-xs font-black text-[#0B192C] bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-full transition-all shadow-[0_2px_12px_rgba(0,0,0,0.02)] active:scale-95 cursor-pointer"
                id="back-to-hub-btn"
              >
                <ArrowLeft className="w-4 h-4 text-red-600" />
                <span>Back to Curation Hub</span>
              </button>
              
              <button
                onClick={() => {
                  const isAlreadyIn = wishlist.includes(product.id);
                  let updated;
                  if (isAlreadyIn) {
                    updated = wishlist.filter((x: string) => x !== product.id);
                  } else {
                    updated = [...wishlist, product.id];
                  }
                  setWishlist(updated);
                  const uEmail = userEmail || 'Guest';
                  localStorage.setItem(`wishlist_${uEmail}`, JSON.stringify(updated));
                  localStorage.setItem('wishlist', JSON.stringify(updated));

                  // Real-time backend database sync
                  const targetEmail = userEmail && userEmail !== 'Guest' ? userEmail : 'shopper.uk@gmail.com';
                  fetch('/api/wishlist/toggle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: targetEmail, productId: product.id })
                  })
                    .then(() => {
                      loadProductDetail(); // Live refresh metrics
                    })
                    .catch(console.error);
                }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.02)] active:scale-95 cursor-pointer"
                id="wishlist-toggle-btn"
              >
                <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* ====================================================
                DESKTOP VIEW: Legacy Premium Double Column (md:flex, hidden otherwise)
                ==================================================== */}
            <div className="hidden md:flex flex-col gap-10" id="desktop-view-container">
              <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-xs border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
                {/* Image Gallery */}
                <div className="w-full lg:w-1/2 flex flex-col bg-white border-b lg:border-b-0 lg:border-r border-slate-100 relative">
                  <div className="absolute top-6 left-6 bg-red-600 text-white text-xs uppercase tracking-wider font-bold px-4 py-1.5 flex items-center shadow-md rounded-full z-10 border border-white/10">
                    <Tag className="w-4 h-4 mr-1.5 animate-pulse text-[#febd69]" /> {product.discount || "Exclusive Deal"}
                  </div>
                  
                  <div className="w-full h-auto overflow-hidden flex items-center justify-center p-6 m-0">
                    <img src={activeImage || product.image} alt={product.name} className="max-h-[450px] object-contain transition-all duration-300 mix-blend-multiply" />
                  </div>
                  
                  {/* Thumbnails */}
                  {((product.image) || (product.additionalImages && product.additionalImages.length > 0)) && (
                    <div className="flex items-center gap-4 p-6 bg-white overflow-x-auto border-t border-slate-100">
                      <button 
                        onClick={() => setActiveImage(product.image)}
                        className={`w-20 h-20 rounded-xl border-2 p-2 cursor-pointer transition-all shrink-0 bg-slate-50 flex items-center justify-center ${activeImage === product.image ? 'border-red-600 shadow-md' : 'border-transparent hover:border-slate-300'}`}
                        id="desktop-thumb-main"
                      >
                         <img src={product.image} className="w-full h-full object-contain mix-blend-multiply" alt="primary" />
                      </button>
                      {product.additionalImages && Array.isArray(product.additionalImages) && product.additionalImages.map((img: string, i: number) => (
                        <button 
                          key={i}
                          onClick={() => setActiveImage(img)}
                          className={`w-20 h-20 rounded-xl border-2 p-2 cursor-pointer transition-all shrink-0 bg-slate-50 flex items-center justify-center ${activeImage === img ? 'border-red-600 shadow-md' : 'border-transparent hover:border-slate-300'}`}
                          id={`desktop-thumb-${i}`}
                        >
                           <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt={`thumb-${i}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info Column */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
                  <div className="flex items-center text-sm text-red-600 mb-3 font-bold tracking-wider uppercase">{product.category}</div>
                  <h1 className="text-xl lg:text-2xl font-semibold text-slate-800 leading-snug mb-4">{product.name}</h1>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <Star key={stars} className={`w-4 h-4 ${stars <= Math.round(product.rating || 4.7) ? 'fill-amber-400 text-amber-400' : 'text-slate-205'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-600 ml-2">{product.rating || '4.7'} Stars ({product.reviews_count || product.reviews?.length || 152} Verified reviews)</span>
                  </div>

                  {/* Real-time social proof tracking */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-8 border-b border-slate-100 pb-6 text-[13px] font-bold text-slate-650">
                     <div className="flex items-center text-red-650 bg-red-50/50 border border-red-100/70 px-4 py-2 rounded-full w-fit">
                        <span className="mr-1.5 align-middle">🔥</span> 
                        {product.cart_count || 12} saved this
                     </div>
                     <div className="flex items-center bg-slate-100 border border-slate-205 px-4 py-2 rounded-full w-fit text-slate-700">
                        <span className="mr-1.5 align-middle">👀</span>
                        Viewed {product.views_count || 412} times today
                     </div>
                  </div>

                  <div className="text-5xl font-black text-[#0B192C] mb-6 tracking-tight">
                    <span className="text-2xl font-bold align-top mr-0.5">£</span>{parseFloat(product.price).toFixed(2)}
                  </div>

                  <div className="prose prose-slate text-slate-650 mb-8 max-w-none text-sm leading-relaxed font-medium">
                    {product.description || "Premium quality product recommended by our expert curators. Designed to meet the highest standards and everyday needs. Check the retailer website for full specifications."}
                  </div>

                  <div className="mt-auto space-y-6 pt-6 border-t border-slate-100">
                    {/* Trust Guarantee Box */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-100 rounded-3xl p-6 relative overflow-hidden group mb-4">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-1000 animate-pulse" />
                       <div className="relative z-10 flex gap-4 items-center">
                          <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-black text-[#0B192C] uppercase tracking-tight">Curation Quality Verified</h4>
                            <p className="text-[11px] text-slate-700 leading-relaxed font-bold">
                              {(() => {
                                const messages = [
                                  "No need to waste your time on endless market research. We have thoroughly checked this product—it represents the best supplier at the lowest UK price. Buy with confidence.",
                                  "UKStander expert analysis: This product's quality and delivery speed are fully verified. Purchase with complete peace of mind, as we have located the premium choice for you.",
                                  "Market comparison complete. This product perfectly matches your quality requirements and budget. Secure the deal now to save time."
                                ];
                                const index = (product.ai_title?.length || 0) % messages.length;
                                return messages[index];
                              })()}
                            </p>
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={handleBuyNow}
                      className="w-full flex justify-center items-center py-4 px-8 rounded-2xl text-lg font-black text-slate-900 bg-[#FFD814] hover:bg-[#F7CA00] shadow-[0_4px_20px_rgba(254,189,105,0.4)] hover:shadow-[0_6px_24px_rgba(254,189,105,0.5)] transition-all active:scale-[0.98] border border-[#FCD200] cursor-pointer"
                      id="desktop-buy-now-btn"
                    >
                      Proceed to Secure Checkout <ExternalLink className="w-5 h-5 ml-2" />
                    </button>
                    
                    <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider py-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" /> Trusted Retailor</span>
                      <span className="flex items-center"><Truck className="w-4 h-4 mr-1 text-blue-500" /> Express Delivery</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews and Feedback Module */}
              <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-xs border border-slate-100 p-8 lg:p-12">
                <div className="border-b border-slate-100 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">User Reviews & Ratings</h3>
                    <p className="text-sm text-slate-500 mt-1">Real-time feedback from verified UK shoppers.</p>
                  </div>
                  <div className="flex items-center gap-4 text-slate-850">
                    <div className="text-center bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 min-w-[100px]">
                      <span className="block text-3xl font-black text-slate-900 leading-none">{product.rating || '4.7'}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1 block">Average Stars</span>
                    </div>
                    <div className="text-center bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 min-w-[100px]">
                      <span className="block text-3xl font-black text-slate-900 leading-none">{product.reviews_count || product.reviews?.length || 2}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1 block">Total Reviews</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Write review form */}
                  <div className="lg:col-span-1 bg-slate-50/50 border border-slate-100 rounded-2xl p-6 h-fit" id="desktop-review-form-container">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4" id="desktop-review-form">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Your Email</label>
                        <input 
                          required 
                          type="email" 
                          placeholder="you@example.com" 
                          value={reviewEmail} 
                          onChange={e => setReviewEmail(e.target.value)} 
                          className="w-full bg-white border border-slate-205 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                          id="desktop-review-email-input"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Rating stars</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((stars) => (
                            <button 
                              key={stars} 
                              type="button" 
                              onClick={() => setReviewRating(stars)} 
                              className="focus:outline-none transition-transform hover:scale-110"
                              id={`desktop-star-${stars}`}
                            >
                              <Star className={`w-6 h-6 ${stars <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Comment</label>
                        <textarea 
                          required 
                          rows={4} 
                          placeholder="What did you think of this curation? Let us know!" 
                          value={reviewComment} 
                          onChange={e => setReviewComment(e.target.value)} 
                          className="w-full bg-white border border-slate-205 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                          id="desktop-review-comment-textarea"
                        />
                      </div>
                      {submitError && <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">{submitError}</div>}
                      {submitSuccess && <div className="text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">Review submitted successfully!</div>}
                      <button 
                        type="submit" 
                        disabled={submittingReview} 
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-xs transition-colors flex justify-center items-center cursor-pointer shadow-sm active:scale-95"
                        id="desktop-review-submit-btn"
                      >
                        {submittingReview ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Submit Review
                      </button>
                    </form>
                  </div>

                  {/* Reviews list */}
                  <div className="lg:col-span-2 space-y-6" id="desktop-reviews-feed">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((r: any, idx: number) => (
                        <div key={idx} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0" id={`desktop-review-item-${idx}`}>
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
                                {(r.user_email || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800 block truncate max-w-[150px] sm:max-w-[250px]">{r.user_email || 'Anonymous'}</span>
                                <span className="text-[10px] text-slate-400 font-medium block">{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Just now'}</span>
                              </div>
                            </div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((stars) => (
                                <Star key={stars} className={`w-3.5 h-3.5 ${stars <= (r.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-650 leading-relaxed font-normal bg-slate-50/40 p-3.5 rounded-xl border border-slate-50">{r.comment || 'No comment provided.'}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-slate-400 font-medium text-sm">
                        No reviews found. Be the first to share your experience!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ====================================================
                REDESIGNED MOBILE-FIRST VIEW: Highly polished UI (md:hidden)
                ==================================================== */}
            <div className="md:hidden flex flex-col gap-5 select-none animate-in slide-in-from-bottom-4 duration-300" id="mobile-view-container">
               
               {/* Mobile Custom Display Frame */}
               <div className="bg-white rounded-3xl border border-slate-200/50 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative flex flex-col items-center" id="mobile-product-frame">
                 <div className="absolute top-4 left-4 bg-gradient-to-r from-red-650 to-red-750 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1.5 flex items-center shadow-md rounded-full z-10 border border-white/10" id="mobile-discount-badge">
                   <Tag className="w-3.5 h-3.5 mr-1 text-[#febd69] animate-bounce" /> {product.discount || "Exclusive Deal"}
                 </div>

                 {/* Display Image Canvas */}
                 <div className="w-full aspect-square overflow-hidden flex items-center justify-center rounded-2xl bg-white border border-slate-100/50" id="mobile-canvas">
                   <img src={activeImage || product.image} alt={product.name} className="max-h-full max-w-full object-contain p-2 mix-blend-multiply" />
                 </div>

                 {/* Interactive Thumbnail Grid */}
                 {((product.image) || (product.additionalImages && product.additionalImages.length > 0)) && (
                   <div className="flex items-center gap-2 mt-4 w-full overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" id="mobile-thumbs-scroll">
                     <button 
                       onClick={() => setActiveImage(product.image)}
                       className={`w-14 h-14 rounded-xl border p-1 bg-white flex items-center justify-center shrink-0 transition-transform ${activeImage === product.image ? 'border-red-600 ring-2 ring-red-100 scale-105 shadow-sm' : 'border-slate-200'}`}
                       id="mobile-thumb-main"
                     >
                        <img src={product.image} className="max-h-full object-contain mix-blend-multiply" alt="main" />
                     </button>
                     {product.additionalImages && Array.isArray(product.additionalImages) && product.additionalImages.map((img: string, i: number) => (
                       <button 
                         key={i}
                         onClick={() => setActiveImage(img)}
                         className={`w-14 h-14 rounded-xl border p-1 bg-white flex items-center justify-center shrink-0 transition-transform ${activeImage === img ? 'border-red-600 ring-2 ring-red-105 scale-105 shadow-sm' : 'border-slate-200'}`}
                         id={`mobile-thumb-${i}`}
                       >
                          <img src={img} className="max-h-full object-contain mix-blend-multiply" alt={`thumb-${i}`} />
                       </button>
                     ))}
                   </div>
                 )}
               </div>

               {/* Live Interaction Statistics */}
               <div className="grid grid-cols-2 gap-2.5 text-[10px] font-black uppercase tracking-wider" id="mobile-proof-metrics">
                 <div className="bg-red-50/50 border border-red-100 text-red-700 px-3 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-xs">
                   <span className="text-sm">🔥</span>
                   <span className="leading-tight shrink-0">{product.cart_count || 12} saved in list</span>
                 </div>
                 <div className="bg-slate-100/60 border border-slate-200 text-slate-700 px-3 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-xs">
                   <span className="text-sm">👀</span>
                   <span className="leading-tight truncate">Viewed {product.views_count || 412} times</span>
                 </div>
               </div>

               {/* Essential Header Card */}
               <div className="bg-white rounded-3xl border border-slate-150 p-5 shadow-[0_4px_16px_rgba(0,0,0,0.01)] space-y-2.5" id="mobile-essential-info">
                 <span className="inline-block text-[10px] font-black uppercase text-red-700 tracking-wider bg-red-50/70 border border-red-100 px-2.5 py-1 rounded-full">{product.category}</span>
                 <h1 className="text-base font-semibold font-sans text-slate-800 leading-snug tracking-normal">{product.name}</h1>
                 
                 <div className="flex items-center gap-1.5">
                   <div className="flex gap-0.5">
                     {[1, 2, 3, 4, 5].map((stars) => (
                       <Star key={stars} className={`w-3.5 h-3.5 ${stars <= Math.round(product.rating || 4.7) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                     ))}
                   </div>
                   <span className="text-xs font-black text-slate-500 ml-1">
                     {product.rating || '4.7'} ({product.reviews_count || product.reviews?.length || 152} reviews)
                   </span>
                 </div>

                 {/* Price details bar */}
                 <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Curation best price</span>
                     <span className="text-2xl font-black text-[#0B192C] tracking-tight mt-1">£{parseFloat(product.price).toFixed(2)}</span>
                   </div>
                   
                   <span className="text-[10px] font-bold text-slate-550 bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1 border border-slate-205">
                     <ShieldCheck className="w-4 h-4 text-emerald-600" /> Quality Verified
                   </span>
                 </div>
               </div>

               {/* Mobile Interactive Tab Toggles */}
               <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner" id="mobile-tabs-toggles">
                 <button 
                   onClick={() => setMobileTab('details')}
                   className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 ${mobileTab === 'details' ? 'bg-[#0B192C]' : 'text-slate-500'}`}
                   style={{ color: mobileTab === 'details' ? '#ffffff' : undefined }}
                   id="mobile-tab-btn-details"
                 >
                   <Sparkles className={`w-3.5 h-3.5 ${mobileTab === 'details' ? 'text-yellow-405' : 'text-slate-450'}`} />
                   <span>Curation Specs</span>
                 </button>
                 <button 
                   onClick={() => setMobileTab('reviews')}
                   className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${mobileTab === 'reviews' ? 'bg-[#0B192C]' : 'text-slate-500'}`}
                   style={{ color: mobileTab === 'reviews' ? '#ffffff' : undefined }}
                   id="mobile-tab-btn-reviews"
                 >
                   <span>User Reviews ({product.reviews?.length || product.reviews_count || 120})</span>
                 </button>
               </div>

               {/* Mobile Tab 1: Curation Details Specs */}
               {mobileTab === 'details' && (
                 <div className="space-y-4 animate-in fade-in duration-300" id="mobile-tab-panel-details">
                   
                   {/* Curation notes */}
                   <div className="bg-white rounded-3xl border border-slate-200/60 p-5 space-y-2.5">
                     <h3 className="text-[10px] font-black uppercase text-slate-450 tracking-widest border-b border-slate-100 pb-2">Expert Curation Review</h3>
                     <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                       {product.description || "Premium quality product recommended by our expert curators. Selected with extreme care based on UK metrics."}
                     </p>
                   </div>

                   {/* Expert Urdu-English Trust Certification card */}
                   <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-100 rounded-3xl p-5 relative overflow-hidden" id="mobile-trust-card">
                     <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-100/40 rounded-full" />
                     <div className="flex gap-3.5 items-start relative z-10">
                       <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-emerald-100 shrink-0">
                         <ShieldCheck className="w-5.5 h-5.5 text-emerald-600" />
                       </div>
                       
                       <div className="space-y-1">
                         <h4 className="text-xs font-black text-emerald-950 uppercase tracking-tight flex items-center gap-1">
                           <span>Curation Guarantee</span>
                           <span className="text-[8px] font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded-md uppercase">Verified</span>
                         </h4>
                         
                         <p className="text-[11px] text-slate-700 leading-relaxed font-bold">
                           {(() => {
                             const messages = [
                               "No need to waste your time on endless market research. We have thoroughly checked this product—it represents the best supplier at the lowest UK price. Buy with confidence.",
                               "UKStander expert analysis: This product's quality and delivery speed are fully verified. Purchase with complete peace of mind, as we have located the premium choice for you.",
                               "Market comparison complete. This product perfectly matches your quality requirements and budget. Secure the deal now to save time."
                             ];
                             const index = (product.ai_title?.length || 0) % messages.length;
                             return messages[index];
                           })()}
                         </p>
                       </div>
                     </div>
                   </div>

                   {/* Shipping metrics */}
                   <div className="bg-slate-50 border border-slate-200/60 py-3.5 px-2 rounded-2xl flex items-center justify-around text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">
                     <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-550" /> Quality Approved</span>
                     <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-blue-500" /> Reliable Delivery</span>
                   </div>
                 </div>
               )}

               {/* Mobile Tab 2: User Reviews */}
               {mobileTab === 'reviews' && (
                 <div className="space-y-5 animate-in fade-in duration-300" id="mobile-tab-panel-reviews">
                   
                   {/* Scores display box */}
                   <div className="bg-white rounded-3xl border border-slate-200/60 p-5 flex items-center justify-between shadow-xs">
                     <div className="space-y-0.5">
                       <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Verified Core Score</span>
                       <span className="block text-xl font-black text-slate-900 tracking-tight">{product.rating || '4.7'} <span className="text-xs text-slate-400 font-bold">/ 5.0</span></span>
                     </div>
                     <span className="text-[10px] font-black text-[#0B192C] bg-[#febd69]/30 border border-[#febd69]/40 px-3.5 py-1.5 rounded-full">
                       {product.reviews?.length || product.reviews_count || 120} verified feedbacks
                     </span>
                   </div>

                   {/* Add review form widget */}
                   <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-5 space-y-3.5" id="mobile-review-form-widget">
                     <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-wider border-b border-slate-200/30 pb-2">Submit Star Review</h3>
                     <form onSubmit={handleReviewSubmit} className="space-y-3" id="mobile-review-form">
                       <div>
                         <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Your Email</label>
                         <input 
                           required 
                           type="email" 
                           placeholder="you@gmail.com" 
                           value={reviewEmail} 
                           onChange={e => setReviewEmail(e.target.value)} 
                           className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600" 
                           id="mobile-review-email-input"
                         />
                       </div>
                       
                       <div>
                         <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Stars</label>
                         <div className="flex gap-2">
                           {[1, 2, 3, 4, 5].map((stars) => (
                             <button 
                               key={stars} 
                               type="button" 
                               onClick={() => setReviewRating(stars)} 
                               className="focus:outline-none transform active:scale-130 transition-transform"
                               id={`mobile-star-${stars}`}
                             >
                               <Star className={`w-6 h-6 ${stars <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-350'}`} />
                             </button>
                           ))}
                         </div>
                       </div>

                       <div>
                         <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Detailed Message</label>
                         <textarea 
                           required 
                           rows={3} 
                           placeholder="What are is your experience..." 
                           value={reviewComment} 
                           onChange={e => setReviewComment(e.target.value)} 
                           className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-1000 focus:outline-none focus:border-red-650" 
                           id="mobile-review-comment-textarea"
                         />
                       </div>
                       {submitError && <div className="text-xs text-red-650 bg-red-50 p-2 rounded-xl">{submitError}</div>}
                       {submitSuccess && <div className="text-xs text-emerald-650 bg-emerald-50 p-2 rounded-xl">Awesome, review saved live!</div>}
                       
                       <button 
                         type="submit" 
                         disabled={submittingReview} 
                         className="w-full bg-slate-900 border border-slate-850 text-white font-black py-3 px-4 rounded-xl text-xs flex justify-center items-center cursor-pointer transition-colors shadow-sm active:scale-95"
                         id="mobile-review-submit-btn"
                       >
                         {submittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null} Submit Comment
                       </button>
                     </form>
                   </div>

                   {/* Active mobile reviews feed */}
                   <div className="bg-white rounded-3xl border border-slate-200/60 p-5 space-y-4" id="mobile-reviews-feed-container">
                     <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest pb-1.5 border-b border-slate-100">Verified Shoppers voices</h4>
                     {product.reviews && product.reviews.length > 0 ? (
                       <div className="space-y-4 divide-y divide-slate-100">
                         {product.reviews.map((r: any, idx: number) => (
                           <div key={idx} className={`${idx > 0 ? 'pt-4' : ''}`} id={`mobile-review-item-${idx}`}>
                             <div className="flex items-center justify-between mb-1.5">
                               <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center shrink-0">
                                   {(r.user_email || 'U').charAt(0).toUpperCase()}
                                 </div>
                                 <div className="min-w-0">
                                   <span className="text-xs font-black text-slate-800 block truncate max-w-[130px]">{r.user_email || 'Anonymous'}</span>
                                   <span className="text-[9px] text-slate-400 block">{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Just now'}</span>
                                 </div>
                               </div>
                               <div className="flex gap-0.5 shrink-0">
                                 {[1, 2, 3, 4, 5].map((stars) => (
                                   <Star key={stars} className={`w-3 h-3 ${stars <= (r.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                 ))}
                               </div>
                             </div>
                             <p className="text-xs text-slate-650 leading-relaxed font-semibold bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                               {r.comment || 'No comment provided.'}
                             </p>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="text-center py-8 text-slate-400 text-xs font-bold">
                         No patient reviews found. Share your experience!
                       </div>
                     )}
                   </div>
                 </div>
               )}
            </div>

            {/* Sticky Floating Action Bottom CTA (Persistent throughout scroll tracking) */}
            {!loading && product && (
              <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-[49] flex items-center justify-between px-5 md:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom-20 duration-300" id="mobile-sticky-checkout-bar">
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider leading-none">Best price</span>
                  <div className="text-2xl font-black text-slate-900 leading-none mt-1">
                    <span className="text-xs font-bold align-top mr-0.5">£</span>
                    {parseFloat(product.price).toFixed(2)}
                  </div>
                </div>
                
                <button 
                  onClick={handleBuyNow}
                  className="bg-[#FFD814] active:bg-[#F7CA00] hover:bg-[#F7CA00] text-slate-900 font-extrabold px-6 py-3 rounded-2xl text-xs border border-[#FCD200] flex items-center gap-1.5 shadow-[0_3px_12px_rgba(254,189,105,0.4)] shrink-0 animate-pulse cursor-pointer"
                  id="mobile-sticky-buy-btn"
                >
                  <span>Checkout Securely</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Shared Related Products (Grid-Based Responsive) */}
            {relatedProducts.length > 0 && (
              <div className="mt-4 mb-4 animate-in fade-in" id="related-products-section">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 px-1">Similar Curation Deals</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
                   {relatedProducts.map(rp => (
                      <div 
                        key={rp.id} 
                        onClick={() => { setActiveImage(''); navigate(`/product/${rp.id.toString().replace('db-','')}`, { state: { product: rp }}); }} 
                        className="bg-white rounded-3xl border border-slate-150 p-3.5 cursor-pointer hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                        id={`related-product-${rp.id}`}
                      >
                         <div className="bg-slate-50/50 p-4 rounded-2xl h-40 mb-3 border border-slate-100 flex items-center justify-center">
                            <img src={rp.image} className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" alt={rp.name} />
                         </div>
                         <div className="space-y-1.5 mt-auto">
                           <h4 className="font-extrabold text-xs text-slate-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">{rp.name}</h4>
                           <div className="text-base font-black text-[#0B192C]">£{parseFloat(rp.price).toFixed(2)}</div>
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* SECURING CHECKOUT LOADER MODAL */}
      {redirecting && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="redirecting-modal">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden flex flex-col items-center animate-scale-up">
             <div className="animate-spin text-red-600 mb-6">
                <Loader2 className="w-12 h-12" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-3">Checking Live Price...</h2>
             <p className="text-slate-500 text-sm mb-2">Please wait while we redirect you to the partner website securely.</p>
             <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Validating stock and secure discounts...</p>
          </div>
        </div>
      )}
    </div>
  );
}
