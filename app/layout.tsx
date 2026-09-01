import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'RAVO — Explore Belém', description: 'Uma aventura de descoberta, cultura e exploração em Belém do Pará.', manifest: '/manifest.webmanifest' }
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#118ed0' }
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-BR"><body>{children}</body></html> }
