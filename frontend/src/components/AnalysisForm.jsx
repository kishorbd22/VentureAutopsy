import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { analysisFormSchema } from "../lib/schemas"
import { useIndustries } from "../hooks/useIndustries"
import { useDeathCauses } from "../hooks/useDeathCauses"
import { Button } from "./ui/button"
import {
  Building2,
  Globe,
  DollarSign,
  Users,
  FlaskConical,
  AlertTriangle,
  CalendarDays,
  Loader2,
  Sparkles,
} from "lucide-react"
import { cn } from "../lib/utils"

const stageOptions = [
  { value: "", label: "Select Stage" },
  { value: "Pre-Seed", label: "Pre-Seed" },
  { value: "Seed", label: "Seed" },
  { value: "Series A", label: "Series A" },
  { value: "Series B", label: "Series B" },
  { value: "Series C", label: "Series C" },
  { value: "Series D", label: "Series D" },
  { value: "Series E", label: "Series E+" },
]

function FormField({ label, required, error, children, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        {Icon && <Icon className="h-4 w-4 text-gray-400" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 flex items-center gap-1"
        >
          <AlertTriangle className="h-3 w-3" />
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default function AnalysisForm({ onSubmit, isPending }) {
  const { data: industries = [], isLoading: industriesLoading } = useIndustries()
  const { data: deathCauses = [], isLoading: causesLoading } = useDeathCauses()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(analysisFormSchema),
    defaultValues: {
      name: "",
      industry: "",
      country: "",
      total_funding_usd: "",
      number_of_employees: "",
      stage_at_death: "",
      death_cause: "",
    },
  })

  const industry = watch("industry")
  const funding = watch("total_funding_usd")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Startup Details</h3>
            <p className="text-sm text-gray-500">
              Fill in the details below to get a risk assessment
            </p>
          </div>
          {isDirty && (
            <button
              type="button"
              onClick={() => reset()}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Name & Industry Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Startup Name" icon={Building2} error={errors.name?.message}>
            <input
              {...register("name")}
              placeholder="e.g. Acme Inc"
              className="input"
            />
          </FormField>

          <FormField label="Industry" required icon={FlaskConical} error={errors.industry?.message}>
            <select
              {...register("industry")}
              className="input"
              disabled={industriesLoading}
            >
              <option value="">
                {industriesLoading ? "Loading industries..." : "Select Industry"}
              </option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Country & Stage Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Country" icon={Globe} error={errors.country?.message}>
            <input
              {...register("country")}
              placeholder="e.g. USA"
              className="input"
            />
          </FormField>

          <FormField label="Stage at Risk" icon={CalendarDays} error={errors.stage_at_death?.message}>
            <select {...register("stage_at_death")} className="input">
              {stageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Funding & Employees Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Total Funding (USD)" icon={DollarSign} error={errors.total_funding_usd?.message}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                {...register("total_funding_usd")}
                type="number"
                min="0"
                step="100000"
                placeholder="1,000,000"
                className="input pl-7"
              />
            </div>
          </FormField>

          <FormField label="Employees" icon={Users} error={errors.number_of_employees?.message}>
            <input
              {...register("number_of_employees")}
              type="number"
              min="1"
              placeholder="e.g. 50"
              className="input"
            />
          </FormField>
        </div>

        {/* Death Cause */}
        <FormField label="Primary Risk Factor" icon={AlertTriangle} error={errors.death_cause?.message}>
          <select
            {...register("death_cause")}
            className="input"
            disabled={causesLoading}
          >
            <option value="">
              {causesLoading ? "Loading risk factors..." : "Select Risk Factor"}
            </option>
            {deathCauses.map((cause) => (
              <option key={cause} value={cause}>{cause}</option>
            ))}
          </select>
        </FormField>

        {/* Selected Industry Badge */}
        {industry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 rounded-lg px-3 py-2"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            Analyzing against <strong className="text-blue-700">{industry}</strong> industry data
            {funding && (
              <>
                {" · "}Funding: <strong>${Number(funding).toLocaleString()}</strong>
              </>
            )}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={isPending || industriesLoading}
            className="w-full h-12 text-base font-semibold relative overflow-hidden group"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Analyze Startup
              </span>
            )}
            {/* Shimmer effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}