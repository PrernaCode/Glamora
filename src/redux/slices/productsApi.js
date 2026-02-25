import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Helper to clean malformed image URLs and detect placeholders from Platzi API
const cleanImageUrl = (url) => {
  if (!url) return null;

  // Handle URLs wrapped in brackets/quotes: ["url"]
  let cleaned = url.replace(/[\[\]"]/g, '');

  // Return null for placeholders to trigger local fallback
  if (cleaned.includes('placehold.co') || cleaned.includes('placeholder')) {
    return null;
  }

  return cleaned;
};

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
        image: cleanImageUrl(product.images?.[0]),
        category: product.category?.name || 'Uncategorized',
        rating: { rate: 4.5, count: 120 },
      })),
    }),

    // Get single product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => ({
        ...response,
        image: cleanImageUrl(response.images?.[0]),
        category: response.category?.name || 'Uncategorized',
        rating: { rate: 4.5, count: 120 },
      }),
    }),

    // Get all categories
    getCategories: builder.query({
      query: () => '/categories',
    }),

    // Get products by category
    getProductsByCategory: builder.query({
      query: (categoryId) => `/products/?categoryId=${categoryId}`,
      transformResponse: (response) => response.map(product => ({
        ...product,
        image: cleanImageUrl(product.images?.[0]),
        category: product.category?.name || 'Uncategorized',
        rating: { rate: 4.5, count: 120 },
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