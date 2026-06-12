'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Settings, 
  Users, 
  ShoppingBag,
  Award,
  LogOut,
  Leaf,
  FolderOpen,
  Inbox
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/dashboard/products', icon: ShoppingBag },
  { name: 'Media Library', href: '/admin/dashboard/media', icon: ImageIcon },
  { name: 'Galleries', href: '/admin/dashboard/galleries', icon: FolderOpen },
  { name: 'Certificates', href: '/admin/dashboard/certificates', icon: Award },
  { name: 'Team & Board', href: '/admin/dashboard/team', icon: Users },
  { name: 'Inquiries', href: '/admin/dashboard/inquiries', icon: Inbox },
  { name: 'Site Settings', href: '/admin/dashboard/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-[#060a08] border-r border-white/5 text-green-50 h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center shadow-[0_0_16px_rgba(201,150,58,0.08)]">
          <Leaf className="w-5 h-5 text-gold" />
        </div>
        <span className="font-heading text-lg font-bold text-white tracking-tight">
          Calendula
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative ${
                isActive
                  ? 'bg-gold/10 text-gold font-medium'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.03]'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold rounded-full" />
              )}
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-gold' : 'text-white/40'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
