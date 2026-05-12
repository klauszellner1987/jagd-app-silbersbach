// ============================================================================
// features/bulletin/index.js
// ----------------------------------------------------------------------------
// Schwarzes Brett (Bulletin Board) - Liste, Preview, Badge, Statistik.
//
// Lifecycle:
//   onLogin(user)        -> Snapshot-Listener starten, currentUser merken
//   onLogout()           -> Snapshot beenden, State zuruecksetzen
//   initUI()             -> Submit-Forms binden, Event-Delegation fuer
//                            Done/Delete; idempotent
//   renderStatsDetail()  -> rendert nur den `#stats-detail-bulletin` Bereich
//                            (vom Monolith aus dem Stats-Modal aufgerufen)
//
// Fremde Globals die wir nutzen (bleiben im Monolith):
//   - window.showToast(message, level)
//   - window.showConfirm(message, title, button) -> Promise<boolean>
//   - window.toggleDashboardFeed('bulletin')
//   - window.firebase.auth().currentUser
// ============================================================================

import { bulletinRepo } from '../../data/bulletinRepo.js';
import {
    DASHBOARD_PREVIEW_LIMIT,
    formatBulletinDate,
    filterOpenItems,
    sortByTimestampDesc,
    escapeHtml,
} from './bulletin.pure.js';

const state = {
    user: null,
    snapshotUnsub: null,
    listenersAttached: false,
    currentOpenItems: [],
};

function safeToast(msg, level) {
    if (typeof window.showToast === 'function') {
        try { window.showToast(msg, level); } catch (_) { /* ignore */ }
    }
}

async function safeConfirm(msg, title, btn) {
    if (typeof window.showConfirm === 'function') {
        try { return await window.showConfirm(msg, title, btn); } catch (_) { return false; }
    }
    return window.confirm ? window.confirm(msg) : false;
}

function getCurrentSenderName() {
    try {
        const user = window.firebase?.auth?.().currentUser;
        if (!user) return 'Unbekannt';
        return user.displayName || (user.email ? user.email.split('@')[0] : 'Unbekannt');
    } catch (_) {
        return 'Unbekannt';
    }
}

function renderItemCard(item) {
    const date = formatBulletinDate(item.timestamp);
    const sender = escapeHtml(item.sender || 'Unbekannt');
    const message = escapeHtml(item.message || '');
    const id = escapeHtml(item.id);
    return `
        <div class="bulletin-item-header">
            <span class="bulletin-item-sender">${sender}</span>
            <span class="bulletin-item-date">${date}</span>
        </div>
        <div class="bulletin-item-content">${message}</div>
        <div style="text-align: right; margin-top: 0.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="bulletin-done-btn" data-id="${id}" title="Erledigt">
                <i class="ti ti-check"></i> Erledigt
            </button>
            <button class="bulletin-delete-btn" data-id="${id}" aria-label="Löschen">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    `;
}

function renderPreviewCard(item) {
    const id = escapeHtml(item.id);
    const message = escapeHtml(item.message || '');
    return `
        <span class="bulletin-preview-text">${message}</span>
        <div class="bulletin-preview-actions">
            <button class="bulletin-done-btn-sm" data-id="${id}" title="Erledigt">
                <i class="ti ti-check"></i>
            </button>
            <button class="bulletin-delete-btn-sm" data-id="${id}" title="Löschen">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    `;
}

