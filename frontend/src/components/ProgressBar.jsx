import React from 'react'

/**
 * Progress Bar Component
 * Animated progress bar with customizable color and label
 */
export default function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  color = 'blue',
  height = 'md',
  showValue = true 
}) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500'
  }

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const barColor = colorClasses[color] || colorClasses.blue
  const barHeight = heightClasses[height] || heightClasses.md

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && (
            <span className="text-sm font-semibold text-gray-900">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${barHeight}`}>
        <div
          className={`${barColor} ${barHeight} rounded-full transition-all duration-1000 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}