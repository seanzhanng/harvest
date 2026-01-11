'use client';

export interface CartItem {
  id: number;
  name: string;
  quantity: number;
}

interface ShoppingCartProps {
  cartItems: CartItem[];
  onGenerate: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onRemoveItem: (id: number) => void; // <--- NEW PROP
}

export default function ShoppingCart({ 
  cartItems, 
  onGenerate, 
  isOpen, 
  setIsOpen, 
  onRemoveItem 
}: ShoppingCartProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col items-end">
      
      {/* 1. The Toggle Button (Click to Open/Close) */}
      <button 
        onClick={() => setIsOpen(!isOpen)} // <--- Toggle Logic
        className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-[#193900] text-white' : 'bg-white text-[#193900]'
        }`}
      >
        <span className="text-xl">🛒</span>
        {!isOpen && totalItems > 0 && (
          <span className="ml-1 text-sm font-bold">{totalItems}</span>
        )}
        {isOpen && (
           <span className="text-sm font-bold">Close</span>
        )}
      </button>

      {/* 2. The Cart Panel */}
      <div className={`mt-4 w-72 overflow-hidden rounded-xl border border-[#193900]/20 bg-white/95 shadow-2xl backdrop-blur transition-all duration-300 origin-top-right ${
        isOpen 
          ? 'h-[calc(100vh-8rem)] opacity-100 scale-100 translate-y-0' 
          : 'h-0 opacity-0 scale-95 -translate-y-4 pointer-events-none'
      }`}>
        
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 bg-[#193900]/5 p-4">
            <h2 className="text-lg font-bold text-[#193900]">Your Basket</h2>
            <p className="text-xs text-[#193900]/60">{totalItems} ingredients selected</p>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-gray-400">
                <p className="text-center text-sm">Add ingredients to generate a recipe!</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 shadow-sm group">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold capitalize text-[#193900]">{item.name}</span>
                        <span className="text-[10px] text-[#193900]/60">Qty: {item.quantity}</span>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 opacity-0 transition-opacity hover:bg-red-200 group-hover:opacity-100"
                        title="Remove item"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-white p-4">
            <button
              onClick={onGenerate}
              disabled={cartItems.length === 0}
              className="w-full rounded-lg bg-[#193900] py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-[#193900]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ✨ Generate Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}