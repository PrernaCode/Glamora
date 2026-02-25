import React, { useState, useMemo, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { useGetProductsQuery, useGetCategoriesQuery, useGetProductsByCategoryQuery } from '../redux/slices/productsApi';
import { Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useDebounce from '../hooks/useDebounce';
import LoginModal from '../components/LoginModal';
import ProductImage from '../components/ProductImage';

const Icons = {
  Heart: ({ filled }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg" className={filled ? "text-red-500" : "text-gray-400"}>
      {filled ? (
        <path d="M12.39 20.87a.696.696 0 0 1-.78 0C9.764 19.637 2 14.15 2 8.973c0-6.68 7.85-7.75 10-3.25 2.15-4.5 10-3.43 10 3.25 0 5.178-7.764 10.664-9.61 11.895z" fill="currentColor" />
      ) : (
        <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
};

const ProductCard = memo(({ product, onAddToCart, onLoginRequired }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const wishlistItems = useSelector(state => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.product_id === product.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      onLoginRequired();
      return;
    }
    dispatch(toggleWishlistItem({ userId: user.id, product }));
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative">
      {/* Wishlist Heart Overlay */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
      >
        <Icons.Heart filled={isWishlisted} />
      </button>

      <Link to={`/product/${product.id}`}>
        <ProductImage
          src={product.image}
          alt={product.title}
          className="w-full h-48 p-4 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </Link>

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold mb-2 hover:text-gray-600 cursor-pointer line-clamp-2 transition h-10">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-bold">${product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-xs"
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginRequired = () => setIsLoginModalOpen(true);

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
              <option key={category.id} value={category.id}>
                {category.name}
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
              {categories?.find(c => String(c.id) === String(selectedCategory))?.name || 'Selected Category'}
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
            onLoginRequired={handleLoginRequired}
          />
        ))}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

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