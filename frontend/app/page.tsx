'use client';
import Link from 'next/link';
import { useState } from 'react';
import './home-styling.css';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2 className="nav-logo">Food Explorer</h2>
        <Link href="/recipes" className="nav-link">
          Recipes
        </Link>
      </div>
    </nav>
  );
}

function SearchBar() {
  const [item, setItem] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchedItem = e.target.value;
    setItem(searchedItem);
    
    try {
      // const result = await fetch('...') // use GET method
      // const items = await result.json()
      // setResults(items)
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="search-section">
      <div className="search-header">
        <h1 className="search-title">Find the Perfect Recipe</h1>
        <p className="search-subtitle">SEARCH INGREDIENTS OR DISHES</p>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="search-form">
        <input 
          type="text" 
          placeholder="Search for food items or recipes..." 
          value={item} 
          onChange={handleSearch}
          className="search-input"
        />
      </form>
    </div>
  );
}

function Ingredients() {
  return (
    <div className="ingredients-section">
      <h2 className="ingredients-title">Popular Ingredients</h2>
      <div className="ingredients-grid">
        <p className="ingredients-placeholder">Here are food items...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="home-container">
      <NavBar />
      <SearchBar />
      <Ingredients />
    </div>
  );
}