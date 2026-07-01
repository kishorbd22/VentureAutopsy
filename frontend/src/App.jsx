import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import Startups from './pages/Startups'
import StartupDetail from './pages/StartupDetail'
import Users from './pages/Users'
import Analytics from './pages/Analytics'
import AnalyzeStartup from './pages/AnalyzeStartup'
import AnalysisReport from './pages/AnalysisReport'
import Compare from './pages/Compare'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminStartups from './pages/admin/AdminStartups'
import AdminImport from './pages/admin/AdminImport'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminSettings from './pages/admin/AdminSettings'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Landing />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected app routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/startups" element={<Startups />} />
                  <Route path="/startups/:id" element={<StartupDetail />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/analyze" element={<AnalyzeStartup />} />
                  <Route path="/report" element={<AnalysisReport />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Home />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="startups" element={<AdminStartups />} />
                    <Route path="import" element={<AdminImport />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App