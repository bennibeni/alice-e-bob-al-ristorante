"use client";

import { Info, X } from "lucide-react";
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from "react-aria-components";

const contenuti = {
  dimensione: {
    titolo: "Che cosa significa dimensione locale?",
    testo: <>
      <p>La dimensione locale è il numero di stati di base necessari per descrivere il sistema quantistico di un singolo giocatore. “Locale” significa relativo a una sola sala, non all’intero sistema condiviso.</p>
      <ul>
        <li>Un qubit ha dimensione 2: |0⟩ e |1⟩.</li>
        <li>Due qubit hanno dimensione 2 × 2 = 4.</li>
        <li>Tre qubit hanno dimensione 2 × 2 × 2 = 8: |000⟩, |001⟩, …, |111⟩.</li>
      </ul>
      <p>Nel pentagramma Alice possiede tre qubit e Bob altri tre. La dimensione locale è quindi <b>8 per ciascuno</b>; il sistema complessivo ha dimensione <b>8 × 8 = 64</b>.</p>
      <p>Le tre coppie di Bell formano uno stato massimamente entangled tra questi due sistemi: nessuno dei due, preso da solo, ha uno stato puro. Le otto configurazioni di base locali hanno uguale probabilità se misurate nella base di riferimento.</p>
      <p>Non sono dimensioni dello spazio fisico né otto possibili colori del vino. Ogni osservabile del gioco continua a dare soltanto +1 oppure −1.</p>
    </>,
  },
  trasposta: {
    titolo: "Che cos’è la trasposta dell’osservabile?",
    testo: <>
      <p>Un’osservabile è rappresentata da una matrice. La sua <b>trasposta</b>, indicata con Oᵀ, si ottiene scambiando righe e colonne, nella base di riferimento scelta.</p>
      <div className="stelle-concept-matrices"><pre>O = [a  b]{"\n"}    [c  d]</pre><pre>Oᵀ = [a  c]{"\n"}     [b  d]</pre></div>
      <p>Trasporre non significa cambiare il segno di tutti gli elementi e non include il coniugio complesso. Per esempio, Xᵀ = X e Yᵀ = −Y: per Y, la misura trasposta equivale a scambiare le etichette +1 e −1 della misura Y.</p>
      <h3>Perché Alice usa la trasposta?</h3>
      <p>I due giocatori condividono tre coppie di Bell, espresse nella stessa base di riferimento. In questo stato, se Bob misura O e Alice misura Oᵀ sul piatto comune, i due risultati coincidono sempre. È la relazione che permette di trasformare il pentagramma di osservabili in un gioco a due sale.</p>
      <p>Alice non deve conoscere il percorso di Bob o il suo risultato: la misura trasposta è già stabilita per ciascun piatto. Bob sceglie le misure del percorso; Alice sceglie quella del proprio piatto. Non si scambiano informazioni.</p>
      <details><summary>La relazione matematica</summary>
        <p>Per |Φ₈⟩ = (1/√8) ∑ⱼ₌₀⁷ |j⟩ₐ ⊗ |j⟩ᵦ vale:</p>
        <p className="stelle-concept-formula">(Oᵀ ⊗ I)|Φ₈⟩ = (I ⊗ O)|Φ₈⟩.</p>
        <p>Se O è un’osservabile del gioco, con O² = I, allora ⟨Oᵀ ⊗ O⟩ = 1: i risultati ±1 sono perfettamente correlati. La regola dipende dalla scelta dello stato condiviso e della base; non vale per uno stato entangled arbitrario senza adattare le misure.</p>
      </details>
    </>,
  },
  qubit: {
    titolo: "Che cos’è un qubit?",
    testo: <>
      <p>Un qubit è un sistema quantistico con due stati di riferimento, chiamati |0⟩ e |1⟩. Può essere realizzato, per esempio, con due stati di spin di una particella o con due polarizzazioni di un fotone.</p>
      <p>Un bit classico vale 0 oppure 1. Lo stato di un qubit può invece essere una sovrapposizione:</p>
      <p className="stelle-concept-formula">|ψ⟩ = α|0⟩ + β|1⟩, con |α|² + |β|² = 1.</p>
      <p>α e β sono ampiezze, in generale complesse. Misurando nella base di riferimento otteniamo 0 con probabilità |α|² e 1 con probabilità |β|². Una misura fornisce un risultato, non entrambi; scegliendo un’altra base cambiano le probabilità.</p>
      <h3>Che cosa significa un sistema di tre qubit?</h3>
      <p>È il sistema composto da tre qubit, con otto stati di riferimento: |000⟩, |001⟩, fino a |111⟩. Il suo stato può coinvolgere più di questi stati e può essere entangled: in quel caso non si descrive assegnando semplicemente uno stato indipendente a ciascun qubit.</p>
      <p>Nel pentagramma Alice possiede tre qubit e Bob altri tre, collegati da tre coppie di Bell. Le dieci misure rappresentate dai piatti agiscono su questi stessi sistemi locali: non occorre un qubit diverso per ogni piatto.</p>
    </>,
  },
  pauli: {
    titolo: "Identità e matrici di Pauli",
    testo: <>
      <p>Le matrici sono strumenti matematici per descrivere stati, trasformazioni e osservabili quantistiche. Per un qubit, l’identità I e le matrici di Pauli X, Y e Z sono matrici 2 × 2.</p>
      <div className="stelle-concept-matrices"><pre aria-label="Identità: righe uno zero, zero uno">I = [1  0]{"\n"}    [0  1]</pre><pre aria-label="Pauli X: righe zero uno, uno zero">X = [0  1]{"\n"}    [1  0]</pre><pre aria-label="Pauli Y: righe zero meno i, i zero">Y = [0 −i]{"\n"}    [i  0]</pre><pre aria-label="Pauli Z: righe uno zero, zero meno uno">Z = [1  0]{"\n"}    [0 −1]</pre></div>
      <p>Qui i è l’unità immaginaria: i² = −1.</p>
      <ul>
        <li><b>I, identità:</b> lascia invariato lo stato. Come osservabile ha sempre risultato +1; in una sigla come XII indica che quel qubit non contribuisce al risultato e non richiede una misura.</li>
        <li><b>X, Y e Z:</b> descrivono tre diverse osservabili, ciascuna con risultati +1 oppure −1. Per uno spin 1/2 corrispondono a tre direzioni ortogonali di misura.</li>
      </ul>
      <p>Nel pentagramma compaiono I, X e Y. Misure X e Y sullo stesso qubit non sono compatibili: il loro ordine conta. Per esempio XY = iZ, mentre YX = −iZ. Le osservabili complete di ciascun percorso, invece, commutano fra loro.</p>
      <p>Le stesse matrici possono anche essere usate per descrivere porte quantistiche. Qui le impieghiamo come osservabili: scegliamo che cosa misurare.</p>
    </>,
  },
  tensore: {
    titolo: "Che cos’è il prodotto tensoriale?",
    testo: <>
      <p>Il prodotto tensoriale, indicato con ⊗, è l’operazione che combina la descrizione di sistemi quantistici distinti. Qui serve a indicare quale operatore agisce su ciascuno dei tre qubit.</p>
      <p className="stelle-concept-formula">XII = X ⊗ I ⊗ I</p>
      <p>La prima lettera riguarda il primo qubit, la seconda il secondo e la terza il terzo. XII significa misurare X sul primo qubit, senza misurare gli altri due.</p>
      <p className="stelle-concept-formula">XYY = X ⊗ Y ⊗ Y</p>
      <p>XYY è un’osservabile congiunta: si può misurare X sul primo qubit e Y sugli altri due, poi moltiplicare i tre risultati. Il risultato del piatto è un solo segno, +1 oppure −1, quindi un solo colore del vino.</p>
      <p>Tre matrici 2 × 2, combinate con ⊗, danno una matrice 8 × 8, adatta allo spazio degli stati di tre qubit.</p>
      <h3>Due prodotti diversi nella tabella</h3>
      <p><b>Dentro una sigla</b>, come XYY, c’è un prodotto tensoriale tra operatori su qubit diversi. <b>Nella colonna “Prodotto”</b> moltiplichiamo invece le quattro osservabili complete del percorso, tutte sullo stesso sistema di tre qubit. Il risultato è +I oppure −I, dove I è ora l’identità 8 × 8.</p>
      <p>Il prodotto tensoriale descrive anche stati composti. Uno stato entangled non può essere scritto come un unico prodotto tensoriale di stati dei singoli sottosistemi.</p>
    </>,
  },
};

export default function ConcettoQuantisticoInfo({ tipo, children }) {
  const contenuto = contenuti[tipo];
  return <span>
    {children}
    <DialogTrigger>
      <Button className="stelle-observable-info" aria-label={`Informazioni: ${contenuto.titolo}`}><Info size={18} aria-hidden="true" /></Button>
      <ModalOverlay className="stelle-observable-overlay" isDismissable>
        <Modal className="stelle-observable-modal">
          <Dialog className="stelle-observable-dialog">
            <div className="stelle-observable-heading">
              <Heading slot="title">{contenuto.titolo}</Heading>
              <Button slot="close" className="stelle-observable-close" aria-label="Chiudi spiegazione"><X size={22} aria-hidden="true" /></Button>
            </div>
            {contenuto.testo}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  </span>;
}
