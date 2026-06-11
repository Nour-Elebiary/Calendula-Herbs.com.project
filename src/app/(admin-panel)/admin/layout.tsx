import { SessionProvider } from 'next-auth/react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden bg-[#0a0f0d] text-green-50">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-8 relative">
            {/* Background ambient glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-500/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            </div>
            
            <div className="max-w-6xl mx-auto relative z-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
