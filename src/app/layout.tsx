import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ),
  title: {
    template: '%s | Calendula Herbs',
    default: 'Calendula Herbs For Import & Export — Premium Organic Herbs from Egypt',
  },
  description:
    'Premium organic herbs, spices & seeds from Egypt. Certified organic, global export. Calendula, chamomile, hibiscus, moringa and more.',
  keywords: [
    'organic herbs Egypt',
    'herb export',
    'calendula herb',
    'chamomile Egypt',
    'organic spices',
    'herb import export',
  ],
  authors: [{ name: 'Calendula Herbs For Import & Export' }],
  creator: 'Calendula Herbs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Calendula Herbs',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full scroll-smooth`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2d7a3a" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
