import React, { useState, useEffect } from 'react';
import { AlertCircle, Mail } from 'lucide-react';
import MainLayout from '../components/MainLayout';

export default function AffiliateDisclosure() {
  const [dbPage, setDbPage] = useState<any>(null);

  useEffect(() => {
    fetch('/api/pages/disclosure')
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
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {dbPage ? dbPage.title : "Affiliate Disclosure"}
          </h1>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-sm"><strong>Compliance with ASA & CMA Guidelines</strong></p>
          
          {dbPage ? (
            <div className="whitespace-pre-line text-slate-600 leading-relaxed font-semibold">
              {dbPage.content}
            </div>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">How We Make Money</h2>
                <p>UKStander operates as an affiliate curation platform. This means that when you click on links to various merchants on this site and make a purchase, this can result in this site earning a commission.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Does it cost you more?</h2>
                <p><strong>Absolutely not.</strong> The price you pay is exactly the same whether you use our affiliate link or go directly to the vendor's website using a non-affiliate link. In fact, sometimes our negotiations mean you get a better deal through our links.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Our Commitment to You</h2>
                <p>In accordance with the UK's Advertising Standards Authority (ASA) and Competition and Markets Authority (CMA), we ensure transparency about our commercial relationships. We only feature products and brands we genuinely believe offer value to UK consumers.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Retail Partners</h2>
                <p>We work with major UK retailers to source the best products. Clicking on "View Deal on Retailer" directly supports our platform.</p>
              </section>

              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
                <h2 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-wide">Advertiser & Publisher Inquiries</h2>
                <p className="text-xs mb-3">Are you a premium UK retailer, brand representative, or digital agency interested in getting your products and deals curated on the UKStander engine? We are always seeking to expand our commercial ecosystem with highly vetted partners.</p>
                <p className="text-xs font-bold text-slate-700">Please send details directly to our partnership team: <a href="mailto:affiliate@ukstander.shop" className="text-indigo-600 hover:text-indigo-700 font-extrabold flex items-center gap-1.5 mt-1"><Mail className="w-4 h-4 inline" /> affiliate@ukstander.shop</a></p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  </MainLayout>
);
}
