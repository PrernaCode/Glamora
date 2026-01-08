import React, { useState, useMemo, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { useGetProductsQuery, useGetCategoriesQuery, useGetProductsByCategoryQuery } from '../redux/slices/productsApi';
import { Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useDebounce from '../hooks/useDebounce';

const ProductCard = memo(({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-48 object-contain p-4 hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </Link>

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-gray-600 cursor-pointer line-clamp-2 transition">
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
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Debounce search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
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

  // Filter products using DEBOUNCED search term
  const filteredProducts = useMemo(() => {
    const filtered = products?.filter(product =>
      product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    
    return filtered;
  }, [products, debouncedSearchTerm]); // Using debouncedSearchTerm instead of searchTerm

  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product));
    addToast(`${product.title.substring(0, 30)}... added to cart`, 'success');
  }, [dispatch, addToast]);

  if (isLoading) {
    return <LoadingSkeleton />;
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
            aria-label="Search products"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white transition"
            aria-label="Filter by category"
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

      {(selectedCategory !== 'all' || debouncedSearchTerm) && (
        <div className="mb-4 flex gap-2 items-center flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {selectedCategory !== 'all' && (
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 transition hover:bg-gray-800">
              {selectedCategory}
              <button 
                onClick={() => setSelectedCategory('all')} 
                className="hover:text-gray-300"
                aria-label="Remove category filter"
              >
                ×
              </button>
            </span>
          )}
          {debouncedSearchTerm && (
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 transition hover:bg-gray-800">
              "{debouncedSearchTerm}"
              <button 
                onClick={() => setSearchTerm('')} 
                className="hover:text-gray-300"
                aria-label="Remove search filter"
              >
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
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-600 mb-4">No products found</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-4 text-blue-600 hover:underline transition"
          >
            Clear all filters
          </button>
        </div>
      )}
    </main>
  );
}

export default HomePage;