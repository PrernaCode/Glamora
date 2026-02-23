import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import { productsApi } from './slices/productsApi';
import ordersReducer from './slices/ordersSlice';
import wishlistReducer from './slices/wishlistSlice';
import { cartPersistenceMiddleware } from './middleware/cartMiddleware';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer,
        orders: ordersReducer,
        wishlist: wishlistReducer,
        [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(productsApi.middleware)
            .concat(cartPersistenceMiddleware),
});

export default store;