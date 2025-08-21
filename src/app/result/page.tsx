// src/app/result/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RefreshCw, Home, CheckCircle, XCircle, Award } from 'lucide-react'
import { QuizResult } from '../../types/quiz'
import { useApp } from '../../contexts/AppContext'

interface ExtendedQuizResult extends QuizResult {
  difficulty?: string
}

export default function ResultPage() {
  const router = useRouter()
  const { t, theme } = useApp()
  const [result, setResult] = useState<ExtendedQuizResult | null>(null)

  useEffect(() => {
    const savedResult = sessionStorage.getItem('quizResult')
    if (savedResult) {
      setResult(JSON.parse(savedResult))
    } else {
      router.push('/')
    }
  }, [router])

  if (!result) {
    return (
      <div className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800' 
          : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
            theme === 'light' ? 'border-blue-600' : 'border-cyan-400'
          }`}></div>
          <p className={theme === 'light' ? 'text-blue-700' : 'text-cyan-200'}>
            {t('result.loading')}
          </p>
        </div>
      </div>
    )
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return { message: t('result.excellent'), color: "text-green-300", icon: "🏆" }
    if (percentage >= 70) return { message: t('result.good'), color: theme === 'light' ? 'text-blue-700' : 'text-blue-300', icon: "🎉" }
    if (percentage >= 50) return { message: t('result.fair'), color: theme === 'light' ? 'text-yellow-700' : 'text-yellow-300', icon: "📚" }
    return { message: t('result.needWork'), color: theme === 'light' ? 'text-red-700' : 'text-red-300', icon: "💪" }
  }

  const scoreInfo = getScoreMessage(result.percentage)

  return (
    <div className={`min-h-screen px-4 py-8 transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800' 
        : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'
    }`}>
      
      {/* 結果ヘッダー */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className={`backdrop-blur-md border rounded-xl p-8 shadow-lg ${
          theme === 'light'
            ? 'bg-white/80 border-gray-200'
            : 'bg-slate-800/50 border-slate-600/30'
        }`}>
          <div className="text-6xl mb-4">{scoreInfo.icon}</div>
          <h1 className="text-3xl font-bold mb-2 text-theme-primary">{t('result.title')}</h1>
          {result.difficulty && (
            <p className={`mb-2 ${theme === 'light' ? 'text-blue-700' : 'text-cyan-300'}`}>
              {t('result.difficulty')}: {result.difficulty}
            </p>
          )}
          <p className={`text-xl font-semibold mb-4 ${scoreInfo.color}`}>
            {scoreInfo.message}
          </p>

          {/* 円形プログレスバー */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="rgba(148,163,184,0.2)" strokeWidth="8" fill="transparent" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="url(#grad)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${result.percentage * 3.14} 314`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={theme === 'light' ? '#3b82f6' : '#06b6d4'} />
                    <stop offset="100%" stopColor={theme === 'light' ? '#1d4ed8' : '#3b82f6'} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-theme-primary">{result.percentage}%</span>
              </div>
            </div>
          </div>

          {/* スコア表示 */}
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div>
              <div className={`text-3xl font-bold ${theme === 'light' ? 'text-blue-700' : 'text-cyan-300'}`}>
                {result.correctAnswers}
              </div>
              <div className="text-sm text-theme-secondary">{t('result.correct')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-theme-primary">{result.totalQuestions}</div>
              <div className="text-sm text-theme-secondary">{t('result.total')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-300">{result.percentage}%</div>
              <div className="text-sm text-theme-secondary">{t('result.percentage')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細結果 */}
      <div className={`max-w-4xl mx-auto backdrop-blur-md border rounded-xl p-6 mb-8 shadow-lg ${
        theme === 'light'
          ? 'bg-white/80 border-gray-200'
          : 'bg-slate-800/50 border-slate-600/30'
      }`}>
        <h2 className={`text-2xl font-bold mb-6 flex items-center ${
          theme === 'light' ? 'text-blue-700' : 'text-cyan-300'
        }`}>
          <Award className="w-6 h-6 mr-2" />
          {t('result.answers')}
        </h2>
        
        <div className="space-y-6">
          {result.answeredQuestions.map((answered, index) => (
            <div
              key={answered.question.id}
              className={`rounded-lg p-6 border backdrop-blur-sm ${
                answered.isCorrect 
                  ? theme === 'light'
                    ? 'border-green-300 bg-green-50'
                    : 'border-green-400/30 bg-green-400/10'
                  : theme === 'light'
                    ? 'border-red-300 bg-red-50'
                    : 'border-red-400/30 bg-red-400/10'
              }`}
            >
              <div className="flex items-start mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  answered.isCorrect 
                    ? theme === 'light'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-green-500/20 text-green-300'
                    : theme === 'light'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-red-500/20 text-red-300'
                }`}>
                  {answered.isCorrect ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-theme-primary">
                    {t('quiz.question')} {index + 1}: {answered.question.question}
                  </h3>
                  
                  <div className="mb-3">
                    <p className="text-sm text-theme-secondary mb-1">{t('result.yourAnswer')}</p>
                    <p className={answered.isCorrect 
                      ? theme === 'light' ? 'text-green-700' : 'text-green-300'
                      : theme === 'light' ? 'text-red-700' : 'text-red-300'
                    }>
                      {answered.selectedAnswer}
                    </p>
                  </div>
                  
                  {!answered.isCorrect && (
                    <div className="mb-3">
                      <p className="text-sm text-theme-secondary mb-1">{t('result.correctAnswer')}</p>
                      <p className={theme === 'light' ? 'text-green-700' : 'text-green-300'}>
                        {answered.question.answer}
                      </p>
                    </div>
                  )}
                  
                  <div className={`rounded-lg p-4 border ${
                    theme === 'light'
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-slate-600/30 bg-slate-800/30'
                  }`}>
                    <p className={`text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      {t('result.explanation')}
                    </p>
                    <p className={`leading-relaxed ${
                      theme === 'light' ? 'text-slate-600' : 'text-slate-200'
                    }`}>
                      {answered.question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className={`flex items-center justify-center px-6 py-3 font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ${
            theme === 'light'
              ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
              : 'bg-gradient-to-r from-slate-600 to-slate-800 text-white hover:from-slate-500 hover:to-slate-700'
          }`}
        >
          <Home className="w-5 h-5 mr-2" />
          {t('result.home')}
        </Link>
      </div>

      {/* 学習アドバイス */}
      <div className={`max-w-4xl mx-auto mt-8 backdrop-blur-md border rounded-lg p-6 shadow-lg ${
        theme === 'light'
          ? 'bg-blue-50/80 border-blue-200'
          : 'bg-cyan-500/10 border-cyan-400/30'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          theme === 'light' ? 'text-blue-800' : 'text-cyan-300'
        }`}>
          📚 {t('result.learningTips')}
        </h3>
        <div className={`space-y-2 ${
          theme === 'light' ? 'text-slate-700' : 'text-slate-200'
        }`}>
          {result.percentage < 70 && (
            <p>• 間違えた問題の解説をもう一度確認してみましょう</p>
          )}
          <p>• 県警のサイバーセキュリティ啓発ページで詳しい情報をチェック</p>
          <p>• 定期的にクイズに挑戦して知識を定着させましょう</p>
          <p>• 家族や友人とも一緒にクイズに挑戦してみてください</p>
        </div>
      </div>
    </div>
  )
}