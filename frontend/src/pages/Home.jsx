import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl text-white">
        <h1 className="text-5xl font-bold mb-4">
          🪦 Startup Graveyard Analyzer
        </h1>
        <p className="text-xl mb-8 text-primary-100">
          Learn from failures. Build better futures.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/startups" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors">
            Explore Startups
          </Link>
          <Link to="/analytics" className="bg-primary-800 hover:bg-primary-900 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            View Analytics
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Data Analysis</h3>
          <p className="text-gray-600">
            Comprehensive analysis of startup failures with detailed metrics and trends.
          </p>
        </div>
        
        <div className="card">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
          <p className="text-gray-600">
            Advanced filtering and search capabilities to find exactly what you need.
          </p>
        </div>
        
        <div className="card">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
          <p className="text-gray-600">
            Powered by Gemini AI to provide intelligent insights and predictions.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">1,000+</div>
          <div className="text-gray-600">Startups Analyzed</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">50+</div>
          <div className="text-gray-600">Industries Covered</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">$50B+</div>
          <div className="text-gray-600">Total Funding Tracked</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600">10+</div>
          <div className="text-gray-600">Years of Data</div>
        </div>
      </div>
    </div>
  )
}