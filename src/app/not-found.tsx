// app/not-found.tsx

import Link from 'next/link';

export default function NotFound() {
    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
        <h1 className="text-9xl font-extrabold text-gray-800 dark:text-gray-200 tracking-widest">404</h1>
        <div className="bg-blue-500 px-2 text-sm rounded rotate-12 absolute">Page Not Found</div>
        <p className="mt-4 text-center text-lg">お探しのページは、どうやら迷子になってしまったようです。</p>
        <Link href="/">
            <a className="mt-6 px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300">
                トップページに戻る
            </a>
        </Link>
    </div>
    );
}