"use client";
import React, { useState, useEffect } from 'react';
import './styling.css';

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
      <div className="loading-container">
        <div className="loading-text">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="recipes-container">
      <div className="recipes-header">
        <h1 className="recipes-title">Popular Recipes</h1>
        <p className="recipes-subtitle">DISCOVER THE MOST LOVED DISHES</p>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">
            No recipes available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe.url)}
              className="recipe-card"
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className="recipe-image"
              />
              <h3 className="recipe-name">{recipe.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;