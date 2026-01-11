'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- Types ---

interface ItemData {
  id: string;
  name: string;
  season: string;
  description: string;
  recipes: Array<{ name: string; url: string }>;
}

// --- Component ---

export default function ItemPage() {
  const params = useParams();
  // Ensure we handle the possibility of params.id being an array (though unlikely in simple routes)
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [item, setItem] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;

      try {
        // Simulating API fetch based on ID
        // In a real app, you would fetch `/api/items/${id}`
        
        // Mock data logic just for demonstration
        const mockData: ItemData = {
          id: id, 
          name: decodeURIComponent(id), // Decodes "apple" from URL
          season: "Fall",
          description: "Crisp, sweet, and perfect for baking or snacking. Best enjoyed fresh from the orchard.",
          recipes: [
            { name: "Apple Pie", url: "#" },
            { name: "Cinnamon Apple Oatmeal", url: "#" },
            { name: "Apple Cider", url: "#" }
          ]
        };

        setItem(mockData);
      } catch (error) {
        console.error('Failed to fetch item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

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
          <p className="text-lg text-[#193900]/80">
            {item.description}
          </p>
        </header>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-[#193900]">
            Recommended Recipes
          </h2>
          {item.recipes.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {item.recipes.map((recipe, index) => (
                <li key={index}>
                  <div 
                    className="rounded-xl border border-[#193900]/10 bg-[#e7dcc8]/20 p-6 transition-all hover:-translate-y-1 hover:border-[#193900]/30 hover:bg-[#e7dcc8]/40 hover:shadow-md"
                  >
                    <a href={recipe.url} className="font-semibold text-[#193900] hover:underline">
                      {recipe.name}
                    </a>
                    <div className="mt-2">
                      <button onClick={() => setOpenDropdown(openDropdown === index ? null : index)} className="bg-[#193900] hover:bg-[#193900]/80 text-white font-semibold py-2 px-4 rounded text-sm">View recipes</button>
                      {openDropdown === index && (
                        <div>
                          <p className="px-4 py-2 text-gray-500 text-sm">Placholder for gemini recipe...</p>
                          <a href={`https://google.com`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Recipe 1</a>
                          <a href={`https://google.com`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Recipe 2</a>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#193900]/60">No recipes found for this item.</p>
          )}
        </section>
      </div>
    </main>
  );
}