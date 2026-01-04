import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { initializeAuth } from './redux/slices/authSlice';
import { loadUserCart } from './redux/slices/cartSlice';

// Initialize auth and load appropriate cart
const initializeApp = async () => {
  await store.dispatch(initializeAuth());
  
  // After auth is initialized, load appropriate cart
  const state = store.getState();
  const userId = state.auth.user?.id;
  store.dispatch(loadUserCart(userId));
};

initializeApp();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);