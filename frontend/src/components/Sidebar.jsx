import { Link, useLocation } from "react-router-dom"
import { cn } from "../lib/utils"
import {
  LayoutDashboard,
  Skull,
  Search,
  BarChart3,
  Users,
  FileText,
  Menu,
  X,
  GitCompare,
  Clock,
  User,
} from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"

const sidebarItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/startups", label: "Graveyard", icon: Skull },
  { path: "/analyze", label: "Autopsy", icon: Search },
  { path: "/analytics", label: "Intelligence", icon: BarChart3 },
  { path: "/compare", label: "Compare", icon: GitCompare },
  { path: "/history", label: "History", icon: Clock },
  { path: "/users", label: "Users", icon: Users },
  { path: "/report", label: "Reports", icon: FileText },
  { path: "/profile", label: "Profile", icon: User },
]

export default function Sidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-dark-100 transition-transform duration-300 md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-gray-700/50 px-6">
          <span className="text-2xl">🔬</span>
          <div>
            <h1 className="text-lg font-bold text-white">Venture Autopsy</h1>
            <p className="text-xs text-gray-400">Failure Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-600/10 text-primary-400"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700/50 px-6 py-4">
          <p className="text-xs text-gray-500">v1.0.0</p>
        </div>
      </aside>
    </>
  )
}