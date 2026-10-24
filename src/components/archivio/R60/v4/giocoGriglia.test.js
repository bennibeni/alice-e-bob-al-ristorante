import { describe, expect, it } from "vitest";
import {
  COLLINEARI,
  GEMELLI,
  P_QUANTISTICA,
  migliorStrategia,
} from "./giocoGriglia";

describe("gioco CHSH sulla griglia", () => {
  it("ogni cella ha almeno una collineare e tre gemelli", () => {
    for (const k of Object.keys(COLLINEARI))
      expect(COLLINEARI[k].length).toBeGreaterThan(0);
    for (const k of Object.keys(GEMELLI)) expect(GEMELLI[k].length).toBe(3);
  });

  it("nessuna strategia classica supera il 75%, con nessun sistema", () => {
    for (const sistema of ["casuale", "collineare", "gemello"]) {
      expect(migliorStrategia(sistema).p).toBeCloseTo(0.75, 12);
      expect(migliorStrategia(sistema, true).p).toBeLessThanOrEqual(
        0.75 + 1e-12,
      );
    }
  });

  it("la strategia quantistica vince cos²(22,5°)", () => {
    expect(P_QUANTISTICA).toBeCloseTo(0.8535533905932737, 12);
  });
});
