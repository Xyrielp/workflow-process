import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Workflow Manager',
  description: 'Manage tasks with sequential workflow processes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Workflow Manager</h1>
          {children}
        </div>
      </body>
    </html>
  )
}