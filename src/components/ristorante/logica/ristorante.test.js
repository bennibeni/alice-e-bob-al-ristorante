import { describe, expect, it } from "vitest";
import {
  DELTA_OTTIMALE,
  LISTE,
  oppostiSuSei,
  pOppostiDiverseListe,
  T_HARDY,
  creaRng,
  listeContabile,
  pDueCaliciRossi,
  probHardy,
  pUgualeListe,
  pVittoriaGemelle,
  registroS,
  sGemelle,
  seraPortate,
  seraRegistro,
  tutteLeStrategie,
  ugualiSuNove,
} from "./ristorante";

describe("tre portate", () => {
  it("con portate diverse le liste danno vini opposti almeno 2 volte su 6", () => {
    expect(oppostiSuSei("RRR")).toBe(6);
    expect(oppostiSuSei("RRB")).toBe(2);
    expect(Math.min(...LISTE.map(oppostiSuSei))).toBe(2);
  });

  it("qualunque miscela di liste dà opposti a portate diverse almeno 1/3, mai 1/4", () => {
    const rng = creaRng(17);
    for (let k = 0; k < 200; k++) {
      const pesi = Object.fromEntries(LISTE.map((l) => [l, rng()]));
      expect(pOppostiDiverseListe(pesi)).toBeGreaterThanOrEqual(1 / 3 - 1e-12);
    }
  });

  it("il ristorante stregato: opposti 1/4 a portate diverse, 1/2 in tutto", () => {
    const rng = creaRng(23);
    let diverse = 0;
    let oppDiverse = 0;
    let opp = 0;
    const N = 60000;
    for (let i = 0; i < N; i++) {
      const s = seraPortate({ modo: "stregata" }, rng);
      if (s.alice !== s.bob) opp++;
      if (s.a !== s.b) {
        diverse++;
        if (s.alice !== s.bob) oppDiverse++;
      }
    }
    expect(oppDiverse / diverse).toBeCloseTo(0.25, 1);
    expect(opp / N).toBeCloseTo(0.5, 1);
  });

  it("nessuna lista supera 4 colori uguali su 9", () => {
    expect(Math.max(...LISTE.map(ugualiSuNove))).toBe(4);
    expect(ugualiSuNove("RRR")).toBe(0);
    expect(ugualiSuNove("RRB")).toBe(4);
  });

  it("qualunque miscela di liste resta sotto 4/9", () => {
    const rng = creaRng(3);
    for (let k = 0; k < 200; k++) {
      const pesi = Object.fromEntries(LISTE.map((l) => [l, rng()]));
      expect(pUgualeListe(pesi)).toBeLessThanOrEqual(4 / 9 + 1e-12);
    }
  });

  it("stessa portata: colori sempre diversi, in entrambe le cucine", () => {
    const rng = creaRng(1);
    for (const modo of ["liste", "stregata"]) {
      for (let i = 0; i < 500; i++) {
        const s = seraPortate(
          { modo, pesi: { RRB: 1 }, stessaPortata: true },
          rng,
        );
        expect(s.alice).not.toBe(s.bob);
      }
    }
  });

  it("la cantina stregata dà colori uguali la metà delle volte", () => {
    const rng = creaRng(9);
    let u = 0;
    const N = 60000;
    for (let i = 0; i < N; i++) {
      const s = seraPortate({ modo: "stregata" }, rng);
      if (s.alice === s.bob) u++;
    }
    expect(u / N).toBeCloseTo(0.5, 1);
  });
});

describe("la sfida dello chef", () => {
  it("nessuna strategia a liste supera il 75%", () => {
    const tutte = tutteLeStrategie();
    expect(tutte).toHaveLength(16);
    expect(Math.max(...tutte.map((s) => s.percentuale))).toBe(0.75);
  });

  it("le bottiglie gemelle arrivano a cos²(π/8)", () => {
    expect(pVittoriaGemelle(DELTA_OTTIMALE)).toBeCloseTo(
      Math.cos(Math.PI / 8) ** 2,
      10,
    );
    expect(pVittoriaGemelle(0)).toBeCloseTo(0.75, 10);
    expect(sGemelle(DELTA_OTTIMALE)).toBeCloseTo(2 * Math.SQRT2, 10);
  });
});

describe("il registro del maître", () => {
  it("con le liste S resta entro 2, il chiacchierone arriva a 4", () => {
    const rng = creaRng(5);
    const strategia = { a0: "B", a1: "B", b0: "B", b1: "B" };
    const liste = Array.from({ length: 4000 }, () =>
      seraRegistro({ modo: "liste", strategia }, rng),
    );
    expect(Math.abs(registroS(liste).S)).toBeLessThanOrEqual(2 + 1e-9);
    const chiacchiere = Array.from({ length: 4000 }, () =>
      seraRegistro({ modo: "chiacchierone", strategia, chiacchiere: 1 }, rng),
    );
    expect(registroS(chiacchiere).S).toBeCloseTo(4, 10);
  });
});

describe("il contabile", () => {
  it("le tre regole valgono sempre con le bottiglie gemelle", () => {
    const t = T_HARDY;
    expect(probHardy(t, 0, 1)[1][0]).toBeCloseTo(0, 12);
    expect(probHardy(t, 1, 0)[0][1]).toBeCloseTo(0, 12);
    expect(probHardy(t, 1, 1)[1][1]).toBeCloseTo(0, 12);
    expect(pDueCaliciRossi(t)).toBeCloseTo((5 * Math.sqrt(5) - 11) / 2, 4);
  });

  it("nessuna lista che rispetta le regole dà due calici rossi", () => {
    const ok = listeContabile().filter((l) => l.rispetta);
    expect(ok.length).toBeGreaterThan(0);
    expect(ok.some((l) => l.dueCaliciRossi)).toBe(false);
  });
});

import { seraGemelle, seraTrucco } from "./ristorante";

describe("nessun messaggio tra le sale", () => {
  it("il rosso di Alice resta al 50% qualunque cosa succeda da Bob", () => {
    for (const y of [0, 1]) {
      const rng = creaRng(100 + y);
      let rossi = 0;
      const N = 40000;
      for (let i = 0; i < N; i++)
        if (seraGemelle(0, y, DELTA_OTTIMALE, rng).a === "R") rossi++;
      expect(rossi / N).toBeCloseTo(0.5, 1);
    }
  });
});

describe("le scappatoie", () => {
  const giro = (trucco, p, n = 20000) => {
    const rng = creaRng(7);
    const sere = Array.from({ length: n }, () => seraTrucco(trucco, p, rng));
    const reg = sere.filter((s) => s.registrata);
    return { reg, vinte: reg.filter((s) => s.vinta).length / reg.length };
  };
  it("senza trucchi il ristorante normale resta al 75%", () => {
    for (const t of ["chiacchierone", "registro", "cucina"])
      expect(giro(t, 0).vinte).toBeCloseTo(0.75, 1);
  });
  it("con il trucco pieno si vince sempre", () => {
    for (const t of ["chiacchierone", "registro", "cucina", "superstregato"])
      expect(giro(t, 1).vinte).toBe(1);
  });
  it("il registro incompleto gonfia S oltre 2", () => {
    const { reg } = giro("registro", 0.6);
    expect(giro("registro", 1).reg.length).toBeLessThan(12000);
    expect(registroS(reg).S).toBeGreaterThan(2);
  });
});
