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
