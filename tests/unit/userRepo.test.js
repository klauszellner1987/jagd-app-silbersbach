// ============================================================================
// userRepo.test.js
// ----------------------------------------------------------------------------
// Testet src/scripts/data/userRepo.js gegen einen In-Memory-Stub von
// window.firebase (analog zu tests/fixtures/mockFirebase.js, hier inline).
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';

function makeFirebaseStub() {
    const setCalls = [];
    let snapCb = null;
    let snapErrCb = null;
    let limitArg = null;

    const docFn = vi.fn((docId) => ({
        set: vi.fn(async (data, opts) => {
            setCalls.push({ docId, data, opts });
        }),
    }));

    const collectionFn = vi.fn(() => ({
        doc: docFn,
        limit: vi.fn((n) => {
            limitArg = n;
            return {
                onSnapshot: vi.fn((cb, errCb) => {
                    snapCb = cb;
                    snapErrCb = errCb;
                    return vi.fn();
                }),
            };
        }),
    }));

    window.firebase = {
        firestore: Object.assign(
            () => ({ collection: collectionFn }),
            { FieldValue: { serverTimestamp: () => '__server_timestamp__' } },
        ),
    };

    return {
        setCalls,
        collectionFn,
        docFn,
        getSnapCb: () => snapCb,
        getSnapErrCb: () => snapErrCb,
        getLimit: () => limitArg,
    };
}

describe('userRepo.upsertPresence', () => {
    let stub;
    let userRepo;

    beforeEach(async () => {
        stub = makeFirebaseStub();
        vi.resetModules();
        ({ userRepo } = await import('../../src/scripts/data/userRepo.js'));
    });

    it('schreibt user-Dokument mit allen Presence-Feldern und merge: true', async () => {
        await userRepo.upsertPresence(
            { uid: 'u1', displayName: 'Klaus', photoURL: 'http://img/x.png' },
            true,
        );
        expect(stub.collectionFn).toHaveBeenCalledWith('users');
        expect(stub.docFn).toHaveBeenCalledWith('u1');
        expect(stub.setCalls).toHaveLength(1);
        expect(stub.setCalls[0].data).toMatchObject({
            uid: 'u1',
            displayName: 'Klaus',
            photoURL: 'http://img/x.png',
            isOnline: true,
            lastSeen: '__server_timestamp__',
        });
        expect(stub.setCalls[0].opts).toEqual({ merge: true });
    });

    it('faelt back auf "Unbekannter Jäger" wenn displayName fehlt', async () => {
        await userRepo.upsertPresence({ uid: 'u2' }, false);
        expect(stub.setCalls[0].data.displayName).toBe('Unbekannter Jäger');
        expect(stub.setCalls[0].data.photoURL).toBe('');
        expect(stub.setCalls[0].data.isOnline).toBe(false);
    });

    it('ignoriert null/undefined user (kein Throw, kein write)', async () => {
        await userRepo.upsertPresence(null, true);
        await userRepo.upsertPresence(undefined, true);
        await userRepo.upsertPresence({}, true);
        expect(stub.setCalls).toHaveLength(0);
    });

    it('schluckt Firestore-Errors statt zu werfen', async () => {
        stub.docFn.mockImplementationOnce(() => ({
            set: async () => { throw new Error('network down'); },
        }));
        await expect(
            userRepo.upsertPresence({ uid: 'u3' }, true),
        ).resolves.toBeUndefined();
    });
});

describe('userRepo.upsertPresenceSync', () => {
    let stub;
    let userRepo;

    beforeEach(async () => {
        stub = makeFirebaseStub();
        vi.resetModules();
        ({ userRepo } = await import('../../src/scripts/data/userRepo.js'));
    });

    it('schreibt isOnline=false + lastSeen ohne await', () => {
        userRepo.upsertPresenceSync('u1');
        expect(stub.setCalls).toHaveLength(1);
        expect(stub.setCalls[0].data).toEqual({
            isOnline: false,
            lastSeen: '__server_timestamp__',
        });
        expect(stub.setCalls[0].opts).toEqual({ merge: true });
    });

    it('ignoriert leere uid', () => {
        userRepo.upsertPresenceSync('');
        userRepo.upsertPresenceSync(null);
        expect(stub.setCalls).toHaveLength(0);
    });
});

describe('userRepo.streamAll', () => {
    let stub;
    let userRepo;

    beforeEach(async () => {
        stub = makeFirebaseStub();
        vi.resetModules();
        ({ userRepo } = await import('../../src/scripts/data/userRepo.js'));
    });

    it('registriert onSnapshot mit limit(50) und liefert doc.data()', () => {
        const onSnap = vi.fn();
        const onErr = vi.fn();
        userRepo.streamAll(onSnap, onErr);

        expect(stub.getLimit()).toBe(50);

        stub.getSnapCb()({
            docs: [
                { data: () => ({ uid: 'a', isOnline: true }) },
                { data: () => ({ uid: 'b', isOnline: false }) },
            ],
        });
        expect(onSnap).toHaveBeenCalledWith([
            { uid: 'a', isOnline: true },
            { uid: 'b', isOnline: false },
        ]);
    });

    it('ruft onErr bei Snapshot-Error', () => {
        const onErr = vi.fn();
        userRepo.streamAll(vi.fn(), onErr);
        stub.getSnapErrCb()(new Error('permission denied'));
        expect(onErr).toHaveBeenCalledWith(expect.any(Error));
    });
});
