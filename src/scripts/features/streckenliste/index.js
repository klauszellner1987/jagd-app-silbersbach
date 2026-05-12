// ============================================================================
// features/streckenliste/index.js
// ----------------------------------------------------------------------------
// Streckenliste (entries): Live-Liste, Modal, Fotos, Dashboard-Spiegel,
// Excel-Export, Statistikteile im Modal.
//
// MonolithGlobals (bis Wildarten woanders liegt):
//   window.jagdzeitenBayern, window.getWildartIconHTML
//   window.showToast, window.showConfirm, window.XLSX
//
// window.openImageModal wird in initUI() gesetzt (wie Legacy).
// ============================================================================

import { entriesRepo } from '../../data/entriesRepo.js';
import {
    aggregateWildartenCounts,
    aggregateRehwildUnterarten,
    buildExcelExportRows,
    escapeHtml,
} from './streckenliste.pure.js';

const MAX_IMAGE_BASE64_CHARS = 750_000;

const state = {
    user: null,
    snapshotUnsub: null,
    listenersAttached: false,
    currentEntries: [],
};

function safeToast(msg, level) {
    if (typeof window.showToast === 'function') {
        try { window.showToast(msg, level); } catch (_) {}
    }
}

async function safeConfirm(msg, title, btn) {
    if (typeof window.showConfirm === 'function') {
        try { return await window.showConfirm(msg, title, btn); } catch (_) { return false; }
    }
    return window.confirm ? window.confirm(msg) : false;
}

function jagdCatalog() {
    return Array.isArray(window.jagdzeitenBayern) ? window.jagdzeitenBayern : [];
}

function wildartIconHTML(iconClass, size) {
    if (typeof window.getWildartIconHTML === 'function') {
        const html = window.getWildartIconHTML(iconClass, size);
        if (html) return html;
    }
    return '<span style="font-size: 20px;">🦌</span>';
}

function compressEntryPhotoToBase64(file, maxWidth = 600, quality = 0.6) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function updateDashboardCounters(entries) {
    const streckeCountEl = document.getElementById('strecke-count');
    if (streckeCountEl) streckeCountEl.textContent = String(entries.length);
    const rehwildCountEl = document.getElementById('rehwild-count');
    if (rehwildCountEl) {
        rehwildCountEl.textContent = String(entries.filter((e) => e.wildart === 'Rehwild').length);
    }
}

function renderStatsDetailInternal() {
    const streckeContainer = document.getElementById('stats-detail-strecke');
    const rehwildContainer = document.getElementById('stats-detail-rehwild');
    const entries = state.currentEntries;
    const sortedStats = Object.entries(aggregateWildartenCounts(entries)).sort((a, b) => b[1] - a[1]);

    if (streckeContainer) {
        let html = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
        if (!sortedStats.length) {
            html += '<p style=\'opacity:0.5\'>Keine Daten vorhanden.</p>';
        } else {
            sortedStats.forEach(([art, count]) => {
                const ae = escapeHtml(art);
                html += `<div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;"><span>${ae}</span><span style="font-weight: bold; color: var(--primary-light);">${count}</span></div>`;
            });
        }
        html += '</div>';
        streckeContainer.innerHTML = html;
    }

    const sortedReh = Object.entries(aggregateRehwildUnterarten(entries)).sort((a, b) => b[1] - a[1]);
    if (rehwildContainer) {
        let rehHTML = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
        if (!sortedReh.length) {
            rehHTML += '<p style=\'opacity:0.5\'>Keine Daten vorhanden.</p>';
        } else {
            sortedReh.forEach(([kat, count]) => {
                const ek = escapeHtml(kat);
                rehHTML += `<div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;"><span>${ek}</span><span style="font-weight: bold; color: var(--primary-light);">${count}</span></div>`;
            });
        }
        rehHTML += '</div>';
        rehwildContainer.innerHTML = rehHTML;
    }
}

