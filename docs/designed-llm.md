# セキュリティクイズWebアプリ ハンズオン

## 概要
県警イベント用のセキュリティに関するクイズWebアプリケーションを開発します。フロントエンドのみで動作し、ユーザー登録不要でアクセス可能な静的サイトです。

## 前提条件
- Node.js (v18以上)
- npm または yarn
- Git
- テキストエディタ（VS Code推奨）

## 使用技術
- **フレームワーク**: Next.js 14
- **言語**: TypeScript
- **スタイリング**: TailwindCSS
- **デプロイ**: Vercel
- **データ管理**: JSONファイル

## ハンズオン手順

### Phase 1: プロジェクトセットアップ

#### 1-1. Next.jsプロジェクトの作成

```bash
# プロジェクトを作成
npx create-next-app@latest security-quiz-app --typescript --tailwind --eslint --app

# プロジェクトディレクトリに移動
cd security-quiz-app

# 開発サーバーを起動して確認
npm run dev
```

#### 1-2. 必要な依存関係のインストール

```bash
# 追加パッケージのインストール
npm install lucide-react
```

#### 1-3. プロジェクト構造の確認

```
security-quiz-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── quiz/
│   │   └── page.tsx
│   └── result/
│       └── page.tsx
├── components/
├── public/
│   └── data/
│       └── quizzes.json
├── types/
└── lib/
```

### Phase 2: データ構造とタイプ定義

#### 2-1. 型定義ファイルの作成

`types/quiz.ts`を作成：

```typescript
export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answeredQuestions: AnsweredQuestion[];
  quizStatus: 'idle' | 'playing' | 'finished';
  timeRemaining?: number;
}

export interface AnsweredQuestion {
  question: QuizQuestion;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent?: number;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  answeredQuestions: AnsweredQuestion[];
}
```

#### 2-2. クイズデータファイルの作成

`public/data/quizzes.json`を作成：

```json
[
  {
    "id": "security-001",
    "question": "パスワードを安全に管理するために最も重要なことは何ですか？",
    "choices": [
      "同じパスワードを複数のサービスで使用する",
      "パスワードを紙に書いて保管する",
      "複雑で一意のパスワードを使用し、パスワードマネージャーで管理する",
      "パスワードをブラウザに保存する"
    ],
    "answer": "複雑で一意のパスワードを使用し、パスワードマネージャーで管理する",
    "explanation": "パスワードマネージャーを使用することで、各サービスで異なる複雑なパスワードを安全に管理できます。",
    "difficulty": "easy",
    "category": "パスワード管理"
  },
  {
    "id": "security-002",
    "question": "フィッシング攻撃から身を守るために最も効果的な方法は？",
    "choices": [
      "怪しいメールのリンクをクリックして確認する",
      "送信者のメールアドレスを確認し、公式サイトに直接アクセスする",
      "メールの内容をすべて信じる",
      "添付ファイルをすぐに開く"
    ],
    "answer": "送信者のメールアドレスを確認し、公式サイトに直接アクセスする",
    "explanation": "フィッシングメールは正規のサービスを装って偽のリンクに誘導します。常に公式サイトに直接アクセスすることが重要です。",
    "difficulty": "medium",
    "category": "フィッシング対策"
  },
  {
    "id": "security-003",
    "question": "二要素認証（2FA）の説明として正しいものは？",
    "choices": [
      "パスワードだけでログインする仕組み",
      "パスワードに加えて、もう一つの認証要素を使用する仕組み",
      "生体認証だけを使用する仕組み",
      "自動的にログインする仕組み"
    ],
    "answer": "パスワードに加えて、もう一つの認証要素を使用する仕組み",
    "explanation": "二要素認証は「知っているもの（パスワード）」と「持っているもの（スマートフォンなど）」の2つの要素を組み合わせてセキュリティを強化します。",
    "difficulty": "easy",
    "category": "認証"
  }
]
```

### Phase 3: コンポーネント開発

#### 3-1. レイアウトコンポーネントの更新

`app/layout.tsx`を更新：

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '県警セキュリティクイズ',
  description: 'サイバーセキュリティの知識を楽しく学習できるクイズアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen`}>
        <header className="bg-blue-900 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">🛡️ 県警セキュリティクイズ</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
```

#### 3-2. ホーム画面の作成

`app/page.tsx`を更新：

```typescript
'use client'

import Link from 'next/link'
import { Shield, Play, Trophy } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* ヒーローセクション */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <Shield className="w-24 h-24 mx-auto text-blue-600 mb-4" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            サイバーセキュリティクイズ
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            楽しみながらセキュリティの知識を身につけよう！
            実践的な問題で、日常生活で役立つセキュリティスキルを学習できます。
          </p>
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Play className="w-12 h-12 mx-auto text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">すぐに開始</h3>
          <p className="text-gray-600">
            ユーザー登録不要。アクセスするだけですぐにクイズを開始できます。
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Trophy className="w-12 h-12 mx-auto text-yellow-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">学習効果</h3>
          <p className="text-gray-600">
            各問題に詳しい解説付き。間違えても学習できる設計です。
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Shield className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">実践的内容</h3>
          <p className="text-gray-600">
            日常生活で遭遇する実際のセキュリティ課題を題材にしています。
          </p>
        </div>
      </div>

      {/* クイズ開始ボタン */}
      <div className="text-center">
        <Link
          href="/quiz"
          className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
        >
          <Play className="w-6 h-6 mr-2" />
          クイズを開始する
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          所要時間: 約5-10分 | 問題数: 全3問
        </p>
      </div>
    </div>
  )
}
```

#### 3-3. クイズ用のカスタムフック作成

`lib/useQuiz.ts`を作成：

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { QuizQuestion, QuizState, AnsweredQuestion } from '@/types/quiz'

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
```

