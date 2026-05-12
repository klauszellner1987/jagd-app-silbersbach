// ============================================================================
// features/dokumente/index.js — Wizard, Grid, Storage + Firestore
// Brücken: window.compressImage (Monolith), window.showToast/showConfirm,
//   window.firebase (compat). Astro-onclick: window.uploadDokument,
//   window.deleteDokument, window.openImageModal (Streckenliste).
// ============================================================================

import { dokumenteRepo } from '../../data/dokumenteRepo.js';
import { DOCUMENT_CATEGORIES as DOKUMENT_KATEGORIEN } from './dokumente.pure.js';

const state = {
    dokumenteCache: {},
    globalsAttached: false,
};

function currentUserOrNull() {
    const auth = window.firebase?.auth?.();
    return auth?.currentUser || null;
}

function toast(message, type) {
    window.showToast?.(message, type);
}

async function compressForUpload(file) {
    const compress = window.compressImage;
    if (typeof compress !== 'function') {
        throw new Error('compressImage nicht verfügbar');
    }
    return compress(file, 1200, 1200);
}

function initDokumenteWizard() {
    const steps = document.querySelectorAll('.dok-wizard-step');
    const dots = document.querySelectorAll('.dok-wizard-dot');
    const prevBtn = document.getElementById('dok-wizard-prev');
    const nextBtn = document.getElementById('dok-wizard-next');
    if (!steps.length || !prevBtn || !nextBtn) return;

    let currentStep = 0;
    const totalSteps = steps.length;

    function showStep(idx) {
        steps.forEach((s) => s.classList.remove('active'));
        dots.forEach((d) => d.classList.remove('active'));
        steps[idx].classList.add('active');
        dots[idx].classList.add('active');

        prevBtn.classList.toggle('hidden', idx === 0);
        nextBtn.textContent = idx === totalSteps - 1 ? 'Fertig' : 'Weiter';
    }

    prevBtn.onclick = () => {
        if (currentStep > 0) {
            currentStep -= 1;
            showStep(currentStep);
        }
    };

    nextBtn.onclick = () => {
        if (currentStep < totalSteps - 1) {
            currentStep += 1;
            showStep(currentStep);
        } else {
            localStorage.setItem('dokumente_wizard_done', 'true');
            const wizard = document.getElementById('dokumente-wizard');
            const gridEl = document.getElementById('dokumente-grid');
            if (wizard) wizard.classList.add('hidden');
            if (gridEl) gridEl.classList.remove('hidden');
            renderDokumenteSafe();
        }
    };

    showStep(0);
}

function initDokumenteSafe() {
    const wizardDone = localStorage.getItem('dokumente_wizard_done');
    const wizard = document.getElementById('dokumente-wizard');
    const grid = document.getElementById('dokumente-grid');
    if (!wizard || !grid) return;

    if (!wizardDone) {
        wizard.classList.remove('hidden');
        grid.classList.add('hidden');
        initDokumenteWizard();
    } else {
        wizard.classList.add('hidden');
        grid.classList.remove('hidden');
        renderDokumenteSafe();
    }
}

async function renderDokumenteSafe() {
    const gridEl = document.getElementById('dokumente-grid');
    if (!gridEl) return;

    const user = currentUserOrNull();
    if (!user) {
        gridEl.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 2rem;">Bitte zuerst anmelden.</p>';
        return;
    }

    gridEl.innerHTML = DOKUMENT_KATEGORIEN.map((kat) => `
        <div class="wetter-detail-widget dok-widget" data-kategorie="${kat.id}">
            <div class="wetter-detail-header">
                ${kat.icon}
                <span>${kat.name}</span>
            </div>
            <div class="wetter-detail-content">
                <div class="dok-thumbnails" id="dok-thumbs-${kat.id}">
                    <div class="dok-loading">Lade...</div>
                </div>
                <button class="dok-upload-btn" onclick="uploadDokument('${kat.id}')">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    Foto hinzufügen
                </button>
            </div>
        </div>
    `).join('');

    await loadDokumente(user.uid);
}

