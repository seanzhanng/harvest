'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, Food, SavedRecipe } from '@/utils/api';


// --- Types ---

interface RecipeGenerated {
  title: string;
  instructions: string;
  ingredients_used: string;
}

// --- Component ---

export default function ItemPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [item, setItem] = useState<Food | null>(null);
  const [generatedRecipes, setGeneratedRecipes] = useState<RecipeGenerated[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ [key: number]: string }>({});

  
  // Fetch food item by ID
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;

      try {
        const foodData = await api.getFoodById(Number(id));
        setItem(foodData);
      } catch (error) {
        console.error('Failed to fetch item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Generate recipes when item is loaded
  useEffect(() => {
    const generateRecipes = async () => {
      if (!item) return;

      setLoadingRecipes(true);
      try {
        const response = await api.getRecipes([item.name]);
        if (response.results && response.results.length > 0) {
          setGeneratedRecipes(response.results);
        }
      } catch (error) {
        console.error('Failed to generate recipes:', error);
      } finally {
        setLoadingRecipes(false);
      }
    };

    generateRecipes();
  }, [item]);

  // Handle saving a recipe
  const handleSaveRecipe = async (recipe: RecipeGenerated, index: number) => {
    try {
      setSaveStatus({ ...saveStatus, [index]: 'saving' });
      
      await api.setSavedRecipe({
        title: recipe.title,
        instructions: recipe.instructions,
        ingredients_used: recipe.ingredients_used
      });
      
      setSaveStatus({ ...saveStatus, [index]: 'saved' });
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus({ ...saveStatus, [index]: '' });
      }, 2000);
    } catch (error) {
      console.error('Failed to save recipe:', error);
      setSaveStatus({ ...saveStatus, [index]: 'error' });
    }
  };
  

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e7dcc8]">
        <div className="text-2xl font-semibold text-[#193900]">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#e7dcc8] text-[#193900]">
        <h1 className="text-2xl font-bold">Item not found</h1>
        <Link href="/" className="mt-4 underline hover:text-[#193900]/80">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#e7dcc8] px-4 py-12 md:px-8">
      {/* Navigation Breadcrumb */}
      <nav className="mb-8 max-w-300 mx-auto">
        <Link 
          href="/" 
          className="text-sm font-semibold text-[#193900]/60 hover:text-[#193900] transition-colors"
        >
          ← Back to Explorer
        </Link>
      </nav>

      <div className="mx-auto max-w-300 rounded-2xl bg-white p-8 shadow-lg md:p-12">
        <header className="mb-8 border-b border-[#193900]/10 pb-8 text-center">
          <span className="mb-2 inline-block rounded-full bg-[#193900]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#193900]">
            {item.season}
          </span>
          <h1 className="mb-4 text-4xl font-bold capitalize text-[#193900] md:text-5xl">
            {item.name}
          </h1>
          {item.description && (
            <p className="text-lg text-[#193900]/80">
              {item.description}
            </p>
          )}
          {item.eco_score && (
            <div className="mt-4">
              <span className="inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-800">
                Eco Score: {item.eco_score}/10
              </span>
            </div>
          )}
        </header>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-[#193900]">
            AI-Generated Recipes
          </h2>
          
          {loadingRecipes ? (
            <div className="text-center py-8">
              <div className="text-lg text-[#193900]/60">Generating recipes...</div>
            </div>
          ) : generatedRecipes.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {generatedRecipes.map((recipe, index) => (
                <li key={index}>
                  <div className="rounded-xl border border-[#193900]/10 bg-[#e7dcc8]/20 p-6 transition-all hover:-translate-y-1 hover:border-[#193900]/30 hover:bg-[#e7dcc8]/40 hover:shadow-md">
                    <h3 className="font-semibold text-[#193900] text-lg mb-2">
                      {recipe.title}
                    </h3>
                    
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)} 
                        className="bg-[#193900] hover:bg-[#193900]/80 text-white font-semibold py-2 px-4 rounded text-sm transition-colors"
                      >
                        {openDropdown === index ? 'Hide Details' : 'View Details'}
                      </button>
                      
                      <button
                        onClick={() => handleSaveRecipe(recipe, index)}
                        disabled={saveStatus[index] === 'saving'}
                        className={`font-semibold py-2 px-4 rounded text-sm transition-colors ${
                          saveStatus[index] === 'saved'
                            ? 'bg-green-600 text-white'
                            : saveStatus[index] === 'error'
                            ? 'bg-red-600 text-white'
                            : 'bg-white border-2 border-[#193900] text-[#193900] hover:bg-[#193900] hover:text-white'
                        }`}
                      >
                        {saveStatus[index] === 'saving' 
                          ? 'Saving...' 
                          : saveStatus[index] === 'saved'
                          ? '✓ Saved!'
                          : saveStatus[index] === 'error'
                          ? 'Error'
                          : 'Save Recipe'}
                      </button>
                    </div>
                    
                    {openDropdown === index && (
                      <div className="mt-4 border-t border-[#193900]/10 pt-4">
                        <div className="mb-4">
                          <h4 className="font-semibold text-[#193900] mb-2">Ingredients:</h4>
                          <p className="text-sm text-[#193900]/80 whitespace-pre-line">
                            {recipe.ingredients_used}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-[#193900] mb-2">Instructions:</h4>
                          <p className="text-sm text-[#193900]/80 whitespace-pre-line">
                            {recipe.instructions}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#193900]/60">No recipes generated yet. Try refreshing the page.</p>
          )}
        </section>
      </div>
    </main>
  );
}