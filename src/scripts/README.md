# src/scripts — Modulares v6-Bundle

Hier wohnt der schrittweise extrahierte Code aus dem ehemals 3434-Zeilen-
Monolith `public/js/app.js` (Zeilenzahl schrumpft mit jedem
Feature-Refactor weiter). Das Ziel von v6 ist, Feature für Feature in
saubere Module zu zerlegen, ohne dass die App zwischendurch unbenutzbar
wird.

Jedes Feature folgt demselben Muster, dem **Bridge-Pattern**, das wir mit
dem Pilot-Modul `presence/` etabliert haben.

## Verzeichnis-Layout

```
src/scripts/
  core/                  # querschnittliche Module (kein Domain-Feature)
    notifications/       # FCM (Web + Native), Token-Verwaltung
      index.js
      webToken.js
      nativeToken.js
  data/                  # Repository-Layer (kapselt Firestore-Pfade)
    userRepo.js
    bulletinRepo.js
    entriesRepo.js
    fcmTokenRepo.js
    dokumenteRepo.js
    mapRepo.js
  features/              # Domain-Module
    presence/            # PILOT - Online-Anzeige + Heartbeat
      index.js
      presence.pure.js
    bulletin/            # Schwarzes Brett
      index.js
      bulletin.pure.js
    streckenliste/       # Abschüsse / entries
      index.js
      streckenliste.pure.js
    schonzeit/           # Jagd-/Schonzeiten (Widget + Listen, kein Firestore)
      index.js
      schonzeit.pure.js
    wetter/              # Visual Crossing API, Dashboard-Kacheln, Detail-Grid
      index.js
      wetter.pure.js
    dokumente/           # Dokumentensafe Wizard, Fotos Firebase Storage + FS
      index.js
      dokumente.pure.js
    map/                 # Leaflet-Karte, GPS, Hochsitz-Panels, Eigengrundstücke
      index.js
    auth/                # Login-Overlay, onAuthStateChanged, logout (Phase 8a)
      index.js
  ui/                    # Toasts, Modals, Image-Viewer (später)
  main.js                # Bootstrap-Bundle, registriert window.__features.*
```

## Bridge-Pattern

Der Monolith `public/js/app.js` lädt synchron im Body, das v6-Modul-Bundle
läuft als ES-Module (defer via `<script>` in [src/layouts/Layout.astro](../layouts/Layout.astro)).

```mermaid
flowchart LR
    Layout[Layout.astro] -->|"loads bundled"| Bootstrap[main.js]
    Layout -->|"loads inline legacy"| Mono[public/js/app.js]
    Bootstrap -->|"registers"| Bridge["window.__features.&lt;name&gt;"]
    Mono -.->|"calls via Optional-Chaining"| Bridge
    Bridge --> FeatureMod[features/&lt;name&gt;/index.js]
    FeatureMod --> Pure[features/&lt;name&gt;/&lt;name&gt;.pure.js]
    FeatureMod --> Repo[data/&lt;name&gt;Repo.js]
    Repo --> Firestore[("Firestore")]
```

Aufrufe vom Monolithen gehen ausschliesslich durch:

```javascript
window.__features?.<name>?.<method>(...)
```

Das Optional-Chaining sorgt für graceful degradation: wenn das Bundle
nicht geladen wäre (z.B. Build-Fehler), crasht die App nicht — das Feature
ist nur still.

## Repository-Pattern

Alle Firestore-Zugriffe eines Features laufen über genau **einen** Repository
in `src/scripts/data/<name>Repo.js`. Der Pfad zur Collection wird in genau
einer Funktion bestimmt:

```javascript
function usersCollection() {
    return window.firebase.firestore().collection('users');
    // Multi-Tenant-Zukunft: collection('tenants').doc(TENANT_ID).collection('users')
}
```

Damit ist der Tenant-Switch eine Single-File-Änderung pro Repository.

## Pure vs. Impure

- **`<name>.pure.js`**: Reine Funktionen + Konstanten, **keine** DOM-, Firebase-,
  Timer- oder Zufallszugriffe. Isoliert testbar mit Vitest, schnell.
- **`index.js`**: Lifecycle, DOM, Repo-Aufrufe, Timer, Listener.

Diese Trennung hat den Pilot-Test `tests/unit/presence.test.js` (11 Tests
nur gegen die Pure-Helper) ermöglicht.

## Definition of Done — Modul-Migration-Checkliste

Für jedes weitere Modul vor dem Merge nach `release/v6.0.0`:

