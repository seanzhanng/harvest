const BASE_URL = "http://localhost:8000";

// --- TYPES ---
export interface FoodItem {
  id?: number;
  name: string;
  category: string;
  season?: string;
  image?: string;
}

export interface SavedRecipe {
  id?: number;
  title: string;
  link: string;
  notes?: string;
}

export interface RecipeResult {
  meal_name: string;
  recipe_link: string;
}

// --- API METHODS ---
export const api = {
  // === FOODS ENDPOINTS ===
  getAllFoods: async (search: string = ""): Promise<FoodItem[]> => {
    const res = await fetch(`${BASE_URL}/foods/${search ? `?search=${search}` : ''}`);
    return res.json();
  },

  getFoodById: async (id: number): Promise<FoodItem> => {
    const res = await fetch(`${BASE_URL}/foods/${id}`);
    if (!res.ok) throw new Error("Food not found");
    return res.json();
  },

  createFood: async (food: FoodItem): Promise<FoodItem> => {
    const res = await fetch(`${BASE_URL}/foods/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(food),
    });
    return res.json();
  },

  // === SAVED RECIPES ENDPOINTS (The "Cookbook") ===
  getSavedRecipes: async (): Promise<SavedRecipe[]> => {
    const res = await fetch(`${BASE_URL}/recipes/`);
    return res.json();
  },

  saveRecipe: async (recipe: SavedRecipe): Promise<SavedRecipe> => {
    const res = await fetch(`${BASE_URL}/recipes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    });
    return res.json();
  },

  deleteRecipe: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/recipes/${id}`, { method: "DELETE" });
  },

  // === RECIPE ENGINE (AI + Scraper) ===
  autoSuggest: async (ingredients: string[]): Promise<RecipeResult[]> => {
    const res = await fetch(`${BASE_URL}/recipe-engine/auto-suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });
    const data = await res.json();
    return data.results;
  },
};