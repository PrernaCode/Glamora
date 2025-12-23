import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { useGetProductsQuery, useGetCategoriesQuery, useGetProductsByCategoryQuery } from '../redux/slices/productsApi';
import { Link } from 'react-router-dom';

function HomePage() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Fetch categories
  const { data: categories } = useGetCategoriesQuery();
  
  // Fetch products based on selected category
  const { data: allProducts, isLoading: loadingAll } = useGetProductsQuery(undefined, {
    skip: selectedCategory !== 'all'  // Skip if category is selected
  });
  
  const { data: categoryProducts, isLoading: loadingCategory } = useGetProductsByCategoryQuery(
    selectedCategory,
    { skip: selectedCategory === 'all' }  // Skip if "all" is selected
  );
  
  // Choose which products to display
  const products = selectedCategory === 'all' ? allProducts : categoryProducts;
  const isLoading = selectedCategory === 'all' ? loadingAll : loadingCategory;

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  // Filter products by search term
  const filteredProducts = products?.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
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
      {/* Header with Search */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Luxury Collection</h2>
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          
          {/* Category Filter */}
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

      {/* Active Filters Display */}
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

      {/* Products Count */}
      <p className="text-gray-600 mb-4">
        Showing {filteredProducts?.length || 0} products
      </p>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts?.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
            {/* Product Image */}
            <Link to={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-contain p-4 hover:scale-105 transition cursor-pointer"
              />
            </Link>

            {/* Product Info */}
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
                  onClick={() => handleAddToCart(product)}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
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