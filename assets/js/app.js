/* global CSRF_TOKEN, IS_LOGGED_IN */
'use strict';

(function () {
    // ---- Like button -------------------------------------------------------
    const likeBtn    = document.getElementById('like-btn');
    const likeCount  = document.getElementById('like-count');

    if (likeBtn) {
        likeBtn.addEventListener('click', async () => {
            if (!IS_LOGGED_IN) {
                window.location.href = 'login.php';
                return;
            }

            const quoteId = parseInt(likeBtn.dataset.quoteId, 10);
            likeBtn.disabled = true;

            try {
                const res = await fetch('api/like.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        quote_id:   quoteId,
                        csrf_token: CSRF_TOKEN,
                    }),
                });

                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    console.error('Like failed:', err);
                    return;
                }

                const data = await res.json();
                likeCount.textContent = data.like_count;

                if (data.liked) {
                    likeBtn.classList.add('liked');
                    likeBtn.setAttribute('aria-pressed', 'true');
                } else {
                    likeBtn.classList.remove('liked');
                    likeBtn.setAttribute('aria-pressed', 'false');
                }
            } catch (e) {
                console.error('Network error:', e);
            } finally {
                likeBtn.disabled = false;
            }
        });
    }

    // ---- Share button ------------------------------------------------------
    const shareBtn = document.getElementById('share-btn');
    const toast    = document.getElementById('share-toast');

    if (shareBtn && toast) {
        shareBtn.addEventListener('click', () => {
            const quoteText = shareBtn.dataset.quote || '';

            if (navigator.share) {
                // Use native Web Share API if available.
                navigator.share({
                    title: 'Quotely',
                    text:  quoteText,
                    url:   window.location.href,
                }).catch(() => {
                    // User cancelled or API not supported – fall back to clipboard.
                    copyToClipboard(quoteText);
                });
            } else {
                copyToClipboard(quoteText);
            }
        });
    }

    /**
     * Copy text to clipboard and show a toast notification.
     * @param {string} text
     */
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => showToast()).catch(fallbackCopy);
        } else {
            fallbackCopy(text);
        }
    }

    /**
     * Fallback clipboard copy using a temporary textarea.
     * @param {string} text
     */
    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = typeof text === 'string' ? text : (shareBtn ? shareBtn.dataset.quote : '');
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
            document.execCommand('copy');
            showToast();
        } catch (e) {
            console.error('Copy failed', e);
        }
        document.body.removeChild(ta);
    }

    /**
     * Show a brief toast notification.
     * @param {string} [msg] – optional message override
     */
    function showToast(msg) {
        if (!toast) return;
        if (msg) toast.textContent = msg;
        toast.removeAttribute('hidden');
        // Force reflow.
        void toast.offsetWidth;
        toast.classList.add('visible');
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.setAttribute('hidden', ''), 300);
        }, 2000);
    }

    // ---- Next Quote button ------------------------------------------------
    const nextBtn   = document.getElementById('next-btn');
    const quoteCard = document.getElementById('quote-card');

    if (nextBtn && quoteCard) {
        nextBtn.addEventListener('click', async () => {
            nextBtn.disabled = true;
            nextBtn.innerHTML = '<span class="spinner"></span>';

            try {
                const res = await fetch('api/random_quote.php');
                if (!res.ok) {
                    console.error('Failed to fetch quote');
                    return;
                }
                const q = await res.json();
                renderQuote(q);
            } catch (e) {
                console.error('Network error:', e);
            } finally {
                nextBtn.disabled = false;
                nextBtn.innerHTML = 'Next Quote →';
            }
        });
    }

    /**
     * Render a freshly fetched quote into the page without a full reload.
     * @param {{ id: number, text: string, author: string, submitted_by: string, like_count: number, user_liked: number }} q
     */
    function renderQuote(q) {
        const textEl      = document.getElementById('quote-text');
        const authorEl    = document.getElementById('quote-author');
        const submittedEl = document.getElementById('quote-submitted');

        if (textEl)      textEl.textContent     = '\u201C' + q.text + '\u201D';
        if (authorEl)    authorEl.textContent   = '— ' + q.author;
        if (submittedEl) submittedEl.innerHTML  = 'Shared by <strong>' + escapeHtml(q.submitted_by) + '</strong>';

        // Update like button.
        if (likeBtn) {
            likeBtn.dataset.quoteId = q.id;
            if (q.user_liked) {
                likeBtn.classList.add('liked');
                likeBtn.setAttribute('aria-pressed', 'true');
            } else {
                likeBtn.classList.remove('liked');
                likeBtn.setAttribute('aria-pressed', 'false');
            }
            if (likeCount) likeCount.textContent = q.like_count;
        }

        // Update share button text.
        if (shareBtn) {
            shareBtn.dataset.quote = '\u201C' + q.text + '\u201D \u2014 ' + q.author;
        }
    }

    /**
     * Minimal HTML escape for dynamic content.
     * @param {string} str
     * @returns {string}
     */
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ---- "Quote added" success message ------------------------------------
    const params = new URLSearchParams(window.location.search);
    if (params.get('added') === '1') {
        showToast('Quote added successfully!');
        // Clean up URL.
        history.replaceState({}, '', window.location.pathname);
    }
}());
