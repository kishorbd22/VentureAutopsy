import { useQuery } from "@tanstack/react-query"
import { fetchDeathCauses } from "../services/api"

/**
 * Hook to fetch all death causes from GET /analysis/death-causes
 *
 * @returns {Object} Query result with data, isLoading, error, etc.
 * data is a string array of death cause names
 *
 * @example
 * const { data: deathCauses, isLoading } = useDeathCauses()
 * // deathCauses = ["Outcompeted", "Ran out of cash", "No market need", ...]
 */
export function useDeathCauses() {
  return useQuery({
    queryKey: ["death-causes"],
    queryFn: fetchDeathCauses,
    staleTime: 10 * 60 * 1000, // 10 minutes - death causes don't change often
    select: (response) => response?.data || [],
  })
}