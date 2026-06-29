import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchUsers, fetchUserById } from "../services/api"

/**
 * Hook to fetch all users with React Query
 * @param {Object} params - Query parameters for filtering
 */
export function useUsers(params = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
    select: (data) => data?.results || data || [],
  })
}

/**
 * Hook to fetch a single user by ID
 * @param {number|string} id
 */
export function useUser(id) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  })
}