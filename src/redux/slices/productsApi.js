import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define API slice
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.escuelajs.co/api/v1' }),
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query({
      query: () => '/products',
      transformResponse: (response) => response.map(product => ({
        ...product,
        image: product.images?.[0] || '', // Map array to single image string
        category: product.category?.name || 'Uncategorized', // Flatten category object for UI
        rating: { rate: 4.5, count: 120 }, // Mock ratings as Platzi lacks them
      })),
    }),

    // Get single product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => ({
        ...response,
        image: response.images?.[0] || '',
        category: response.category?.name || 'Uncategorized',
        rating: { rate: 4.5, count: 120 }, // Mock ratings
      }),
    }),

    // Get all categories (Returns array of objects: {id, name, ...})
    getCategories: builder.query({
      query: () => '/categories',
    }),

    // Get products by category
    getProductsByCategory: builder.query({
      query: (categoryId) => `/products/?categoryId=${categoryId}`,
      transformResponse: (response) => response.map(product => ({
        ...product,
        image: product.images?.[0] || '',
        category: product.category?.name || 'Uncategorized',
        rating: { rate: 4.5, count: 120 }, // Mock ratings
      })),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} = productsApi;