// Convenzione del capitolo 3 e del laboratorio: diversi salvo due bottiglie.
// Gli altri capitoli mantengono il loro modello originale.
import {
  ROSSO, BIANCO, seraSfida as seraOriginale,
  tutteLeStrategie as strategieOriginali,
} from "./ristorante";
export { DELTA_OTTIMALE, FORMATI, ROSSO, BIANCO, creaRng,
  pVittoriaGemelle, semeCasuale } from "./ristorante";

const inverti = colore => colore === ROSSO ? BIANCO : ROSSO;
export function cenaOfferta(x, y, a, b) {
  return x === 1 && y === 1 ? a === b : a !== b;
}
export function percentualeStrategia({a0,a1,b0,b1}) {
  const a = [a0,a1], b = [b0,b1];
  return [0,1].flatMap(x => [0,1].map(y => Number(cenaOfferta(x,y,a[x],b[y])))).reduce((sum,v) => sum+v,0)/4;
}
export function tutteLeStrategie() {
  return strategieOriginali().map(s => ({...s, percentuale: percentualeStrategia(s)}));
}
export function seraSfida({modo,strategia,delta}, rng) {
  const adattata = modo === "liste" ? {...strategia,b0:inverti(strategia.b0),b1:inverti(strategia.b1)} : strategia;
  const sera = seraOriginale({modo,strategia:adattata,delta},rng);
  const b = inverti(sera.b);
  return {...sera,b,vinta:cenaOfferta(sera.x,sera.y,sera.a,b)};
}