- [ ] Neuer Ordner `src/scripts/features/<name>/` mit `index.js` und ggf. `<name>.pure.js`
- [ ] Repository unter `src/scripts/data/<name>Repo.js` (falls Firestore-Zugriff)
- [ ] Bridge in `src/scripts/main.js` registriert `window.__features.<name>`
- [ ] Alte Implementierung aus `public/js/app.js` entfernt (Zeilen gezählt im Commit)
- [ ] Aufrufstellen im Monolithen via `window.__features?.<name>?.*` ersetzt
- [ ] Unit-Tests `tests/unit/<name>.test.js` (Pure-Helper)
- [ ] Unit-Tests `tests/unit/<name>Repo.test.js` (Repo mit window.firebase Stub)
- [ ] Unit-Tests `tests/unit/<name>Feature.test.js` (Lifecycle + Rendering, happy-dom)
- [ ] Bei Bedarf Smoke-E2E in `tests/e2e/smoke.spec.js` erweitern (Refactor-Phase: Fokus auf Unit-Tests; globales Minimal-Smoke deckt Bridges + einen Datenpfad ab)
- [ ] `npm run test` grün
- [ ] `npm run test:e2e` grün (lokal vor Push)
- [ ] `npm run build` lokal ohne Fehler/Warnings
- [ ] Smoke-Test mit `npm run dev`: Feature-UI funktioniert wie vorher
- [ ] CI auf `release/v6.0.0` grün (test.yml läuft automatisch)
- [ ] Commits sauber strukturiert:
    - `chore(<name>):` Vorbereitungen
    - `refactor(<name>):` Extraktion + Monolith-Cleanup
    - `test(<name>):` Unit + E2E
    - `build(<name>):` docs/ Output

## Modul-Status

| Phase     | Modul                | Status     | Bemerkung                                                                 |
| --------- | -------------------- | ---------- | ------------------------------------------------------------------------- |
| 1 (Pilot) | `presence/`          | migriert   | Online-Anzeige + Heartbeat, voll getestet                                 |
| 2         | `bulletin/`          | migriert   | Schwarzes Brett (Liste, Preview, Badge, Stats-Detail)                     |
| 2         | `core/notifications/`| migriert   | FCM-Token (Web + Native), orthogonal zum Bulletin-Modul                   |
| 3         | `streckenliste/`     | migriert   | entries-Repo, Liste/Modal/Fotos/Excel, Bridge + `renderDetailStats`       |
| 4         | `schonzeit/`         | migriert   | Pure `schonzeit.pure.js`, Widget/Liste/API `initUI`; `pure.js`-Re-Export |
| 5         | `wetter/`            | migriert   | `wetter.pure.js` (Formatierung/HTML), `refresh` + `renderDetailGrid` |
| 6         | `dokumente/`         | migriert   | `dokumente.pure.js`, `dokumenteRepo`, Wizard/Upload, `window.compressImage`-Brücke |
| 7         | `map/`               | migriert   | Leaflet, GPS, Hochsitz-Panels, Eigengrundstücke, `mapRepo`, `AbortController` |
| 8         | `auth/` + `core/`    | teilweise  | **8a:** `features/auth` — Login, `onAuthStateChanged`, `logout` (`window.logout`); **offen:** Profil-Modal, Toasts/Confirm, Navigation, PWA/SW, Version, `firebaseConfig` im Monolith |

## Phase 8 — Inventur: Was noch in `public/js/app.js` liegt

| Block (ca.) | Inhalt |
|---------------|--------|
| App-Version, `toggleDashboardFeed` | globale Dashboard-Feeds, FABs |
| `firebaseConfig` | Compat-Init (Auth-Modul nutzt dieselbe Config per Injection) |
| `isNativeApp` | Capacitor-Check |
| `jagdzeitenBayern` + Bridge | `window.jagdzeitenBayern` für Schonzeit/Streckenliste |
| `showToast` / `showConfirm` | UI-Helfer (künftig `core/ui` oder behalten bis alle Features umgestellt) |
| Navigation | `navigateToPage`, `navigateToDashboard`, `closeMapPanels`, `setActiveTab`, `navigateToTab`, `initNavigation` |
| `compressImage` + `window.compressImage` | Profil + Dokumente |
| `updateUserInfo`, `openProfileModal`, Profil-`submit` in `initAll` | Firebase Auth Profil + Storage |
| `preventIOSBounce`, `initClock` | Shell |
| `initializeApp`, `renderDetailStats` | Post-Login App-Start (Firestore, Features) |
| PWA `initInstallPrompt`, `showInstallBannerAfterLogin` | Install-Banner |
| Service-Worker-Registrierung + `globalSwReg` | FCM / Updates |
| `checkForUpdates`, `showUpdateToast` | Version-Fallback |
| `initAll`, `updateVersionDisplays`, Error-Handler | Bootstrap |

Nächste sinnvolle Schritte: **8b** Toasts/Confirm → `core/ui`, **8c** Navigation → `features/navigation` oder `core/shell`, **8d** Profil → `features/profile`, **8e** PWA + SW + Version → `core/pwa` / `core/version`, zuletzt **8f** schlanker `app.js`-Bootstrap + optional `firebaseConfig` auslagern.

## Bekannte Einschränkungen / TODOs

- `public/js/lib/pure.js` re-exportiert Schonzeit-Pure aus `features/schonzeit/`;
  `compressImage` bleibt hier bis Profil bzw. Asset-Modul; der Monolith setzt zusätzlich
  `window.compressImage` fuer das Dokumenten-Upload-Feature.
- `window.firebase` (Compat-SDK) wird vom Monolithen erwartet — der wechsel
  auf modulares Firebase v9+ ist erst sinnvoll, wenn der Monolith vollständig
  weg ist.
- Capacitor-Hooks (`App.addListener`) duplizieren sich potenziell zwischen
  Modulen — falls mehr als 1 Modul sie braucht, in `core/` zentralisieren.
