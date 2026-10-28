"use client";

import { Info, X } from "lucide-react";
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from "react-aria-components";

export default function OsservabileInfo() {
  return <span className="stelle-observable-term">
    osservabile
    <DialogTrigger>
      <Button className="stelle-observable-info" aria-label="Che cos’è un’osservabile quantistica?"><Info size={18} aria-hidden="true" /></Button>
      <ModalOverlay className="stelle-observable-overlay" isDismissable>
        <Modal className="stelle-observable-modal">
          <Dialog className="stelle-observable-dialog">
            <div className="stelle-observable-heading">
              <Heading slot="title">Che cos’è un’osservabile?</Heading>
              <Button slot="close" className="stelle-observable-close" aria-label="Chiudi spiegazione"><X size={22} aria-hidden="true" /></Button>
            </div>
            <p>In fisica quantistica un’osservabile è l’oggetto matematico che rappresenta una grandezza misurabile e specifica i suoi possibili risultati. Non è il risultato stesso: è ciò che scegliamo di misurare.</p>
            <p>Nel nostro gioco ogni piatto è l’etichetta di una misura. Le osservabili usate hanno soltanto due risultati possibili: <b>+1, vino bianco</b> (verde nelle icone), oppure <b>−1, vino rosso</b>.</p>
            <h3>Come si leggono le tre lettere?</h3>
            <p>Alice ha un sistema di tre qubit e Bob un altro sistema di tre qubit. Ogni lettera si riferisce a uno dei tre qubit locali. X e Y sono due diverse osservabili di Pauli; I è l’identità, che non richiede una misura su quel qubit.</p>
            <ul>
              <li><b>XII:</b> misurare X sul primo qubit, senza misurare gli altri due.</li>
              <li><b>IXI:</b> misurare X sul secondo qubit.</li>
              <li><b>XXX:</b> è un’osservabile congiunta. Per misurarla si possono misurare le tre X e moltiplicare i risultati: il prodotto è ancora +1 oppure −1.</li>
            </ul>
            <p><b>Dieci piatti significano dieci possibili misure sugli stessi tre qubit locali, non dieci qubit.</b></p>
            <h3>Perché raggrupparle in percorsi?</h3>
            <p>Le quattro osservabili di un percorso sono compatibili: in termini matematici, commutano. Bob può misurarle insieme per ottenere quattro vini. Questo non implica che tutte le dieci osservabili siano compatibili fra loro.</p>
            <p>Per esempio, misurare X e misurare Y sullo stesso qubit sono scelte incompatibili. Non possiamo trattare tutti i risultati come dieci vini già scritti, indipendenti dalla misura scelta.</p>
            <details><summary>Definizione matematica</summary>
              <p>Un’osservabile è rappresentata da un operatore autoaggiunto O. I suoi autovalori sono i possibili risultati della misura. Per le osservabili del gioco vale O² = I e gli autovalori sono +1 e −1. Per esempio, XII significa X ⊗ I ⊗ I, dove ⊗ indica il prodotto tensoriale.</p>
            </details>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  </span>;
}
