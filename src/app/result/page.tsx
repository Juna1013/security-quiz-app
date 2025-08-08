'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RefreshCw, Home, CheckCircle, XCircle, Award } from 'lucide-react'
import { QuizResult } from '../../../types/quiz'

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-200">結果を読み込み中...</p>
        </div>
      </div>
    )
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "素晴らしい！", color: "text-green-300", icon: "🏆" }
    if (percentage >= 70) return { message: "よくできました！", color: "text-blue-300", icon: "🎉" }
    if (percentage >= 50) return { message: "もう少し頑張りましょう", color: "text-yellow-300", icon: "📚" }
    return { message: "復習が必要です", color: "text-red-300", icon: "💪" }
  }

  const scoreInfo = getScoreMessage(result.percentage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white px-4 py-8">
      
      {/* 結果ヘッダー */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 shadow-lg">
          <div className="text-6xl mb-4">{scoreInfo.icon}</div>
          <h1 className="text-3xl font-bold mb-2">クイズ完了！</h1>
          <p className={`text-xl font-semibold mb-4 ${scoreInfo.color}`}>
            {scoreInfo.message}
          </p>
          
          {/* スコア表示 */}
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div>
              <div className="text-3xl font-bold text-cyan-300">{result.correctAnswers}</div>
              <div className="text-sm text-gray-300">正解数</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{result.totalQuestions}</div>
              <div className="text-sm text-gray-300">総問題数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-300">{result.percentage}%</div>
              <div className="text-sm text-gray-300">正答率</div>
            </div>
          </div>

          {/* 円形プログレスバー */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
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
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{result.percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細結果 */}
      <div className="max-w-4xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 mb-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Award className="w-6 h-6 mr-2 text-cyan-300" />
          問題別詳細結果
        </h2>
        
        <div className="space-y-6">
          {result.answeredQuestions.map((answered, index) => (
            <div
              key={answered.question.id}
              className={`rounded-lg p-6 border backdrop-blur-sm ${
                answered.isCorrect 
                  ? 'border-green-400/30 bg-green-400/10' 
                  : 'border-red-400/30 bg-red-400/10'
              }`}
            >
              <div className="flex items-start mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  answered.isCorrect 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {answered.isCorrect ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">
                    問題 {index + 1}: {answered.question.question}
                  </h3>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-300 mb-1">あなたの回答:</p>
                    <p className={answered.isCorrect ? 'text-green-300' : 'text-red-300'}>
                      {answered.selectedAnswer}
                    </p>
                  </div>
                  
                  {!answered.isCorrect && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-300 mb-1">正解:</p>
                      <p className="text-green-300">
                        {answered.question.answer}
                      </p>
                    </div>
                  )}
                  
                  <div className="rounded-lg p-4 border border-white/10 bg-white/5">
                    <p className="text-sm font-medium text-gray-200 mb-2">解説:</p>
                    <p className="text-gray-300 leading-relaxed">
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
        <button
          onClick={() => {
            sessionStorage.removeItem('quizResult')
            router.push('/quiz')
          }}
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-500 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          もう一度挑戦する
        </button>
        <Link
          href="/"
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-full shadow-lg hover:from-gray-500 hover:to-gray-700 transform hover:scale-105 transition-all duration-300"
        >
          <Home className="w-5 h-5 mr-2" />
          ホームに戻る
        </Link>
      </div>

      {/* 学習アドバイス */}
      <div className="max-w-4xl mx-auto mt-8 backdrop-blur-md bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-cyan-300 mb-3">📚 さらなる学習のために</h3>
        <div className="text-gray-200 space-y-2">
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
