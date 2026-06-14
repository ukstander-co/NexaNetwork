import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, CheckCircle2, X, Shield, FileText, Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTranslation } from '../hooks/useTranslation';
import Logo from './Logo';

interface FooterProps {
  minimal?: boolean;
}

export default function Footer({ minimal = false }: FooterProps) {
  const { countryName, languageName, currency, flagEmoji } = useGeolocation();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'cookies' | null>(null);
  const [modalContent, setModalContent] = useState<any>(null);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    fetch('/api/global-settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!activeModal) return;
    setLoadingModal(true);
    setModalContent(null);

    const endpoint = activeModal === 'terms' ? 'terms' : activeModal === 'cookies' ? 'cookies' : 'privacy';
    fetch(`/api/pages/${endpoint}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          setModalContent(data);
        } else {
          setModalContent(null);
        }
      })
      .catch((err) => {
        console.warn("Dyanmic legal content load failed, using local static data", err);
        setModalContent(null);
      })
      .finally(() => {
        setLoadingModal(false);
      });
  }, [activeModal]);

  const companyHeading = settings?.footer_company_heading || 'Company';
  const companyLinks = settings?.footer_company_links 
    ? JSON.parse(settings.footer_company_links) 
    : [
        { label: 'About Us', href: '/info/about-ukstander' },
        { label: 'Blog', href: '/blog' }
      ];

  const supportHeading = settings?.footer_support_heading || 'Support';
  const supportLinks = settings?.footer_support_links 
    ? JSON.parse(settings.footer_support_links) 
    : [
        { label: 'Your Account', href: '/user/profile' },
        { label: 'Returns & Replacements', href: '/info/returns' },
        { label: 'Help Center', href: '/contact' }
      ];

  const legalHeading = settings?.footer_legal_heading || 'Legal';
  const legalLinks = settings?.footer_legal_links 
    ? JSON.parse(settings.footer_legal_links) 
    : [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookies Policy', href: '/cookies' },
        { label: 'User Data Rights', href: '/data-rights' }
      ];

  const resourceHeading = settings?.footer_resource_heading || 'Resources';
  const resourceLinks = settings?.footer_resource_links 
    ? JSON.parse(settings.footer_resource_links) 
    : [
        { label: 'Affiliates', href: '/info/affiliate' }
      ];

  const copyrightText = settings?.footer_copyright || `© ${new Date().getFullYear()}, UKStander.shop, Inc. or its affiliates`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if(email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleLegalClick = (path: string, e: React.MouseEvent) => {
    if (path === '/privacy') {
      e.preventDefault();
      setActiveModal('privacy');
    } else if (path === '/terms') {
      e.preventDefault();
      setActiveModal('terms');
    } else if (path === '/cookies') {
      e.preventDefault();
      setActiveModal('cookies');
    }
  };

  const renderModalContent = () => {
    if (loadingModal) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#0B192C]/10 border-t-[#0B192C] rounded-full animate-spin mb-4" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Establishing Secure Transfer...</p>
        </div>
      );
    }

    if (activeModal === 'privacy') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0B192C]">{modalContent ? modalContent.title : "Privacy Policy"}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>
          
          <div className="prose prose-slate text-sm text-slate-600 leading-relaxed font-semibold max-h-[350px] overflow-y-auto pr-2 space-y-4">
            {modalContent ? (
              <div className="whitespace-pre-line">{modalContent.content}</div>
            ) : (
              <>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">1. Information We Collect</h4>
                  <p className="text-xs">At UKStander, we collect minimal personal data to provide our curation services. Under the UK General Data Protection Regulation (UK GDPR), we may collect your name, email address, and browsing behavior on our platform to optimize the deals we present to you.</p>
                </section>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">2. How We Use Your Data</h4>
                  <p className="text-xs">We use your information to secure your account, prevent fraud, and analyze traffic to improve our product curation. We do not sell your personal data to third parties.</p>
                </section>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">3. Cookies and Tracking</h4>
                  <p className="text-xs">We use essential cookies to keep you logged in and analytics cookies to understand how you use our site. Some of our retail partners may use tracking cookies when you click on a curated deal to attribute the sale to UKStander.</p>
                </section>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">4. Your Rights Under UK GDPR</h4>
                  <p className="text-xs">You have the right to access, correct, or delete your personal data. You may also object to processing or request data portability. To exercise these rights, contact our Data Protection Officer.</p>
                </section>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">5. Contacts</h4>
                  <p className="text-xs">If you have questions about this privacy policy, please contact us at privacy@ukstander.shop.</p>
                </section>
              </>
            )}
          </div>
        </div>
      );
    }

    if (activeModal === 'terms') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0B192C]">{modalContent ? modalContent.title : "Terms & Conditions"}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>
          
          <div className="prose prose-slate text-sm text-slate-600 leading-relaxed font-semibold max-h-[350px] overflow-y-auto pr-2 space-y-4">
            {modalContent ? (
              <div className="whitespace-pre-line">{modalContent.content}</div>
            ) : (
              <>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">1. Acceptance of Terms</h4>
                  <p className="text-xs">By accessing and using UKStander, you agree to comply with these Terms and Conditions. These terms are governed by the laws of England and Wales.</p>
                </section>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">2. Service Description</h4>
                  <p className="text-xs">UKStander is a curated web portal. We do not sell products directly. We direct you to third-party Amazon retailers. Any purchase you make is governed by the terms and conditions of the respective retailer.</p>
                </section>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">3. Liability</h4>
                  <p className="text-xs">While we strive to provide accurate information and prices, we are not responsible for discrepancies, out-of-stock items, or issues arising from purchases made on third-party websites. Your consumer rights remain at all times with the retailer from whom you purchase the goods.</p>
                </section>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">4. Intellectual Property</h4>
                  <p className="text-xs">The content, branding, and curation on this platform are owned by UKStander. Third-party logos and product images are the property of their respective owners and are used for identification purposes only.</p>
                </section>
              </>
            )}
          </div>
        </div>
      );
    }

    if (activeModal === 'cookies') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0B192C]">{modalContent ? modalContent.title : "Cookies Policy"}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>
          
          <div className="prose prose-slate text-sm text-slate-600 leading-relaxed font-semibold max-h-[350px] overflow-y-auto pr-2 space-y-4">
            {modalContent ? (
              <div className="whitespace-pre-line">{modalContent.content}</div>
            ) : (
              <>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">1. What Are Cookies?</h4>
                  <p className="text-xs">Cookies are small text files stored on your device when you browse the internet. At UKStander, we use them to enhance your experience and track affiliate links securely.</p>
                </section>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">2. How We Use Cookies</h4>
                  <p className="text-xs">We use essential cookies for login sessions and security. We also use analytics cookies to understand product trends in the UK market. Thirdly, when you click an affiliate link, a tracking cookie may be placed by the retailer to credit us for the referral.</p>
                </section>
                <section>
                  <h4 className="font-black text-slate-800 mb-1">3. Managing Cookies</h4>
                  <p className="text-xs">You can manage or disable cookies through your browser settings. However, disabling essential cookies may prevent you from logging in, and disabling tracking cookies may affect our ability to secure you the best curated deals.</p>
                </section>
              </>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  if (minimal) {
    return (
      <footer className="mt-auto py-4 px-6 w-full bg-transparent text-center z-10 select-none">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] font-bold text-slate-700 uppercase tracking-widest leading-loose">
          <p className="opacity-90">{copyrightText}</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" onClick={(e) => handleLegalClick('/privacy', e)} className="text-slate-700 hover:text-indigo-600 transition-colors font-extrabold">Privacy</Link>
            <Link to="/terms" onClick={(e) => handleLegalClick('/terms', e)} className="text-slate-700 hover:text-indigo-600 transition-colors font-extrabold">Terms</Link>
            <Link to="/cookies" onClick={(e) => handleLegalClick('/cookies', e)} className="text-slate-700 hover:text-indigo-600 transition-colors font-extrabold">Cookies</Link>
          </div>
        </div>

        {/* Dynamic Legal Popups */}
        <AnimatePresence>
          {activeModal && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal(null)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_45px_100px_rgba(0,0,0,0.15)] p-6 md:p-8 w-full max-w-lg relative text-left"
              >
                <button 
                  onClick={() => setActiveModal(null)}
                  className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                {renderModalContent()}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </footer>
    );
  }

  return (
    <footer className="mt-auto flex flex-col w-full z-10 font-sans">
      {/* Back to top button */}
      <button 
        onClick={scrollToTop}
        className="bg-[#012169] hover:bg-[#08152b] text-white py-4 text-sm font-medium transition-colors w-full animate-pulse-subtle"
      >
        {t('back_to_top')}
      </button>

      {/* Deal Alerts Section */}
      <div className="bg-[#0B192C] border-b border-white/10 w-full py-8 px-4 flex justify-center">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 justify-between w-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-lg font-bold text-white mb-1 flex items-center"><Mail className="w-5 h-5 mr-2 text-red-500" /> {t('deal_alerts_title')}</h4>
            <p className="text-sm text-slate-300">{t('deal_alerts_desc')}</p>
          </div>
          
          <div className="w-full md:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="flex items-center justify-center md:justify-start text-sm font-bold text-emerald-400 py-2 bg-emerald-400/10 rounded-xl px-4">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white text-slate-900 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#febd69] placeholder:text-slate-500 font-medium"
                />
                <button type="submit" className="bg-[#febd69] text-slate-900 px-6 py-2.5 rounded-md text-sm font-bold hover:bg-[#f3a847] transition-colors shadow-sm whitespace-nowrap">
                  {t('subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#0B192C] text-white py-12 px-4 md:px-10 border-b border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1 */}
            <div>
              <h3 className="font-bold mb-4 text-[16px] text-white">{companyHeading}</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {companyLinks.map((link: any, idx: number) => (
                  <li key={idx}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} onClick={(e) => handleLegalClick(link.href, e)} className="hover:text-white hover:underline transition-colors">{link.label}</Link>
                    ) : (
                      <a href={link.href} className="hover:text-white hover:underline transition-colors">{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="font-bold mb-4 text-[16px] text-white">{supportHeading}</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {supportLinks.map((link: any, idx: number) => (
                  <li key={idx}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} onClick={(e) => handleLegalClick(link.href, e)} className="hover:text-white hover:underline transition-colors">{link.label}</Link>
                    ) : (
                      <a href={link.href} className="hover:text-white hover:underline transition-colors">{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="font-bold mb-4 text-[16px] text-white">{legalHeading}</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {legalLinks.map((link: any, idx: number) => (
                  <li key={idx}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} onClick={(e) => handleLegalClick(link.href, e)} className="hover:text-white hover:underline transition-colors">{link.label}</Link>
                    ) : (
                      <a href={link.href} className="hover:text-white hover:underline transition-colors">{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="font-bold mb-4 text-[16px] text-white">{resourceHeading}</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {resourceLinks.map((link: any, idx: number) => (
                  <li key={idx}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} onClick={(e) => handleLegalClick(link.href, e)} className="hover:text-white hover:underline transition-colors">{link.label}</Link>
                    ) : (
                      <a href={link.href} className="hover:text-white hover:underline transition-colors">{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

        </div>
      </div>

      {/* Footer Bottom Logo */}
      <div className="bg-slate-900 text-white py-10 px-4 flex flex-col items-center justify-center border-t border-slate-800">
        <Logo dark={true} />
      </div>
      
      <div className="bg-[#012169] text-white py-6">
        <div className="flex flex-col items-center justify-center space-y-3 text-xs text-slate-500">
          <p>{copyrightText}</p>
        </div>
      </div>

      {/* Dynamic Legal Popups for standard footer */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_45px_100px_rgba(0,0,0,0.15)] p-6 md:p-8 w-full max-w-lg relative text-left"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              {renderModalContent()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
