import type { Metadata, Viewport } from 'next'
import { Manrope, Syne } from 'next/font/google'
import './globals.css'
const manrope=Manrope({subsets:['latin'],variable:'--font-manrope'})
const syne=Syne({subsets:['latin'],variable:'--font-syne'})
export const metadata:Metadata={title:'RAVO — Os Segredos da Cidade',description:'Explore Belém, descubra histórias e viva a cidade.',manifest:'/manifest.webmanifest'}
export const viewport:Viewport={themeColor:'#071511',width:'device-width',initialScale:1,maximumScale:1}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body className={`${manrope.variable} ${syne.variable}`}>{children}</body></html>}
