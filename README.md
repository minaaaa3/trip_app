# Trip App ✈️

旅行の計画を立て、スポットを管理し、旅費の精算を簡単に行うためのトラベル管理アプリケーションです。

## 🌐 デプロイ情報
このプロジェクトは **Vercel** にデプロイされています。
- **URL:** [https://trip-app-kpck.vercel.app](https://trip-app-kpck.vercel.app)

## ✨ 主な機能

- **マジックリンクログイン**: パスワード不要。メールアドレスだけで安全にログインできます。
- **旅行プラン作成**: 行きたい場所（スポット）を登録し、旅行の行程を視覚的に管理。
- **スポット詳細管理**: メモ、URL、写真の追加が可能。
- **旅費精算（割り勘）**: 誰がいくら払ったかを記録し、メンバー間での精算をサポート。
- **招待機能**: 共有リンクを使って、友達や家族を同じ旅行プランに招待。

## 🛠 技術スタック

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS
- **Authentication**: Auth.js (NextAuth.js v5)
- **Database**: PostgreSQL (Prisma ORM)
- **Deployment**: Vercel
- **Email**: Nodemailer (Gmail SMTP)

## 🚀 ローカル開発セットアップ

1.  **リポジトリのクローン:**
    ```bash
    git clone <repository-url>
    cd trip-app
    ```

2.  **依存関係のインストール:**
    ```bash
    npm install
    # または
    pnpm install
    ```

3.  **環境変数の設定:**
    `.env` ファイルを作成し、以下の項目を設定してください。

    ```env
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/tripapp"

    # Next Auth
    AUTH_SECRET="your-random-secret"
    AUTH_TRUST_HOST=true

    # Email (Gmail)
    EMAIL_SERVER_USER="your-gmail@gmail.com"
    EMAIL_SERVER_PASSWORD="your-app-password"
    EMAIL_FROM="your-gmail@gmail.com"
    ```

4.  **データベースの同期:**
    ```bash
    npx prisma migrate dev
    ```

5.  **開発サーバーの起動:**
    ```bash
    npm run dev
    ```

## 📝 Vercel へのデプロイ手順

1. Vercel ダッシュボードで新しいプロジェクトを作成。
2. 上記の環境変数を設定。
   - `AUTH_TRUST_HOST` は必ず `true` に設定してください。
   - `EMAIL_SERVER_PASSWORD` は、Gmailの「アプリパスワード」を使用してください。
3. `npx prisma generate` をビルドコマンドに含める（現在の設定で自動化済み）。

---
Built with ❤️ for better travel experiences.
