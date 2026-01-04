import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { clearCart, loadUserCart } from '../redux/slices/cartSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/Toast';

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const user = useSelector(state => state.auth.user);
  const cartItems = useSelector(state => state.cart.items);
  const totalAmount = useSelector(state => state.cart.totalAmount);
  const orders = useSelector(state => state.orders.orders);

  const handleLogout = async () => {
    // DON'T delete user's cart from localStorage (keep it for next login)
    // Just clear Redux state and switch to guest cart
    
    await dispatch(logoutUser());
    dispatch(clearCart());
    dispatch(loadUserCart(null)); // Load guest cart
    
    addToast('Logged out successfully', 'success');
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{user?.user_metadata?.name || 'User'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-mono text-xs text-gray-500">{user?.id?.slice(0, 20)}...</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-semibold">
                  {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          {/* Cart Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Items in Cart</span>
                <span className="font-semibold">{cartItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value</span>
                <span className="font-semibold">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold">{orders.length}</span>
              </div>
            </div>
            {cartItems.length > 0 && (
              <Link
                to="/cart"
                className="mt-4 block w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition text-center"
              >
                View Cart
              </Link>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-5xl mb-3">📦</div>
              <p>No orders yet</p>
              <p className="text-sm mt-2">Start shopping to see your orders here</p>
              <Link
                to="/"
                className="inline-block mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-mono font-semibold">{order.id}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-bold text-lg">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600 mb-2">Items ({order.items.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
                          {item.image && item.image.startsWith('http') ? (
                            <img 
                              src={item.image} 
                              alt={item.title || item.name}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <span className="text-2xl">{item.image}</span>
                          )}
                          <span className="text-sm">x{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-sm text-gray-500">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t mt-3 pt-3">
                    <p className="text-sm text-gray-600">Shipping Address</p>
                    <p className="text-sm">
                      {order.shippingAddress.fullName}, {order.shippingAddress.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;


