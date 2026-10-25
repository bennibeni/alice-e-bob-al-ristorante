// Il gioco CHSH sulla griglia dei Gemelli numerici.
// Logica pura, nessuna dipendenza da React.
//
// Ogni round:
//   1. Alice riceve una cella attiva a caso (valore n1).
//   2. Bob riceve una seconda cella scelta dal sistema (casuale o collineare).
//   3. L'arbitro sceglie a caso x ∈ {0,1} per Alice e y ∈ {0,1} per Bob.
//   4. Alice risponde alla domanda A[x] sul proprio numero, Bob alla B[y].
//   5. Vincono se le risposte coincidono, tranne quando x = y = 1:
//      lì devono essere diverse.   (a XOR b) === (x AND y)
//
// Strategia classica: per ogni domanda dell'arbitro una regola che usa la
// "firma" del numero (eventualmente invertita) oppure risponde sempre Sì/No. Strategia quantistica: qubit intrecciati,
// i numeri non servono.

import {
  MODEL_ACTIVE_INDEX_END,
  MODEL_ACTIVE_INDEX_START,
  MODEL_COLLINEAR_LINES,
  MODEL_EXCLUDED_INDEX,
  MODEL_VALUES,
} from "../v1/gemelliNumerici37Config";
import { QUESTIONS } from "../v1/gemelliNumerici37Questions";

export { QUESTIONS, MODEL_VALUES };

export const ATTIVE = Array.from(
  { length: MODEL_ACTIVE_INDEX_END - MODEL_ACTIVE_INDEX_START + 1 },
  (_, k) => MODEL_ACTIVE_INDEX_START + k,
);

// Celle collineari a i (escluse la centrale e i stessa).
export const COLLINEARI = (() => {
  const m = {};
  for (const i of ATTIVE) {
    const s = new Set();
    for (const linea of MODEL_COLLINEAR_LINES) {
      if (!linea.includes(i)) continue;
      for (const j of linea)
        if (j !== i && j !== MODEL_EXCLUDED_INDEX) s.add(j);
    }
    m[i] = [...s];
  }
  return m;
})();

// Celle con lo stesso valore (i "gemelli" veri), esclusa i stessa.
export const GEMELLI = (() => {
  const m = {};
  for (const i of ATTIVE)
    m[i] = ATTIVE.filter((j) => j !== i && MODEL_VALUES[j] === MODEL_VALUES[i]);
  return m;
})();

export const SISTEMI = [
  {
    id: "separati",
    testo: "Non allineati, numeri diversi",
    nota: "I tavoli non hanno una linea comune e hanno numeri diversi.",
  },
  {
    id: "collineare",
    testo: "Stessa linea",
    nota: "Bob riceve una cella allineata con quella di Alice.",
  },
  {
    id: "gemello",
    testo: "Gemelli",
    nota: "Bob riceve una cella con lo stesso valore: correlazione perfetta.",
  },
];

export function candidatiBob(i, sistema) {
  if (sistema === "collineare") return COLLINEARI[i];
  if (sistema === "gemello") return GEMELLI[i];
  if (sistema === "separati") return ATTIVE.filter(
    (j) => j !== i && !COLLINEARI[i].includes(j) && MODEL_VALUES[j] !== MODEL_VALUES[i],
  );
  return ATTIVE.filter((j) => j !== i);
}

// Una "regola di risposta" per una domanda dell'arbitro:
//   { d: indice della domanda D1..D4, modo: 'firma' | 'inversa' | 'si' | 'no' }
export const MODI = [
  { id: "firma", testo: "firma" },
  { id: "inversa", testo: "firma invertita" },
  { id: "si", testo: "sempre Sì" },
  { id: "no", testo: "sempre No" },
];

export function rispondi(valore, regola) {
  if (regola.modo === "si") return 1;
  if (regola.modo === "no") return 0;
  const r = QUESTIONS[regola.d].ask(valore) ? 1 : 0; // 1 = Sì
  return regola.modo === "inversa" ? 1 - r : r;
}

export const vince = (x, y, a, b) => (a ^ b) === (x & y);

