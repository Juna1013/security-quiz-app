// components/Settings.tsx
'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Moon, Sun, Globe, X } from 'lucide-react'
import { useApp } from '../src/contexts/AppContext'

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, theme, setLanguage, setTheme, t } = useApp()

  return (
    <>
      {/* 設定ボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 p-3 bg-slate-800/80 dark:bg-slate-800/80 light:bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-all duration-300 border border-slate-600/30 dark:border-slate-600/30 light:border-gray-200"
      >
        <SettingsIcon className="w-5 h-5 text-cyan-400 dark:text-cyan-400 light:text-gray-600" />
      </button>

      {/* 設定モーダル */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-slate-800/95 dark:bg-slate-800/95 light:bg-white/95 backdrop-blur-md rounded-xl p-6 max-w-sm w-full shadow-xl border border-slate-600/30 dark:border-slate-600/30 light:border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white dark:text-white light:text-gray-800">
                Settings
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light:hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400 dark:text-slate-400 light:text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* テーマ設定 */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 dark:text-slate-300 light:text-gray-700 mb-3">
                  Theme
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' 
                        : 'bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 text-slate-400 dark:text-slate-400 light:text-gray-600 border-slate-600/30 dark:border-slate-600/30 light:border-gray-200'
                    } border`}
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    {t('common.darkMode')}
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      theme === 'light' 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' 
                        : 'bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 text-slate-400 dark:text-slate-400 light:text-gray-600 border-slate-600/30 dark:border-slate-600/30 light:border-gray-200'
                    } border`}
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    {t('common.lightMode')}
                  </button>
                </div>
              </div>

              {/* 言語設定 */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 dark:text-slate-300 light:text-gray-700 mb-3">
                  {t('common.language')}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('ja')}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      language === 'ja' 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' 
                        : 'bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 text-slate-400 dark:text-slate-400 light:text-gray-600 border-slate-600/30 dark:border-slate-600/30 light:border-gray-200'
                    } border`}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    日本語
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      language === 'en' 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' 
                        : 'bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 text-slate-400 dark:text-slate-400 light:text-gray-600 border-slate-600/30 dark:border-slate-600/30 light:border-gray-200'
                    } border`}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
