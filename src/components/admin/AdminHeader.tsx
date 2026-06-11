'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Bell, Search, User } from 'lucide-react'

export function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="h-16 bg-[#0a0f0d]/80 backdrop-blur-md border-b border-green-900/30 sticky top-0 z-20 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/40" />
          <input
            type="text"
            placeholder="Search admin panel..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-green-900/30 text-sm text-green-50 placeholder-green-100/40 focus:outline-none focus:border-green-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-4">
        <button className="relative text-green-100/70 hover:text-green-400 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
        </button>

        <Link
          href="/admin/dashboard/profile"
          className="flex items-center gap-3 pl-6 border-l border-green-900/30 hover:opacity-80 transition-opacity"
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-green-50 leading-none mb-1">
              {session?.user?.name || 'Admin'}
            </p>
            <p className="text-xs text-green-100/50 leading-none">
              {session?.user?.email}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-600 to-green-400 flex items-center justify-center text-white border border-green-400/30 shadow-inner">
            <User className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </header>
  )
}
