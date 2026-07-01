import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Building2,
  Upload,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { useState } from "react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Building2, label: "Startups", path: "/admin/startups" },
  { icon: Upload, label: "Import CSV", path: "/admin/import" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
]

export default function AdminSidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "bg-gray-900 text-white transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!collapsed && (
          <span className="text-xl font-bold">Admin Panel</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-800"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-gray-800 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Back to Site</span>}
        </Link>
      </div>
    </div>
  )
}