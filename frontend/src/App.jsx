import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import Startups from './pages/Startups'
import StartupDetail from './pages/StartupDetail'
import Users from './pages/Users'
import Analytics from './pages/Analytics'
import AnalyzeStartup from './pages/AnalyzeStartup'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/startups" element={<Startups />} />
          <Route path="/startups/:id" element={<StartupDetail />} />
          <Route path="/users" element={<Users />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analyze" element={<AnalyzeStartup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App