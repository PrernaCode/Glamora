import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { initializeAuth } from './redux/slices/authSlice';
import { loadUserCart } from './redux/slices/cartSlice';

import { fetchCart, mergeGuestCart } from './redux/slices/cartSlice';
import { fetchOrders } from './redux/slices/ordersSlice';
import { fetchWishlist } from './redux/slices/wishlistSlice';

// Initialize auth and sync with Supabase
const initializeApp = async () => {
  // 1. Recover session
  await store.dispatch(initializeAuth());

  const state = store.getState();
  const userId = state.auth.user?.id;
  const guestCart = JSON.parse(localStorage.getItem('cart_guest') || '{"items":[]}');

  if (userId) {
    // 2. If user is logged in, sync DB data
    if (guestCart.items.length > 0) {
      // Merge guest cart if it has items
      await store.dispatch(mergeGuestCart({ userId, guestItems: guestCart.items }));
      localStorage.removeItem('cart_guest');
    } else {
      // Just fetch existing cart
      await store.dispatch(fetchCart(userId));
    }
    // 3. Fetch orders history & wishlist
    await store.dispatch(fetchOrders(userId));
    await store.dispatch(fetchWishlist(userId));
  }
};

initializeApp();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);