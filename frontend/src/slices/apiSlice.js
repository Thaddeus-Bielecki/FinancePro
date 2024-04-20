import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Income', 'Expense', 'Users', 'Paypal'],

  endpoints: (builder) => ({
    getIncome: builder.query({
      query: () => '/api/income',
    }),
    getExpense: builder.query({
      query: () => '/api/expense',
    }),
    getUsers: builder.query({
      query: () => '/api/users',
    }),
    getPaypal: builder.query({
      query: () => '/api/config/paypal',
    }),
  }),
});