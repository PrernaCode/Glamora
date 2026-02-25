import React, { useState, useEffect } from 'react';
import fallbackImage from '../assets/images/Jacket.jpg';

const ProductImage = ({ src, alt, className, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    // Sync state with src changes (crucial for React re-renders)
    useEffect(() => {
        if (!src) {
            setHasError(true);
            setImgSrc(fallbackImage);
        } else {
            setHasError(false);
            setImgSrc(src);
        }
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackImage);
        }
    };

    return (
        <div className={`relative overflow-hidden bg-gray-50 flex items-center justify-center ${className}`}>
            <img
                src={imgSrc || fallbackImage}
                alt={alt}
                onError={handleError}
                className={`w-full h-full object-contain transition-opacity duration-500 ${hasError ? 'opacity-80' : 'opacity-100'}`}
                {...props}
            />
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center px-2">
                        Preview Image
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProductImage;
