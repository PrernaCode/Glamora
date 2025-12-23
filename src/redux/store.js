import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import { productsApi } from './slices/productsApi';

const store = configureStore({
    reducer:{
        cart: cartReducer,
        auth: authReducer,
        [productsApi.reducerPath] : productsApi.reducer, //Add Api reducer
    },
    middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware().concat(productsApi.middleware),  // Add API middleware
});

export default store;