'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { api, Food, Recipe } from '@/utils/api';
import ShoppingCart, { CartItem } from '@/components/ShoppingCart';

// --- HELPER: Format Markdown Text ---
// This turns "**Bold Text**" into actual <strong>Bold Text</strong>
function FormatInstructions({ text }: { text: string }) {
  if (!text) return null;
  
  // Split by double asterisks
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <p className="text-sm text-[#193900] whitespace-pre-line">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Remove asterisks and render bold
          return <strong key={index} className="block mt-2 mb-1 text-[#193900]">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}

// --- COMPONENT: Filter Bar ---

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  selectedSeason: string;
  ecoRange: [number, number];
  onCategoryChange: (c: string) => void;
  onSeasonChange: (s: string) => void;
  onEcoRangeChange: (r: [number, number]) => void;
}

function FilterBar({ 
  categories, selectedCategory, onCategoryChange,
  selectedSeason, onSeasonChange,
  ecoRange, onEcoRangeChange 
}: FilterBarProps) {
  
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), ecoRange[1] - 1);
    onEcoRangeChange([val, ecoRange[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), ecoRange[0] + 1);
    onEcoRangeChange([ecoRange[0], val]);
  };

  return (
    <div className="mx-auto mb-8 flex max-w-5xl flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between">
      <div className="flex-1">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#193900]/60">Category</label>
        <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className="w-full rounded-lg border border-[#193900]/20 bg-[#f8f5f0] p-3 text-[#193900] outline-none focus:border-[#193900]">
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#193900]/60">Season</label>
        <select value={selectedSeason} onChange={(e) => onSeasonChange(e.target.value)} className="w-full rounded-lg border border-[#193900]/20 bg-[#f8f5f0] p-3 text-[#193900] outline-none focus:border-[#193900]">
          <option value="All">All Seasons</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
          <option value="All Year">All Year</option>
        </select>
      </div>
      <div className="flex-[1.5]">
        <div className="mb-2 flex justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#193900]/60">Eco Score Range</label>
            <span className="text-xs font-bold text-[#193900]">{ecoRange[0]} - {ecoRange[1]}</span>
        </div>
        <div className="relative h-10 pt-4">
            <div className="absolute top-5 h-1 w-full rounded-full bg-gray-200"></div>
            <div className="absolute top-5 h-1 rounded-full bg-[#193900]" style={{ left: `${(ecoRange[0] - 1) * 11.1}%`, right: `${100 - ((ecoRange[1] - 1) * 11.1)}%` }}></div>
            <input type="range" min="1" max="10" step="1" value={ecoRange[0]} onChange={handleMinChange} className="pointer-events-none absolute top-3 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#193900] [&::-webkit-slider-thumb]:shadow-md"/>
            <input type="range" min="1" max="10" step="1" value={ecoRange[1]} onChange={handleMaxChange} className="pointer-events-none absolute top-3 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#193900] [&::-webkit-slider-thumb]:shadow-md"/>
        </div>
      </div>
    </div>
  );
}

// --- EXISTING COMPONENTS ---

function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };
  return (
    <section className="mx-auto max-w-5xl px-4 pt-12 pb-4 text-center md:px-8 md:pt-16 md:pb-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-[#193900] sm:text-4xl md:text-5xl">
          Find the Perfect Recipe
        </h1>
        <p className="text-xs tracking-[0.15em] text-[#193900] md:text-sm">SEARCH INGREDIENTS OR DISHES</p>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-2xl relative">
        <input 
          type="text" 
          placeholder="Search for food items..." 
          value={query} onChange={handleSearch}
          className="w-full rounded-full border-2 border-[#193900]/20 bg-white px-6 py-4 text-base text-[#193900] shadow-lg outline-none transition-all placeholder:text-[#193900]/50 focus:-translate-y-0.5 focus:border-[#193900] focus:shadow-xl"
        />
      </form>
    </section>
  );
}

