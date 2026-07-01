import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  generateAIReport,
  chatWithAnalysis,
  simulateScenario,
  getAISuggestions,
} from "../services/api"

/**
 * Generate AI report for an analysis
 */
export function useAIReport(analysisId) {
  return useQuery({
    queryKey: ["ai", "report", analysisId],
    queryFn: () => generateAIReport(analysisId),
    enabled: !!analysisId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Chat with AI about an analysis
 */
export function useAIChat(analysisId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => chatWithAnalysis(analysisId, payload),
    onSuccess: () => {
      // Optionally invalidate or update related queries
      queryClient.invalidateQueries(["ai", "chat", analysisId])
    },
  })
}

/**
 * Simulate a what-if scenario
 */
export function useScenarioSimulation(analysisId) {
  return useMutation({
    mutationFn: (payload) => simulateScenario(analysisId, payload),
  })
}

/**
 * Get AI-generated suggestions for an analysis
 */
export function useAISuggestions(analysisId) {
  return useQuery({
    queryKey: ["ai", "suggestions", analysisId],
    queryFn: () => getAISuggestions(analysisId),
    enabled: !!analysisId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}