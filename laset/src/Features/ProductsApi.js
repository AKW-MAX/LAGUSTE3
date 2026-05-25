import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const ProductsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5000/'}),
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => 'Products',
        }),
    }),
});

export const {useGetAllProductsQuery} = ProductsApi;