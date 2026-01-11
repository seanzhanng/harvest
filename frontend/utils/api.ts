// utils/api.ts

const BASE_URL = 'http://localhost:8000';

// --- Types ---

export interface Food {
    id?: number;
    name: string;
    season: string;
    category: string;
    description?: string;
    image?: string;
    eco_score?: number;
}

export interface SavedRecipe {
    id?: number;
    title: string;
    instructions: string;
    ingredients_used: string;
}

export interface Recipe {
    status_coode: number;
    results: Array<{
        title: string;
        instructions: string;
        ingredients_used: string;
    }>;
}

// --- API Client ---

export const api = {

    // FOOD FUNCTIONS

    // 1. GET /foods/
    getFoods: async (season?: string, search?: string, category?: string): Promise<Food[]> => {
        const params = new URLSearchParams();
        if (season) params.append('season', season);
        if (search) params.append('search', search);
        if (category) params.append('category', category);

        const res = await fetch(`${BASE_URL}/foods/?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch foods');
        return res.json();
    },
    // 2. GET /foods/{id}
    getFoodById: async (id: number): Promise<Food> => {
        const res = await fetch(`${BASE_URL}/foods/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch food details');
        return res.json();
    },
    // 3. POST /foods/
    setFood: async (food_data: Omit<Food, 'id'>): Promise<Food> => {
        const res = await fetch(`${BASE_URL}/foods/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(food_data),
        });
        if (!res.ok) throw new Error('Failed to fetch foods');
        return res.json();
    },
    // 4. GET /foods/categories
    getCategory: async(): Promise<string[]> => {
        const res = await fetch(`${BASE_URL}/foods/categories}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch food details');
        return res.json();
    },

    // RECIPE FUNCTIONS

    // 1. POST /recipes/save
    setSavedRecipe: async (recipe: Omit<SavedRecipe, 'id'>): Promise<SavedRecipe> => {
        const res = await fetch(`${BASE_URL}/recipes/save/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipe),
        });
        if (!res.ok) throw new Error('Failed to fetch recipes');
        return res.json();
    },
    // 2. GET /recipes/
    getSavedRecipe: async(): Promise<SavedRecipe[]> => {
        const res = await fetch(`${BASE_URL}/recipes/`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch saved recipes');
        return res.json();
    },
    // 3. DELETE /recipes/{id}
    deleteSavedRecipe: async(id: number) => {
        const res = await fetch(`${BASE_URL}/recipes/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to fetch saved recipes');
        return res.json();
    },
    // 4. POST /recipe-engine/auto-suggest
    getRecipes: async(ingredients: string[]): Promise<Recipe> => {
        const res = await fetch(`${BASE_URL}/recipe-engine/auto-suggest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ingredients}),
        });
        if (!res.ok) throw new Error('Failed to fetch saved recipes');
        return res.json();
    }

};