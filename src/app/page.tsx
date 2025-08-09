'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Play, Trophy, Star, Zap, Target } from 'lucide-react'

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null)

  const difficulties = [
    {
      id: 'easy' as const,
      title: '初級',
      description: '基本的なセキュリティ知識',
      icon: <Star className="w-8 h-8 text-green-400" />,
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-400/30',
      bgColor: 'bg-green-400/10'
    },
    {
      id: 'medium' as const,
      title: '中級',
      description: '実践的なセキュリティ対策',
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      color: 'from-yellow-500 to-orange-600',
      borderColor: 'border-yellow-400/30',
      bgColor: 'bg-yellow-400/10'
    },
    {
      id: 'hard' as const,
      title: '上級',
      description: '高度なセキュリティ知識',
      icon: <Target className="w-8 h-8 text-red-400" />,
      color: 'from-red-500 to-pink-600',
      borderColor: 'border-red-400/30',
      bgColor: 'bg-red-400/10'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex flex-col items-center justify-center px-4">
      
      {/* ヒーローセクション */}
      <div className="text-center mb-16 animate-fadeIn">
        <div className="mb-6">
          <Shield className="w-24 h-24 mx-auto text-cyan-400 drop-shadow-lg animate-pulse mb-4"/>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            茨城県警 CSV
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            実践的な問題で、日常生活で役立つセキュリティスキルを学習できます
          </p>
        </div>
      </div>

      {/* 難易度選択 */}
      <div className="w-full max-w-4xl mb-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-cyan-300">
          難易度を選択してください
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.id}
              onClick={() => setSelectedDifficulty(difficulty.id)}
              className={`group p-6 rounded-xl border-2 transition-all duration-300 backdrop-blur-md bg-slate-800/50 hover:scale-105 ${
                selectedDifficulty === difficulty.id
                  ? `${difficulty.borderColor} ${difficulty.bgColor} shadow-lg`
                  : 'border-slate-600/30 hover:border-cyan-400/50'
              }`}
            >
              <div className="text-center">
                <div className="mb-4 group-hover:animate-bounce">
                  {difficulty.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{difficulty.title}</h3>
                <p className="text-slate-400 text-sm">{difficulty.description}</p>
                {selectedDifficulty === difficulty.id && (
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-cyan-500 text-white text-xs rounded-full">
                      選択中
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* クイズ開始ボタン */}
      <div className="text-center">
        {selectedDifficulty ? (
          <Link
            href={`/quiz?difficulty=${selectedDifficulty}`}
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-xl hover:from-blue-500 hover:to-cyan-500 transform hover:scale-110 transition-all duration-300"
          >
            <Play className="w-6 h-6 mr-2"/>
            スタート
          </Link>
        ) : (
          <div className="inline-flex items-center px-10 py-4 bg-slate-600 text-slate-400 font-bold rounded-full cursor-not-allowed">
            <Play className="w-6 h-6 mr-2"/>
            難易度を選択してください
          </div>
        )}
        <p className="mt-4 text-sm text-slate-400">所要時間: 1-3分程度</p>
        <p className="mt-2 text-sm text-slate-400">問題はランダムで出題されます</p>
      </div>
    </div>
  )
}
