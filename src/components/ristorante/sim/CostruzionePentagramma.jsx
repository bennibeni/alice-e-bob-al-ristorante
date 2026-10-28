"use client";

import { useState } from "react";
import { PIATTI_STELLA, PERCORSI_STELLA, OSSERVABILI_STELLA } from "../logica/stella";

const semi = [
  [1,"XII","X sul primo qubit"], [2,"IXI","X sul secondo qubit"],
  [3,"IIX","X sul terzo qubit"], [5,"IIY","Y sul terzo qubit"],
  [6,"IYI","Y sul secondo qubit"], [8,"YII","Y sul primo qubit"],
];
const composti = [
  [4,"1, 2, 3","XII · IXI · IIX = XXX"],
  [7,"1, 5, 6","XII · IIY · IYI = XYY"],
  [9,"2, 5, 8","IXI · IIY · YII = YXY"],
  [10,"3, 6, 8","IIX · IYI · YII = YYX"],
];

export default function CostruzionePentagramma() {
  const [piatto,setPiatto]=useState(0);
  return <details className="stelle-construction">
    <summary>Come si costruisce la tabella? Le tre condizioni, passo per passo</summary>
    <p>La forma della stella indica quali piatti appartengono a ciascun percorso. Da sola, però, non assegna nessuna misura ai piatti. Cerchiamo una famiglia di dieci osservabili che realizzi questa struttura e le regole dello chef. Quella mostrata è una soluzione particolare, non l’unica possibile.</p>
    <h4>Le tre condizioni da rispettare contemporaneamente</h4>
    <ol>
      <li><b>Condivisione:</b> ogni piatto deve avere una sola osservabile, identica nei due percorsi che lo contengono.</li>
      <li><b>Compatibilità:</b> le quattro osservabili di ciascun percorso devono commutare a coppie, così Bob può misurarle insieme.</li>
      <li><b>Parità:</b> il prodotto delle quattro osservabili deve essere +I nei percorsi 1–4 e −I nel percorso 5. Qui I è l’identità sull’intero sistema di tre qubit.</li>
    </ol>
    <h4>1. Partiamo da sei misure semplici</h4>
    <p>Su ciascuno dei tre qubit possiamo considerare X oppure Y. Scegliamo sei osservabili che misurano un solo qubit alla volta. Le altre due lettere sono I, cioè l’identità.</p>
    <div className="stelle-table-wrap"><table>
      <caption>Le sei osservabili di partenza</caption>
      <thead><tr><th scope="col">Piatto</th><th scope="col">Osservabile</th><th scope="col">Significato</th></tr></thead>
      <tbody>{semi.map(([p,o,testo])=><tr key={p}><td>{p}</td><td><code>{o}</code></td><td>{testo}</td></tr>)}</tbody>
    </table></div>
    <p>I numeri non determinano le lettere: abbiamo collocato queste sei misure nei punti della stella in modo da poter completare i percorsi. Ad esempio, il piatto 1 è il punto comune ai percorsi 1 e 2; gli associamo XII e manteniamo questa scelta in entrambi.</p>
    <h4>2. Completiamo i primi quattro percorsi</h4>
    <p>In ognuno dei primi quattro percorsi ci sono tre delle misure semplici, una per ciascun qubit. Misure su qubit distinti commutano. Scegliamo come quarta osservabile il loro prodotto.</p>
    <div className="stelle-table-wrap"><table>
      <caption>Le quattro osservabili costruite come prodotti delle precedenti</caption>
      <thead><tr><th scope="col">Piatto da completare</th><th scope="col">Piatti usati</th><th scope="col">Costruzione</th></tr></thead>
      <tbody>{composti.map(([p,usati,formula])=><tr key={p}><td>{p}</td><td>{usati}</td><td><code>{formula}</code></td></tr>)}</tbody>
    </table></div>
    <p>Per esempio, nel percorso 1 le prime tre misure sono XII, IXI e IIX. Il loro prodotto è XXX, che assegniamo al piatto 4. Questo spiega da dove viene quella sigla: non è una scelta fatta a caso.</p>
    <p>Le quattro misure del percorso sono compatibili: le prime tre commutano tra loro e il loro prodotto commuta con ciascuna. Inoltre, ciascuna ha quadrato I. Il prodotto dell’intero percorso è quindi:</p>
    <p className="stelle-concept-formula">XII · IXI · IIX · XXX = XXX · XXX = I.</p>
    <p>La stessa costruzione vale nei percorsi 2, 3 e 4. Abbiamo così ottenuto la compatibilità e il prodotto +I per tutti e quattro, senza introdurre colori prestabiliti.</p>
    <h4>3. Verifichiamo che il piatto condiviso mantenga la stessa misura</h4>
    <p>Scegli un piatto: la sua osservabile compare invariata nei due percorsi. Non possiamo cambiarla in un percorso per aggiustare una regola, perché non sarebbe più la stessa istruzione del piatto.</p>
    <div className="stelle-construction-choices" role="group" aria-label="Scegli il piatto da seguire nei due percorsi">{PIATTI_STELLA.map((_,p)=><button type="button" key={p} aria-pressed={piatto===p} onClick={()=>setPiatto(p)}>Piatto {p+1}</button>)}</div>
    <p aria-live="polite"><b>Piatto {piatto+1} → {OSSERVABILI_STELLA[piatto]}</b>: appartiene ai percorsi {PIATTI_STELLA[piatto][0]+1} e {PIATTI_STELLA[piatto][1]+1}.</p>
    <div className="stelle-table-wrap"><table>
      <caption>La stessa osservabile nei due percorsi del piatto selezionato</caption>
      <thead><tr><th scope="col">Percorso</th><th scope="col">Piatti e osservabili</th></tr></thead>
      <tbody>{PIATTI_STELLA[piatto].map(line=><tr key={line}><td>{line+1}</td><td>{PERCORSI_STELLA[line].map((p,i)=><span key={p}>{i>0 && " · "}{p===piatto?<mark>Piatto {p+1}: {OSSERVABILI_STELLA[p]}</mark>:<>Piatto {p+1}: {OSSERVABILI_STELLA[p]}</>}</span>)}</td></tr>)}</tbody>
    </table></div>
    <h4>4. Il quinto percorso è già fissato: funziona anche lui?</h4>
    <p>Il percorso 5 contiene i piatti 4, 7, 9 e 10, cioè proprio i quattro prodotti costruiti sopra:</p>
    <p className="stelle-concept-formula">XXX, XYY, YXY, YYX.</p>
    <p>Non siamo liberi di riassegnarli. Dobbiamo verificare due fatti: che siano compatibili e che il loro prodotto sia −I.</p>
    <h4>4a. Compatibilità: perché due incompatibilità si compensano</h4>
    <p>Sullo stesso qubit X e Y anticommutano: XY = −YX. Scambiare il loro ordine introduce un segno meno. Due delle quattro sigle del quinto percorso differiscono sempre in esattamente due posizioni. Scambiando l’ordine delle due osservabili complete, compaiono due segni meno, che si compensano: (−1) × (−1) = +1. Le osservabili complete commutano.</p>
    <p>Per esempio, XXX e XYY differiscono sul secondo e sul terzo qubit. Sul primo c’è X in entrambe: nessun segno. Sugli altri due ci sono X e Y: due segni meno. Quindi XXX · XYY = XYY · XXX.</p>
    <div className="stelle-table-wrap"><table>
      <caption>Verifica di tutte le sei coppie del quinto percorso</caption>
      <thead><tr><th scope="col">Coppia</th><th scope="col">Qubit con X/Y diversi</th><th scope="col">Segno dello scambio</th></tr></thead>
      <tbody>{["XXX","XYY","YXY","YYX"].flatMap((a,i,all)=>all.slice(i+1).map(b=><tr key={a+b}><td>{a} e {b}</td><td>{[...a].flatMap((v,k)=>v!==b[k]?[k+1]:[]).join(" e ")}</td><td>(−1)² = +1</td></tr>))}</tbody>
    </table></div>
    <h4>4b. Il prodotto: da dove viene il segno meno?</h4>
    <p>Per moltiplicare osservabili scritte come prodotti tensoriali, moltiplichiamo separatamente gli operatori sul primo, sul secondo e sul terzo qubit, mantenendone l’ordine:</p>
    <p className="stelle-concept-formula">(XXX)(XYY)(YXY)(YYX)<br/>= (XXYY) ⊗ (XYXY) ⊗ (XYYX).</p>
    <ul>
      <li><b>Primo qubit:</b> XXYY = (XX)(YY) = I.</li>
      <li><b>Secondo qubit:</b> XYXY = −XXYY = −I, perché scambiare la Y centrale con la X successiva introduce un segno meno.</li>
      <li><b>Terzo qubit:</b> XYYX = X(YY)X = XX = I.</li>
    </ul>
    <p className="stelle-concept-formula">I ⊗ (−I) ⊗ I = −I.</p>
    <p>Quindi il prodotto del quinto percorso è proprio −I, come richiede la regola dei rossi dispari. Non abbiamo aggiunto un meno a mano: il segno nasce dalle regole di moltiplicazione delle matrici di Pauli.</p>
    <h4>5. Perché +I e −I diventano rossi pari e dispari?</h4>
    <p>Ogni risultato di misura è +1 (bianco) oppure −1 (rosso). Poiché le quattro osservabili del percorso commutano, possiamo misurarle insieme e il prodotto dei risultati è l’autovalore del loro prodotto.</p>
    <ul><li>Se il prodotto delle osservabili è +I, il prodotto dei risultati è sempre +1: ci sono 0, 2 oppure 4 risultati −1, quindi rossi pari.</li><li>Se il prodotto è −I, il prodotto dei risultati è sempre −1: ci sono 1 oppure 3 risultati −1, quindi rossi dispari.</li></ul>
    <h4>Le tre condizioni sono ora verificate</h4>
    <ol><li><b>Una misura per piatto:</b> la stessa osservabile compare nei due percorsi che condividono il piatto.</li><li><b>Misure compatibili per percorso:</b> nei primi quattro percorsi per costruzione; nel quinto grazie alla compensazione dei due segni meno.</li><li><b>La parità richiesta:</b> prodotto +I nei primi quattro percorsi e −I nel quinto.</li></ol>
    <p>La tabella costruisce le misure con cui Bob rispetta tutte le parità. Per vincere il gioco a due sale serve anche l’accordo sul piatto comune: lo stato entangled e la misura trasposta di Alice garantiscono questa ulteriore proprietà.</p>
    <p>Perché allora non possiamo attribuire dieci colori fissi? Sarebbero numeri ordinari: moltiplicando i cinque vincoli, ogni numero comparirebbe due volte e darebbe +1, mentre il prodotto richiesto è −1. Le matrici di percorsi diversi non commutano tutte: non è lecito riordinarle liberamente per cancellarle come numeri.</p>
  </details>;
}
