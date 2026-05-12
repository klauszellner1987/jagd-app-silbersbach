// ============================================================================
// core/ui/index.js — Toasts + Bestätigungs-Modal (DOM-only)
// Brücke: initBridge() setzt window.showToast / window.showConfirm, damit
// Monolith und Legacy-onclick unverändert bleiben.
// Erwartete DOM-IDs: toast-container, confirm-modal, confirm-title,
// confirm-message, confirm-ok-btn, confirm-cancel-btn
// ============================================================================

/**
 * @param {string} message
 * @param {'info'|'success'|'error'|'delete'} [type]
 * @param {string|null} [icon]
 */
export function showToast(message, type = 'info', icon = null) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const defaultIcons = {
        info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
        success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        delete: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
    };

    const iconSvg = icon || defaultIcons[type] || defaultIcons.info;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${iconSvg}</span><span class="toast-message">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/**
 * @param {string} message
 * @param {string} [title]
 * @param {string} [okText]
 * @returns {Promise<boolean>}
 */
export function showConfirm(message, title = 'Bestätigung', okText = 'Löschen') {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirm-modal');
        const titleEl = document.getElementById('confirm-title');
        const messageEl = document.getElementById('confirm-message');
        const okBtn = document.getElementById('confirm-ok-btn');
        const cancelBtn = document.getElementById('confirm-cancel-btn');

        if (!modal || !titleEl || !messageEl || !okBtn || !cancelBtn) {
            resolve(typeof globalThis.confirm === 'function' ? globalThis.confirm(message) : false);
            return;
        }

        titleEl.textContent = title;
        messageEl.textContent = message;
        okBtn.textContent = okText;
        modal.classList.remove('hidden');

        const cleanup = () => {
            modal.classList.add('hidden');
            okBtn.onclick = null;
            cancelBtn.onclick = null;
        };

        okBtn.onclick = () => {
            cleanup();
            resolve(true);
        };

        cancelBtn.onclick = () => {
            cleanup();
            resolve(false);
        };
    });
}

export const uiCore = {
    showToast,
    showConfirm,

    /** Synchron am Ende von main.js — vor Monolith-initAll / Feature-Code. */
    initBridge() {
        window.showToast = showToast;
        window.showConfirm = showConfirm;
    },

    initUI() {
        this.initBridge();
    },
};
