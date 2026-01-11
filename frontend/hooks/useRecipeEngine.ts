import { useState } from 'react';
import { api, RecipeResult } from '@/lib/api';

export function useRecipeEngine() {
  const [results, setResults] = useState<RecipeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateRecipes = async (ingredients: string[]) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await api.autoSuggest(ingredients);
      if (data.length === 0) {
        setError("We couldn't find any recipes for that combo.");
      }
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("The AI Chef is busy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, generateRecipes };
}