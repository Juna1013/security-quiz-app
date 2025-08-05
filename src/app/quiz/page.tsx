'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCricle, XCricle, Clock, ArrowRight } from 'lucide-react'
import { useQuiz } from '@/lib/useQuiz'

export default function QuizPage() {
    const router = useRouter()
    const {
        currentQuestin,
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
        if (!loading && error && quizState.qizStatus === 'idle') {
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
                percentage: Math.round((quizState.score / quizState.answeredQuestions.length) * 100),
                answeredQuestions: quizState.answeredQuestions
            }))
            router.push('/result')
        }
    }, [quizState.quizStatus, quizState.score, quizState.answeredQuestions, router])

    const handleAnswerSelect = (answer: string) => {
        if (selecetedAnswer || showExplanation) return

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
                    <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4"/>
                    <h2 className="text-xl font-semibold text-red-800 mb-2">エラーが発生しました</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        再度読み込み
                    </button>
                </div>
            </div>
        )
    }

    if (!currentQuestion) {
        return (
            <div className="max-w-2xl mx-auto text-center">
                <p className="text-gray-600">問題が見つかりません</p>
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
                        className="bg-blue-600 h-2 rounded-full transition-akk duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* 問題カード */}
            <div>
                <div>
                    <div>
                        <span>

                        </span>
                        {currentQuestion.difficulty && (
                            <span></span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}