function renderEntriesInternal() {
    const entryList = document.getElementById('entry-list');
    const dashboardList = document.getElementById('entry-list-dashboard');
    if (entryList) entryList.innerHTML = '';
    if (dashboardList) dashboardList.innerHTML = '';

    const entries = state.currentEntries;
    const catalog = jagdCatalog();

    entries.forEach((entry, idx) => {
        const li = document.createElement('li');
        li.className = 'entry-item';

        const wildartData = catalog.find((w) => w.name === entry.wildart || w.id === entry.wildart);
        const iconHTML = wildartData ? wildartIconHTML(wildartData.iconClass, 28) : '<span style="font-size: 20px;">🦌</span>';

        const header = document.createElement('div');
        header.className = 'feed-card-header';
        
        const wt = escapeHtml(entry.wildart || '');
        const ua = escapeHtml(entry.unterart || '');
        const datum = escapeHtml(entry.datum || '');
        const erl = escapeHtml(entry.erleger || '');
        
        header.innerHTML = `
            <div class="feed-card-icon-container">${iconHTML}</div>
            <div class="feed-card-header-text">
                <span class="feed-card-title">${wt} ${ua}</span>
                <span class="feed-card-time">${datum} • ${erl}</span>
            </div>`;

        const delBtn = document.createElement('button');
        delBtn.className = 'entry-delete-btn';
        delBtn.dataset.idx = String(idx);
        delBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>';
        header.appendChild(delBtn);
        li.appendChild(header);

        // Content Wrapper
        const content = document.createElement('div');
        content.className = 'feed-card-content';

        if (entry.bemerkung) {
            const notes = document.createElement('div');
            notes.className = 'entry-notes';
            notes.style.marginBottom = '0.75rem';
            notes.textContent = entry.bemerkung;
            content.appendChild(notes);
        }

        const imageSrc = entry.imageBase64 || entry.imageUrl;
        const eid = escapeHtml(entry.id);

        if (imageSrc || true) { // Always show the upload button area
            const fotoSection = document.createElement('div');
            fotoSection.className = 'entry-foto-section';
            
            if (imageSrc) {
                fotoSection.innerHTML = `
                    <div class="entry-foto-thumbnail">
                        <img src="${imageSrc}" alt="Streckenfoto" class="entry-foto-img" data-id="${eid}">
                        <button type="button" class="entry-foto-delete-btn" data-id="${eid}" aria-label="Foto löschen">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg>
                        </button>
                    </div>`;
            }

            const fotoBtn = document.createElement('button');
            fotoBtn.type = 'button';
            fotoBtn.className = 'entry-foto-btn';
            fotoBtn.dataset.id = entry.id;
            fotoBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>${imageSrc ? 'Ändern' : 'Foto hinzufügen'}`;
            fotoSection.appendChild(fotoBtn);
            content.appendChild(fotoSection);
        }

        li.appendChild(content);

        if (entryList) entryList.appendChild(li.cloneNode(true));
        if (dashboardList) dashboardList.appendChild(li.cloneNode(true));
    });

    attachDeleteEvents();
    attachFotoEvents();
}

async function attachDeleteEvents() {
    document.querySelectorAll('#entry-list .entry-delete-btn, #entry-list-dashboard .entry-delete-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const idx = Number(btn.dataset.idx);
            const entry = state.currentEntries[idx];
            if (!entry?.id) return;
            try {
                await entriesRepo.delete(entry.id);
                safeToast('Eintrag gelöscht', 'delete');
            } catch (err) {
                console.error('[streckenliste] delete', err);
                safeToast('Fehler beim Löschen', 'error');
            }
        });
    });
}

function attachFotoEvents() {
    document.querySelectorAll('.entry-foto-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const entryId = btn.dataset.id;
            if (!entryId) return;
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.click();
            fileInput.onchange = async () => {
                const file = fileInput.files[0];
                if (!file) return;
                const originalContent = btn.innerHTML;
                try {
                    btn.disabled = true;
                    btn.innerHTML = '<svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="30" stroke-dashoffset="10"/></svg> Lädt...';
                    const base64 = await compressEntryPhotoToBase64(file);
                    if (base64.length > MAX_IMAGE_BASE64_CHARS) throw new Error('Bild zu groß, bitte kleineres Bild wählen');
                    await entriesRepo.updateImageBase64(entryId, base64);
                    safeToast('Foto gespeichert', 'success');
                } catch (err) {
                    console.error('[streckenliste] foto', err);
                    safeToast(err.message || 'Fehler beim Speichern', 'error');
                    btn.disabled = false;
                    btn.innerHTML = originalContent;
                }
            };
        });
    });

    document.querySelectorAll('.entry-foto-img').forEach((img) => {
        img.addEventListener('click', () => {
            if (typeof window.openImageModal === 'function') window.openImageModal(img.src);
        });
    });

    document.querySelectorAll('.entry-foto-delete-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const entryId = btn.dataset.id;
            if (!entryId) return;
            if (!(await safeConfirm('Möchten Sie das Foto wirklich löschen?', 'Foto löschen', 'Löschen'))) return;
            try {
                await entriesRepo.clearImages(entryId);
                safeToast('Foto gelöscht', 'delete');
            } catch (err) {
                console.error('[streckenliste] foto-delete', err);
                safeToast('Fehler beim Löschen', 'error');
            }
        });
    });
}

function installOpenImageModal() {
    window.openImageModal = function openImageModal(src) {
        const overlay = document.createElement('div');
        overlay.className = 'image-modal-overlay';
        overlay.innerHTML = '<div class="image-modal-content"><img src="" alt="Foto"><button type="button" class="image-modal-close" aria-label="Schließen">✕</button></div>';
        const innerImg = overlay.querySelector('img');
        if (innerImg) innerImg.src = src;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.closest('.image-modal-close')) overlay.remove();
        });
    };
}

function wireWildartSubcategories(wildSelect, subcategoryContainer) {
    if (!wildSelect || !subcategoryContainer) return;
    wildSelect.addEventListener('change', () => {
        const value = wildSelect.value;
        let html = '';
        if (value === 'Rehwild') html = '<label > Unterart <select name="unterart" ><option>Geiß</option><option>Bock</option><option>Kitz</option><option>Schmal</option></select></label> ';
        if (value === 'Rotwild' || value === 'Dammwild') html = '<label > Unterart <select name="unterart" ><option>Hirsch</option><option>Alttier</option><option>Schmaltier</option><option>Spießer</option></select></label> ';
        if (value === 'Schwarzwild') html = '<label > Unterart <select name="unterart" ><option>Keiler</option><option>Bache</option><option>Frischling</option><option>Überläufer</option></select></label> ';
        if (value === 'Raubwild' || value === 'Federwild') html = '<label > Bemerkung <input type="text" name="unterart" ></label> ';
        subcategoryContainer.innerHTML = html;
    });
}

export const streckenlisteFeature = {
    onLogin(user) {
        this.onLogout();
        state.user = user;
        const has = !!(document.getElementById('entry-list') || document.getElementById('entry-list-dashboard'));
        if (!has) return;
        state.snapshotUnsub = entriesRepo.streamByDatumDesc((items) => {
            state.currentEntries = items;
            updateDashboardCounters(items);
            renderEntriesInternal();
            renderStatsDetailInternal();
        });
    },

    onLogout() {
        if (typeof state.snapshotUnsub === 'function') {
            try { state.snapshotUnsub(); } catch (_) {}
        }
        state.snapshotUnsub = null;
        state.user = null;
        state.currentEntries = [];
        const el = document.getElementById('entry-list');
        const dl = document.getElementById('entry-list-dashboard');
        if (el) el.innerHTML = '';
        if (dl) dl.innerHTML = '';
        const sc = document.getElementById('strecke-count');
        if (sc) sc.textContent = '0';
        const rc = document.getElementById('rehwild-count');
        if (rc) rc.textContent = '0';
        renderStatsDetailInternal();
    },

    initUI() {
        installOpenImageModal();
        if (state.listenersAttached) return;
        state.listenersAttached = true;

        const modal = document.getElementById('entry-modal');
        const form = document.getElementById('entry-form');
        const cancelBtn = document.getElementById('cancel-entry');
        const wildSelect = document.getElementById('wildart');
        const sub = document.getElementById('subcategory-container');
        const addBtnMain = document.getElementById('add-entry-btn');
        const fabAddBtn = document.getElementById('fab-add-btn');
        const fabExportBtn = document.getElementById('fab-export-btn');

        wireWildartSubcategories(wildSelect, sub);

        if (fabAddBtn && modal) fabAddBtn.addEventListener('click', () => { modal.classList.remove('hidden'); });
        if (addBtnMain && modal) addBtnMain.addEventListener('click', () => { modal.classList.remove('hidden'); });

        if (fabExportBtn) {
            fabExportBtn.addEventListener('click', () => {
                if (!state.currentEntries.length) {
                    safeToast('Keine Einträge zum Exportieren vorhanden', 'info');
                    return;
                }
                try {
                    if (typeof window.XLSX === 'undefined') throw new Error('XLSX');
                    const rows = buildExcelExportRows(state.currentEntries);
                    const wb = window.XLSX.utils.book_new();
                    const ws = window.XLSX.utils.json_to_sheet(rows);
                    ws['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 40 }, { wch: 10 }];
                    window.XLSX.utils.book_append_sheet(wb, ws, 'Streckenliste');
                    window.XLSX.writeFile(wb, `Streckenliste_Silbersbach_${new Date().toISOString().split('T')[0]}.xlsx`);
                    safeToast('Excel-Export erfolgreich', 'success');
                } catch (err) {
                    console.error('[streckenliste] export', err);
                    safeToast('Fehler beim Exportieren', 'error');
                }
            });
        }

        if (cancelBtn && form && modal && sub) {
            cancelBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                form.reset();
                sub.innerHTML = '';
            });
        }

        if (form && modal && sub) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const fd = new FormData(form);
                const entry = {};
                fd.forEach((v, k) => { entry[k] = v; });
                try {
                    await entriesRepo.add(entry);
                    safeToast('Eintrag gespeichert', 'success');
                    form.reset();
                    sub.innerHTML = '';
                    modal.classList.add('hidden');
                } catch (err) {
                    console.error('[streckenliste] add', err);
                    safeToast('Fehler beim Speichern', 'error');
                }
            });
        }
    },

    renderStatsDetail() {
        renderStatsDetailInternal();
    },

    __test__: {
        getState() { return state; },
        renderStatsDetailInternal,
        setEntriesForTest(list) {
            state.currentEntries = list;
            renderStatsDetailInternal();
        },
    },
};
