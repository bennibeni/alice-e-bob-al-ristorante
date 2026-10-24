// Il menù degustazione dello chef (gioco del quadrato magico di Mermin e
// Peres). Nove piatti in una griglia 3 × 3: righe = percorsi, colonne =
// portate. Il cameriere di Alice sceglie a caso un percorso (riga) e Alice
// ordina il vino per i suoi tre piatti; quello di Bob sceglie a caso una
// portata (colonna) e Bob ordina per i tre piatti della colonna.
// La cena è offerta se nel percorso di Alice i rossi sono pari, nella colonna
// di Bob sono dispari e sul piatto in comune il colore è lo stesso.
// Con un accordo preso prima si vince al massimo 8 sere su 9; con due coppie
// di bottiglie gemelle si vince sempre.

export const PERCORSI = ["mare", "terra", "orto"];
export const PORTATE_Q = ["antipasto", "primo", "secondo"];
export const R = "R";
export const B = "B";

const altro = (c) => (c === R ? B : R);

/** Numero di rossi in una terna. */
export const rossi = (terna) => terna.filter((c) => c === R).length;

/** Regole dello chef per una sera: riga r di Alice, colonna c di Bob. */
export function cenaOffertaQ(r, c, rigaAlice, colonnaBob) {
  return (
    rossi(rigaAlice) % 2 === 0 &&
    rossi(colonnaBob) % 2 === 1 &&
    rigaAlice[c] === colonnaBob[r]
  );
}

/** La colonna c di una griglia 3 × 3. */
export const colonna = (griglia, c) => griglia.map((riga) => riga[c]);

/**
 * Esito di un accordo per ognuna delle 9 combinazioni (percorso, portata):
 * Alice usa le righe della sua griglia, Bob le colonne della sua.
 */
export function esitiAccordo({ alice, bob }) {
  return [0, 1, 2].map((r) =>
    [0, 1, 2].map((c) => cenaOffertaQ(r, c, alice[r], colonna(bob, c))),
  );
}

/** Frazione di sere vinte da un accordo (combinazioni equiprobabili). */
export function percentualeAccordo(accordo) {
  return esitiAccordo(accordo).flat().filter(Boolean).length / 9;
}

/** Copia profonda di una griglia. */
export const copia = (g) => g.map((riga) => [...riga]);

/** Griglia tutta bianca. */
export const grigliaBianca = () => [0, 1, 2].map(() => [B, B, B]);

/**
 * Un accordo migliore: le due griglie coincidono tranne sul piatto
 * (orto, secondo). Righe di Alice pari, colonne di Bob dispari: 8 su 9.
 */
export function accordoMigliore() {
  const alice = [
    [R, B, R],
    [B, R, R],
    [B, B, B],
  ];
  const bob = copia(alice);
  bob[2][2] = R;
  return { alice, bob };
}

/** Due accordi sono uguali se coincidono piatto per piatto. */
const ugualiAccordi = (x, y) =>
  JSON.stringify(x.alice) === JSON.stringify(y.alice) &&
  JSON.stringify(x.bob) === JSON.stringify(y.bob);

/**
 * Un accordo migliore scelto a caso (8 sere su 9), diverso da `precedente`.
 * Alice: una terna pari a caso per ogni riga. Le colonne della sua griglia
 * hanno allora 0 o 2 colonne dispari; servono esattamente 2, così Bob copia
 * la griglia e cambia un solo piatto, scelto a caso, nella colonna pari.
 */
export function accordoMiglioreCasuale(rng = Math.random, precedente = null) {
  for (;;) {
    const alice = [0, 1, 2].map(() => [...TERNE_PARI[Math.floor(rng() * 4)]]);
    const pari = [0, 1, 2].filter((c) => rossi(colonna(alice, c)) % 2 === 0);
    if (pari.length !== 1) continue;
    const bob = copia(alice);
    const r = Math.floor(rng() * 3);
    bob[r][pari[0]] = altro(bob[r][pari[0]]);
    const accordo = { alice, bob };
    if (!precedente || !ugualiAccordi(accordo, precedente)) return accordo;
  }
}

/** Le terne con un numero pari (o dispari) di rossi. */
export const TERNE_PARI = [
  [B, B, B],
  [R, R, B],
  [R, B, R],
  [B, R, R],
];
export const TERNE_DISPARI = TERNE_PARI.map((t) => t.map(altro));

/**
 * Una sera al menù degustazione.
 * - modo "liste": Alice e Bob seguono l'accordo;
 * - modo "gemelle": due coppie di bottiglie gemelle. Le risposte hanno la
 *   stessa statistica della strategia quantistica: Alice una terna pari a
 *   caso, Bob una terna dispari a caso fra quelle che concordano sul piatto
 *   in comune. Si vince sempre e ogni piatto, da solo, è rosso metà delle
 *   volte.
 */
export function seraQuadrato({ modo, accordo }, rng) {
  const r = Math.floor(rng() * 3);
  const c = Math.floor(rng() * 3);
  let rigaAlice;
  let colonnaBob;
  if (modo === "liste") {
    rigaAlice = [...accordo.alice[r]];
    colonnaBob = colonna(accordo.bob, c);
  } else {
    rigaAlice = [...TERNE_PARI[Math.floor(rng() * 4)]];
    const compatibili = TERNE_DISPARI.filter((t) => t[r] === rigaAlice[c]);
    colonnaBob = [...compatibili[Math.floor(rng() * compatibili.length)]];
  }
  return {
    r,
    c,
    rigaAlice,
    colonnaBob,
    vinta: cenaOffertaQ(r, c, rigaAlice, colonnaBob),
  };
}

/**
 * Il massimo su tutti gli accordi deterministici. Basta scegliere per Alice
 * una terna pari per riga e per Bob una terna dispari per colonna (le altre
 * perdono già per le regole): 4^3 × 4^3 = 4096 accordi.
 */
export function massimoAccordi() {
  let migliore = 0;
  for (let a = 0; a < 64; a++) {
    const alice = [0, 1, 2].map((i) => TERNE_PARI[(a >> (2 * i)) & 3]);
    for (let b = 0; b < 64; b++) {
      const col = [0, 1, 2].map((j) => TERNE_DISPARI[(b >> (2 * j)) & 3]);
      const bob = [0, 1, 2].map((i) => col.map((t) => t[i]));
      migliore = Math.max(migliore, percentualeAccordo({ alice, bob }));
    }
  }
  return migliore;
}
