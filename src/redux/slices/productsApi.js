import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../../supabaseClient';

/**
 * Standardizes product data from Supabase to match the frontend model.
 */
const mapProduct = (product) => ({
  ...product,
  image: product.images?.[0] || null,
  category: product.category?.name || 'Uncategorized',
  rating: {
    rate: product.rating_rate,
    count: product.rating_count
  },
});

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    // Get all products from Supabase with Pagination
    getProducts: builder.query({
      queryFn: async (page = 0) => {
        try {
          const itemsPerPage = 15;
          const from = page * itemsPerPage;
          const to = from + itemsPerPage - 1;

          const { data, error } = await supabase
            .from('products')
            .select(`
              id, title, price, images,
              rating_rate, rating_count,
              category:categories(name)
            `)
            .order('created_at', { ascending: false })
            .range(from, to);

          if (error) throw error;
          return { data: data.map(mapProduct) };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      // Keep existing data and append new results
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCacheData, newItemsData) => {
        if (currentCacheData) {
          return [...currentCacheData, ...newItemsData];
        }
        return newItemsData;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Products', id })), { type: 'Products', id: 'LIST' }]
          : [{ type: 'Products', id: 'LIST' }],
    }),

    // Get single product by ID (Includes description for detail view)
    getProductById: builder.query({
      queryFn: async (id) => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select(`
              *,
              category:categories(name)
            `)
            .eq('id', id)
            .single();

          if (error) throw error;
          return { data: mapProduct(data) };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),

    // Get all categories
    getCategories: builder.query({
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('categories')
            .select('id, name, image')
            .order('name');

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
    }),

    // Get products by category (Selective columns + Pagination)
    getProductsByCategory: builder.query({
      queryFn: async ({ categoryId, page = 0 }) => {
        try {
          const itemsPerPage = 15;
          const from = page * itemsPerPage;
          const to = from + itemsPerPage - 1;

          const { data, error } = await supabase
            .from('products')
            .select(`
              id, title, price, images,
              rating_rate, rating_count,
              category:categories(name)
            `)
            .eq('category_id', categoryId)
            .order('created_at', { ascending: false })
            .range(from, to);

          if (error) throw error;
          return { data: data.map(mapProduct) };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs.categoryId;
      },
      merge: (currentCacheData, newItemsData) => {
        if (currentCacheData) {
          return [...currentCacheData, ...newItemsData];
        }
        return newItemsData;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page || currentArg?.categoryId !== previousArg?.categoryId;
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Products', id })), { type: 'Products', id: 'LIST' }]
          : [{ type: 'Products', id: 'LIST' }],
    }),

    // Server-side search using ilike — searches ALL products in DB
    searchProducts: builder.query({
      queryFn: async ({ searchTerm, categoryId, page = 0 }) => {
        try {
          const itemsPerPage = 15;
          const from = page * itemsPerPage;
          const to = from + itemsPerPage - 1;

          let query = supabase
            .from('products')
            .select(`
              id, title, price, images,
              rating_rate, rating_count,
              category:categories(name)
            `)
            .ilike('title', `%${searchTerm}%`)
            .order('created_at', { ascending: false })
            .range(from, to);

          if (categoryId && categoryId !== 'all') {
            query = query.eq('category_id', categoryId);
          }

          const { data, error } = await query;
          if (error) throw error;
          return { data: data.map(mapProduct) };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: [{ type: 'Products', id: 'SEARCH' }],
    }),

    // Lightweight suggestion query for header search dropdown
    getSuggestions: builder.query({
      queryFn: async (searchTerm) => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('id, title')
            .ilike('title', `%${searchTerm}%`)
            .limit(5);
          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: [{ type: 'Products', id: 'SUGGESTIONS' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetSuggestionsQuery,
} = productsApi;