import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { useCartActions } from '../hooks/useCartActions';
import { useToast } from '../components/Toast';
import ProductImage from '../components/ProductImage';
import LandingFooter from '../components/Landing/LandingFooter';
import { useGetProductsQuery } from '../redux/slices/productsApi';
import cartGIcon from '../assets/icons/cartG.svg';
import heartOutlinedIcon from '../assets/icons/heart_outlined.svg';

/* ── Mint-green filter for icons ─────────────────────────────── */
const MINT_FILTER = 'invert(64%) sepia(35%) saturate(543%) hue-rotate(113deg) brightness(92%) contrast(88%)';

function WishlistPage() {
    const dispatch = useDispatch();
    const { addToast } = useToast();
    const sliderRef = useRef(null);
    const { handleAddToCart } = useCartActions();

    const wishlistItems = useSelector(state => state.wishlist.items);

    /* ── Recommendations: grab first page of all products ── */
    const { data: allProducts } = useGetProductsQuery(0);
    const wishlistIds = wishlistItems.map(i => i.product_id);
    const relatedProducts = allProducts
        ? allProducts.filter(p => !wishlistIds.includes(p.id)).slice(0, 10)
        : [];

    /* ── Enrich wishlist items with missing metadata (price/category) ── */
    const enrichedWishlist = wishlistItems.map(item => {
        if (item.price && item.category) return item;
        const matchingProduct = allProducts?.find(p => p.id === item.product_id || p.id === item.id);
        return {
            ...item,
            price: item.price || matchingProduct?.price || 0,
            category: item.category || matchingProduct?.category || 'Collection'
        };
    });

    /* ── Handlers ── */
    const handleRemove = (item) => {
        dispatch(toggleWishlistItem({ product: { id: item.product_id || item.id, title: item.title } }));
        addToast('Removed from wishlist', 'success');
    };

    const handleMoveAllToBag = () => {
        wishlistItems.forEach(item => {
            handleAddToCart(item);
        });
    };

    const scrollSlider = (dir) => {
        if (!sliderRef.current) return;
        sliderRef.current.scrollBy({ left: dir * 240, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white pt-[120px]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-0">
                <nav className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#9ca3af] mb-[20px] [&_a:hover]:text-[#111] [&_.active]:text-[#111]" aria-label="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <span className="active">Wishlist</span>
                </nav>

                <div className="flex items-end justify-between gap-4 py-2.5 pb-8 border-b border-[#f0f0f0] flex-wrap">
                    <div className="space-y-2">
                        <h1 className="font-serif text-[clamp(2rem,5vw,4rem)] font-normal italic tracking-tight text-[#111] leading-none m-0">My Wishlist</h1>
                        <p className="text-[13px] font-normal text-[#9ca3af] tracking-tight m-0">
                            {wishlistItems.length > 0
                                ? `Curated collection of ${wishlistItems.length} exceptional ${wishlistItems.length === 1 ? 'piece' : 'pieces'}`
                                : 'Your curated collection awaits'}
                        </p>
                    </div>
                    {wishlistItems.length > 0 && (
                        <button className="flex items-center gap-2 bg-[#111] text-white text-[10px] font-black tracking-[0.18em] uppercase border-none rounded-full px-6 py-3.5 cursor-pointer transition-all duration-200 hover:bg-[#00674f] hover:-translate-y-[1px] whitespace-nowrap shrink-0" onClick={handleMoveAllToBag}>
                            <img src={cartGIcon} alt="" style={{ width: 16, height: 16, filter: MINT_FILTER }} />
                            Move All to Bag
                        </button>
                    )}
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-5 text-center gap-5">
                        <img src={heartOutlinedIcon} alt="empty wishlist" style={{ width: 48, height: 48, opacity: 0.25 }} />
                        <h2 className="font-serif text-[1.8rem] font-normal text-[#111]">Nothing saved yet</h2>
                        <p className="text-[14px] text-[#9ca3af]">Add pieces you love to your curated collection.</p>
                        <Link to="/homepage" className="inline-block px-8 py-3.5 bg-[#111] text-white text-[10px] font-black tracking-[0.18em] uppercase rounded-full no-underline transition-colors duration-250 hover:bg-[#00674f]">Explore Collection</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 pt-10">
                        {enrichedWishlist.map((item) => (
                            <div key={item.id || item.product_id} className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#f0f0f0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-400 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-[3px] group">
                                <div className="relative aspect-square bg-[#f7f7f7] overflow-hidden">
                                    <Link to={`/product/${item.product_id || item.id}`} className="block w-full h-full">
                                        <ProductImage src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.07]" />
                                    </Link>
                                    <button className="absolute top-2.5 right-2.5 z-10 w-8 h-8 flex items-center justify-center bg-[#f3f4f6] border-[1.5px] border-[#3EB489] rounded-full cursor-pointer transition-all duration-250 shadow-sm hover:bg-white hover:border-[var(--glamora-green)] hover:scale-110" onClick={() => handleRemove(item)} aria-label="Remove from wishlist">
                                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L13 13M1 13L13 1" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-3 pb-3.5 flex flex-col flex-1 gap-1">
                                    <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#9ca3af]">{item.category || 'Collection'}</p>
                                    <Link to={`/product/${item.product_id || item.id}`} className="font-serif text-[11px] font-normal text-[var(--glamora-green)] leading-snug line-clamp-2 no-underline transition-colors duration-250 hover:text-[#111]">{item.title}</Link>
                                    <span className="text-[13px] font-black text-[#111] tracking-tight mt-0.5">${parseFloat(item.price || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                    <button className="mt-2 w-full bg-[var(--glamora-green)] text-white text-[8px] font-black tracking-[0.18em] uppercase border-none rounded-full px-3 py-2.5 cursor-pointer transition-all duration-200 hover:bg-[#111] hover:-translate-y-[1px]" onClick={() => handleAddToCart(item)}>Add to Bag</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {relatedProducts.length > 0 && (
                    <section className="mt-20 pt-10 border-t border-[#f0f0f0]">
                        <div className="flex items-end justify-between mb-8">
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#9ca3af] block mb-1.5">Curated for you</span>
                                <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-black uppercase text-[var(--glamora-green)] tracking-tighter leading-none m-0">You Might <span className="text-[#111]">Also Like</span></h2>
                            </div>
                            <div className="hidden sm:flex gap-2">
                                <button onClick={() => scrollSlider(-1)} aria-label="Scroll left" className="w-10 h-10 rounded-full border border-[#e5e7eb] bg-white text-[18px] text-[#6b7280] cursor-pointer flex items-center justify-center transition-all duration-250 hover:bg-[#111] hover:border-[#111] hover:text-white">←</button>
                                <button onClick={() => scrollSlider(1)} aria-label="Scroll right" className="w-10 h-10 rounded-full border border-[#e5e7eb] bg-white text-[18px] text-[#6b7280] cursor-pointer flex items-center justify-center transition-all duration-250 hover:bg-[#111] hover:border-[#111] hover:text-white">→</button>
                            </div>
                        </div>
                        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2" ref={sliderRef}>
                            {relatedProducts.map((p) => (
                                <div key={p.id} className="shrink-0 w-[200px] snap-start bg-white rounded-xl overflow-hidden border border-[#f0f0f0] shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-[3px] max-[768px]:w-[160px] group">
                                    <Link to={`/product/${p.id}`} className="block aspect-square bg-[#f7f7f7] overflow-hidden">
                                        <ProductImage src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.07]" loading="lazy" />
                                    </Link>
                                    <div className="p-2.5 px-3 pb-3">
                                        <p className="text-[9px] font-black tracking-[0.18em] uppercase text-[#9ca3af] m-0 mb-[3px]">{p.category || 'Collection'}</p>
                                        <Link to={`/product/${p.id}`} className="text-[11px] font-bold text-[var(--glamora-green)] no-underline block leading-tight mb-1.5 hover:text-[#111]">{p.title}</Link>
                                        <span className="text-[13px] font-black text-[#111] block">${p.price?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <div className="mt-20"><LandingFooter /></div>
        </div>
    );
}

export default WishlistPage;
