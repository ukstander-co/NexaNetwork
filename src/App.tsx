/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { LazyMotion, domAnimation, AnimatePresence } from "motion/react";
import SplashScreen from "./components/SplashScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminNotepad from "./components/AdminNotepad";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const AffiliateDisclosure = lazy(() => import("./pages/AffiliateDisclosure"));
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const UserDataRights = lazy(() => import("./pages/UserDataRights"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ReturnsReplacements = lazy(() => import("./pages/ReturnsReplacements"));
const Affiliates = lazy(() => import("./pages/Affiliates"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const InfoPage = lazy(() => import("./pages/InfoPage"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Automatically fetches the dynamic AI-generated SEO from the backend and updates the DOM
function SeoManager() {
  useEffect(() => {
    fetch("/api/seo")
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        }
        throw new Error("Not JSON");
      })
      .then((data) => {
        if (data.title) {
          document.title = data.title;
        }
        if (data.description) {
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement("meta");
            metaDesc.setAttribute("name", "description");
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute("content", data.description);
        }
        if (data.keywords) {
          let metaKeywords = document.querySelector('meta[name="keywords"]');
          if (!metaKeywords) {
            metaKeywords = document.createElement("meta");
            metaKeywords.setAttribute("name", "keywords");
            document.head.appendChild(metaKeywords);
          }
          metaKeywords.setAttribute("content", data.keywords);
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
        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="wait">
            {showSplash && (
              <SplashScreen onComplete={() => setShowSplash(false)} />
            )}
          </AnimatePresence>
          <main className="w-full min-h-screen flex flex-col">
          <Toaster position="top-center" reverseOrder={false} />
          <SeoManager />
          <AdminNotepad />
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            }
          >
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Navigate to="/login" replace />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
              <Route
                path="/forget-password"
                element={<Navigate to="/login" replace />}
              />
              <Route
                path="/user"
                element={
                  <ProtectedRoute reqRole="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/profile"
                element={
                  <ProtectedRoute reqRole="user">
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/category/:categoryId"
                element={
                  <ProtectedRoute reqRole="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute reqRole="user">
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute reqRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclosure" element={<AffiliateDisclosure />} />
              <Route path="/affiliates" element={<Affiliates />} />
              <Route path="/cookies" element={<CookiesPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/data-rights" element={<UserDataRights />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/returns" element={<ReturnsReplacements />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/info/:pageId" element={<InfoPage />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </Suspense>
        </main>
        </LazyMotion>
      </Router>
    </HelmetProvider>
  );
}
