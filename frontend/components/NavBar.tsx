// components/NavBar.tsx
'use client';

import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="w-full bg-[#e7dcc8] py-4">
      <div className="mx-auto flex max-w-300 items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-xl font-bold text-[#193900] md:text-2xl hover:opacity-80 transition-opacity">
          Food Explorer
        </Link>
        <Link 
          href="/recipes" 
          className="rounded-lg bg-[#193900]/10 px-6 py-2 text-sm font-semibold text-[#193900] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#193900]/20 md:text-base"
        >
          Recipes
        </Link>
      </div>
    </nav>
  );
}