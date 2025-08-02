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
