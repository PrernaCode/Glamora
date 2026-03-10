import React, { useRef } from 'react';
import { useGetProductsByCategoryQuery } from '../../redux/slices/productsApi';
import cartGIcon from '../../assets/icons/cartG.svg';

const NewArrivals = () => {
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

    if (isLoading) return (
        <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-[#00674f]/10 border-t-[#00674f] rounded-full animate-spin"></div>
        </div>
    );
    if (error) return null;

    return (
        <section className="py-20 bg-[#f0fbf9] -mx-4 px-4 md:-mx-12 md:px-12">
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
                        <div 
                            key={product.id} 
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
                                    <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                        {product.category || 'Collection'}
                                    </span>
                                    <h3 className="text-lg font-extrabold text-[#00674f] leading-tight tracking-tight uppercase group-hover:text-black transition-colors duration-300 truncate">
                                        {product.title}
                                    </h3>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#D4AF37] font-black text-xl">
                                        ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                    </p>
                                    <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#00674f] hover:border-[#00674f] transition-all duration-300 group/cart shadow-sm">
                                        <img src={cartGIcon} alt="Add to cart" className="w-5 h-5 group-hover/cart:brightness-0 group-hover/cart:invert" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
