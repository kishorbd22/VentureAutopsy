import React from 'react'

/**
 * Risk Factor Card Component
 * Displays individual risk factors with severity indicator
 */
export default function RiskFactorCard({ factor, index }) {
  const severityConfig = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: '🔴',
      text: 'text-red-900',
      label: 'Critical'
    },
    high: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: '🟠',
      text: 'text-orange-900',
      label: 'High'
    },
    medium: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: '🟡',
      text: 'text-yellow-900',
      label: 'Medium'
    },
    low: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: '🔵',
      text: 'text-blue-900',
      label: 'Low'
    }
  }

  const config = severityConfig[factor.severity] || severityConfig.medium

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{config.icon}</div>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h4 className={`font-semibold ${config.text}`}>{factor.factor}</h4>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bg} ${config.text} border`}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{factor.description}</p>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-600">Impact:</div>
            <div className="flex-grow bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  factor.severity === 'critical' ? 'bg-red-500' :
                  factor.severity === 'high' ? 'bg-orange-500' :
                  factor.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${factor.weight}%` }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-gray-700">{factor.weight} pts</span>
          </div>
        </div>
      </div>
    </div>
  )
}