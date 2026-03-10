import React, { useRef } from 'react';
import { useGetCategoriesQuery } from '../../redux/slices/productsApi';

const Categories = () => {
    const { data: categories, isLoading, error } = useGetCategoriesQuery();
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (isLoading) return (
        <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-[#00674f]/20 border-t-[#00674f] rounded-full animate-spin"></div>
        </div>
    );
    if (error) return null;

    return (
        <section className="py-20 px-4 md:px-12 max-w-[1440px] mx-auto">
            <div className="flex items-end justify-between mb-12">
                <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-black uppercase text-[#00674f] tracking-tight">
                        Featured Categories
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Discover curated excellence across every department.</p>
                </div>
                <button className="hidden md:flex items-center gap-2 text-sm font-black uppercase text-[#00674f] tracking-widest hover:gap-4 transition-all group">
                    View All <span className="text-[#D4AF37] group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>

            <div className="relative group/scroll">
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-8"
                >
                    {categories?.map((category) => (
                        <div
                            key={category.id}
                            className="flex-none w-[280px] md:w-[350px] aspect-[4/5] relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-700"
                        >
                            <img
                                src={category.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800'}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            {/* Bottom Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#00674f]/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>

                            {/* Inner Details */}
                            <div className="absolute bottom-10 left-10 right-10 z-10 space-y-1">
                                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                                    {category.name}
                                </h3>

                            </div>

                            {/* Subtle border effect */}
                            <div className="absolute inset-4 border border-white/20 rounded-[2.5rem] pointer-events-none transition-all duration-500 group-hover:inset-6"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
