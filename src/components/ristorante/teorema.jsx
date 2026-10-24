"use client";

// «teorema di Bell» scritto per esteso, seguito da un'icona che apre una
// modale con l'enunciato in termini di ristorante e in termini di fisica.
// Focus, Esc e ritorno del focus sono gestiti da React Aria.

import Image from "next/image";
import { Info, X } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";

function Voce({ titolo, children }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-900 dark:text-violet-200">
        {titolo}
      </h3>
      {children}
    </section>
  );
}

export function TeoremaBell({ testo = "teorema di Bell" }) {
  return (
    <span className="whitespace-nowrap">
      {testo}
      <DialogTrigger>
        <Button
          aria-label="Che cosa dice il teorema di Bell"
          className="ml-1 inline-flex translate-y-[-1px] items-center rounded-full align-middle text-violet-700 outline-none hover:text-violet-900 focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-violet-300 dark:hover:text-violet-100"
        >
          <Info aria-hidden="true" className="h-4 w-4" />
        </Button>
        <ModalOverlay
          isDismissable
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <Modal className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-violet-200 bg-white p-6 text-left text-[15px] whitespace-normal text-zinc-900 shadow-xl outline-none dark:border-violet-800 dark:bg-zinc-900 dark:text-zinc-100">
            <Dialog className="outline-none">
              {({ close }) => (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <figure className="shrink-0 text-center">
                        <Image
                          src="/r04/bell-1982.jpg"
                          alt="John Bell nel 1982"
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-full object-cover grayscale"
                        />
                        <figcaption className="mt-1 text-[10px] leading-tight text-zinc-500">
                          Bell, 1982
                          <span className="block">foto CERN</span>
                        </figcaption>
                      </figure>
                      <Heading slot="title" className="text-lg font-semibold">
                        Il teorema di Bell
                        <span className="block text-sm font-normal text-zinc-500">
                          John Bell, 1964
                        </span>
                      </Heading>
                    </div>
                    <Button
                      onPress={close}
                      aria-label="Chiudi"
                      className="rounded p-1 text-zinc-500 outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:bg-white/10"
                    >
                      <X aria-hidden="true" className="h-5 w-5" />
                    </Button>
                  </div>
                  <Voce titolo="In termini di ristorante">
                    <p className="leading-relaxed">
                      Nessuna strategia decisa prima di separarsi può riprodurre
                      i risultati del ristorante stregato. La strategia può
                      contenere regole, schede e sorteggi comuni, ma durante la
                      cena ognuno usa solo quello che sa già e la portata scelta
                      dal suo cameriere.
                    </p>
                  </Voce>
                  <Voce titolo="In termini di fisica">
                    <p className="leading-relaxed">
                      Nessuna teoria che rispetti insieme queste tre ipotesi può
                      riprodurre tutte le previsioni della meccanica
                      quantistica:
                    </p>
                    <ul className="ml-5 list-disc space-y-1 leading-relaxed">
                      <li>
                        <strong>località</strong>: ciò che accade in un
                        laboratorio non influenza l'altro (le due sale);
                      </li>
                      <li>
                        <strong>variabili nascoste</strong>: i risultati sono
                        già scritti prima della misura (le schede);
                      </li>
                      <li>
                        <strong>libertà di scelta</strong>: le misure si
                        scelgono indipendentemente da come è stata preparata la
                        coppia (i camerieri indipendenti dagli accordi).
                      </li>
                    </ul>
                    <p className="leading-relaxed">
                      Gli esperimenti, da Aspect (1982) ai test senza scappatoie
                      del 2015, danno ragione alla meccanica quantistica: almeno
                      una delle tre ipotesi va abbandonata.
                    </p>
                  </Voce>
                </div>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </span>
  );
}
