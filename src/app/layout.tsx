import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '茨城県警 サイバーセキュリティクイズ',
  description: 'サイバーセキュリティの知識を楽しく学習できるアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen`}>
        <header className="bg-blue-900 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">茨城県警 サイバーセキュリティクイズ</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
