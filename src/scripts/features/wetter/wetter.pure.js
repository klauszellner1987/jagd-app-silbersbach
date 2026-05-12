/** Visual Crossing Timeline API (Koordinaten + Key). */
export function buildVisualCrossingTimelineUrl(lat, lon, apiKey) {
    return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${apiKey}&include=current,days`;
}

export function getWindDirection(deg) {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirs[Math.floor((deg / 22.5) + 0.5) % 16];
}

export function parseTimeToMinutes(timeStr) {
    if (!timeStr) return null;
    const parts = String(timeStr).split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

export function formatMinutes(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}h ${m}min`;
    return `${m} min`;
}

export function formatTime(timeStr) {
    if (!timeStr) return '--:--';
    return String(timeStr).substring(0, 5);
}

/** Kurzbezeichnung (Dashboard-Kacheln, wie Legacy). */
export function moonPhaseCompactName(phaseNum) {
    if (phaseNum === 0) return 'Neumond';
    if (phaseNum < 0.25) return 'Zunehmend';
    if (phaseNum === 0.25) return '1. Viertel';
    if (phaseNum < 0.5) return 'Zunehmend';
    if (phaseNum === 0.5) return 'Vollmond';
    if (phaseNum < 0.75) return 'Abnehmend';
    if (phaseNum === 0.75) return '3. Viertel';
    return 'Abnehmend';
}

/** Detail-Seite (laengere Labels, wie Legacy). */
export function moonPhaseDetailName(phaseNum) {
    if (phaseNum === 0) return 'Neumond';
    if (phaseNum < 0.25) return 'Zunehmende Sichel';
    if (phaseNum === 0.25) return 'Erstes Viertel';
    if (phaseNum < 0.5) return 'Zunehmender Mond';
    if (phaseNum === 0.5) return 'Vollmond';
    if (phaseNum < 0.75) return 'Abnehmender Mond';
    if (phaseNum === 0.75) return 'Letztes Viertel';
    return 'Abnehmende Sichel';
}

export function uvIndexLabel(uvIndex) {
    if (uvIndex <= 2) return 'Niedrig';
    if (uvIndex <= 5) return 'Moderat';
    if (uvIndex <= 7) return 'Hoch';
    if (uvIndex <= 10) return 'Sehr hoch';
    return 'Extrem';
}

export function precipTypeGerman(preciptype) {
    return preciptype && preciptype.length ? preciptype.join(', ') : 'Kein Niederschlag';
}

/** Deutsche Kurzbeschreibung fuer Hero-Zeile. */
export function translateHeroConditions(cond) {
    if (!cond) return '';
    const condMap = {
        Clear: 'Klar',
        'Partially cloudy': 'Teils bewölkt',
        Overcast: 'Bedeckt',
        Rain: 'Regen',
        Snow: 'Schnee',
        Fog: 'Nebel',
        Thunderstorm: 'Gewitter',
        Drizzle: 'Nieselregen',
        Cloudy: 'Bewölkt',
        'Rain, Overcast': 'Regen & Bedeckt',
        'Rain, Partially cloudy': 'Leichter Regen',
        'Snow, Overcast': 'Schnee & Bedeckt',
        'Rain, Thunder': 'Gewitter',
        'Freezing Drizzle/Freezing Rain': 'Eisregen',
        'Light Rain': 'Leichter Regen',
        'Heavy Rain': 'Starkregen',
    };
    const condMapSimple = {
        Clear: 'Klar',
        Overcast: 'Bedeckt',
        Rain: 'Regen',
        Snow: 'Schnee',
        Fog: 'Nebel',
        Drizzle: 'Nieselregen',
        Cloudy: 'Bewölkt',
        Thunder: 'Gewitter',
    };
    const firstCond = String(cond).split(',')[0].trim();
    return condMap[cond] || condMapSimple[firstCond] || firstCond;
}

/**
 * HTML fuer #wetter-detail-grid / Dashboard-Spiegel (ohne XSS-Escaping fuer API-Zahlen —
 * gleiche Risikoprofil wie Legacy-Template.)
 */
