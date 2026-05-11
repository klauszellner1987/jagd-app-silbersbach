// ============================================================================
// features/presence/index.js
// ----------------------------------------------------------------------------
// Online-Anzeige + Heartbeat fuer das Jagdrevier.
//
// Lifecycle:
//   onLogin(user)  -> Heartbeat starten, Visibility/beforeunload/Capacitor-
//                     Listener registrieren
//   onLogout()     -> alle Timer/Listener cleanen, lokalen State auf null
//   initUI()       -> Dropdown-Klick, Firestore-Snapshot, Renderer-Interval
//   markOffline()  -> wird vom Monolithen im logout()-Flow aufgerufen
//
// Modul-State lebt im Closure (kein Global im window-namespace).
// ============================================================================

import { userRepo } from '../../data/userRepo.js';
import {
    HEARTBEAT_INTERVAL_MS,
    PRESENCE_RENDER_REFRESH_MS,
    isUserCurrentlyOnline,
    formatRelativeTime,
    escapeHtml,
} from './presence.pure.js';

const state = {
    user: null,
    heartbeatTimer: null,
    visibilityHandler: null,
    beforeUnloadHandler: null,
    capacitorAppListener: null,
    capacitorPauseListener: null,
    capacitorResumeListener: null,
    rendererTimer: null,
    snapshotUnsub: null,
    lastSnapshotDocs: [],
    listenersAttached: false,
};

function startHeartbeat(user) {
    if (state.heartbeatTimer) return;
    userRepo.upsertPresence(user, true);
    state.heartbeatTimer = setInterval(() => {
        if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
            userRepo.upsertPresence(user, true);
        }
    }, HEARTBEAT_INTERVAL_MS);
}

function stopHeartbeat() {
    if (state.heartbeatTimer) {
        clearInterval(state.heartbeatTimer);
        state.heartbeatTimer = null;
    }
}

function attachCapacitorHooks() {
    if (!(typeof window !== 'undefined' && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App)) {
        return;
    }
    const { App } = window.Capacitor.Plugins;

    App.addListener('appStateChange', ({ isActive }) => {
        if (!state.user) return;
        if (isActive) {
            startHeartbeat(state.user);
        } else {
            stopHeartbeat();
            userRepo.upsertPresence(state.user, false);
        }
    }).then((handle) => { state.capacitorAppListener = handle; }).catch(() => {});

    App.addListener('pause', () => {
        if (state.user) {
            stopHeartbeat();
            userRepo.upsertPresence(state.user, false);
        }
    }).then((handle) => { state.capacitorPauseListener = handle; }).catch(() => {});

    App.addListener('resume', () => {
        if (state.user) {
            startHeartbeat(state.user);
        }
    }).then((handle) => { state.capacitorResumeListener = handle; }).catch(() => {});
}

function detachCapacitorHooks() {
    [state.capacitorAppListener, state.capacitorPauseListener, state.capacitorResumeListener].forEach((handle) => {
        if (handle && typeof handle.remove === 'function') {
            try { handle.remove(); } catch (_) { /* ignore */ }
        }
    });
    state.capacitorAppListener = null;
    state.capacitorPauseListener = null;
    state.capacitorResumeListener = null;
}

