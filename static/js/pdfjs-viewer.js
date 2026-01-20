// PDF.jsを使って、.pdfjs-viewer 要素内に全ページを描画する
(function () {
    const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.min.js';

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                existing.addEventListener('load', () => resolve());
                if (existing.complete || existing.readyState === 'loaded' || existing.readyState === 'complete') {
                    resolve();
                }
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load ' + src));
            document.head.appendChild(script);
        });
    }

    async function initPdfJsViewers() {
        const containers = document.querySelectorAll('.pdfjs-viewer');
        if (!containers.length) return;

        try {
            await loadScript(PDFJS_CDN);
        } catch (e) {
            console.error(e);
            containers.forEach(c => {
                c.innerHTML = '<p style="color:red;">PDFビューアの読み込みに失敗しました。</p>';
            });
            return;
        }

        if (!window['pdfjsLib']) {
            console.error('pdfjsLib not found');
            containers.forEach(c => {
                c.innerHTML = '<p style="color:red;">PDF.jsが利用できません。</p>';
            });
            return;
        }

        // worker は同じCDNから読み込む
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js';

        containers.forEach(async (container) => {
            const url = container.getAttribute('data-pdf-url');
            if (!url) return;

            container.innerHTML = '';
            const viewer = document.createElement('div');
            viewer.className = 'pdfjs-pages';
            container.appendChild(viewer);

            try {
                const loadingTask = pdfjsLib.getDocument(url);
                const pdf = await loadingTask.promise;

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    canvas.className = 'pdfjs-page-canvas';
                    const context = canvas.getContext('2d');

                    const outputScale = window.devicePixelRatio || 1;
                    canvas.width = Math.floor(viewport.width * outputScale);
                    canvas.height = Math.floor(viewport.height * outputScale);
                    canvas.style.width = Math.floor(viewport.width) + 'px';
                    canvas.style.height = Math.floor(viewport.height) + 'px';

                    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

                    viewer.appendChild(canvas);

                    await page.render({
                        canvasContext: context,
                        transform,
                        viewport,
                    }).promise;
                }
            } catch (e) {
                console.error(e);
                container.innerHTML = '<p style="color:red;">PDFの表示に失敗しました。</p>';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPdfJsViewers);
    } else {
        initPdfJsViewers();
    }
})();
