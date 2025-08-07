// app/not-found.tsx
'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
            {/* メインコンテナ */}
            <div className="text-center max-w-md mx-auto">
                {/* 404テキスト */}
                <div className="relative mb-8">
                    <h1 className="text-8xl md:text-9xl font-extrabold text-gray-300 dark:text-gray-700 tracking-widest select-none">
                        404
                    </h1>
                    <div className="bg-gradient-to-r from-blue-600 to-sky-400 px-4 py-1 text-sm text-white rounded-lg rotate-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
                        Page Not Found
                    </div>
                </div>

                {/* エラーメッセージ */}
                <div className="mb-8 space-y-2">
                    <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
                        お探しのページが見つかりません
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">お探しのページは削除されたか、</p>
                    <p className="text-gray-600 dark:text-gray-400">URLが間違っている可能性があります。</p>
                </div>

                {/* アクションボタン */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-400 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        <svg 
                            className="w-4 h-4 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Homeに戻る
                    </Link>
                </div>

                {/* 追加情報 */}
                <div className="mt-12 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        こちらもお試しください：
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Link
                            href="/about"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            サイトについて
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link
                            href="/contact"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            お問い合わせ
                        </Link>
                    </div>
                </div>
            </div>

            {/* 装飾的要素 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-2 h-2 bg-blue-500 rounded-full opacity-50 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-1 h-1 bg-red-500 rounded-full opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-yellow-500 rounded-full opacity-40 animate-pulse delay-500"></div>
                <div className="absolute bottom-20 right-10 w-2 h-2 bg-green-500 rounded-full opacity-60 animate-pulse delay-700"></div>
            </div>
        </div>
    );
}