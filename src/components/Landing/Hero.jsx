import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/images/hero-banner.webp';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-[80vh] min-h-[600px] w-full mt-4 rounded-[20px] md:mt-6 md:mx-auto md:max-w-[1400px] md:rounded-[32px] overflow-hidden bg-[#f0f0f0]">
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={heroImage}
                    alt="Spring Collection 2024"
                    className="w-full h-full object-cover object-center"
                />
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
            </div>

            {/* Content Section */}
            <div className="relative h-full flex flex-col justify-center px-6 md:px-16 max-w-2xl">
                <div className="space-y-4 md:space-y-6 animate-fadeInUp">
                    <p className="text-sm md:text-base font-medium tracking-[0.2em] text-[#A61E22] uppercase opacity-0 animate-slideUp duration-700 fill-mode-forwards">
                        Spring Collection 2024
                    </p>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] opacity-0 animate-slideUp delay-200 duration-700 fill-mode-forwards">
                        THE NEW <br /> STANDARD
                    </h1>

                    <p className="text-sm md:text-base text-white max-w-md font-medium opacity-0 animate-slideUp delay-400 duration-700 fill-mode-forwards">
                        Experience the pinnacle of minimalist design and unparalleled comfort.
                        Engineered for the modern movement.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4 opacity-0 animate-slideUp delay-600 duration-700 fill-mode-forwards">
                        <button
                            onClick={() => navigate('/homepage')}
                            className="px-8 py-4 bg-[#A61E22] text-white rounded-full font-bold text-sm md:text-base flex items-center group transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-lg shadow-red-900/20"
                        >
                            Shop Now
                            <svg
                                className="ml-2 w-5 h-5 transform transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                        <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-black/10 text-white rounded-full font-bold text-sm md:text-base transition-all hover:bg-black hover:text-white hover:scale-105 active:scale-95">
                            Explore
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll indicator or additional design elements can go here */}
        </div>
    );
};

export default Hero;
