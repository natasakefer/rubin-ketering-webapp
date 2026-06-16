import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";


export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCT_URL,
            }),
            keepUnusedDataFor: 5,
            providesTags: ["Products"],
        }),
         getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCT_URL,
                method: "POST",
            }),
            invalidatesTags: ["Products"],
        }),
         updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCT_URL}/${data.productId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Products"],
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: "POST",
                body: data,
            }),
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCT_URL}/${data.productId}/reviews`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Products"],
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"],
        }),
    })
});

export const { useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation,useUpdateProductMutation, 
    useUploadProductImageMutation, useCreateReviewMutation, useDeleteProductMutation } = productsApiSlice;
