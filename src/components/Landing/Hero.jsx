import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/images/hero2.jpg';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Image Container with Parallax Effect */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={heroImage}
                    alt="Glamora Immersive Luxury"
                    fetchpriority="high"
                    className="w-full h-full object-cover object-center scale-105 animate-slowZoom"
                />
                {/* Advanced Gradient Overlay for Premium Feel */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Content Section */}
            <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-20 lg:px-32 max-w-[1440px] mx-auto z-10 pt-20">
                <div className="max-w-4xl space-y-6">
                    <div className="overflow-hidden">
                        <p className="text-xs md:text-sm font-bold tracking-[0.4em] text-white/80 uppercase animate-slideUpReveal">
                            Defining Modern Elegance
                        </p>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-[110px] font-bold text-white leading-[0.85] tracking-tighter mb-8 animate-drop-in drop-shadow-2xl">
                        IMMERSIVE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E274] to-[#CF9928] drop-shadow-sm italic" style={{ fontFamily: "'Dancing Script', cursive", textTransform: 'none', fontWeight: 700, paddingLeft: '0.1em' }}>
                            Luxury
                        </span>
                    </h1>

                    <div className="overflow-hidden max-w-lg">
                        <p className="text-base md:text-lg text-white/70 font-medium leading-relaxed animate-slideUpReveal delay-300">
                            Experience the pinnacle of minimalist design and unparalleled comfort. Engineered for those who move with intention.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 pt-8 animate-slideUpReveal delay-500">
                        <button
                            onClick={() => navigate('/homepage')}
                            className="group relative px-10 py-5 bg-white text-black rounded-full font-black text-xs md:text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Shop Collection
                                <svg
                                    className="w-5 h-5 transform transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </button>

                        <button
                            onClick={() => navigate('/about')}
                            className="px-10 py-5 bg-transparent border border-white/30 backdrop-blur-sm text-white rounded-full font-black text-xs md:text-sm uppercase tracking-widest transition-all hover:bg-white/10 hover:border-white active:scale-95"
                        >
                            The Heritage
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 animate-bounce">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white rotate-90 origin-center translate-y-8">Scroll</span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
            </div>

            {/* Injected Custom Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slowZoom {
                    from { transform: scale(1.0); }
                    to { transform: scale(1.1); }
                }
                @keyframes slideUpReveal {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slowZoom { animation: slowZoom 20s ease-out forwards; }
                .animate-slideUpReveal { animation: slideUpReveal 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
            `}} />
        </div>
    );
};

export default Hero;
