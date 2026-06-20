import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const ProductsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
     }),
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => '/Products',
        }),
    }),
});

export const {useGetAllProductsQuery} = ProductsApi;