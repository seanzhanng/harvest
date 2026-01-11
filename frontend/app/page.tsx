'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api, Food, Recipe } from '@/utils/api';

// --- Types ---

interface CartItem {
  id: number;
  name: string;
  quantity: number;
}

// --- Components ---

function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <section className="px-4 py-12 text-center md:px-8 md:py-16">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-[#193900] sm:text-4xl md:text-5xl">
          Find the Perfect Recipe
        </h1>
        <p className="text-xs tracking-[0.15em] text-[#193900] md:text-sm">
          SEARCH INGREDIENTS OR DISHES
        </p>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-150">
        <input 
          type="text" 
          aria-label="Search ingredients"
          placeholder="Search for food items or recipes..." 
          value={query} 
          onChange={handleSearch}
          className="w-full rounded-full border-2 border-[#193900]/20 bg-white px-6 py-4 text-base text-[#193900] shadow-lg outline-none transition-all duration-200 placeholder:text-[#193900]/50 focus:-translate-y-0.5 focus:border-[#193900] focus:shadow-xl md:text-lg"
        />
      </form>
    </section>
  );
}

function Ingredients({ 
  onAddToCart, 
  searchQuery 
}: { 
  onAddToCart: (food: Food) => void;
  searchQuery: string;
}) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        // Backend now automatically sorts by Eco Score DESC
        const data = await api.getFoods(undefined, searchQuery);
        setFoods(data);
      } catch (error) {
        console.error("Failed to fetch foods", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [searchQuery]);

  if (loading) return <div className="text-center py-10 text-[#193900]">Loading fresh ingredients...</div>;

  return (
    <section className="mx-auto max-w-300 px-4 py-8 md:px-8 md:py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-[#193900] md:text-3xl">
        Top Ingredients (By Eco Score)
      </h2>
      
      <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 rounded-2xl border border-[#193900]/20 bg-white/30 p-8 text-center backdrop-blur-md md:p-12">
        {foods.map((item) => (
          <li key={item.id} className="contents">
            <div className="relative group">
              
              {/* The Card Link */}
              <Link 
                href={`/item/${item.id}`}
                className="flex min-h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-white p-6 text-center text-[#193900] shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                {/* Eco Score Badge */}
                <span className={`mb-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    (item.eco_score || 0) >= 8 ? 'bg-green-100 text-green-800' :
                    (item.eco_score || 0) >= 5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    Eco Score: {item.eco_score}/10
                </span>

                <span className="capitalize text-lg font-semibold">{item.name}</span>
                <span className="text-xs uppercase text-[#193900]/60 mt-1">{item.season}</span>
              </Link>

              {/* The "+" Add Button */}
              <button
                onClick={(e) => {
                  e.preventDefault(); 
                  e.stopPropagation();
                  onAddToCart(item);
                }}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#193900]/10 text-[#193900] transition-colors hover:bg-[#193900] hover:text-white"
                title="Add to Cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </button>

            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ShoppingCart({ 
  cartItems, 
  onGenerate 
}: { 
  cartItems: CartItem[], 
  onGenerate: () => void 
}) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed right-4 top-24 h-[600px] w-64 rounded-xl border border-[#193900]/20 bg-white/95 backdrop-blur shadow-2xl z-40 flex flex-col overflow-hidden">
      {/* Cart Header */}
      <div className="border-b border-gray-200 bg-[#193900]/5 p-4">
        <h2 className="text-lg font-bold text-[#193900] flex items-center gap-2">
          <span>🛒</span> Your Basket
        </h2>
        <p className="text-xs text-[#193900]/60">{totalItems} ingredients selected</p>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <p className="text-center text-sm">Add ingredients to generate a recipe!</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 shadow-sm"
              >
                <span className="text-sm font-semibold capitalize text-[#193900]">{item.name}</span>
                <span className="rounded-full bg-[#193900]/10 px-2 py-0.5 text-xs font-bold text-[#193900]">
                  x{item.quantity}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer / Generate Button */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <button
          onClick={onGenerate}
          disabled={cartItems.length === 0}
          className="w-full rounded-lg bg-[#193900] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#193900]/90 disabled:cursor-not-allowed disabled:opacity-50 hover:scale-[1.02]"
        >
          ✨ Generate Recipe
        </button>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe['results']>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Add Item Logic
  const handleAddToCart = (food: Food) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: food.id!, name: food.name, quantity: 1 }];
    });
  };

  // Generate Logic
  const handleGenerate = async () => {
    if (cartItems.length === 0) return;
    
    setIsGenerating(true);
    const ingredientsList = cartItems.map(i => i.name);
    
    try {
      const response = await api.getRecipes(ingredientsList);
      setGeneratedRecipes(response.results);
      
      setTimeout(() => {
        document.getElementById('recipe-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error("Error generating recipes", e);
      alert("Failed to generate recipes. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#e7dcc8] relative pb-20">
      
      <ShoppingCart cartItems={cartItems} onGenerate={handleGenerate} />
      
      <SearchBar onSearch={setSearchQuery} />
      
      <Ingredients onAddToCart={handleAddToCart} searchQuery={searchQuery} />

      {/* Results Section */}
      {(generatedRecipes.length > 0 || isGenerating) && (
        <section id="recipe-results" className="mx-auto max-w-300 px-4 py-12 md:px-8">
          <div className="border-t border-[#193900]/20 pt-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#193900]">
              {isGenerating ? "Cooking up ideas..." : "AI Suggested Recipes"}
            </h2>

            {isGenerating ? (
              <div className="flex justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#193900] border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {generatedRecipes.map((recipe, idx) => (
                  <div key={idx} className="overflow-hidden rounded-2xl bg-white shadow-lg">
                    <div className="bg-[#193900] p-4 text-white">
                      <h3 className="text-xl font-bold">{recipe.title}</h3>
                    </div>
                    <div className="p-6">
                      <div className="mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#193900]/50 mb-1">Ingredients Used</h4>
                        <p className="text-sm text-[#193900]/80 italic">{recipe.ingredients_used}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#193900]/50 mb-1">Instructions</h4>
                        <p className="text-sm text-[#193900] whitespace-pre-line">{recipe.instructions}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}