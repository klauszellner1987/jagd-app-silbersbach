// ============================================================================
// features/map/index.js — Leaflet-Karte, GPS, Hochsitz-Panels,
//   Eigengrundstücke, Firestore-Snapshot (Marker + Panelliste)
// Brücken: window.L (Leaflet CDN), window.reviere / window.eigengrundstuecke
//   (Inline-Skripte), window.firebase (compat), window.showToast,
//   window.showConfirm, window.mapInstance (wird hier gesetzt).
// ============================================================================

import { mapRepo } from '../../data/mapRepo.js';

const state = {
    map: null,
    gpsWatchId: null,
    gpsMarker: null,
    gpsSearching: false,
    gpsHighAccuracyFailed: false,
    settingHochsitz: false,
    unsubHochsitze: null,
    unsubPanelList: null,
    clickAbort: null,
};

function toast(msg, type) {
    if (typeof window.showToast === 'function') window.showToast(msg, type);
}

function isNativeApp() {
    return window.Capacitor && window.Capacitor.getPlatform() !== 'web';
}

// ── Panel-Helfer ──────────────────────────────────────────────────────────

function closeHochsitzPanel() {
    const panel = document.getElementById('hochsitz-panel');
    if (!panel) return;
    panel.classList.remove('open');
    setTimeout(() => panel.classList.add('hidden'), 300);
}

function closeEigengrundstueckePanel() {
    const panel = document.getElementById('eigengrundstuecke-panel');
    if (!panel) return;
    panel.classList.remove('open');
    setTimeout(() => panel.classList.add('hidden'), 300);
}

function openHochsitzPanel() {
    const panel = document.getElementById('hochsitz-panel');
    if (!panel) return;
    closeEigengrundstueckePanel();
    panel.classList.remove('hidden');
    setTimeout(() => panel.classList.add('open'), 10);
}

function openEigengrundstueckePanel() {
    const panel = document.getElementById('eigengrundstuecke-panel');
    if (!panel) return;
    closeHochsitzPanel();
    panel.classList.remove('hidden');
    setTimeout(() => panel.classList.add('open'), 10);
}

// ── initPanels — Button-Listener + Hochsitz-Panelliste via Snapshot ──────

