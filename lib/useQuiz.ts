'use client'

import { useState, useEffect, useCallback } from 'react'
import { QuizQuestion, QuizState, AnsweredQuestion } from '../types/quiz'

export const useQuiz = () => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    const [quizState, setQuizState] = useState<QuizState>({
        currentQuestionIndex: 0,
        score: 0,
        answeredQuestions: [],
        quizStatus: 'idle'
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // クイズデータの読み込み
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const response = await fetch('/data/quizzes.json')
                if (!response.ok) {
                    throw new Error('クイズデータの読み込みに失敗しました')
                }
                const data: QuizQuestion[] = await response.json()
                setQuestions(data)
                setLoading(false)
            } catch (err) {
                setError(err instanceof Error ? err.message : '未知のエラーが発生しました')
                setLoading(false)
            }
        }

        loadQuestions()
    }, [])

    // クイズ開始
    const startQuiz = useCallback(() => {
    setQuizState({
        currentQuestionIndex: 0,
        score: 0,
        answeredQuestions: [],
        quizStatus: 'playing'
    })
    }, [])

    // 回答処理
    const answerQuestion = useCallback((selectedAnswer: string) => {
        if (quizState.quizStatus !== 'playing' || !questions.length) return

        const currentQuestion = questions[quizState.currentQuestionIndex]
        const isCorrect = selectedAnswer === currentQuestion.answer
    
        const answeredQuestion: AnsweredQuestion = {
            question: currentQuestion,
            selectedAnswer,
            isCorrect
        }

        const newScore = quizState.score + (isCorrect ? 1 : 0)
        const newAnsweredQuestions = [...quizState.answeredQuestions, answeredQuestion]
    
        // 最後の問題かチェック
        const isLastQuestion = quizState.currentQuestionIndex >= questions.length - 1
    
        setQuizState({
            currentQuestionIndex: isLastQuestion ? quizState.currentQuestionIndex : quizState.currentQuestionIndex + 1,
            score: newScore,
            answeredQuestions: newAnsweredQuestions,
            quizStatus: isLastQuestion ? 'finished' : 'playing'
        })
    }, [questions, quizState])

    // クイズリセット
    const resetQuiz = useCallback(() => {
        setQuizState({
            currentQuestionIndex: 0,
            score: 0,
            answeredQuestions: [],
            quizStatus: 'idle'
        })
    }, [])

    const currentQuestion = questions[quizState.currentQuestionIndex]
    const progress = questions.length > 0 ? ((quizState.currentQuestionIndex + 1) / questions.length) * 100 : 0

    return {
        questions,
        quizState,
        currentQuestion,
        progress,
        loading,
        error,
        startQuiz,
        answerQuestion,
        resetQuiz
    }
}