#### 3-4. クイズ画面の作成

`app/quiz/page.tsx`を作成：

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react'
import { useQuiz } from '@/lib/useQuiz'

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
```

#### 3-5. 結果画面の作成

`app/result/page.tsx`を作成：

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, RefreshCw, Home, CheckCircle, XCircle, Award } from 'lucide-react'
import { QuizResult } from '@/types/quiz'

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
                    <p className="

```typescript
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
```

### Phase 4: デプロイの準備

#### 4-1. Gitリポジトリの初期化

```bash
# Gitリポジトリを初期化（まだの場合）
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: Security Quiz App"

# GitHubリポジトリを作成して接続（GitHubでリポジトリを作成後）
git remote add origin https://github.com/yourusername/security-quiz-app.git
git branch -M main
git push -u origin main
```

#### 4-2. Vercelでのデプロイ設定

1. [Vercel](https://vercel.com)にアクセスしてアカウントを作成
2. "New Project"をクリック
3. GitHubリポジトリを選択
4. プロジェクト設定:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
5. "Deploy"をクリック

#### 4-3. 環境変数の設定（必要に応じて）

Vercelの設定画面で環境変数を追加:

```
NEXT_PUBLIC_APP_NAME=県警セキュリティクイズ
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Phase 5: 追加機能の実装

#### 5-1. ローディングコンポーネントの作成

`components/Loading.tsx`を作成:

```typescript
interface LoadingProps {
  message?: string
}

export default function Loading({ message = "読み込み中..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
```

#### 5-2. エラーハンドリングの改善

`components/ErrorMessage.tsx`を作成:

```typescript
import { XCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ 
  title = "エラーが発生しました", 
  message, 
  onRetry 
}: ErrorMessageProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-800 mb-2">{title}</h2>
        <p className="text-red-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            再試行
          </button>
        )}
      </div>
    </div>
  )
}
```

#### 5-3. レスポンシブデザインの最適化

`tailwind.config.js`を更新:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

### Phase 6: テストの実装

#### 6-1. テスト環境のセットアップ

```bash
# テスト関連パッケージのインストール
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

#### 6-2. Jest設定ファイルの作成

`jest.config.js`を作成:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

`jest.setup.js`を作成:

```javascript
import '@testing-library/jest-dom'
```

#### 6-3. 基本的なテストケースの作成

`__tests__/quiz.test.tsx`を作成:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '@/app/page'

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByText('サイバーセキュリティクイズ')
    expect(heading).toBeInTheDocument()
  })

  it('renders the start quiz button', () => {
    render(<Home />)
    const startButton = screen.getByText('クイズを開始する')
    expect(startButton).toBeInTheDocument()
  })
})
```

### Phase 7: パフォーマンス最適化

#### 7-1. 画像最適化の設定

`next.config.js`を作成:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // 静的エクスポートの設定
  output: 'export',
  trailingSlash: true,
  // ベースパスの設定（GitHub Pagesなどを使用する場合）
  // basePath: '/security-quiz-app',
}

module.exports = nextConfig
```

#### 7-2. メタデータの最適化

各ページでメタデータを最適化:

```typescript
// app/quiz/page.tsx の先頭に追加
export const metadata = {
  title: 'クイズ実行中 | 県警セキュリティクイズ',
  description: 'サイバーセキュリティに関するクイズに挑戦中です',
}

// app/result/page.tsx の先頭に追加
export const metadata = {
  title: 'クイズ結果 | 県警セキュリティクイズ',
  description: 'クイズの結果を確認しましょう',
}
```

### Phase 8: 運用とメンテナンス

#### 8-1. 問題データの管理

新しい問題を追加する場合は、`public/data/quizzes.json`を編集:

```json
{
  "id": "security-004",
  "question": "新しい問題文",
  "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  "answer": "正解の選択肢",
  "explanation": "詳細な解説文",
  "difficulty": "medium",
  "category": "新しいカテゴリ"
}
```

#### 8-2. Analytics の実装（オプション）

基本的なアクセス解析を追加:

```typescript
// lib/analytics.ts
export const trackEvent = (eventName: string, properties?: any) => {
  // Google Analytics や他の解析ツールとの連携
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

// 使用例
trackEvent('quiz_completed', {
  score: result.score,
  percentage: result.percentage,
  duration: Date.now() - startTime
})
```

### 完成とまとめ

この設計書に基づいたハンズオンで、以下の機能を持つWebアプリケーションが完成しました：

**主要機能:**
- ユーザー登録不要のクイズ体験
- レスポンシブデザイン対応
- リアルタイムの正誤判定と解説表示
- 詳細な結果画面
- 静的サイトとしての高速配信

**技術的特徴:**
- Next.js 14 + TypeScript による型安全な開発
- TailwindCSS によるモダンなUI
- Vercel での簡単デプロイ
- オフライン対応（部分的）
- SEO最適化

**運用上の利点:**
- サーバーレスによる低コスト運用
- 高い可用性とパフォーマンス
- 簡単な問題データ管理
- 拡張性の高い設計

このアプリケーションは県警イベントでの使用に最適化されており、参加者がセキュリティ知識を楽しく学習できる教育ツールとして機能します。