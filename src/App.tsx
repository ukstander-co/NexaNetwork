/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import AffiliateDisclosure from './pages/AffiliateDisclosure';
import CookiesPolicy from './pages/CookiesPolicy';
import ContactUs from './pages/ContactUs';
import UserDataRights from './pages/UserDataRights';
import InfoPage from './pages/InfoPage';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import SplashScreen from './components/SplashScreen';

// Automatically fetches the dynamic AI-generated SEO from the backend and updates the DOM
function SeoManager() {
  useEffect(() => {
    fetch('/api/seo')
      .then(res => {
        if (!res.ok) throw new Error('Fetch failed');
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        }
        throw new Error('Not JSON');
      })
      .then(data => {
        if (data.title) {
          document.title = data.title;
        }
        if (data.description) {
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', data.description);
        }
        if (data.keywords) {
          let metaKeywords = document.querySelector('meta[name="keywords"]');
          if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
          }
          metaKeywords.setAttribute('content', data.keywords);
        }
      })
      .catch(console.error);
  }, []);
  return null;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <HelmetProvider>
      <Router>
        <AnimatePresence mode="wait">
          {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        </AnimatePresence>
        
        {!showSplash && (
          <>
            <Toaster position="top-center" reverseOrder={false} />
            <SeoManager />
            <Routes>
              <Route path="/" element={<PublicRoute><Navigate to="/login" replace /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/forget-password" element={<Navigate to="/login" replace />} />
              <Route path="/user" element={<ProtectedRoute reqRole="user"><UserDashboard /></ProtectedRoute>} />
              <Route path="/user/profile" element={<ProtectedRoute reqRole="user"><UserProfile /></ProtectedRoute>} />
              <Route path="/category/:categoryId" element={<ProtectedRoute reqRole="user"><UserDashboard /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute reqRole="user"><ProductDetail /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute reqRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclosure" element={<AffiliateDisclosure />} />
              <Route path="/cookies" element={<CookiesPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/data-rights" element={<UserDataRights />} />
              <Route path="/info/:pageId" element={<InfoPage />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </>
        )}
      </Router>
    </HelmetProvider>
  );
}
