import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { 
  Users, 
  ShoppingBag, 
  Eye, 
  TrendingUp, 
  AlertCircle,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user?.email) redirect('/admin/login')

  const admin = await db.admin.findUnique({
    where: { email: session.user.email },
  })

  if (!admin) redirect('/admin/login')

  // Format last login time
  const lastLoginFormatted = admin.lastLoginAt 
    ? new Intl.DateTimeFormat('en-US', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      }).format(admin.lastLoginAt)
    : 'Unknown'

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Welcome back, {admin.name.split(' ')[0]}
        </h1>
        <p className="text-green-100/60">Here's what's happening with Calendula Herbs today.</p>
      </div>

      {/* Security Banner */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-50">Last Login Information</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-green-100/60">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lastLoginFormatted}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {admin.lastLoginCountry || 'Unknown Location'} ({admin.lastLoginIp || 'Unknown IP'})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value="24"
          change="+3 this month"
          icon={ShoppingBag}
        />
        <StatCard
          title="Active Sessions"
          value="1"
          change="Secure"
          icon={Users}
        />
        <StatCard
          title="Site Visitors"
          value="1,240"
          change="+12% from last week"
          icon={Eye}
        />
        <StatCard
          title="Conversion Rate"
          value="4.2%"
          change="+0.8% from last week"
          icon={TrendingUp}
          highlight
        />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-96 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4">Traffic Overview</h2>
            <div className="flex-1 flex items-center justify-center text-green-100/40 border-2 border-dashed border-white/10 rounded-lg">
              Chart Integration Pending
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-96 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4">System Alerts</h2>
            <div className="flex-1 space-y-4">
              <div className="flex gap-3 items-start p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-50">Upload missing certificates</p>
                  <p className="text-xs text-yellow-100/60 mt-1">2 organic certificates are expiring soon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon,
  highlight = false 
}: { 
  title: string
  value: string | number
  change: string
  icon: React.ElementType
  highlight?: boolean
}) {
  return (
    <div className={`p-6 rounded-xl border ${
      highlight 
        ? 'bg-gradient-to-br from-green-900/40 to-green-800/20 border-green-500/30' 
        : 'bg-white/5 border-white/10'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-green-100/70">{title}</h3>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          highlight ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-green-100/50'
        }`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-green-100/50">{change}</div>
      </div>
    </div>
  )
}
