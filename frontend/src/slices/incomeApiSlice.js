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
  }),
});

export const { useGetIncomesQuery } = incomeApiSlice;