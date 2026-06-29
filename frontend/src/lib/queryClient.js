import { QueryClient } from "@tanstack/react-query"

/**
 * Configured QueryClient for React Query
 * - staleTime: 5 minutes (data considered fresh)
 * - gcTime: 30 minutes (keep in cache after unused)  
 * - retry: 2 retries on failure
 * - refetchOnWindowFocus: false (don't refetch on tab switch)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})