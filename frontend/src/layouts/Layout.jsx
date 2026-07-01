import { useState } from "react"
import { Outlet } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import { TooltipProvider } from "../components/ui/tooltip"

const pageTransition = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
  transition: { duration: 0.3, ease: "easeOut" }
}

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-dark-950">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />

        {/* Main content area */}
        <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {/* Top Navigation Bar */}
          <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageTransition}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
