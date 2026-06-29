import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchStartups, fetchStartupById, analyzeStartup } from "../services/api"

/**
 * Hook to fetch all startups with React Query
 * @param {Object} params - Query parameters for filtering
 */
export function useStartups(params = {}) {
  return useQuery({
    queryKey: ["startups", params],
    queryFn: () => fetchStartups(params),
    select: (data) => data?.results || data || [],
  })
}

/**
 * Hook to fetch a single startup by ID
 * @param {number|string} id
 */
export function useStartup(id) {
  return useQuery({
    queryKey: ["startup", id],
    queryFn: () => fetchStartupById(id),
    enabled: !!id,
  })
}

/**
 * Hook to analyze a startup (mutation)
 */
export function useAnalyzeStartup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => analyzeStartup(data),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["startups"] })
      queryClient.invalidateQueries({ queryKey: ["analytics"] })
      return data
    },
  })
}