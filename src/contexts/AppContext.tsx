// contexts/AppContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'ja' | 'en'
type Theme = 'dark' | 'light'

interface AppContextType {
  language: Language
  theme: Theme
  setLanguage: (lang: Language) => void
  setTheme: (theme: Theme) => void
  t: (key: string) => string
}

const translations = {
  ja: {
    // ホーム画面
    'home.title': '茨城県警 CSV',
    'home.subtitle': '実践的な問題で、日常生活で役立つセキュリティスキルを学習できます',
    'home.selectDifficulty': 'レベルを選択してください',
    'home.easy': '初級',
    'home.medium': '中級',
    'home.hard': '上級',
    'home.easyDesc': '基礎的なセキュリティ知識について学べます',
    'home.mediumDesc': '実践的なセキュリティ知識について学べます',
    'home.hardDesc': '高度なセキュリティ知識について学べます',
    'home.start': 'スタート',
    'home.duration': '所要時間 約3分',
    'home.random': '問題はランダムで出題されます',
    'home.selected': '選択中',
    
    // クイズ画面
    'quiz.loading': 'クイズを読み込み中...',
    'quiz.error': 'エラーが発生しました',
    'quiz.reload': '再読み込み',
    'quiz.noQuestions': '問題が見つかりません。',
    'quiz.question': '問題',
    'quiz.score': 'スコア',
    'quiz.correct': '正解です！',
    'quiz.incorrect': '不正解です',
    'quiz.nextQuestion': '次の問題へ',
    'quiz.security': 'セキュリティ',
    
    // 結果画面
    'result.title': '終了！',
    'result.difficulty': '難易度',
    'result.excellent': '素晴らしい！',
    'result.good': 'よくできました！',
    'result.fair': 'もう少し頑張りましょう',
    'result.needWork': '復習しましょう',
    'result.correct': '正解数',
    'result.total': '問題数',
    'result.percentage': '正答率',
    'result.answers': '解答結果',
    'result.yourAnswer': 'あなたの回答:',
    'result.correctAnswer': '正解:',
    'result.explanation': '解説:',
    'result.tryAgain': 'もう一度挑戦する',
    'result.home': 'ホームに戻る',
    'result.learningTips': 'さらなる学習のために',
    'result.loading': '結果を読み込み中...',
    
    // 共通
    'common.darkMode': 'ダークモード',
    'common.lightMode': 'ライトモード',
    'common.language': '言語',
  },
  en: {
    // Home screen
    'home.title': 'Ibaraki Police CSV',
    'home.subtitle': 'Learn practical security skills for daily life through hands-on problems',
    'home.selectDifficulty': 'Select Difficulty Level',
    'home.easy': 'Easy',
    'home.medium': 'Medium',
    'home.hard': 'Hard',
    'home.easyDesc': 'Basic security knowledge',
    'home.mediumDesc': 'Practical security measures',
    'home.hardDesc': 'Advanced security knowledge',
    'home.start': 'Start',
    'home.duration': 'Duration: 1-3 minutes',
    'home.random': 'Questions are randomly selected',
    'home.selected': 'Selected',
    
    // Quiz screen
    'quiz.loading': 'Loading quiz...',
    'quiz.error': 'An error occurred',
    'quiz.reload': 'Reload',
    'quiz.noQuestions': 'No questions found.',
    'quiz.question': 'Question',
    'quiz.score': 'Score',
    'quiz.correct': 'Correct!',
    'quiz.incorrect': 'Incorrect',
    'quiz.nextQuestion': 'Next Question',
    'quiz.security': 'Security',
    
    // Result screen
    'result.title': 'Quiz Complete!',
    'result.difficulty': 'Difficulty',
    'result.excellent': 'Excellent!',
    'result.good': 'Well done!',
    'result.fair': 'Keep trying!',
    'result.needWork': 'Need more practice',
    'result.correct': 'Correct',
    'result.total': 'Total',
    'result.percentage': 'Accuracy',
    'result.answers': 'Answer Results',
    'result.yourAnswer': 'Your answer:',
    'result.correctAnswer': 'Correct answer:',
    'result.explanation': 'Explanation:',
    'result.tryAgain': 'Try Again',
    'result.home': 'Back to Home',
    'result.learningTips': 'For Further Learning',
    'result.loading': 'Loading results...',
    
    // Common
    'common.darkMode': 'Dark Mode',
    'common.lightMode': 'Light Mode',
    'common.language': 'Language',
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja')
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    // ローカルストレージから設定を読み込み
    const savedLang = localStorage.getItem('language') as Language
    const savedTheme = localStorage.getItem('theme') as Theme
    
    if (savedLang) setLanguage(savedLang)
    if (savedTheme) setTheme(savedTheme)
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    // HTMLのクラスを更新
    document.documentElement.className = theme
  }, [theme])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ja']] || key
  }

  return (
    <AppContext.Provider value={{
      language,
      theme,
      setLanguage,
      setTheme,
      t
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
