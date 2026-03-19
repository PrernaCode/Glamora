import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';

// Helper to get cart key based on user
const getCartKey = (userId) => {
  return userId ? `cart_${userId}` : 'cart_guest';
};

// Load cart from localStorage (Fallback for guest or offline)
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

// Async thunk to fetch cart from Supabase
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      // Step 1: fetch cart items (safe, no join)
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Step 2: fetch category_ids for those product ids (lightweight, separate query)
      let categoryMap = {};
      if (data.length > 0) {
        const productIds = data.map(i => i.product_id);
        const { data: prodData } = await supabase
          .from('products')
          .select('id, category_id')
          .in('id', productIds);
        if (prodData) {
          prodData.forEach(p => { categoryMap[p.id] = p.category_id; });
        }
      }

      const items = data.map(item => ({
        ...item,
        id: item.product_id, // Map product_id to id for UI compatibility
        totalPrice: item.price_at_addition * item.quantity,
        price: item.price_at_addition,
        category_id: categoryMap[item.product_id] ?? null,
      }));

      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

      return { items, totalQuantity, totalAmount };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add/update item in Supabase
export const syncCartItem = createAsyncThunk(
  'cart/syncItem',
  async ({ userId, item }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: userId,
          product_id: item.id,
          quantity: item.quantity,
          price_at_addition: item.price,
          title: item.title,
          image: item.image,
          // category_id is NOT in cart_items table — carry it in memory only
        }, { onConflict: 'user_id, product_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to remove item from Supabase
export const removeItemFromDB = createAsyncThunk(
  'cart/removeItem',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to merge guest cart to user cart
export const mergeGuestCart = createAsyncThunk(
  'cart/mergeGuest',
  async ({ userId, guestItems }, { dispatch, rejectWithValue }) => {
    try {
      for (const item of guestItems) {
        await dispatch(syncCartItem({ userId, item }));
      }
      return await dispatch(fetchCart(userId)).unwrap();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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

    loadUserCart: (state, action) => {
      const userId = action.payload;
      const userCart = loadCartFromStorage(userId);
      state.items = userCart.items;
      state.totalQuantity = userCart.totalQuantity;
      state.totalAmount = userCart.totalAmount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addMatcher(
        (action) => action.type === 'auth/logout/fulfilled',
        (state) => {
          state.items = [];
          state.totalQuantity = 0;
          state.totalAmount = 0;
        }
      );
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadUserCart } = cartSlice.actions;
export default cartSlice.reducer;
export { getCartKey };
