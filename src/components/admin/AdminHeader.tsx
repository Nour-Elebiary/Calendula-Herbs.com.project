'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bell, Search, User, ChevronRight } from 'lucide-react'

const breadcrumbLabels: Record<string, string> = {
  'dashboard': 'Dashboard',
  'products': 'Products',
  'media': 'Media Library',
  'galleries': 'Galleries',
  'certificates': 'Certificates',
  'team': 'Team & Board',
  'inquiries': 'Inquiries',
  'settings': 'Site Settings',
  'profile': 'Profile',
}

export function AdminHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const segments = pathname
    .replace('/admin/dashboard', '')
    .split('/')
    .filter(Boolean)

  return (
    <header className="h-16 bg-[#060a08]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-20 px-8 flex items-center justify-between">
      {/* Breadcrumbs */}
      <div className="flex-1 max-w-md">
        <nav className="flex items-center gap-1.5 text-xs">
          <Link href="/admin/dashboard" className="text-white/40 hover:text-gold transition-colors">
            Admin
          </Link>
          {segments.map((seg, i) => {
            const label = breadcrumbLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)
            const href = segments.length > 1
              ? `/admin/dashboard/${segments.slice(0, i + 1).join('/')}`
              : undefined
            const isLast = i === segments.length - 1
            return (
              <span key={seg} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-white/20" />
                {href && !isLast ? (
                  <Link href={href} className="text-white/40 hover:text-gold transition-colors">
                    {label}
                  </Link>
                ) : (
                  <span className={`${isLast ? 'text-white/80 font-medium' : 'text-white/40'}`}>
                    {label}
                  </span>
                )}
              </span>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-6 ml-4">
        <button className="relative text-white/50 hover:text-gold transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(201,150,58,0.6)]" />
        </button>

        <Link
          href="/admin/dashboard/profile"
          className="flex items-center gap-3 pl-6 border-l border-white/10 hover:opacity-80 transition-opacity"
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white/80 leading-none mb-1">
              {session?.user?.name || 'Admin'}
            </p>
            <p className="text-xs text-white/40 leading-none">
              {session?.user?.email}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/60 to-gold/20 flex items-center justify-center text-forest-dark border border-gold/30">
            <User className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </header>
  )
}
