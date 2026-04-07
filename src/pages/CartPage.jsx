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
    dispatch(toggleWishlistItem({ product }));
  };

  return (
    <div className="w-[260px] min-w-[260px] snap-start group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100/60 relative shrink-0">
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
    if (newQuantity > 10) {
      addToast('Maximum limit (10) reached for this item', 'warning');
      return;
    }
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
      <main className="min-h-screen bg-white animate-in fade-in duration-600">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16 px-4 gap-4">
            <div className="text-[4rem] leading-none opacity-30">🛍</div>
            <h2 className="text-[1.5rem] font-black uppercase tracking-tight text-black">Your bag is empty</h2>
            <p className="text-[0.825rem] text-[#888] max-w-[280px]">Add some luxury items to get started!</p>
            <Link
              to="/homepage"
              className="block w-full p-[1.1rem] mt-6 bg-[var(--glamora-green)] text-white text-[0.7rem] font-black uppercase tracking-[0.2em] border-none rounded-full cursor-pointer text-center transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(0,103,79,0.35)] hover:bg-[#004b39] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(0,103,79,0.5)] active:translate-y-0 mt-6"
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
    <main className="min-h-screen bg-white animate-in fade-in duration-600">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14 pb-24">

        {/* ── Header ── */}
        <div className="text-left pt-24 pb-8 flex items-baseline justify-between border-b border-[#f0f0f0] mb-10">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="font-serif text-[clamp(1.75rem,2.8vw,2.5rem)] font-normal italic tracking-tight leading-[1.1] text-[#111]">Shopping Cart</h1>
              <span className="text-[0.75rem] font-medium text-[#999] tracking-wider self-end">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
            </div>
            <p className="text-[0.8rem] text-[#999] tracking-wide font-normal mt-0.5">Review your selections before completing your order.</p>
          </div>
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ── Left: Item List ── */}
          <div className="lg:col-span-8">
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-[120px_1fr_auto] gap-6 items-start py-7 border-b border-[#f0f0f0] transition-colors duration-200 first:border-t max-[767px]:grid-cols-[90px_1fr] max-[767px]:grid-rows-[auto_auto] max-[767px]:gap-4">

                {/* Image */}
                <div className="w-[120px] h-[145px] shrink-0 bg-[#f7f7f7] rounded-[1rem] overflow-hidden flex items-center justify-center p-3.5 max-[767px]:w-[90px] max-[767px]:h-[110px] max-[767px]:row-start-1 max-[767px]:row-end-2">
                  <ProductImage
                    src={item.image}
                    alt={item.title || item.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                {/* Info + bottom row */}
                <div className="flex flex-col gap-[0.4rem] max-[767px]:row-start-1 max-[767px]:row-end-2" style={{ gridColumn: '2 / 3' }}>
                  <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.35em] text-[#aaa]">{item.category}</span>
                  <Link to={`/product/${item.id}`} className="text-[1rem] font-extrabold uppercase tracking-tight text-black no-underline transition-colors duration-200 leading-[1.2] hover:text-[var(--glamora-green)]">
                    {item.title || item.name}
                  </Link>
                  <span className="text-[1rem] font-bold text-[var(--glamora-green)] mt-1">
                    ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>

                  {/* Bottom row: qty controls + total + remove — all inline */}
                  <div className="flex items-center justify-between w-full mt-4 pt-3.5 border-t border-[#f0f0f0] gap-4">
                    <div className="flex items-center border-[1.5px] border-[#ddd] rounded-full overflow-hidden h-9">
                      <button className="w-9 h-full flex items-center justify-center text-[1rem] font-bold text-[#444] bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-[var(--glamora-green)] hover:text-white" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} aria-label="Decrease">−</button>
                      <span className="w-10 text-center text-[0.875rem] font-bold text-[#111]">{item.quantity}</span>
                      <button className="w-9 h-full flex items-center justify-center text-[1rem] font-bold text-[#444] bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-[var(--glamora-green)] hover:text-white" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} aria-label="Increase">+</button>
                    </div>

                    <button className="bg-none border-none cursor-pointer p-0 inline-flex items-center gap-[0.35rem] text-[0.7rem] font-semibold text-[#999] uppercase tracking-wider transition-colors duration-200 hover:text-[#c0392b]" onClick={() => handleRemove(item.id)} aria-label="Remove item">
                      <img src={closeIcon} alt="" className="w-[1.1rem] h-[1.1rem] filter-[invert(64%)_sepia(35%)_saturate(543%)_hue-rotate(113deg)_brightness(92%)_contrast(88%)]" />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-0 pt-1 max-[767px]:col-span-full max-[767px]:flex-row max-[767px]:justify-between max-[767px]:items-center">
                  <span className="text-[1rem] font-black text-[var(--glamora-green)] tracking-tighter whitespace-nowrap">
                    ${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#f9f9f9] border border-[#f0f0f0] rounded-[1.5rem] p-8">
              <h2 className="text-[1.125rem] font-black uppercase tracking-wider text-black pb-5 border-b border-[#e5e5e5] mb-5">Order Summary</h2>

              <div className="flex justify-between items-center text-[0.875rem] text-[#555] mb-3.5">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold text-[#111]">
                  ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-[0.875rem] text-[#555] mb-3.5">
                <span className="font-medium">Shipping</span>
                <span className="text-[var(--glamora-green)] font-extrabold text-[0.75rem] uppercase tracking-widest">Complimentary</span>
              </div>

              <div className="h-[1px] bg-[#e5e5e5] my-5" />
              <div className="flex justify-between items-baseline">
                <span className="text-[0.75rem] font-black uppercase tracking-[0.2em] text-black">Total</span>
                <span className="text-[1.5rem] font-black tracking-tighter text-[var(--glamora-green)]">
                  ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <button className="block w-full p-[1.1rem] mt-6 bg-[var(--glamora-green)] text-white text-[0.7rem] font-black uppercase tracking-[0.2em] border-none rounded-full cursor-pointer text-center transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(0,103,79,0.35)] hover:bg-[#004b39] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(0,103,79,0.5)] active:translate-y-0" onClick={handleCheckout}>
                {isAuthenticated ? 'Secure Checkout' : 'Login to Checkout'}
              </button>

              <Link to="/homepage" className="block text-center mt-4 text-[0.7rem] font-bold uppercase tracking-widest text-[#888] no-underline transition-colors duration-200 hover:text-black">← Continue Shopping</Link>

              {/* Secure note */}
              <div className="flex items-start gap-3 mt-6 pt-5 border-t border-[#ebebeb]">
                <img src={certifiedIcon} alt="" className="w-[1.1rem] h-[1.1rem] filter-[invert(64%)_sepia(35%)_saturate(543%)_hue-rotate(113deg)_brightness(92%)_contrast(88%)]" />
                <p className="text-[0.7rem] text-[#999] line-height-[1.5]">Orders are processed securely using high-level encryption protocols. Returns accepted within 30 days.</p>
              </div>

              {/* Shipping note */}
              <div className="flex items-start gap-3 mt-6 pt-5 border-t border-[#ebebeb]" style={{ marginTop: '0.75rem', paddingTop: '0.75rem' }}>
                <img src={shippingIcon} alt="" className="w-[1.1rem] h-[1.1rem] filter-[invert(64%)_sepia(35%)_saturate(543%)_hue-rotate(113deg)_brightness(92%)_contrast(88%)]" />
                <p className="text-[0.7rem] text-[#999] line-height-[1.5]">Complimentary white-glove shipping &amp; handling on every order.</p>
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
            <div ref={sliderRef} className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory">
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