# 竹島さんぽ — GamagoriTakeshima.com

蒲郡・竹島園地を中心に、竹島橋、八百富神社、社叢、竹島水族館、写真スポット、周辺グルメ、交通・駐車場を紹介する日本語観光サイトです。

## 技術構成

- Astro 7（静的出力）
- Tailwind CSS 4 + `@tailwindcss/vite`
- TypeScript
- pnpm
- Cloudflare Worker + Workers Static Assets
- データベース、ログイン、CMS、外部画像ホスティングなし
- Google Analytics 4: `G-HXM22WWPKP`
- 正規ドメイン: `https://gamagoritakeshima.com`

## ローカル起動

Node.js 22以上を使用します。

```bash
corepack enable
pnpm install
pnpm dev
```

開発サーバーのURLはターミナルに表示されます。

## 検証とビルド

```bash
# 依存関係なしで、画像・リンク・ドメイン・GA4などを確認
pnpm verify:source

# Astro / TypeScriptチェック
pnpm check

# 本番ビルド
pnpm build
pnpm preview

# 上記をまとめて実行
pnpm verify
```

静的ファイルは `dist/` に生成されます。

## Cloudflare Workers へデプロイ

初回のみCloudflareへログインします。

```bash
pnpm exec wrangler login
pnpm deploy
```

`wrangler.jsonc` は `dist/` を Workers Static Assets として配信し、`src/worker.ts` が次を処理します。

- `www` からルートドメインへの301リダイレクト
- Content Security Policyを含むセキュリティヘッダー
- HTML、画像、ハッシュ付きアセットのキャッシュ制御
- Cloudflareのカスタム404ページ配信

データベース、KV、D1、R2は使用しません。

### 独自ドメイン

`wrangler.jsonc` には次のCustom Domainを設定済みです。

```text
gamagoritakeshima.com
www.gamagoritakeshima.com
```

両ドメインを、デプロイに使うCloudflareアカウント内のゾーンとして管理してください。まだドメインをCloudflareへ追加していない段階でテストする場合は、`wrangler.jsonc` の `routes` を一時的に外すと `workers.dev` で確認できます。

## GitHub Actionsで自動デプロイ

`.github/workflows/deploy.yml` を同梱しています。GitHubリポジトリのActions secretsへ次を登録すると、`main` ブランチへのpushでビルド・デプロイされます。

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

API Tokenには対象Workerの編集権限と、Custom Domainを設定するために必要なゾーン権限を付与してください。

## 主なページ

```text
/
├── highlights/   見どころ
├── courses/      モデルコース
├── photography/  写真スポット・撮影マナー
├── food/         周辺グルメ
├── access/       交通・駐車場・バリアフリー
├── faq/          よくある質問
├── privacy/      プライバシーポリシー
├── credits/      写真クレジット・情報方針
├── sitemap.xml
└── 404
```

## コンテンツの編集

共通データは `src/data/site.ts` に集約しています。

- ナビゲーション
- 基本情報
- 見どころ
- モデルコース
- 飲食店
- FAQ
- 写真クレジット

ページ固有の文章とレイアウトは `src/pages/*.astro`、共通スタイルは `src/styles/global.css` にあります。

## 写真

すべて `public/images/` にローカル保存済みです。写真はWikimedia Commons上のライセンス可能な実景写真を使用し、Web表示向けに縮小・WebP化・トリミングしています。作者、原典、ライセンス、変更内容は次に記載しています。

- 公開サイトの `/credits/`
- `src/data/site.ts`
- `PHOTO-LICENSES.md`

写真を差し替える場合は、同じファイル名にするか、使用ページと `src/data/site.ts` のパスを変更してください。CC BY / CC BY-SA素材の差し替え・再利用時はクレジットとライセンス条件を維持してください。

## 更新時に確認する情報

次の情報は変わりやすいため、公開前と定期更新時に確認してください。

- 竹島水族館の料金・営業時間・臨時休館
- 八百富神社の社務所・御朱印受付
- 竹島園地駐車場の料金・利用制限
- 飲食店の営業時間・定休日・価格
- 祭礼、花火、潮干狩り、交通規制
- バスの運行会社・時刻表

`src/data/site.ts` の `updatedAt` と、各ページ内の確認日も更新してください。

## SEO・計測

- canonical、OG、Twitter Cardを共通レイアウトで生成
- `TouristAttraction`、`Park`、`Place`、`FAQPage`、`ItemList` のJSON-LD
- 静的な `sitemap.xml` ルート
- `robots.txt`
- GA4を `src/layouts/BaseLayout.astro` に実装
- ページ単位のtitle・description・OG画像

## 注意

本サイトは非公式観光ガイドとして設計しています。公式を誤認させる表現は使用せず、変動情報には確認日と注意書きを付けています。
