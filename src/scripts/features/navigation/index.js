// ============================================================================
// features/navigation/index.js — Seitenwechsel, Dashboard, Karten-Panels
// Brücken: window.toggleDashboardFeed (Monolith), window.mapInstance (Map),
//   window.__features.schonzeit / wetter
// Globale HTML-Aufrufe: window.navigateToPage, window.navigateToDashboard
//   (initBridge am Ende von main.js)
// ============================================================================

function setActiveTab(pageId) {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.tab === pageId);
    });
}

function closeMapPanels() {
    const panels = ['hochsitz-panel', 'eigengrundstuecke-panel'];
    panels.forEach((id) => {
        const p = document.getElementById(id);
        if (p && !p.classList.contains('hidden')) {
            p.classList.remove('open');
            setTimeout(() => p.classList.add('hidden'), 300);
        }
    });
}

function navigateToPage(targetId) {
    const allPages = document.querySelectorAll('.page');
    const fabBtn = document.getElementById('fab-add-btn');
    const fabExportBtn = document.getElementById('fab-export-btn');
    const bottomNav = document.getElementById('bottom-nav');

    allPages.forEach((p) => p.classList.remove('active'));
    const targetPage = document.getElementById(targetId);
    if (targetPage) {
        targetPage.classList.add('active');

        if (targetId === 'revier' && window.mapInstance) {
            setTimeout(() => window.mapInstance.invalidateSize(), 200);
        }

        if (targetId === 'streckenliste') {
            navigateToDashboard('strecke');
            return;
        } else if (targetId === 'schonzeit-page') {
            window.__features?.schonzeit?.setFilterAndRender?.('alle');
            navigateToDashboard('schonzeit');
            return;
        } else if (targetId === 'wetter-page') {
            navigateToDashboard('wetter');
            return;
        } else {
            if (fabBtn) fabBtn.classList.remove('visible');
            if (fabExportBtn) fabExportBtn.classList.remove('visible');
        }

        if (bottomNav) {
            bottomNav.classList.remove('hidden');
        }
        setActiveTab(targetId);

        if (targetId === 'schonzeit-page') {
            window.__features?.schonzeit?.renderListe?.();
        }
    }

    if (targetPage && targetId !== 'revier') {
        closeMapPanels();
    }
}

function navigateToDashboard(view = 'standard') {
    const allPages = document.querySelectorAll('.page');
    const fabBtn = document.getElementById('fab-add-btn');
    const fabExportBtn = document.getElementById('fab-export-btn');
    const bottomNav = document.getElementById('bottom-nav');

    allPages.forEach((p) => p.classList.remove('active'));
    const dashboard = document.getElementById('dashboard');
    if (dashboard) dashboard.classList.add('active');

    if (fabBtn) fabBtn.classList.remove('visible');
    if (fabExportBtn) fabExportBtn.classList.remove('visible');

    if (bottomNav) bottomNav.classList.remove('hidden');

    if (typeof window.toggleDashboardFeed === 'function') {
        window.toggleDashboardFeed(view);
    }

    setActiveTab('dashboard');
    closeMapPanels();
}

/** Derzeit unbenutzt; fuer spaetere Tab-Navigation ohne Dashboard-Zwischenschritt. */
function navigateToTab(pageId) {
    const allPages = document.querySelectorAll('.page');
    const fabBtn = document.getElementById('fab-add-btn');
    const fabExportBtn = document.getElementById('fab-export-btn');
    const bottomNav = document.getElementById('bottom-nav');

    allPages.forEach((p) => p.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');

    if (bottomNav) bottomNav.classList.remove('hidden');

    if (pageId === 'streckenliste') {
        if (fabBtn) fabBtn.classList.add('visible');
        if (fabExportBtn) fabExportBtn.classList.add('visible');
    } else {
        if (fabBtn) fabBtn.classList.remove('visible');
        if (fabExportBtn) fabExportBtn.classList.remove('visible');
    }

    setActiveTab(pageId);

    if (pageId !== 'revier') {
        closeMapPanels();
    }
}

function initNavigation() {
    const navWidgets = document.querySelectorAll('.nav-widget');
    const backButtons = document.querySelectorAll('.back-to-home');

    navWidgets.forEach((widget) => {
        widget.addEventListener('click', () => {
            const target = widget.dataset.target;
            if (target) navigateToPage(target);
        });
    });

    backButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigateToDashboard();
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.back-to-home')) {
            e.preventDefault();
            e.stopPropagation();
            navigateToDashboard();
        }
    });
}

export const navigationFeature = {
    setActiveTab,
    closeMapPanels,
    navigateToPage,
    navigateToDashboard,
    navigateToTab,
    initNavigation,

    initBridge() {
        window.navigateToPage = navigateToPage;
        window.navigateToDashboard = navigateToDashboard;
    },

    initUI() {
        this.initBridge();
    },
};
