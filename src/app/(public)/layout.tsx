import React from 'react'
import { db } from '@/lib/db'
import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { CartProvider } from '@/components/public/CartProvider'
import { CartDrawer } from '@/components/public/CartDrawer'
import { CookieConsent } from '@/components/public/CookieConsent'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Fetch settings and plugins
  const [siteSettings, contactSetting, activePlugins] = await Promise.all([
    db.siteSetting.findMany(),
    db.contactSetting.findUnique({ where: { id: 'main' } }),
    db.plugin.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } })
  ])

  // Convert siteSettings array to object
  const settings: Record<string, string> = {}
  siteSettings.forEach(s => { settings[s.key] = s.value })

  // Categorize plugins
  const plugins = {
    head: activePlugins.filter(p => p.position === 'HEAD'),
    bodyEnd: activePlugins.filter(p => p.position === 'BODY_END'),
    footerFixed: activePlugins.filter(p => p.position === 'FOOTER_FIXED'),
    chatWidget: activePlugins.filter(p => p.position === 'CHAT_WIDGET'),
  }

  return (
    <>
      {plugins.head.map(p => (
        <div key={p.id} dangerouslySetInnerHTML={{ __html: p.code }} />
      ))}
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header siteName={settings.site_name} />
          
          <main className="flex-1 w-full pt-20 lg:pt-0">
            {children}
          </main>

          <Footer settings={settings} contact={contactSetting} />
          
          <CartDrawer />
          
          <CookieConsent />
          
          {/* Fixed plugins and chat widgets */}
          {plugins.footerFixed.map(p => (
            <div key={p.id} dangerouslySetInnerHTML={{ __html: p.code }} />
          ))}
          {plugins.chatWidget.map(p => (
            <div key={p.id} dangerouslySetInnerHTML={{ __html: p.code }} />
          ))}
        </div>
      </CartProvider>
      {plugins.bodyEnd.map(p => (
        <div key={p.id} dangerouslySetInnerHTML={{ __html: p.code }} />
      ))}
    </>
  )
}
