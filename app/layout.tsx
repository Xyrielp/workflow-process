import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Business Process Mapping Tool',
  description: 'Organize and manage your business processes with structured workflows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Business Process Mapping Tool</h1>
          {children}
        </div>
      </body>
    </html>
  )
}