async function loadDokumente(uid) {
    try {
        state.dokumenteCache = await dokumenteRepo.listAll(uid);
        DOKUMENT_KATEGORIEN.forEach((kat) => renderDokumentThumbnails(kat.id));
    } catch (err) {
        console.error('Dokumente laden Fehler:', err);
        toast('Fehler beim Laden der Dokumente', 'error');
    }
}

function renderDokumentThumbnails(kategorie) {
    const container = document.getElementById(`dok-thumbs-${kategorie}`);
    const wizardContainer = document.getElementById(`wizard-thumbs-${kategorie}`);
    const data = state.dokumenteCache[kategorie];
    const images = (data && data.images) || [];

    const html = images.length === 0
        ? '<span class="dok-empty">Keine Dokumente</span>'
        : images.map((img, idx) => `
            <div class="dok-thumb-wrap">
                <img src="${img.url}" alt="${kategorie}" class="dok-thumb-img" onclick="openImageModal('${img.url}')">
                <button class="dok-thumb-delete" onclick="deleteDokument('${kategorie}', ${idx})" aria-label="Löschen">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        `).join('');

    if (container) container.innerHTML = html;
    if (wizardContainer) wizardContainer.innerHTML = html;
}

async function uploadDokument(kategorie) {
    const user = currentUserOrNull();
    if (!user) {
        toast('Bitte zuerst anmelden', 'error');
        return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (!file) return;

        try {
            toast('Dokument wird hochgeladen...', 'info');

            const blob = await compressForUpload(file);

            const storageRef = window.firebase.storage().ref();
            const filename = `${Date.now()}.jpg`;
            const fileRef = storageRef.child(`documents/${user.uid}/${kategorie}/${filename}`);

            await fileRef.put(blob, { contentType: 'image/jpeg' });
            const url = await fileRef.getDownloadURL();

            const docData = await dokumenteRepo.getCategory(user.uid, kategorie);
            const existing = docData?.images || [];

            existing.push({
                url,
                name: filename,
                uploadedAt: Date.now(),
            });

            await dokumenteRepo.setCategoryImages(user.uid, kategorie, existing);

            if (!state.dokumenteCache[kategorie]) state.dokumenteCache[kategorie] = { images: [] };
            state.dokumenteCache[kategorie].images = existing;
            renderDokumentThumbnails(kategorie);

            toast('Dokument gespeichert', 'success');
        } catch (err) {
            console.error('Dokument Upload Fehler:', err);
            toast(`Fehler beim Hochladen: ${err.message}`, 'error');
        }
    };
}

async function deleteDokument(kategorie, imageIndex) {
    const confirmed = typeof window.showConfirm === 'function'
        ? await window.showConfirm(
            'Möchtest du dieses Dokument wirklich löschen?',
            'Dokument löschen',
            'Löschen',
        )
        : typeof globalThis.confirm === 'function'
            ? globalThis.confirm('Möchtest du dieses Dokument wirklich löschen?')
            : false;
    if (!confirmed) return;

    const user = currentUserOrNull();
    if (!user) return;

    try {
        const data = state.dokumenteCache[kategorie];
        if (!data?.images?.[imageIndex]) return;

        const image = data.images[imageIndex];

        try {
            const storageRef = window.firebase.storage().ref();
            const fileRef = storageRef.child(`documents/${user.uid}/${kategorie}/${image.name}`);
            await fileRef.delete();
        } catch (storageErr) {
            console.warn('Storage Datei konnte nicht gelöscht werden:', storageErr);
        }

        data.images.splice(imageIndex, 1);
        await dokumenteRepo.setCategoryImages(user.uid, kategorie, data.images);

        renderDokumentThumbnails(kategorie);
        toast('Dokument gelöscht', 'delete');
    } catch (err) {
        console.error('Dokument löschen Fehler:', err);
        toast('Fehler beim Löschen', 'error');
    }
}

export const dokumenteFeature = {
    initUI() {
        if (!state.globalsAttached) {
            state.globalsAttached = true;
            window.uploadDokument = uploadDokument;
            window.deleteDokument = deleteDokument;
        }
    },

    initSafe() {
        initDokumenteSafe();
    },

    onLogout() {
        state.dokumenteCache = {};
    },
};
