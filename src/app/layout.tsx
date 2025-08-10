// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../../../contexts/AppContext";
import Settings from "../../../components/Settings";

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
    <html lang="ja" className="dark">
      <body className={`${inter.className} min-h-screen transition-colors duration-300`}>
        <AppProvider>
          <main className="container mx-auto">
            {children}
          </main>
          <Settings />
        </AppProvider>
      </body>
    </html>
  )
}
