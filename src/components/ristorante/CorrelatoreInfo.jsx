"use client";

import { Info, X } from "lucide-react";
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from "react-aria-components";

export function CorrelatoreInfo() {
  return <DialogTrigger>
    <Button aria-label="Che cos’è un correlatore?" className="ml-1 inline-flex rounded-full align-middle text-sky-700 outline-none hover:text-sky-900 focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-300">
      <Info aria-hidden="true" className="h-4 w-4" />
    </Button>
    <ModalOverlay isDismissable className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Modal className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-sky-200 bg-white p-6 text-left text-sm text-zinc-900 shadow-xl outline-none dark:border-sky-800 dark:bg-zinc-900 dark:text-zinc-100">
        <Dialog className="outline-none">{({ close }) => <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Heading slot="title" className="text-xl font-semibold">Che cos’è un correlatore?</Heading>
            <Button onPress={close} aria-label="Chiudi spiegazione" className="rounded p-2 hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-white/10"><X aria-hidden="true" className="h-5 w-5" /></Button>
          </div>
          <p>Un <strong>correlatore</strong> è una quantità che riassume come si presentano insieme due risultati osservati nella stessa prova. Per calcolarlo bisogna precisare quali numeri rappresentano i risultati e come vengono combinati.</p>
          <p>In questo racconto ciascun risultato può valere <strong>+1 oppure −1</strong>. Il correlatore E è la media del loro prodotto: <strong>E = media di X × Y</strong>.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong>E = +1:</strong> i due risultati hanno sempre lo stesso segno.</li>
            <li><strong>E = −1:</strong> hanno sempre segni opposti.</li>
            <li><strong>E = 0:</strong> le coppie con segni uguali e quelle con segni opposti sono altrettanto frequenti.</li>
          </ul>
          <p>I valori intermedi descrivono il bilancio fra i due casi. Se i segni coincidono nel 70% delle prove e sono opposti nel 30%, E = 0,7 − 0,3 = <strong>0,4</strong>. In questa codifica E è sempre compreso fra −1 e +1.</p>
          <p><strong>Il segno dipende dalle etichette:</strong> scambiare +1 e −1 per una delle due grandezze inverte il segno di E. Positivo non significa migliore e negativo non significa peggiore.</p>
          <p>Un correlatore descrive un’associazione, non dimostra che un risultato causi l’altro. Inoltre E = 0 non garantisce che i risultati siano indipendenti. Questa media del prodotto è il correlatore usato qui; non va confusa con il coefficiente di correlazione di Pearson, che sottrae le medie e normalizza le variazioni.</p>
          <Button onPress={close} className="rounded border border-zinc-400 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">Chiudi</Button>
        </div>}</Dialog>
      </Modal>
    </ModalOverlay>
  </DialogTrigger>;
}
