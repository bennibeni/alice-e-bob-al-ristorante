"use client";

// R04 — Alice e Bob al ristorante: il teorema di Bell in un racconto a
// capitoli. Ogni capitolo ha illustrazione, testo, lezione e simulazione.
// Il capitolo aperto è nell'hash dell'URL (/R04#sfida).

import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CAPITOLI } from "./capitoli";
import { TeoremaBell } from "./teorema";

function indiceDaHash() {
  const id = window.location.hash.replace(/^#/, "");
  const i = CAPITOLI.findIndex((c) => c.id === id);
  return i >= 0 ? i : 0;
}

function Indice({ corrente, onScegli }) {
  return (
    <nav aria-label="Capitoli del racconto">
      <ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
        {CAPITOLI.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onScegli(i)}
              aria-current={i === corrente ? "step" : undefined}
              className={`flex w-full items-baseline gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                i === corrente
                  ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                  : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <span className="w-6 shrink-0 text-xs tabular-nums opacity-60">
                {i === 0 ? "P" : i === CAPITOLI.length - 1 ? "E" : i}
              </span>
              <span>{c.titolo}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const VOCI_GUIDA = [
  ["cosa", "Che cosa simula"],
  ["avvio", "Come si lancia"],
  ["leggere", "Dove guardare"],
  ["mostra", "Che cosa mostra"],
];

function Guida({ guida }) {
  return (
    <dl className="grid gap-x-4 gap-y-2 rounded-lg bg-sky-50 p-4 text-sm sm:grid-cols-[9rem_1fr] dark:bg-sky-950/30">
      {VOCI_GUIDA.map(([chiave, titolo]) => (
        <div key={chiave} className="contents">
          <dt className="font-semibold text-sky-900 dark:text-sky-200">
            {titolo}
          </dt>
          <dd className="mb-2 sm:mb-0">{guida[chiave]}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Page() {
  const [corrente, setCorrente] = useState(0);

  useEffect(() => {
    const sincronizza = () => setCorrente(indiceDaHash());
    sincronizza();
    window.addEventListener("hashchange", sincronizza);
    return () => window.removeEventListener("hashchange", sincronizza);
  }, []);

  const scegli = useCallback((i) => {
    setCorrente(i);
    window.history.replaceState(null, "", `#${CAPITOLI[i].id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const capitolo = CAPITOLI[corrente];
  const { Testo, Sim } = capitolo;
  const precedente = CAPITOLI[corrente - 1];
  const successivo = CAPITOLI[corrente + 1];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 text-zinc-900 dark:text-zinc-100">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Alice e Bob al ristorante</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Un racconto per scoprire il <TeoremaBell />.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <Indice corrente={corrente} onScegli={scegli} />
        </aside>

        <article className="min-w-0 space-y-5">
          <header className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {capitolo.numero}
            </p>
            <h2 className="text-2xl font-semibold">{capitolo.titolo}</h2>
            <p className="text-base italic text-zinc-600 dark:text-zinc-400">
              {capitolo.domanda}
            </p>
          </header>

          {/* eslint-disable-next-line @next/next/no-img-element -- SVG statico */}
          <img
            src={capitolo.immagine}
            alt={capitolo.alt}
            width={800}
            height={450}
            className="w-full max-w-3xl rounded-xl border border-zinc-200 dark:border-zinc-800"
          />

          <div className="max-w-3xl space-y-3 text-[15px]">
            <Testo />
          </div>

          <aside className="flex max-w-3xl gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-700 dark:bg-amber-950/40">
            <Lightbulb
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
            />
            <p>
              <span className="font-semibold">Che cosa abbiamo imparato. </span>
              {capitolo.lezione}
            </p>
          </aside>

          {Sim && (
            <section
              aria-label="Prova tu"
              className="space-y-3 rounded-xl border border-zinc-300 p-4 dark:border-zinc-700"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                Prova tu
              </h3>
              {capitolo.guida && <Guida guida={capitolo.guida} />}
              <Sim key={capitolo.id} />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {capitolo.avvertenzaSim || "Il programma simula le statistiche quantistiche; non realizza un esperimento fisico con due sistemi isolati."}
              </p>
            </section>
          )}

          <div className="flex justify-between gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => scegli(corrente - 1)}
              disabled={!precedente}
              className="inline-flex items-center gap-1 rounded border border-zinc-400 px-3 py-1.5 text-sm hover:bg-black/5 disabled:invisible dark:border-zinc-600 dark:hover:bg-white/10"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              {precedente ? precedente.titolo : ""}
            </button>
            <button
              type="button"
              onClick={() => scegli(corrente + 1)}
              disabled={!successivo}
              className="inline-flex items-center gap-1 rounded border border-zinc-400 px-3 py-1.5 text-sm hover:bg-black/5 disabled:invisible dark:border-zinc-600 dark:hover:bg-white/10"
            >
              {successivo ? successivo.titolo : ""}
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          {capitolo.riferimenti?.length > 0 && (
            <footer className="max-w-3xl border-t border-zinc-200 pt-4 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              <h3 className="mb-2 font-semibold uppercase tracking-wide">
                Riferimenti
              </h3>
              <ul className="space-y-1">
                {capitolo.riferimenti.map((r) => (
                  <li key={r.testo}>
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-zinc-400 underline-offset-2 hover:text-sky-700 dark:hover:text-sky-300"
                      >
                        {r.testo}
                      </a>
                    ) : (
                      r.testo
                    )}
                  </li>
                ))}
              </ul>
            </footer>
          )}
        </article>
      </div>
    </main>
  );
}