function renderOnlineUsers(docs) {
    const userList = document.getElementById('online-users-list');
    const onlineCount = document.getElementById('online-count');
    if (!userList || !onlineCount) return;

    let count = 0;

    const sortedDocs = docs.slice().sort((a, b) => {
        const aOnline = isUserCurrentlyOnline(a) ? 1 : 0;
        const bOnline = isUserCurrentlyOnline(b) ? 1 : 0;
        if (aOnline !== bOnline) return bOnline - aOnline;
        const aTime = a.lastSeen && typeof a.lastSeen.toDate === 'function' ? a.lastSeen.toDate().getTime() : 0;
        const bTime = b.lastSeen && typeof b.lastSeen.toDate === 'function' ? b.lastSeen.toDate().getTime() : 0;
        return bTime - aTime;
    });

    const html = sortedDocs.map((data) => {
        const live = isUserCurrentlyOnline(data);
        if (live) count++;
        const lastSeenDate = data.lastSeen && typeof data.lastSeen.toDate === 'function' ? data.lastSeen.toDate() : null;
        const timeStr = lastSeenDate ? formatRelativeTime(lastSeenDate) : 'Unbekannt';
        const statusClass = live ? 'online' : 'offline';
        const name = escapeHtml(data.displayName || 'Unbekannter Jäger');
        const avatar = data.photoURL
            ? `<img src="${escapeHtml(data.photoURL)}" alt="">`
            : '<div class="user-status-avatar-placeholder"><i class="ti ti-user"></i></div>';
        return `
            <div class="user-status-item">
                <div class="user-status-avatar">
                    ${avatar}
                    <div class="status-dot ${statusClass}"></div>
                </div>
                <div class="user-status-info">
                    <span class="user-status-name">${name}</span>
                    <span class="user-status-lastseen">${live ? 'Jetzt aktiv' : timeStr}</span>
                </div>
            </div>
        `;
    }).join('');

    userList.innerHTML = html || '<div class="dropdown-loading">Keine Mitglieder gefunden</div>';
    onlineCount.textContent = count;
}

export const presenceFeature = {
    /**
     * Wird vom Bootstrap nach erfolgreichem Auth-State aufgerufen.
     * @param {{ uid: string, displayName?: string, photoURL?: string }} user
     */
    onLogin(user) {
        this.onLogout();
        state.user = user;

        startHeartbeat(user);

        state.visibilityHandler = () => {
            if (!state.user) return;
            if (document.visibilityState === 'visible') {
                startHeartbeat(state.user);
            } else {
                stopHeartbeat();
                userRepo.upsertPresence(state.user, false);
            }
        };
        document.addEventListener('visibilitychange', state.visibilityHandler);

        state.beforeUnloadHandler = () => {
            userRepo.upsertPresenceSync(user.uid);
        };
        window.addEventListener('beforeunload', state.beforeUnloadHandler);

        attachCapacitorHooks();
    },

    /**
     * Cleant alle Listener/Timer. Idempotent.
     */
    onLogout() {
        stopHeartbeat();
        if (state.visibilityHandler) {
            document.removeEventListener('visibilitychange', state.visibilityHandler);
            state.visibilityHandler = null;
        }
        if (state.beforeUnloadHandler) {
            window.removeEventListener('beforeunload', state.beforeUnloadHandler);
            state.beforeUnloadHandler = null;
        }
        detachCapacitorHooks();
        state.user = null;
    },

    /**
     * Wires Dropdown-UI + startet Firestore-Snapshot.
     * Wird genau einmal aus dem Monolith-`initAll()` aufgerufen.
     */
    initUI() {
        const trigger = document.getElementById('profile-trigger');
        const dropdown = document.getElementById('online-users-dropdown');
        if (!trigger || !dropdown) return;
        if (state.listenersAttached) return;
        state.listenersAttached = true;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });

        state.snapshotUnsub = userRepo.streamAll(
            (docs) => {
                state.lastSnapshotDocs = docs;
                renderOnlineUsers(docs);
            },
            () => {
                const userList = document.getElementById('online-users-list');
                if (userList) userList.innerHTML = '<div class="dropdown-loading">Fehler beim Laden</div>';
            },
        );

        if (state.rendererTimer) clearInterval(state.rendererTimer);
        state.rendererTimer = setInterval(() => {
            if (state.lastSnapshotDocs.length > 0) {
                renderOnlineUsers(state.lastSnapshotDocs);
            }
        }, PRESENCE_RENDER_REFRESH_MS);
    },

    /**
     * Wird vom Monolith-`logout()` aufgerufen.
     * Cleant alles, setzt User offline, gibt Promise zurueck damit der
     * Caller den Sign-Out danach machen kann.
     *
     * @returns {Promise<void>}
     */
    async markOffline() {
        const user = state.user;
        this.onLogout();
        if (user) {
            await userRepo.upsertPresence(user, false);
        }
    },

    // Fuer Tests: erlaubt es State zwischen Tests zu lesen/zuruecksetzen.
    // Nicht Teil der offiziellen Bridge-API.
    __test__: {
        getState() { return state; },
        renderOnlineUsers,
    },
};
