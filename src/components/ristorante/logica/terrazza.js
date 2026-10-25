// Modello narrativo classico: entrambe le decisioni conoscono entrambi i piatti.
export const CENE = [
  { id: 'AB', alice: 'Risotto ai funghi', bob: 'Pesce al forno', rosso: true, bottiglia: false, motivo: 'Piatti diversi: calici separati. Alice sceglie il rosso per i funghi.' },
  { id: 'AB′', alice: 'Risotto ai funghi', bob: 'Arrosto', rosso: true, bottiglia: true, motivo: 'Due piatti intensi: rosso e una bottiglia da condividere.' },
  { id: 'A′B', alice: 'Pesce al forno', bob: 'Pesce al forno', rosso: false, bottiglia: true, motivo: 'Due piatti delicati: bianco e una bottiglia da condividere.' },
  { id: 'A′B′', alice: 'Pesce al forno', bob: 'Arrosto', rosso: true, bottiglia: false, motivo: 'Calici separati per i due piatti diversi. Alice sceglie rosso per accompagnare gli assaggi dell’arrosto di Bob.' },
];

export function correlatori(pVino, pFormato) {
  return CENE.map(c => (c.rosso ? 1 : -1) * (c.bottiglia ? -1 : 1) * (2 * pVino - 1) * (2 * pFormato - 1));
}
export function valoreS(e) {
  return Math.abs(e[0] - e[1] + e[2] + e[3]);
}
export function cenaTerrazza(i, pVino, pFormato, rng = Math.random) {
  const c = CENE[i];
  const rosso = rng() < pVino ? c.rosso : !c.rosso;
  const bottiglia = rng() < pFormato ? c.bottiglia : !c.bottiglia;
  return { i, rosso, bottiglia, prodotto: (rosso ? 1 : -1) * (bottiglia ? -1 : 1) };
}
