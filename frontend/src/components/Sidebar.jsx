import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../lib/utils"
import {
  LayoutDashboard,
  Skull,
  Search,
  BarChart3,
  Users,
  FileText,
  GitCompare,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Activity,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

const mainItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/startups", label: "Startup Graveyard", icon: Skull },
  { path: "/analyze", label: "AI Autopsy", icon: Search },
]

const analyticsItems = [
  { path: "/analytics", label: "Intelligence", icon: BarChart3 },
  { path: "/compare", label: "Compare", icon: GitCompare },
  { path: "/history", label: "History", icon: Clock },
]

const managementItems = [
  { path: "/users", label: "Users", icon: Users },
  { path: "/report", label: "Reports", icon: FileText },
  { path: "/profile", label: "Profile", icon: User },
]

const sidebarGroups = [
  { label: "Main", items: mainItems },
  { label: "Analytics", items: analyticsItems },
  { label: "Management", items: managementItems },
]

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const SidebarContent = ({ isCollapsed }) => (
    <>
      {/* Logo */}
      <div className="sidebar-header">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center flex-shrink-0">
            <Skull className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-sm font-bold text-white leading-tight">Venture</h1>
                <p className="text-[10px] text-accent-400 font-medium">Autopsy</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Collapse toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-elevation-3 border border-dark-700 flex items-center justify-center text-surface-400 hover:text-white transition-all z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-4 space-y-6">
        {sidebarGroups.map((group) => (
          <div key={group.label}>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[10px] font-semibold text-surface-500 uppercase tracking-widest px-3 mb-2"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "sidebar-nav-item relative group",
                      active && "sidebar-nav-item-active",
                      isCollapsed && "justify-center px-0"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="relative flex-shrink-0">
                      <Icon className={cn("w-5 h-5", active && "text-accent-400")} />
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-accent-500"
                        />
                      )}
                    </div>
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-sm"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {active && !isCollapsed && (
                      <motion.div
                        layoutId="activeBg"
                        className="absolute inset-0 bg-accent-500/10 rounded-xl -z-10"
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* AI Badge */}
      <div className={cn("px-3 pb-4", isCollapsed && "px-2")}>
        <div className={cn(
          "rounded-xl bg-gradient-subtle border border-accent-500/10 p-3",
          isCollapsed && "p-2 flex justify-center"
        )}>
          {isCollapsed ? (
            <Sparkles className="w-5 h-5 text-accent-400" />
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-accent-300">AI Powered</p>
                <p className="text-[10px] text-surface-500">v2.0 Intelligence</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-3 left-3 z-50 md:hidden p-2 rounded-xl bg-elevation-2 border border-dark-700 text-surface-400"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-elevation-1 border-r border-dark-800 transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent isCollapsed={collapsed} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-elevation-1 border-r border-dark-800 md:hidden"
          >
            <SidebarContent isCollapsed={false} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}