'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
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
  const [produce, setProduce] = useState<Array<{item: string, season: string}>>([])
  const handleSetProduce = async () => {
    //database returns a response object
    //const results = await fetch('GET endpoint')

    //use .json() to turn into a javascript object
    //const data = results.json()
    const data = [{item: "apple", season: "fall"}, {item: "cheese", season: "fall"}, {item: "banana", season: "summer"}]
    setProduce(data)
  }

  useEffect(() => {
    handleSetProduce();
  }, [])

  return (
    <div className="ingredients-section">
      <h2 className="ingredients-title">Ingredients in Season</h2>
      <div className="ingredients-grid">
        {produce.map( (produce_item, index) => (
          <Link key={index} href={`/item/${produce_item}`}>
            <li key={index} className="produce-card">
              <div>{produce_item}</div>
            </li>
          </Link>
          
        ))}
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