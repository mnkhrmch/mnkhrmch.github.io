# TeX to HTML 変換システム

LaTeXファイルをHTMLに変換してHugoサイトで表示するためのシステムです。

## 必要なツール

- **TeX Live** (make4ht, LuaLaTeX含む)
- **Hugo** (extended版推奨)

### macOSでのインストール

```bash
# TeX Liveのインストール（MacTeX）
brew install --cask mactex

# または最小構成の場合
brew install --cask basictex
sudo tlmgr update --self
sudo tlmgr install make4ht tex4ht luatex tcolorbox tikz-cd physics
```

## ファイル構成

```
tex2html/
├── build.sh          # ビルドスクリプト
├── tex4ht.cfg        # make4ht設定ファイル
├── math-content.css  # 数学コンテンツ用CSS
└── README.md         # このファイル

preambles/
├── packages.tex                      # PDF用パッケージ
├── packages_html.tex                 # HTML用パッケージ
├── theorem_with_section_numbers.tex  # PDF用定理環境
├── theorem_with_section_numbers_html.tex  # HTML用定理環境
├── layout_for_harumichi.tex          # PDF用レイアウト
├── layout_for_harumichi_html.tex     # HTML用レイアウト
├── operators_and_letters.tex         # 演算子・記号定義（共通）
└── spare.tex                         # 予備（共通）
```

## 使い方

### 1. TeXファイルの準備

TeXファイルの先頭で`\HTMLMODE`の有無で分岐するようにします：

```latex
\ifdefined\HTMLMODE
  \documentclass[a4paper,11pt]{article}
\else
  \documentclass[a4paper,11pt]{jsarticle}
\fi

\ifdefined\HTMLMODE
  \input{preambles/packages_html.tex}
  \input{preambles/theorem_with_section_numbers_html.tex}
  \input{preambles/layout_for_harumichi_html.tex}
\else
  \input{preambles/packages.tex}
  \input{preambles/theorem_with_section_numbers.tex}
  \input{preambles/layout_for_harumichi.tex}
\fi
\input{preambles/operators_and_letters.tex}
\input{preambles/spare.tex}
```

### 2. tikz-cdなどの図の対応

tikz-cdなどの複雑な図は`lateximage`環境で囲みます：

```latex
\ifdefined\HTMLMODE
  \begin{lateximage}
    \begin{tikzcd}
      A \arrow[r] & B
    \end{tikzcd}
  \end{lateximage}
\else
  \[
    \begin{tikzcd}
      A \arrow[r] & B
    \end{tikzcd}
  \]
\fi
```

### 3. HTMLへの変換

```bash
# プロジェクトルートから実行
./tex2html/build.sh samples/19.tex content/math/csa/
```

### 4. Hugoページでの表示

ページバンドルのMarkdownファイルで`tex_content`ショートコードを使用：

```markdown
---
title: "中心的単純代数"
---

{{</* tex_content file="19.html" */>}}
```

## ページバンドル構成例

```
content/math/csa/
├── index.md          # Hugoのページファイル
├── index.tex         # LaTeXソースファイル
├── index.html        # 変換されたHTML（自動生成）
└── images/           # 図の画像（自動生成）
```

## GitHub Actionsでの自動変換

`.github/workflows/hugo.yml`に変換ステップが設定されています。
mainブランチにプッシュすると自動的にTeXファイルがHTMLに変換されます。

## トラブルシューティング

### make4htがエラーになる場合

1. 必要なパッケージがインストールされているか確認：
   ```bash
   tlmgr list --only-installed
   ```

2. 不足パッケージのインストール：
   ```bash
   sudo tlmgr install <package-name>
   ```

### 数式が表示されない場合

- MathJaxが正しく読み込まれているか確認
- ブラウザのコンソールでエラーを確認
