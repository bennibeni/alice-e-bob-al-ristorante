"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";

const codice = `type Piano = {
  alice: [number, number]; // [calice, bottiglia]
  bob: [number, number];
};

type Risultato = {
  probabilita: number;
  piano: Piano;
};

function cercaPianoMigliore(
  M: readonly (readonly number[])[],
  regole: readonly number[]
): Risultato {
  let probabilita = -1;
  let piano: Piano | null = null;

  for (const aliceCalice of regole)
    for (const aliceBottiglia of regole)
      for (const bobCalice of regole)
        for (const bobBottiglia of regole) {
          const p = (
            M[aliceCalice]![bobCalice]! +
            M[aliceCalice]![bobBottiglia]! +
            M[aliceBottiglia]![bobCalice]! +
            (1 - M[aliceBottiglia]![bobBottiglia]!)
          ) / 4;

          if (p > probabilita + 1e-12) {
            probabilita = p;
            piano = {
              alice: [aliceCalice, aliceBottiglia],
              bob: [bobCalice, bobBottiglia]
            };
          }
        }

  if (piano === null) {
    throw new Error("Deve essere disponibile almeno una regola.");
  }

  return { probabilita, piano };
}`;

export function CodiceCalcolatrice() {
  const dialog = useRef(null);
  const titolo = useId();
  const [montato, setMontato] = useState(false);

  useEffect(() => {
    setMontato(true);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="Mostra il codice TypeScript della calcolatrice"
        aria-haspopup="dialog"
        title="Il codice della calcolatrice"
        onClick={() => dialog.current?.showModal()}
        className="mx-1 inline-flex rounded-full p-1 align-middle text-amber-700 hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 dark:text-amber-400 dark:hover:bg-amber-950"
      >
        <Info size={19} aria-hidden="true" />
      </button>
      {montato && createPortal(<dialog
        ref={dialog}
        aria-labelledby={titolo}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-900 shadow-2xl backdrop:bg-black/60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <div className="p-5 sm:p-7">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h2 id={titolo} className="text-xl font-bold">Il codice della calcolatrice</h2>
            <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Chiudi" className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <X size={22} aria-hidden="true" />
            </button>
          </div>
          <p className="mb-4 text-sm leading-relaxed">
            Il cuore della ricerca, in TypeScript. La matrice M contiene la probabilità che i colori coincidano per ogni coppia di regole, tenendo conto dell’assegnazione dei tavoli. Gli indici delle regole devono essere validi per M. Con due bottiglie servono colori diversi: per questo compare 1 − M.
          </p>
          <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-100 sm:text-sm"><code>{codice}</code></pre>
          <p className="mt-4 text-sm leading-relaxed">Con 16 regole disponibili, la ricerca confronta 65.536 piani e conserva il primo con la probabilità migliore nella famiglia esplorata.</p>
        </div>
      </dialog>, document.body)}
    </>
  );
}
