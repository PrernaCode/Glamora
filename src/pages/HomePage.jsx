import React, { useState, useMemo, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { useGetProductsQuery, useGetCategoriesQuery, useGetProductsByCategoryQuery } from '../redux/slices/productsApi';
import { Link } from 'react-router-dom';

// Memoized Product Card Component
const ProductCard = memo(({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-48 object-contain p-4 hover:scale-105 transition cursor-pointer"
        />
      </Link>

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-gray-600 cursor-pointer line-clamp-2">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">${product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

function HomePage() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: categories } = useGetCategoriesQuery();
  
  const { data: allProducts, isLoading: loadingAll } = useGetProductsQuery(undefined, {
    skip: selectedCategory !== 'all'
  });
  
  const { data: categoryProducts, isLoading: loadingCategory } = useGetProductsByCategoryQuery(
    selectedCategory,
    { skip: selectedCategory === 'all' }
  );
  
  const products = selectedCategory === 'all' ? allProducts : categoryProducts;
  const isLoading = selectedCategory === 'all' ? loadingAll : loadingCategory;

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return products?.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Memoized add to cart handler
  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin text-6xl mb-4">⏳</div>
        <p className="text-xl text-gray-600">Loading luxury products...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Luxury Collection</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
          >
            <option value="all">All Categories</option>
            {categories?.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(selectedCategory !== 'all' || searchTerm) && (
        <div className="mb-4 flex gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {selectedCategory !== 'all' && (
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-gray-300">
                ×
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="hover:text-gray-300">
                ×
              </button>
            </span>
          )}
        </div>
      )}

      <p className="text-gray-600 mb-4">
        Showing {filteredProducts?.length || 0} products
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts?.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {filteredProducts?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">No products found</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-4 text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </main>
  );
}

export default HomePage;