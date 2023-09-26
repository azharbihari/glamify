import AuthProvider from '@/contexts/AuthContext'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Central hub for managing salon appointments and customer information efficiently.',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-100 px-4 py-6">
      <div className="container mx-auto">
        <div className="text-blue-600">
          <h2 className="text-2xl font-semibold">Welcome to Dashboard! </h2>
          <p>Welcome to your salon appointment management dashboard. Here, you can track appointments, manage customers, and more.</p>
        </div>

        <div className="grid grid-cols-8 gap-2 container mx-auto my-10">
          <div className="col-span-1">
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="hover:text-blue-500 text-black text-lg">Dashboard</Link>
              </li>
              <li>
                <Link href="/dashboard/appointments" className="hover:text-blue-500 text-black text-lg">Appointments</Link>
              </li>
              <li>
                <Link href="/dashboard/stylists" className="hover:text-blue-500 text-black text-lg">Stylists</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-500 text-black text-lg">Settings</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}