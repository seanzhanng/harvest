"use client";

import React, { useState, useEffect } from 'react';
import { api, SavedRecipe } from '@/utils/api';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const data = await api.getSavedRecipe();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id: number) => {
    // UPDATED: Removed the confirm() popup. Deletion is now instant.
    try {
        await api.deleteSavedRecipe(id);
        setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
        console.error("Failed to delete recipe", err);
        alert("Failed to delete recipe");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e7dcc8]">
        <div className="text-2xl font-semibold text-[#193900]">Loading your cookbook...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#e7dcc8] px-4 py-12 md:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-bold text-[#193900] md:text-5xl">
          Your Saved Recipes
        </h1>
        <p className="text-xs tracking-[0.15em] text-[#193900] md:text-sm">
          AI GENERATED & SAVED
        </p>
      </div>

      {/* Empty State */}
      {recipes.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <p className="text-lg text-[#193900]">
            No saved recipes yet.
          </p>
          <p className="text-[#193900]/60 mt-2 text-sm">
            Go back to the home page to generate and save new recipes!
          </p>
        </div>
      ) : (
        /* Recipe Grid */
        <div className="mx-auto grid max-w-300 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 px-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <div className="bg-[#193900] p-4 text-white">
                <h3 className="text-xl font-bold">
                    {recipe.title}
                </h3>
              </div>
              
              <div className="p-6 flex-1">
                <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#193900]/50 mb-2">
                        Ingredients
                    </h4>
                    <p className="text-sm text-[#193900]/80 italic leading-relaxed">
                        {recipe.ingredients_used}
                    </p>
                </div>

                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#193900]/50 mb-2">
                        Instructions
                    </h4>
                    <p className="text-sm text-[#193900] whitespace-pre-line leading-relaxed">
                        {recipe.instructions}
                    </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                <button 
                    onClick={() => recipe.id && handleDelete(recipe.id)}
                    className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-800 uppercase tracking-wider transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                    </svg>
                    Delete Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};