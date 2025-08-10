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
      <body className={`${inter.className} bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen`}>
        <main className="container mx-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
