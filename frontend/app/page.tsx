'use client';

import Link from 'next/link';
import { useState } from 'react';

// --- Types & Constants ---

interface ProduceItem {
  id: string; // Added ID for better React keys
  item: string;
  season: string;
}

// Defined outside component to avoid recreation on render
const SEASONAL_PRODUCE: ProduceItem[] = [
  { id: 'apple-1', item: "apple", season: "fall" },
  { id: 'cheese-1', item: "cheese", season: "fall" },
  { id: 'banana-1', item: "banana", season: "summer" },
  { id: 'apple-2', item: "apple", season: "fall" },
  { id: 'cheese-2', item: "cheese", season: "fall" },
  { id: 'banana-2', item: "banana", season: "summer" },
  { id: 'banana-3', item: "banana", season: "summer" },
  { id: 'apple-3', item: "apple", season: "fall" },
  { id: 'cheese-3', item: "cheese", season: "fall" },
  { id: 'banana-4', item: "banana", season: "summer" },
  { id: 'apple-4', item: "apple", season: "fall" },
  { id: 'cheese-4', item: "cheese", season: "fall" },
  { id: 'banana-5', item: "banana", season: "summer" },
  { id: 'apple-5', item: "apple", season: "fall" }
];

// --- Components ---

function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <section className="px-4 py-12 text-center md:px-8 md:py-16">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-[#193900] sm:text-4xl md:text-5xl">
          Find the Perfect Recipe
        </h1>
        <p className="text-xs tracking-[0.15em] text-[#193900] md:text-sm">
          SEARCH INGREDIENTS OR DISHES
        </p>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-150">
        <input 
          type="text" 
          aria-label="Search ingredients"
          placeholder="Search for food items or recipes..." 
          value={query} 
          onChange={handleSearch}
          className="w-full rounded-full border-2 border-[#193900]/20 bg-white px-6 py-4 text-base text-[#193900] shadow-lg outline-none transition-all duration-200 placeholder:text-[#193900]/50 focus:-translate-y-0.5 focus:border-[#193900] focus:shadow-xl md:text-lg"
        />
      </form>
    </section>
  );
}

function Ingredients() {
  // Since data is static constant, we don't strictly need useState/useEffect here 
  // unless you plan to fetch from an API. I've simplified it to use the constant directly.
  
  return (
    <section className="mx-auto max-w-300 px-4 py-8 md:px-8 md:py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-[#193900] md:text-3xl">
        Ingredients in Season
      </h2>
      
      {/* Semantic Fix: Changed div to ul, and ensured direct children are li.
        Added list-none to remove default bullets.
      */}
      <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 rounded-2xl border border-[#193900]/20 bg-white/30 p-8 text-center backdrop-blur-md md:p-12">
        {SEASONAL_PRODUCE.map((produce_item) => (
          <li key={produce_item.id} className="contents">
            <Link 
              href={`/item/${produce_item.item}`}
              className="flex min-h-30 w-full cursor-pointer items-center justify-center rounded-2xl bg-white p-8 text-center text-[#193900] shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <span className="capitalize">{produce_item.item}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// --- Main Page ---

export default function Home() {
  return (
    <main className="min-h-screen bg-[#e7dcc8]">
      <SearchBar />
      <Ingredients />
    </main>
  );
}