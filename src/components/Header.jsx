import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);

  return (
    <>
      <header className="bg-black text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-2xl font-bold tracking-wider cursor-pointer hover:text-gray-300">
                GLAMORA
              </h1>
            </Link>
            
            <div className="flex items-center space-x-6">
              {/* Desktop */}
              <div className="hidden md:flex items-center space-x-6">
                {isAuthenticated ? (
                  <Link to="/profile" className="hover:text-gray-300 transition flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    <span>{user?.user_metadata?.name || user?.email?.split('@')[0]}</span>
                  </Link>
                ) : (
                  <Link to="/login" className="hover:text-gray-300 transition">
                    <span className="text-xl">👤</span>
                  </Link>
                )}

                <Link to="/cart" className="relative hover:text-gray-300 transition">
                  <span className="text-2xl">🛒</span>
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              </div>

              {/* Mobile */}
              <div className="md:hidden flex items-center space-x-4">
                <Link to="/cart" className="relative">
                  <span className="text-2xl">🛒</span>
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="text-2xl"
                  aria-label="Open menu"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}

export default Header;