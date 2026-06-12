'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from './CartProvider'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Galleries', href: '/galleries' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Contact', href: '/contact' },
]

export function Header({ siteName = 'Calendula Herbs' }: { siteName?: string }) {
  const pathname = usePathname()
  const { items, setIsCartOpen } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const prevPathname = useRef(pathname)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setIsMobileMenuOpen(false)
      prevPathname.current = pathname
    }
  }, [pathname])

  const cartItemCount = items.length

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <div className={`flex items-center justify-center rounded-full w-10 h-10 ${isScrolled ? 'bg-primary text-white' : 'bg-primary text-white'}`}>
              <Leaf className="w-5 h-5" />
            </div>
            <span className={`font-heading text-xl font-bold tracking-tight ${isScrolled ? 'text-neutral-900' : 'text-neutral-900 md:text-white lg:text-neutral-900'} transition-colors`}>
              {siteName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-primary' 
                      : isScrolled ? 'text-neutral-600 hover:text-black' : 'text-neutral-600 hover:text-black md:text-white/80 md:hover:text-white lg:text-neutral-600 lg:hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-full transition-colors ${
                isScrolled ? 'text-neutral-600 hover:bg-neutral-100' : 'text-neutral-600 md:text-white hover:bg-black/10 lg:text-neutral-600 lg:hover:bg-neutral-100'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                  {cartItemCount}
                </span>
              )}
            </button>
            <Button asChild className="rounded-full px-6">
              <Link href="/products">Get a Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden z-50">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-900"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-neutral-900"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-24 pb-8 px-6">
          <nav className="flex flex-col gap-6 text-xl font-heading mb-auto">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={pathname === link.href ? 'text-primary font-semibold' : 'text-neutral-600'}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-8 border-t">
            <Button asChild className="w-full text-lg h-14 rounded-xl">
              <Link href="/products">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
