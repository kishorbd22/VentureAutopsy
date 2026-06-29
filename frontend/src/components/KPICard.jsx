import React from 'react'

/**
 * KPI Card Component
 * Displays key performance indicators with icon, label, and value
 */
export default function KPICard({ 
  title, 
  value, 
  unit, 
  icon, 
  trend, 
  trendValue,
  color = 'blue' 
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  }

  const bgColor = colorClasses[color] || colorClasses.blue

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgColor} text-white p-3 rounded-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">
          {value}
          {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  )
}