"use client";
import { useState } from 'react';
import { useIntervallo } from './ui';
import { DOMANDE, attesiVenti, seraVenti } from '../logica/venti';
import { valoreS } from '../logica/terrazza';

const vuoto = () => ({ n: [0,0,0,0], somme: [0,0,0,0], ultime: [null,null,null,null], ultima: null });
const f = x => x.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pulsante = 'rounded border border-zinc-400 px-3 py-2 disabled:opacity-40';

export default function SimVenti() {
  const [vento, setVento] = useState(false);
  const [registro, setRegistro] = useState(vuoto);
  const [corso, setCorso] = useState(false);
  const totale = registro.n.reduce((a,b) => a+b, 0);
  const attesi = attesiVenti(vento);
  const osservati = registro.n.map((n,i) => n ? registro.somme[i]/n : 0);
  const completo = registro.n.every(n => n>0);
  function genera(quante) {
    const sere = Array.from({ length: Math.min(quante, 200-totale) }, () => seraVenti(vento));
    if (totale+sere.length >= 200) setCorso(false);
    setRegistro(prima => {
      const nuovo = { n: [...prima.n], somme: [...prima.somme], ultime: [...prima.ultime], ultima: prima.ultima };
      for (const sera of sere) { nuovo.n[sera.i]++; nuovo.somme[sera.i] += sera.prodotto; nuovo.ultime[sera.i] = sera; nuovo.ultima = sera; }
      return nuovo;
    });
  }
  useIntervallo(() => genera(2), 100, corso);
  function azzera() { setCorso(false); setRegistro(vuoto()); }
  return <div className="space-y-4">
    <fieldset className="flex flex-wrap gap-4 rounded-lg border p-3"><legend className="px-1 font-semibold">La sera in terrazza</legend>{[[false,'Senza vento'],[true,'Con vento']].map(([v,t]) => <label key={t} className="flex items-center gap-2"><input type="radio" name="scenario-venti" checked={vento===v} onChange={() => { azzera(); setVento(v); }} />{t}</label>)}</fieldset>
    <p className="text-sm">{vento ? 'La stessa brezza orienta entrambi: nel modello ideale Alice e Bob annotano la stessa direzione.' : 'Alice e Bob annotano direzioni casuali e indipendenti.'} Usiamo 16 direzioni equiprobabili, distanziate di 22,5° a partire da 11,25°: così non ci sono parità fra alternative. Solo dopo viene estratta la domanda del sommelier.</p>
    <div className="grid gap-3 sm:grid-cols-3">{[['S atteso',f(valoreS(attesi))],['S osservato',completo ? f(valoreS(osservati)) : '—'],['Sere',`${totale} / 200`]].map(([t,v]) => <div key={t} className="rounded-lg border p-3"><p className="text-sm">{t}</p><strong className="text-2xl">{v}</strong></div>)}</div>
    <div className="flex gap-2"><button className={pulsante} disabled={totale>=200} aria-pressed={corso} onClick={() => setCorso(v=>!v)}>{corso ? '❚❚ Pausa' : '▶ Avvia'}</button><button className={pulsante} disabled={corso || totale>=200} onClick={() => genera(1)}>+1 sera</button><button className={pulsante} onClick={azzera}>Azzera</button></div>
    <div className="flex flex-wrap items-center gap-4 rounded-lg bg-sky-50 p-3 dark:bg-sky-950/30">
      <svg viewBox="0 0 220 220" className="h-48 w-48 shrink-0" role="img" aria-label={registro.ultima ? `Direzioni iniziali: Alice ${registro.ultima.a} gradi, Bob ${registro.ultima.b} gradi` : 'Rosa dei venti: in attesa della prima sera'}>
        <circle cx="110" cy="110" r="77" fill="none" stroke="currentColor" opacity="0.3" />
        {['N','NE','E','SE','S','SO','O','NO'].map((d,i) => { const r=i*Math.PI/4; return <g key={d}><line x1="110" y1="110" x2={110+77*Math.sin(r)} y2={110-77*Math.cos(r)} stroke="currentColor" opacity="0.15"/><text x={110+96*Math.sin(r)} y={114-96*Math.cos(r)} textAnchor="middle" fill="currentColor" fontSize="12">{d}</text></g>; })}
        {registro.ultima && [[registro.ultima.a,'#e11d48',70],[registro.ultima.b,'#0284c7',52]].map(([d,colore,l]) => { const r=d*Math.PI/180; return <g key={colore} transform={`translate(110 110) rotate(${d})`}><path d={`M0 0 V${-l} M-5 ${-l+8} L0 ${-l} L5 ${-l+8}`} fill="none" stroke={colore} strokeWidth="4" strokeLinecap="round" /></g>; })}
      </svg>
      <div className="text-sm"><p className="font-semibold">Direzioni annotate prima della domanda</p><p className="text-rose-700 dark:text-rose-300">Alice: {registro.ultima ? `${registro.ultima.a}°` : '—'} · freccia lunga</p><p className="text-sky-700 dark:text-sky-300">Bob: {registro.ultima ? `${registro.ultima.b}°` : '—'} · freccia corta</p><p className="mt-2">Il sommelier sceglie la coppia con la somma più piccola dei due scarti angolari.</p></div>
    </div>
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="mb-2 text-left font-semibold">Le quattro domande e le coppie individuate dal sommelier</caption><thead><tr>{['Domanda','Alice sceglie fra','Bob sceglie fra','Ultima coppia del sommelier','Sere','E atteso','E osservato'].map(t=><th key={t} className="p-2">{t}</th>)}</tr></thead><tbody>{DOMANDE.map((d,i)=><tr key={d.id} className={registro.ultima?.i===i ? 'bg-amber-100 dark:bg-amber-950/60' : ''}><td className="border-t p-2 font-semibold">{d.id}</td><td className="border-t p-2 text-rose-700 dark:text-rose-300">{d.a.join(' / ')}</td><td className="border-t p-2 text-sky-700 dark:text-sky-300">{d.b.join(' / ')}</td><td className="border-t p-2">{registro.ultime[i] ? `${d.a[registro.ultime[i].ia]} e ${d.b[registro.ultime[i].ib]}` : '—'}</td><td className="border-t p-2">{registro.n[i]}</td><td className="border-t p-2">{f(attesi[i])}</td><td className="border-t p-2">{registro.n[i] ? f(osservati[i]) : '—'}</td></tr>)}</tbody></table></div>
    <p className="text-sm">{vento ? 'Con vento, i correlatori attesi sono +0,5, −0,5, +0,5, +0,5: S = 2.' : 'Senza vento, tutti i correlatori attesi sono zero: S = 0.'} La previsione è calcolata enumerando tutte le direzioni del modello. S osservato usa invece soltanto il campione di sere generato: può oscillare anche oltre 2, senza una violazione teorica del limite.</p>
  </div>;
}
