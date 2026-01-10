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
        // Hardcoded data - replace with API call later
        const data = [
          {
            id: 1,
            name: "Roasted Butternut Squash Soup",
            url: "https://www.budgetbytes.com/butternut-squash-soup/?utm_source=google&utm_medium=cpc&utm_campaign=22666535188&utm_content=757619904938&utm_term=squash+soup&gad_source=1&gad_campaignid=22666535188&gbraid=0AAAAAoNNKLpqKUcVhLCE2GMfEzINdynJQ&gclid=CjwKCAiAjojLBhAlEiwAcjhrDgi-uIEbeJI8Rja_gFWKq5HdeKrawK9TZHjzZHXHhN2KN_-SrxZ4jxoCzscQAvD_BwE",
            image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400"
          },
          {
            id: 2,
            name: "Apple Cinnamon Oatmeal",
            url: "https://www.thepioneerwoman.com/food-cooking/recipes/a44735780/apple-cinnamon-oatmeal-recipe/?utm_source=google&utm_medium=cpc&utm_campaign=mgu_ga_pw_md_pmx_hybd_mix_ca_18890344267&gad_source=1&gad_campaignid=18891848801&gbraid=0AAAAABxutSrBoNfB1BLNMjnXtebkaQ-Yj&gclid=CjwKCAiAjojLBhAlEiwAcjhrDqPfsntW7HTiPw3JcSoYhrlOaefS7ekMdOtlUSjo_ogQDULFxQ5VeBoCPfcQAvD_BwE",
            image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400"
          },
          {
            id: 3,
            name: "Pumpkin Pasta",
            url: "https://www.jaroflemons.com/creamy-pumpkin-pasta/",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400"
          }
        ];
        
        setRecipes(data);
        setLoading(false);
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