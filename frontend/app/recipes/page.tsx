"use client";

import React, { useState, useEffect } from 'react';

interface Recipe {
  id: number;
  name: string;
  url: string;
  image: string;
}

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // const response = await fetch('YOUR_API_ENDPOINT');
        // const data = await response.json();
        // setRecipes(data);
        
        setTimeout(() => {
          setRecipes([]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeClick = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF8E7' }}>
        <p className="text-xl" style={{ color: '#2d5016', fontFamily: "'Poppins', sans-serif" }}>Loading recipes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8E7', fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 
          className="text-6xl font-bold mb-3 text-center"
          style={{ color: '#2d5016', fontFamily: "'Abril Fatface', serif", letterSpacing: '0.02em' }}
        >
          Popular Recipes
        </h1>
        <p 
          className="text-center mb-12 text-lg tracking-wide"
          style={{ color: '#4a7c2c', fontFamily: "'Poppins', sans-serif", letterSpacing: '0.08em', fontWeight: '300' }}
        >
          DISCOVER THE MOST LOVED DISHES
        </p>

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl" style={{ color: '#2d5016' }}>
              No recipes available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe.url)}
                className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
                style={{ backgroundColor: '#ffffff' }}
              >
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-5">
                    <h3 
                      className="text-xl font-semibold text-center"
                      style={{ color: '#2d5016', fontFamily: "'Poppins', sans-serif", fontWeight: '600' }}
                    >
                      {recipe.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;