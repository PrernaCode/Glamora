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

  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="max-w-md w-full bg-white px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-3 ml-1">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-2xl bg-[#F8FAFC] border-none focus:ring-2 focus:ring-[#3EB489]/20 transition-all outline-none font-medium text-gray-700 text-sm placeholder:text-gray-300"
              placeholder="name@luxury.com"
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-3 ml-1">
              <label className="block text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">
                PASSWORD
              </label>
            </div>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-2xl bg-[#F8FAFC] border-none focus:ring-2 focus:ring-[#3EB489]/20 transition-all outline-none font-medium text-gray-700 text-sm placeholder:text-gray-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00674f] text-white py-4 rounded-2xl hover:opacity-90 transition font-bold text-sm tracking-widest uppercase shadow-lg shadow-[#00674f]/20 disabled:bg-gray-400 mt-4"
          >
            {loading ? 'Processing...' : 'Sign In'}
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