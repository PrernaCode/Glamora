import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { useToast } from '../components/Toast';
import { useCallback } from 'react';

export const useCartActions = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const { addToast } = useToast();

    const handleAddToCart = useCallback((productOrEvent, optionalProduct) => {
        // If the first argument is an event, we use the second argument as the product
        const product = (productOrEvent && productOrEvent.nativeEvent) ? optionalProduct : productOrEvent;

        if (!product || (!product.id && !product.product_id)) return;

        const productId = product.id || product.product_id;
        const existingItem = cartItems.find(item => item.id === productId);

        if (existingItem && existingItem.quantity >= 10) {
            addToast('Maximum limit (10) reached for this item', 'warning');
            return;
        }

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
    }, [dispatch, addToast, cartItems]);

    return { handleAddToCart };
};
