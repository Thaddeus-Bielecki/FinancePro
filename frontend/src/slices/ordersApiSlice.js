import { apiSlice } from './apiSlice';
import { USERS_URL, PAYPAL_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // createOrder: builder.mutation({
    //   query: (order) => ({
    //     url: ORDERS_URL,
    //     method: 'POST',
    //     body: order,
    //   }),
    // }),
    // getOrderDetails: builder.query({
    //   query: (id) => ({
    //     url: `${ORDERS_URL}/${id}`,
    //   }),
    //   keepUnusedDataFor: 5,
    // }),
    payOrder: builder.mutation({
      // query: ({data, token}) => ({
      query: (data) => ({
        url: `${USERS_URL}/updateMember`,
        method: 'PUT',
        body: data,
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetPayPalClientIdQuery,
  usePayOrderMutation
} = orderApiSlice;

// export const {
//   useCreateOrderMutation,
//   useGetOrderDetailsQuery,
//   usePayOrderMutation,
//   useGetPayPalClientIdQuery,
// } = orderApiSlice;

// export const {
//   usePayOrderMutation,
//   useGetPayPalClientIdQuery,
// } = orderApiSlice;