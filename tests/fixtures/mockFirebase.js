// ============================================================================
// mockFirebase.js
// ----------------------------------------------------------------------------
// Wird via page.addInitScript({ path: ... }) BEVOR jedes andere Script
// in den Browser injiziert. Ueberschreibt window.firebase mit einem
// minimalen In-Memory-Stub, sodass die App ohne echte Firebase-Backend
// gestartet werden kann.
//
// Test-Schalter (vor jedem Test setzbar via window.__TEST_AUTH_USER):
//   window.__TEST_AUTH_USER = null  -> kein Login (Login-Overlay sichtbar)
//   window.__TEST_AUTH_USER = { uid, email, displayName, photoURL }
//                                  -> sofort eingeloggt
// ============================================================================

(function installFirebaseMock() {
    const NOOP = () => {};
    const noopUnsub = () => {};

    const firestoreData = new Map(); // 'col/doc' -> object
    const snapshotListeners = new Map(); // 'col' -> Set<callback>

    function notifyCollection(colName) {
        const listeners = snapshotListeners.get(colName);
        if (!listeners) return;
        const docs = [];
        for (const [key, value] of firestoreData.entries()) {
            const [c, d] = key.split('/');
            if (c === colName) docs.push({ id: d, data: () => value });
        }
        listeners.forEach((cb) => {
            try {
                cb({ docs, forEach: (fn) => docs.forEach(fn), empty: docs.length === 0 });
            } catch (_) {}
        });
    }

    function makeAuthListenerRegistry() {
        const listeners = new Set();
        return {
            register(cb) { listeners.add(cb); return () => listeners.delete(cb); },
            notify(user) { listeners.forEach((cb) => { try { cb(user); } catch (_) {} }); },
        };
    }

    const authReg = makeAuthListenerRegistry();

    const fakeAuth = {
        get currentUser() { return window.__TEST_AUTH_USER || null; },
        onAuthStateChanged(cb) {
            setTimeout(() => cb(window.__TEST_AUTH_USER || null), 0);
            return authReg.register(cb);
        },
        async signInWithEmailAndPassword(email, _password) {
            const user = {
                uid: 'test-uid',
                email,
                displayName: email.split('@')[0] || 'Tester',
                photoURL: '',
                getIdToken: async () => 'fake-token',
            };
            window.__TEST_AUTH_USER = user;
            authReg.notify(user);
            return { user };
        },
        async signOut() {
            window.__TEST_AUTH_USER = null;
            authReg.notify(null);
        },
    };

    function makeQuery(colName) {
        const query = {
            orderBy() { return query; },
            limit() { return query; },
            where() { return query; },
            onSnapshot(cb, errCb) {
                if (!snapshotListeners.has(colName)) snapshotListeners.set(colName, new Set());
                snapshotListeners.get(colName).add(cb);
                setTimeout(() => notifyCollection(colName), 0);
                return () => {
                    snapshotListeners.get(colName)?.delete(cb);
                };
            },
            async get() {
                const docs = [];
                for (const [key, value] of firestoreData.entries()) {
                    const [c, d] = key.split('/');
                    if (c === colName) docs.push({ id: d, exists: true, data: () => value });
                }
                return { docs, forEach: (fn) => docs.forEach(fn), empty: docs.length === 0 };
            },
        };
        return query;
    }

    function makeCollection(colName) {
        return Object.assign(makeQuery(colName), {
            doc(docId) {
                return {
                    async set(data, _opts) {
                        firestoreData.set(`${colName}/${docId}`, { ...(firestoreData.get(`${colName}/${docId}`) || {}), ...data });
                        notifyCollection(colName);
                    },
                    async update(data) {
                        firestoreData.set(`${colName}/${docId}`, { ...(firestoreData.get(`${colName}/${docId}`) || {}), ...data });
                        notifyCollection(colName);
                    },
                    async delete() {
                        firestoreData.delete(`${colName}/${docId}`);
                        notifyCollection(colName);
                    },
                    async get() {
                        const value = firestoreData.get(`${colName}/${docId}`);
                        return { id: docId, exists: !!value, data: () => value || {} };
                    },
                    onSnapshot(cb) {
                        const value = firestoreData.get(`${colName}/${docId}`);
                        setTimeout(() => cb({ id: docId, exists: !!value, data: () => value || {} }), 0);
                        return noopUnsub;
                    },
                    collection(subName) {
                        return makeCollection(`${colName}/${docId}/${subName}`);
                    },
                };
            },
            async add(data) {
                const id = 'mock-' + Math.random().toString(36).slice(2, 10);
                firestoreData.set(`${colName}/${id}`, data);
                notifyCollection(colName);
                return { id };
            },
        });
    }

    const fakeFirestore = () => ({
        collection: makeCollection,
        enablePersistence: async () => {},
    });
    // serverTimestamp liefert ein Firestore-Timestamp-shaped Objekt
    // (mit .toDate()), damit Code wie `data.lastSeen.toDate()` funktioniert.
    fakeFirestore.FieldValue = {
        serverTimestamp: () => {
            const d = new Date();
            return { toDate: () => d };
        },
    };

    const fakeStorage = () => ({
        ref: () => ({
            child: (_path) => ({
                put: async () => ({ ref: { getDownloadURL: async () => 'http://mock-storage/' } }),
                putString: async () => ({ ref: { getDownloadURL: async () => 'http://mock-storage/' } }),
                getDownloadURL: async () => 'http://mock-storage/',
                delete: async () => {},
            }),
        }),
    });

    const fakeMessaging = () => ({
        getToken: async () => 'mock-fcm-token',
        onMessage: () => () => {},
    });
    // firebase.messaging.isSupported ist eine statische Methode am Namespace
    fakeMessaging.isSupported = async () => true;

    window.firebase = {
        initializeApp: NOOP,
        apps: [{ name: '[DEFAULT]' }],
        auth: () => fakeAuth,
        firestore: Object.assign(fakeFirestore, {
            FieldValue: fakeFirestore.FieldValue,
            Timestamp: { now: () => new Date() },
        }),
        storage: fakeStorage,
        messaging: fakeMessaging,
    };

    // Expose helpers fuer Tests, die Firestore-Daten seeden wollen
    window.__seedFirestore = (col, docId, data) => {
        firestoreData.set(`${col}/${docId}`, data);
        notifyCollection(col);
    };
})();
