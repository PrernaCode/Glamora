import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session found');
            const userId = session.user.id;

            const { data, error } = await supabase
                .from('wishlist')
                .select('*')
                .eq('user_id', userId);
            if (error) throw error;
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleWishlistItem = createAsyncThunk(
    'wishlist/toggle',
    async ({ product }, { getState, rejectWithValue }) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No active session found');
            const userId = session.user.id;
            const { wishlist } = getState();
            const existing = wishlist.items.find(item => item.product_id === product.id);

            if (existing) {
                const { error } = await supabase
                    .from('wishlist')
                    .delete()
                    .eq('user_id', userId)
                    .eq('product_id', product.id);
                if (error) throw error;
                return { productId: product.id, action: 'removed' };
            } else {
                const { data, error } = await supabase
                    .from('wishlist')
                    .insert({
                        user_id: userId,
                        product_id: product.id,
                        title: product.title || '',
                        image: product.image || '',
                        price: product.price || 0,
                        category: product.category || ''
                    })
                    .select()
                    .single();
                if (error) throw error;
                return { item: data, action: 'added' };
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(toggleWishlistItem.fulfilled, (state, action) => {
                if (action.payload.action === 'removed') {
                    state.items = state.items.filter(i => i.product_id !== action.payload.productId);
                } else {
                    state.items.push(action.payload.item);
                }
            })
            .addMatcher(
                (action) => action.type === 'auth/logout/fulfilled',
                (state) => {
                    state.items = [];
                    state.error = null;
                }
            );
    }
});

export default wishlistSlice.reducer;
