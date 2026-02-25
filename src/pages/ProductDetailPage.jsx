import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { useGetProductByIdQuery } from '../redux/slices/productsApi';
import LoginModal from '../components/LoginModal';
import ProductImage from '../components/ProductImage';

const Icons = {
  Heart: ({ filled }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg" className={filled ? "text-red-500" : "text-gray-400"}>
      {filled ? (
        <path d="M12.39 20.87a.696.696 0 0 1-.78 0C9.764 19.637 2 14.15 2 8.973c0-6.68 7.85-7.75 10-3.25 2.15-4.5 10-3.43 10 3.25 0 5.178-7.764 10.664-9.61 11.895z" fill="currentColor" />
      ) : (
        <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
};

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const user = useSelector(state => state.auth.user);
  const wishlistItems = useSelector(state => state.wishlist.items);
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  const isWishlisted = wishlistItems.some(item => item.product_id === Number(id));

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleToggleWishlist = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    dispatch(toggleWishlistItem({ userId: user.id, product }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin text-6xl mb-4">⏳</div>
        <p className="text-xl text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-xl text-red-600">Product not found</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-gray-600 hover:text-black mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-lg shadow-lg p-8">
        {/* Product Image */}
        <div className="flex items-center justify-center">
          <ProductImage
            src={product.image}
            alt={product.title}
            className="w-full max-h-96"
          />
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold">${product.price}</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-semibold">{product.rating?.rate}</span>
              <span className="text-gray-500">({product.rating?.count} reviews)</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Add to Cart
            </button>
            <button
              onClick={handleToggleWishlist}
              className="px-4 border-2 border-gray-100 rounded-lg hover:border-black transition flex items-center justify-center"
              aria-label="Toggle Wishlist"
            >
              <Icons.Heart filled={isWishlisted} />
            </button>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="w-full border-2 border-black text-black py-3 rounded-lg hover:bg-gray-100 transition font-semibold mt-4"
          >
            View Cart
          </button>
        </div>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default ProductDetailPage;