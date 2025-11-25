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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ProcessMap" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              document.addEventListener('selectstart', function(e) { e.preventDefault(); return false; });
              document.addEventListener('dragstart', function(e) { e.preventDefault(); return false; });
              document.addEventListener('contextmenu', function(e) { e.preventDefault(); return false; });
              document.onselectstart = function() { return false; };
              document.onmousedown = function() { return false; };
              document.ondragstart = function() { return false; };
            });
          `
        }} />
      </head>
      <body className="bg-gray-50 min-h-screen" onSelectStart={() => false} onDragStart={() => false}>
        <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Business Process Mapping Tool</h1>
          {children}
        </div>
      </body>
    </html>
  )
}