import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { 
  Users, 
  ShoppingBag, 
  MessageSquare,
  TrendingUp, 
  AlertCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Mail
} from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user?.email) redirect('/admin/login')

  const admin = await db.admin.findUnique({
    where: { email: session.user.email },
  })

  if (!admin) redirect('/admin/login')

  const lastLoginFormatted = admin.lastLoginAt 
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(admin.lastLoginAt)
    : 'Unknown'

  const [productCount, activeSessions, unreadContact, unreadCart, unreadSamples] = await Promise.all([
    db.product.count({ where: { isActive: true } }),
    db.adminSession.count({ where: { revokedAt: null, expiresAt: { gt: new Date() } } }),
    db.contactSubmission.count({ where: { isRead: false } }),
    db.cartInquiry.count({ where: { isRead: false } }),
    db.sampleRequest.count({ where: { isRead: false } }),
  ])

  const totalInquiries = unreadContact + unreadCart + unreadSamples
  const inquiryRate = productCount > 0 ? ((totalInquiries / productCount) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Welcome back, {admin.name.split(' ')[0]}
        </h1>
        <p className="text-green-100/60">Here's what's happening with Calendula Herbs today.</p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Products"
          value={productCount}
          icon={ShoppingBag}
        />
        <StatCard
          title="Active Sessions"
          value={activeSessions}
          icon={Users}
        />
        <StatCard
          title="Unread Inquiries"
          value={totalInquiries}
          icon={Mail}
          highlight={totalInquiries > 0}
        />
        <StatCard
          title="Inquiry Rate"
          value={`${inquiryRate}%`}
          icon={TrendingUp}
          highlight
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Inquiries</h2>
            {totalInquiries > 0 ? (
              <div className="space-y-3">
                {unreadContact > 0 && (
                  <div className="flex gap-3 items-start p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <MessageSquare className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-50">{unreadContact} new contact message{unreadContact > 1 ? 's' : ''}</p>
                      <p className="text-xs text-blue-100/60 mt-1">Awaiting your response</p>
                    </div>
                  </div>
                )}
                {unreadCart > 0 && (
                  <div className="flex gap-3 items-start p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <ShoppingBag className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-50">{unreadCart} new cart quote{unreadCart > 1 ? 's' : ''}</p>
                      <p className="text-xs text-amber-100/60 mt-1">Product inquiry from potential buyer</p>
                    </div>
                  </div>
                )}
                {unreadSamples > 0 && (
                  <div className="flex gap-3 items-start p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <TrendingUp className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-50">{unreadSamples} new sample request{unreadSamples > 1 ? 's' : ''}</p>
                      <p className="text-xs text-purple-100/60 mt-1">Quality evaluation request</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-green-100/40 border-2 border-dashed border-white/10 rounded-lg min-h-[200px]">
                No inquiries yet
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-96 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="flex-1 space-y-4">
              {productCount === 0 && (
                <div className="flex gap-3 items-start p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-50">No products yet</p>
                    <p className="text-xs text-yellow-100/60 mt-1">Add your first product to start receiving inquiries.</p>
                  </div>
                </div>
              )}
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
  icon: Icon,
  highlight = false 
}: { 
  title: string
  value: string | number
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
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
    </div>
  )
}
