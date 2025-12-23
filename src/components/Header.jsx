import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Header() {
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-bold tracking-wider cursor-pointer hover:text-gray-300">
              GLAMORA
            </h1>
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* User Icon/Name */}
            {isAuthenticated ? (
              <Link to="/profile" className="hover:text-gray-300 transition flex items-center gap-2">
                <span className="text-xl">👤</span>
                <span className="hidden md:inline">
                  {user?.user_metadata?.name || user?.email?.split('@')[0]}
                </span>
              </Link>
            ) : (
              <Link to="/login" className="hover:text-gray-300 transition">
                <span className="text-xl">👤</span>
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative hover:text-gray-300 transition">
              <span className="text-2xl">🛒</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

