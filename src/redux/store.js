import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import { productsApi } from './slices/productsApi';
import ordersReducer from './slices/ordersSlice';
import { cartPersistenceMiddleware } from './middleware/cartMiddleware';

const store = configureStore({
    reducer:{
        cart: cartReducer,
        auth: authReducer,
        orders: ordersReducer,  // Add orders
        [productsApi.reducerPath] : productsApi.reducer, //Add Api reducer
    },
    middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware()
           .concat(productsApi.middleware)  // Add API middleware
           .concat(cartPersistenceMiddleware),  // Add cart persistence
});

export default store;