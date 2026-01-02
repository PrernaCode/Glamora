import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function MobileMenu({ isOpen, onClose }) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl"
            aria-label="Close menu"
          >
            ×
          </button>

          <div className="mt-8 space-y-4">
            {isAuthenticated ? (
              <>
                <div className="pb-4 border-b">
                  <p className="font-semibold">{user?.user_metadata?.name || 'User'}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="block py-2 hover:text-gray-600"
                >
                  My Profile
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="block py-2 hover:text-gray-600"
                >
                  Cart
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="block py-2 hover:text-gray-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="block py-2 hover:text-gray-600"
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link
              to="/"
              onClick={onClose}
              className="block py-2 hover:text-gray-600"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;