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
  tagTypes: ["Products"],
  keepUnusedDataFor: 60,
  refetchOnFocus: true,
  refetchOnReconnect: true,

  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("adminToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getAllProducts: builder.query({
      // NOTE: confirm if your backend expects "/Products" or "/products"
      query: () => "/Products",
      providesTags: (result) => {
        const list = Array.isArray(result) ? result : result?.products || [];
        return [
          { type: "Products", id: "LIST" },
          ...list.map((p) => ({ type: "Products", id: p._id || p.id })),
        ];
      },
    }),

    getProductById: builder.query({
      query: (id) => `/Products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),

    addProduct: builder.mutation({
      query: (product) => ({
        url: "/admin/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Products", id: "LIST" },
        { type: "Products", id },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Products", id: "LIST" },
        { type: "Products", id },
      ],
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