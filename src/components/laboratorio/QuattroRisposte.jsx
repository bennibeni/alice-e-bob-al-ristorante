"use client";

import { useState } from "react";
import { Wine, BottleWine } from "lucide-react";
import { strategies, cases, wins, score } from "./model";

export default function QuattroRisposte({ alice, bob, onChange }) {
  const [active, setActive] = useState(null);
  const a = strategies[alice], b = strategies[bob];
  const values = [...a, ...b];
  const probability = score(a, b);
  const s = 8 * probability - 4;
  const edges = [[0, 2], [0, 3], [1, 2], [1, 3]];
  function flip(index) {
    const next = values.map((value, i) => i === index ? 1 - value : value);
    onChange(strategies.findIndex(v => v[0] === next[0] && v[1] === next[1]), strategies.findIndex(v => v[0] === next[2] && v[1] === next[3]));
  }
  return <details className="chsh-four-example">
    <summary>Un altro esempio classico: quattro risposte, un limite</summary>
    <p>Questo tabellone rappresenta un intero accordo: il colore che Alice e Bob sceglierebbero per ciascuno dei due formati. Durante una cena ciascuno riceve un solo formato e dà una sola risposta: qui vediamo anche le alternative per studiare il piano.</p>
    <p>Tocca un’icona per invertirne il colore. Il tabellone e i selettori sopra mostrano lo stesso accordo. Seleziona un abbinamento sotto per seguirne il collegamento.</p>
    <div className="chsh-four-board">
      <div className="chsh-four-nodes">{values.map((value, index) => {
        const Icon = index % 2 ? BottleWine : Wine;
        const name = index < 2 ? "Alice" : "Bob";
        const format = index % 2 ? "bottiglia" : "calice";
        const dim = active !== null && !edges[active].includes(index);
        return <button key={index} type="button" className={`chsh-four-node${dim ? " chsh-four-dim" : ""}`} aria-label={`${name}, ${format}: vino ${value ? "rosso" : "bianco"}. Cambia colore`} onClick={() => flip(index)}>
          <span>{name}</span><Icon className={value ? "chsh-strategy-red" : "chsh-strategy-green"} size={42} aria-hidden="true" /><small>{format}</small>
        </button>;
      })}</div>
      <svg className="chsh-four-wires" viewBox="0 0 800 150" preserveAspectRatio="none" role="img" aria-label="Quattro collegamenti tra le risposte di Alice e quelle di Bob">
        {["M100 0V120H500V0", "M100 0V145H700V0", "M300 0V70H500V0", "M300 0V95H700V0"].map((d,i) => <path key={d} d={d} className={`chsh-four-wire chsh-four-edge-${i}${active !== null && active !== i ? " chsh-four-dim" : ""}`} />)}
      </svg>
    </div>
    <div className="chsh-four-outcomes">{cases.map(([x,y],i) => {
      const ok = wins(x,y,a[x],b[y]);
      const IconA = x ? BottleWine : Wine, IconB = y ? BottleWine : Wine;
      return <button key={i} type="button" aria-pressed={active === i} className={`chsh-four-outcome chsh-four-edge-${i}`} aria-label={`Alice ${x ? "bottiglia" : "calice"}, Bob ${y ? "bottiglia" : "calice"}: ${ok ? "vittoria" : "sconfitta"}. Evidenzia collegamento`} onClick={() => setActive(active === i ? null : i)}>
        <span className="chsh-round-pair" aria-hidden="true"><IconA className={a[x] ? "chsh-strategy-red" : "chsh-strategy-green"} /><IconB className={b[y] ? "chsh-strategy-red" : "chsh-strategy-green"} /></span>
        <span>{ok ? "Vittoria" : "Sconfitta"}</span><b>{ok ? "+1" : "−1"}</b>
      </button>;
    })}</div>
    <p aria-live="polite"><b>{probability * 4} vittorie su 4 · Probabilità {probability * 100}% · S = {s > 0 ? "+" : ""}{s}</b></p>
    <p>Qui assegniamo +1 a ogni abbinamento vincente e −1 a ogni abbinamento perdente: S è la somma dei quattro contributi. Ogni accordo dà S = +2 oppure −2, cioè tre vittorie oppure una.</p>
    <p>Cambiando una sola risposta si capovolgono gli esiti dei due collegamenti che la usano. Il numero di vittorie rimane dispari: non si arriva mai a quattro. Mescolare accordi non supera la probabilità massima del 75%.</p>
    <p className="chsh-muted">È un modello classico di risposte prestabilite. Le correlazioni quantistiche richiedono misure alternative: non sono quattro colori già scritti sul tabellone.</p>
  </details>;
}
