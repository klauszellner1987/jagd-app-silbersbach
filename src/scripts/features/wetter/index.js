// ============================================================================
// features/wetter/index.js — Visual Crossing, Dashboard-Kacheln, Detail-Grid
// Bruecken: window.toggleDashboardFeed, window.showToast (optional), fetch
//
// Hinweis: API-Key ist wie im Legacy aus der App eingebettet — spaeter ENV.
// ============================================================================

import {
    buildVisualCrossingTimelineUrl,
    getWindDirection,
    parseTimeToMinutes,
    formatMinutes,
    formatTime,
    moonPhaseCompactName,
    buildWetterDetailGridHtml,
    translateHeroConditions,
} from './wetter.pure.js';

const SILBERSBACH = { lat: 49.2, lon: 13.05 };
const API_KEY = 'YLF2SPSJ98MKAFEXGKRQRSFBW';

const state = {
    cached: null,
    widgetClickAttached: false,
};

const sunriseIconSvg = `<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="9" x2="12" y2="3"/>
        <polyline points="9 6 12 3 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`;

const sunsetIconSvg = `<svg class="wetter-sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"/>
        <line x1="12" y1="3" x2="12" y2="9"/>
        <polyline points="9 6 12 9 15 6"/>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
        <line x1="1" y1="18" x2="3" y2="18"/>
        <line x1="21" y1="18" x2="23" y2="18"/>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
        <line x1="23" y1="22" x2="1" y2="22"/>
    </svg>`;

function updateSunBar(today, tomorrow) {
    const sunText = document.getElementById('sun-text');
    const sunIcon = document.querySelector('.wetter-sun-icon');
    if (!sunText || !today) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const sunriseToday = today.sunrise ? parseTimeToMinutes(today.sunrise) : null;
    const sunsetToday = today.sunset ? parseTimeToMinutes(today.sunset) : null;
    const sunriseTomorrow = tomorrow && tomorrow.sunrise ? parseTimeToMinutes(tomorrow.sunrise) : null;

    let text = '';
    let icon = sunriseIconSvg;

    if (sunriseToday !== null && currentMinutes < sunriseToday) {
        const diff = sunriseToday - currentMinutes;
        text = `Sonnenaufgang in ${formatMinutes(diff)} (${formatTime(today.sunrise)})`;
        icon = sunriseIconSvg;
    } else if (sunsetToday !== null && currentMinutes < sunsetToday) {
        const diff = sunsetToday - currentMinutes;
        text = `Sonnenuntergang in ${formatMinutes(diff)} (${formatTime(today.sunset)})`;
        icon = sunsetIconSvg;
    } else if (sunriseTomorrow !== null) {
        text = `Sonnenaufgang morgen (${formatTime(tomorrow.sunrise)})`;
        icon = sunriseIconSvg;
    } else {
        text = `Sonnenuntergang ${formatTime(today.sunset)}`;
        icon = sunsetIconSvg;
    }

    sunText.textContent = text;
    if (sunIcon && sunIcon.parentNode) {
        sunIcon.outerHTML = icon;
    }
}

function updateHeroWeather(current, today) {
    const heroTemp = document.getElementById('hero-temp');
    const heroDesc = document.getElementById('hero-desc');
    const heroWindText = document.getElementById('hero-wind-text');
    const heroSunText = document.getElementById('hero-sun-text');

    if (heroTemp && current) {
        heroTemp.textContent = `${current.temp.toFixed(0)}°`;
    }
    if (heroDesc && current) {
        const cond = current.conditions || '';
        heroDesc.textContent = translateHeroConditions(cond);
    }
    if (heroWindText && current) {
        const dir = getWindDirection(current.winddir);
        heroWindText.textContent = `${dir} ${current.windspeed.toFixed(0)} km/h`;
    }
    if (heroSunText && today) {
        const rise = today.sunrise ? String(today.sunrise).substring(0, 5) : '--:--';
        heroSunText.textContent = `↑ ${rise}`;
    }
}

function fillDashboardWeatherCards(current) {
    const tempCard = document.getElementById('wetter-temp');
    if (tempCard) {
        const conditionsText = current.conditions || '';
        tempCard.querySelector('.wetter-card-value').textContent = `${current.temp.toFixed(0)}°C`;
        tempCard.querySelector('.wetter-card-label').textContent = conditionsText.length > 12
            ? `${conditionsText.substring(0, 12)}...`
            : conditionsText;
    }

    const windCard = document.getElementById('wetter-wind');
    if (windCard) {
        const windDirText = getWindDirection(current.winddir);
        windCard.querySelector('.wetter-card-value').textContent = windDirText;
        windCard.querySelector('.wetter-card-label').textContent = `${current.windspeed.toFixed(0)} km/h`;
    }

    const moonCard = document.getElementById('wetter-moon');
    if (moonCard) {
        const moonPhaseName = moonPhaseCompactName(current.moonphase);
        moonCard.querySelector('.wetter-card-value').textContent = moonPhaseName;
        moonCard.querySelector('.wetter-card-label').textContent = 'Mondphase';
    }
}

export const wetterFeature = {
    getCached() {
        return state.cached;
    },

    renderDetailGrid() {
        const container = document.getElementById('wetter-detail-grid-dashboard')
            || document.getElementById('wetter-detail-grid');
        if (!container) return;

        if (!state.cached) {
            container.innerHTML = '<div class="wetter-detail-widget"><p>Wetterdaten werden geladen...</p></div>';
            return;
        }
        container.innerHTML = buildWetterDetailGridHtml(state.cached);
    },

    async refresh() {
        const url = buildVisualCrossingTimelineUrl(SILBERSBACH.lat, SILBERSBACH.lon, API_KEY);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Netzwerkfehler');
            const data = await response.json();
            state.cached = data;

            const current = data.currentConditions;
            const today = data.days && data.days[0];
            const tomorrow = data.days && data.days[1];

            fillDashboardWeatherCards(current);
            updateSunBar(today, tomorrow);
            updateHeroWeather(current, today);
            wetterFeature.renderDetailGrid();
        } catch (err) {
            console.error('Wetter Fehler:', err);
            const sunText = document.getElementById('sun-text');
            if (sunText) sunText.textContent = 'Wetter nicht verfügbar';
        }
    },

    initUI() {
        if (!state.widgetClickAttached) {
            state.widgetClickAttached = true;
            const wetterWidget = document.getElementById('wetter-widget');
            if (wetterWidget && typeof window.toggleDashboardFeed === 'function') {
                wetterWidget.style.cursor = 'pointer';
                wetterWidget.addEventListener('click', () => window.toggleDashboardFeed('wetter'));
            }
        }
    },
};
