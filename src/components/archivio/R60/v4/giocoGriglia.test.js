import { describe, expect, it } from "vitest";
import {
  COLLINEARI,
  GEMELLI,
  P_QUANTISTICA,
  migliorStrategia,
  ATTIVE,
  MODEL_VALUES,
  candidatiBob,
  SISTEMI,
  vittoriaClassicaEsatta,
} from "./giocoGriglia";

describe("gioco CHSH sulla griglia", () => {
  it("confronta esattamente i tre piani semplificati", () => {
    const plan=(a,b,modo="firma")=>({alice:[{d:a,modo},{d:b,modo}],bob:[{d:a,modo},{d:b,modo}]});
    const rows=SISTEMI.map(s=>({assegnazione:s.testo,numero:vittoriaClassicaEsatta(plan(0,0),s.id),numeroFormato:vittoriaClassicaEsatta(plan(0,1),s.id),rosso:vittoriaClassicaEsatta(plan(0,0,"si"),s.id)}));
    for(const row of rows)expect(row.rosso).toBeCloseTo(.75,12);
    expect(rows.some(r=>Math.abs(r.numero-r.numeroFormato)>1e-6)).toBe(true);
    console.log(JSON.stringify(rows));
  });
  it("ogni cella ha almeno una collineare e tre gemelli", () => {
    for (const k of Object.keys(COLLINEARI))
      expect(COLLINEARI[k].length).toBeGreaterThan(0);
    for (const k of Object.keys(GEMELLI)) expect(GEMELLI[k].length).toBe(3);
  });

  it("nessuna strategia classica supera il 75%, con nessun sistema", () => {
    for (const sistema of SISTEMI.map(s => s.id)) {
      expect(migliorStrategia(sistema).p).toBeCloseTo(0.75, 12);
      expect(migliorStrategia(sistema, true).p).toBeLessThanOrEqual(
        0.75 + 1e-12,
      );
    }
  });

  it("le tre assegnazioni separano tutte le coppie senza sovrapposizioni", () => {
    for (const i of ATTIVE) {
      const groups = SISTEMI.map(s => candidatiBob(i,s.id));
      for (const group of groups) expect(group.length).toBeGreaterThan(0);
      const all = groups.flat();
      expect(all.length).toBe(35);
      expect(new Set(all).size).toBe(35);
      expect(all.includes(i)).toBe(false);
      for (const j of candidatiBob(i,"collineare")) expect(MODEL_VALUES[j]).not.toBe(MODEL_VALUES[i]);
      for (const j of candidatiBob(i,"separati")) {
        expect(COLLINEARI[i]).not.toContain(j);
        expect(MODEL_VALUES[j]).not.toBe(MODEL_VALUES[i]);
      }
      for (const j of candidatiBob(i,"gemello")) {
        expect(COLLINEARI[i]).not.toContain(j);
        expect(MODEL_VALUES[j]).toBe(MODEL_VALUES[i]);
      }
    }
  });

  it("la strategia quantistica vince cos²(22,5°)", () => {
    expect(P_QUANTISTICA).toBeCloseTo(0.8535533905932737, 12);
  });
});
