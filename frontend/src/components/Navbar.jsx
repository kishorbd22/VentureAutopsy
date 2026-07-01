import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Command,
} from "lucide-react"
import { Button } from "./ui/button"

function Navbar({ onMenuClick }) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const user = { name: "Analyst", email: "analyst@ventureautopsy.com", role: "Analyst" }
  const logout = () => {}

  return (
    <header className="navbar flex items-center justify-between px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-dark-800 transition-all duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="hidden md:flex relative">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
            searchFocused 
              ? 'bg-dark-800 border-accent-500/50 w-80' 
              : 'bg-dark-800/50 border-dark-700 w-60'
          }`}>
            <Search className="w-4 h-4 text-surface-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search startups, reports..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent text-sm text-surface-200 placeholder-surface-500 outline-none flex-1"
            />
            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-surface-500 bg-dark-700 rounded">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Help */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-surface-400 hover:text-white"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-surface-400 hover:text-white relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-4 h-4" />
            <span className="notification-dot" />
          </Button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-full mt-2 w-80 bg-elevation-2 border border-dark-700/50 rounded-2xl shadow-dark-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-dark-700/50">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                </div>
                <div className="p-4 text-center text-sm text-surface-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-surface-600" />
                  <p>No new notifications</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <Link to="/profile">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-surface-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-dark-700 mx-1" />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-dark-800 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-white leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-surface-500">{user?.role || 'Analyst'}</p>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-full mt-2 w-56 bg-elevation-2 border border-dark-700/50 rounded-2xl shadow-dark-2xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-dark-700/50">
                  <p className="text-sm font-medium text-white truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="p-1.5">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-surface-300 hover:text-white hover:bg-dark-800 transition-all"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-surface-300 hover:text-white hover:bg-dark-800 transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </div>
                <div className="border-t border-dark-700/50 p-1.5">
                  <button
                    onClick={() => { logout?.(); setShowUserMenu(false) }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-danger-400 hover:text-danger-300 hover:bg-danger-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Navbar