import React from 'react';

const LandingFooter = () => {
    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                    <div className="col-span-1 md:col-span-1 space-y-8">
                        <h2 className="text-3xl font-black tracking-tighter italic">GLAMORA</h2>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs font-medium">
                            Defining the future of minimalist retail through high-quality materials and unparalleled attention to detail.
                        </p>
                        <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-white hover:text-black cursor-pointer transition-all duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </div>
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-white hover:text-black cursor-pointer transition-all duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-black uppercase tracking-widest text-[10px] text-white/40 mb-8 border-b border-white/5 pb-2 inline-block">Shop</h3>
                        <ul className="space-y-4">
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Men's Collection</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Women's Collection</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Accessories</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Best Sellers</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">New Arrivals</button></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black uppercase tracking-widest text-[10px] text-white/40 mb-8 border-b border-white/5 pb-2 inline-block">Support</h3>
                        <ul className="space-y-4">
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Customer Service</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Shipping Info</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Returns & Exchanges</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Order Status</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Contact Us</button></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black uppercase tracking-widest text-[10px] text-white/40 mb-8 border-b border-white/5 pb-2 inline-block">Company</h3>
                        <ul className="space-y-4">
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">About Us</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Sustainability</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Careers</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Press</button></li>
                            <li><button className="text-white/60 hover:text-white transition-colors text-sm font-medium uppercase tracking-tight">Terms of Service</button></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/30 text-[10px] uppercase font-bold tracking-[0.2em]">
                        © 2024 GLAMORA Inc. All rights reserved.
                    </p>
                    <div className="flex gap-10">
                        <button className="text-white/30 hover:text-white text-[10px] uppercase font-bold tracking-[0.2em] transition-colors">Privacy Policy</button>
                        <button className="text-white/30 hover:text-white text-[10px] uppercase font-bold tracking-[0.2em] transition-colors">Cookie Settings</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
