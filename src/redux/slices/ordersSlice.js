import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';

// Async thunk to fetch orders from Supabase with pagination
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ start = 0, limit = 5 } = {}, { rejectWithValue }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session found');
      const userId = session.user.id;

      const end = start + limit - 1;
      const { data, error, count } = await supabase
        .from('orders')
        .select('*, order_items(*)', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;
      
      return { 
        orders: data, 
        hasMore: count > end + 1,
        isInitial: start === 0
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to create order in Supabase via secure RPC
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async ({ items, shippingAddress, shippingMethod }, { rejectWithValue }) => {
    try {
      // Use the RPC to handle order creation securely on the backend.
      // We only send the shipping address and the list of {product_id, quantity}.
      // Prices, totals, and shipping costs are looked up and calculated in the DB.
      const { data, error } = await supabase.rpc('create_secure_order', {
        p_shipping_address: shippingAddress,
        p_items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        p_shipping_method: shippingMethod
      });

      if (error) throw error;

      // The RPC returns the order row. Since the UI expects order_items to be present
      // and the backend just created them, we'll fetch them or return the data.
      // In this case, let's fetch the items for the newly created order for a complete response.
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', data.id);

      if (itemsError) throw itemsError;

      return { ...data, order_items: orderItems };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Removed legacy localStorage loading for better reliability
const initialState = {
  orders: [],
  loading: false,
  error: null,
  hasMore: false,
  nextRangeStart: 0
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isInitial) {
          state.orders = action.payload.orders;
          state.nextRangeStart = action.payload.orders.length;
        } else {
          state.orders = [...state.orders, ...action.payload.orders];
          state.nextRangeStart += action.payload.orders.length;
        }
        state.hasMore = action.payload.hasMore;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;