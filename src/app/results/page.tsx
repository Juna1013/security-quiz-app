'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, RefreshCw, Home, CheckCircle, XCircle, Award } from 'lucide-react'
import { useQuiz } from '../../../lib/useQuiz'
import { QuizResult } from '../../../types/quiz'

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    const savedResult = sessionStorage.getItem('quizResult')
    if (savedResult) {
      setResult(JSON.parse(savedResult))
    } else {
      // 結果がない場合はホームに戻す
      router.push('/')
    }
  }, [router])

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">結果を読み込み中...</p>
        </div>
      </div>
    )
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "素晴らしい！", color: "text-green-600", icon: "🏆" }
    if (percentage >= 70) return { message: "よくできました！", color: "text-blue-600", icon: "🎉" }
    if (percentage >= 50) return { message: "もう少し頑張りましょう", color: "text-yellow-600", icon: "📚" }
    return { message: "復習が必要です", color: "text-red-600", icon: "💪" }
  }

  const scoreInfo = getScoreMessage(result.percentage)

  return (
    <div className="max-w-4xl mx-auto">
      {/* 結果ヘッダー */}
      <div className="text-center mb-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-6xl mb-4">{scoreInfo.icon}</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">クイズ完了！</h1>
          <p className={`text-xl font-semibold mb-4 ${scoreInfo.color}`}>
            {scoreInfo.message}
          </p>
          
          {/* スコア表示 */}
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {result.correctAnswers}
              </div>
              <div className="text-sm text-gray-600">正解数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                {result.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">総問題数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {result.percentage}%
              </div>
              <div className="text-sm text-gray-600">正答率</div>
            </div>
          </div>

          {/* 円形プログレスバー風の表示 */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${result.percentage * 3.14} 314`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">
                  {result.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細結果 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Award className="w-6 h-6 mr-2 text-blue-600" />
          問題別詳細結果
        </h2>
        
        <div className="space-y-6">
          {result.answeredQuestions.map((answered, index) => (
            <div
              key={answered.question.id}
              className={`border rounded-lg p-6 ${
                answered.isCorrect 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  answered.isCorrect 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {answered.isCorrect ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    問題 {index + 1}: {answered.question.question}
                  </h3>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">あなたの回答:</p>
                    <p className={`font-medium ${
                      answered.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {answered.selectedAnswer}
                    </p>
                  </div>
                  
                  {!answered.isCorrect && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">正解:</p>
                      <p className="font-medium text-green-700">
                        {answered.question.answer}
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">解説:</p>
                    <p className="text-gray-700 leading-relaxed">
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
         className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
       >
         <RefreshCw className="w-5 h-5 mr-2" />
         もう一度挑戦する
       </button>
       
       <Link
         href="/"
         className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
       >
         <Home className="w-5 h-5 mr-2" />
         ホームに戻る
       </Link>
     </div>

     {/* 学習アドバイス */}
     <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
       <h3 className="text-lg font-semibold text-blue-800 mb-3">
         📚 さらなる学習のために
       </h3>
       <div className="text-blue-700 space-y-2">
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