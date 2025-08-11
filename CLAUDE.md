# OpenAI Realtime Console

React + Vite + TypeScript アプリケーション（OpenAI Realtime API + WebRTC使用）

## このプロジェクトが実現すること

OpenAI Realtime APIとWebRTCを活用したリアルタイム音声会話アプリケーション。以下の機能を提供：

- **リアルタイム音声対話** - OpenAI GPTモデルとの自然な音声会話
- **日本語対応** - 日本語での音声認識・合成に最適化
- **ペルソナ設定** - 年齢、性別、職業、性格などの詳細なキャラクター設定
- **シーン設定** - 面談背景、関係性、時間帯、場所などの対話コンテキスト設定
- **低遅延通信** - WebRTCによる高品質でリアルタイムな音声通信
- **イベントログ** - 送受信されるAPIイベントのリアルタイム監視
- **複数音声選択** - alloy、nova等の異なる音声タイプ対応
- **履歴管理** - 過去の会話セッション記録と再生機能

主な用途：言語学習、ロールプレイング、カスタマーサービス訓練、音声アシスタント開発のプロトタイプなど

## 技術スタック

- **React 18.2** - UIライブラリ
- **TypeScript 5.0** - 型安全性とコード品質向上
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
- `npm run type-check` - TypeScript型チェック実行

## 重要なポイント

- **TypeScript化完了** - コードベース全体をTypeScriptに移行、型安全性とコード品質を向上
- 日本語UI対応済み（デフォルト指示: "自然な日本語で応対します"）
- WebRTC経由でRealtime API接続
- Vercelデプロイ設定済み
- 環境変数 `.env` ファイルでOpenAI API Key設定必須

## TypeScript移行詳細

### 移行されたファイル
- **ユーティリティファイル**: `auth.ts`, `voiceSelection.ts` - 型定義により安全な認証と音声選択
- **データファイル**: `presets.ts` - プリセット設定の厳密な型定義
- **サービスファイル**: `groq.ts` - Groq API通信の型安全化
- **APIファイル**: すべてのAPI関数をNextJS型定義で強化
- **設定ファイル**: `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`

### 型安全性の改善
- Interface定義により実行時エラーを大幅削減
- IDE支援によるコード補完と早期エラー検出
- リファクタリング時の安全性向上