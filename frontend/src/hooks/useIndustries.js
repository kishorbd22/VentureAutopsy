import { useQuery } from "@tanstack/react-query"
import { fetchIndustries } from "../services/api"

/**
 * Hook to fetch all industries from GET /analysis/industries
 *
 * @returns {Object} Query result with data, isLoading, error, etc.
 * data is a string array of industry names
 *
 * @example
 * const { data: industries, isLoading } = useIndustries()
 * // industries = ["FinTech", "HealthTech", "E-Commerce", ...]
 */
export function useIndustries() {
  return useQuery({
    queryKey: ["industries"],
    queryFn: fetchIndustries,
    staleTime: 10 * 60 * 1000, // 10 minutes - industries don't change often
    select: (response) => response?.data || [],
  })
}