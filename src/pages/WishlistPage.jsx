import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { useToast } from '../components/Toast';
import ProductImage from '../components/ProductImage';

const Icons = {
    Trash: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Cart: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
};

function WishlistPage() {
    const dispatch = useDispatch();
    const { addToast } = useToast();
    const user = useSelector(state => state.auth.user);
    const wishlistItems = useSelector(state => state.wishlist.items);

    const handleRemove = (item) => {
        dispatch(toggleWishlistItem({ userId: user.id, product: { id: item.product_id, title: item.title } }));
        addToast('Removed from wishlist', 'success');
    };

    const handleAddToCart = (item) => {
        dispatch(addToCart({
            id: item.product_id,
            title: item.title,
            image: item.image,
            price: item.price || 0,
        }));
        addToast('Added to bag', 'success');
    };

    const handleMoveAllToBag = () => {
        wishlistItems.forEach(item => {
            dispatch(addToCart({
                id: item.product_id,
                title: item.title,
                image: item.image,
                price: item.price || 0,
            }));
        });
        addToast(`Moved ${wishlistItems.length} items to bag`, 'success');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-tighter">My Wishlist</h1>
                {wishlistItems.length > 0 && (
                    <button
                        onClick={handleMoveAllToBag}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-[10px] font-black tracking-widest uppercase hover:bg-gray-800 transition shadow-lg"
                    >
                        <Icons.Cart />
                        Move All to Bag
                    </button>
                )}
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-6xl mb-4">🤍</div>
                    <p className="text-xl text-gray-500 mb-6 font-medium">Your wishlist is empty</p>
                    <Link to="/" className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-bold uppercase tracking-widest text-xs">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                            <div className="relative aspect-square bg-white flex items-center justify-center p-6 border-b border-gray-50">
                                <ProductImage
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                <button
                                    onClick={() => handleRemove(item)}
                                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:scale-110 shadow-sm transition-all"
                                    aria-label="Remove from wishlist"
                                >
                                    <Icons.Trash />
                                </button>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <Link to={`/product/${item.product_id}`} className="block flex-1">
                                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 hover:text-gray-600 transition h-10">
                                        {item.title}
                                    </h3>
                                </Link>

                                <div className="mt-auto pt-4 flex flex-col gap-3">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full bg-black text-white py-3 rounded-lg text-[10px] font-black tracking-widest uppercase hover:bg-gray-800 transition"
                                    >
                                        Add to Bag
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WishlistPage;
