// テーマ切り替え機能
(function () {
    // ローカルストレージからテーマを読み込む
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 保存されたテーマがある場合はそれを使用、なければシステム設定を使用
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    // テーマを適用
    function applyTheme(themeName) {
        if (themeName === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        updateThemeIcon(themeName);
        updateImages(themeName);
    }

    // 画像をテーマに応じて更新
    function updateImages(themeName) {
        const images = document.querySelectorAll('[data-light-icon][data-dark-icon]');
        images.forEach(img => {
            if (themeName === 'dark') {
                img.src = img.getAttribute('data-dark-icon');
            } else {
                img.src = img.getAttribute('data-light-icon');
            }
        });
    }

    // テーマアイコンを更新
    function updateThemeIcon(themeName) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            const sunPath = 'M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708';
            const moonPath = 'M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278';

            const path = themeIcon.querySelector('path');
            if (path) {
                path.setAttribute('d', themeName === 'dark' ? sunPath : moonPath);
            }
        }
    }

    // テーマ切り替え関数
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // 初期テーマを適用（即座に実行）
    applyTheme(theme);

    // ボタンのクリックイベントを設定
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }

    // DOMContentLoadedまたは即座に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    } else {
        initThemeToggle();
    }

    // グローバル関数として公開
    window.toggleTheme = toggleTheme;
})();

// ランダム記事表示機能
(function () {
    function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // ボタンスタイルでランダム記事を表示（404, single用）
    function renderSuggestButtons(containerId, articles, count = 2) {
        const container = document.getElementById(containerId);
        if (!container || !articles || articles.length === 0) return;

        const selected = shuffle(articles).slice(0, count);

        container.innerHTML = selected.map(article => `
            <a href="${article.url}" class="btn-outline suggest-link">
                <span class="suggest-link-content">
                    <span class="suggest-link-label">${article.section}</span>
                    <span class="suggest-link-title">${article.title}</span>
                </span>
            </a>
        `).join('');
    }

    // page-itemスタイルでランダム記事を表示（home用）
    function renderSuggestPageItems(containerId, articles, count = 4, showDescription = true) {
        const container = document.getElementById(containerId);
        if (!container || !articles || articles.length === 0) return;

        const selected = shuffle(articles).slice(0, count);

        container.innerHTML = selected.map(article => {
            const title = article.title || '';
            const initial = title ? title.charAt(0) : '';
            const rest = title ? title.slice(1) : '';
            const dateHtml = (article.date && article.section !== 'diary')
                ? `<time class="page-date"${article.datetime ? ` datetime="${article.datetime}"` : ''}>${article.date}</time>`
                : '';
            const descriptionHtml = showDescription
                ? (article.description
                    ? `<p class="page-description">${article.description}</p>`
                    : (article.summary ? `<div class="page-description">${article.summary}</div>` : ''))
                : '';
            const hrHtml = showDescription ? '<hr>' : '';

            return `
                <li class="page-item">
                    <a href="${article.url}" class="page-link">
                        <div class="page-header">
                            <h3 class="page-title">
                                <span class="initial">${initial}</span>${rest}
                            </h3>
                            ${dateHtml}
                        </div>
                        ${hrHtml}
                        ${descriptionHtml}
                    </a>
                </li>
            `;
        }).join('');
    }

    // グローバル関数として公開
    window.renderSuggestButtons = renderSuggestButtons;
    window.renderSuggestPageItems = renderSuggestPageItems;
})();
