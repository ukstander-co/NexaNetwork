import React, { useState, useEffect } from 'react';
import { Mail, Phone } from 'lucide-react';
import MainLayout from '../components/MainLayout';

export default function ContactUs() {
  const [dbPage, setDbPage] = useState<any>(null);

  useEffect(() => {
    fetch('/api/pages/contact')
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
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {dbPage ? dbPage.title : "Contact Us"}
          </h1>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          {dbPage ? (
            <div className="whitespace-pre-line text-slate-600 leading-relaxed font-semibold">
              {dbPage.content}
            </div>
          ) : (
            <>
              <p>If you have any questions about our curated deals, our platform, or policies, please secure connection with our respective departments:</p>
              
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="block font-black text-slate-800 text-sm uppercase tracking-wider">General Inquiries</span>
                    <a href="mailto:info@ukstander.shop" className="text-indigo-600 hover:text-indigo-800 text-base font-bold flex items-center gap-2">
                      <Mail className="w-4 h-4" /> info@ukstander.shop
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-black text-slate-800 text-sm uppercase tracking-wider">Customer & Account Support</span>
                    <a href="mailto:support@ukstander.shop" className="text-indigo-600 hover:text-indigo-800 text-base font-bold flex items-center gap-2">
                      <Mail className="w-4 h-4" /> support@ukstander.shop
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-black text-slate-800 text-sm uppercase tracking-wider">Retailers & Affiliates</span>
                    <a href="mailto:affiliate@ukstander.shop" className="text-indigo-600 hover:text-indigo-800 text-base font-bold flex items-center gap-2">
                      <Mail className="w-4 h-4" /> affiliate@ukstander.shop
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-black text-slate-800 text-sm uppercase tracking-wider">Submit Deals & Submit Drops</span>
                    <a href="mailto:deals@ukstander.shop" className="text-indigo-600 hover:text-indigo-800 text-base font-bold flex items-center gap-2">
                      <Mail className="w-4 h-4" /> deals@ukstander.shop
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-black text-slate-800 text-sm uppercase tracking-wider">Alerts & Subscriptions</span>
                    <a href="mailto:alerts@ukstander.shop" className="text-indigo-600 hover:text-indigo-800 text-base font-bold flex items-center gap-2">
                      <Mail className="w-4 h-4" /> alerts@ukstander.shop
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-black text-slate-800 text-sm uppercase tracking-wider">Data Protection & Privacy</span>
                    <a href="mailto:admin@ukstander.shop" className="text-indigo-600 hover:text-indigo-800 text-base font-bold flex items-center gap-2">
                      <Mail className="w-4 h-4" /> admin@ukstander.shop
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                  <div className="flex items-center gap-3">
                     <Phone className="w-5 h-5 text-indigo-500" />
                     <span className="font-semibold text-slate-800">Phone:</span>
                     <span className="text-slate-600 font-medium">+44 20 7946 0958</span>
                  </div>
                  <p className="font-semibold bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600">Business Hours: Mon - Fri, 9:00 AM - 5:00 PM (GMT)</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </MainLayout>
);
}
