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
        
        // iOS Safari対応: bodyの背景色を明示的に設定（CSS変数の更新を強制）
        const body = document.body;
        if (body) {
            // CSS変数の更新を待ってから値を取得
            requestAnimationFrame(() => {
                const computedStyle = getComputedStyle(body);
                const bgColor = computedStyle.getPropertyValue('--color-bg').trim();
                if (bgColor) {
                    body.style.backgroundColor = bgColor;
                } else {
                    // フォールバック: 直接値を設定
                    body.style.backgroundColor = themeName === 'dark' ? '#1a1a1a' : '#ffffff';
                }
            });
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
