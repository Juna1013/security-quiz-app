'use client'

import Link from 'next/link'
import { Shield, Play, Trophy } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* ヒーローセクション */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <Shield className="w-24 h-24 mx-auto text-blue-600 mb-4"/>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            サイバーセキュリティクイズ
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            楽しみながらセキュリティの知識を身につけよう！
            実践的な問題で、日常生活で役立つセキュリティスキルを学習できます
          </p>
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Play className="w-12 h-12 mx-auto text-green-600 mb-4"/>
          <h3 className="text-xl font-semibold mb-2">すぐに開始</h3>
          <p className="text-gray-600">
            ユーザー登録不要、アクセスするだけですぐにクイズを開始できます
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Trophy className="w-12 h-12 mx-auto text-yellow-600 mb-4"/>
          <h3 className="text-xl font-semibold mb-2">学習効果</h3>
          <p className="text-gray-600">
            各問題に詳しい解説付き、間違えても学習可能な設計
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Shield className="w-12 h-12 mx-auto text-blue-600 mb-4"/>
          <h3 className="text-xl font-semibold mb-2">実践的内容</h3>
          <p className="text-gray-600">
            日常生活で遭遇する実際のセキュリティ課題を題材にしています
          </p>
        </div>
      </div>

      {/* クイズ開始ボタン */}
      <div className="text-center">
        <Link
          href="/quiz"
          className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
        >
          <Play className="w-6 h-6 mr-2"/>
          クイズを開始する
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          所要時間: 約5-10分 | 問題数: 全3問
        </p>
      </div>
    </div>
  )
}
