import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import ProductImage from '../components/ProductImage';

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const cartItems = useSelector(state => state.cart.items);
  const totalAmount = useSelector(state => state.cart.totalAmount);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    addToast('Item removed from cart', 'info');
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: { pathname: '/checkout' } }
      });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some luxury items to get started!</p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 md:p-6"
            >
              {/* Mobile Layout: Stacked */}
              <div className="flex flex-col md:hidden space-y-4">
                {/* Top: Image + Info */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0">
                    <ProductImage
                      src={item.image}
                      alt={item.title || item.name}
                      className="w-full h-full"
                    />
                  </div>
                  streams:

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold mb-1 truncate">
                      {item.title || item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                    <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Bottom: Quantity + Total + Remove */}
                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 transition"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 transition"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="font-bold text-lg">${item.totalPrice.toFixed(2)}</div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Desktop Layout: Row */}
              <div className="hidden md:flex items-center gap-6">
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0">
                  <ProductImage
                    src={item.image}
                    alt={item.title || item.name}
                    className="w-full h-full"
                  />
                </div>
                streams:

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{item.title || item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                  <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 transition"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 transition"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right w-24">
                  <p className="font-bold text-lg">${item.totalPrice.toFixed(2)}</p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition font-semibold mb-3"
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>

            <Link
              to="/"
              className="block text-center text-gray-600 hover:text-black transition"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;