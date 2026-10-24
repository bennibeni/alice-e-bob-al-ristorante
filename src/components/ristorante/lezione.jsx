"use client";

// Una lezione esterna (HTML statico in public/) aperta in una modale.
// Il file viene letto solo alla prima apertura, e il suo contenuto è
// inserito nella modale con gli stili dell'app (niente iframe). Il file è
// locale e fidato: viene dal repository, non dall'utente. Focus, Esc e
// ritorno del focus sono gestiti da React Aria.

import { BookOpen, X } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";

const STILE =
  "space-y-3 text-[15px] leading-relaxed " +
  "[&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-semibold " +
  "[&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold " +
  "[&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold " +
  "[&_p]:my-3 [&_a]:text-sky-700 [&_a]:underline dark:[&_a]:text-sky-300 " +
  "[&_ul]:ml-5 [&_ul]:list-disc [&_li]:my-1 " +
  "[&_img]:mx-auto [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded [&_img]:bg-white " +
  "[&_.formula]:overflow-x-auto [&_.formula]:py-3 " +
  "[&_.source]:border-b [&_.source]:border-zinc-200 [&_.source]:pb-3 [&_.source]:text-xs [&_.source]:text-zinc-500 " +
  "[&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2";

export function LezioneEsterna({ src, titolo, nota, lingua = "en" }) {
  const [html, setHtml] = useState(null);
  const [stato, setStato] = useState("chiusa");

  const carica = async () => {
    if (html || stato === "caricamento") return;
    setStato("caricamento");
    try {
      const risposta = await fetch(src);
      if (!risposta.ok) throw new Error(String(risposta.status));
      const testo = await risposta.text();
      const doc = new DOMParser().parseFromString(testo, "text/html");
      const corpo = doc.querySelector("main") ?? doc.body;
      corpo.querySelectorAll("script, style").forEach((n) => n.remove());
      // Il titolo è già nell'intestazione della modale.
      corpo.querySelector("h1")?.remove();
      setHtml(corpo.innerHTML);
      setStato("pronta");
    } catch {
      setStato("errore");
    }
  };

  return (
    <DialogTrigger
      onOpenChange={(aperta) => {
        if (aperta) carica();
      }}
    >
      <Button className="flex w-full items-center gap-2 rounded-lg border border-sky-200 bg-white/70 p-3 text-left text-sm outline-none hover:bg-sky-50 focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-sky-900 dark:bg-zinc-900/50 dark:hover:bg-sky-950/40">
        <BookOpen
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-sky-800 dark:text-sky-300"
        />
        <span className="font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">
          {titolo}
        </span>
        {nota && <span className="text-zinc-500">({nota})</span>}
      </Button>
      <ModalOverlay
        isDismissable
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      >
        <Modal className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-sky-200 bg-white text-left text-zinc-900 shadow-xl outline-none dark:border-sky-800 dark:bg-zinc-900 dark:text-zinc-100">
          <Dialog className="flex min-h-0 flex-col outline-none">
            {({ close }) => (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-5 dark:border-zinc-800">
                  <Heading slot="title" className="text-lg font-semibold">
                    {titolo}
                    {nota && (
                      <span className="block text-sm font-normal text-zinc-500">
                        {nota}
                      </span>
                    )}
                  </Heading>
                  <Button
                    onPress={close}
                    aria-label="Chiudi"
                    className="rounded p-1 text-zinc-500 outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-white/10"
                  >
                    <X aria-hidden="true" className="h-5 w-5" />
                  </Button>
                </div>
                <div className="min-h-0 overflow-y-auto p-5">
                  {stato === "caricamento" && (
                    <p className="text-sm text-zinc-500">Caricamento…</p>
                  )}
                  {stato === "errore" && (
                    <p className="text-sm text-rose-700 dark:text-rose-400">
                      Non è stato possibile caricare la lezione.
                    </p>
                  )}
                  {html && (
                    <div
                      lang={lingua}
                      className={STILE}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  )}
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
