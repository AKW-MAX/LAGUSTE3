import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }

  return (
    import.meta.env.VITE_API_URL ||
    "https://agriventure-enterprise-backend.onrender.com"
  );
};

export const ProductsApi = createApi({
  reducerPath: "productsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("adminToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Products"],

  endpoints: (builder) => ({
    // Get all products
    getAllProducts: builder.query({
      query: () => "/Products",
      providesTags: ["Products"],
    }),

    // Get one product
    getProductById: builder.query({
      query: (id) => `/Products/${id}`,
    }),

    // Add product
    addProduct: builder.mutation({
      query: (product) => ({
        url: "/admin/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),

    // Update product
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),

    // Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ProductsApi;