function renderLists(items) {
    const bulletinList = document.getElementById('bulletin-list');
    const dashboardList = document.getElementById('bulletin-list-dashboard');
    const bulletinBadge = document.getElementById('bulletin-badge');
    const bulletinPreview = document.getElementById('bulletin-preview');

    if (bulletinList) {
        bulletinList.innerHTML = '';
        if (items.length === 0) {
            bulletinList.innerHTML = '<p class="bulletin-empty">Keine Nachrichten vorhanden.</p>';
        } else {
            items.forEach((item) => {
                const el = document.createElement('div');
                el.className = 'bulletin-item';
                el.innerHTML = renderItemCard(item);
                bulletinList.appendChild(el);
            });
        }
    }

    if (dashboardList) {
        dashboardList.innerHTML = '';
        if (items.length === 0) {
            dashboardList.innerHTML = '<p class="bulletin-empty">Keine Nachrichten vorhanden.</p>';
        } else {
            items.slice(0, DASHBOARD_PREVIEW_LIMIT).forEach((item) => {
                const el = document.createElement('div');
                el.className = 'bulletin-item';
                el.innerHTML = renderItemCard(item);
                dashboardList.appendChild(el);
            });
        }
    }

    if (bulletinBadge) {
        bulletinBadge.textContent = String(items.length);
        bulletinBadge.classList.toggle('hidden', items.length === 0);
    }

    if (bulletinPreview) {
        bulletinPreview.innerHTML = '';
        if (items.length === 0) {
            bulletinPreview.innerHTML = '<p class="bulletin-empty">Keine neuen Aushänge...</p>';
        } else {
            items.slice(0, DASHBOARD_PREVIEW_LIMIT).forEach((item) => {
                const el = document.createElement('div');
                el.className = 'bulletin-preview-item';
                el.innerHTML = renderPreviewCard(item);
                bulletinPreview.appendChild(el);
            });
        }
    }
}

function renderStatsDetailInternal() {
    const bulletinContainer = document.getElementById('stats-detail-bulletin');
    if (!bulletinContainer) return;

    const openItems = state.currentOpenItems;
    let html = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
    if (!openItems.length) {
        html += "<p style='opacity:0.5'>Keine offenen Aufgaben.</p>";
    } else {
        openItems.forEach((item) => {
            const message = escapeHtml(item.message || '');
            const sender = escapeHtml(item.sender || 'Unbekannt');
            html += `
                <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 0.9rem;">
                    <div style="font-weight: 500; margin-bottom: 4px;">${message}</div>
                    <div style="font-size: 0.75rem; opacity: 0.5;">Von ${sender}</div>
                </div>
            `;
        });
    }
    html += '</div>';
    bulletinContainer.innerHTML = html;
}

async function handleDoneClick(id) {
    if (!id) return;
    try {
        await bulletinRepo.markDone(id);
        safeToast('Aushang als erledigt markiert', 'success');
    } catch (err) {
        console.error('[bulletin] markDone error:', err);
        safeToast('Fehler beim Aktualisieren', 'error');
    }
}

async function handleDeleteClick(id, { confirm = true } = {}) {
    if (!id) return;
    if (confirm) {
        const ok = await safeConfirm('Aushang unwiderruflich löschen?', 'Aushang löschen', 'Löschen');
        if (!ok) return;
    }
    try {
        await bulletinRepo.delete(id);
        safeToast('Aushang gelöscht', 'delete');
    } catch (err) {
        console.error('[bulletin] delete error:', err);
        safeToast('Fehler beim Löschen', 'error');
    }
}

function attachContainerDelegation(container) {
    if (!container || container.dataset.bulletinDelegated === '1') return;
    container.dataset.bulletinDelegated = '1';

    container.addEventListener('click', async (e) => {
        const target = e.target;
        if (!target || typeof target.closest !== 'function') return;

        const previewText = target.closest('.bulletin-preview-text');
        if (previewText && container.contains(previewText)) {
            if (typeof window.toggleDashboardFeed === 'function') {
                window.toggleDashboardFeed('bulletin');
            }
            return;
        }

        const doneBtn = target.closest('.bulletin-done-btn') || target.closest('.bulletin-done-btn-sm');
        if (doneBtn && container.contains(doneBtn)) {
            e.stopPropagation();
            await handleDoneClick(doneBtn.dataset.id);
            return;
        }

        const deleteBtn = target.closest('.bulletin-delete-btn') || target.closest('.bulletin-delete-btn-sm');
        if (deleteBtn && container.contains(deleteBtn)) {
            e.stopPropagation();
            await handleDeleteClick(deleteBtn.dataset.id);
        }
    });
}

