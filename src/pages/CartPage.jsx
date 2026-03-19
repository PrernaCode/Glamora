import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, addToCart } from '../redux/slices/cartSlice';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { useGetProductsByCategoryQuery } from '../redux/slices/productsApi';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import ProductImage from '../components/ProductImage';
import LoginModal from '../components/LoginModal';
import LandingFooter from '../components/Landing/LandingFooter';
import './CartPage.css';

import closeIcon from '../assets/icons/bin.svg';
import certifiedIcon from '../assets/icons/certified.svg';
import heartFilledIcon from '../assets/icons/heart_filled.svg';
import heartOutlinedIcon from '../assets/icons/heart_outlined.svg';
import cartGIcon from '../assets/icons/cartG.svg';
import shippingIcon from '../assets/icons/shippingtruck.svg';

/* ─────────────────────────────────────────────────
   Related Product Card  (same pattern as PDP)
───────────────────────────────────────────────── */
function RelatedProductCard({ product, onAddToCart, onLoginRequired }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const wishlistItems = useSelector((s) => s.wishlist.items);
  const isWishlisted = wishlistItems.some((i) => i.product_id === product.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { onLoginRequired(); return; }
    dispatch(toggleWishlistItem({ userId: user.id, product }));
  };

  return (
    <div className="cart-related-card group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100/60 relative shrink-0">
      {/* Wishlist */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <img
          src={isWishlisted ? heartFilledIcon : heartOutlinedIcon}
          alt="wishlist"
          className="w-3.5 h-3.5"
          style={{ filter: 'invert(64%) sepia(35%) saturate(543%) hue-rotate(113deg) brightness(92%) contrast(88%)' }}
        />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-gray-50">
        <ProductImage
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </Link>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase truncate">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3
            className="text-[11px] font-extrabold leading-snug uppercase hover:text-black transition-colors duration-300 line-clamp-2"
            style={{ color: 'var(--glamora-green)' }}
          >
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-sm font-black text-black">
            ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:opacity-80"
            style={{ background: 'var(--glamora-green)' }}
            aria-label="Add to cart"
          >
            <img src={cartGIcon} alt="cart" className="w-3.5 h-3.5 brightness-0 invert" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Cart Page
───────────────────────────────────────────────── */
function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const cartItems = useSelector((s) => s.cart.items);
  const totalAmount = useSelector((s) => s.cart.totalAmount);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const sliderRef = useRef(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* ── Handlers (unchanged logic) ── */
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    addToast('Item removed from cart', 'info');
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity > 0) dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  const handleRelatedAddToCart = (p) => {
    dispatch(addToCart(p));
    addToast(`${p.title.substring(0, 30)}... added to cart`, 'success');
  };

  const scrollSlider = (dir) => {
    sliderRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });
  };

  /* ── You May Also Like: uses category of first cart item ── */
  const categoryId = cartItems.length > 0 ? cartItems[0].category_id : null;
  const { data: categoryProducts } = useGetProductsByCategoryQuery(
    { categoryId, page: 0 },
    { skip: !categoryId }
  );
  const cartItemIds = cartItems.map((i) => i.id);
  const relatedProducts = categoryProducts
    ? categoryProducts.filter((p) => !cartItemIds.includes(p.id)).slice(0, 8)
    : [];

  /* ── Empty State ── */
  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="cart-empty">
            <div className="cart-empty-icon">🛍</div>
            <h2 className="cart-empty-title">Your bag is empty</h2>
            <p className="cart-empty-subtitle">Add some luxury items to get started!</p>
            <Link
              to="/"
              className="cart-checkout-btn mt-6"
              style={{ display: 'inline-block', width: 'auto', padding: '1rem 2.5rem' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <LandingFooter />
      </main>
    );
  }

  /* ── Main ── */
  return (
    <main className="cart-page">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14 pb-24">

        {/* ── Header ── */}
        <div className="cart-page-header">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="cart-page-title">Shopping Cart</h1>
              <span className="cart-page-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
            </div>
            <p className="cart-page-subtitle">Review your selections before completing your order.</p>
          </div>
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ── Left: Item List ── */}
          <div className="lg:col-span-8">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">

                {/* Image */}
                <div className="cart-item-image">
                  <ProductImage
                    src={item.image}
                    alt={item.title || item.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                {/* Info + bottom row */}
                <div className="cart-item-info" style={{ gridColumn: '2 / 3' }}>
                  <span className="cart-item-category">{item.category}</span>
                  <Link to={`/product/${item.id}`} className="cart-item-title">
                    {item.title || item.name}
                  </Link>
                  <span className="cart-item-price">
                    ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>

                  {/* Bottom row: qty controls + total + remove — all inline */}
                  <div className="cart-item-bottom-row">
                    <div className="cart-qty-control">
                      <button className="cart-qty-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} aria-label="Decrease">−</button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} aria-label="Increase">+</button>
                    </div>

                    <button className="cart-remove-btn" onClick={() => handleRemove(item.id)} aria-label="Remove item">
                      <img src={closeIcon} alt="" className="icon-mint" />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <span className="cart-item-total-price">
                    ${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="cart-summary">
              <h2 className="cart-summary-title">Order Summary</h2>

              <div className="cart-summary-row">
                <span className="label">Subtotal</span>
                <span className="value">
                  ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="cart-summary-row">
                <span className="label">Shipping</span>
                <span className="value free">Complimentary</span>
              </div>

              <div className="cart-summary-divider" />
              <div className="cart-summary-total-row">
                <span className="cart-summary-total-label">Total</span>
                <span className="cart-summary-total-value">
                  ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <button className="cart-checkout-btn" onClick={handleCheckout}>
                {isAuthenticated ? 'Secure Checkout' : 'Login to Checkout'}
              </button>

              <Link to="/" className="cart-continue-link">← Continue Shopping</Link>

              {/* Secure note */}
              <div className="cart-secure-note">
                <img src={certifiedIcon} alt="" className="icon-mint" />
                <p>Orders are processed securely using high-level encryption protocols. Returns accepted within 30 days.</p>
              </div>

              {/* Shipping note */}
              <div className="cart-secure-note" style={{ marginTop: '0.75rem', paddingTop: '0.75rem' }}>
                <img src={shippingIcon} alt="" className="icon-mint" />
                <p>Complimentary white-glove shipping &amp; handling on every order.</p>
              </div>
            </div>
          </div>

        </div>{/* end grid */}

        {/* ── You May Also Like ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                  From the same collection
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none"
                  style={{ color: 'var(--glamora-green)' }}
                >
                  You May <span className="text-black">Also Like</span>
                </h2>
              </div>

              {/* Slider arrows */}
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => scrollSlider(-1)}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-300 text-gray-500"
                  aria-label="Scroll left"
                >←</button>
                <button
                  onClick={() => scrollSlider(1)}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-300 text-gray-500"
                  aria-label="Scroll right"
                >→</button>
              </div>
            </div>

            {/* Horizontal Slider */}
            <div ref={sliderRef} className="cart-related-slider">
              {relatedProducts.map((p) => (
                <RelatedProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={handleRelatedAddToCart}
                  onLoginRequired={() => setIsLoginModalOpen(true)}
                />
              ))}
            </div>
          </section>
        )}

      </div>{/* end max-w container */}

      <LandingFooter />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </main>
  );
}

export default CartPage;