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
  FolderOpen
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
  { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { name: 'Galleries', href: '/admin/gallery', icon: FolderOpen },
  { name: 'Certificates', href: '/admin/certificates', icon: Award },
  { name: 'Team & Board', href: '/admin/team', icon: Users },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-[#0a0f0d] border-r border-green-900/30 text-green-50 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-400/30 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-green-400" />
        </div>
        <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
          Calendula
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-green-500/10 text-green-400 font-medium'
                  : 'text-green-100/70 hover:bg-white/5 hover:text-green-100'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-green-400' : 'text-green-100/50'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-green-900/30">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
