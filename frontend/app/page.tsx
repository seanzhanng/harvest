'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { useFoods } from '@/hooks/useFoods'; // <--- Using the Hook
import '@/styles/home-styling.css';

export default function Home() {
  return (
    <div className="home-container">
      <NavBar />
      <SearchBar />
      <IngredientsGrid />
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/recipes?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="search-section">
      <div className="search-header">
        <h1 className="search-title">Find the Perfect Recipe</h1>
        <p className="search-subtitle">SEARCH INGREDIENTS OR DISHES</p>
      </div>
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          placeholder="Search for food items (e.g. Chicken, Rice)..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </form>
    </div>
  );
}

function IngredientsGrid() {
  // The hook handles loading state and DB calls for you
  const { foods, loading } = useFoods();

  if (loading && foods.length === 0) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>Loading Ingredients...</div>;
  }

  return (
    <div className="ingredients-section">
      <h2 className="ingredients-title">Ingredients in Season</h2>
      <div className="ingredients-grid">
        {foods.map((item, index) => (
          <Link key={index} href={`/item/${item.name}`} style={{textDecoration: 'none'}}>
            <div className="produce-card">
              <div style={{fontWeight: 'bold', fontSize: '1.2rem', color: '#193900'}}>
                {item.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}