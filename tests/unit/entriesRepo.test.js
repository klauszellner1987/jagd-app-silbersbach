// ============================================================================
// entriesRepo.test.js — Firestore-Stub wie bulletinRepo
// ============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';

function makeFirebaseStub() {
    const addCalls = [];
    const updateCalls = [];
    const deleteCalls = [];
    let snapCb = null;
    let snapErrCb = null;
    let orderByArgs = null;

    const docFn = vi.fn((docId) => ({
        update: vi.fn(async (data) => {
            updateCalls.push({ docId, data });
        }),
        delete: vi.fn(async () => {
            deleteCalls.push({ docId });
        }),
    }));

    const queryObj = {
        orderBy: vi.fn((field, dir) => {
            orderByArgs = { field, dir };
            return {
                onSnapshot: vi.fn((cb, errCb) => {
                    snapCb = cb;
                    snapErrCb = errCb;
                    return vi.fn();
                }),
            };
        }),
    };

    const collectionFn = vi.fn(() => ({
        ...queryObj,
        doc: docFn,
        add: vi.fn(async (data) => {
            addCalls.push({ data });
            return { id: 'mock-' + addCalls.length };
        }),
    }));

    window.firebase = {
        firestore: Object.assign(
            () => ({ collection: collectionFn }),
            {
                FieldValue: {
                    delete: () => '__delete__',
                },
            },
        ),
    };

    return {
        addCalls,
        updateCalls,
        deleteCalls,
        collectionFn,
        docFn,
        getOrderByArgs: () => orderByArgs,
        triggerSnap: (items) => snapCb({
            docs: items.map((i) => {
                const { id, ...rest } = i;
                return { id, data: () => rest };
            }),
        }),
        triggerErr: (err) => snapErrCb && snapErrCb(err),
    };
}

describe('entriesRepo', () => {
    let stub;
    let entriesRepo;

    beforeEach(async () => {
        stub = makeFirebaseStub();
        vi.resetModules();
        ({ entriesRepo } = await import('../../src/scripts/data/entriesRepo.js'));
    });

    it('add schreibt in Collection entries', async () => {
        const ref = await entriesRepo.add({ wildart: 'Rehwild', datum: '2026-05-01' });
        expect(stub.collectionFn).toHaveBeenCalledWith('entries');
        expect(ref.id).toBe('mock-1');
        expect(stub.addCalls[0].data.wildart).toBe('Rehwild');
    });

    it('delete loescht Doc', async () => {
        await entriesRepo.delete('x1');
        expect(stub.docFn).toHaveBeenCalledWith('x1');
        expect(stub.deleteCalls).toEqual([{ docId: 'x1' }]);
    });

    it('updateImageBase64', async () => {
        await entriesRepo.updateImageBase64('p1', 'data:image/jpeg;base64,abc');
        expect(stub.updateCalls).toEqual([{
            docId: 'p1',
            data: { imageBase64: 'data:image/jpeg;base64,abc' },
        }]);
    });

    it('clearImages nutzt FieldValue.delete', async () => {
        await entriesRepo.clearImages('p2');
        expect(stub.updateCalls[0]).toEqual({
            docId: 'p2',
            data: {
                imageBase64: '__delete__',
                imageUrl: '__delete__',
            },
        });
    });

    it('delete/update mit leerer id: no-op', async () => {
        await entriesRepo.delete('');
        await entriesRepo.updateImageBase64('', 'x');
        await entriesRepo.clearImages(null);
        expect(stub.deleteCalls).toHaveLength(0);
        expect(stub.updateCalls).toHaveLength(0);
    });

    it('streamByDatumDesc: orderBy(datum, desc) und map', () => {
        const onSnap = vi.fn();
        entriesRepo.streamByDatumDesc(onSnap);
        expect(stub.getOrderByArgs()).toEqual({ field: 'datum', dir: 'desc' });
        stub.triggerSnap([{ id: 'a', wildart: 'Rehwild' }]);
        expect(onSnap.mock.calls[0][0]).toEqual([{ id: 'a', wildart: 'Rehwild' }]);
    });

    it('streamByDatumDesc ruft onErr', () => {
        const onErr = vi.fn();
        entriesRepo.streamByDatumDesc(vi.fn(), onErr);
        stub.triggerErr(new Error('denied'));
        expect(onErr).toHaveBeenCalledWith(expect.any(Error));
    });
});
