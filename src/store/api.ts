import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const API_URLS = {
  // Auth Apis
  REGISTER: `${BASE_URL}/auth/register`,
  LOGIN: `${BASE_URL}/auth/login`,
  VERIFY_EMAIL: (token: string) => `${BASE_URL}/auth/verify/${token}`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: (token: string) => `${BASE_URL}/auth/reset-password/${token}`,
  VERIFY_AUTH: `${BASE_URL}/auth/verify-auth`,
  UPDATE_USER_PROFILE: `${BASE_URL}/user/update-user-details`,

  // Product Apis
  PRODUCTS: `${BASE_URL}/product`,
  PRODUCT_BY_ID: (id: string) => `${BASE_URL}/product/${id}`,
  PRODUCT_DELETE: (productId: string) =>
    `${BASE_URL}/product/seller/${productId}`,
  PRODUCT_BY_SELLERID: (sellerId: string) =>
    `${BASE_URL}/product/seller/${sellerId}`,

  // Cart Apis
  ADD_TO_CART: `${BASE_URL}/cart/add`,
  CART_DELETE: `${BASE_URL}/cart/remove`,
  CART_BY_USERID: (userId: string) => `${BASE_URL}/cart/${userId}`,

  // Whishlist Apis
  ADD_TO_WISHLIST: `${BASE_URL}/wishlist/add`,
  WISHLIST_DELETE: `${BASE_URL}/wishlist/remove`,
  WISHLIST_BY_USERID: (userId: string) => `${BASE_URL}/wishlist/${userId}`,

  // Address Apis
  CREATE_UPDATE_ADDRESS: `${BASE_URL}/user/address/create-update-address`,
  ADDRESS_BY_USERID: `${BASE_URL}/user/address`,

  // Order Apis
  ORDER: `${BASE_URL}/order`,
  ORDER_BY_ID: (orderId: string) => `${BASE_URL}/order/${orderId}`,
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["User", "Product", "Cart", "Wishlist", "Address", "Order"],
  endpoints: (builder) => ({
    // Auth Endpoints
    register: builder.mutation({
      query: (body) => ({
        url: API_URLS.REGISTER,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation({
      query: (body) => ({
        url: API_URLS.LOGIN,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: API_URLS.VERIFY_EMAIL(token),
        method: "GET",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: API_URLS.LOGOUT,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: API_URLS.FORGOT_PASSWORD,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: API_URLS.RESET_PASSWORD(token),
        method: "POST",
        body: newPassword,
      }),
    }),
    verifyAuth: builder.mutation({
      query: () => ({
        url: API_URLS.VERIFY_AUTH,
        method: "GET",
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (body) => ({
        url: API_URLS.UPDATE_USER_PROFILE,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Product Endpoints
    products: builder.query({
      query: (params) => ({
        url: API_URLS.PRODUCTS,
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),
    productById: builder.query({
      query: (id) => ({
        url: API_URLS.PRODUCT_BY_ID(id),
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    productDelete: builder.mutation({
      query: (productId) => ({
        url: API_URLS.PRODUCT_DELETE(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    productBySellerId: builder.query({
      query: (sellerId) => ({
        url: API_URLS.PRODUCT_BY_SELLERID(sellerId),
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    // Cart Endpoints
    addToCart: builder.mutation({
      query: (body) => ({
        url: API_URLS.ADD_TO_CART,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    cartDelete: builder.mutation({
      query: (body) => ({
        url: API_URLS.CART_DELETE,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    cartByUserId: builder.query({
      query: (userId) => ({
        url: API_URLS.CART_BY_USERID(userId),
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    // Wishlist Endpoints
    addToWishlist: builder.mutation({
      query: (body) => ({
        url: API_URLS.ADD_TO_WISHLIST,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    wishlistDelete: builder.mutation({
      query: (body) => ({
        url: API_URLS.WISHLIST_DELETE,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    wishlistByUserId: builder.query({
      query: (userId) => ({
        url: API_URLS.WISHLIST_BY_USERID(userId),
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),

    // Address Endpoints
    createOrUpdateAddress: builder.mutation({
      query: (body) => ({
        url: API_URLS.CREATE_UPDATE_ADDRESS,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Address"],
    }),
    addressByUserId: builder.query({
      query: () => ({
        url: API_URLS.ADDRESS_BY_USERID,
        method: "GET",
      }),
      providesTags: ["Address"],
    }),

    // Order Endpoints
    createOrUpdateOrder: builder.mutation({
      query: (body) => ({
        url: API_URLS.ORDER,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Cart"], // Also invalidate cart as order creation might clear it
    }),
    getOrderByUser: builder.query({
      query: () => ({
        url: API_URLS.ORDER,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    getOrderByOrderId: builder.query({
      query: (orderId) => ({
        url: API_URLS.ORDER_BY_ID(orderId),
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
  }),
});
