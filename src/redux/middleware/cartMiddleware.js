import { getCartKey, syncCartItem, removeItemFromDB } from '../slices/cartSlice';

// Middleware to persist cart to localStorage and Supabase
export const cartPersistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const state = store.getState();
  const userId = state.auth.user?.id;

  // 1. Sync to LocalStorage (Immediate backup)
  if (action.type.startsWith('cart/')) {
    const cartState = state.cart;
    const cartKey = getCartKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(cartState));
  }

  // 2. Sync to Supabase (Only if logged in and not an extraReducers/thunk action to avoid loops)
  if (userId && action.type.startsWith('cart/') && !action.type.includes('/fulfilled') && !action.type.includes('/pending')) {
    const cartItems = state.cart.items;

    if (action.type === 'cart/addToCart' || action.type === 'cart/updateQuantity') {
      const itemToSync = action.type === 'cart/addToCart'
        ? action.payload
        : cartItems.find(i => i.id === action.payload.id);

      if (itemToSync) {
        // We need the full item state from the store after the reducer ran
        const updatedItem = cartItems.find(i => i.id === (itemToSync.id || itemToSync));
        if (updatedItem) {
          store.dispatch(syncCartItem({ userId, item: updatedItem }));
        }
      }
    }

    if (action.type === 'cart/removeFromCart') {
      store.dispatch(removeItemFromDB({ userId, productId: action.payload }));
    }

    if (action.type === 'cart/clearCart') {
      import('../../supabaseClient').then(({ supabase }) => {
        supabase.from('cart_items').delete().eq('user_id', userId).then();
      });
    }
  }

  return result;
};