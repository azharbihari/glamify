import './globals.css'
import AuthProvider from '@/contexts/AuthContext'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Glamify',
  description: 'Your Beauty, Your Schedule: Effortless Salon Appointments Made Simple!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="">
        <AuthProvider>
          <Header></Header>
          {children}
          <Footer></Footer>
        </AuthProvider>
      </body>
    </html>
  )
}
