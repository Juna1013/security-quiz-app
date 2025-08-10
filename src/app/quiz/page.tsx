// src/app/quiz/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { useQuiz } from '../../../lib/useQuiz'
import { useApp } from '../../contexts/AppContext'

// QuizContent コンポーネントを分離
function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | null
  const { t, theme } = useApp()
  
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
  const [canProceed, setCanProceed] = useState(false)

  useEffect(() => {
    if (!loading && !error && quizState.quizStatus === 'idle') {
      startQuiz(difficulty || undefined)
    }
  }, [loading, error, quizState.quizStatus, startQuiz, difficulty])

  useEffect(() => {
    if (quizState.quizStatus === 'finished') {
      const difficultyLabel = difficulty === 'easy' ? t('home.easy') : 
                            difficulty === 'medium' ? t('home.medium') : t('home.hard')
      sessionStorage.setItem('quizResult', JSON.stringify({
        totalQuestions: quizState.answeredQuestions.length,
        correctAnswers: quizState.score,
        score: quizState.score,
        percentage: Math.round((quizState.score / quizState.answeredQuestions.length) * 100),
        answeredQuestions: quizState.answeredQuestions,
        difficulty: difficultyLabel
      }))
      router.push('/result')
    }
  }, [quizState.quizStatus, quizState.score, quizState.answeredQuestions, router, difficulty, t])

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || showExplanation) return
    
    setSelectedAnswer(answer)
    setShowExplanation(true)
    setCanProceed(true)
  }

  const handleNextQuestion = () => {
    if (!canProceed) return
    
    answerQuestion(selectedAnswer!)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCanProceed(false)
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800' 
          : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'
      }`}>
        <div className="text-center animate-fadeIn">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
            theme === 'light' ? 'border-blue-600' : 'border-cyan-400'
          }`}></div>
          <p className={theme === 'light' ? 'text-blue-700' : 'text-cyan-200'}>
            {t('quiz.loading')}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100' 
          : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
      }`}>
        <div className={`backdrop-blur-md border text-center rounded-xl p-8 shadow-lg ${
          theme === 'light'
            ? 'bg-white/80 border-red-200 text-slate-800'
            : 'bg-slate-800/50 border-red-500/30 text-white'
        }`}>
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('quiz.error')}</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-pink-500 hover:to-red-500 transition-all duration-300"
          >
            {t('quiz.reload')}
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800' 
          : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'
      }`}>
        <p>{t('quiz.noQuestions')}</p>
      </div>
    )
  }

  const isCorrectAnswer = selectedAnswer === currentQuestion.answer
  const difficultyLabel = difficulty === 'easy' ? t('home.easy') : 
                          difficulty === 'medium' ? t('home.medium') : t('home.hard')

  return (
    <div className={`min-h-screen px-4 py-8 transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800' 
        : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'
    }`}>
      
      {/* プログレスバー */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className={`flex justify-between items-center mb-2 text-sm font-medium ${
          theme === 'light' ? 'text-blue-700' : 'text-cyan-200'
        }`}>
          // src/app/quiz/page.tsx (続き)
         <span>{t('quiz.question')} {quizState.currentQuestionIndex + 1} / {quizState.answeredQuestions.length + 1}</span>
         <div className="flex items-center gap-4">
           <span className={`px-2 py-1 rounded text-xs ${
             theme === 'light' 
               ? 'bg-blue-100 text-blue-700' 
               : 'bg-cyan-500/20 text-cyan-300'
           }`}>
             {difficultyLabel}
           </span>
           <span>{t('quiz.score')}: {quizState.score} / {quizState.answeredQuestions.length + 1}</span>
         </div>
       </div>
       <div className={`w-full rounded-full h-2 overflow-hidden ${
         theme === 'light' ? 'bg-gray-200' : 'bg-slate-700/50'
       }`}>
         <div 
           className={`h-2 transition-all duration-300 ${
             theme === 'light' 
               ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
               : 'bg-gradient-to-r from-cyan-400 to-blue-500'
           }`}
           style={{ width: `${progress}%` }}
         ></div>
       </div>
     </div>

     {/* 問題カード */}
     <div className={`max-w-3xl mx-auto backdrop-blur-md rounded-xl p-8 shadow-lg border ${
       theme === 'light'
         ? 'bg-white/80 border-gray-200'
         : 'bg-slate-800/50 border-slate-600/30'
     }`}>
       <div className="mb-6">
         <div className="flex items-center mb-4">
           <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
             theme === 'light'
               ? 'bg-blue-100 text-blue-700'
               : 'bg-cyan-500/20 text-cyan-300'
           }`}>
             {currentQuestion.category || t('quiz.security')}
           </span>
           {currentQuestion.difficulty && (
             <span className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${
               currentQuestion.difficulty === 'easy' 
                 ? theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-300'
                 : currentQuestion.difficulty === 'medium' 
                 ? theme === 'light' ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-500/20 text-yellow-300'
                 : theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-500/20 text-red-300'
             }`}>
               {currentQuestion.difficulty === 'easy' ? t('home.easy') :
                currentQuestion.difficulty === 'medium' ? t('home.medium') : t('home.hard')}
             </span>
           )}
         </div>
         <h2 className="text-xl font-semibold leading-relaxed text-theme-primary">
           {currentQuestion.question}
         </h2>
       </div>

       {/* 選択肢 */}
       <div className="space-y-3">
         {currentQuestion.choices.map((choice, index) => {
           let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-300 backdrop-blur-sm"

           if (!selectedAnswer) {
             buttonClass += theme === 'light' 
               ? " border-gray-200 hover:border-blue-400 hover:bg-blue-50" 
               : " border-slate-600/30 hover:border-cyan-400 hover:bg-cyan-400/10"
           } else if (choice === currentQuestion.answer) {
             buttonClass += " border-green-400 text-green-700 dark:text-green-300"
             buttonClass += theme === 'light' ? " bg-green-50" : " bg-green-400/10"
           } else if (choice === selectedAnswer && !isCorrectAnswer) {
             buttonClass += " border-red-400 text-red-700 dark:text-red-300"
             buttonClass += theme === 'light' ? " bg-red-50" : " bg-red-400/10"
           } else {
             buttonClass += theme === 'light' 
               ? " border-gray-200 bg-gray-50 text-gray-500" 
               : " border-slate-700/30 bg-slate-800/30 text-slate-400"
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
         <div className={`mt-6 p-4 rounded-lg border ${
           theme === 'light'
             ? 'bg-blue-50 border-blue-200'
             : 'bg-cyan-500/10 border-cyan-400/30'
         }`}>
           <div className="flex items-start">
             <div className={`w-6 h-6 mr-3 mt-0.5 ${isCorrectAnswer ? 'text-green-400' : 'text-red-400'}`}>
               {isCorrectAnswer ? <CheckCircle /> : <XCircle />}
             </div>
             <div className="flex-1">
               <h3 className={`font-semibold mb-2 ${
                 isCorrectAnswer 
                   ? theme === 'light' ? 'text-green-700' : 'text-green-300'
                   : theme === 'light' ? 'text-red-700' : 'text-red-300'
               }`}>
                 {isCorrectAnswer ? t('quiz.correct') : t('quiz.incorrect')}
               </h3>
               <p className={`leading-relaxed mb-4 ${
                 theme === 'light' ? 'text-slate-700' : 'text-slate-200'
               }`}>
                 {currentQuestion.explanation}
               </p>
               <button
                 onClick={handleNextQuestion}
                 className={`inline-flex items-center px-4 py-2 font-medium rounded-full transition-all duration-300 ${
                   theme === 'light'
                     ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-indigo-500 hover:to-blue-600'
                     : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-blue-500 hover:to-cyan-500'
                 }`}
               >
                 {t('quiz.nextQuestion')}
                 <ArrowRight className="w-4 h-4 ml-2" />
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   </div>
 )
}

// ローディングコンポーネント
function QuizLoading() {
 const { t, theme } = useApp()
 
 return (
   <div className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
     theme === 'light' 
       ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800' 
       : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'
   }`}>
     <div className="text-center animate-fadeIn">
       <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
         theme === 'light' ? 'border-blue-600' : 'border-cyan-400'
       }`}></div>
       <p className={theme === 'light' ? 'text-blue-700' : 'text-cyan-200'}>
         {t('quiz.loading')}
       </p>
     </div>
   </div>
 )
}

// メインコンポーネント
export default function QuizPage() {
 return (
   <Suspense fallback={<QuizLoading />}>
     <QuizContent />
   </Suspense>
 )
}
