'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { api, RecipeResult } from '@/lib/api';
import Image from 'next/image'; // <--- Import this
import '@/styles/styling.css';

export default function ItemPage() {
    const params = useParams();
    const id = decodeURIComponent(params.id as string);
    
    const [recipes, setRecipes] = useState<RecipeResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPipeline = async() => {
            try {
                const results = await api.autoSuggest([id]);
                setRecipes(results);
            } catch (error) {
                console.error('Failed to fetch item data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPipeline();
    }, [id]);

    if (loading) return (
      <div className="loading-container">
         <div className="loading-text">Finding top-rated recipes for {id}...</div>
      </div>
    );
  
    return (
        <div className="recipes-container">
            <NavBar />
            <div className="recipes-header">
                <h1 className="recipes-title">{id}</h1>
                <p className="recipes-subtitle">AI-CURATED RECIPES FOR THIS INGREDIENT</p>
            </div>

            <div className="recipes-grid">
              {recipes.map((recipe, idx) => (
                <div
                  key={idx}
                  onClick={() => window.open(recipe.recipe_link, '_blank')}
                  className="recipe-card"
                >
                  {/* --- UPDATED IMAGE TAG --- */}
                  <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    <Image
                      src={`https://source.unsplash.com/400x300/?${recipe.meal_name.replace(/\s/g, ',')}`}
                      alt={recipe.meal_name}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized // Skips complex config for external images
                    />
                  </div>
                  <h3 className="recipe-name">{recipe.meal_name}</h3>
                </div>
              ))}
            </div>
        </div>
  );
}