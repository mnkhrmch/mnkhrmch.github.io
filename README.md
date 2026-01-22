# Manaka Website

真中遥道のウェブサイト

## 基本コマンド

```bash
# 開発サーバーを起動（ http://localhost:1313 ）
hugo server

# 本番用ビルド（publicディレクトリに出力）
hugo

# 新しい記事を作成
hugo new diary/2026-01-21.md
hugo new literature/記事タイトル.md
hugo new math/記事タイトル/index.md
```

## ディレクトリ構成

```
content/
├── _index.md          # トップページ
├── diary/             # 日記
├── literature/        # 文学作品
└── math/              # 数学記事
```

## 記事の作成

### Front Matter

各記事の先頭に以下のメタデータを記述します：

```yaml
---
title: "記事タイトル"
date: 2026-01-21T12:00:00+09:00
draft: false
description: "記事の説明（省略可）"
---
```

- `title`: 記事のタイトル
- `date`: 作成日時
- `draft`: `true`にすると非公開（デフォルト: `false`）
- `description`: 記事一覧に表示される説明文（省略時は本文から自動生成）

### ファイル名の規則

- **diary**: `2026-01-21.md`（日付形式）
- **literature**: `記事タイトル.md` または `article-title.md`
- **math**: `記事タイトル/index.md`（Page Bundleとして作成するとPDF等を同梱可能）

### URLについて

- ファイル名がそのままURLになる
- `slug`でURLを上書き可能：
  ```yaml
  slug: "custom-url-path"
  ```

## Markdown記法

### 基本

```markdown
# 見出し1（h1/h2は最初の1文字が装飾される）
## 見出し2
### 見出し3

**太字**
*斜体*

- リスト項目
- リスト項目

1. 番号付きリスト
2. 番号付きリスト

> 引用

[リンクテキスト](https://example.com)

`インラインコード`
```

### 画像

```markdown
<!-- キャプション付き（altテキストが画像下に中央揃えで表示される） -->
![キャプションテキスト](image.jpg)

<!-- キャプションなし -->
![altテキスト](image.jpg "no-caption")

<!-- キャプション付き + ツールチップ -->
![キャプションテキスト](image.jpg "ツールチップ")
```

### 水平線

```markdown
---
```

### 中央揃え

```html
<p style="text-align: center;">中央揃えのテキスト</p>
```

## Shortcodes（このサイト固有）

### PDFリンク

Page Bundle（`index.md`形式）の記事でPDFへのリンクを表示：

```markdown
{{</* pdf_link file="document.pdf" */>}}
```

### PDF埋め込み

Page Bundle内のPDFをページに埋め込み表示：

```markdown
{{</* pdf_embed file="document.pdf" */>}}
```

**注意**: PDFファイルは`index.md`と同じディレクトリに配置する必要があります。

```
content/math/記事タイトル/
├── index.md
└── document.pdf
```

## サイト固有の装飾

### 見出しの装飾

h1とh2は最初の1文字が自動的に装飾されます（`initial`クラス）。

### diaryセクションの日付

diaryセクションでは、記事ページおよび記事一覧で日付が非表示になります（タイトル自体が日付のため）。

### 前後の記事ナビゲーション

記事ページ下部の「前の記事」「次の記事」は、同じセクション内の記事に限定されています。

## 設定ファイル

### config/_default/params.toml

```toml
# サマリーの表示文字数
summary_length = 100

# ホームページで表示する最近の記事数
recent_posts_count = 5
```

## 便利なTips

### 下書きの確認

```bash
hugo server -D
```

`-D`オプションで`draft: true`の記事も表示されます。

### Page Bundle

画像やPDFを記事と一緒に管理したい場合は、ディレクトリ形式で作成：

```
content/math/my-article/
├── index.md      # 記事本文
├── image.jpg     # 画像（![](image.jpg)で参照）
└── document.pdf  # PDF（shortcodeで参照）
```
