"use client";

// Il problema di un capitolo: lo scenario (solo fatti osservabili) e i tre
// fatti del registro, se servono; l'indagine (l'ipotesi degli accordi), la
// domanda e, a scomparsa, la soluzione in breve e l'eventuale parallelo
// con la fisica.

function Voce({ titolo, children }) {
  return (
    <section className="space-y-2">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-900 dark:text-emerald-200">
        {titolo}
      </h4>
      {children}
    </section>
  );
}

/**
 * @param {{
 *   titolo: string,
 *   scenario?: import("react").ReactNode,
 *   introFatti?: import("react").ReactNode,
 *   fatti?: { titolo: string, testo: import("react").ReactNode }[],
 *   titoloIndagine?: string,
 *   indagine: import("react").ReactNode,
 *   domanda: import("react").ReactNode,
 *   soluzione: import("react").ReactNode,
 *   parallelo?: import("react").ReactNode,
 * }} props
 */
export function Problema({
  titolo,
  scenario,
  introFatti,
  fatti,
  titoloIndagine = "L'indagine",
  indagine,
  domanda,
  soluzione,
  parallelo,
}) {
  return (
    <div className="space-y-4 rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
      <h3 className="text-base font-semibold">{titolo}</h3>
      {scenario && <Voce titolo="Lo scenario">{scenario}</Voce>}
      {fatti && (
        <Voce titolo="I tre fatti">
          <p className="leading-relaxed">{introFatti}</p>
          <ol className="ml-5 list-decimal space-y-1.5">
            {fatti.map((f) => (
              <li key={f.titolo} className="leading-relaxed">
                <strong>{f.titolo}</strong> {f.testo}
              </li>
            ))}
          </ol>
        </Voce>
      )}
      <Voce titolo={titoloIndagine}>{indagine}</Voce>
      <Voce titolo="La domanda">
        <p className="leading-relaxed font-medium">{domanda}</p>
      </Voce>
      <details className="group rounded-lg border border-emerald-200 bg-white/70 p-3 dark:border-emerald-900 dark:bg-zinc-900/50">
        <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-emerald-900 dark:text-emerald-200">
          La soluzione, in breve{" "}
          <span className="font-normal normal-case tracking-normal text-zinc-500 group-open:hidden">
            (prova prima a rispondere)
          </span>
        </summary>
        <div className="mt-3 space-y-3">{soluzione}</div>
      </details>
      {parallelo && (
        <details className="group rounded-lg border border-sky-200 bg-white/70 p-3 dark:border-sky-900 dark:bg-zinc-900/50">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">
            Il parallelo con la fisica{" "}
            <span className="font-normal normal-case tracking-normal text-zinc-500 group-open:hidden">
              (un aiuto per capire la soluzione)
            </span>
          </summary>
          <div className="mt-3 space-y-3">{parallelo}</div>
        </details>
      )}
    </div>
  );
}
