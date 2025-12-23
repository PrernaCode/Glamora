import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define API slice
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com' }),
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query({
      query: () => '/products',
    }),
    
    // Get single product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),
    
    // Get all categories
    getCategories: builder.query({
      query: () => '/products/categories',
    }),
    
    // Get products by category
    getProductsByCategory: builder.query({
      query: (category) => `/products/category/${category}`,
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