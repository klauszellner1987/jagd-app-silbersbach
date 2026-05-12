// ============================================================================
// features/schonzeit/index.js — Widget, Liste, Filter-Tabs (kein Firestore)
// Monolith-Bruecken: window.jagdzeitenBayern, window.getWildartIconHTML
// navigateToPage schaltet Filter "alle" (siehe public/js/app.js).
// Astro-onclick: window.filterSchonzeitListe
// ============================================================================

import {
    istSchonzeit,
    getJagdzeitDatum,
    wildartenNachTabFilter,
    filterWildartenMitJagdzeitWidget,
} from './schonzeit.pure.js';

const state = {
    aktuellerFilter: 'alle',
    schonzeitIndex: 0,
    schonzeitInterval: null,
    listenersAttached: false,
};

function catalog() {
    return Array.isArray(window.jagdzeitenBayern) ? window.jagdzeitenBayern : [];
}

function wildartIconHTML(iconClass, size) {
    if (typeof window.getWildartIconHTML === 'function') {
        const html = window.getWildartIconHTML(iconClass, size);
        if (html) return html;
    }
    return '';
}

function updateSchonzeitWidget() {
    const iconContainer = document.getElementById('schonzeit-icon');
    const wildartEl = document.getElementById('schonzeit-wildart');
    const datumEl = document.getElementById('schonzeit-datum');
    const indicatorEl = document.getElementById('schonzeit-indicator');
    const statusTextEl = document.getElementById('schonzeit-status-text');

    if (!iconContainer || !wildartEl || !datumEl || !indicatorEl || !statusTextEl) return;

    const jagdzeitWildarten = filterWildartenMitJagdzeitWidget(catalog());

    if (jagdzeitWildarten.length === 0) {
        iconContainer.style.display = 'none';
        wildartEl.textContent = 'Keine aktiven Jagdzeiten';
        datumEl.textContent = 'Alle Wildarten haben aktuell Schonzeit';
        indicatorEl.className = 'schonzeit-indicator closed';
        statusTextEl.textContent = 'Schonzeit';
        return;
    }

    const wildart = jagdzeitWildarten[state.schonzeitIndex % jagdzeitWildarten.length];
    iconContainer.style.display = 'none';
    wildartEl.textContent = wildart.name;
    datumEl.textContent = getJagdzeitDatum(wildart);
    indicatorEl.className = 'schonzeit-indicator open';
    statusTextEl.textContent = 'Jagdzeit';

    state.schonzeitIndex += 1;
}

function applyFilterAndRender(filter) {
    state.aktuellerFilter = filter;
    document.querySelectorAll('.schonzeit-filter-btn').forEach((btn) => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`)?.classList.add('active');
    renderSchonzeitListeInternal();
}

function buildSchonzeitListeHTML(now = new Date()) {
    const wildarten = wildartenNachTabFilter(state.aktuellerFilter, catalog(), now);

    if (wildarten.length === 0) {
        return '<div class="schonzeit-empty"><p>Keine Wildarten gefunden.</p></div>';
    }

    return wildarten.map((wildart) => {
        const hatSchonzeit = istSchonzeit(wildart, now);
        const statusClass = hatSchonzeit ? 'closed' : 'open';
        const statusText = hatSchonzeit ? 'Schonzeit' : 'Jagdzeit';
        const zeitInfo = wildart.keineJagdzeit
            ? 'Ganzjährige Schonzeit'
            : (wildart.ganzjaehrig ? 'Ganzjährig bejagbar' : `Jagdzeit: ${wildart.jagdzeitStart || '-'} - ${wildart.jagdzeitEnde || '-'}`);

        return `
                <div class="wildart-card">
                    <div class="wildart-icon">
                        ${wildartIconHTML(wildart.iconClass, 44)}
                    </div>
                    <div class="wildart-info">
                        <h3 class="wildart-name">${wildart.name}</h3>
                        <p class="wildart-zeit">${zeitInfo}</p>
                    </div>
                    <div class="wildart-status ${statusClass}">
                        <div class="wildart-indicator"></div>
                        <span>${statusText}</span>
                    </div>
                </div>
            `;
    }).join('');
}

function renderSchonzeitListeInternal() {
    const container = document.getElementById('schonzeit-liste');
    const dashboardContainer = document.getElementById('schonzeit-liste-dashboard');
    if (!container && !dashboardContainer) return;

    const html = buildSchonzeitListeHTML();
    if (container) container.innerHTML = html;
    if (dashboardContainer) dashboardContainer.innerHTML = html;
}

export const schonzeitFeature = {
    initUI() {
        if (state.schonzeitInterval !== null) {
            clearInterval(state.schonzeitInterval);
            state.schonzeitInterval = null;
        }
        if (!state.listenersAttached) {
            state.listenersAttached = true;
            window.filterSchonzeitListe = (f) => applyFilterAndRender(f);
        }

        updateSchonzeitWidget();
        state.schonzeitInterval = window.setInterval(updateSchonzeitWidget, 5000);
    },

    setFilterAndRender(filter) {
        applyFilterAndRender(filter);
    },

    renderListe() {
        renderSchonzeitListeInternal();
    },
};
