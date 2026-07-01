import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  updateUserRole,
  getAdminStartups,
  deleteAdminStartup,
  importCSV,
  getSampleTemplate,
} from "../services/api"

/**
 * Get admin dashboard statistics
 */
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Get paginated users list with search
 */
export function useAdminUsers(params = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getAdminUsers(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "users"])
      queryClient.invalidateQueries(["admin", "stats"])
    },
  })
}

/**
 * Update user admin role
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, isAdmin }) => updateUserRole(userId, isAdmin),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "users"])
    },
  })
}

/**
 * Get paginated startups list with search
 */
export function useAdminStartups(params = {}) {
  return useQuery({
    queryKey: ["admin", "startups", params],
    queryFn: () => getAdminStartups(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Delete a startup
 */
export function useDeleteStartup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminStartup,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "startups"])
      queryClient.invalidateQueries(["admin", "stats"])
    },
  })
}

/**
 * Import CSV file
 */
export function useImportCSV() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importCSV,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "startups"])
      queryClient.invalidateQueries(["admin", "stats"])
    },
  })
}

/**
 * Get sample CSV template
 */
export function useSampleTemplate() {
  return useQuery({
    queryKey: ["admin", "sample-template"],
    queryFn: getSampleTemplate,
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}