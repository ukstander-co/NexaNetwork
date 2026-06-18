import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import MainLayout from '../components/MainLayout';

export default function PrivacyPolicy() {
  const [dbPage, setDbPage] = useState<any>(null);

  useEffect(() => {
    fetch('/api/pages/privacy')
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          setDbPage(data);
        }
      })
      .catch(console.warn);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen py-12 md:py-20 bg-[#F8FAFC] text-slate-900 font-sans p-6 md:p-12">
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center border border-slate-200">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {dbPage ? dbPage.title : "Privacy Policy"}
          </h1>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-sm"><strong>Last Updated: {new Date().toLocaleDateString('en-GB')}</strong></p>
          
          {dbPage ? (
            <div className="whitespace-pre-line text-slate-600 leading-relaxed font-semibold">
              {dbPage.content}
            </div>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">1. Information We Collect</h2>
                <p>At UKStander, we collect minimal personal data to provide our curation services. Under the UK General Data Protection Regulation (UK GDPR), we may collect your name, email address, and browsing behavior on our platform to optimize the deals we present to you.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">2. How We Use Your Data</h2>
                <p>We use your information to secure your account, prevent fraud, and analyze traffic to improve our product curation. We do not sell your personal data to third parties.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">3. Cookies and Tracking</h2>
                <p>We use essential cookies to keep you logged in and analytics cookies to understand how you use our site. Some of our retail partners may use tracking cookies when you click on a curated deal to attribute the sale to UKStander.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">4. Your Rights Under UK GDPR</h2>
                <p>You have the right to access, correct, or delete your personal data. You may also object to processing or request data portability. To exercise these rights, contact our Data Protection Officer.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">5. Contact Us</h2>
                <p>If you have questions about this privacy policy, please contact us at <a href="mailto:admin@ukstander.shop" className="text-indigo-600 hover:text-indigo-700 font-medium">admin@ukstander.shop</a>.</p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  </MainLayout>
);
}
