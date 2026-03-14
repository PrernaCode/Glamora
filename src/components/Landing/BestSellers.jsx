import React from 'react';
import { useGetProductsQuery } from '../../redux/slices/productsApi';
import cartGIcon from '../../assets/icons/cartG.svg';

const BestSellers = () => {
    const { data: products, isLoading } = useGetProductsQuery();

    // Filter for products with rating >= 4.5
    const featuredProducts = products?.filter(p => (p.rating?.rate ?? 0) >= 4.5).slice(0, 4) || [];

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
                    <div
                        key={product.id}
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
                                <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    Timeless Icon
                                </span>
                                <h3 className="text-lg font-extrabold text-[#00674f] leading-tight uppercase group-hover:text-black transition-colors duration-300">
                                    {product.title}
                                </h3>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <p className="text-[#D4AF37] font-black text-2xl">
                                    ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                </p>
                                <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#00674f] hover:border-[#00674f] transition-all duration-300 group/cart shadow-sm">
                                    <img src={cartGIcon} alt="Add to cart" className="w-6 h-6 group-hover/cart:brightness-0 group-hover/cart:invert" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BestSellers;
