import { createSlice } from '@reduxjs/toolkit';

// Load orders from localStorage
const loadOrdersFromStorage = () => {
  try {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch (error) {
    return [];
  }
};

const initialState = {
  orders: loadOrdersFromStorage(),
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action) => {
      const newOrder = {
        id: Date.now().toString(),
        items: action.payload.items,
        shippingAddress: action.payload.shippingAddress,
        totalAmount: action.payload.totalAmount,
        orderDate: new Date().toISOString(),
        status: 'pending',
      };
      
      state.orders.unshift(newOrder); // Add to beginning
      localStorage.setItem('orders', JSON.stringify(state.orders));
    },
    
    clearOrders: (state) => {
      state.orders = [];
      localStorage.removeItem('orders');
    },
  },
});

export const { createOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;