import React, { useEffect } from 'react';
import Hero from '../components/Landing/Hero';
import Categories from '../components/Landing/Categories';
import NewArrivals from '../components/Landing/NewArrivals';
import BestSellers from '../components/Landing/BestSellers';
import LandingFooter from '../components/Landing/LandingFooter';

const LandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white overflow-x-hidden selection:bg-black selection:text-white">
            <Hero />

            <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12 md:space-y-20">
                <Categories />
                <NewArrivals />
                <BestSellers />
            </main>

            <div className="mt-20 md:mt-32">
                <LandingFooter />
            </div>
        </div>
    );
};

export default LandingPage;
