import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';

// Async thunk to fetch orders from Supabase with pagination
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ userId, start = 0, limit = 5 }, { rejectWithValue }) => {
    try {
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

// Async thunk to create order in Supabase
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async ({ userId, items, shippingAddress, totalAmount }, { rejectWithValue }) => {
    try {
      // 1. Create the main order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          status: 'completed'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create the order items with snapshots
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        title: item.title,
        image: item.image
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Clear the user's cart in DB
      await supabase.from('cart_items').delete().eq('user_id', userId);

      return { ...order, order_items: orderItems };
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