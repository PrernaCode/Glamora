import React from 'react';
import img1 from '../../assets/images/new-arriavls-1.webp';
import img2 from '../../assets/images/new-arrivals-2.webp';
import img3 from '../../assets/images/new-arriavls-3.webp';
import img4 from '../../assets/images/new-arrivals-4.webp';

const ProductCard = ({ image, name, collection, price, tag }) => (
    <div className="group flex-shrink-0 w-[280px] md:w-[320px]">
        <div className="relative aspect-[1/1.2] bg-[#f9f9f9] rounded-2xl overflow-hidden mb-4">
            <img
                src={image}
                alt={name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {tag && (
                <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-red-600 shadow-sm">
                    {tag}
                </span>
            )}
            <button className="absolute top-4 right-4 p-2 bg-white rounded-full opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-md">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{collection}</p>
            <h3 className="text-base font-black text-black leading-tight mb-1">{name}</h3>
            <p className="text-lg font-black text-black">${price}.00</p>
        </div>
    </div>
);

const NewArrivals = () => {
    return (
        <section className="py-20 border-t border-gray-100">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-black">New Arrivals</h2>
                    <p className="text-sm text-gray-500 mt-1 italic">Our latest drops</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 rounded-full border border-gray-200 hover:bg-black hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="p-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4 md:-mx-0 md:px-0">
                <ProductCard
                    image={img1}
                    name="Aero Max 01"
                    collection="Sustainable Care Series"
                    price="180"
                    tag="New"
                />
                <ProductCard
                    image={img2}
                    name="Vivid Runner X"
                    collection="Pro Performance"
                    price="210"
                    tag="Member Exclusive"
                />
                <ProductCard
                    image={img3}
                    name="Terra Craft Low"
                    collection="Heritage Collection"
                    price="165"
                    tag="Sustainable"
                />
                <ProductCard
                    image={img4}
                    name="Peak Trailblazer"
                    collection="Adventure Series"
                    price="240"
                    tag="Limited Edition"
                />
            </div>

            {/* Join the Movement Section integrated here for layout flow */}
            <div className="mt-32 rounded-[40px] bg-[#0c0c14] py-20 px-6 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-red-900/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-6 tracking-tighter">
                        Join the movement
                    </h2>
                    <p className="text-gray-400 mb-10 text-lg leading-relaxed font-medium">
                        Be the first to know about new drops, exclusive collections, and the stories behind the design.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all font-medium"
                        />
                        <button className="bg-white text-black font-black uppercase tracking-widest text-xs px-10 py-4 rounded-full hover:bg-red-600 hover:text-white transition-all transform active:scale-95">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
