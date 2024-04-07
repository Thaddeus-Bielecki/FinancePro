import { LOAN_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const loanApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoan: builder.query({
      query: () => ({
        url: `${LOAN_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getLoanByUserId: builder.query({
      query: (userId) => ({
        url: `${LOAN_URL}/user/${userId}`,
    }),
      keepUnusedDataFor: 5,
    }),
    addLoan: builder.mutation({
      query: (data) => ({
        url: `${LOAN_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteLoan: builder.mutation({
      query: (id) => ({
        url: `${LOAN_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    updateLoan: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${LOAN_URL}/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
  }),
});

export const { useGetLoanQuery, useGetLoanByUserIdQuery, 
  useAddLoanMutation, useDeleteLoanMutation, 
  useUpdateLoanMutation } = loanApiSlice;