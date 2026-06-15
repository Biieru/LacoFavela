import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(v => !v)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(v => !v)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
