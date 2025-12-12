import React from 'react';
import {BrowserRouter, Routes , Route} from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage/>} />
        </Routes>
        <HomePage />
      </div>
    </BrowserRouter>
  );
}

export default App;