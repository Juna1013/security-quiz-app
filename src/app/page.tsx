// src/app/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Play, Star, Zap, Target } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null)
  const { t, theme } = useApp()

  const difficulties = [
    {
      id: 'easy' as const,
      title: t('home.easy'),
      description: t('home.easyDesc'),
      icon: <Star className="w-8 h-8 text-green-400" />,
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-400/30',
      bgColor: 'bg-green-400/10'
    },
    {
      id: 'medium' as const,
      title: t('home.medium'),
      description: t('home.mediumDesc'),
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      color: 'from-yellow-500 to-orange-600',
      borderColor: 'border-yellow-400/30',
      bgColor: 'bg-yellow-400/10'
    },
    {
      id: 'hard' as const,
      title: t('home.hard'),
      description: t('home.hardDesc'),
      icon: <Target className="w-8 h-8 text-red-400" />,
      color: 'from-red-500 to-pink-600',
      borderColor: 'border-red-400/30',
      bgColor: 'bg-red-400/10'
    }
  ]

  const handleDifficultyClick = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty)
    // 直接クイズページへ飛ぶ
    window.location.href = `/quiz?difficulty=${difficulty}`
  }

  return (
    <div className={`min-h-screen text-theme-primary flex flex-col items-center justify-center px-6 transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100' 
        : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
    }`}>
      
      {/* ヒーローセクション */}
      <div className="text-center mb-4 animate-fadeIn">
        <div className="mb-6">
          <Shield className={`w-24 h-24 mx-auto drop-shadow-lg animate-pulse mb-4 ${
            theme === 'light' ? 'text-blue-600' : 'text-cyan-400'
          }`}/>
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-wider mb-4 bg-gradient-to-r ${
            theme === 'light' 
              ? 'from-blue-600 to-indigo-600' 
              : 'from-cyan-400 to-blue-400'
          } bg-clip-text text-transparent`}>
            {t('home.title')}
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {t('home.subtitle')}
          </p>
        </div>
      </div>

      {/* 難易度選択 */}
      <div className="w-full max-w-4xl mb-12">
        <h2 className={`text-2xl font-bold text-center mb-8 ${
          theme === 'light' ? 'text-blue-700' : 'text-cyan-300'
        }`}>
          {t('home.selectDifficulty')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.id}
              onClick={() => handleDifficultyClick(difficulty.id)}
              className={`group p-6 rounded-xl border-2 transition-all duration-300 backdrop-blur-md hover:scale-105 ${
                theme === 'light'
                  ? 'bg-white/70 border-gray-200 hover:border-blue-400/50 hover:shadow-lg'
                  : 'bg-slate-800/50 border-slate-600/30 hover:border-cyan-400/50'
              }`}
            >
              <div className="text-center">
                <div className="mb-4 group-hover:animate-bounce">
                  {difficulty.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-theme-primary">{difficulty.title}</h3>
                <p className="text-theme-secondary text-sm">{difficulty.description}</p>
                <div className="mt-4">
                  <span className={`inline-flex items-center px-4 py-2 font-medium rounded-full transition-all duration-300 ${
                    theme === 'light'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-blue-500 hover:to-cyan-500'
                  }`}>
                    <Play className="w-4 h-4 mr-2"/>
                    {t('home.start')}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 説明テキスト */}
      <div className="text-center">
        <p className={`mt-4 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          {t('home.duration')}
        </p>
        <p className={`mt-2 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          {t('home.random')}
        </p>
      </div>
    </div>
  )
}
