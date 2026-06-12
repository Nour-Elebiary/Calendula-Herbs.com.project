'use client'

import { Suspense, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Leaf, Loader2, LogIn, AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard'
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const isLoading = isSubmitting || isPending

  async function onSubmit(data: LoginForm) {
    setError(null)
    startTransition(async () => {
      try {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        })

        if (result?.error) {
          if (result.error === 'LOCKED') {
            setError('Account locked due to too many failed attempts. Please try again in 15 minutes.')
          } else {
            setError('Invalid email or password. Please try again.')
          }
          return
        }

        if (result?.ok) {
          router.push(callbackUrl)
          router.refresh()
        }
      } catch {
        setError('An unexpected error occurred. Please try again.')
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
          className="rounded-2xl p-8 shadow-2xl"
        >
          {/* Logo + title */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-400/30 flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-green-400" />
            </div>
            <h1
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Calendula Admin
            </h1>
            <p className="text-green-300/70 text-sm">Sign in to your dashboard</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex gap-3 items-start rounded-xl bg-red-500/10 border border-red-400/30 p-4">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-green-100/80 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@calendulaherbs.com"
                disabled={isLoading}
                {...register('email')}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: errors.email
                    ? '1px solid rgba(248,113,113,0.6)'
                    : '1px solid rgba(255,255,255,0.12)',
                  boxShadow: errors.email ? '0 0 0 3px rgba(248,113,113,0.15)' : 'none',
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.target.style.border = '1px solid rgba(74, 222, 128, 0.5)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)'
                  }
                }}
                onBlur={(e) => {
                  if (!errors.email) {
                    e.target.style.border = '1px solid rgba(255,255,255,0.12)'
                    e.target.style.boxShadow = 'none'
                  }
                }}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-green-100/80"
                >
                  Password
                </label>
                <a
                  href="/admin/forgot-password"
                  className="text-xs text-green-400 hover:text-green-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  {...register('password')}
                  className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-white/30 text-sm transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: errors.password
                      ? '1px solid rgba(248,113,113,0.6)'
                      : '1px solid rgba(255,255,255,0.12)',
                    boxShadow: errors.password ? '0 0 0 3px rgba(248,113,113,0.15)' : 'none',
                  }}
                  onFocus={(e) => {
                    if (!errors.password) {
                      e.target.style.border = '1px solid rgba(74, 222, 128, 0.5)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)'
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.password) {
                      e.target.style.border = '1px solid rgba(255,255,255,0.12)'
                      e.target.style.boxShadow = 'none'
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isLoading
                  ? 'rgba(21,128,61,0.6)'
                  : 'linear-gradient(135deg, #15803d, #166534)',
                boxShadow: '0 4px 20px rgba(21,128,61,0.4)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  ;(e.target as HTMLButtonElement).style.background =
                    'linear-gradient(135deg, #16a34a, #15803d)'
                  ;(e.target as HTMLButtonElement).style.transform = 'translateY(-1px)'
                  ;(e.target as HTMLButtonElement).style.boxShadow =
                    '0 6px 24px rgba(21,128,61,0.5)'
                }
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, #15803d, #166534)'
                ;(e.target as HTMLButtonElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLButtonElement).style.boxShadow =
                  '0 4px 20px rgba(21,128,61,0.4)'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-white/30">
            Calendula Herbs For Import &amp; Export
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-400" />
      </div>
    }>
      <LoginFormInner />
    </Suspense>
  )
}
