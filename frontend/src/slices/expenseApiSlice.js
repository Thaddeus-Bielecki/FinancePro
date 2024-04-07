import { EXPENSE_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const expenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExpense: builder.query({
      query: () => ({
        url: `${EXPENSE_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getExpenseByUserId: builder.query({
      query: (userId) => ({
        url: `${EXPENSE_URL}/user/${userId}`,
    }),
      keepUnusedDataFor: 5,
    }),
    addExpense: builder.mutation({
      query: (data) => ({
        url: `${EXPENSE_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `${EXPENSE_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    updateExpense: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${EXPENSE_URL}/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
  }),
});

export const { useGetExpenseQuery, useGetExpenseByUserIdQuery, 
  useAddExpenseMutation, useDeleteExpenseMutation, 
  useUpdateExpenseMutation } = expenseApiSlice;