function initPanels(db) {
    const closePanelBtn = document.getElementById('close-hochsitz-panel');
    if (closePanelBtn) closePanelBtn.addEventListener('click', closeHochsitzPanel);

    const closeGrundPanelBtn = document.getElementById('close-eigengrundstuecke-panel');
    if (closeGrundPanelBtn) closeGrundPanelBtn.addEventListener('click', closeEigengrundstueckePanel);

    const hochsitzPanel = document.getElementById('hochsitz-panel');
    const panelContent = hochsitzPanel?.querySelector('.panel-content');
    if (!panelContent) return;

    state.unsubPanelList = mapRepo.stream(db, (snapshot) => {
        const hochsitzStats = document.getElementById('hochsitz-count');
        if (hochsitzStats) {
            hochsitzStats.textContent = snapshot.size;
        }

        panelContent.innerHTML = '';
        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const entry = document.createElement('div');
            entry.className = 'panel-entry panel-entry-clickable';
            entry.dataset.lat = data.lat;
            entry.dataset.lng = data.lng;
            entry.dataset.id = doc.id;
            entry.innerHTML = `
        <strong>${data.name || 'Ohne Namen'}</strong>
            ${data.datum ? `<small>Datum: ${new Date(data.datum).toLocaleDateString()}</small>` : ''}
                    ${data.bemerkung ? `<small>${data.bemerkung}</small>` : ''}
                    ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.name}">` : ''}
    `;

            entry.addEventListener('click', () => {
                if (window.mapInstance && data.lat && data.lng) {
                    window.mapInstance.flyTo([data.lat, data.lng], 18, { duration: 0.5 });
                }
            });

            panelContent.appendChild(entry);
        });
    });
}

// ── GPS ───────────────────────────────────────────────────────────────────

function updateGpsMarker(lat, lng) {
    const L = window.L;
    if (!state.gpsMarker) {
        const gpsIcon = L.divIcon({
            className: 'gps-marker-wrapper',
            html: '<div class="gps-marker"></div><div class="gps-marker-pulse"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });
        state.gpsMarker = L.marker([lat, lng], { icon: gpsIcon }).addTo(state.map);
    } else {
        state.gpsMarker.setLatLng([lat, lng]);
    }
    const el = state.gpsMarker.getElement();
    if (el) el.classList.remove('offline');
}

function stopGpsSearching() {
    state.gpsSearching = false;
    const gpsBtn = document.querySelector('.gps-center-btn');
    if (gpsBtn) gpsBtn.classList.remove('gps-searching');
}

function showGpsFinalError(err) {
    switch (err.code) {
        case 1: {
            const permMsg = isNativeApp()
                ? 'GPS-Berechtigung verweigert. Bitte in den App-Einstellungen erlauben.'
                : 'GPS-Berechtigung blockiert. Bitte in Browser-Einstellungen erlauben.';
            toast(permMsg, 'error');
            break;
        }
        case 2:
            toast('Standort nicht verfügbar. Bitte GPS/Standort in den Handy-Einstellungen prüfen.', 'error');
            break;
        case 3:
            toast('GPS-Zeitüberschreitung. Bitte erneut versuchen.', 'error');
            break;
        default:
            toast('GPS-Fehler aufgetreten', 'error');
    }
}

function startGpsTracking() {
    if (state.gpsWatchId !== null) return;
    if (!navigator.geolocation) {
        toast('GPS wird von diesem Gerät nicht unterstützt', 'error');
        return;
    }
    const useHighAccuracy = !state.gpsHighAccuracyFailed;
    state.gpsWatchId = navigator.geolocation.watchPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            updateGpsMarker(latitude, longitude);
            stopGpsSearching();
        },
        (err) => handleGpsError(err),
        { enableHighAccuracy: useHighAccuracy, maximumAge: 10000, timeout: 15000 },
    );
}

function handleGpsError(err) {
    if (state.gpsMarker) {
        const el = state.gpsMarker.getElement();
        if (el) el.classList.add('offline');
    }
    console.warn('GPS Fehler (code ' + err.code + '):', err.message);

    if (err.code === 2 && !state.gpsHighAccuracyFailed) {
        state.gpsHighAccuracyFailed = true;
        console.log('GPS: Fallback ohne enableHighAccuracy...');
        toast('GPS-Signal schwach, versuche alternative Ortung...', 'info');

        if (state.gpsWatchId !== null) {
            navigator.geolocation.clearWatch(state.gpsWatchId);
            state.gpsWatchId = null;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                updateGpsMarker(latitude, longitude);
                state.map.flyTo([latitude, longitude], 17, { duration: 0.5 });
                toast('Position gefunden (via Netzwerk)');
                stopGpsSearching();
                startGpsTracking();
            },
            (err2) => {
                console.warn('GPS Fallback auch fehlgeschlagen:', err2);
                showGpsFinalError(err2);
                stopGpsSearching();
            },
            { enableHighAccuracy: false, maximumAge: 30000, timeout: 15000 },
        );
        return;
    }

    showGpsFinalError(err);
    stopGpsSearching();
}

// ── initMap — Leaflet + Controls + Firestore-Marker ──────────────────────

function initMap(db) {
    const L = window.L;
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.warn('Map element not found, skipping map initialization');
        return;
    }

    try {
        const map = L.map('map', {
            center: [49.180, 13.065],
            zoom: 15,
            zoomAnimation: true,
            zoomAnimationThreshold: 4,
            fadeAnimation: true,
            markerZoomAnimation: true,
        });
        state.map = map;
        window.mapInstance = map;
        window.hochsitzeMarkers = {};

        // TileLayer
        const tileLayer = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and others',
                maxZoom: 18,
                minZoom: 12,
                updateWhenZooming: false,
                updateWhenIdle: true,
                keepBuffer: 4,
                maxNativeZoom: 18,
                tileSize: 256,
                crossOrigin: true,
            },
        ).addTo(map);

        // ── Reviere-Polygone ──
        const reviere = window.reviere;
        if (Array.isArray(reviere)) {
            reviere.forEach((r) => {
                const polygon = L.polygon(r.coords, { color: r.color, fillColor: r.fillColor, fillOpacity: 0.3 })
                    .addTo(map)
                    .bindPopup(r.name);

                polygon.on('click', async (e) => {
                    if (!state.settingHochsitz) return;
                    const modal = document.getElementById('hochsitz-modal');
                    const input = document.getElementById('hochsitz-name-input');
                    const saveBtn = document.getElementById('hochsitz-save-btn');
                    const cancelBtn = document.getElementById('hochsitz-cancel-btn');

                    if (!modal || !input || !saveBtn || !cancelBtn) return;

                    modal.style.display = 'block';
                    input.value = '';
                    if (window.innerWidth > 768) {
                        input.focus();
                    }

                    const closeModal = () => { modal.style.display = 'none'; };

                    saveBtn.onclick = async () => {
                        const name = input.value.trim();
                        if (!name) {
                            toast('Bitte einen Namen eingeben', 'error');
                            return;
                        }
                        try {
                            await mapRepo.add(db, {
                                lat: e.latlng.lat,
                                lng: e.latlng.lng,
                                name,
                                imageUrl: null,
                            });
                            toast('Hochsitz gesetzt', 'success');
                        } catch (err) {
                            console.error(err);
                            toast('Fehler beim Setzen des Hochsitzes', 'error');
                        }
                        closeModal();
                        state.settingHochsitz = false;
                        const btn = document.querySelector('.hoch-sitz-btn');
                        if (btn) {
                            btn.style.background = '#2f2f2f';
                            btn.style.border = '1px solid rgba(255,255,255,0.25)';
                            btn.style.color = 'white';
                            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.6)';
                        }
                    };

                    cancelBtn.onclick = () => {
                        closeModal();
                        state.settingHochsitz = false;
                        const btn = document.querySelector('.hoch-sitz-btn');
                        if (btn) {
                            btn.style.background = '#2f2f2f';
                            btn.style.border = '1px solid rgba(255,255,255,0.25)';
                            btn.style.color = 'white';
                            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.6)';
                        }
                    };
                });
            });
        }

        // ── Eigengrundstücke ──
        window.eigengrundstueckePolygons = {};
        const grundPanelContent = document.getElementById('eigengrundstuecke-content');
        if (grundPanelContent) grundPanelContent.innerHTML = '';

        if (typeof window.eigengrundstuecke !== 'undefined') {
            window.eigengrundstuecke.forEach((g, index) => {
                const poly = L.polygon(g.coords, { color: g.color, fillColor: g.fillColor, fillOpacity: 0.3 });
                poly.bindPopup(g.name);
                const polyId = g.id || `grund-${index}`;
                window.eigengrundstueckePolygons[polyId] = poly;
                if (g.isVisible) {
                    poly.addTo(map);
                }

                if (grundPanelContent) {
                    const entry = document.createElement('div');
                    entry.className = 'panel-entry panel-entry-clickable';
                    entry.style.display = 'flex';
                    entry.style.justifyContent = 'space-between';
                    entry.style.alignItems = 'center';

                    if (g.isVisible) {
                        entry.classList.add('active-plot');
                        entry.style.borderColor = g.color;
                        entry.style.background = 'rgba(255,255,255,0.25)';
                    }

                    const nameSpan = document.createElement('span');
                    nameSpan.innerHTML = `<strong>${g.name}</strong>`;
                    nameSpan.style.color = g.color;

                    const statusIcon = document.createElement('span');
                    statusIcon.innerHTML = g.isVisible ? '✓' : '';
                    statusIcon.style.fontWeight = 'bold';
                    statusIcon.style.color = g.color;

                    entry.addEventListener('click', () => {
                        g.isVisible = !g.isVisible;
                        if (g.isVisible) {
                            poly.addTo(map);
                            map.fitBounds(poly.getBounds(), {
                                padding: [50, 50],
                                maxZoom: 17,
                                animate: true,
                                duration: 0.8,
                            });
                            entry.classList.add('active-plot');
                            entry.style.borderColor = g.color;
                            entry.style.background = 'rgba(255,255,255,0.25)';
                            statusIcon.innerHTML = '✓';
                        } else {
                            map.removeLayer(poly);
                            entry.classList.remove('active-plot');
                            entry.style.borderColor = '';
                            entry.style.background = '';
                            statusIcon.innerHTML = '';
                        }
                    });

                    entry.appendChild(nameSpan);
                    entry.appendChild(statusIcon);
                    grundPanelContent.appendChild(entry);
                }
            });
        }

        // ── Statusdot ──
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            const mapStatusDot = document.createElement('span');
            mapStatusDot.id = 'map-status-dot';
            mapStatusDot.classList.add('offline');
            mapContainer.appendChild(mapStatusDot);
            tileLayer.on('tileload', () => mapStatusDot.classList.replace('offline', 'online'));
            tileLayer.on('tileerror', () => mapStatusDot.classList.replace('online', 'offline'));
        }

        // ── Hochsitz + Button ──
        const normalStyle = `
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255,255,255,0.25);
            color: white;
            font-size: 1.7rem;
            font-weight: bold;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        const activeStyle = `
            background: linear-gradient(135deg, rgba(95, 161, 117, 0.4), rgba(61, 190, 106, 0.4));
            border: 1px solid rgba(124, 255, 155, 0.5);
            color: white;
            box-shadow:
                0 0 0 3px rgba(124,255,155,0.3),
                0 8px 24px rgba(0,0,0,0.4),
                0 0 20px rgba(124,255,155,0.4);
        `;

        const markerButton = L.control({ position: 'topright' });
        markerButton.onAdd = function () {
            const btn = L.DomUtil.create('button', 'hoch-sitz-btn');
            btn.innerHTML = '+';
            btn.title = 'Hochsitz hinzufügen';
            btn.style.cssText = normalStyle;

            btn.onmouseenter = () => {
                if (!state.settingHochsitz) {
                    btn.style.background = 'rgba(255, 255, 255, 0.18)';
                    btn.style.transform = 'scale(1.08)';
                }
            };
            btn.onmouseleave = () => {
                if (!state.settingHochsitz) {
                    btn.style.background = 'rgba(255, 255, 255, 0.12)';
                    btn.style.transform = 'scale(1)';
                }
            };

            L.DomEvent.disableClickPropagation(btn);
            L.DomEvent.disableScrollPropagation(btn);

            L.DomEvent.on(btn, 'click', (e) => {
                L.DomEvent.stopPropagation(e);
                state.settingHochsitz = !state.settingHochsitz;
                if (state.settingHochsitz) {
                    btn.style.cssText = normalStyle + activeStyle;
                    toast('Klicke auf die Karte um eine Jagdeinrichtung zu setzen');
                } else {
                    btn.style.cssText = normalStyle;
                    toast('Markieren abgebrochen');
                }
            });

            return btn;
        };
        markerButton.addTo(map);

        // ── Hochsitz LISTEN Button ──
        const listButton = L.control({ position: 'topright' });
        listButton.onAdd = function () {
            const btn = L.DomUtil.create('button', 'hochsitz-list-btn');
            btn.innerHTML = '☰';
            btn.title = 'Hochsitze anzeigen';
            btn.style.cssText = `
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255,255,255,0.25);
            color: white;
            font-size: 1.5rem;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
            btn.onmouseenter = () => {
                btn.style.background = 'rgba(255, 255, 255, 0.18)';
                btn.style.transform = 'scale(1.08)';
            };
            btn.onmouseleave = () => {
                btn.style.background = 'rgba(255, 255, 255, 0.12)';
                btn.style.transform = 'scale(1)';
            };

            L.DomEvent.disableClickPropagation(btn);
            L.DomEvent.disableScrollPropagation(btn);

            L.DomEvent.on(btn, 'click', (e) => {
                L.DomEvent.stopPropagation(e);
                openHochsitzPanel();
            });
            return btn;
        };
        listButton.addTo(map);

        // ── Eigengrundstücke Button (Chainsaw) ──
        const chainsawButton = L.control({ position: 'topright' });
        chainsawButton.onAdd = function () {
            const btn = L.DomUtil.create('button', 'chainsaw-list-btn');
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 18l1.4 -6h11.2l-2.4 8h-8.8a2 2 0 0 1 -2 -2z" />
            <path d="M12.4 6a2 2 0 0 1 -2 -2h-1c-1.3 0 -2.5 1 -3.2 2" />
            <path d="M14.6 12a1 1 0 0 0 -1 1v4" />
            <path d="M22 17l-1 -1" />
            <path d="M22 15l-1 -1" />
            <path d="M22 13l-1 -1" />
            <path d="M21 11l-1 -1" />
            <path d="M20 9l-1 -1" />
            <path d="M17 12l2 -2l-1.5 -1.5l-2 2" />
        </svg>`;
            btn.title = 'Eigengrundstücke anzeigen';
            btn.style.cssText = `
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255,255,255,0.25);
            color: white;
            font-size: 1.5rem;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
            btn.onmouseenter = () => {
                btn.style.background = 'rgba(255, 255, 255, 0.18)';
                btn.style.transform = 'scale(1.08)';
            };
            btn.onmouseleave = () => {
                btn.style.background = 'rgba(255, 255, 255, 0.12)';
                btn.style.transform = 'scale(1)';
            };

            L.DomEvent.disableClickPropagation(btn);
            L.DomEvent.disableScrollPropagation(btn);

            L.DomEvent.on(btn, 'click', (e) => {
                L.DomEvent.stopPropagation(e);
                openEigengrundstueckePanel();
            });
            return btn;
        };
        chainsawButton.addTo(map);

        // ── GPS-Fokus Button ──
        const gpsButton = L.control({ position: 'topright' });
        gpsButton.onAdd = function () {
            const btn = L.DomUtil.create('button', 'gps-center-btn');
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <circle cx="12" cy="12" r="8" opacity="0.3"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>`;
            btn.title = 'Zur aktuellen Position';
            btn.style.cssText = `
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255,255,255,0.25);
            border-radius: 12px;
            width: 44px;
            height: 44px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

            btn.onmouseenter = () => {
                btn.style.background = 'rgba(255, 255, 255, 0.18)';
                btn.style.transform = 'scale(1.08)';
            };
            btn.onmouseleave = () => {
                btn.style.background = 'rgba(255, 255, 255, 0.12)';
                btn.style.transform = 'scale(1)';
            };

            L.DomEvent.disableClickPropagation(btn);
            L.DomEvent.on(btn, 'click', (e) => {
                L.DomEvent.stopPropagation(e);

                if (state.gpsMarker) {
                    const pos = state.gpsMarker.getLatLng();
                    map.flyTo([pos.lat, pos.lng], 17, { duration: 0.5 });
                    toast('Zur aktuellen Position');
                    return;
                }

                if (!navigator.geolocation) {
                    toast('GPS wird von diesem Gerät nicht unterstützt', 'error');
                    return;
                }

                if (state.gpsSearching) {
                    toast('GPS-Signal wird gesucht...', 'info');
                    return;
                }

                state.gpsSearching = true;
                state.gpsHighAccuracyFailed = false;
                btn.classList.add('gps-searching');

                const checkAndStart = () => {
                    toast('GPS-Position wird gesucht...', 'info');
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const { latitude, longitude } = pos.coords;
                            updateGpsMarker(latitude, longitude);
                            map.flyTo([latitude, longitude], 17, { duration: 0.5 });
                            toast('GPS-Position gefunden');
                            stopGpsSearching();
                            startGpsTracking();
                        },
                        (err) => handleGpsError(err),
                        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 },
                    );
                    startGpsTracking();
                };

                if (navigator.permissions) {
                    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                        if (result.state === 'denied') {
                            toast('GPS ist blockiert. Bitte in den Browser-Einstellungen unter \'Website-Berechtigungen\' den Standort erlauben.', 'error');
                            stopGpsSearching();
                        } else {
                            checkAndStart();
                        }
                    }).catch(() => checkAndStart());
                } else {
                    checkAndStart();
                }
            });
            return btn;
        };
        gpsButton.addTo(map);

        // ── Firebase Marker laden und verwalten ──
        state.unsubHochsitze = mapRepo.stream(db, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                const id = change.doc.id;

                if (window.hochsitzeMarkers[id]) {
                    map.removeLayer(window.hochsitzeMarkers[id]);
                    delete window.hochsitzeMarkers[id];
                }

                if (change.type === 'added' || change.type === 'modified') {
                    const marker = L.marker([data.lat, data.lng], {
                        icon: L.divIcon({
                            className: 'hochsitz-marker',
                            html: `<svg viewBox="0 0 32 32" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="15" fill="white" stroke="#2f6f4e" stroke-width="2"/>
                            <path d="M8 12 L16 6 L24 12" stroke="#2f6f4e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <rect x="9" y="12" width="14" height="8" rx="1" fill="#2f6f4e"/>
                            <rect x="11" y="14" width="4" height="3" rx="0.5" fill="white" opacity="0.8"/>
                            <rect x="17" y="14" width="4" height="3" rx="0.5" fill="white" opacity="0.8"/>
                            <line x1="11" y1="20" x2="9" y2="26" stroke="#2f6f4e" stroke-width="2" stroke-linecap="round"/>
                            <line x1="21" y1="20" x2="23" y2="26" stroke="#2f6f4e" stroke-width="2" stroke-linecap="round"/>
                            <line x1="16" y1="20" x2="16" y2="26" stroke="#2f6f4e" stroke-width="1.5" stroke-linecap="round"/>
                            <line x1="14.5" y1="22" x2="17.5" y2="22" stroke="#2f6f4e" stroke-width="1" stroke-linecap="round"/>
                            <line x1="14.5" y1="24" x2="17.5" y2="24" stroke="#2f6f4e" stroke-width="1" stroke-linecap="round"/>
                        </svg>`,
                            iconSize: [40, 40],
                            iconAnchor: [20, 40],
                            popupAnchor: [0, -42],
                        }),
                    }).addTo(map);

                    const popupContent = `<div class="hochsitz-popup">
                    <div class="hochsitz-popup-title">${data.name || 'Hochsitz'}</div>
                    ${data.imageUrl ? `<img src="${data.imageUrl}" class="hochsitz-popup-img">` : ''}
                    <div class="hochsitz-popup-buttons">
                        <button class="hochsitz-popup-btn add-photo-btn" data-id="${id}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                            Bild
                        </button>
                        <button class="hochsitz-popup-btn delete-btn delete-marker-btn" data-id="${id}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/>
                            </svg>
                            Löschen
                        </button>
                    </div>
                </div>`;
                    marker.bindPopup(popupContent);
                    window.hochsitzeMarkers[id] = marker;
                }

                if (change.type === 'removed' && window.hochsitzeMarkers[id]) {
                    map.removeLayer(window.hochsitzeMarkers[id]);
                    delete window.hochsitzeMarkers[id];
                }
            });
        });

        // ── Bild hochladen / Marker löschen (delegierter Click-Handler) ──
        state.clickAbort = new AbortController();
        document.addEventListener('click', async (evt) => {
            const target = evt.target;
            const id = target.dataset?.id;
            if (!id) return;
            const docRef = mapRepo.doc(db, id);

            if (target.classList.contains('add-photo-btn')) {
                try {
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = 'image/*';
                    fileInput.click();
                    fileInput.onchange = async () => {
                        const file = fileInput.files[0];
                        if (!file || !window.firebase.storage) return;
                        const storageRef = window.firebase.storage().ref();
                        const fileRef = storageRef.child(`hochsitze/${id}_${file.name}`);
                        await fileRef.put(file);
                        const url = await fileRef.getDownloadURL();
                        await docRef.update({ imageUrl: url });
                        toast('Bild hochgeladen', 'success');
                    };
                } catch (err) {
                    console.error(err);
                    toast('Fehler beim Upload', 'error');
                }
            }

            if (target.classList.contains('delete-marker-btn')) {
                const confirmed = typeof window.showConfirm === 'function'
                    ? await window.showConfirm(
                        'Möchten Sie diesen Hochsitz wirklich löschen?',
                        'Hochsitz löschen',
                        'Löschen',
                    )
                    : typeof globalThis.confirm === 'function'
                        ? globalThis.confirm('Möchten Sie diesen Hochsitz wirklich löschen?')
                        : false;
                if (confirmed) {
                    await docRef.delete();
                    toast('Hochsitz gelöscht', 'success');
                }
            }
        }, { signal: state.clickAbort.signal });

    } catch (err) {
        console.error('Map initialization error:', err);
        toast('Fehler beim Laden der Karte', 'error');
    }
}

// ── Export ─────────────────────────────────────────────────────────────────

export const mapFeature = {
    init(db) {
        initPanels(db);
        initMap(db);
    },

    onLogout() {
        if (state.gpsWatchId !== null) {
            navigator.geolocation.clearWatch(state.gpsWatchId);
            state.gpsWatchId = null;
        }
        if (state.unsubHochsitze) {
            state.unsubHochsitze();
            state.unsubHochsitze = null;
        }
        if (state.unsubPanelList) {
            state.unsubPanelList();
            state.unsubPanelList = null;
        }
        if (state.clickAbort) {
            state.clickAbort.abort();
            state.clickAbort = null;
        }
        state.gpsMarker = null;
        state.gpsSearching = false;
        state.gpsHighAccuracyFailed = false;
        state.settingHochsitz = false;
        state.map = null;
        window.mapInstance = null;
        window.hochsitzeMarkers = {};
    },

    initUI() {
        // Leaflet-Controls werden intern in init() registriert,
        // kein Astro-onclick nötig.
    },
};
