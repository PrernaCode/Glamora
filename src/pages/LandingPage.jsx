import React, { useEffect } from 'react';
import Hero from '../components/Landing/Hero';
import Categories from '../components/Landing/Categories';
import NewArrivals from '../components/Landing/NewArrivals';
import LandingFooter from '../components/Landing/LandingFooter';

const LandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white overflow-x-hidden">
            <Hero />
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <Categories />
                <NewArrivals />
            </div>
            <LandingFooter />
        </div>
    );
};

export default LandingPage;
