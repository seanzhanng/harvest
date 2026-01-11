import { useState, useEffect } from 'react';
import { api, FoodItem } from '@/lib/api';

export function useFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all foods on mount
  useEffect(() => {
    refreshFoods();
  }, []);

  const refreshFoods = async (search: string = "") => {
    setLoading(true);
    try {
      const data = await api.getAllFoods(search);
      setFoods(data);
    } catch (err) {
      console.error("Error loading foods:", err);
    } finally {
      setLoading(false);
    }
  };

  return { foods, loading, refreshFoods };
}