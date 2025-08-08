'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react'
import { useQuiz } from '../../../lib/useQuiz'

export const metadata = {
  title: 'クイズ実行中 | 茨城県警セキュリティクイズ',
  description: 'サイバーセキュリティに関するクイズに挑戦中です',
}

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

  useEffect(() => {
    if (!loading && !error && quizState.quizStatus === 'idle') {
      startQuiz()
    }
  }, [loading, error, quizState.quizStatus, startQuiz])

  useEffect(() => {
    if (quizState.quizStatus === 'finished') {
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
    
    setTimeout(() => {
      answerQuestion(answer)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setQuestionStartTime(Date.now())
    }, 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="text-center animate-fadeIn">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-200">クイズを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/10 border border-red-500/30 text-center rounded-xl p-8 shadow-lg">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">エラーが発生しました</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-pink-500 hover:to-red-500 transition-all duration-300"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <p className="text-cyan-200">問題が見つかりません。</p>
      </div>
    )
  }

  const isCorrectAnswer = selectedAnswer === currentQuestion.answer

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white px-4 py-8">
      
      {/* プログレスバー */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-2 text-cyan-200 text-sm font-medium">
          <span>問題 {quizState.currentQuestionIndex + 1} / {quizState.answeredQuestions.length + 1}</span>
          <span>スコア: {quizState.score} / {quizState.answeredQuestions.length + 1}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* 問題カード */}
      <div className="max-w-3xl mx-auto backdrop-blur-md bg-white/10 rounded-xl p-8 shadow-lg border border-white/20">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {currentQuestion.category || 'セキュリティ'}
            </span>
            {currentQuestion.difficulty && (
              <span className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {currentQuestion.difficulty === 'easy' ? '初級' :
                 currentQuestion.difficulty === 'medium' ? '中級' : '上級'}
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 選択肢 */}
        <div className="space-y-3">
          {currentQuestion.choices.map((choice, index) => {
            let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-300 backdrop-blur-sm"

            if (!selectedAnswer) {
              buttonClass += " border-white/20 hover:border-cyan-400 hover:bg-cyan-400/10"
            } else if (choice === currentQuestion.answer) {
              buttonClass += " border-green-400 bg-green-400/10 text-green-300"
            } else if (choice === selectedAnswer && !isCorrectAnswer) {
              buttonClass += " border-red-400 bg-red-400/10 text-red-300"
            } else {
              buttonClass += " border-white/10 bg-white/5 text-gray-400"
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
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  )}
                  {selectedAnswer && choice === selectedAnswer && !isCorrectAnswer && (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* 解説表示 */}
        {showExplanation && (
          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
            <div className="flex items-start">
              <div className={`w-6 h-6 mr-3 mt-0.5 ${isCorrectAnswer ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrectAnswer ? <CheckCircle /> : <XCircle />}
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${isCorrectAnswer ? 'text-green-300' : 'text-red-300'}`}>
                  {isCorrectAnswer ? '正解です！' : '不正解です'}
                </h3>
                <p className="text-gray-200 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                <div className="mt-4 flex items-center text-sm text-gray-400">
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
