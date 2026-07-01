import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  )
}