import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { useGetProductByIdQuery, useGetProductsByCategoryQuery } from '../redux/slices/productsApi';

import LoginModal from '../components/LoginModal';
import { useCartActions } from '../hooks/useCartActions';
import ProductImage from '../components/ProductImage';
import LandingFooter from '../components/Landing/LandingFooter';

// Icons from assets/icons folder
import cartGIcon from '../assets/icons/cartG.svg';
import heartFilledIcon from '../assets/icons/heart_filled.svg';
import heartOutlinedIcon from '../assets/icons/heart_outlined.svg';
import shippingIcon from '../assets/icons/shippingtruck.svg';
import returnIcon from '../assets/icons/return.svg';
import certifiedIcon from '../assets/icons/certified.svg';
import ratingStarIcon from '../assets/icons/ratingstar.svg';

/* ─── Mock Review Data ───────────────────────────────────────── */
const MOCK_REVIEWS = [
  { id: 1, name: 'Sophia M.', rating: 5, date: 'March 2025', text: "Absolutely stunning quality. The craftsmanship is unmatched — I've received so many compliments. Worth every penny.", verified: true },
  { id: 2, name: 'Aiden K.', rating: 4, date: 'February 2025', text: 'Elegant and well-made. Shipping was fast and packaging was premium. Minor sizing issue but resolved quickly.', verified: true },
  { id: 3, name: 'Priya S.', rating: 5, date: 'January 2025', text: 'This exceeded all my expectations. The material is luxurious and the fit is perfect. Will definitely be purchasing again.', verified: true },
];

/* ─── Star Rating display ────────────────────────────────────── */
function StarRating({ rating }) {
  const sizeClass = 'w-6 h-6';
  const glamoraGreenFilter = 'invert(20%) sepia(85%) saturate(1831%) hue-rotate(143deg) brightness(94%) contrast(101%)';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <img key={s} src={ratingStarIcon} alt="" className={`${sizeClass} ${s <= Math.round(rating) ? 'opacity-100' : 'opacity-20'}`} style={{ filter: s <= Math.round(rating) ? glamoraGreenFilter : 'grayscale(100%) ' }} />
      ))}
    </div>
  );
}

