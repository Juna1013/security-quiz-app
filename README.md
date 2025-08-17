# 茨城県警 CSV

- 茨城県警のサイバーセキュリティボランティアの啓発イベントにて出展するため

### 機能紹介

- クイズの出題と回答受付
- 回答への即時フィードバックと正解表示
- 結果画面（成績やメッセージの表示など）
- データ管理：quizzes.json による問題データ構成

### 技術スタック

- フレームワーク：Next.js（TypeScript）
- スタイリング：Tailwind CSS
- データ：public/data/quizzes.json を利用したクイズデータ
- 開発環境設定：ESLint, PostCSS

### ディレクトリ構造

```json
.
├── components/
│   ├── ErrorMessage.tsx
│   └── Loading.tsx
├── docs/
├── lib/
│   └── useQuiz.ts
├── public/
│   └── data/
│       └── quizzes.json
├── src/
│   └── app/
│       ├── quiz/
│       │   └── page.tsx
│       ├── result/
│       │   ├── error.tsx
│       │   ├── page.tsx
│       │   └── not-found.tsx
│       └── globals.css
│       └── layout.tsx
│       └── page.tsx
├── types/
│   └── quiz.ts
├── README.md
├── package.json
├── tsconfig.json
└── (その他設定ファイル)
```

## セットアップ

### 必須事項
- Node.js v18 以上
- npm または yarn

### インストール
```bash
git clone https://github.com/Juna1013/security-quiz-app.git
cd security-quiz-app
npm install  # または yarn install
```

### 実行
```bash
npm run dev  # または yarn dev
```

### ビルド
```bash
npm run build && npm run start
```
