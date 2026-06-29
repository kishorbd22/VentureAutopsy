import { useMutation } from "@tanstack/react-query"
import { analyzeStartup } from "../services/api"

/**
 * Hook to analyze a startup via POST /analysis/analyze
 *
 * @returns {Object} Mutation object with mutate, mutateAsync, isLoading, error, data
 *
 * @example
 * const { mutate, isPending, data } = useAnalysis()
 * mutate({
 *   industry: "FinTech",
 *   name: "My Startup",
 *   country: "US",
 *   total_funding_usd: 5000000,
 * })
 */
export function useAnalysis() {
  return useMutation({
    mutationFn: (analysisData) => analyzeStartup(analysisData),
    onError: (error) => {
      console.error("Analysis failed:", error.friendlyMessage || error.message)
    },
  })
}