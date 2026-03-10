import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const wishlistCount = useSelector(state => state.wishlist.items.length);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) { // Adjust scroll threshold as needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg py-4 md:py-6 text-black' : 'bg-transparent py-6 md:py-10 text-white'}`}>
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-xl md:text-3xl font-black tracking-tighter cursor-pointer hover:text-[#00674f] transition-all duration-300">
                GLAMORA
              </h1>
            </Link>

            <nav className="hidden lg:flex items-center gap-12">
              {['New Arrivals', 'Mens', 'Womens', 'Collections', 'Sale'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(' ', '-')}`}
                  className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative group ${scrolled ? 'hover:text-[#00674f]' : 'hover:text-white/70'}`}
                >
                  {item}
                  <span className={`absolute -bottom-2 left-0 w-0 h-[2px] bg-[#00674f] transition-all duration-300 group-hover:w-full ${!scrolled && 'bg-white'}`}></span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Desktop Search Placeholder */}
              <div className={`hidden md:flex items-center rounded-full px-4 py-2 w-48 lg:w-64 transition-colors ${scrolled ? 'bg-gray-100' : 'bg-white/10 backdrop-blur-md'}`}>
                <svg className={`w-4 h-4 mr-2 ${scrolled ? 'text-gray-400' : 'text-white/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search products..." className="bg-transparent text-xs w-full focus:outline-none placeholder:text-inherit/50" />
              </div>
              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/wishlist" className="relative hover:opacity-70 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className={`absolute -top-2 -right-2 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${scrolled ? 'bg-black text-white' : 'bg-white text-black'}`}>
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <Link to="/profile" className="hover:opacity-70 transition flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{user?.user_metadata?.name || user?.email?.split('@')[0]}</span>
                  </Link>
                ) : (
                  <Link to="/login" className="hover:opacity-70 transition">
                    <span className="text-xl">👤</span>
                  </Link>
                )}

                <Link to="/cart" className="relative hover:opacity-70 transition">
                  <span className="text-2xl">🛒</span>
                  {totalQuantity > 0 && (
                    <span className={`absolute -top-2 -right-2 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold ${scrolled ? 'bg-black text-white' : 'bg-white text-black'}`}>
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              </div>

              {/* Mobile */}
              <div className="md:hidden flex items-center space-x-4">
                <Link to="/wishlist" className="relative">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
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