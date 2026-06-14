import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (term: string, category: string) => void;
  initialSearch?: string;
  initialCategory?: string;
}

export default function MainLayout({ children, onSearch, initialSearch, initialCategory }: MainLayoutProps) {
  const [userEmail, setUserEmail] = useState<string>('Guest');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(["All Categories"]);

  useEffect(() => {
    // Attempt to load user from localStorage
    const savedUser = localStorage.getItem('user');
    let uEmail = 'Guest';
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        uEmail = user.email || 'User';
        setUserEmail(uEmail);
      } catch (e) {}
    }

    // Load correct user-specific local wishlist
    const userWishlistKey = `wishlist_${uEmail}`;
    const localWish = JSON.parse(localStorage.getItem(userWishlistKey) || localStorage.getItem('wishlist') || '[]');
    setWishlist(localWish);

    if (uEmail && uEmail !== 'Guest' && uEmail !== 'User') {
      // Fetch wishlist if user exists
      fetch(`/api/wishlist?email=${encodeURIComponent(uEmail)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const merged = Array.from(new Set([...localWish, ...data]));
            setWishlist(merged);
            localStorage.setItem(userWishlistKey, JSON.stringify(merged));
            localStorage.setItem('wishlist', JSON.stringify(merged));
          }
        })
        .catch(() => {});
    }

    // Fetch categories for search bar
    fetch('/api/products')
      .then(res => res.json())
      .then(products => {
        if (Array.isArray(products)) {
          const cats = Array.from(new Set(products.map((p: any) => p.category))).filter(Boolean) as string[];
          setDynamicCategories(["All Categories", ...cats]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header 
        userEmail={userEmail} 
        wishlist={wishlist} 
        dynamicCategories={dynamicCategories}
        onSearch={onSearch}
        initialSearch={initialSearch}
        initialCategory={initialCategory}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
