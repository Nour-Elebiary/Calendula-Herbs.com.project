'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, Leaf } from 'lucide-react'
import { useCart } from './CartProvider'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Contact', href: '/contact' },
]

export function Header({ siteName = 'Calendula Herbs' }: { siteName?: string }) {
  const pathname = usePathname()
  const { items, setIsCartOpen } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setIsMobileMenuOpen(false)
      prevPathname.current = pathname
    }
  }, [pathname])

  const cartItemCount = items.length

  return (
    <header
      className={`nav-primary ${isScrolled ? 'is-scrolled' : ''}`}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 z-50 nav-logo flex-shrink-0">
          <div className="flex items-center justify-center rounded-full w-10 h-10 flex-shrink-0" style={{ background: 'var(--color-green-100)' }}>
            <Leaf className="w-5 h-5" style={{ color: 'var(--color-green-600)' }} />
          </div>
          <span className="font-display text-xl sm:text-2xl font-medium tracking-tight hidden sm:inline" style={{ color: 'var(--color-text-primary)' }}>
            {siteName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 nav-links">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 400,
                  letterSpacing: 'var(--tracking-wide)',
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'color 120ms var(--ease-smooth)',
                  padding: '8px 0'
                }}
                className="nav-link"
              >
                {link.label}
                {isActive && (
                  <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'var(--color-green-600)', borderRadius: '1px' }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn-icon relative"
            aria-label="Quote cart"
            title="Open quote cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 20, height: 20,
                background: 'var(--color-calendula-500)',
                color: '#FAFAF6',
                fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '9999px',
                border: '2px solid var(--color-bg-void)'
              }}>
                {cartItemCount}
              </span>
            )}
          </button>
          <Link
            href="/contact"
            className="btn btn-primary text-sm"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden z-50">
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn-icon relative"
            aria-label="Quote cart"
            title="Open quote cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 20, height: 20,
                background: 'var(--color-calendula-500)',
                color: '#FAFAF6',
                fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '9999px',
                border: '2px solid var(--color-bg-void)'
              }}>
                {cartItemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn-icon"
            aria-label="Toggle menu"
            title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" style={{ color: 'var(--color-text-primary)' }} /> : <Menu className="w-5 h-5" style={{ color: 'var(--color-text-primary)' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'var(--color-bg-void)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
            className="md:hidden"
          >
            <div className="flex flex-col h-full pt-20 pb-8 px-6" style={{ marginTop: '64px' }}>
              <nav className="flex flex-col gap-6 mb-auto">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(var(--text-xl), 5vw, var(--text-3xl))',
                        fontWeight: 500,
                        letterSpacing: 'var(--tracking-tight)',
                        color: pathname === link.href ? 'var(--color-green-600)' : 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        transition: 'color 120ms'
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ paddingTop: 'var(--space-8)', borderTop: '1px solid var(--color-border-subtle)' }}
              >
                <Link
                  href="/contact"
                  className="btn btn-primary btn-lg w-full justify-center text-base"
                >
                  Get a Quote
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
