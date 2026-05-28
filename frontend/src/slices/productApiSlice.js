import { PRODUCT_URL } from "../constants";
import { apiSlice } from "./apiSlice";
import fallbackProducts from "../products_list";

const shouldUseFallbackProducts = () => process.env.NODE_ENV === 'development';


export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
                const result = await baseQuery({ url: PRODUCT_URL });

                if (result.error && shouldUseFallbackProducts()) {
                    return { data: fallbackProducts };
                }

                return result;
            },
            keepUnusedDataFor: 5,
        }),
         getProductDetails: builder.query({
            async queryFn(productId, _queryApi, _extraOptions, baseQuery) {
                const result = await baseQuery({ url: `${PRODUCT_URL}/${productId}` });

                if (result.error && shouldUseFallbackProducts()) {
                    const product = fallbackProducts.find((item) => item._id === productId);

                    return product
                        ? { data: product }
                        : { error: { status: 404, data: { message: 'Product not found' } } };
                }

                return result;
            },
            keepUnusedDataFor: 5,
        }),

    })
});

export const { useGetProductsQuery, useGetProductDetailsQuery  } = productsApiSlice;
