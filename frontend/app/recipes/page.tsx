"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// --- Types & Constants ---

interface Recipe {
  id: number;
  name: string;
  url: string;
  image: string;
}

const RECIPES_DATA: Recipe[] = [
  {
    id: 1,
    name: "Roasted Butternut Squash Soup",
    url: "https://www.budgetbytes.com/butternut-squash-soup/?utm_source=google&utm_medium=cpc&utm_campaign=22666535188&utm_content=757619904938&utm_term=squash+soup&gad_source=1&gad_campaignid=22666535188&gbraid=0AAAAAoNNKLpqKUcVhLCE2GMfEzINdynJQ&gclid=CjwKCAiAjojLBhAlEiwAcjhrDgi-uIEbeJI8Rja_gFWKq5HdeKrawK9TZHjzZHXHhN2KN_-SrxZ4jxoCzscQAvD_BwE",
    image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400"
  },
  {
    id: 2,
    name: "Apple Cinnamon Oatmeal",
    url: "https://www.thepioneerwoman.com/food-cooking/recipes/a44735780/apple-cinnamon-oatmeal-recipe/?utm_source=google&utm_medium=cpc&utm_campaign=mgu_ga_pw_md_pmx_hybd_mix_ca_18890344267&gad_source=1&gad_campaignid=18891848801&gbraid=0AAAAABxutSrBoNfB1BLNMjnXtebkaQ-Yj&gclid=CjwKCAiAjojLBhAlEiwAcjhrDqPfsntW7HTiPw3JcSoYhrlOaefS7ekMdOtlUSjo_ogQDULFxQ5VeBoCPfcQAvD_BwE",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400"
  },
  {
    id: 3,
    name: "Pumpkin Pasta",
    url: "https://www.jaroflemons.com/creamy-pumpkin-pasta/",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400"
  }
];

// --- Component ---

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API fetch
    const fetchRecipes = async () => {
      try {
        // Simulate network delay if desired, otherwise this runs instantly
        // await new Promise(resolve => setTimeout(resolve, 500)); 
        setRecipes(RECIPES_DATA);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#c9c0a6]">
        <div className="text-2xl font-semibold text-[#193900]">Loading recipes...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#e7dcc8] px-4 py-12 md:px-8">
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-bold text-[#193900] md:text-5xl">
          Popular Recipes
        </h1>
        <p className="text-xs tracking-[0.15em] text-[#193900] md:text-sm">
          DISCOVER THE MOST LOVED DISHES
        </p>
      </header>

      {recipes.length === 0 ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-lg text-[#193900]">
            No recipes available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-300 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 px-4">
          {recipes.map((recipe) => (
            // Accessibility Improvement: Using an <a> tag instead of a div with onClick.
            // This makes the card clickable, tab-able, and SEO friendly.
            <a
              key={recipe.id}
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="p-4 text-xl font-semibold text-gray-800">
                {recipe.name}
              </h3>
            </a>
          ))}
        </div>
      )}
    </main>
  );
};

export default RecipesPage;