// Gioco punto-percorso: 10 piatti, ciascuno in due dei 5 percorsi.
export const PIATTI_STELLA = [];
for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) PIATTI_STELLA.push([a, b]);
export const PERCORSI_STELLA = Array.from({ length: 5 }, (_, line) =>
  PIATTI_STELLA.flatMap((pair, point) => pair.includes(line) ? [point] : []));
export const PARITA_STELLA = [0, 0, 0, 0, 1];
export const DOMANDE_STELLA = PIATTI_STELLA.flatMap((lines, point) => lines.map(line => ({ point, line })));
export const parity = colors => colors.reduce((p, color) => p ^ color, 0);

// Dato l'accordo di Alice, Bob copia ogni percorso e, solo se necessario,
// corregge il primo piatto per rispettare la parità. È una risposta locale
// deterministica, decisa prima della cena, ottimale per quell'accordo di Alice.
export function pianoBobStella(alice) {
  return PERCORSI_STELLA.map((points, line) => {
    const colors = points.map(point => alice[point]);
    if (parity(colors) !== PARITA_STELLA[line]) colors[0] ^= 1;
    return colors;
  });
}
export function esitiStella(alice) {
  const bob = pianoBobStella(alice);
  return DOMANDE_STELLA.map(({point, line}) => ({point, line,
    alice: alice[point], bob: bob[line][PERCORSI_STELLA[line].indexOf(point)],
    win: alice[point] === bob[line][PERCORSI_STELLA[line].indexOf(point)],
  }));
}
export const probabilitaStella = alice => esitiStella(alice).filter(s => s.win).length / 20;
export function seraStella(alice, quantum, rng = Math.random) {
  const {point, line} = DOMANDE_STELLA[Math.floor(rng() * 20)];
  if (!quantum) {
    const colors = pianoBobStella(alice)[line];
    return {point,line,a:alice[point],colors,win:alice[point] === colors[PERCORSI_STELLA[line].indexOf(point)]};
  }
  // Campionamento congiunto della distribuzione quantistica ideale.
  // Bob ha 8 quartine equiprobabili a parità fissata; Alice coincide sul piatto.
  const colors = Array.from({length:3}, () => Number(rng() < .5));
  colors.push(parity(colors) ^ PARITA_STELLA[line]);
  return {point,line,colors,a:colors[PERCORSI_STELLA[line].indexOf(point)],win:true};
}

// Osservabili indicizzate dai piatti (coppie dei percorsi che li contengono).
export const OSSERVABILI_STELLA = ["XII","IXI","IIX","XXX","IIY","IYI","XYY","YII","YXY","YYX"];
