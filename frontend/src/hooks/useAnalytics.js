import { useQuery } from "@tanstack/react-query"
import { getAnalyticsSummary, getDailyAnalytics, getIndustryStats } from "../services/api"

/**
 * Hook to fetch analytics summary
 * @returns {Object} Query result with analytics summary data
 */
export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: getAnalyticsSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch daily analytics data
 * @param {number} days - Number of days to fetch (default: 30)
 * @returns {Object} Query result with daily analytics array
 */
export function useDailyAnalytics(days = 30) {
  return useQuery({
    queryKey: ["analytics", "daily", days],
    queryFn: () => getDailyAnalytics(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch industry statistics
 * @returns {Object} Query result with industry stats array
 */
export function useIndustryStats() {
  return useQuery({
    queryKey: ["analytics", "industries"],
    queryFn: getIndustryStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}