import { describe, expect, it } from 'vitest';
import { cenaTerrazza, correlatori, valoreS } from './terrazza';

describe('decisioni in terrazza', () => {
  it('calcola le medie enumerando le decisioni e le loro probabilità', () => {
    const p = 1, q = 0.8;
    const esatti = [0, 1, 2, 3].map(i => {
      let media = 0;
      for (const segueAlice of [true, false]) for (const segueBob of [true, false]) {
        const numeri = [segueAlice ? 0 : 0.99, segueBob ? 0 : 0.99];
        const cena = cenaTerrazza(i, p, q, () => numeri.shift());
        media += cena.prodotto * (segueAlice ? p : 1-p) * (segueBob ? q : 1-q);
      }
      return media;
    });
    esatti.forEach((e, i) => expect(e).toBeCloseTo(correlatori(p, q)[i]));
    expect(valoreS(esatti)).toBeCloseTo(2.4);
  });
  it('include scelte casuali e scelte senza esitazioni senza imporre un intervallo di S', () => {
    expect(valoreS(correlatori(0.5, 0.85))).toBe(0);
    expect(valoreS(correlatori(1, 1))).toBe(4);
    expect(correlatori(1, 1)).toEqual([1, -1, 1, 1]);
  });
});
