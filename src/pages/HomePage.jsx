import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { useGetProductsQuery, useGetCategoriesQuery, useGetProductsByCategoryQuery, useSearchProductsQuery } from '../redux/slices/productsApi';
import { Link, useSearchParams } from 'react-router-dom';
import { useToast } from '../components/Toast';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useDebounce from '../hooks/useDebounce';
import LoginModal from '../components/LoginModal';
import ProductImage from '../components/ProductImage';
import cartGIcon from '../assets/icons/cartG.svg';
import heartFilledIcon from '../assets/icons/heart_filled.svg';
import heartOutlinedIcon from '../assets/icons/heart_outlined.svg';
import ratingIcon from '../assets/icons/rating.svg';
import { ReactComponent as DownArrowIcon } from '../assets/icons/down-arrow.svg';


/* ─── Shared ProductCard ─────────────────────────────────────────────── */
const ProductCard = memo(({ product, onAddToCart, onLoginRequired }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const wishlistItems = useSelector(state => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.product_id === product.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { onLoginRequired(); return; }
    dispatch(toggleWishlistItem({ userId: user.id, product }));
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100/60 relative">
      {/* Wishlist button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <img
          src={isWishlisted ? heartFilledIcon : heartOutlinedIcon}
          alt="wishlist"
          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
        />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-gray-50">
        <ProductImage
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </Link>

      {/* Info */}
      <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
        <p className="text-[9px] sm:text-[10px] font-black tracking-widest text-gray-400 uppercase truncate">{product.category || 'Collection'}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[11px] sm:text-sm font-extrabold text-[#00674f] leading-snug uppercase hover:text-black transition-colors duration-300 line-clamp-2">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between pt-0.5 gap-1">
          <span className="text-sm sm:text-base font-black text-black truncate">${product.price?.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#00674f] hover:border-[#00674f] transition-all duration-300 group/cart shadow-sm"
            aria-label="Add to cart"
          >
            <img src={cartGIcon} alt="cart" className="w-3 h-3 sm:w-4 sm:h-4 group-hover/cart:brightness-0 group-hover/cart:invert" />
          </button>
        </div>
      </div>
    </div>
  );
});
ProductCard.displayName = 'ProductCard';

/* ─── Rating Stars component using rating.svg icon ──────────────────── */
const RatingFilter = ({ selectedRating, onSelect }) => {
  const options = [4.5, 4, 3];
  return (
    <div className="space-y-3">
      {options.map(stars => (
        <button
          key={stars}
          onClick={() => onSelect(selectedRating === stars ? null : stars)}
          className={`flex items-center gap-2 w-full group transition-colors ${selectedRating === stars ? 'text-[#00674f]' : 'text-gray-500 hover:text-black'}`}
        >
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <img
                key={s}
                src={ratingIcon}
                alt=""
                className={`w-3.5 h-3.5 transition-opacity ${s <= Math.floor(stars) ? 'opacity-100' : s - 0.5 <= stars ? 'opacity-60' : 'opacity-20'}`}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">{stars}+ up</span>
        </button>
      ))}
    </div>
  );
};

/* ─── HomePage ───────────────────────────────────────────────────────── */
function HomePage() {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // null = will be set to "Clothes" after categories load
  const [selectedRating, setSelectedRating] = useState(null);
  const [priceMax, setPriceMax] = useState(600);
  const [page, setPage] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Read ?search=, ?collection=, and ?category= from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const collectionParam = searchParams.get('collection') || '';
  const categoryParam = searchParams.get('category') || ''; // e.g. "shoes", "clothes"

  const handleLoginRequired = () => setIsLoginModalOpen(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const { data: categories } = useGetCategoriesQuery();

  // URL search (from header) takes priority over local state search
  const effectiveSearch = urlSearch || debouncedSearchTerm;

  // Default to category / collection from URL params on first load
  useEffect(() => {
    if (selectedCategory !== null) return; // already set

    if (categoryParam && categories) {
      // Resolve category name → ID
      const match = categories.find(
        c => c.name.toLowerCase() === categoryParam.toLowerCase()
      );
      setSelectedCategory(match ? match.id : 'all');
    } else if (collectionParam === 'new-arrivals') {
      setSelectedCategory(8);
    } else {
      setSelectedCategory('all');
    }
  }, [selectedCategory, collectionParam, categoryParam, categories]);

  // Reset page on filter / search change
  useEffect(() => { setPage(0); }, [selectedCategory, effectiveSearch, collectionParam]);

  const currentCategoryId = selectedCategory ?? 'all';
  const isSearchActive = effectiveSearch.trim().length > 0;

  // Server-side search (runs when header OR local search is active)
  const { data: searchResults, isFetching: fetchingSearch } = useSearchProductsQuery(
    { searchTerm: effectiveSearch, categoryId: currentCategoryId, page },
    { skip: !isSearchActive }
  );

  // ── Pagination queries (active when NO search term) ──
  const { data: allProducts, isLoading: loadingAll, isFetching: fetchingAll } = useGetProductsQuery(page, {
    skip: isSearchActive || currentCategoryId !== 'all'
  });

  const { data: categoryProducts, isLoading: loadingCategory, isFetching: fetchingCategory } = useGetProductsByCategoryQuery(
    { categoryId: (collectionParam === 'new-arrivals' && currentCategoryId === 'all') ? 8 : currentCategoryId, page },
    { skip: isSearchActive || (currentCategoryId === 'all' && collectionParam !== 'new-arrivals') }
  );

  // Route to the right data source
  const products = isSearchActive
    ? searchResults
    : (currentCategoryId === 'all' && collectionParam !== 'new-arrivals') ? allProducts : categoryProducts;

  const isLoadingInitial = page === 0 && (
    isSearchActive ? false : (currentCategoryId === 'all' && collectionParam !== 'new-arrivals') ? loadingAll : loadingCategory
  );
  const isFetchingMore = page > 0 && (
    isSearchActive ? fetchingSearch : (currentCategoryId === 'all' && collectionParam !== 'new-arrivals') ? fetchingAll : fetchingCategory
  );

  const filteredProducts = useMemo(() => {
    let result = products;

    // Apply text search filter if not using server-side results
    if (!isSearchActive && effectiveSearch) {
      result = result?.filter(p => p.title.toLowerCase().includes(effectiveSearch.toLowerCase()));
    }

    // Apply Best Sellers collection logic (rating >= 4.5)
    if (collectionParam === 'best-sellers') {
      result = result?.filter(p => (p.rating?.rate ?? 0) >= 4.5);
    }

    if (selectedRating) {
      result = result?.filter(p => (p.rating?.rate ?? 0) >= selectedRating);
    }
    result = result?.filter(p => (p.price ?? 0) <= priceMax);

    // Apply sort
    if (result) {
      result = [...result].sort((a, b) => {
        if (sortBy === 'price_asc') return (a.price ?? 0) - (b.price ?? 0);
        if (sortBy === 'price_desc') return (b.price ?? 0) - (a.price ?? 0);
        return 0;
      });
    }
    return result;
  }, [products, effectiveSearch, selectedRating, priceMax, isSearchActive, sortBy, collectionParam]);

  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product));
    addToast(`${product.title.substring(0, 30)}... added to cart`, 'success');
  }, [dispatch, addToast]);

  // Clears search (local + URL) and collection whenever a category is selected
  const handleCategoryChange = useCallback((id) => {
    setSelectedCategory(id);
    setSearchTerm('');
    
    // Create a new URLSearchParams object to safely update the URL
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    newParams.delete('collection');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const hasMore = useMemo(() => {
    if (!products) return false;
    return products.length > 0 && products.length % 15 === 0;
  }, [products]);

  const currentCategoryName = useMemo(() => {
    if (collectionParam === 'new-arrivals') return 'New Arrivals';
    if (collectionParam === 'best-sellers') return 'Best Sellers';
    if (currentCategoryId === 'all') return 'All Collections';
    const cat = categories?.find(c => String(c.id) === String(currentCategoryId));
    return cat ? cat.name : 'Clothes';
  }, [categories, currentCategoryId, collectionParam]);

  if (isLoadingInitial) return <LoadingSkeleton />;

  return (
    <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-6 mt-0 overflow-x-hidden">

      {/* ── Breadcrumbs ── */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-20 mb-6">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-black">{currentCategoryName}</span>
      </nav>

      {/* ── Hero heading (left-aligned) ── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase text-[#00674f] tracking-tighter leading-none">
          {collectionParam ? (
            <>
              Featured <span className="text-black">{collectionParam.replace('-', ' ')}</span>
            </>
          ) : (
            <>
              Exquisite <span className="text-black">Collections</span>
            </>
          )}
        </h1>
        <p className="mt-2 text-gray-500 text-xs sm:text-sm font-medium max-w-sm sm:max-w-lg">
          {collectionParam === 'best-sellers' 
            ? 'Discover our most-loved icons, rated highest by our community.'
            : collectionParam === 'new-arrivals'
            ? 'Be the first to explore our latest designs and artisanal finishes.'
            : `Discover our curated selection of premium ${currentCategoryName.toLowerCase()} for the modern connoisseur.`
          }
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── Mobile sidebar toggle ── */}
        <button
          onClick={() => setShowMobileSidebar(v => !v)}
          className="lg:hidden flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest"
        >
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4h18M7 8h10M11 12h4" /></svg>
            Filters
          </span>
          <svg className={`w-3.5 h-3.5 transition-transform ${showMobileSidebar ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* ── Sidebar ── */}
        <aside className={`lg:w-60 shrink-0 space-y-10 ${showMobileSidebar ? 'block' : 'hidden lg:block'}`}>

          {/* Category filter */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-[#00674f] rounded-full inline-block"></span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black">Category</h3>
            </div>
            <div className="space-y-3 pl-4">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`flex items-center gap-3 w-full text-left transition-colors ${currentCategoryId === 'all' ? 'text-[#00674f]' : 'text-gray-500 hover:text-black'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${currentCategoryId === 'all' ? 'border-[#00674f] bg-[#00674f]' : 'border-gray-300'}`}>
                  {currentCategoryId === 'all' && <div className="w-1 h-1 bg-white rounded-full"></div>}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">All</span>
              </button>
              {categories?.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-3 w-full text-left transition-colors ${currentCategoryId === cat.id ? 'text-[#00674f]' : 'text-gray-500 hover:text-black'}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${currentCategoryId === cat.id ? 'border-[#00674f] bg-[#00674f]' : 'border-gray-300'}`}>
                    {currentCategoryId === cat.id && <div className="w-1 h-1 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price filter */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-[#00674f] rounded-full inline-block"></span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black">Price</h3>
            </div>
            <div className="pl-4 space-y-3">
              <input
                type="range"
                min={0}
                max={600}
                step={10}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#00674f] cursor-pointer"
                aria-label="Maximum price"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400">$0</span>
                <span className="text-[11px] font-black text-[#00674f]">${priceMax}</span>
                <span className="text-[10px] font-bold text-gray-400">$600</span>
              </div>
            </div>
          </div>

          {/* Rating filter */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-[#00674f] rounded-full inline-block"></span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black">Rating</h3>
            </div>
            <div className="pl-4">
              <RatingFilter selectedRating={selectedRating} onSelect={setSelectedRating} />
            </div>
          </div>

        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Top bar: count + sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Showing <span className="text-[#00674f]">{filteredProducts?.length || 0}</span> products
            </p>

            {/* Sort By dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00674f] transition-all hover:bg-[#111] shadow-md"
                aria-label="Sort products"
              >
                <option value="newest" className="bg-black">Newest</option>
                <option value="price_asc" className="bg-black">Price: Low → High</option>
                <option value="price_desc" className="bg-black">Price: High → Low</option>
              </select>
              <DownArrowIcon
                className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 pointer-events-none"
                fill="white"
              />
            </div>
          </div>

          {/* Active filter chips — shows URL search OR local search */}
          {(effectiveSearch || selectedRating) && (
            <div className="flex flex-wrap gap-2">
              {effectiveSearch && (
                <span className="bg-black text-white pl-3 pr-2 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  {effectiveSearch}
                  <button
                    onClick={() => {
                      // Clear whichever is active
                      if (urlSearch) { searchParams.delete('search'); setSearchParams(searchParams); }
                      else setSearchTerm('');
                    }}
                    className="w-4 h-4 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/40"
                    aria-label="Clear search"
                  >✕</button>
                </span>
              )}
              {selectedRating && (
                <span className="bg-[#00674f] text-white pl-3 pr-2 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  {selectedRating}+ stars
                  <button onClick={() => setSelectedRating(null)} className="w-4 h-4 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/40" aria-label="Clear rating">✕</button>
                </span>
              )}
            </div>
          )}

          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5 md:gap-7">
            {filteredProducts?.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onLoginRequired={handleLoginRequired}
              />
            ))}
          </div>

          {/* Show More — only when not searching */}
          {hasMore && !effectiveSearch && (
            <div className="pt-12 flex justify-center">
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={isFetchingMore}
                className="group relative px-10 py-3.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full overflow-hidden transition-all duration-300 hover:pr-14 active:scale-95 disabled:opacity-50 shadow-lg"
              >
                <span className="flex items-center gap-3">
                  {isFetchingMore
                    ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Loading...</>
                    : 'Show More'
                  }
                </span>
                {!isFetchingMore && (
                  <span className="absolute right-0 top-0 h-full w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
                )}
              </button>
            </div>
          )}

          {/* Empty state */}
          {filteredProducts?.length === 0 && (
            <div className="text-center py-24 space-y-4">
              <div className="text-5xl opacity-20">🔍</div>
              <h3 className="text-xl font-black text-[#00674f] uppercase tracking-tighter">No products found</h3>
              <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  if (urlSearch) { searchParams.delete('search'); setSearchParams(searchParams); }
                  setSelectedCategory('all');
                  setSelectedRating(null);
                }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-black border-b border-gray-300 pb-1 hover:border-black transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </main>
  );
}

export default HomePage;