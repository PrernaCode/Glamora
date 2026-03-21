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
    firstName: '',
    lastName: '',
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
      const names = (profile.full_name || '').split(' ');
      setFormData({
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
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
      const { firstName, lastName, ...rest } = formData;
      await dispatch(updateProfile({
        id: user.id,
        ...rest,
        full_name: `${firstName} ${lastName}`.trim()
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
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">

          {/* Sidebar / Mobile Nav */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="hidden md:block">
              <h1 className="text-3xl font-bold mb-2">My Account</h1>
              <p className="text-gray-400 text-sm mb-8">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}</p>
            </div>

            <nav className="flex md:flex-col overflow-x-auto md:overflow-visible scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 space-x-4 md:space-x-0 md:space-y-1 pb-4 md:pb-0 border-b md:border-none border-gray-100 mb-6 md:mb-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-shrink-0 flex items-center gap-3 md:gap-4 px-4 py-3 md:py-4 text-[11px] md:text-xs font-bold tracking-widest transition-all whitespace-nowrap ${activeTab === item.id
                    ? 'bg-gray-50 text-black border-b-2 md:border-b-0 md:border-l-4 border-black'
                    : 'text-gray-400 hover:text-black'
                    }`}
                >
                  <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                disabled={loading && !isEditing}
                className="flex-shrink-0 flex items-center gap-3 md:gap-4 px-4 py-3 md:py-4 text-[11px] md:text-xs font-bold tracking-widest text-gray-400 hover:text-red-600 transition-all whitespace-nowrap disabled:opacity-50 md:mt-8"
              >
                <Icons.Logout className="w-4 h-4 md:w-5 md:h-5" />
                SIGN OUT
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'personal' && (
              <div className="animate-fadeIn">
                <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-4 md:p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6 md:mb-8">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800">Personal Information</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs md:text-sm font-semibold text-[#3EB489] flex items-center gap-1 hover:opacity-80 transition"
                    >
                      <Icons.Edit className="w-3 h-3 md:w-4 md:h-4" /> Edit All
                    </button>
                  </div>

                  <form className="space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* ... first name ... */}
                      <div>
                        <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2 md:mb-3 ml-2">FIRST NAME</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          maxLength={12}
                          disabled={!isEditing}
                          className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-[#F8FAFC] border-none focus:ring-2 focus:ring-[#3EB489]/20 transition-all outline-none font-medium text-gray-700 text-sm"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2 md:mb-3 ml-2">LAST NAME</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          maxLength={12}
                          disabled={!isEditing}
                          className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-[#F8FAFC] border-none focus:ring-2 focus:ring-[#3EB489]/20 transition-all outline-none font-medium text-gray-700 text-sm"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2 md:mb-3 ml-2">PHONE NUMBER</label>
                      <div className="relative group">
                        <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-[#3EB489]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        </div>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-[#F8FAFC] border-none focus:ring-2 focus:ring-[#3EB489]/20 transition-all outline-none font-medium text-gray-700 text-sm"
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                    </div>

                    <div className="pt-2 md:pt-4 pb-4 md:pb-8">
                      <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-4 md:mb-6 ml-2">DEFAULT SHIPPING ADDRESS</label>
                      {isEditing ? (
                        <div className="space-y-4 md:space-y-6 bg-[#F8FAFC] p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2 ml-1">STREET ADDRESS</label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg md:rounded-xl bg-white border-none focus:ring-2 focus:ring-[#3EB489]/20 transition-all outline-none text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2 ml-1">CITY</label>
                              <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg md:rounded-xl bg-white border-none focus:ring-2 focus:ring-[#3EB489]/20 transition-all outline-none text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2 ml-1">POSTAL CODE</label>
                              <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg md:rounded-xl bg-white border-none focus:ring-2 focus:ring-[#3EB489]/20 transition-all outline-none text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 md:p-6 rounded-xl md:rounded-2xl border border-emerald-100 bg-white shadow-sm flex items-center justify-between group hover:border-[#3EB489]/50 transition-all duration-300">
                          <div className="flex items-center gap-3 md:gap-5">
                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-emerald-50 flex items-center justify-center text-[#3EB489]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-sm md:text-base mb-0.5 md:mb-1">Paris Residence</h4>
                              <p className="text-gray-400 text-xs md:text-sm leading-relaxed truncate max-w-[150px] md:max-w-none">{formData.address || '22 Place Vendôme'}</p>
                              <p className="text-gray-400 text-xs md:text-sm">{formData.city || 'Paris'}, {formData.country || 'France'}</p>
                            </div>
                          </div>
                          <div className="text-gray-300 group-hover:text-[#3EB489] transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 sm:gap-6 pt-6 -mx-4 md:-mx-8 px-4 md:px-8 border-t border-gray-50 bg-gray-50/30 rounded-b-xl md:rounded-b-3xl mt-4 md:mt-8">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="w-full sm:w-auto text-sm font-semibold text-gray-500 hover:text-gray-800 transition py-2"
                        >
                          Discard Changes
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="w-full sm:w-auto px-10 py-3.5 rounded-xl md:rounded-2xl bg-[#00674f] text-white font-bold text-sm hover:opacity-90 transition shadow-lg shadow-[#00674f]/20 disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 pb-4 border-b">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-16 md:py-24 bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl mx-4 md:mx-0">
                    <p className="text-gray-400 mb-6">No orders found.</p>
                    <Link to="/" className="inline-block bg-black text-white px-8 md:px-12 py-3 text-xs font-bold tracking-widest hover:bg-gray-800 transition rounded-lg">
                      START SHOPPING
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-100 p-4 md:p-6 hover:shadow-xl transition-all group bg-white rounded-xl md:rounded-2xl">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 md:mb-6">
                          <div>
                            <span className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-1">ORDER ID</span>
                            <span className="font-mono text-xs md:text-sm break-all">{order.id}</span>
                          </div>
                          <div className="flex sm:block justify-between items-center">
                            <span className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-1 sm:text-right">STATUS</span>
                            <span className={`text-[9px] md:text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase ${order.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                              }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                          {(order.order_items || []).map(item => (
                            <div key={item.id || item.product_id} className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center justify-center">
                              {item.image && item.image.startsWith('http') ? (
                                <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <span className="text-lg md:text-xl">📦</span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-2">
                          <span className="text-[10px] md:text-xs text-gray-400 font-medium">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          <span className="text-base md:text-lg font-bold text-gray-900">${Number(order.total_amount).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other tabs follow similar layout patterns */}
            {(activeTab === 'addresses' || activeTab === 'payments' || activeTab === 'settings') && (
              <div className="animate-fadeIn py-16 md:py-24 text-center bg-gray-50 rounded-2xl mx-4 md:mx-0">
                <Icons.Settings className="mx-auto" />
                <h3 className="text-base md:text-lg font-bold mt-4 lowercase tracking-widest opacity-20">Coming Soon</h3>
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
