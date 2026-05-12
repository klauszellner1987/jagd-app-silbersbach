// ============================================================================
// fcmTokenRepo.test.js
// ----------------------------------------------------------------------------
// Tests src/scripts/data/fcmTokenRepo.js.
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';

function makeStub() {
    const setCalls = [];
    const docFn = vi.fn((docId) => ({
        set: vi.fn(async (data, opts) => {
            setCalls.push({ docId, data, opts });
        }),
    }));
    const collectionFn = vi.fn(() => ({ doc: docFn }));

    window.firebase = {
        firestore: Object.assign(
            () => ({ collection: collectionFn }),
            { FieldValue: { serverTimestamp: () => '__server_timestamp__' } },
        ),
    };
    return { setCalls, collectionFn, docFn };
}

describe('fcmTokenRepo.upsertToken', () => {
    let stub;
    let fcmTokenRepo;

    beforeEach(async () => {
        stub = makeStub();
        vi.resetModules();
        ({ fcmTokenRepo } = await import('../../src/scripts/data/fcmTokenRepo.js'));
    });

    it('schreibt nach fcmTokens.<token> mit merge: true', async () => {
        await fcmTokenRepo.upsertToken({
            token: 'abc123',
            userId: 'u1',
            userName: 'Klaus',
            device: 'Chrome 130',
            version: 'v6.0.0',
        });
        expect(stub.collectionFn).toHaveBeenCalledWith('fcmTokens');
        expect(stub.docFn).toHaveBeenCalledWith('abc123');
        expect(stub.setCalls).toHaveLength(1);
        expect(stub.setCalls[0].data).toEqual({
            token: 'abc123',
            userId: 'u1',
            userName: 'Klaus',
            device: 'Chrome 130',
            version: 'v6.0.0',
            updatedAt: '__server_timestamp__',
        });
        expect(stub.setCalls[0].opts).toEqual({ merge: true });
    });

    it('faelt back auf anon/Unbekannt/unknown bei fehlenden Feldern', async () => {
        await fcmTokenRepo.upsertToken({ token: 't1', version: 'v6' });
        expect(stub.setCalls[0].data).toMatchObject({
            userId: 'anon',
            userName: 'Unbekannt',
            device: 'unknown',
            version: 'v6',
        });
    });

    it('ignoriert leeres Token (kein Throw, kein Call)', async () => {
        await fcmTokenRepo.upsertToken({ token: '' });
        await fcmTokenRepo.upsertToken({ token: null });
        expect(stub.setCalls).toHaveLength(0);
    });
});
