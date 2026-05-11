// ============================================================================
// main.js - Bootstrap fuer das modulare v6-Bundle
// ----------------------------------------------------------------------------
// Wird via Astro/Vite als <script type="module"> gebuendelt und VOR dem
// Monolith `public/js/app.js` ausgefuehrt (Modules sind defer per Default,
// laufen aber als ESM-Bundle).
//
// Aufgabe: Registriert alle migrierten Feature-Module auf
//   window.__features.<name>
// damit der Monolith schrittweise auf die neuen Module umschalten kann,
// ohne dass der Monolith selbst ein ESM werden muss.
// ============================================================================

import { presenceFeature } from './features/presence/index.js';

const features = (window.__features = window.__features || {});
features.presence = presenceFeature;

// Hilfreich fuer Debug + E2E-Tests: signalisiert, dass die Bridge bereit ist.
window.__featuresReady = true;
window.dispatchEvent(new CustomEvent('features:ready', { detail: { features: Object.keys(features) } }));
