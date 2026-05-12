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
import { bulletinFeature } from './features/bulletin/index.js';
import { notificationsFeature } from './core/notifications/index.js';
import { streckenlisteFeature } from './features/streckenliste/index.js';
import { schonzeitFeature } from './features/schonzeit/index.js';
import { wetterFeature } from './features/wetter/index.js';
import { dokumenteFeature } from './features/dokumente/index.js';
import { mapFeature } from './features/map/index.js';
import { authFeature } from './features/auth/index.js';

const features = (window.__features = window.__features || {});
features.presence = presenceFeature;
features.bulletin = bulletinFeature;
features.notifications = notificationsFeature;
features.streckenliste = streckenlisteFeature;
features.schonzeit = schonzeitFeature;
features.wetter = wetterFeature;
features.dokumente = dokumenteFeature;
features.map = mapFeature;
features.auth = authFeature;

// Hilfreich fuer Debug + E2E-Tests: signalisiert, dass die Bridge bereit ist.
window.__featuresReady = true;
window.dispatchEvent(new CustomEvent('features:ready', { detail: { features: Object.keys(features) } }));
