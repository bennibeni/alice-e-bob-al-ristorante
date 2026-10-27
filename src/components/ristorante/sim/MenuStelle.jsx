"use client";

import { useEffect, useState } from "react";
import { Wine } from "lucide-react";
import { PIATTI_STELLA, PERCORSI_STELLA, PARITA_STELLA, pianoBobStella, esitiStella, probabilitaStella, seraStella, OSSERVABILI_STELLA } from "../logica/stella";
import "./stella.css";

const percent = p => `${(100*p).toLocaleString("it-IT", {maximumFractionDigits:1})}%`;
const vertices = Array.from({length:5},(_,i) => ({x:250+205*Math.cos(-Math.PI/2+i*2*Math.PI/5),y:240+205*Math.sin(-Math.PI/2+i*2*Math.PI/5)}));
const segments = [[0,2],[2,4],[4,1],[1,3],[3,0]].map(([a,b])=>[vertices[a],vertices[b]]);
const positions = PIATTI_STELLA.map(([a,b])=>{
  const [p,q]=segments[a], [r,s]=segments[b];
  const ux=q.x-p.x,uy=q.y-p.y,vx=s.x-r.x,vy=s.y-r.y;
  const t=((r.x-p.x)*vy-(r.y-p.y)*vx)/(ux*vy-uy*vx);
  return {x:p.x+t*ux,y:p.y+t*uy};
});
function VinoStella({color}) {
  return <Wine size={22} style={{color:color ? "#bd2639":"#207843"}} aria-hidden="true" />;
}
function StellaBoard({ alice, line, last, onFlip }) {
  return <div className="stelle-board">
    <svg viewBox="0 0 500 480" aria-hidden="true">
      {segments.map(([a,b],i)=><line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={i===4 ? "#2563eb":"#a0a9a2"} strokeWidth={i===4 ? 8:2} />)}
      <line x1={segments[line][0].x} y1={segments[line][0].y} x2={segments[line][1].x} y2={segments[line][1].y} stroke="#bd2639" strokeWidth={4} />
    </svg>
    {positions.map((p,i)=>{
      const selected=last?.point===i;
      const index=last ? PERCORSI_STELLA[last.line].indexOf(i):-1;
      const color=alice ? alice[i] : index>=0 ? last.colors[index]:null;
      const description=`Piatto ${i+1}${selected ? ", assegnato ad Alice nell’ultima cena":""}${color===null ? "":`, vino ${color ? "rosso":"bianco"}`}`;
      const content=<><small>{i+1}</small>{color!==null && <VinoStella color={color} />}{selected && <span className="stelle-alice-badge" aria-hidden="true">A</span>}</>;
      const props={className:`stelle-point${selected ? " stelle-alice-selected":""}`,style:{left:`${p.x/5}%`,top:`${p.y/4.8}%`},"aria-label":description};
      return onFlip ? <button key={i} type="button" {...props} aria-label={`${description}. Cambia colore`} onClick={()=>onFlip(i)}>{content}</button> : <span key={i} {...props} role="img">{content}</span>;
    })}
  </div>;
}
export default function MenuStelle({ standalone = false }) {
  const Container = standalone ? "div" : "details";
  const [alice,setAlice]=useState(Array(10).fill(0));
  const [line,setLine]=useState(4);
  const [quantum,setQuantum]=useState(false);
  const [stats,setStats]=useState({n:0,w:0,last:null});
  const bob=pianoBobStella(alice), expected=quantum ? 1:probabilitaStella(alice);
  const [running,setRunning]=useState(false);
  function reset() { setRunning(false); setStats({n:0,w:0,last:null}); }
  function playOne() {
    const last=seraStella(alice,quantum);
    setStats(s=>s.n>=200 ? s : {n:s.n+1,w:s.w+Number(last.win),last});
    setLine(last.line);
  }
  useEffect(()=>{
    if(!running || stats.n>=200) return;
    const timer=setTimeout(()=>{
      const last=seraStella(alice,quantum);
      setStats(s=>({n:s.n+1,w:s.w+Number(last.win),last}));
      setLine(last.line);
    },125);
    return ()=>clearTimeout(timer);
  },[running,stats.n,alice,quantum]);
  const animating=running && stats.n<200;
  return <Container className="menu-stelle">
    {!standalone && <summary>Oltre il quadrato: il menù a cinque stelle</summary>}
    <h3>Dieci piatti, cinque percorsi, un’altra sfida</h3>
    <p>Lo chef dispone dieci piatti su una stella. Ogni piatto appartiene a due percorsi, ciascuno formato da quattro piatti. Nei percorsi 1–4 i vini rossi devono essere pari (0, 2 o 4); nel percorso 5 devono essere dispari (1 o 3).</p>
    <p>Il cameriere estrae un piatto per Alice e, tra i due percorsi che lo contengono, ne sceglie uno per Bob: le 20 domande possibili sono equiprobabili. Alice conosce solo il piatto; Bob solo il percorso. Non possono comunicare. Vincono se Bob rispetta la parità e i due scelgono lo stesso vino per il piatto comune.</p>
    <p>È il gioco del pentagramma magico di Mermin nella variante punto-percorso: Alice sceglie un vino, Bob ne sceglie quattro. Verde indica vino bianco; rosso indica vino rosso.</p>
    <div className="stelle-tabs" role="group" aria-label="Tipo di strategia del menù a cinque stelle">
      <button type="button" aria-pressed={!quantum} onClick={()=>{setQuantum(false);reset();}}>Accordo classico</button>
      <button type="button" aria-pressed={quantum} onClick={()=>{setQuantum(true);reset();}}>Correlazioni quantistiche ideali</button>
    </div>
    {!quantum ? <>
      <p><b>Costruisci l’accordo di Alice:</b> tocca un piatto per cambiarne il vino. Bob prepara in anticipo una risposta per ogni percorso: copia i colori di Alice e, se la parità è sbagliata, inverte il primo piatto del percorso. Questa regola è ottimale per i colori fissati da Alice.</p>
      <StellaBoard alice={alice} line={line} last={stats.last} onFlip={i=>{setAlice(a=>a.map((c,k)=>i===k?1-c:c));reset();}} />
      <p>Blu spesso: percorso 5. Rosso: percorso selezionato di Bob; se è il quinto, il blu resta visibile ai lati.</p>
      <div className="stelle-line-buttons" role="group" aria-label="Evidenzia un percorso">{PERCORSI_STELLA.map((_,i)=><button key={i} type="button" aria-pressed={line===i} onClick={()=>{setRunning(false);setLine(i);setStats(s=>({...s,last:null}));}}>Percorso {i+1} · {PARITA_STELLA[i]?"dispari":"pari"}</button>)}</div>
      <p><b>Risposta concordata di Bob per il percorso {line+1}:</b></p>
      <div className="stelle-bob">{PERCORSI_STELLA[line].map((point,k)=><span key={point} className={bob[line][k]!==alice[point]?"stelle-mismatch":""}><small>Piatto {point+1}</small><VinoStella color={bob[line][k]} /><span>{bob[line][k]===alice[point]?"Concorda":"Non concorda"}</span></span>)}</div>
      <p>Un bordo rosso indica il piatto su cui l’accordo non coincide. Non è un cambio deciso durante la cena: tutte le risposte di Bob sono già fissate prima.</p>
      <button type="button" onClick={()=>{setAlice(Array(10).fill(0));reset();}}>Ripristina un accordo ottimale</button>
    </> : <div className="stelle-quantum">
      <h4>Nessuna stella già colorata</h4>
      <p>Nel modello quantistico non assegnamo dieci vini prestabiliti. Alice misura il piatto richiesto; Bob misura insieme i quattro piatti del suo percorso. Le misure del percorso sono compatibili, la parità è rispettata e sul piatto comune i risultati coincidono sempre.</p>
      <p>Tre coppie di qubit entangled permettono una strategia ideale al <b>100%</b>. Ogni vino locale resta casuale al 50%: non si può trasmettere un messaggio tra le sale.</p>
      <p>Il programma campiona la distribuzione congiunta prevista da questa strategia: non esegue misure su un dispositivo quantistico.</p>
      {stats.last && <><StellaBoard line={stats.last.line} last={stats.last} /><p>Sono colorati solo i quattro piatti misurati da Bob nell’ultima cena. Gli altri non hanno un vino assegnato.</p></>}

    </div>}
    <p><b>Lettura dell’ultima cena:</b> il piatto di Alice ha un alone viola e la lettera A; il percorso di Bob è rosso. Queste informazioni sono mostrate al lettore: Alice conosce solo il proprio piatto e Bob solo il proprio percorso.</p>
    <div className="stelle-statistics" aria-live="polite"><b>Probabilità teorica: {percent(expected)}</b><span>Vittorie osservate: {stats.n?percent(stats.w/stats.n):"—"} ({stats.w}/{stats.n})</span></div>
    <div className="stelle-actions">
      <button type="button" onClick={playOne} disabled={animating || stats.n>=200}>Una cena</button>
      <button type="button" disabled={stats.n>=200} aria-pressed={animating} onClick={()=>setRunning(!animating)}>{stats.n>=200 ? "200 cene completate" : animating ? "Pausa" : stats.n ? "Riprendi fino a 200 cene" : "Avvia 200 cene"}</button>
      <button type="button" onClick={reset}>Azzera</button>
    </div>
    <p>La sequenza mostra una cena ogni 0,125 secondi e si ferma a 200. A ogni estrazione cambiano il piatto di Alice e il percorso di Bob, con possibili ripetizioni casuali. Puoi mettere in pausa e riprendere.</p>
    <p>Le frequenze osservate possono oscillare; il limite classico del 95% riguarda la probabilità teorica.</p>
    {stats.last && <div className="stelle-last" aria-live="polite"><b>Ultima cena: piatto {stats.last.point+1}, percorso {stats.last.line+1}</b>
      <div className="stelle-common-comparison">
        <strong>Piatto comune {stats.last.point+1}</strong>
        <span>Alice <VinoStella color={stats.last.a} /><span className="stelle-sr-only">{stats.last.a ? "rosso":"bianco"}</span></span>
        <span>Bob <VinoStella color={stats.last.colors[PERCORSI_STELLA[stats.last.line].indexOf(stats.last.point)]} /><span className="stelle-sr-only">{stats.last.colors[PERCORSI_STELLA[stats.last.line].indexOf(stats.last.point)] ? "rosso":"bianco"}</span></span>
        <b>{stats.last.win ? "I vini coincidono: vittoria":"I vini sono diversi: sconfitta"}</b>
      </div><p>Alice: <span className="stelle-inline" role="img" aria-label={stats.last.a?"vino rosso":"vino bianco"}><VinoStella color={stats.last.a} /></span>. Bob: {PERCORSI_STELLA[stats.last.line].map((point,k)=><span key={point} className="stelle-inline" role="img" aria-label={`Piatto ${point+1}: vino ${stats.last.colors[k]?"rosso":"bianco"}`}><small>{point+1}</small><VinoStella color={stats.last.colors[k]} /></span>)} · {stats.last.win?"Vittoria":"Sconfitta"}</p></div>}

    {!quantum && <details><summary>Le 20 domande dell’accordo attuale</summary><div className="stelle-table-wrap"><table><thead><tr><th scope="col">Piatto di Alice</th><th scope="col">Percorso di Bob</th><th scope="col">Vino di Alice</th><th scope="col">Vino di Bob</th><th scope="col">Esito</th></tr></thead><tbody>{esitiStella(alice).map(s=><tr key={`${s.point}-${s.line}`}><td>{s.point+1}</td><td>{s.line+1}</td><td><span className={`stelle-color-dot ${s.alice ? "stelle-dot-red" : "stelle-dot-green"}`} role="img" aria-label={s.alice ? "Vino rosso" : "Vino bianco, indicato in verde"} /></td><td><span className={`stelle-color-dot ${s.bob ? "stelle-dot-red" : "stelle-dot-green"}`} role="img" aria-label={s.bob ? "Vino rosso" : "Vino bianco, indicato in verde"} /></td><td><span className={`stelle-outcome-flag ${s.win ? "stelle-flag-win" : "stelle-flag-loss"}`} role="img" aria-label={s.win ? "Vittoria" : "Sconfitta"}>{s.win ? "✓" : "✗"}</span></td></tr>)}</tbody></table></div></details>}
    <details><summary>Il pentagramma in fisica e la formulazione matematica</summary>
      <p>Associamo bianco a +1 e rosso a −1. Ogni percorso richiede il prodotto +1, tranne il quinto che richiede −1. Nel modello classico il prodotto dei cinque vincoli conterrebbe ogni valore due volte e darebbe +1, mentre il prodotto richiesto è −1.</p>
      <p>Nella strategia quantistica assegniamo ai dieci piatti osservabili su tre qubit. I, X e Y indicano identità e matrici di Pauli; le tre lettere sono un prodotto tensoriale.</p>
      <div className="stelle-table-wrap"><table><thead><tr><th scope="col">Percorso</th><th scope="col">Quattro osservabili</th><th scope="col">Prodotto</th></tr></thead><tbody>{PERCORSI_STELLA.map((points,i)=><tr key={i}><td>{i+1}</td><td>{points.map(p=>OSSERVABILI_STELLA[p]).join(" · ")}</td><td>{i===4?"−I":"+I"}</td></tr>)}</tbody></table></div>
      <p>Le quattro osservabili di ogni percorso commutano. Quelle di percorsi diversi possono non commutare: non possiamo sostituirle tutte con dieci colori fissi. Alice e Bob condividono tre coppie di Bell, ossia lo stato massimamente entangled di dimensione locale 8. Bob misura le osservabili del percorso; Alice misura la trasposta dell’osservabile del piatto. La trasposizione assicura risultati uguali sul piatto condiviso, anche per le matrici complesse.</p>
      <p>La distribuzione simulata sceglie uniformemente una delle otto quartine di Bob con la parità prescritta, e assegna ad Alice il risultato del piatto comune. Entrambe le distribuzioni locali sono indipendenti dalla domanda remota.</p>
      <p>Fonte: Alex Arkhipov, <a href="/documenti/arkhipov-quantum-magic-games.pdf" target="_blank" rel="noreferrer">Extending and Characterizing Quantum Magic Games</a> (2012), figura II.1 e protocollo della definizione 15. Il limite classico 19/20 è il conteggio per il protocollo uniforme usato qui.</p>
    </details>
  </Container>;
}
