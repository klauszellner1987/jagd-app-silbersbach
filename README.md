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

## Ordnerstruktur

```
├── index.html          # Hauptseite
├── style/
│   ├── main.css        # Haupt-Styles
│   └── tailwind.css    # Tailwind Imports
├── js/
│   └── app.js          # JavaScript-Logik
├── assets/
│   ├── images/         # Bilder (Hintergründe, etc.)
│   └── data/           # Daten (Reviere, Einträge)
├── docs/               # Production Build (GitHub Pages)
├── vite.config.js      # Vite Konfiguration
├── tailwind.config.js  # Tailwind Konfiguration
└── package.json        # Dependencies
```

## Changelog

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