/* ─── Slim ProductCard for "You May Also Like" ───────────────── */
function RelatedProductCard({ product, onAddToCart, onLoginRequired }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((i) => i.product_id === product.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { onLoginRequired(); return; }
    dispatch(toggleWishlistItem({ product }));
  };

  return (
    <div className="pdp-related-card group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100/60 relative shrink-0 w-[280px] min-w-[280px] snap-start">
      <button onClick={handleToggleWishlist} className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100" aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
        <img src={isWishlisted ? heartFilledIcon : heartOutlinedIcon} alt="wishlist" className="w-3.5 h-3.5" style={isWishlisted ? {} : { filter: 'invert(34%) sepia(84%) saturate(365%) hue-rotate(113deg) brightness(80%) contrast(95%)' }} />
      </button>
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-gray-50">
        <ProductImage src={product.image} alt={product.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </Link>
      <div className="p-3 space-y-1.5">
        <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase truncate">{product.category}</p>
        <Link to={`/product/${product.id}`}><h3 className="text-[11px] font-extrabold text-[#3EB489] leading-snug uppercase hover:text-black transition-colors duration-300 line-clamp-2">{product.title}</h3></Link>
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-sm font-black text-black">${product.price?.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
          <button onClick={() => onAddToCart(product)} className="w-8 h-8 shrink-0 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#3EB489] hover:border-[#3EB489] transition-all duration-300 group/cart shadow-sm" aria-label="Add to cart">
            <img src={cartGIcon} alt="cart" className="w-3.5 h-3.5 group-hover/cart:brightness-0 group-hover/cart:invert" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sliderRef = useRef(null);
  const { handleAddToCart } = useCartActions();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  const isWishlisted = wishlistItems.some((item) => item.product_id === Number(id));

  const { data: categoryProducts } = useGetProductsByCategoryQuery(
    { categoryId: product?.category_id, page: 0 },
    { skip: !product?.category_id }
  );

  const relatedProducts = categoryProducts
    ? categoryProducts.filter((p) => p.id !== Number(id)).slice(0, 6)
    : [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleRelatedAddToCart = (p) => {
    handleAddToCart(p);
  };

  const handleToggleWishlist = () => {
    if (!user) { setIsLoginModalOpen(true); return; }
    dispatch(toggleWishlistItem({ product }));
  };

  const scrollSlider = (dir) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-gray-100 border-t-[#3EB489] rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <div className="text-7xl mb-6 opacity-20">🏷️</div>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-3">Product Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-xs text-center text-sm">The item you're looking for may have been moved.</p>
        <Link to="/" className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-[#3EB489] transition-colors duration-300">Back to Collections</Link>
      </div>
    );
  }

  const features = [
    { icon: shippingIcon, label: 'Complimentary Shipping', desc: 'On all orders above $200' },
    { icon: returnIcon, label: '30-Day Returns', desc: 'Secure and effortless exchanges' },
    { icon: certifiedIcon, label: 'Authentic Quality', desc: 'Certified by our master artisans' },
  ];

  return (
    <main className="bg-white opacity-0 animate-[fadeIn_0.7s_ease-out_forwards]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-20">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 mt-10" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/homepage?category=${product.category?.toLowerCase()}`} className="hover:text-black transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-black truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <div className="relative rounded-[2rem] bg-[#f9f9f9] overflow-hidden aspect-[4/5] flex items-center justify-center p-10 transition-all duration-400 hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.1)] max-[768px]:p-6 max-[768px]:rounded-[1.5rem]">
              <ProductImage src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
          </div>
          <div className="lg:col-span-5 opacity-0 translate-y-4 animate-[slideUp_0.7s_cubic-bezier(0.2,1,0.3,1)_forwards_0.15s]">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div><span className="inline-block px-4 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.35em] text-[#3EB489] bg-[#3EB489]/[0.08] border border-[#3EB489]/20 rounded-full">{product.category}</span></div>
              <h1 className="pdp-product-title text-[clamp(1.6rem,3.5vw,2.4rem)] font-extrabold leading-[1.15] tracking-tight uppercase text-[#575656] max-[768px]:text-[1.6rem]">{product.title}</h1>
              <div className="flex flex-col items-start gap-5 flex-wrap">
                {product.rating && (
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <StarRating rating={product.rating.rate} />
                    <span className="text-[14px] font-black text-gray-700 tracking-tighter">{product.rating.rate} <span className="font-medium text-gray-400">({product.rating.count} reviews)</span></span>
                  </div>
                )}
                <span className="text-[1.6rem] font-black tracking-tight text-black max-[768px]:text-[1.4rem]">${product.price?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="h-[1px] w-full bg-[#f0f0f0] my-5" />
              <div className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Description</h3>
                <p className="text-gray-700 font-normal leading-relaxed text-sm tracking-wide">{product.description}</p>
              </div>
              <div className="h-[1px] w-full bg-[#f0f0f0] my-5" />
              <div className="space-y-4">
                <button onClick={() => handleAddToCart(product)} className="px-8 py-[1.1rem] bg-[#3EB489] text-white text-[0.75rem] font-extrabold uppercase tracking-[0.15em] rounded-full border-none transition-all duration-400 cubic-bezier(0.4,0,0.2,1) shadow-[0_10px_25px_-5px_rgba(62,180,137,0.3)] hover:bg-[#349e78] hover:-translate-y-0.5 hover:shadow-[0_15px_30px_-8px_rgba(62,180,137,0.45)] active:translate-y-0 w-full flex items-center justify-center gap-3">
                  <img src={cartGIcon} alt="" className="w-4 h-4 brightness-0 invert" />Add to Bag
                </button>
                <button onClick={handleToggleWishlist} className="px-8 py-4 rounded-full border-[1.5px] border-[#3EB489] flex items-center justify-center transition-all duration-300 bg-transparent text-[#3EB489] text-[0.75rem] font-bold uppercase tracking-[0.15em] hover:bg-[#3EB489]/[0.05] hover:-translate-y-px w-full flex items-center justify-center gap-3" aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
                  <img src={isWishlisted ? heartFilledIcon : heartOutlinedIcon} alt="" className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'scale-110' : ''}`} style={{ filter: 'invert(64%) sepia(35%) saturate(543%) hue-rotate(113deg) brightness(92%) contrast(88%)' }} />{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
                <button onClick={() => navigate('/cart')} className="py-[0.85rem] text-[0.65rem] font-extrabold uppercase tracking-[0.25em] text-[#707070] transition-all duration-300 border-none bg-transparent hover:text-black hover:tracking-[0.3em] w-full">Proceed to Checkout</button>
              </div>
              <div className="h-[1px] w-full bg-[#f0f0f0] my-5" />
              <div className="space-y-5">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 min-w-[2.5rem] p-2.5 rounded-[0.875rem] bg-[#3EB489]/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform"><img src={feature.icon} alt="" className="w-5 h-5" style={{ filter: 'invert(64%) sepia(35%) saturate(543%) hue-rotate(113deg) brightness(92%) contrast(88%)' }} /></div>
                    <div><p className="text-[11px] font-black uppercase tracking-widest text-black">{feature.label}</p><p className="text-[10px] font-medium text-gray-400 mt-0.5">{feature.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">From the same collection</span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#3EB489] tracking-tighter leading-none">You May <span className="text-black">Also Like</span></h2>
              </div>
              <div className="hidden sm:flex gap-2">
                <button onClick={() => scrollSlider(-1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-300 text-gray-500">←</button>
                <button onClick={() => scrollSlider(1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-300 text-gray-500">→</button>
              </div>
            </div>
            <div ref={sliderRef} className="flex gap-6 overflow-x-auto px-1 py-2 pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200">
              {relatedProducts.map((p) => <RelatedProductCard key={p.id} product={p} onAddToCart={handleRelatedAddToCart} onLoginRequired={() => setIsLoginModalOpen(true)} />)}
            </div>
          </section>
        )}

        <section className="mt-24">
          <div className="space-y-2 mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">From our community</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#3EB489] tracking-tighter leading-none">Verified <span className="text-black">Guest Reviews</span></h2>
          </div>
          {product.rating && (
            <div className="flex items-center gap-6 mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
              <div className="text-center"><p className="text-5xl font-black text-black">{product.rating.rate}</p><StarRating rating={product.rating.rate} size="md" /><p className="text-[10px] font-medium text-gray-400 mt-1">{product.rating.count} ratings</p></div>
              <div className="h-16 w-[1px] bg-gray-200" /><div className="space-y-1">{[5, 4, 3, 2, 1].map((star) => { const width = star === 5 ? 75 : star === 4 ? 55 : star === 3 ? 20 : star === 2 ? 8 : 5; return (<div key={star} className="flex items-center gap-2"><span className="text-[10px] font-bold text-gray-500 w-3">{star}</span><div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-[#3EB489] rounded-full" style={{ width: `${width}%` }} /></div></div>); })}</div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_REVIEWS.map((review) => (<div key={review.id} className="bg-white border border-[#f0f0f0] rounded-[1.5rem] p-6 transition-shadow duration-300 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)]"><div className="flex items-start justify-between mb-4"><div><p className="text-sm font-black text-black">{review.name}</p><p className="text-[10px] font-medium text-gray-400 mt-0.5">{review.date}</p></div>{review.verified && (<span className="text-[9px] font-black uppercase tracking-widest text-[#3EB489] bg-[#3EB489]/10 px-2.5 py-1 rounded-full">Verified</span>)}</div><StarRating rating={review.rating} /><p className="text-sm text-gray-600 font-normal leading-relaxed mt-3 italic">"{review.text}"</p></div>))}
          </div>
        </section>
      </div>
      <div className="mt-20"><LandingFooter /></div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </main>
  );
}

export default ProductDetailPage;