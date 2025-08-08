'use client'

import Link from 'next/link'
import { Shield, Play, Trophy } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex flex-col items-center justify-center px-4">
      
      {/* ヒーローセクション */}
      <div className="text-center mb-16 animate-fadeIn">
        <div className="mb-6">
          <Shield className="w-24 h-24 mx-auto text-cyan-400 drop-shadow-lg animate-pulse mb-4"/>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wider mb-4">茨城県警 CSV</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            実践的な問題で、日常生活で役立つセキュリティスキルを学習できます
          </p>
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 w-full max-w-5xl">
        {[
          {
            icon: <Play className="w-12 h-12 mx-auto text-green-400 mb-4 animate-bounce" />,
            title: "すぐに開始",
            desc: "ユーザー登録不要"
          },
          {
            icon: <Trophy className="w-12 h-12 mx-auto text-yellow-400 mb-4 animate-bounce delay-100" />,
            title: "学習効果",
            desc: "各問題に詳しい解説付き"
          },
          {
            icon: <Shield className="w-12 h-12 mx-auto text-cyan-400 mb-4 animate-bounce delay-200" />,
            title: "実践的",
            desc: "ポスター展示に関する内容"
          }
        ].map((item, i) => (
          <div
            key={i}
            className="backdrop-blur-md bg-white/10 rounded-xl p-8 text-center border border-white/20 shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 hover:scale-105"
          >
            {item.icon}
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-300">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* クイズ開始ボタン */}
      <div className="text-center">
        <Link
          href="/quiz"
          className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:from-blue-500 hover:to-cyan-500 transform hover:scale-110 transition-all duration-300"
        >
          <Play className="w-6 h-6 mr-2"/>
          Start
        </Link>
        <p className="mt-4 text-sm text-gray-400">所要時間: 1分程度</p>
        <p className="mt-2 text-sm text-gray-400">問題数: 全3問</p>
      </div>
    </div>
  )
}
