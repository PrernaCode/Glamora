import React, { useEffect, lazy, Suspense } from 'react';
import Hero from '../components/Landing/Hero';

// Lazy load components that are not immediately visible
const Categories = lazy(() => import('../components/Landing/Categories'));
const NewArrivals = lazy(() => import('../components/Landing/NewArrivals'));
const BestSellers = lazy(() => import('../components/Landing/BestSellers'));
const LandingFooter = lazy(() => import('../components/Landing/LandingFooter'));

// Simple loading placeholder for suspended components
const SectionPlaceholder = () => <div className="h-40 animate-pulse bg-gray-50 rounded-3xl"></div>;

const LandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white overflow-x-hidden selection:bg-black selection:text-white">
            <Hero />

            <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12 md:space-y-20">
                <Suspense fallback={<SectionPlaceholder />}>
                    <Categories />
                </Suspense>
                
                <Suspense fallback={<SectionPlaceholder />}>
                    <NewArrivals />
                </Suspense>

                <Suspense fallback={<SectionPlaceholder />}>
                    <BestSellers />
                </Suspense>
            </main>

            <div className="mt-20 md:mt-32">
                <Suspense fallback={<div className="h-20" />}>
                    <LandingFooter />
                </Suspense>
            </div>
        </div>
    );
};

export default LandingPage;
