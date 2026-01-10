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

//this is the change to the recipes page 


// Define the Recipe type here, before the component
interface Recipe {
  id: number;
  name: string;
  url: string;
  image: string;
}

function Recipes() {
  const [recipe, setRecipe] = useState<Recipe[]>([])

  //const results = await fetch('GET endpoint')
  //data = results.json()

  const handleSetRecipe = async () => {
    const data = [
      {
      id: 1,
      name: "Roasted Butternut Squash Soup",
      url: "https://www.allrecipes.com/recipe/12345/squash-soup",
      image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400"
      },
      {
      id: 2,
      name: "Apple Cinnamon Oatmeal",
      url: "https://www.foodnetwork.com/recipes/apple-oatmeal",
      image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400"
      },
      {
      id: 3,
      name: "Pumpkin Pasta",
      url: "https://www.bonappetit.com/recipe/pumpkin-pasta",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400"
      }
    ]
    setRecipe(data)
  }

  useEffect(() => {
    handleSetRecipe();
  }, [])

  return (
    <div className="recipe-section">
      <h2 className="recipe-title">Recipes to Try Out!</h2>
      <div className="recipe-grid">
        {recipe.map( (recipe_item, index) => (
          <li key={index} className="recipe-card">
            <div>{recipe_item.name}</div>
          </li>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="recipe-container">
        <RecipesPage />
    </div>
  );
}