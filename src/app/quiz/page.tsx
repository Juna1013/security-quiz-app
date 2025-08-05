'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react'
import { useQuiz } from '/Users/Juna1013/bin/security-quiz-app/lib/useQuiz.ts'

export default function QuizPage() {
  const router = useRouter()
  const { 
    currentQuestion, 
    quizState, 
    progress, 
    loading, 
    error, 
    startQuiz, 
    answerQuestion 
  } = useQuiz()
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())

  // クイズ自動開始
  useEffect(() => {
    if (!loading && !error && quizState.quizStatus === 'idle') {
      startQuiz()
    }
  }, [loading, error, quizState.quizStatus, startQuiz])

  // 結果画面への遷移
  useEffect(() => {
    if (quizState.quizStatus === 'finished') {
      // 状態をsessionStorageに保存
      sessionStorage.setItem('quizResult', JSON.stringify({
        totalQuestions: quizState.answeredQuestions.length,
        correctAnswers: quizState.score,
        score: quizState.score,
        percentage: Math.round((quizState.score / quizState.answeredQuestions.length) * 100),
        answeredQuestions: quizState.answeredQuestions
      }))
      router.push('/result')
    }
  }, [quizState.quizStatus, quizState.score, quizState.answeredQuestions, router])

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || showExplanation) return
    
    setSelectedAnswer(answer)
    setShowExplanation(true)
    
    // 回答を記録
    setTimeout(() => {
      answerQuestion(answer)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setQuestionStartTime(Date.now())
    }, 3000) // 3秒後に次の問題へ
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">クイズを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">エラーが発生しました</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-gray-600">問題が見つかりません。</p>
      </div>
    )
  }

  const isCorrectAnswer = selectedAnswer === currentQuestion.answer

  return (
    <div className="max-w-3xl mx-auto">
      {/* プログレスバー */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            問題 {quizState.currentQuestionIndex + 1} / {quizState.answeredQuestions.length + 1}
          </span>
          <span className="text-sm font-medium text-gray-600">
            スコア: {quizState.score} / {quizState.answeredQuestions.length + 1}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* 問題カード */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {currentQuestion.category || 'セキュリティ'}
            </span>
            {currentQuestion.difficulty && (
              <span className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty === 'easy' ? '初級' :
                 currentQuestion.difficulty === 'medium' ? '中級' : '上級'}
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 選択肢 */}
        <div className="space-y-3">
          {currentQuestion.choices.map((choice, index) => {
            let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md"
            
            if (!selectedAnswer) {
              buttonClass += " border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            } else if (choice === currentQuestion.answer) {
              buttonClass += " border-green-500 bg-green-50 text-green-800"
            } else if (choice === selectedAnswer && !isCorrectAnswer) {
              buttonClass += " border-red-500 bg-red-50 text-red-800"
            } else {
              buttonClass += " border-gray-200 bg-gray-50 text-gray-500"
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(choice)}
                disabled={selectedAnswer !== null}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{choice}</span>
                  {selectedAnswer && choice === currentQuestion.answer && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                  {selectedAnswer && choice === selectedAnswer && !isCorrectAnswer && (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* 解説表示 */}
        {showExplanation && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className={`w-6 h-6 mr-3 mt-0.5 ${isCorrectAnswer ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrectAnswer ? <CheckCircle /> : <XCircle />}
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${isCorrectAnswer ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrectAnswer ? '正解です！' : '不正解です'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  3秒後に次の問題に進みます...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}