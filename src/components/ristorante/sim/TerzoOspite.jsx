"use client";

import { useEffect, useState } from "react";
import { Wine, BottleWine } from "lucide-react";
import { INPUT_GHZ, risultatiGHZ, probabilitaGHZ, tuttiAccordiGHZ, cenaGHZ } from "../logica/ghz";
import "./ghz.css";
import VoltoOspite from "./VoltoOspite";

const names=["Alice","Bob","Charlie"];
const percent=value=>`${(value*100).toLocaleString("it-IT",{maximumFractionDigits:1})}%`;
const empty=()=>({n:0,w:0,last:null});
function FormatoGHZ({input,color}) {
  const Icon=input ? BottleWine:Wine;
  return <Icon size={28} aria-hidden="true" style={{color:color===undefined ? "#111":color ? "#bd2639":"#207843"}} />;
}
function Tripletta({inputs,outputs}) {
  return <span className="ghz-triplet" role="img" aria-label={inputs.map((x,i)=>`${names[i]}: ${x?"bottiglia":"calice"}${outputs ? `, vino ${outputs[i]?"rosso":"bianco"}`:""}`).join("; ")}>
    {inputs.map((x,i)=><FormatoGHZ key={i} input={x} color={outputs?.[i]} />)}
  </span>;
}
export default function TerzoOspite() {
  const [plan,setPlan]=useState([[0,0],[0,0],[1,1]]);
  const [quantum,setQuantum]=useState(false);
  const [stats,setStats]=useState(empty);
  const [running,setRunning]=useState(false);
  const [showAll,setShowAll]=useState(false);
  const expected=quantum?1:probabilitaGHZ(plan);
  const rows=risultatiGHZ(plan),animating=running && stats.n<100;
  function reset(){setRunning(false);setStats(empty());}
  function record(){const last=cenaGHZ(plan,quantum);setStats(s=>s.n>=100?s:{n:s.n+1,w:s.w+Number(last.win),last});}
  useEffect(()=>{
    if(!running || stats.n>=100)return;
    const timer=setTimeout(()=>{
      const last=cenaGHZ(plan,quantum);
      setStats(s=>({n:s.n+1,w:s.w+Number(last.win),last}));
    },125);
    return ()=>clearTimeout(timer);
  },[running,stats.n,plan,quantum]);
  return <div className="ghz-game">
    <h3>Tre sale, una sola sfida</h3>
    <p>I simboli neri indicano i formati; verde significa vino bianco e rosso vino rosso. Le triple sono sempre nell’ordine Alice, Bob, Charlie.</p>
    <div className="ghz-rules">{INPUT_GHZ.map((inputs,i)=><div key={i}>
      <Tripletta inputs={inputs} /><b>{i===0?"0 o 2 vini rossi":"1 o 3 vini rossi"}</b><span>{i===0?"Rossi pari":"Rossi dispari"}</span><small>Probabilità 25%</small>
    </div>)}</div>
    <div className="ghz-controls" role="group" aria-label="Tipo di strategia">
      <button type="button" aria-pressed={!quantum} onClick={()=>{setQuantum(false);reset();}}>Accordo classico</button>
      <button type="button" aria-pressed={quantum} onClick={()=>{setQuantum(true);reset();}}>Correlazioni GHZ ideali</button>
    </div>
    {!quantum ? <>
      <p>Ogni ospite concorda due risposte, una per il calice e una per la bottiglia. Cambia un’icona per cambiare il vino: stai preparando l’accordo prima della cena.</p>
      <div className="ghz-plans">{names.map((name,i)=><fieldset key={name}><legend>{name}</legend><div>{[0,1].map(input=><button key={input} type="button" aria-label={`${name}, ${input?"bottiglia":"calice"}: ${plan[i][input]?"rosso":"bianco"}. Cambia vino`} onClick={()=>{setPlan(p=>p.map((s,k)=>k===i?s.map((v,x)=>x===input?1-v:v):s));reset();}}><FormatoGHZ input={input} color={plan[i][input]} /><small>{input?"Bottiglia":"Calice"}</small></button>)}</div></fieldset>)}</div>
      <p>L’accordo iniziale prevede Alice e Bob sempre con vino bianco e Charlie sempre con vino rosso: vince nei tre casi con due bottiglie, perde con tre calici. La probabilità è <b>75%</b>. Se tutti scelgono sempre bianco, vince solo con tre calici: <b>25%</b>. Scelte casuali indipendenti ed equiprobabili danno invece <b>50%</b>.</p>
    </> : <div className="ghz-quantum">
      <h4>Tre qubit nello stesso stato GHZ</h4>
      <p>Ogni ospite riceve un qubit e sceglie una misura locale in base al proprio formato. Le singole risposte sono casuali, ma la parità dei tre colori soddisfa sempre la richiesta dello chef. Non ci sono sei colori già decisi da svelare.</p>
      <p>Il programma campiona la distribuzione ideale prevista dalle misure. Non esegue un esperimento quantistico e non introduce comunicazione tra le sale.</p>
    </div>}
    <div className="ghz-statistics" aria-live="polite"><b>Probabilità teorica: {percent(expected)}</b><span>Vittorie osservate: {stats.n?percent(stats.w/stats.n):"—"} ({stats.w}/{stats.n})</span></div>
    <div className="ghz-controls">
      <button type="button" onClick={record} disabled={animating || stats.n>=100}>Una cena</button>
      <button type="button" disabled={stats.n>=100} aria-pressed={animating} onClick={()=>setRunning(!animating)}>{stats.n>=100?"100 cene completate":animating?"Pausa":stats.n?"Riprendi fino a 100 cene":"Avvia 100 cene"}</button>
      <button type="button" onClick={reset}>Azzera</button>
    </div>
    <p>Una cena ogni 0,125 secondi, fino a 100. A ogni cena si estrae una delle quattro combinazioni ammesse; può ripetersi per caso. Le frequenze osservate possono oscillare intorno alla probabilità teorica.</p>
    <div className="ghz-rooms" aria-label="Tre sale separate">{names.map((name,i)=><div key={name}><h4>Sala di {name}</h4><VoltoOspite nome={name} />{stats.last ? <><span className="ghz-local" role="img" aria-label={`${stats.last.inputs[i]?"Bottiglia":"Calice"}, vino ${stats.last.outputs[i]?"rosso":"bianco"}`}><FormatoGHZ input={stats.last.inputs[i]} color={stats.last.outputs[i]} /></span><span>{stats.last.inputs[i]?"Bottiglia":"Calice"}</span></>:<span>In attesa della prima cena</span>}</div>)}</div>
    {stats.last && <p className="ghz-last" aria-live="polite"><b>Ultima cena:</b> {stats.last.outputs.filter(Boolean).length} vini rossi; lo chef richiede un numero {stats.last.inputs.every(v=>v===0)?"pari":"dispari"}. <b>{stats.last.win?"✓ Vittoria":"✗ Sconfitta"}</b></p>}
    <p className="ghz-note">Il lettore vede tutte e tre le sale. Ogni ospite conosce solo il proprio formato e il proprio vino; i risultati si confrontano dopo le risposte.</p>
    <details><summary>{quantum ? "Le quattro domande e le probabilità ideali" : "Le quattro domande e l’accordo attuale"}</summary><div className="ghz-table-wrap"><table><caption>Ordine delle icone: Alice, Bob, Charlie</caption><thead><tr><th scope="col">Formati</th><th scope="col">Richiesta</th><th scope="col">{quantum?"Probabilità di vittoria":"Risposte concordate"}</th><th scope="col">Esito</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td><Tripletta inputs={r.inputs} /></td><td>{i===0?"Rossi pari":"Rossi dispari"}</td><td>{quantum?"100%":<Tripletta inputs={r.inputs} outputs={r.outputs} />}</td><td>{quantum?"✓ Sempre":r.win?"✓ Vittoria":"✗ Sconfitta"}</td></tr>)}</tbody></table></div></details>
    {!quantum && <details><summary>I 64 accordi classici</summary>
      <p>Quattro strategie personali per ciascuno dei tre ospiti: 4 × 4 × 4 = 64 accordi. Di questi, 32 vincono al 75% e 32 al 25%. Per ogni ospite, le icone indicano prima il calice e poi la bottiglia.</p>
      <button type="button" aria-expanded={showAll} onClick={()=>setShowAll(!showAll)}>{showAll?"Nascondi l’elenco":"Mostra tutti gli accordi"}</button>
      {showAll && <div className="ghz-table-wrap"><table><thead><tr>{names.map(n=><th key={n} scope="col">{n}</th>)}<th scope="col">Vittoria</th><th scope="col">Scegli</th></tr></thead><tbody>{tuttiAccordiGHZ().map((entry,i)=><tr key={i}>{entry.plan.map((s,k)=><td key={k}><span className="ghz-triplet" role="img" aria-label={`Calice ${s[0]?"rosso":"bianco"}, bottiglia ${s[1]?"rosso":"bianco"}`}><FormatoGHZ input={0} color={s[0]} /><FormatoGHZ input={1} color={s[1]} /></span></td>)}<td>{percent(entry.probability)}</td><td><button type="button" aria-label={`Usa accordo ${i+1}, vittoria ${percent(entry.probability)}`} onClick={()=>{setPlan(entry.plan.map(s=>[...s]));reset();}}>Usa</button></td></tr>)}</tbody></table></div>}
    </details>}
    <details><summary>Perché il massimo classico è 75%?</summary>
      <p>Fissiamo i sei colori di un accordo, due per ciascun ospite. Supponiamo che vinca in tutte le quattro domande.</p>
      <ol><li>Con tre calici il numero di rossi deve essere pari.</li><li>In ciascuna delle tre combinazioni con due bottiglie il numero di rossi deve essere dispari.</li><li>Sommando i conteggi dei rossi delle quattro domande, ogni risposta dell’accordo viene contata due volte. Il totale deve quindi essere pari.</li><li>Ma le richieste dello chef danno un conteggio pari più tre dispari: il totale deve essere dispari. È una contraddizione.</li></ol>
      <p>Almeno una domanda deve essere perdente. Poiché le quattro sono equiprobabili, la probabilità di vittoria non supera 3/4 = 75%. L’accordo iniziale raggiunge questo valore. Anche una media di accordi scelti casualmente non può superarne il massimo.</p>
    </details>
    <details><summary>Perché la strategia quantistica può vincere sempre?</summary>
      <p>I tre ospiti condividono lo stato |GHZ⟩ = (|000⟩ + |111⟩)/√2, un qubit per sala. Ciascuno misura X se riceve il calice, Y se riceve la bottiglia, dove X e Y sono le matrici di Pauli. Il risultato +1 indica vino bianco; −1 vino rosso.</p>
      <p>Il prodotto dei risultati è sempre +1 per le tre misure X, e sempre −1 quando una misura è X e due sono Y. Quindi i rossi sono pari con tre calici e dispari negli altri tre casi: tutte le richieste sono rispettate.</p>
      <p>Le quattro triple vincenti di colori, per ciascuna domanda, hanno probabilità 1/4; ogni singolo risultato è bianco o rosso con probabilità 1/2. La simulazione campiona queste triple. Nessuno può scegliere il proprio esito per inviare un messaggio.</p>
      <p>La dimostrazione classica presume sei risposte prestabilite. Le misure X e Y sullo stesso qubit sono incompatibili: il modello quantistico non assegna entrambe le risposte prima della misura.</p>
      <details><summary>Formulazione matematica del gioco Mermin–GHZ</summary>
        <p>L’arbitro sceglie uniformemente (x,y,z) ∈ &#123;000,011,101,110&#125;, indipendentemente dalle risorse condivise. Invia un bit a ogni giocatore, che restituisce a,b,c senza comunicare. I bit degli input sono vincolati fra loro: non sono tre estrazioni indipendenti.</p>
        <p className="ghz-formula">a ⊕ b ⊕ c = (x + y + z)/2 (mod 2).</p>
        <p>La promessa x ⊕ y ⊕ z = 0 rende la divisione intera. Le quattro condizioni classiche sono:</p>
        <div className="ghz-formula">a₀ ⊕ b₀ ⊕ c₀ = 0<br/>a₀ ⊕ b₁ ⊕ c₁ = 1<br/>a₁ ⊕ b₀ ⊕ c₁ = 1<br/>a₁ ⊕ b₁ ⊕ c₀ = 1</div>
        <p>Sommandole modulo 2, ogni risposta a sinistra si cancella con se stessa, ma a destra resta 1: 0 = 1.</p>
        <p>Per lo stato GHZ: ⟨XXX⟩ = +1, ⟨XYY⟩ = ⟨YXY⟩ = ⟨YYX⟩ = −1. L’espressione di Mermin M = ⟨XXX⟩ − ⟨XYY⟩ − ⟨YXY⟩ − ⟨YYX⟩ vale al massimo 2 nei modelli classici locali, e raggiunge 4 nella strategia quantistica. Con queste convenzioni, P(vittoria) = 1/2 + M/8.</p>
      </details>
    </details>
  </div>;
}