async function handleSubmit({ inputEl, buttonEl, busyLabel = 'Wird gesendet...' }) {
    if (!inputEl) return;
    const msg = inputEl.value.trim();
    if (!msg) return;

    const originalContent = buttonEl ? buttonEl.innerHTML : null;
    if (buttonEl) {
        buttonEl.disabled = true;
        if (originalContent && busyLabel) {
            buttonEl.innerHTML = busyLabel;
        }
    }

    try {
        await bulletinRepo.add({
            message: msg,
            sender: getCurrentSenderName(),
        });
        inputEl.value = '';
        safeToast('Aushang erfolgreich erstellt', 'success');
    } catch (err) {
        console.error('[bulletin] submit error:', err);
        safeToast('Fehler beim Senden', 'error');
    } finally {
        if (buttonEl) {
            buttonEl.disabled = false;
            if (originalContent !== null) buttonEl.innerHTML = originalContent;
        }
    }
}

export const bulletinFeature = {
    /**
     * Wird vom Bootstrap nach erfolgreichem Auth-State aufgerufen.
     * @param {{ uid: string, displayName?: string, email?: string }} user
     */
    onLogin(user) {
        this.onLogout();
        state.user = user;

        const hasAnyContainer = !!(
            document.getElementById('bulletin-list')
            || document.getElementById('bulletin-preview')
            || document.getElementById('bulletin-list-dashboard')
        );
        if (!hasAnyContainer) return;

        state.snapshotUnsub = bulletinRepo.streamAll(
            (allItems) => {
                const items = sortByTimestampDesc(filterOpenItems(allItems));
                state.currentOpenItems = items;
                renderLists(items);
                renderStatsDetailInternal();
            },
            (err) => {
                console.error('[bulletin] snapshot error:', err);
            },
        );
    },

    /**
     * Cleant Snapshot, setzt State zurueck. Idempotent.
     */
    onLogout() {
        if (typeof state.snapshotUnsub === 'function') {
            try { state.snapshotUnsub(); } catch (_) { /* ignore */ }
        }
        state.snapshotUnsub = null;
        state.currentOpenItems = [];
        state.user = null;
    },

    /**
     * Bindet Submit-Forms + Event-Delegation fuer Done/Delete.
     * Wird vom Monolith-`initAll()` einmalig aufgerufen.
     */
    initUI() {
        if (state.listenersAttached) return;
        state.listenersAttached = true;

        const submitBtn = document.getElementById('bulletin-submit-btn');
        const input = document.getElementById('bulletin-input');
        if (submitBtn && input) {
            submitBtn.addEventListener('click', () => {
                handleSubmit({ inputEl: input, buttonEl: submitBtn });
            });
        }

        const submitDashboard = document.getElementById('bulletin-submit-dashboard');
        const inputDashboard = document.getElementById('bulletin-input-dashboard');
        if (submitDashboard && inputDashboard) {
            submitDashboard.addEventListener('click', () => {
                handleSubmit({ inputEl: inputDashboard, buttonEl: submitDashboard, busyLabel: '' });
            });
        }

        attachContainerDelegation(document.getElementById('bulletin-list'));
        attachContainerDelegation(document.getElementById('bulletin-list-dashboard'));
        attachContainerDelegation(document.getElementById('bulletin-preview'));
    },

    /**
     * Bridge fuer den Monolith: rendert nur die Stats-Detail-Sektion neu.
     * Wird von window.renderDetailStats() aufgerufen.
     */
    renderStatsDetail() {
        renderStatsDetailInternal();
    },

    // Fuer Tests: erlaubt es State zwischen Tests zu lesen/zuruecksetzen.
    // Nicht Teil der offiziellen Bridge-API.
    __test__: {
        getState() { return state; },
        renderLists,
        renderStatsDetailInternal,
        handleSubmit,
        handleDoneClick,
        handleDeleteClick,
    },
};
