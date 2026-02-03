import './globals.css'

export const metadata = {
  title: 'Vape Vending Tracker - Arizona',
  description: 'Track prospects, locations, and revenue for your vape vending business',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  )
}
