import { getCartKey } from '../slices/cartSlice';

// Middleware to persist cart to localStorage
export const cartPersistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // After any cart action, save to localStorage
  if (action.type.startsWith('cart/')) {
    const state = store.getState();
    const cartState = state.cart;
    const userId = state.auth.user?.id; // Get current user ID
    
    const cartKey = getCartKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(cartState));
  }
  
  return result;
};