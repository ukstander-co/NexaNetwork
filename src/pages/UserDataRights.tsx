import React, { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import MainLayout from '../components/MainLayout';

export default function UserDataRights() {
  const [dbPage, setDbPage] = useState<any>(null);

  useEffect(() => {
    fetch('/api/pages/data-rights')
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
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {dbPage ? dbPage.title : "User Data Rights"}
          </h1>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-sm"><strong>Your rights under UK GDPR</strong></p>
          
          {dbPage ? (
            <div className="whitespace-pre-line text-slate-600 leading-relaxed font-semibold">
              {dbPage.content}
            </div>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">The Right to Access</h2>
                <p>You have the right to request copies of your personal data. We may charge you a small fee for this service.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">The Right to Rectification</h2>
                <p>You have the right to request that we correct any information you believe is inaccurate. You also have the right to request UKStander to complete information you believe is incomplete.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">The Right to Erasure</h2>
                <p>You have the right to request that we erase your personal data, under certain conditions.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Exercising Your Rights</h2>
                <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at our email: <a href="mailto:admin@ukstander.shop" className="text-indigo-600 hover:text-indigo-700 font-medium">admin@ukstander.shop</a>.</p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  </MainLayout>
);
}
