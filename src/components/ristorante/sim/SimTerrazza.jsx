"use client";

import { useState } from 'react';
import { CENE, cenaTerrazza, correlatori, valoreS } from '../logica/terrazza';

const vuoto = () => ({ n: [0, 0, 0, 0], somme: [0, 0, 0, 0], ultima: null });
const f = n => n.toLocaleString('it-IT', { maximumFractionDigits: 3, minimumFractionDigits: 2 });
const button = 'rounded border border-zinc-400 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10';

export default function SimTerrazza() {
  const [pVino, setVino] = useState(0.8);
  const pFormato = pVino;
  function cambiaPreferenza(p) { setVino(p); setRegistro(vuoto()); }
  const [registro, setRegistro] = useState(vuoto);
  const e = correlatori(pVino, pFormato);
  const completo = registro.n.every(n => n > 0);
  const osservati = registro.n.map((n, i) => n ? registro.somme[i] / n : 0);
  const totale = registro.n.reduce((a, b) => a + b, 0);
  function genera(numero) {
    const cene = Array.from({ length: numero }, () => cenaTerrazza(Math.floor(Math.random() * 4), pVino, pFormato));
    setRegistro(prima => {
      const prossimo = { n: [...prima.n], somme: [...prima.somme], ultima: prima.ultima };
      for (const cena of cene) {
        const i = cena.i;
        prossimo.n[i]++;
        prossimo.somme[i] += cena.prodotto;
        prossimo.ultima = cena;
      }
      return prossimo;
    });
  }
  return <div className="space-y-5">
    <label className="block rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
      <span className="block font-medium">Quanto sono abitudinari? Entrambi mantengono la propria preferenza nel {Math.round(pVino * 100)}% delle sere.</span>
      <input className="mt-3 w-full" type="range" min="50" max="100" step="1" value={Math.round(pVino * 100)} onChange={event => cambiaPreferenza(Number(event.target.value) / 100)} />
      <span className="text-sm">Su 100 sere, Alice sceglie il colore preferito circa {Math.round(pVino * 100)} volte; Bob sceglie il formato preferito altrettante volte. Nelle altre sere cambiano scelta. I cambiamenti dei due non devono avvenire nelle stesse sere.</span>
    </label>
    <div className="overflow-x-auto"><table className="w-full text-left text-sm">
      <caption className="mb-2 text-left font-semibold">Prima l’ipotesi sulle abitudini, poi il risultato</caption>
      <thead><tr><th className="border-b p-2">Preferenza mantenuta da ciascuno</th><th className="border-b p-2">S medio risultante</th><th className="border-b p-2">Esplora</th></tr></thead>
      <tbody>{[0.5, 0.75, 0.8, 0.85, 0.9, 0.95, 1].map(p => <tr key={p} className={Math.abs(p-pVino) < 0.00001 ? 'bg-sky-50 dark:bg-sky-950/30' : ''}>
        <td className="border-b p-2">{Math.round(p*100)}%{p === 0.75 ? ' · tre sere su quattro' : p === 0.8 ? ' · quattro sere su cinque' : p === 0.9 ? ' · nove sere su dieci' : p === 1 ? ' · sempre' : ''}</td>
        <td className="border-b p-2">{f(valoreS(correlatori(p, p)))}</td>
        <td className="border-b p-2"><button className={button} aria-pressed={Math.abs(p-pVino) < 0.00001} onClick={() => cambiaPreferenza(p)}>Prova {Math.round(p*100)}%</button></td>
      </tr>)}</tbody>
    </table></div>
    <p className="text-sm">Ogni piatto è scelto casualmente con probabilità ½, indipendentemente da quello dell’altro. Le scelte possono avvenire in momenti diversi. Prima di ordinare da bere, entrambi conoscono tutti e due i piatti. Cambiare l’ipotesi sulle abitudini azzera il registro.</p>
    <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
      <div className="rounded-lg border p-4"><p className="text-sm">S atteso dal modello</p><strong className="text-3xl">{f(valoreS(e))}</strong></div>
      <div className="rounded-lg border p-4"><p className="text-sm">S osservato</p><strong className="text-3xl">{completo ? f(valoreS(osservati)) : '—'}</strong><p className="text-xs">{completo ? 'Può oscillare, soprattutto con poche cene.' : 'Servono osservazioni per tutti e quattro i menù.'}</p></div>
      <div className="rounded-lg border p-4"><p className="text-sm">Cene registrate</p><strong className="text-3xl">{totale.toLocaleString('it-IT')}</strong></div>
    </div>
    <div className="flex flex-wrap gap-2">
      <button className={button} onClick={() => genera(1)}>+1 cena</button>
      <button className={button} onClick={() => genera(200)}>+200 cene</button>
      <button className={button} onClick={() => genera(10000)}>+10.000 cene</button>
      <button className={button} onClick={() => setRegistro(vuoto())}>Azzera</button>
    </div>
    {registro.ultima && <p className="rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-950/30" aria-live="polite">Ultima cena: Alice mangia {CENE[registro.ultima.i].alice.toLowerCase()}, Bob {CENE[registro.ultima.i].bob.toLowerCase()}. Alice sceglie <strong>{registro.ultima.rosso ? 'rosso' : 'bianco'}</strong>; Bob <strong>{registro.ultima.bottiglia ? 'bottiglia' : 'calice'}</strong>.</p>}
    <div className="overflow-x-auto"><table className="w-full text-left text-sm">
      <caption className="mb-2 text-left font-semibold">Le quattro cene e le preferenze del modello</caption>
      <thead><tr>{['Situazione / piatti', 'Preferenza e motivo', 'Cene', 'E atteso', 'E osservato'].map(t => <th key={t} className="border-b p-2">{t}</th>)}</tr></thead>
      <tbody>{CENE.map((c, i) => <tr key={c.id}>
        <td className="border-b p-2"><strong>{c.id}</strong><br />Alice: {c.alice}<br />Bob: {c.bob}</td>
        <td className="min-w-52 border-b p-2"><strong>{c.rosso ? 'Rosso' : 'Bianco'} · {c.bottiglia ? 'bottiglia' : 'calice'}</strong><br />{c.motivo}</td>
        <td className="border-b p-2">{registro.n[i]}</td><td className="border-b p-2">{f(e[i])}</td><td className="border-b p-2">{registro.n[i] ? f(osservati[i]) : '—'}</td>
      </tr>)}</tbody>
    </table></div>
    <details className="rounded-lg border p-4"><summary className="cursor-pointer font-medium">Come si fanno i conti?</summary>
      <div className="mt-3 space-y-2 text-sm">
        <p>Rosso = +1, bianco = −1; calice = +1, bottiglia = −1. E è la media del prodotto dei due numeri per ciascuna coppia di piatti. Non misura quanto sia buono il vino.</p>
        <p>S = |E(AB) − E(AB′) + E(A′B) + E(A′B′)|.</p>
        <p>Le preferenze danno i segni +, −, +, +. Se Alice mantiene la propria preferenza con probabilità p e Bob con probabilità q, ogni correlatore ha modulo (2p − 1)(2q − 1). Quindi S atteso = 4(2p − 1)(2q − 1).</p>
        <p>Qui usiamo la stessa probabilità per entrambi: p = q, quindi S medio = 4(2p − 1)². Con 80% emerge 1,44; con 90% emerge 2,56. Il superamento di 2 avviene oltre circa 85,36%. Le percentuali descrivono ipotesi sui personaggi, non dati raccolti su persone reali.</p>
      </div>
    </details>
    <p className="rounded-lg bg-sky-50 p-4 text-sm dark:bg-sky-950/30"><strong>Perché non è stregoneria?</strong> Quando Alice mangia pesce, la sua preferenza cambia guardando il piatto di Bob. Anche Bob valuta entrambi i piatti prima di scegliere il formato. Le decisioni dipendono dal menù completo: mancano le condizioni delle sale isolate. Il limite quantistico di circa 2,83 non si applica a questo modello.</p>
  </div>;
}
