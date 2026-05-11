# GJR Silbersbach - Jagd-Revier App

Eine moderne Web-App für das Jagd-Revier Silbersbach mit Karte, Streckenliste und Wetterdaten.

## Features

- **Dashboard**: Übersichtliche Startseite mit Uhr, Wetter-Widgets und Navigation
- **Revier-Karte**: Interaktive Leaflet-Karte mit Reviergebieten und Hochsitz-Markierungen
- **Streckenliste**: Erfassung und Verwaltung erlegter Strecke mit Firebase-Backend
- **Wetterdaten**: Live-Wetter mit Temperatur, Wind und Mondphase
- **Firebase Authentication**: Sicherer Login mit E-Mail und Passwort
- **Personalisierung**: Individueller Name für Begrüßung und Konto-Einstellungen
- **Native App**: Native Android-Version via Capacitor integriert
- **PWA**: Installierbar auf Handy und Desktop via Browser

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS, Glassmorphism-Design
- **Build Tool**: Vite
- **Mobile Foundation**: Capacitor (für native App-Wrapper)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Karte**: Leaflet.js
- **Deployment**: GitHub Pages (docs-Ordner) & Native Android App

## Installation & Development

### Voraussetzungen

- Node.js (v18 oder höher)
- npm

### Setup

```bash
# Repository klonen
git clone https://github.com/klauszellner1987/jagd-app-silbersbach.git
cd jagd-app-silbersbach

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Der Dev-Server startet unter: `http://localhost:5176/jagd-app-silbersbach/`

### Build für Production

```bash
npm run build
```

Der Build wird im `docs/` Ordner erstellt (für GitHub Pages).

### Android App (Native)

Die App kann als native Android-Anwendung mit Capacitor gebaut werden:

```bash
# Web-Assets bauen und zum Android-Projekt synchronisieren
npm run cap:build

# Android Studio öffnen, um die App zu starten oder APK zu erstellen
npm run cap:open
```

Stelle sicher, dass **Android Studio** und das **Android SDK** installiert sind.

## Tests ausführen

Die App hat eine zweistufige Testsuite, die vor jedem Release laufen sollte.

### Setup (einmalig)

```bash
# Dependencies installieren (enthält Vitest + Playwright)
npm install

# Playwright-Browser einmalig herunterladen
npx playwright install --with-deps chromium
```

### Befehle

| Befehl                  | Was passiert                                                        |
| ----------------------- | ------------------------------------------------------------------- |
| `npm test`              | Vitest Unit-Tests einmalig ausführen (Pure-Functions in `lib/pure.js`) |
| `npm run test:watch`    | Vitest Watch-Mode für Entwicklung                                   |
| `npm run test:coverage` | Vitest mit V8-Coverage-Report (HTML in `coverage/`)                  |
| `npm run test:e2e`      | Playwright E2E-Tests gegen `npm run dev` (Desktop + Mobile Pixel 7) |
| `npm run test:e2e:ui`   | Playwright UI-Mode (interaktiv)                                     |
| `npm run test:all`      | Beides nacheinander (Unit + E2E)                                    |

### Was wird getestet?

- **Unit (`tests/unit/`)**: Reine Logik - Online-Status (`isUserCurrentlyOnline`), Schonzeiten-Berechnung (`istSchonzeit`, inkl. Wraparound), Bild-Komprimierung (`compressImage`).
- **E2E (`tests/e2e/`)**: Login-Overlay, Dashboard-Quick-Links, Feed-Navigation (Wetter / Dokus / Schonzeit), Mobile-Viewport-Check (keine horizontale Scrollbar).

Firebase wird in E2E-Tests durch einen In-Memory-Stub (`tests/fixtures/mockFirebase.js`) ersetzt, der vor jedem Page-Load injiziert wird. Echte CDN-Skripte werden via `page.route()` blockiert. **Es wird kein echter Firebase-Account benötigt.**

### CI

GitHub Actions läuft automatisch bei Push auf `main`/`release/**` und bei Pull Requests gegen `main`:

- `astro check` (Linting + TypeScript)
- `npm test` (Vitest)
- `npm run test:e2e` (Playwright Chromium + Pixel 7)
- Bei Failure wird der HTML-Report als Artifact hochgeladen.

Workflow-Datei: `.github/workflows/test.yml`.

## Ordnerstruktur

```
├── src/
│   ├── components/     # Astro-Komponenten (Views, UI)
│   └── layouts/        # Page-Layout
├── public/
│   ├── js/
│   │   ├── app.js      # Monolithische Client-Logik
│   │   └── lib/
│   │       └── pure.js # Reine Hilfsfunktionen (testbar)
│   ├── style/main.css  # Haupt-Styles
│   └── assets/         # Bilder, Daten
├── tests/
│   ├── unit/           # Vitest Unit-Tests
│   ├── e2e/            # Playwright E2E-Tests
│   └── fixtures/       # Firebase-Stub + Test-Helper
├── .github/workflows/  # CI: deploy.yml + test.yml
├── docs/               # Production Build (GitHub Pages)
├── astro.config.mjs    # Astro Konfiguration
├── vitest.config.ts    # Vitest Konfiguration
├── playwright.config.ts # Playwright Konfiguration
├── tailwind.config.js  # Tailwind Konfiguration
└── package.json        # Dependencies
```

## Changelog

### v4.1.0 - Icon-Standardisierung & Performance
**Vollständige Überarbeitung der Grafiken für ein einheitliches App-Erlebnis:**

