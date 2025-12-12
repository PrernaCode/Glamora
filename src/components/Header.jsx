import React from 'react';
import { useSelector } from 'react-redux';

function Header() {
  const cartItems = useSelector(state => state.cart.items);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wider">GLAMORA</h1>
          
          <div className="flex items-center space-x-6">
            <button className="relative">
              <span className="text-lg">🛒</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;