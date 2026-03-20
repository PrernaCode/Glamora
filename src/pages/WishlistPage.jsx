import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { useToast } from '../components/Toast';
import ProductImage from '../components/ProductImage';
import LandingFooter from '../components/Landing/LandingFooter';
import { useGetProductsQuery } from '../redux/slices/productsApi';
import './WishlistPage.css';
import cartGIcon from '../assets/icons/cartG.svg';
import heartOutlinedIcon from '../assets/icons/heart_outlined.svg';

/* ── Mint-green filter for icons ─────────────────────────────── */
const MINT_FILTER = 'invert(64%) sepia(35%) saturate(543%) hue-rotate(113deg) brightness(92%) contrast(88%)';

/* ─────────────────────────────────────────────────────────────── */

function WishlistPage() {
    const dispatch = useDispatch();
    const { addToast } = useToast();
    const sliderRef = useRef(null);

    const user = useSelector(state => state.auth.user);
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
        const matchingProduct = allProducts?.find(p => p.id === item.product_id);
        return {
            ...item,
            price: item.price || matchingProduct?.price || 0,
            category: item.category || matchingProduct?.category || 'Collection'
        };
    });

    /* ── Handlers ── */
    const handleRemove = (item) => {
        dispatch(toggleWishlistItem({ userId: user.id, product: { id: item.product_id, title: item.title } }));
        addToast('Removed from wishlist', 'success');
    };

    const handleAddToCart = (item) => {
        dispatch(addToCart({
            id: item.product_id,
            title: item.title,
            image: item.image,
            price: item.price || 0,
        }));
        addToast(`${item.title?.substring(0, 28)}... added to bag`, 'success');
    };

    const handleMoveAllToBag = () => {
        wishlistItems.forEach(item => {
            dispatch(addToCart({
                id: item.product_id,
                title: item.title,
                image: item.image,
                price: item.price || 0,
            }));
        });
        addToast(`Moved ${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} to bag`, 'success');
    };

    const scrollSlider = (dir) => {
        if (!sliderRef.current) return;
        sliderRef.current.scrollBy({ left: dir * 240, behavior: 'smooth' });
    };

    /* ─────────────────── RENDER ─────────────────────────── */
    return (
        <div className="wl-page">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-0">

                {/* ── Breadcrumbs ── */}
                <nav className="wl-breadcrumb" aria-label="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <span className="active">Wishlist</span>
                </nav>

                {/* ── Header ── */}
                <div className="wl-header">
                    <div className="wl-header-left">
                        <h1>My Wishlist</h1>
                        <p>
                            {wishlistItems.length > 0
                                ? `Curated collection of ${wishlistItems.length} exceptional ${wishlistItems.length === 1 ? 'piece' : 'pieces'}`
                                : 'Your curated collection awaits'}
                        </p>
                    </div>
                    {wishlistItems.length > 0 && (
                        <button className="wl-move-all-btn" onClick={handleMoveAllToBag}>
                            <img
                                src={cartGIcon}
                                alt=""
                                style={{ width: 16, height: 16, filter: MINT_FILTER }}
                            />
                            Move All to Bag
                        </button>
                    )}
                </div>

                {/* ── Empty State ── */}
                {wishlistItems.length === 0 ? (
                    <div className="wl-empty">
                        <img
                            src={heartOutlinedIcon}
                            alt="empty wishlist"
                            style={{ width: 48, height: 48, opacity: 0.25 }}
                        />
                        <h2>Nothing saved yet</h2>
                        <p>Add pieces you love to your curated collection.</p>
                        <Link to="/homepage">Explore Collection</Link>
                    </div>
                ) : (
                    /* ── Product Grid ── */
                    <div className="wl-grid">
                        {enrichedWishlist.map((item) => (
                            <div key={item.id || item.product_id} className="wl-card group">

                                {/* Image + remove overlay */}
                                <div className="wl-card-img-wrap">
                                    <Link to={`/product/${item.product_id}`} className="block w-full h-full">
                                        <ProductImage
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </Link>

                                    {/* Close icon — always visible with stylish outline */}
                                    <button
                                        className="wl-remove-btn"
                                        onClick={() => handleRemove(item)}
                                        aria-label="Remove from wishlist"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L13 13M1 13L13 1" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Card body */}
                                <div className="wl-card-body">
                                    {/* Category meta */}
                                    <p className="wl-card-category">
                                        {item.category || 'Collection'}
                                    </p>

                                    {/* Title → navigates to PDP */}
                                    <Link
                                        to={`/product/${item.product_id}`}
                                        className="wl-card-title"
                                    >
                                        {item.title}
                                    </Link>

                                    {/* Price */}
                                    <span className="wl-card-price">
                                        ${parseFloat(item.price || 0).toLocaleString(undefined, {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        })}
                                    </span>

                                    {/* Add to Bag */}
                                    <button
                                        className="wl-add-to-bag-btn"
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        Add to Bag
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── You Might Also Like ── */}
                {relatedProducts.length > 0 && (
                    <section className="wl-related-section">
                        <div className="wl-related-header">
                            <div className="wl-related-header-left">
                                <span>Curated for you</span>
                                <h2>You Might <span>Also Like</span></h2>
                            </div>
                            <div className="wl-related-arrows hidden sm:flex">
                                <button onClick={() => scrollSlider(-1)} aria-label="Scroll left">←</button>
                                <button onClick={() => scrollSlider(1)} aria-label="Scroll right">→</button>
                            </div>
                        </div>

                        {/* Horizontal Slider */}
                        <div className="wl-related-slider" ref={sliderRef}>
                            {relatedProducts.map((p) => (
                                <div key={p.id} className="wl-related-card">
                                    <Link to={`/product/${p.id}`} className="block wl-related-card-img">
                                        <ProductImage
                                            src={p.image}
                                            alt={p.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </Link>
                                    <div className="wl-related-card-body">
                                        <p>{p.category || 'Collection'}</p>
                                        <Link to={`/product/${p.id}`}>{p.title}</Link>
                                        <span>
                                            ${p.price?.toLocaleString(undefined, {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* ── Footer ── */}
            <div className="mt-20">
                <LandingFooter />
            </div>
        </div>
    );
}

export default WishlistPage;