- **Standardisierte Tier-Icons**: Alle Wildarten in der Jagd- und Schonzeitliste verwenden nun hochwertige PNG-Silhouetten statt der alten SVG-Platzhalter.
- **Silhouette-Effekt**: Durch CSS-Blending (Lighten) und Kontrast-Filter fügen sich die schwarzen PNGs perfekt als weiße Silhouetten in das dunkle Glassmorphism-Design ein.
- **Optimierte Skalierung**: Jedes Tier-Icon wurde individuell skaliert (z.B. Rehwild 1.1x, Wildschwein 1.2x), um einen einheitlichen "optischen Flow" in der Liste zu gewährleisten.
- **Interaction Fixes**: Deaktivierung des blauen "Tap-Highlights" beim Klicken auf Widgets/Karten auf Android-Geräten für ein natives App-Feeling.
- **Bereinigte Daten**: Entfernung veralteter SVG-Definitionen aus dem Code für bessere Performance und Wartbarkeit.

### v4.0.0 - Personalisierung & Native App Support

**Großes Update für App-Gefühl und Individualität:**

- **Native App Version**: Integration von Capacitor für echte Android-Funktionalität.
- **Profil-Personalisierung**: Neues Menü in den Einstellungen, um einen individuellen Namen festzulegen.
- **Dynamische Begrüßung**: Das Dashboard begrüßt den Nutzer jetzt persönlich statt mit "Waidmann" oder "Jäger".
- **Auto-Close Panels**: Karten-Seitenleisten (Hochsitze & Flurstücke) schließen sich nun automatisch beim Verlassen der Karte.
- **UI Bugfixes**: Korrektur der `<strong>`-Tags in der Hochsitz-Liste und stabilere Map-Initialisierung.
- **Datenpflege**: Flurstück 733 auf 753 korrigiert und Koordinaten aktualisiert.

### v2.0.1 - Bugfixes

**Fehlerbehebungen nach v2.0.0 Release:**

- Fix: CSS-Link für GitHub Pages korrigiert
- Fix: Login-Spinner bei erfolgreichem Login ausblenden
- Fix: Login-Spinner CSS-Spezifität korrigiert (war initial sichtbar)
- Cache-Buster für zuverlässigere Updates aktualisiert

### v2.0.0 - Kombiniertes Wetter-Widget

**Großes Feature-Update mit neuem Wetter-System:**

- **Kombiniertes Wetter-Widget**: Temperatur, Wind, Mond und Sonnenauf-/untergang in einem Widget
- **Wetter-Detailseite**: Klick auf Wetter-Widget zeigt alle verfügbaren API-Daten
- **8 Detail-Widgets**: Temperatur, Wind, Niederschlag, Luftfeuchtigkeit, Sonne, Mond, Sichtweite, Bedingungen
- **Dynamische Sonnenanzeige**: Zeigt nächsten Sonnenaufgang oder -untergang mit Countdown
- **Passwort-Toggle**: Auge-Symbol im Login für Passwort-Sichtbarkeit
- **Version & Creator**: Anzeige im Login-Footer (dynamisch aus version.json)
- **Verbesserte Icons**: SVG-Icons für Sonnenauf-/untergang passend zum App-Style

### v1.2.3 - Mobile Optimierungen + Auto-Update

**Mobile UI Verbesserungen und automatische Updates:**

- Login-Box Mobile: Fullscreen auf kleinen Bildschirmen
- Auto-Update System: Automatische Benachrichtigung bei neuen Versionen
- PWA verbessert: Zuverlässigere Cache-Verwaltung mit localStorage-basiertem Versioning
- Toast-Notifications: SVG-Icons statt Emojis, einheitliches Design
- Dashboard Mobile: Feste Höhe, kein Scrolling, optimierte Widget-Größen
- Streckenliste: Detaillierte Karten-Ansicht, verbessertes Mobile Layout
- Karten-Verbesserungen: GPS-Button, Hochsitz-Icons, schnellere Animation

### v1.2.0 - Firebase Authentication

**Sicherer Login mit Firebase Email/Password Authentication:**

- PIN-Login durch Firebase E-Mail/Passwort-Authentifizierung ersetzt
- Logout-Button im Dashboard hinzugefügt
- "Jagdrevier Silbersbach" Branding im Login-Screen
- Flash-of-Content beim Laden verhindert
- Session-Management mit Firebase Auth State Listener
- Verbesserte Fehlerbehandlung mit deutschen Fehlermeldungen

### v1.1.0 - Glassmorphism Redesign

**Komplettes UI-Redesign mit modernem Glassmorphism-Style:**

- Neues Dashboard als Startseite nach Login
- Glasmorphism-Widgets für Uhr, Wetter und Navigation
- Neuer atmosphärischer Wald-Hintergrund mit Rothirsch
- Transparenter Login-Screen mit Blur-Effekt
- Entfernung der Tab-Navigation zugunsten von Widget-Navigation
- "Zurück"-Buttons in Unterseiten (Karte, Streckenliste)
- Responsive Design für Mobile und Desktop
- Verbesserte Karten-Performance (Tile-Caching, optimierte Zoom-Einstellungen)
- Service Worker mit Network-First-Strategie
- Build-System auf Vite mit Tailwind CSS umgestellt

### v1.0.0 - Initial Release

- Basis-Funktionalität mit Karte, Streckenliste und Wetter
- Firebase-Integration
- PWA-Support

## Live Demo

[https://klauszellner1987.github.io/jagd-app-silbersbach/](https://klauszellner1987.github.io/jagd-app-silbersbach/)

## Lizenz

Private Nutzung - GJR Silbersbach
