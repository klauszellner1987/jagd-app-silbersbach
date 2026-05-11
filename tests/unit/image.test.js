import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { compressImage } from '../../public/js/lib/pure.js';

/**
 * happy-dom liefert weder einen funktionierenden HTMLCanvasElement noch
 * eine echte Image-Decoder-Pipeline. Wir stubben deshalb die kritischen
 * Browser-APIs minimal, sodass wir die Logik (Skalierung, Resolve, Reject)
 * testen koennen.
 */

beforeEach(() => {
    // FileReader: liefert ein Fake-DataURL
    globalThis.FileReader = class {
        readAsDataURL() {
            queueMicrotask(() => {
                this.onload && this.onload({ target: { result: 'data:image/png;base64,FAKE' } });
            });
        }
    };

    // Image: feuert onload sofort, simuliert 1000x500 Pixel
    globalThis.Image = class {
        constructor() {
            this.width = 1000;
            this.height = 500;
            queueMicrotask(() => {
                this.onload && this.onload();
            });
        }
        set src(_v) { /* no-op */ }
    };

    // canvas.getContext + canvas.toBlob stubben
    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        if (tag === 'canvas') {
            return {
                width: 0,
                height: 0,
                getContext: () => ({ drawImage: () => {} }),
                toBlob: (cb, type, _quality) => {
                    cb(new Blob(['x'.repeat(42)], { type: type || 'image/jpeg' }));
                },
            };
        }
        return origCreateElement(tag);
    });
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('compressImage', () => {
    it('liefert einen Blob zurueck (image/jpeg)', async () => {
        const file = new File(['x'], 'test.png', { type: 'image/png' });
        const blob = await compressImage(file, 400, 400);
        expect(blob).toBeInstanceOf(Blob);
        expect(blob.type).toBe('image/jpeg');
    });

    it('skaliert breite Bilder auf maxWidth (1000x500 -> 400x200)', async () => {
        let capturedCanvas;
        vi.spyOn(document, 'createElement').mockImplementationOnce(() => {
            capturedCanvas = {
                width: 0,
                height: 0,
                getContext: () => ({ drawImage: () => {} }),
                toBlob: (cb) => cb(new Blob(['x'])),
            };
            return capturedCanvas;
        });

        const file = new File(['x'], 'wide.png', { type: 'image/png' });
        await compressImage(file, 400, 400);
        expect(capturedCanvas.width).toBe(400);
        expect(capturedCanvas.height).toBe(200);
    });

    it('rejected wenn der Reader fehlschlaegt', async () => {
        globalThis.FileReader = class {
            readAsDataURL() {
                queueMicrotask(() => this.onerror && this.onerror());
            }
        };
        const file = new File(['x'], 'broken.png', { type: 'image/png' });
        await expect(compressImage(file)).rejects.toThrow('File read error');
    });

    it('rejected wenn die Image-Decode fehlschlaegt', async () => {
        globalThis.Image = class {
            constructor() {
                queueMicrotask(() => this.onerror && this.onerror());
            }
            set src(_v) {}
        };
        const file = new File(['x'], 'broken.png', { type: 'image/png' });
        await expect(compressImage(file)).rejects.toThrow('Image load error');
    });
});
