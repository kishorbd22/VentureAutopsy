import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import api from '../services/api'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [industryData, setIndustryData] = useState([])
  const [fundingData, setFundingData] = useState([])
  const [deathCauseData, setDeathCauseData] = useState([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Mock data - in production, this would come from the API
      setIndustryData([
        { name: 'FinTech', count: 45 },
        { name: 'HealthTech', count: 38 },
        { name: 'EdTech', count: 32 },
        { name: 'E-commerce', count: 28 },
        { name: 'SaaS', count: 25 },
        { name: 'AI/ML', count: 22 },
      ])
      
      setFundingData([
        { name: 'Seed', amount: 12000000 },
        { name: 'Series A', amount: 45000000 },
        { name: 'Series B', amount: 89000000 },
        { name: 'Series C', amount: 156000000 },
        { name: 'Unknown', amount: 34000000 },
      ])
      
      setDeathCauseData([
        { name: 'Cash Flow', value: 35 },
        { name: 'Market Fit', value: 25 },
        { name: 'Competition', value: 20 },
        { name: 'Team Issues', value: 12 },
        { name: 'Other', value: 8 },
      ])
      
      setError(null)
    } catch (err) {
      setError('Failed to fetch analytics data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-gray-600 text-sm mb-2">Total Startups</h3>
          <div className="text-3xl font-bold text-primary-600">1,247</div>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm mb-2">Total Funding</h3>
          <div className="text-3xl font-bold text-primary-600">$3.45B</div>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm mb-2">Avg. Lifespan</h3>
          <div className="text-3xl font-bold text-primary-600">4.2 yrs</div>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm mb-2">Success Rate</h3>
          <div className="text-3xl font-bold text-primary-600">12.5%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Startups by Industry</h2>
          <BarChart width={500} height={300} data={industryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Funding by Stage</h2>
          <LineChart width={500} height={300} data={fundingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
          </LineChart>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Startups Over Time</h2>
          <LineChart width={500} height={300} data={[
            { year: '2014', count: 45 },
            { year: '2015', count: 67 },
            { year: '2016', count: 89 },
            { year: '2017', count: 112 },
            { year: '2018', count: 134 },
            { year: '2019', count: 156 },
            { year: '2020', count: 178 },
            { year: '2021', count: 198 },
            { year: '2022', count: 187 },
            { year: '2023', count: 165 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Death Causes Distribution</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={deathCauseData}
              cx={250}
              cy={150}
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {deathCauseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  )
}