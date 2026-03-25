import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductsQuery } from '../../redux/slices/productsApi';
import { addToCart, syncCartItem } from '../../redux/slices/cartSlice';
import { useToast } from '../../components/Toast';
import cartGIcon from '../../assets/icons/cartG.svg';

const BestSellers = () => {
    const dispatch = useDispatch();
    const { addToast } = useToast();
    const { data: products, isLoading } = useGetProductsQuery();
    const user = useSelector(state => state.auth.user);

    // Filter for products with rating >= 4.5
    const featuredProducts = products?.filter(p => (p.rating?.rate ?? 0) >= 4.5).slice(0, 4) || [];

    const handleAddToCart = async (e, product) => {
        e.preventDefault(); // Stop default action (in case of button/form)
        e.stopPropagation(); // Stop parent Link from navigating

        // Normalize product data for cart
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

    return (
        <section id="best-sellers" className="py-24 md:py-32 px-4 md:px-12 max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Our Curated Classics</span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase text-[#00674f] tracking-tighter leading-none">
                        Our <span className="text-gray-300">Icons</span>
                    </h2>
                </div>
                <div className="max-w-md hidden md:block">
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        The products our community loves most. Crafted with precision and designed to last a lifetime.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {featuredProducts.map((product) => (
                    <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-gray-50/50"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                            <img
                                src={product.images?.[0] || 'https://via.placeholder.com/400x533'}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        {/* Unified Content Block */}
                        <div className="p-8 space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase truncate">
                                        Timeless Icon
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
                                <h3 className="text-lg font-extrabold text-[#00674f] leading-tight uppercase group-hover:text-black transition-colors duration-300 line-clamp-1">
                                    {product.title}
                                </h3>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <p className="text-black font-black text-2xl">
                                    ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                </p>
                                <button
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#00674f] hover:border-[#00674f] transition-all duration-300 group/cart shadow-sm"
                                >
                                    <img src={cartGIcon} alt="Add to cart" className="w-6 h-6 group-hover/cart:brightness-0 group-hover/cart:invert" />
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default BestSellers;
