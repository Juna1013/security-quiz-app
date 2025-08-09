import { XCircle, RefreshCw } from 'lucide-react';

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
            <div className="bg-red-50/10 border border-red-400/30 backdrop-blur-md rounded-lg p-6">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4"/>
                <h2 className="text-xl font-semibold text-red-300 mb-2">{title}</h2>
                <p className="text-red-200 mb-4">{message}</p>
                {onRetry && (
                    <button 
                        onClick={onRetry}
                        className="inline-flex items-center px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        再試行
                    </button>
                )}
            </div>
        </div>
    )
}
