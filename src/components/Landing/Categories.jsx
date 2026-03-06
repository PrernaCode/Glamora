import React from 'react';
import menImg from '../../assets/images/category-men.webp';
import womenImg from '../../assets/images/category-women.webp';
import accessoriesImg from '../../assets/images/category-accessories.webp';

const CategoryCard = ({ image, label, sublabel }) => (
    <div className="group relative overflow-hidden rounded-3xl bg-gray-100 aspect-[4/5] cursor-pointer">
        <img
            src={image}
            alt={label}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-6 left-6 text-white transform transition-transform duration-500 group-hover:translate-y-[-8px]">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{label}</h3>
            <p className="text-sm font-medium text-gray-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100 italic">
                {sublabel}
            </p>
        </div>
    </div>
);

const Categories = () => {
    return (
        <section className="py-20">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-black">Featured Categories</h2>
                </div>
                <button className="text-sm font-bold border-b-2 border-black pb-1 transition-colors hover:text-gray-500 hover:border-gray-500">
                    View All Categories →
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <CategoryCard
                    image={menImg}
                    label="Men"
                    sublabel="Elevated Essentials"
                />
                <CategoryCard
                    image={womenImg}
                    label="Women"
                    sublabel="Sophisticated Style"
                />
                <CategoryCard
                    image={accessoriesImg}
                    label="Accessories"
                    sublabel="Refined Details"
                />
            </div>
        </section>
    );
};

export default Categories;
