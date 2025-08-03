# OpenAI Realtime Console

React + Vite アプリケーション（OpenAI Realtime API + WebRTC使用）

## 技術スタック

- **React 18.2** - UIライブラリ
- **Vite 5.0** - ビルドツール
- **TailwindCSS 3.4** - CSSフレームワーク
- **Express** - APIサーバー（Vercel Functions）
- **OpenAI Realtime API** - 音声会話機能
- **WebRTC** - リアルタイム通信

## プロジェクト構造

- `client/` - React フロントエンド
  - `components/` - UIコンポーネント
  - `services/` - API通信ロジック
  - `utils/` - ユーティリティ関数
- `api/` - Vercel Functions（Express API）

## 開発コマンド

- `npm run dev` - 開発サーバー起動（localhost:3000）
- `npm run build` - 本番ビルド
- `npm run lint` - ESLint実行

## 重要なポイント

- 日本語UI対応済み（デフォルト指示: "自然な日本語で応対します"）
- WebRTC経由でRealtime API接続
- Vercelデプロイ設定済み
- 環境変数 `.env` ファイルでOpenAI API Key設定必須