export function buildWetterDetailGridHtml(snapshot) {
    const current = snapshot.currentConditions || {};
    const today = snapshot.days && snapshot.days[0] ? snapshot.days[0] : null;

    const moonPhaseName = moonPhaseDetailName(current.moonphase ?? 0);
    const uvIndex = current.uvindex || 0;
    const uvBewertung = uvIndexLabel(uvIndex);
    const precipType = precipTypeGerman(current.preciptype);
    const windDir = getWindDirection(current.winddir || 0);

    const moonPct = ((current.moonphase ?? 0) * 100).toFixed(0);

    return `
        <!-- Temperatur Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                </svg>
                <span>Temperatur</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${current.temp?.toFixed(1) ?? '--'}°C</div>
                <div class="wetter-detail-row">
                    <span>Gefühlt</span>
                    <span>${current.feelslike?.toFixed(1) ?? '--'}°C</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Min / Max</span>
                    <span>${today?.tempmin?.toFixed(0) ?? '--'}° / ${today?.tempmax?.toFixed(0) ?? '--'}°</span>
                </div>
            </div>
        </div>
        
        <!-- Wind Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                </svg>
                <span>Wind</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${current.windspeed?.toFixed(0) ?? '--'} km/h</div>
                <div class="wetter-detail-row">
                    <span>Richtung</span>
                    <span>${windDir} (${current.winddir?.toFixed(0) ?? '--'}°)</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Böen</span>
                    <span>${current.windgust?.toFixed(0) ?? '--'} km/h</span>
                </div>
            </div>
        </div>
        
        <!-- Niederschlag Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
                <span>Niederschlag</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${current.precip?.toFixed(1) ?? '0'} mm</div>
                <div class="wetter-detail-row">
                    <span>Wahrscheinlichkeit</span>
                    <span>${today?.precipprob?.toFixed(0) ?? '0'}%</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Typ</span>
                    <span>${precipType}</span>
                </div>
            </div>
        </div>
        
        <!-- Luftfeuchtigkeit Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
                <span>Luftfeuchtigkeit</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${current.humidity?.toFixed(0) ?? '--'}%</div>
                <div class="wetter-detail-row">
                    <span>Taupunkt</span>
                    <span>${current.dew?.toFixed(1) ?? '--'}°C</span>
                </div>
                <div class="wetter-detail-row">
                    <span>Luftdruck</span>
                    <span>${current.pressure?.toFixed(0) ?? '--'} hPa</span>
                </div>
            </div>
        </div>
        
        <!-- Sonne Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
                <span>Sonne</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-row highlight">
                    <span>Sonnenaufgang</span>
                    <span>${formatTime(today?.sunrise)}</span>
                </div>
                <div class="wetter-detail-row highlight">
                    <span>Sonnenuntergang</span>
                    <span>${formatTime(today?.sunset)}</span>
                </div>
                <div class="wetter-detail-row">
                    <span>UV-Index</span>
                    <span>${uvIndex} (${uvBewertung})</span>
                </div>
            </div>
        </div>
        
        <!-- Mond Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <span>Mond</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${moonPhaseName}</div>
                <div class="wetter-detail-row">
                    <span>Beleuchtung</span>
                    <span>${moonPct}%</span>
                </div>
            </div>
        </div>
        
        <!-- Sichtweite Widget -->
        <div class="wetter-detail-widget">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Sichtweite</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-main">${current.visibility?.toFixed(0) ?? '--'} km</div>
                <div class="wetter-detail-row">
                    <span>Bewölkung</span>
                    <span>${current.cloudcover?.toFixed(0) ?? '--'}%</span>
                </div>
            </div>
        </div>
        
        <!-- Bedingungen Widget -->
        <div class="wetter-detail-widget full-width">
            <div class="wetter-detail-header">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                </svg>
                <span>Aktuelle Bedingungen</span>
            </div>
            <div class="wetter-detail-content">
                <div class="wetter-detail-conditions">${current.conditions ?? 'Keine Daten'}</div>
            </div>
        </div>
    `;
}
