import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductsByCategoryQuery } from '../../redux/slices/productsApi';
import { addToCart, syncCartItem } from '../../redux/slices/cartSlice';
import { useToast } from '../../components/Toast';
import cartGIcon from '../../assets/icons/cartG.svg';

const NewArrivals = () => {
    const dispatch = useDispatch();
    const { addToast } = useToast();
    const user = useSelector(state => state.auth.user);
    // Category ID 8 is New Arrivals
    const { data: products, isLoading, error } = useGetProductsByCategoryQuery({ categoryId: 8 });
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleAddToCart = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();

        const cartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images?.[0]
        };

        dispatch(addToCart(cartItem));

        if (user?.id) {
            await dispatch(syncCartItem({ userId: user.id, item: cartItem }));
        }

        addToast(`${product.title} added to bag`, 'success');
    };

    if (isLoading) return (
        <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-[#00674f]/10 border-t-[#00674f] rounded-full animate-spin"></div>
        </div>
    );
    if (error) return null;

    return (
        <section id="new-arrivals" className="py-20 bg-[#f0fbf9] -mx-4 px-4 md:-mx-12 md:px-12">
            {/* Centered Heading with Gold Underline */}
            <div className="text-center mb-16 max-w-4xl mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-black uppercase text-[#00674f] tracking-tight mb-4">
                    New Arrivals
                </h2>
                <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
            </div>

            <div className="relative group/scroll px-10">
                {/* Navigation Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 z-10 transition-all hover:scale-110 active:scale-95 opacity-0 group-hover/scroll:opacity-100"
                >
                    <svg className="w-6 h-6 text-[#00674f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 z-10 transition-all hover:scale-110 active:scale-95 opacity-0 group-hover/scroll:opacity-100"
                >
                    <svg className="w-6 h-6 text-[#00674f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-12"
                >
                    {products?.map((product) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="flex-none w-[300px] md:w-[350px] bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-50/50"
                        >
                            {/* Product Image */}
                            <div className="relative aspect-square overflow-hidden bg-gray-50">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/400x400'}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                {product.isNew && (
                                    <span className="absolute top-6 left-6 px-3 py-1 bg-[#D4AF37] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                        New
                                    </span>
                                )}
                            </div>

                            {/* Integrated Product Details */}
                            <div className="p-8 space-y-3 relative">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase truncate">
                                            {product.category || 'Collection'}
                                        </span>
                                        {(product.rating?.rate > 0 || product.rating?.count > 0) && (
                                            <div className="flex items-center gap-1 shrink-0 bg-gray-50 px-2 py-0.5 rounded border border-gray-100/50">
                                                {/* Golden Star SVG */}
                                                <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-xs font-bold text-gray-800">{product.rating.rate}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-extrabold text-[#00674f] leading-tight tracking-tight uppercase group-hover:text-black transition-colors duration-300 truncate">
                                        {product.title}
                                    </h3>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-black font-black text-xl">
                                        ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                    </p>
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#00674f] hover:border-[#00674f] transition-all duration-300 group/cart shadow-sm"
                                    >
                                        <img src={cartGIcon} alt="Add to cart" className="w-5 h-5 group-hover/cart:brightness-0 group-hover/cart:invert" />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
