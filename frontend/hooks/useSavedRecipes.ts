import { useState, useEffect } from 'react';
import { api, SavedRecipe } from '@/lib/api';

export function useSavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await api.getSavedRecipes();
      setSavedRecipes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async (title: string, link: string) => {
    try {
      const newRecipe = await api.saveRecipe({ title, link });
      setSavedRecipes([...savedRecipes, newRecipe]); // Update UI instantly
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const removeRecipe = async (id: number) => {
    try {
      await api.deleteRecipe(id);
      setSavedRecipes(savedRecipes.filter(r => r.id !== id)); // Remove from UI instantly
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return { savedRecipes, loading, addRecipe, removeRecipe };
}