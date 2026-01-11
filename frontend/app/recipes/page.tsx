"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { useRecipeEngine } from '@/hooks/useRecipeEngine';
import Image from 'next/image'; // <--- UPDATED
import '@/styles/styling.css';

function RecipesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(false);

  // Hook handles: results, loading boolean, and error messages
  const { results, loading, error, generateRecipes } = useRecipeEngine();

  // --- FIX 1: DEFINE FUNCTION FIRST ---
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) return;
    setHasSearched(true);
    const ingredients = searchTerm.split(',').map(s => s.trim());
    generateRecipes(ingredients);
  };

  // --- FIX 2: CALL LOGIC DIRECTLY IN EFFECT ---
  // This avoids the "missing dependency" linter error for handleSearch
  useEffect(() => {
    if (initialQuery) {
      setHasSearched(true);
      const ingredients = initialQuery.split(',').map(s => s.trim());
      generateRecipes(ingredients);
    }
    // We intentionally only run this when the URL query changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="recipes-container">
      <NavBar />
      
      <div className="recipes-header">
        <h1 className="recipes-title">Recipe Generator</h1>
        <p className="recipes-subtitle">ENTER INGREDIENTS, GET REAL RECIPES</p>
        
        <form onSubmit={onSubmit} style={{maxWidth: '600px', margin: '2rem auto'}}>
           <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Chicken, Broccoli, Cheese"
              className="search-input"
           />
        </form>
      </div>

      {loading ? (
        <div className="loading-container" style={{minHeight: '30vh', background: 'transparent'}}>
          <div className="loading-text">The AI Chef is thinking...</div>
        </div>
      ) : (
        <>
          {error && (
             <div className="empty-state">
                <p className="empty-text" style={{color: 'red'}}>{error}</p>
             </div>
          )}

          {results.length > 0 ? (
            <div className="recipes-grid">
              {results.map((recipe, idx) => (
                <div
                  key={idx}
                  onClick={() => window.open(recipe.recipe_link, '_blank')}
                  className="recipe-card"
                >
                  {/* --- FIX 3: USE NEXT/IMAGE --- */}
                  <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    <Image
                      src={`https://source.unsplash.com/400x300/?${recipe.meal_name.replace(/\s/g, ',')}`}
                      alt={recipe.meal_name}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized // REQUIRED for external URLs like unsplash/placehold.co without config
                    />
                  </div>
                  <h3 className="recipe-name">{recipe.meal_name}</h3>
                </div>
              ))}
            </div>
          ) : hasSearched && !loading && !error && (
            <div className="empty-state">
              <p className="empty-text">No recipes found. Try different ingredients!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecipesContent />
    </Suspense>
  );
}