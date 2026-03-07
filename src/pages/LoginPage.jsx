import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/slices/authSlice';
import { fetchCart, mergeGuestCart } from '../redux/slices/cartSlice';
import { fetchWishlist } from '../redux/slices/wishlistSlice';
import { fetchOrders } from '../redux/slices/ordersSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../components/Toast';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { isAuthenticated, loading, error, user } = useSelector(state => state.auth);

  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const syncData = async () => {
      if (isAuthenticated && user) {
        const guestCart = JSON.parse(localStorage.getItem('cart_guest') || '{"items":[]}');

        if (guestCart.items.length > 0) {
          await dispatch(mergeGuestCart({ userId: user.id, guestItems: guestCart.items }));
          localStorage.removeItem('cart_guest');
        } else {
          await dispatch(fetchCart(user.id));
        }

        await dispatch(fetchWishlist(user.id));
        await dispatch(fetchOrders(user.id));

        addToast('Login successful!', 'success');
        navigate(from, { replace: true });
      }
    };
    syncData();
  }, [isAuthenticated, user, navigate, addToast, dispatch, from]);

  useEffect(() => {
    if (error) {
      addToast(error, 'error');
    }
  }, [error, addToast]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold disabled:bg-gray-400"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-black font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;