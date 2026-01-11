'use client';

// Exporting this interface so the parent page can use it for state
export interface CartItem {
  id: number;
  name: string;
  quantity: number;
}

interface ShoppingCartProps {
  cartItems: CartItem[];
  onGenerate: () => void;
}

export default function ShoppingCart({ cartItems, onGenerate }: ShoppingCartProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // Fixed positioning allows it to float, but we hide it on small mobile screens (hidden md:flex) 
    // to prevent it from covering the entire phone screen.
    <aside className="fixed right-6 top-24 hidden h-[calc(100vh-8rem)] w-72 flex-col overflow-hidden rounded-xl border border-[#193900]/20 bg-white/95 shadow-2xl backdrop-blur z-40 md:flex">
      
      {/* Cart Header */}
      <div className="border-b border-gray-200 bg-[#193900]/5 p-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#193900]">
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
      <div className="border-t border-gray-200 bg-white p-4">
        <button
          onClick={onGenerate}
          disabled={cartItems.length === 0}
          className="w-full rounded-lg bg-[#193900] py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-[#193900]/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ✨ Generate Recipe
        </button>
      </div>
    </aside>
  );
}