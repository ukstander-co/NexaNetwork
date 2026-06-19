import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = "text-2xl", dark = false }: { size?: string, dark?: boolean }) {
  return (
    <Link to="/user" className="flex flex-col items-center justify-center cursor-pointer select-none hover:opacity-95 transition-opacity">
      <span className={`${size} font-black tracking-tighter ${dark ? 'text-white' : 'text-slate-900'} leading-none`}>
        UKStander<span className="text-red-600">.shop</span>
      </span>
      {/* UK-style swoosh/smile SVG */}
      <svg width={size === "text-xl md:text-2xl" ? 64 : 64} height="12" className={`${size === "text-xl md:text-2xl" ? 'w-12 md:w-16' : 'w-16'} h-3 mt-1 text-red-600`} viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 5 Q 50 25 95 5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="transparent" />
        <path d="M90 2 L96 5 L88 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="transparent" />
      </svg>
    </Link>
  );
}
