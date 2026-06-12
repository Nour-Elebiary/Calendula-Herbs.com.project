import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Shield, User, KeyRound, MonitorSmartphone, Globe, Clock, AlertTriangle } from 'lucide-react'
import { revokeSession, revokeAllOtherSessions } from './actions'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/admin/login')

  const admin = await db.admin.findUnique({
    where: { id: session.user.id },
  })

  if (!admin) redirect('/admin/login')

  const currentTokenHash = (session.user as any).sessionId

  const activeSessions = await db.adminSession.findMany({
    where: { adminId: admin.id, revokedAt: null },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Profile & Security
        </h1>
        <p className="text-green-100/60">Manage your administrator account settings and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Personal Info</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-green-100/50 mb-1">Full Name</label>
              <div className="text-sm text-green-50">{admin.name}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-green-100/50 mb-1">Email Address</label>
              <div className="text-sm text-green-50">{admin.email}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-green-100/50 mb-1">Recovery Emails</label>
              <div className="text-sm text-green-50">{admin.recoveryEmails.join(', ') || 'None set'}</div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>
          
          <p className="text-sm text-green-100/70 mb-6">
            Your account is protected by strict rate limiting, lockout policies, and session validation.
          </p>
          
          <div className="mt-auto">
            <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Active Sessions</h2>
              <p className="text-xs text-green-100/50">Devices currently logged into your account.</p>
            </div>
          </div>
          
          {activeSessions.length > 1 && (
            <form action={async () => {
              'use server'
              await revokeAllOtherSessions(currentTokenHash)
            }}>
              <button 
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-sm font-medium text-red-400 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                That wasn't me! (Revoke Others)
              </button>
            </form>
          )}
        </div>

        <div className="space-y-3">
          {activeSessions.map(sess => {
            const isCurrent = sess.tokenHash === currentTokenHash
            return (
              <div key={sess.id} className={`flex items-center justify-between p-4 rounded-lg border ${isCurrent ? 'bg-green-500/5 border-green-500/20' : 'bg-black/20 border-white/5'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <MonitorSmartphone className={`w-5 h-5 ${isCurrent ? 'text-green-400' : 'text-green-100/40'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{sess.ip}</span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400">CURRENT</span>
                      )}
                    </div>
                    <div className="text-xs text-green-100/50 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Unknown Location</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Logged in: {new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(sess.createdAt)}</span>
                    </div>
                    <div className="text-[10px] text-green-100/30 mt-1 font-mono truncate max-w-sm" title={sess.userAgent || undefined}>
                      {sess.userAgent}
                    </div>
                  </div>
                </div>

                {!isCurrent && (
                  <form action={async () => {
                    'use server'
                    await revokeSession(sess.id)
                  }}>
                    <button type="submit" className="text-xs text-red-400 hover:text-red-300 font-medium px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors">
                      Revoke
                    </button>
                  </form>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
