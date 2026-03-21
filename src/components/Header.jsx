import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetSuggestionsQuery } from '../redux/slices/productsApi';
import useDebounce from '../hooks/useDebounce';
import MobileMenu from './MobileMenu';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const debouncedSearch = useDebounce(searchInput, 500);

  // Mirror URL ?search param — when PLP clears it (e.g. category click), empty the input
  useEffect(() => {
    const urlTerm = searchParams.get('search') || '';
    setSearchInput(urlTerm);
  }, [searchParams]);

  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const wishlistCount = useSelector(state => state.wishlist.items.length);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const profile = useSelector(state => state.auth.profile);

  const { data: suggestions, isFetching: loadingSuggestions } = useGetSuggestionsQuery(
    debouncedSearch,
    { skip: debouncedSearch.trim().length < 2 }
  );

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const term = searchInput.trim().substring(0, 50);
    setShowSuggestions(false);
    if (term) {
      navigate(`/homepage?search=${encodeURIComponent(term)}`);
    } else {
      navigate('/homepage');
    }
  };

  const handleSuggestionClick = (productId) => {
    setSearchInput('');
    setShowSuggestions(false);
    navigate(`/product/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setShowSuggestions(false);
  };

  const isDropdownVisible = showSuggestions && debouncedSearch.trim().length >= 2;

  const handleNavClick = (e, item) => {
    const isLandingPage = window.location.pathname === '/';
    const itemId = item.toLowerCase().replace(' ', '-');

    if (item === 'About') return; // Link handles it

    if (item === 'Collections') {
      navigate('/homepage');
      return;
    }

    if (isLandingPage && (item === 'Categories' || item === 'New Arrivals' || item === 'Best Sellers')) {
      e.preventDefault();
      const element = document.getElementById(itemId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item === 'New Arrivals' || item === 'Best Sellers' || item === 'Categories') {
      e.preventDefault();
      if (item === 'Categories') {
        navigate('/homepage');
      } else {
        navigate(`/homepage?collection=${itemId}`);
      }
    }
  };

  return (
    <>
      <header className="fixed w-full z-50 bg-white shadow-sm border-b border-gray-100 py-4 md:py-5 text-black">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-xl md:text-3xl font-black tracking-tighter cursor-pointer hover:text-[#00674f] transition-all duration-300">
                GLAMORA
              </h1>
            </Link>

            <nav className="hidden lg:flex items-center gap-12">
              {['Collections', 'Categories', 'New Arrivals', 'Best Sellers', 'About'].map((item) => (
                <Link
                  key={item}
                  to={item === 'About' ? '/about' : item === 'Collections' ? '/homepage' : '#'}
                  onClick={(e) => handleNavClick(e, item)}
                  className="text-[11px] font-black uppercase tracking-[0.3em] transition-all relative group hover:text-[#00674f]"
                >
                  {item}
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#00674f] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4 md:space-x-6">

              {/* ── Global Search (Desktop) ── */}
              <div ref={searchRef} className="hidden md:block relative z-50">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center rounded-full px-4 py-2 w-48 lg:w-64 bg-gray-100 focus-within:ring-2 focus-within:ring-[#00674f]/20 focus-within:bg-white transition-all"
                >
                  <svg className="w-4 h-4 mr-2 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                   <input
                    type="text"
                    placeholder="Search collection..."
                    value={searchInput}
                    onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => { if (searchInput.trim().length >= 2) setShowSuggestions(true); }}
                    onKeyDown={handleKeyDown}
                    maxLength={50}
                    className="bg-transparent text-xs w-full focus:outline-none placeholder:text-gray-400 text-black font-medium"
                    aria-label="Search products"
                    autoComplete="off"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => { setSearchInput(''); setShowSuggestions(false); }}
                      className="text-gray-400 hover:text-black transition text-xs ml-1 shrink-0"
                      aria-label="Clear search"
                    >✕</button>
                  )}
                </form>

                {/* ── Suggestions Dropdown ── */}
                {isDropdownVisible && (
                  <div className="absolute top-full mt-2 left-0 w-full lg:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {loadingSuggestions ? (
                      <div className="flex items-center justify-center py-5">
                        <div className="w-4 h-4 border-2 border-[#00674f]/30 border-t-[#00674f] rounded-full animate-spin" />
                      </div>
                    ) : suggestions?.length > 0 ? (
                      <>
                        <p className="px-4 pt-3 pb-1 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Suggestions</p>
                        {suggestions.map(product => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleSuggestionClick(product.id)}
                            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                          >
                            <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <span className="text-xs font-bold text-gray-800 truncate">{product.title}</span>
                          </button>
                        ))}
                        <div className="h-px bg-gray-100 mx-4" />
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#00674f] hover:bg-gray-50 transition-colors"
                        >
                          <span>View all results for "{searchInput.trim()}"</span>
                          <span>→</span>
                        </button>
                      </>
                    ) : (
                      <div className="px-4 py-5 text-center">
                        <p className="text-xs font-bold text-gray-400">No products found</p>
                        <p className="text-[10px] text-gray-300 mt-1">Try a different keyword</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/wishlist" className="relative hover:text-[#00674f] transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold bg-black text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <Link to="/profile" className="hover:text-[#00674f] transition flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {(profile?.full_name?.split(' ')[0]) || (user?.user_metadata?.name?.split(' ')[0]) || user?.email?.split('@')[0]}
                    </span>
                  </Link>
                ) : (
                  <Link to="/login" className="hover:text-[#00674f] transition">
                    <span className="text-xl">👤</span>
                  </Link>
                )}

                <Link to="/cart" className="relative hover:text-[#00674f] transition">
                  <span className="text-2xl">🛒</span>
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold bg-black text-white">
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
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative">
                  <span className="text-2xl">🛒</span>
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
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
        handleNavClick={handleNavClick}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearchSubmit={handleSubmit}
      />
    </>
  );
}

export default Header;