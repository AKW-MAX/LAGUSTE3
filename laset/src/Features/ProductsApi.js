import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }

    return import.meta.env.VITE_API_URL || 'https://agriventure-enterprise-backend.onrender.com';
};

export const ProductsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
     }),
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => '/Products',
        }),
    }),
});

export const {useGetAllProductsQuery} = ProductsApi;