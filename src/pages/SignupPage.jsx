import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../redux/slices/authSlice';
import { fetchCart, mergeGuestCart } from '../redux/slices/cartSlice';
import { fetchWishlist } from '../redux/slices/wishlistSlice';
import { fetchOrders } from '../redux/slices/ordersSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import signuphero from '../assets/images/signuphero.jpg';
import glamBrand from '../assets/icons/glam_brand.svg';

function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isAuthenticated, loading, error, user } = useSelector(state => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const syncData = async () => {
      if (isAuthenticated && user) {
        const guestCart = JSON.parse(localStorage.getItem('cart_guest') || '{"items":[]}');

        if (guestCart.items.length > 0) {
          await dispatch(mergeGuestCart({ guestItems: guestCart.items }));
          localStorage.removeItem('cart_guest');
        } else {
          await dispatch(fetchCart());
        }

        await dispatch(fetchWishlist());
        await dispatch(fetchOrders({ limit: 5 }));

        addToast('Account created successfully!', 'success');
        navigate('/');
      }
    };
    syncData();
  }, [isAuthenticated, user, navigate, addToast, dispatch]);

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

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    dispatch(signupUser(formData));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Column: Hero Image & Branding (Desktop) */}
      <div className="hidden md:flex md:w-5/12 relative overflow-hidden">
        <img
          src={signuphero}
          alt="Signup Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full p-12 flex flex-col justify-between text-white">
          <div>
            <h1 className="text-2xl font-black tracking-[0.3em] uppercase">GLAMORA</h1>
          </div>
          <div className="max-w-md">
            <h2 className="text-5xl font-bold leading-tight mb-6">Elevate Your Lifestyle</h2>
            <div className="w-12 h-1 bg-white/50 mb-6" />
            <p className="text-xl italic font-light tracking-wide text-white/90 leading-relaxed">
              "Excellence is not an act, but a habit."
            </p>
          </div>
          <div className="text-[10px] font-medium tracking-[0.2em] uppercase opacity-60">
            © 2026 GLAMORA LUXURY RETAIL
          </div>
        </div>
      </div>

      {/* Right Column: Signup Form */}
      <div className="w-full md:w-7/12 flex flex-col items-center justify-center p-8 md:p-20 relative bg-white md:bg-gray-100">
        {/* Mobile-Only Header */}
        <header className="md:hidden w-full absolute top-0 left-0 p-8 z-50">
          <Link to="/" className="flex items-center gap-3 w-fit group cursor-pointer">
            <img src={glamBrand} alt="Glamora" className="w-8 h-8 transition-transform group-hover:scale-105" />
            <span className="text-sm font-black tracking-[0.3em] uppercase group-hover:text-[#3EB489] transition-colors">GLAMORA</span>
          </Link>
        </header>

        <div className="w-full max-w-md animate-fadeIn bg-white md:bg-transparent p-0 md:p-0 rounded-3xl pt-20">
          <div className="mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Create Account</h2>
            <p className="text-gray-400 font-medium">Join our exclusive circle of members and experience the pinnacle of luxury.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="signup-name" className="block text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-3 ml-2">FULL NAME</label>
              <input
                type="text"
                id="signup-name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-2xl bg-[#F8FAFC] border-none focus:ring-2 focus:ring-[#3EB489]/20 transition-all outline-none font-medium text-gray-700 text-sm placeholder:text-gray-300"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-3 ml-2">EMAIL ADDRESS</label>
              <input
                type="email"
                id="signup-email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-2xl bg-[#F8FAFC] border-none focus:ring-2 focus:ring-[#3EB489]/20 transition-all outline-none font-medium text-gray-700 text-sm placeholder:text-gray-300"
                placeholder="name@example.com"
              />
            </div>

            <div className="relative">
              <label htmlFor="signup-password" className="block text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-3 ml-2">PASSWORD</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="signup-password"
                  name="password"
                  autoComplete="new-password"
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <label htmlFor="signup-confirm-password" className="block text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-3 ml-2">CONFIRM PASSWORD</label>
              <div className="relative group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="signup-confirm-password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-[#F8FAFC] border-none focus:ring-2 focus:ring-[#3EB489]/20 transition-all outline-none font-medium text-gray-700 text-sm placeholder:text-gray-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--glamora-green)] text-white py-5 rounded-2xl hover:opacity-90 transition font-bold text-xs tracking-[0.2em] uppercase shadow-xl shadow-[#00674f]/20 disabled:bg-gray-400 mt-8"
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[12px] font-bold text-gray-400 tracking-widest uppercase">
              Already have an account? <Link to="/login" className="text-[#3EB489] ml-1 underline hover:text-[#2d8c6b] transition-colors">LOGIN</Link>
            </p>
          </div>

          <div className="mt-12 flex justify-center gap-8 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            <Link to="/terms" className="hover:text-black transition">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-black transition">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;