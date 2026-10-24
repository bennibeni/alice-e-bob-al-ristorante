import { describe, expect, it } from "vitest";
import { creaRng } from "./ristorante";
import {
  accordoMiglioreCasuale,
  B,
  R,
  TERNE_DISPARI,
  TERNE_PARI,
  accordoMigliore,
  cenaOffertaQ,
  copia,
  massimoAccordi,
  percentualeAccordo,
  rossi,
  seraQuadrato,
} from "./quadrato";

describe("menù degustazione", () => {
  it("le terne pari e dispari sono quattro ciascuna", () => {
    expect(TERNE_PARI.every((t) => rossi(t) % 2 === 0)).toBe(true);
    expect(TERNE_DISPARI.every((t) => rossi(t) % 2 === 1)).toBe(true);
  });

  it("le regole dello chef", () => {
    expect(cenaOffertaQ(0, 1, [R, R, B], [R, B, B])).toBe(true);
    expect(cenaOffertaQ(0, 1, [R, R, B], [B, R, B])).toBe(false);
    expect(cenaOffertaQ(0, 0, [R, B, B], [R, B, B])).toBe(false);
  });

  it("l'accordo migliore vince 8 sere su 9", () => {
    expect(percentualeAccordo(accordoMigliore())).toBeCloseTo(8 / 9);
  });

  it("gli accordi migliori casuali vincono 8 su 9 e cambiano ogni volta", () => {
    const rng = creaRng(5);
    let prec = null;
    for (let i = 0; i < 50; i++) {
      const a = accordoMiglioreCasuale(rng, prec);
      expect(percentualeAccordo(a)).toBeCloseTo(8 / 9);
      if (prec) expect(JSON.stringify(a)).not.toBe(JSON.stringify(prec));
      prec = a;
    }
  });

  it("griglie uguali non bastano: al massimo 6 su 9", () => {
    const { alice } = accordoMigliore();
    expect(percentualeAccordo({ alice, bob: copia(alice) })).toBeCloseTo(6 / 9);
  });

  it("nessun accordo supera 8 su 9", () => {
    expect(massimoAccordi()).toBeCloseTo(8 / 9);
  });

  it("con le bottiglie gemelle si vince sempre e ogni piatto è rosso metà delle volte", () => {
    const rng = creaRng(5);
    let vinte = 0;
    let rossiAlice = 0;
    const N = 20000;
    for (let i = 0; i < N; i++) {
      const s = seraQuadrato({ modo: "gemelle" }, rng);
      if (s.vinta) vinte++;
      if (s.rigaAlice[0] === R) rossiAlice++;
    }
    expect(vinte).toBe(N);
    expect(rossiAlice / N).toBeCloseTo(0.5, 1);
  });

  it("con un accordo la frequenza segue il conto esatto", () => {
    const rng = creaRng(9);
    const accordo = accordoMigliore();
    let vinte = 0;
    const N = 18000;
    for (let i = 0; i < N; i++) {
      if (seraQuadrato({ modo: "liste", accordo }, rng).vinta) vinte++;
    }
    expect(vinte / N).toBeCloseTo(8 / 9, 1);
  });
});
