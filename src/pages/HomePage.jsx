import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const mockProducts = [
  { id: 1, name: 'Silk Evening Gown', price: 2499, category: 'Dresses', image: '👗' },
  { id: 2, name: 'Cashmere Blazer', price: 3299, category: 'Outerwear', image: '🧥' },
  { id: 3, name: 'Designer Handbag', price: 4999, category: 'Accessories', image: '👜' },
  { id: 4, name: 'Italian Leather Shoes', price: 1899, category: 'Footwear', image: '👠' },
];

function HomePage() {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Luxury Collection</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="text-6xl text-center mb-4">{product.image}</div>
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">₹{product.price.toLocaleString()}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default HomePage;