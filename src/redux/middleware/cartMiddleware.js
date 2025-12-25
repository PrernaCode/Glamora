// Middleware to persist cart to localStorage
export const cartPersistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // After any cart action, save to localStorage
  if (action.type.startsWith('cart/')) {
    const cartState = store.getState().cart;
    localStorage.setItem('cart', JSON.stringify(cartState));
  }
  
  return result;
};