import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, updateProfile } from '../redux/slices/authSlice';
import { clearCart, loadUserCart } from '../redux/slices/cartSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

// Icons as SVG Components for a clean look
const Icons = {
  PersonalInfo: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  Orders: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
  ),
  Addresses: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
  ),
  Payments: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
  )
};

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const user = useSelector(state => state.auth.user);
  const profile = useSelector(state => state.auth.profile);
  const orders = useSelector(state => state.orders.orders);
  const loading = useSelector(state => state.auth.loading);

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: profile.country || 'United States'
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
        country: profile.country || 'United States'
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      addToast('Signing out...', 'info');
      await dispatch(logoutUser()).unwrap();
      dispatch(clearCart());
      dispatch(loadUserCart(null));
      addToast('Logged out successfully', 'success');
      navigate('/', { replace: true });
    } catch (error) {
      addToast(error || 'Failed to logout', 'error');
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile({
        id: user.id,
        ...formData
      })).unwrap();
      setIsEditing(false);
      addToast('Profile updated successfully', 'success');
    } catch (error) {
      addToast(error || 'Failed to update profile', 'error');
    }
  };

  const navItems = [
    { id: 'personal', label: 'PERSONAL INFO', icon: Icons.PersonalInfo },
    { id: 'orders', label: 'ORDERS', icon: Icons.Orders },
    { id: 'addresses', label: 'ADDRESSES', icon: Icons.Addresses },
    { id: 'payments', label: 'PAYMENTS', icon: Icons.Payments },
    { id: 'settings', label: 'SETTINGS', icon: Icons.Settings },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">

          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-gray-400 text-sm mb-8">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}</p>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-4 text-xs font-bold tracking-widest transition-all ${activeTab === item.id
                    ? 'bg-gray-50 text-black border-l-4 border-black'
                    : 'text-gray-400 hover:text-black'
                    }`}
                >
                  <item.icon />
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                disabled={loading && !isEditing}
                className="w-full flex items-center gap-4 px-4 py-4 text-xs font-bold tracking-widest text-gray-400 hover:text-red-600 transition-all mt-8 disabled:opacity-50"
              >
                <Icons.Logout />
                SIGN OUT
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'personal' && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-8 pb-4 border-b">
                  <h2 className="text-2xl font-bold">Personal Details</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-black text-white px-8 py-2 text-xs font-bold tracking-widest hover:bg-gray-800 transition"
                    >
                      EDIT PROFILE
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-gray-500 text-xs font-bold tracking-widest hover:text-black transition"
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-black text-white px-8 py-2 text-xs font-bold tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
                      >
                        {loading ? 'SAVING...' : 'SAVE PROFILE'}
                      </button>
                    </div>
                  )}
                </div>

                <form className="space-y-8 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">FULL NAME</label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-100 bg-gray-50 disabled:bg-white disabled:border-transparent focus:bg-white focus:border-black transition-all outline-none"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-4 py-3 border border-transparent bg-white text-gray-400 outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">PHONE NUMBER</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-100 bg-gray-50 disabled:bg-white disabled:border-transparent focus:bg-white focus:border-black transition-all outline-none"
                      placeholder="+1 (555) 000-1234"
                    />
                  </div>
                </form>

                {/* Primary Address (Consolidated in Personal Info or a sub-section) */}
                <div className="mt-12">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-50">
                    <h3 className="text-lg font-bold">Primary Address</h3>
                  </div>

                  {isEditing ? (
                    <div className="space-y-6 max-w-2xl">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">STREET ADDRESS</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-100 bg-gray-50 focus:bg-white focus:border-black transition-all outline-none"
                          placeholder="742 Evergreen Terrace"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">CITY</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-100 bg-gray-50 focus:bg-white focus:border-black transition-all outline-none"
                            placeholder="Springfield"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">ZIP CODE</label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-100 bg-gray-50 focus:bg-white focus:border-black transition-all outline-none"
                            placeholder="62704"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">COUNTRY</label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-100 bg-gray-50 focus:bg-white focus:border-black transition-all outline-none appearance-none"
                          >
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="India">India</option>
                            <option value="Canada">Canada</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 flex justify-between items-start max-w-2xl group border border-transparent hover:border-black transition-all">
                      <div>
                        {formData.address ? (
                          <>
                            <p className="font-bold uppercase tracking-widest text-[10px] text-gray-400 mb-2">DEFAULT SHIPPING</p>
                            <p className="font-bold text-sm mb-1">{formData.full_name}</p>
                            <p className="text-gray-600 text-sm">{formData.address}</p>
                            <p className="text-gray-600 text-sm">{formData.city}, {formData.pincode}</p>
                            <p className="text-gray-600 text-sm">{formData.country}</p>
                          </>
                        ) : (
                          <div className="py-4">
                            <Icons.Addresses />
                            <p className="text-gray-400 text-sm mt-2">No address saved yet</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-black transition p-2"
                      >
                        <Icons.Edit />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-8 pb-4 border-b">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-24 bg-gray-50 border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 mb-6">No orders found.</p>
                    <Link to="/" className="inline-block bg-black text-white px-12 py-3 text-xs font-bold tracking-widest hover:bg-gray-800 transition">
                      START SHOPPING
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-100 p-6 hover:shadow-xl transition-all group">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-1">ORDER ID</span>
                            <span className="font-mono text-sm">{order.id}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-1">STATUS</span>
                            <span className={`text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase ${order.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                              }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                          {(order.order_items || []).map(item => (
                            <div key={item.id || item.product_id} className="flex-shrink-0 w-16 h-16 bg-white p-2 border border-gray-50 flex items-center justify-center">
                              {item.image && item.image.startsWith('http') ? (
                                <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <span className="text-xl">📦</span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-2">
                          <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          <span className="text-lg font-bold">${Number(order.total_amount).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other tabs follow similar layout patterns */}
            {(activeTab === 'addresses' || activeTab === 'payments' || activeTab === 'settings') && (
              <div className="animate-fadeIn py-24 text-center bg-gray-50">
                <Icons.Settings />
                <h3 className="text-lg font-bold mt-4 lowercase tracking-widest opacity-20">Coming Soon</h3>
              </div>
            )}

          </main>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out? Your session will be ended and you'll need to sign back in to access your wishlist and profile."
        confirmText={loading ? "SIGNING OUT..." : "CONFIRM SIGN OUT"}
        variant="danger"
      />

      {/* CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}

export default ProfilePage;
