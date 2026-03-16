import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function MobileMenu({ 
  isOpen, 
  onClose, 
  handleNavClick, 
  searchInput, 
  setSearchInput, 
  onSearchSubmit 
}) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);

  if (!isOpen) return null;

  const navItems = ['Collections', 'Categories', 'New Arrivals', 'Best Sellers', 'About'];

  const handleMobileNavClick = (e, item) => {
    handleNavClick(e, item);
    onClose();
  };

  const handleMobileSearchSubmit = (e) => {
    onSearchSubmit(e);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Menu Container */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-white shadow-2xl z-[9999] transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header Area */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-gray-100">
          <h2 className="text-xl font-black tracking-tighter">GLAMORA</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-2xl"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          
          {/* Mobile Search */}
          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 px-2">Quick Search</p>
            <form
              onSubmit={handleMobileSearchSubmit}
              className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00674f]/10 transition-all"
            >
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                maxLength={50}
                className="bg-transparent text-sm w-full focus:outline-none placeholder:text-gray-400 font-medium"
                autoComplete="off"
              />
            </form>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 px-2">Navigation</p>
            {navItems.map((item) => (
              <Link
                key={item}
                to={item === 'About' ? '/about' : item === 'Collections' ? '/homepage' : '#'}
                onClick={(e) => handleMobileNavClick(e, item)}
                className="flex items-center justify-between w-full px-4 py-4 rounded-2xl hover:bg-gray-50 text-sm font-bold tracking-wide transition-all group"
              >
                <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-[#00674f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>

          <div className="my-10 h-px bg-gray-100" />

          {/* User Area */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 px-2">Account</p>
            {isAuthenticated ? (
              <div className="px-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#00674f]/10 flex items-center justify-center text-xl">👤</div>
                  <div>
                    <p className="font-bold text-sm">{user?.user_metadata?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 overflow-hidden text-ellipsis max-w-[150px]">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/profile" onClick={onClose} className="flex items-center justify-center py-3 bg-gray-50 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">Profile</Link>
                  <Link to="/cart" onClick={onClose} className="flex items-center justify-center py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors">Cart</Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-2">
                <Link to="/login" onClick={onClose} className="flex items-center justify-center py-4 bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Log In</Link>
                <Link to="/signup" onClick={onClose} className="flex items-center justify-center py-4 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-8 bg-gray-50/50">
          <p className="text-[10px] text-gray-400 text-center font-medium">© 2024 GLAMORA. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;