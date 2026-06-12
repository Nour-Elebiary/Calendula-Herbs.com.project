'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const STORAGE_KEY = 'calendula_cookie_consent'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
      <div className="max-w-4xl mx-auto card-glass p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <div className="flex-1">
          <p className="text-sm text-[var(--color-text-primary)]">
            This site uses cookies for analytics and essential functionality.{' '}
            <a href="/privacy" className="text-[var(--color-green-600)] underline hover:no-underline">Privacy Policy</a>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={decline} className="btn btn-secondary btn-sm">
            Decline
          </button>
          <button onClick={accept} className="btn btn-primary btn-sm">
            Accept
          </button>
          <button onClick={decline} className="p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
