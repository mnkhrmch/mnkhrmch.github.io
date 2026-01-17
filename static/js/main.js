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
            themeIcon.textContent = themeName === 'dark' ? '☀' : '☽';
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
