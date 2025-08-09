interface LoadingProps {
    message?: string
}

export default function Loading({ message = "読み込み中..."}: LoadingProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-slate-300">{message}</p>
            </div>
        </div>
    )
}
