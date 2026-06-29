import { z } from "zod"

/**
 * Zod validation schema for the startup analysis form.
 * Mirrors the backend StartupAnalysisRequest model.
 */
export const analysisFormSchema = z.object({
  name: z
    .string()
    .max(200, "Startup name must be under 200 characters")
    .optional()
    .or(z.literal("")),

  industry: z
    .string({ required_error: "Industry is required" })
    .min(1, "Please select an industry"),

  country: z
    .string()
    .max(100, "Country must be under 100 characters")
    .optional()
    .or(z.literal("")),

  total_funding_usd: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (val === "" || val === undefined || val === null) return undefined
      const num = typeof val === "string" ? Number(val) : val
      return isNaN(num) ? undefined : num
    })
    .pipe(z.number().min(0, "Funding cannot be negative").optional()),

  number_of_employees: z
    .union([z.number(), z.string()])
    .transform((val) => {
      if (val === "" || val === undefined || val === null) return undefined
      const num = typeof val === "string" ? Number(val) : val
      return isNaN(num) ? undefined : num
    })
    .pipe(z.number().int("Must be a whole number").min(1, "At least 1 employee").optional()),

  stage_at_death: z
    .string()
    .optional()
    .or(z.literal("")),

  death_cause: z
    .string()
    .optional()
    .or(z.literal("")),
})

export const nameSchema = z.object({
  name: z.string().min(1, "Startup name is required").max(200, "Startup name must be under 200 characters"),
})