// Le 16 regole possibili (4 domande × 4 modi).
export const REGOLE = [];
for (let d = 0; d < 4; d++)
  for (const m of MODI) REGOLE.push({ d, modo: m.id });
const idxRegola = (r) => r.d * 4 + MODI.findIndex((m) => m.id === r.modo);

// Coppie di celle con il loro peso.
export function coppie(sistema) {
  const out = [];
  for (const i of ATTIVE) {
    const cand = candidatiBob(i, sistema);
    for (const j of cand)
      out.push({ i, j, peso: 1 / ATTIVE.length / cand.length });
  }
  return out;
}

// M[ra][rb] = probabilità che le risposte coincidano usando le regole ra (Alice) e rb (Bob).
const cacheM = {};
export function matriceUguali(sistema) {
  if (cacheM[sistema]) return cacheM[sistema];
  const cp = coppie(sistema);
  const M = REGOLE.map((ra) =>
    REGOLE.map((rb) =>
      cp.reduce(
        (acc, { i, j, peso }) =>
          acc +
          (rispondi(MODEL_VALUES[i], ra) === rispondi(MODEL_VALUES[j], rb)
            ? peso
            : 0),
        0,
      ),
    ),
  );
  cacheM[sistema] = M;
  return M;
}

// strategia = { alice: [regola0, regola1], bob: [regola0, regola1] }
export function vittoriaClassicaEsatta(strategia, sistema) {
  const M = matriceUguali(sistema);
  const [a0, a1] = strategia.alice.map(idxRegola);
  const [b0, b1] = strategia.bob.map(idxRegola);
  return (M[a0][b0] + M[a0][b1] + M[a1][b0] + (1 - M[a1][b1])) / 4;
}

// Ricerca esaustiva su tutte le 16⁴ = 65 536 strategie.
// soloFirme: limita alle regole 'firma' e 'inversa' (risposte che usano il numero).
export function migliorStrategia(sistema, soloFirme = false) {
  const M = matriceUguali(sistema);
  const ammesse = REGOLE.map((r, k) => k).filter(
    (k) => !soloFirme || ["firma", "inversa"].includes(REGOLE[k].modo),
  );
  let p = -1;
  let best = null;
  for (const a0 of ammesse)
    for (const a1 of ammesse)
      for (const b0 of ammesse)
        for (const b1 of ammesse) {
          const v = (M[a0][b0] + M[a0][b1] + M[a1][b0] + (1 - M[a1][b1])) / 4;
          if (v > p + 1e-12) {
            p = v;
            best = [a0, a1, b0, b1];
          }
        }
  return {
    p,
    strategia: {
      alice: [REGOLE[best[0]], REGOLE[best[1]]],
      bob: [REGOLE[best[2]], REGOLE[best[3]]],
    },
  };
}

// Strategia quantistica: |Φ+⟩, Alice 0°/45°, Bob 22,5°/−22,5°.
export const ANGOLI = { alice: [0, 45], bob: [22.5, -22.5] };
export const P_QUANTISTICA = Math.cos(Math.PI / 8) ** 2;

export function creaRng(seme = 1) {
  let s = seme >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Un round: stesse celle e stesse domande per le due coppie.
export function round(rng, strategia, sistema) {
  const i = ATTIVE[Math.floor(rng() * ATTIVE.length)];
  const cand = candidatiBob(i, sistema);
  const j = cand[Math.floor(rng() * cand.length)];
  const x = rng() < 0.5 ? 0 : 1;
  const y = rng() < 0.5 ? 0 : 1;
  const ac = rispondi(MODEL_VALUES[i], strategia.alice[x]);
  const bc = rispondi(MODEL_VALUES[j], strategia.bob[y]);
  const aq = rng() < 0.5 ? 0 : 1;
  const d = ((ANGOLI.alice[x] - ANGOLI.bob[y]) * Math.PI) / 180;
  const bq = rng() < Math.cos(d) ** 2 ? aq : 1 - aq;
  return {
    i,
    j,
    x,
    y,
    classica: { a: ac, b: bc, vinto: vince(x, y, ac, bc) },
    quantistica: { a: aq, b: bq, vinto: vince(x, y, aq, bq) },
  };
}
