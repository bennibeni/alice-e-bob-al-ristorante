"use client";

import { useEffect, useRef } from "react";

/** Esegue `passo` ogni `ritardo` ms finché `attivo` è vero. */
export function useIntervallo(passo, ritardo, attivo) {
  const ref = useRef(passo);
  useEffect(() => {
    ref.current = passo;
  }, [passo]);
  useEffect(() => {
    if (!attivo) return undefined;
    const id = setInterval(() => ref.current(), ritardo);
    return () => clearInterval(id);
  }, [ritardo, attivo]);
}

export function Pulsante({
  attivo = false,
  primario = false,
  className = "",
  ...props
}) {
  const stile = primario
    ? "border-rose-800 bg-rose-800 text-white hover:bg-rose-700"
    : attivo
      ? "border-zinc-800 bg-zinc-800 text-white dark:border-zinc-200 dark:bg-zinc-200 dark:text-zinc-900"
      : "border-zinc-400 hover:bg-black/5 dark:border-zinc-600 dark:hover:bg-white/10";
  return (
    <button
      type="button"
      className={`rounded border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${stile} ${className}`}
      {...props}
    />
  );
}

export function Schede({ etichetta, voci, valore, onCambia }) {
  return (
    <div role="group" aria-label={etichetta} className="flex flex-wrap gap-2">
      {voci.map((v) => (
        <Pulsante
          key={v.id}
          attivo={v.id === valore}
          aria-pressed={v.id === valore}
          onClick={() => onCambia(v.id)}
        >
          {v.testo}
        </Pulsante>
      ))}
    </div>
  );
}

export function Riquadro({ titolo, children, className = "" }) {
  return (
    <section
      className={`rounded-lg border border-zinc-300 bg-white/70 p-4 dark:border-zinc-700 dark:bg-zinc-900/40 ${className}`}
    >
      {titolo && (
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          {titolo}
        </h4>
      )}
      {children}
    </section>
  );
}

export function Dato({ etichetta, valore, enfasi = false, nota }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">
        {etichetta}
      </span>
      <span
        className={`font-mono tabular-nums ${enfasi ? "text-2xl font-semibold" : "text-lg"}`}
      >
        {valore}
      </span>
      {nota && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{nota}</span>
      )}
    </div>
  );
}

export function formatta(x, cifre = 2) {
  if (x === null || x === undefined || Number.isNaN(x)) return "—";
  return x.toLocaleString("it-IT", {
    minimumFractionDigits: cifre,
    maximumFractionDigits: cifre,
  });
}

export function percento(x, cifre = 1) {
  if (x === null || x === undefined || Number.isNaN(x)) return "—";
  return `${formatta(100 * x, cifre)}%`;
}

const VINO = { R: "#9f1239", B: "#eadb7a" };
export const NOME_COLORE = { R: "rosso", B: "bianco" };

/** Un calice o una bottiglia, rosso o bianco (o vuoto se colore è null). */
export function Vino({ formato = "calice", colore, dimensione = 44 }) {
  const fill = colore ? VINO[colore] : "transparent";
  const descr = `${formato} ${colore ? `di ${NOME_COLORE[colore]}` : "vuoto"}`;
  if (formato === "bottiglia") {
    return (
      <svg
        width={dimensione * 0.6}
        height={dimensione}
        viewBox="0 0 30 50"
        role="img"
        aria-label={descr}
      >
        <rect
          x="9"
          y="1"
          width="12"
          height="12"
          rx="2"
          fill={fill}
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 13 Q3 18 3 24 V46 Q3 49 6 49 H24 Q27 49 27 46 V24 Q27 18 21 13 Z"
          fill={fill}
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="7"
          y="28"
          width="16"
          height="11"
          rx="1.5"
          fill="#fffbeb"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );
  }
  return (
    <svg
      width={dimensione * 0.7}
      height={dimensione}
      viewBox="0 0 34 50"
      role="img"
      aria-label={descr}
    >
      <path
        d="M4 3 H30 Q31 22 17 26 Q3 22 4 3 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M5 11 H29 Q28 22 17 24.5 Q6 22 5 11 Z" fill={fill} />
      <line
        x1="17"
        y1="26"
        x2="17"
        y2="45"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <line
        x1="9"
        y1="47"
        x2="25"
        y2="47"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Barra orizzontale con una o più tacche di riferimento. Una tacca con
 * lato: "sinistra" scrive l'etichetta a sinistra della linea.
 */
export function Barra({
  valore,
  massimo = 1,
  tacche = [],
  colore = "bg-rose-700",
}) {
  const p = valore === null ? 0 : Math.max(0, Math.min(1, valore / massimo));
  return (
    <div className="relative h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800">
      <div
        className={`h-3 rounded ${colore}`}
        style={{ width: `${100 * p}%` }}
      />
      {tacche.map((t) => (
        <div
          key={t.etichetta}
          className="absolute -top-1 h-5 border-l-2 border-zinc-800 dark:border-zinc-200"
          style={{ left: `${(100 * t.valore) / massimo}%` }}
          title={t.etichetta}
        >
          <span
            className={`absolute top-5 whitespace-nowrap text-[10px] text-zinc-600 dark:text-zinc-400 ${t.lato === "sinistra" ? "right-1" : "left-1"}`}
          >
            {t.etichetta}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Commensale({ nome, colore, children }) {
  const c =
    colore === "alice"
      ? "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30"
      : "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/30";
  return (
    <div
      className={`flex min-w-36 flex-col items-center gap-1 rounded-lg border p-3 ${c}`}
    >
      <span className="font-semibold">{nome}</span>
      {children}
    </div>
  );
}
