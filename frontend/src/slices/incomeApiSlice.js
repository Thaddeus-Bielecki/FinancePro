import { INCOME_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const incomeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIncomes: builder.query({
      query: () => ({
        url: INCOME_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getIncomesByUserId: builder.query({
      query: (userId) => ({
        url: `${INCOME_URL}/user/${userId}`,
    }),
      keepUnusedDataFor: 5,
    }),
    addIncome: builder.mutation({
      query: (data) => ({
        url: `${INCOME_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetIncomesQuery, useGetIncomesByUserIdQuery, useAddIncomeMutation } = incomeApiSlice;