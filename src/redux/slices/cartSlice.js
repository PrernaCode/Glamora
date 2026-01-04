import { createSlice } from '@reduxjs/toolkit';

// Helper to get cart key based on user
const getCartKey = (userId) => {
  return userId ? `cart_${userId}` : 'cart_guest';
};

// Load cart from localStorage
const loadCartFromStorage = (userId = null) => {
  try {
    const cartKey = getCartKey(userId);
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  
  return {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  };
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      } else {
        state.items.push({
          ...newItem,
          quantity: 1,
          totalPrice: newItem.price,
        });
      }
      state.totalQuantity++;
      state.totalAmount += newItem.price;
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.items = state.items.filter(item => item.id !== id);
      }
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem && quantity > 0) {
        const quantityDiff = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
        state.totalQuantity += quantityDiff;
        state.totalAmount += quantityDiff * existingItem.price;
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },

    // Load user-specific cart
    loadUserCart: (state, action) => {
      const userId = action.payload;
      const userCart = loadCartFromStorage(userId);
      state.items = userCart.items;
      state.totalQuantity = userCart.totalQuantity;
      state.totalAmount = userCart.totalAmount;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadUserCart } = cartSlice.actions;
export default cartSlice.reducer;
export { getCartKey }; // Export for middleware