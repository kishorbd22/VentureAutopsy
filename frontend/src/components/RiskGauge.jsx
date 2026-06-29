import React from 'react'

/**
 * Risk Gauge Component
 * Circular gauge showing risk score from 0-100
 */
export default function RiskGauge({ score, level, size = 200 }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeWidth = 12
  const center = size / 2
  
  // Calculate the stroke dash offset based on score (0-100)
  const offset = circumference - (score / 100) * circumference
  
  // Determine color based on risk level
  const getColor = (level) => {
    switch (level) {
      case 'Critical': return '#dc2626' // red-600
      case 'High': return '#f97316' // orange-500
      case 'Medium': return '#eab308' // yellow-500
      case 'Low': return '#22c55e' // green-500
      default: return '#6b7280' // gray-500
    }
  }

  const color = getColor(level)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-1">{score}</div>
          <div className="text-sm font-medium text-gray-600">Risk Score</div>
          <div 
            className="text-lg font-semibold px-3 py-1 rounded-full mt-2 inline-block"
            style={{ 
              backgroundColor: `${color}20`,
              color: color 
            }}
          >
            {level}
          </div>
        </div>
      </div>
    </div>
  )
}