import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { useToast } from '../components/Toast';
import { useCallback } from 'react';

export const useCartActions = () => {
    const dispatch = useDispatch();
    const { addToast } = useToast();

    const handleAddToCart = useCallback((productOrEvent, optionalProduct) => {
        // If the first argument is an event, we use the second argument as the product
        const product = (productOrEvent && productOrEvent.nativeEvent) ? optionalProduct : productOrEvent;

        if (!product || !product.id) return;

        // Normalize product data for cart
        const cartItem = {
            id: product.id || product.product_id,
            title: product.title || "Product",
            price: product.price || 0,
            image: product.image || (product.images && product.images[0]) || ""
        };

        dispatch(addToCart(cartItem));
        const displayName = product.title ? product.title.substring(0, 30) : "Product";
        addToast(`${displayName}... added to bag`, 'success');
    }, [dispatch, addToast]);

    return { handleAddToCart };
};
