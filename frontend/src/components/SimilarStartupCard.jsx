import React from 'react'

/**
 * Similar Startup Card Component
 * Displays information about similar failed startups
 */
export default function SimilarStartupCard({ startup, index }) {
  const getSeverityBadge = (score) => {
    if (score >= 6) return { label: 'High Match', color: 'bg-red-100 text-red-800 border-red-200' }
    if (score >= 4) return { label: 'Medium Match', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    return { label: 'Low Match', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
  }

  const badge = getSeverityBadge(startup.similarity_score)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-primary-300 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-grow">
          <h4 className="text-lg font-bold text-gray-900 mb-1">{startup.name}</h4>
          <p className="text-sm text-gray-600">{startup.industry} • {startup.sub_industry}</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 min-w-[100px]">Failure Reason:</span>
          <span className="font-medium text-red-700">{startup.death_cause || 'N/A'}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 min-w-[100px]">Lifespan:</span>
          <span className="font-medium text-gray-900">
            {startup.lifespan_days ? `${startup.lifespan_days.toLocaleString()} days` : 'N/A'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 min-w-[100px]">Total Funding:</span>
          <span className="font-medium text-gray-900">
            ${startup.total_funding_usd ? (startup.total_funding_usd / 1000000).toFixed(1) + 'M' : 'N/A'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 min-w-[100px]">Stage at Death:</span>
          <span className="font-medium text-gray-900">{startup.stage_at_death || 'N/A'}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 min-w-[100px]">Employees:</span>
          <span className="font-medium text-gray-900">
            {startup.number_of_employees ? startup.number_of_employees.toLocaleString() : 'N/A'}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-600 mb-2">Similarity Score</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
              style={{ width: `${(startup.similarity_score / 9) * 100}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-gray-600 mt-1">
            {startup.similarity_score}/9 matches
          </div>
        </div>
      </div>
    </div>
  )
}