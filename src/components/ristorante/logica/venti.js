export const DOMANDE = [
  { id: 'AB', a: ['N', 'S'], b: ['NE', 'SO'], angoli: [0, 45] },
  { id: 'AB′', a: ['N', 'S'], b: ['SE', 'NO'], angoli: [0, 135] },
  { id: 'A′B', a: ['E', 'O'], b: ['NE', 'SO'], angoli: [90, 45] },
  { id: 'A′B′', a: ['E', 'O'], b: ['SE', 'NO'], angoli: [90, 135] },
];
// Sedici direzioni intermedie evitano ex aequo fra alternative opposte.
export const DIREZIONI = Array.from({ length: 16 }, (_, i) => 11.25 + i * 22.5);
export function distanza(a, b) { const d = Math.abs(a-b) % 360; return Math.min(d, 360-d); }
export function scegli(direzione, asse) { return distanza(direzione, asse) < distanza(direzione, (asse+180)%360) ? 0 : 1; }
export function risposta(i, a, b) {
  const domanda = DOMANDE[i];
  const ia = scegli(a, domanda.angoli[0]), ib = scegli(b, domanda.angoli[1]);
  return { i, a, b, ia, ib, prodotto: ia === ib ? 1 : -1 };
}
export function attesiVenti(vento) {
  return DOMANDE.map((_, i) => {
    let somma = 0, n = 0;
    for (const a of DIREZIONI) for (const b of (vento ? [a] : DIREZIONI)) { somma += risposta(i, a, b).prodotto; n++; }
    return somma/n;
  });
}
export function seraVenti(vento, rng = Math.random) {
  const a = DIREZIONI[Math.floor(rng()*16)];
  const b = vento ? a : DIREZIONI[Math.floor(rng()*16)];
  return risposta(Math.floor(rng()*4), a, b);
}
