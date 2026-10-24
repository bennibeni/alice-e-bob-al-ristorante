// Logica del racconto di R04, tutta in termini di ristorante.
//
// Ogni sera la cucina prepara qualcosa per Alice e per Bob, seduti in due
// sale lontane. Il cameriere fa a ciascuno una domanda, scelta a caso, e la
// risposta è sempre un colore di vino: rosso (R) o bianco (B).
//
// Due modi di far funzionare la cucina:
// - "liste": la cucina consegna a ciascuno una scheda di preferenze già
//   scritta (le risposte esistono prima della domanda);
// - "cantina stregata": nessuna scheda, solo le statistiche che la natura
//   produce con coppie entangled.

export const ROSSO = "R";
export const BIANCO = "B";

/** Generatore deterministico (mulberry32): stesse sere a parità di seme. */
export function creaRng(seme = 1) {
  let a = seme >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const semeCasuale = () => Math.floor(Math.random() * 1e9);

const intero = (n, rng) => Math.floor(rng() * n);
const altroColore = (c) => (c === ROSSO ? BIANCO : ROSSO);

// ---------------------------------------------------------------------------
// Capitoli 1 e 2 — tre portate, un vino per portata
// ---------------------------------------------------------------------------

export const PORTATE = ["antipasto", "primo", "secondo"];

/** Le 8 schede possibili: un colore per antipasto, primo, secondo. */
export const LISTE = ["RRR", "RRB", "RBR", "RBB", "BRR", "BRB", "BBR", "BBB"];

/** La scheda di Bob è sempre la complementare di quella di Alice. */
export function complementare(lista) {
  return [...lista].map(altroColore).join("");
}

/** Quante delle 9 coppie di portate danno lo stesso colore a una scheda. */
export function ugualiSuNove(lista) {
  const bob = complementare(lista);
  let u = 0;
  for (let a = 0; a < 3; a++)
    for (let b = 0; b < 3; b++) if (lista[a] === bob[b]) u++;
  return u;
}

/**
 * Quante delle 6 coppie di portate diverse danno vini opposti a una scheda
 * (Bob con la scheda opposta): 6 per le schede monocolori, 2 per le miste.
 */
export function oppostiSuSei(lista) {
  const bob = complementare(lista);
  let o = 0;
  for (let a = 0; a < 3; a++)
    for (let b = 0; b < 3; b++) if (a !== b && lista[a] !== bob[b]) o++;
  return o;
}

/**
 * Probabilità esatta di vini opposti con portate diverse, per una cucina che
 * sceglie le schede con i pesi dati. Non scende mai sotto 1/3.
 */
export function pOppostiDiverseListe(pesi) {
  const tot = Object.values(pesi).reduce((s, w) => s + w, 0);
  if (tot <= 0) return null;
  let p = 0;
  for (const [lista, w] of Object.entries(pesi)) {
    p += (w / tot) * (oppostiSuSei(lista) / 6);
  }
  return p;
}

/** Tabella 3×3 (portata di Alice × portata di Bob) per una scheda. */
export function tabellaLista(lista) {
  const bob = complementare(lista);
  return PORTATE.map((_, a) =>
    PORTATE.map((__, b) => ({ alice: lista[a], bob: bob[b] })),
  );
}

/**
 * Probabilità esatta di "stesso colore" per una cucina che sceglie le schede
 * con i pesi dati (oggetto scheda → peso). Con domande uniformi.
 */
export function pUgualeListe(pesi) {
  const tot = Object.values(pesi).reduce((s, w) => s + w, 0);
  if (tot <= 0) return null;
  let p = 0;
  for (const [lista, w] of Object.entries(pesi)) {
    p += (w / tot) * (ugualiSuNove(lista) / 9);
  }
  return p;
}

function scegliLista(pesi, rng) {
  const voci = Object.entries(pesi).filter(([, w]) => w > 0);
  const tot = voci.reduce((s, [, w]) => s + w, 0);
  let r = rng() * tot;
  for (const [lista, w] of voci) {
    r -= w;
    if (r < 0) return lista;
  }
  return voci[voci.length - 1][0];
}

/**
 * Una sera con tre portate.
 * - stessaPortata: il cameriere chiede la stessa portata a entrambi;
 * - modo "liste": la cucina sceglie una scheda con i pesi; "stregata": no schede.
 */
export function seraPortate({ modo, pesi, stessaPortata = false }, rng) {
  const a = intero(3, rng);
  const b = stessaPortata ? a : intero(3, rng);
  if (modo === "liste") {
    const lista = scegliLista(pesi, rng);
    const bob = complementare(lista);
    return { a, b, lista, alice: lista[a], bob: bob[b] };
  }
  // Cantina stregata: stessa portata → colori sempre diversi;
  // portate diverse → stesso colore 3 volte su 4. Ognuno da solo: 50/50.
  const alice = rng() < 0.5 ? ROSSO : BIANCO;
  const pUguale = a === b ? 0 : 0.75;
  const bob = rng() < pUguale ? alice : altroColore(alice);
  return { a, b, lista: null, alice, bob };
}

// ---------------------------------------------------------------------------
// Capitolo 3 — la sfida dello chef (gioco CHSH)
// ---------------------------------------------------------------------------

export const FORMATI = ["calice", "bottiglia"];

/**
 * Il cameriere decide, sala per sala, se servire in calice (0) o in
 * bottiglia (1). Lo chef offre la cena se i colori sono uguali, tranne
 * quando arrivano due bottiglie: allora devono essere diversi.
 */
export function cenaOfferta(x, y, coloreA, coloreB) {
  const uguali = coloreA === coloreB;
  return x === 1 && y === 1 ? !uguali : uguali;
}

/** Strategia a schede: colore di Alice per calice/bottiglia, idem Bob. */
export function percentualeStrategia({ a0, a1, b0, b1 }) {
  let v = 0;
  const A = [a0, a1];
  const B = [b0, b1];
  for (const x of [0, 1])
    for (const y of [0, 1]) if (cenaOfferta(x, y, A[x], B[y])) v++;
  return v / 4;
}

export function tutteLeStrategie() {
  const out = [];
  for (let k = 0; k < 16; k++) {
    const s = {
      a0: k & 8 ? ROSSO : BIANCO,
      a1: k & 4 ? ROSSO : BIANCO,
      b0: k & 2 ? ROSSO : BIANCO,
      b1: k & 1 ? ROSSO : BIANCO,
    };
    out.push({ ...s, percentuale: percentualeStrategia(s) });
  }
  return out;
}

/**
 * Bottiglie gemelle (entanglement), con un solo parametro: l'«affiatamento»
 * δ in gradi. Per ogni coppia di formati la probabilità di stesso colore è
 * cos²(differenza di regolazione). Alice: calice 0, bottiglia 2δ;
 * Bob: calice δ, bottiglia −δ. Con δ = 22,5° si ottiene il massimo, 85,4%.
 */
export function regolazioni(delta) {
  return { alice: [0, 2 * delta], bob: [delta, -delta] };
}

export function pStessoColoreGemelle(delta, x, y) {
  const r = regolazioni(delta);
  const d = ((r.alice[x] - r.bob[y]) * Math.PI) / 180;
  return Math.cos(d) ** 2;
}

export function pVittoriaGemelle(delta) {
  let p = 0;
  for (const x of [0, 1])
    for (const y of [0, 1]) {
      const pu = pStessoColoreGemelle(delta, x, y);
      p += x === 1 && y === 1 ? 1 - pu : pu;
    }
  return p / 4;
}

export const DELTA_OTTIMALE = 22.5;

/** Una sera della sfida: il cameriere sceglie i formati a caso. */
export function seraSfida({ modo, strategia, delta }, rng) {
  const x = intero(2, rng);
  const y = intero(2, rng);
  let a;
  let b;
  if (modo === "liste") {
    a = x === 0 ? strategia.a0 : strategia.a1;
    b = y === 0 ? strategia.b0 : strategia.b1;
  } else {
    a = rng() < 0.5 ? ROSSO : BIANCO;
    b = rng() < pStessoColoreGemelle(delta, x, y) ? a : altroColore(a);
  }
  return { x, y, a, b, vinta: cenaOfferta(x, y, a, b) };
}

// ---------------------------------------------------------------------------
// Capitolo 4 — il registro del maître: correlatori e S
// ---------------------------------------------------------------------------

/**
 * Una sera vista dal maître. Oltre ai due modi del capitolo 3 c'è il
 * "cameriere chiacchierone": con probabilità `chiacchiere` corre nell'altra
 * sala, scopre come è stato servito Alice e che colore ha scelto, e fa
 * scegliere a Bob il colore che fa vincere. È comunicazione, quindi non vale.
 */
export function seraRegistro({ modo, strategia, delta, chiacchiere = 0 }, rng) {
  const base = seraSfida(
    { modo: modo === "chiacchierone" ? "liste" : modo, strategia, delta },
    rng,
  );
  if (modo !== "chiacchierone" || rng() >= chiacchiere) return base;
  const { x, y, a } = base;
  const b = x === 1 && y === 1 ? altroColore(a) : a;
  return { x, y, a, b, vinta: true };
}

/**
 * Correlatore E(x, y) = media di (+1 se stesso colore, −1 se diverso), solo
 * sulle sere servite con quei formati. S = E₀₀ + E₀₁ + E₁₀ − E₁₁.
 */
export function registroS(sere) {
  const somme = [
    [0, 0],
    [0, 0],
  ];
  const n = [
    [0, 0],
    [0, 0],
  ];
  for (const { x, y, a, b } of sere) {
    somme[x][y] += a === b ? 1 : -1;
    n[x][y] += 1;
  }
  const E = somme.map((r, x) =>
    r.map((s, y) => (n[x][y] ? s / n[x][y] : null)),
  );
  const completo = E.every((r) => r.every((v) => v !== null));
  const S = completo ? E[0][0] + E[0][1] + E[1][0] - E[1][1] : null;
  return { E, n, S };
}

/** S teorico delle bottiglie gemelle: 2√2 con δ ottimale. */
export function sGemelle(delta) {
  const E = (x, y) => 2 * pStessoColoreGemelle(delta, x, y) - 1;
  return E(0, 0) + E(0, 1) + E(1, 0) - E(1, 1);
}

// ---------------------------------------------------------------------------
// Capitolo 5 — il contabile (Hardy)
// ---------------------------------------------------------------------------
//
// Regole del contabile, con 0 = bianco e 1 = rosso, x/y = 0 calice, 1 bottiglia:
//   R1  Alice calice rosso e Bob in bottiglia → la bottiglia di Bob è rossa.
//   R2  Bob calice rosso e Alice in bottiglia → la bottiglia di Alice è rossa.
//   R3  Due bottiglie di rosso non arrivano mai (costano troppo).
// Con le schede ne segue: due calici rossi sono impossibili.
// Con le bottiglie gemelle (stato di Hardy) succede fino a ≈ 9% delle volte.

function statoHardy(t) {
  const a = Math.cos(t);
  const b = Math.sin(t) / Math.SQRT2;
  return [
    [a, b],
    [b, 0],
  ];
}

const vettore = (theta, colore) =>
  colore === 0
    ? [Math.cos(theta), Math.sin(theta)]
    : [-Math.sin(theta), Math.cos(theta)];

function angoloCalice(t) {
  const c = statoHardy(t);
  return Math.atan2(-c[0][1], -c[0][0]);
}

/** P[a][b] per i formati (x, y), con a, b ∈ {0 bianco, 1 rosso}. */
export function probHardy(t, x, y) {
  const c = statoHardy(t);
  const th = angoloCalice(t);
  const ang = [th, 0];
  const P = [
    [0, 0],
    [0, 0],
  ];
  for (const a of [0, 1]) {
    const u = vettore(ang[x], a);
    for (const b of [0, 1]) {
      const v = vettore(ang[y], b);
      let amp = 0;
      for (let i = 0; i < 2; i++)
        for (let j = 0; j < 2; j++) amp += u[i] * v[j] * c[i][j];
      P[a][b] = amp * amp;
    }
  }
  return P;
}

export const pDueCaliciRossi = (t) => probHardy(t, 0, 0)[1][1];

export const T_HARDY = (() => {
  let best = [0, 0];
  for (let i = 1; i < 20000; i++) {
    const t = (i / 20000) * (Math.PI / 2);
    const p = pDueCaliciRossi(t);
    if (p > best[1]) best = [t, p];
  }
  return best[0];
})();

export function seraHardy(t, rng) {
  const x = intero(2, rng);
  const y = intero(2, rng);
  const P = probHardy(t, x, y);
  let r = rng();
  for (const a of [0, 1])
    for (const b of [0, 1]) {
      r -= P[a][b];
      if (r < 0) return { x, y, a, b };
    }
  return { x, y, a: 1, b: 1 };
}

/** Le 16 schede del contabile: quali rispettano R1–R3 e se danno due calici rossi. */
export function listeContabile() {
  const out = [];
  for (let k = 0; k < 16; k++) {
    const a0 = (k >> 3) & 1;
    const a1 = (k >> 2) & 1;
    const b0 = (k >> 1) & 1;
    const b1 = k & 1;
    const r1 = !(a0 === 1 && b1 === 0);
    const r2 = !(b0 === 1 && a1 === 0);
    const r3 = !(a1 === 1 && b1 === 1);
    out.push({
      a0,
      a1,
      b0,
      b1,
      rispetta: r1 && r2 && r3,
      dueCaliciRossi: a0 === 1 && b0 === 1,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Nessun messaggio tra le sale (no-signalling)
// ---------------------------------------------------------------------------

/** Una sera nel ristorante stregato con i formati già decisi: x per Alice, y per Bob. */
export function seraGemelle(x, y, delta, rng) {
  const a = rng() < 0.5 ? ROSSO : BIANCO;
  const b = rng() < pStessoColoreGemelle(delta, x, y) ? a : altroColore(a);
  return { x, y, a, b };
}

// ---------------------------------------------------------------------------
// Come si bara: le scappatoie
// ---------------------------------------------------------------------------
//
// Tutte partono dal ristorante normale con il piano «sempre bianco», che
// vince 3 sere su 4. Ogni trucco ha un'intensità p tra 0 e 1.
// - chiacchierone: con probabilità p il cameriere riferisce a Bob come è
//   stata servita Alice e che vino ha scelto (le sale comunicano);
// - registro: con probabilità p il maître non segna una sera persa (sere
//   scartate in modo non casuale: la scappatoia della rilevazione);
// - cucina: con probabilità p la cucina sa in anticipo come serviranno i
//   camerieri (le domande non sono libere);
// - superstregato: un ristorante immaginario che vince sempre senza
//   messaggi; la natura non lo permette (p ignorato).

let pianiDa75 = null;
/** Un piano da 75% che perde solo con i formati opposti alla scommessa. */
function pianoPerScommessa(gx, gy) {
  pianiDa75 ??= tutteLeStrategie().filter((s) => s.percentuale === 0.75);
  return pianiDa75.find(
    (s) =>
      !cenaOfferta(
        1 - gx,
        1 - gy,
        1 - gx === 0 ? s.a0 : s.a1,
        1 - gy === 0 ? s.b0 : s.b1,
      ),
  );
}

export const TRUCCHI = ["chiacchierone", "registro", "cucina", "superstregato"];

export function seraTrucco(trucco, p, rng) {
  const x = intero(2, rng);
  const y = intero(2, rng);
  const vincente = (a) => (x === 1 && y === 1 ? altroColore(a) : a);
  let a = BIANCO;
  let b = BIANCO;
  let registrata = true;
  if (trucco === "chiacchierone") {
    if (rng() < p) b = vincente(a);
  } else if (trucco === "registro") {
    // La cucina scommette su come serviranno i camerieri (gx, gy) e sceglie
    // un piano da 75% che vince proprio in quel caso. Quando la scommessa è
    // sbagliata, con probabilità p l'ordine «va perso» e la sera non viene
    // segnata. Le sere scartate non sono a caso: è questo che inganna.
    const gx = intero(2, rng);
    const gy = intero(2, rng);
    const piano = pianoPerScommessa(gx, gy);
    a = x === 0 ? piano.a0 : piano.a1;
    b = y === 0 ? piano.b0 : piano.b1;
    if ((x !== gx || y !== gy) && rng() < p) registrata = false;
  } else if (trucco === "cucina") {
    if (rng() < p) b = vincente(a);
  } else if (trucco === "superstregato") {
    a = rng() < 0.5 ? ROSSO : BIANCO;
    b = vincente(a);
  }
  return { x, y, a, b, registrata, vinta: cenaOfferta(x, y, a, b) };
}