function Ingredients({ 
  onAddToCart, searchQuery, selectedCategory, selectedSeason, ecoRange 
}: { 
  onAddToCart: (food: Food) => void;
  searchQuery: string;
  selectedCategory: string;
  selectedSeason: string;
  ecoRange: [number, number];
}) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const [minEco, maxEco] = ecoRange;

  const fetchFoods = useCallback(async (currentOffset: number, isLoadMore: boolean) => {
    setLoading(true);
    try {
      const data = await api.getFoods(selectedSeason, searchQuery, selectedCategory, minEco, maxEco, currentOffset, LIMIT);
      if (data.length < LIMIT) setHasMore(false);
      else setHasMore(true);

      if (isLoadMore) {
        setFoods((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = data.filter((item) => item.id !== undefined && !existingIds.has(item.id));
          return [...prev, ...uniqueNewItems];
        });
        setOffset(currentOffset + LIMIT);
      } else {
        setFoods(data);
        setOffset(LIMIT);
      }
    } catch (error) {
      console.error("Failed to fetch foods", error);
    } finally {
      setLoading(false);
    }
  }, [selectedSeason, searchQuery, selectedCategory, minEco, maxEco]);

  useEffect(() => {
    fetchFoods(0, false);
  }, [fetchFoods]);

  const handleLoadMore = () => fetchFoods(offset, true);

  return (
    <section className="mx-auto max-w-5xl px-4 pt-2 pb-12 md:px-8">
      <h2 className="mb-8 text-center text-2xl font-bold text-[#193900] md:text-3xl">
        Ingredients (By Eco Score)
      </h2>
      
      {foods.length === 0 && !loading ? (
        <div className="text-center text-[#193900]/60">No ingredients match your filters.</div>
      ) : (
        <>
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 rounded-2xl border border-[#193900]/20 bg-white/30 p-8 text-center backdrop-blur-md md:p-12">
            {foods.map((item) => (
              <li key={item.id} className="contents">
                <div className="relative group h-full">
                  <Link href={`/item/${item.id}`} className="flex h-full min-h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-white p-6 text-center text-[#193900] shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg">
                    <span className={`mb-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        (item.eco_score || 0) >= 8 ? 'bg-green-100 text-green-800' : (item.eco_score || 0) >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>Eco Score: {item.eco_score}/10</span>
                    <span className="capitalize text-lg font-semibold">{item.name}</span>
                    <span className="text-xs uppercase text-[#193900]/60 mt-1">{item.season}</span>
                  </Link>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(item); }} className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#193900]/10 text-[#193900] transition-colors hover:bg-[#193900] hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button onClick={handleLoadMore} disabled={loading} className="rounded-full bg-[#193900] px-8 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100">
                {loading ? "Loading..." : "Load More Ingredients"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

// --- HOME PAGE ---

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe['results']>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedTitles, setSavedTitles] = useState<Set<string>>(new Set());

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [ecoRange, setEcoRange] = useState<[number, number]>([1, 10]);

  useEffect(() => {
    api.getCategory().then(setCategories).catch(console.error);
  }, []);

  const handleAddToCart = (food: Food) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) return prev.map((item) => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { id: food.id!, name: food.name, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };

  const handleGenerate = async () => {
    if (cartItems.length === 0) return;
    setIsGenerating(true);
    const ingredientsList = cartItems.map(i => i.name);
    try {
      const response = await api.getRecipes(ingredientsList);
      setGeneratedRecipes(response.results);
      setTimeout(() => { document.getElementById('recipe-results')?.scrollIntoView({ behavior: 'smooth' }); }, 100);
    } catch (e) {
      console.error("Error generating recipes", e);
      alert("Failed to generate recipes. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async (recipe: typeof generatedRecipes[0]) => {
    try {
      await api.setSavedRecipe({ title: recipe.title, instructions: recipe.instructions, ingredients_used: recipe.ingredients_used });
      setSavedTitles(prev => new Set(prev).add(recipe.title));
    } catch (e) {
      console.error("Error saving recipe", e);
    }
  };

  return (
    <main className={`min-h-screen bg-[#e7dcc8] relative pb-20 transition-all duration-300 ease-in-out ${
      isCartOpen ? 'md:pr-80' : '' 
    }`}>
      
      <ShoppingCart 
        cartItems={cartItems} 
        onGenerate={handleGenerate} 
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        onRemoveItem={handleRemoveFromCart}
      />
      
      <SearchBar onSearch={setSearchQuery} />

      <div className="px-4 md:px-8">
        <FilterBar 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
            ecoRange={ecoRange}
            onEcoRangeChange={setEcoRange}
        />
      </div>

      {(generatedRecipes.length > 0 || isGenerating) && (
        <section id="recipe-results" className="mx-auto max-w-5xl px-4 pt-0 pb-8 md:px-8">
            <div className="rounded-3xl bg-[#193900]/5 p-8 border border-[#193900]/10">
                <h2 className="mb-8 text-center text-3xl font-bold text-[#193900]">
                {isGenerating ? "Cooking up ideas..." : "AI Suggested Recipes"}
                </h2>
                {isGenerating ? (
                    <div className="flex justify-center py-12">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#193900] border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {generatedRecipes.map((recipe, idx) => {
                            const isSaved = savedTitles.has(recipe.title);
                            return (
                                <div key={idx} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-transform hover:-translate-y-1">
                                    
                                    {/* --- HEADER FIX --- */}
                                    {/* 1. Added relative positioning context */}
                                    <div className="bg-[#193900] p-4 text-white relative">
                                        {/* 2. Added padding-right so title doesn't hit the badges */}
                                        <h3 className="text-xl font-bold pr-4 leading-tight">
                                            {recipe.title}
                                        </h3>
                                        
                                        {/* 3. CO2 Badge: Moved BELOW title, not overlapping */}
                                        <div className="mt-3 flex items-center justify-between">
                                          <span className="text-xs font-medium text-green-200 bg-[#193900] border border-green-200/30 rounded-full px-2 py-0.5">
                                             {recipe.co2_saved}
                                          </span>
                                        </div>

                                        {/* 4. "Saved" Badge: Absolute Top Right */}
                                        {isSaved && (
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm uppercase tracking-wider">
                                                    Saved
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 p-6">
                                        <div className="mb-6 rounded-lg bg-green-50 p-3 border border-green-100">
                                            <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-green-800">
                                                <span>🌍</span> Why it&apos;s good
                                            </h4>
                                            <p className="text-xs text-[#193900]/80 mt-1 leading-snug">
                                                {recipe.eco_benefit}
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#193900]/50 mb-1">Ingredients Used</h4>
                                            <p className="text-sm text-[#193900]/80 italic">{recipe.ingredients_used}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#193900]/50 mb-1">Instructions</h4>
                                            {/* --- INSTRUCTION FIX --- */}
                                            {/* Used the helper to render bold text */}
                                            <FormatInstructions text={recipe.instructions} />
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                                        <button onClick={() => !isSaved && handleSaveRecipe(recipe)} disabled={isSaved} className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-bold transition-all ${isSaved ? "border-green-600 bg-green-100 text-green-700 cursor-default" : "border-[#193900] text-[#193900] hover:bg-[#193900] hover:text-white"}`}>
                                            {isSaved ? "Saved!" : "Save to Cookbook"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
      )}
      
      <Ingredients 
        onAddToCart={handleAddToCart} 
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedSeason={selectedSeason}
        ecoRange={ecoRange}
      />
    </main>
  );
}