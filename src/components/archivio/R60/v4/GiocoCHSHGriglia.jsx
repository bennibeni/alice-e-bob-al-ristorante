"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MODEL_COORDS,
  MODEL_EXCLUDED_INDEX,
} from "../v1/gemelliNumerici37Config";
import {
  MODEL_VALUES,
  MODI as MODI_ORIGINALI,
  P_QUANTISTICA,
  QUESTIONS,
  SISTEMI as SISTEMI_ORIGINALI,
  creaRng,
  migliorStrategia,
  round,
  vittoriaClassicaEsatta,
} from "./giocoGriglia";

// Restaurant vocabulary only: strategy IDs and probability calculations are unchanged.
const MODI = MODI_ORIGINALI.map(m=>({...m,testo:({firma:'regola sul numero',inversa:'regola invertita',si:'sempre rosso',no:'sempre bianco'})[m.id]}));
const SISTEMI = SISTEMI_ORIGINALI.map(s=>({...s,nota:({casuale:'Bob riceve uno qualsiasi degli altri 35 tavoli selezionabili.',collineare:'Bob riceve un tavolo allineato con quello di Alice.',gemello:'Bob riceve un tavolo con lo stesso numero di quello di Alice.'})[s.id]}));

const pct = (v, d = 1) => `${(v * 100).toFixed(d).replace(".", ",")}%`;
const MAX_PUNTI = 300;
const MAX_LOG = 8;

const PRESET = [
  {
    id: "firmeD1D2",
    testo: "Regole D1 / D2",
    s: {
      alice: [
        { d: 0, modo: "firma" },
        { d: 1, modo: "firma" },
      ],
      bob: [
        { d: 0, modo: "firma" },
        { d: 1, modo: "firma" },
      ],
    },
  },
  {
    id: "sempreSi",
    testo: "Sempre rosso (75%)",
    s: {
      alice: [
        { d: 0, modo: "si" },
        { d: 0, modo: "si" },
      ],
      bob: [
        { d: 0, modo: "si" },
        { d: 0, modo: "si" },
      ],
    },
  },
];

const VELOCITA = [
  { id: "lenta", testo: "Lenta", ms: 600, perTick: 1 },
  { id: "media", testo: "Media", ms: 100, perTick: 2 },
  { id: "veloce", testo: "Veloce", ms: 40, perTick: 50 },
];

function statoVuoto() {
  return { n: 0, vc: 0, vq: 0, serieC: [], serieQ: [], log: [] };
}

function aggiungi(serie, n, p) {
  let s = [...serie, [n, p]];
  if (s.length > MAX_PUNTI)
    s = s.filter((_, k) => k % 2 === 0 || k === s.length - 1);
  return s;
}

export default function GiocoCHSHGriglia() {
  const [sistema, setSistema] = useState("collineare");
  const [strategia, setStrategia] = useState(PRESET[0].s);
  const [stato, setStato] = useState(statoVuoto);
  const [inCorso, setInCorso] = useState(false);
  const [velocita, setVelocita] = useState("media");
  const rng = useRef(creaRng(37));

  const pClassica = useMemo(
    () => vittoriaClassicaEsatta(strategia, sistema),
    [strategia, sistema],
  );
  const migliori = useMemo(
    () =>
      SISTEMI.map((s) => ({
        ...s,
        firme: migliorStrategia(s.id, true),
        tutte: migliorStrategia(s.id, false),
      })),
    [],
  );

  const azzera = useCallback(() => {
    rng.current = creaRng(Math.floor(Math.random() * 1e9));
    setStato(statoVuoto());
  }, []);

  // Cambiare sistema o strategia rende i conteggi non confrontabili.
  const conAzzeramento = (imposta) => (valore) => {
    imposta(valore);
    azzera();
    setInCorso(false);
  };
  const cambiaSistema = conAzzeramento(setSistema);
  const cambiaStrategia = conAzzeramento(setStrategia);

  const gioca = useCallback(
    (quanti) => {
      const rr = [];
      for (let k = 0; k < quanti; k++)
        rr.push(round(rng.current, strategia, sistema));
      setStato((prev) => {
        let { n, vc, vq, serieC, serieQ } = prev;
        const passo = Math.max(1, Math.floor(quanti / 150));
        rr.forEach((r, k) => {
          n += 1;
          vc += r.classica.vinto ? 1 : 0;
          vq += r.quantistica.vinto ? 1 : 0;
          if ((k + 1) % passo === 0 || k === rr.length - 1) {
            serieC = aggiungi(serieC, n, vc / n);
            serieQ = aggiungi(serieQ, n, vq / n);
          }
        });
        return {
          n,
          vc,
          vq,
          serieC,
          serieQ,
          log: [...rr.slice(-MAX_LOG).reverse(), ...prev.log].slice(0, MAX_LOG),
        };
      });
    },
    [strategia, sistema],
  );

  const giocaRef = useRef(gioca);
  useEffect(() => {
    giocaRef.current = gioca;
  }, [gioca]);
  useEffect(() => {
    if (!inCorso) return undefined;
    const v = VELOCITA.find((s) => s.id === velocita);
    const id = setInterval(() => giocaRef.current(v.perTick), v.ms);
    return () => clearInterval(id);
  }, [inCorso, velocita]);

  const ultimo = stato.log[0];

  return (
    <div className="space-y-6 text-sm leading-relaxed text-gray-900 dark:text-gray-100">
      <Box titolo="La sfida nella sala">
        <p>A ogni cena:</p>
        <ol className="ml-6 mt-2 list-decimal space-y-1">
          <li>
            Il maître assegna ad Alice un tavolo a caso e a Bob un secondo
            tavolo secondo il sistema scelto.
          </li>
          <li>
            I camerieri scelgono indipendentemente per ciascuno il{" "}
            <strong>calice</strong> o la <strong>bottiglia</strong>. Ognuno
            conosce solo il proprio numero e il proprio formato.
          </li>
          <li>Ognuno ordina rosso o bianco.</li>
          <li>
            La cena è offerta se i colori <strong>coincidono</strong>, tranne
            quando entrambi ricevono una bottiglia: lì devono essere{" "}
            <strong>diversi</strong>.
          </li>
        </ol>
        <p className="mt-2">
          Nel ristorante normale, per ogni formato si può applicare una
          regola al numero del tavolo oppure scegliere un colore fisso. Una
          regola vera dà rosso, una falsa dà bianco; la regola invertita
          scambia i colori. Il riferimento stregato non usa i numeri:
          il programma ne simula le correlazioni quantistiche.
        </p>
      </Box>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <Box titolo="Il piano del ristorante normale">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Sistema:</span>
            {SISTEMI.map((s) => (
              <Btn
                key={s.id}
                piccolo
                attivo={sistema === s.id}
                onClick={() => cambiaSistema(s.id)}
              >
                {s.testo}
              </Btn>
            ))}
          </div>
          <p className="mb-3 text-xs text-gray-500">
            {SISTEMI.find((s) => s.id === sistema).nota}
          </p>
          <EditorStrategia strategia={strategia} onChange={cambiaStrategia} />
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESET.map((p) => (
              <Btn key={p.id} piccolo onClick={() => cambiaStrategia(p.s)}>
                {p.testo}
              </Btn>
            ))}
            <Btn
              piccolo
              onClick={() =>
                cambiaStrategia(migliorStrategia(sistema, true).strategia)
              }
            >
              Migliore con le sole regole sul numero
            </Btn>
          </div>
        </Box>
        <Box titolo="L'ultima cena">
          <Griglia ultimo={ultimo} />
        </Box>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Btn primario onClick={() => setInCorso((v) => !v)}>
          {inCorso ? "⏸ Pausa" : "▶ Avvia"}
        </Btn>
        <Btn onClick={() => gioca(1)} disabled={inCorso}>
          +1 cena
        </Btn>
        <Btn onClick={() => gioca(100)} disabled={inCorso}>
          +100
        </Btn>
        <Btn onClick={() => gioca(10000)} disabled={inCorso}>
          +10 000
        </Btn>
        <Btn
          onClick={() => {
            setInCorso(false);
            azzera();
          }}
        >
          ↺ Ricomincia
        </Btn>
        <label className="ml-2 flex items-center gap-2">
          Velocità
          <select
            value={velocita}
            onChange={(e) => setVelocita(e.target.value)}
            className="rounded border border-gray-400 bg-transparent px-2 py-1 dark:bg-gray-900"
          >
            {VELOCITA.map((v) => (
              <option key={v.id} value={v.id}>
                {v.testo}
              </option>
            ))}
          </select>
        </label>
        <span className="text-gray-500">
          Cene: {stato.n.toLocaleString("it-IT")}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Punteggio
          titolo="Ristorante normale (numeri e formati)"
          v={stato.vc}
          n={stato.n}
          teoria={pClassica}
          colore="#d97706"
        />
        <Punteggio
          titolo="Riferimento stregato (simulato)"
          v={stato.vq}
          n={stato.n}
          teoria={P_QUANTISTICA}
          colore="#7c3aed"
        />
      </div>

      <Box titolo="Percentuale di cene offerte nel tempo">
        <Grafico c={stato.serieC} q={stato.serieQ} />
      </Box>

      <Box titolo="Ultime cene">
        <Log log={stato.log} />
      </Box>

      <Box titolo="Il massimo per ogni sistema (ricerca su tutte le 65 536 strategie)">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="py-1">Sistema</th>
              <th>Solo regole sul numero</th>
              <th>Qualsiasi strategia classica</th>
              <th>Riferimento stregato</th>
            </tr>
          </thead>
          <tbody>
            {migliori.map((m) => (
              <tr
                key={m.id}
                className="border-t border-gray-200 dark:border-gray-800"
              >
                <td className="py-1">{m.testo}</td>
                <td className="tabular-nums">{pct(m.firme.p)}</td>
                <td className="tabular-nums">{pct(m.tutte.p)}</td>
                <td className="tabular-nums">{pct(P_QUANTISTICA)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">
          Valori esatti, calcolati su tutte le coppie di tavoli del sistema e
          sulle quattro coppie di formati.
        </p>
      </Box>

      <Dettagli titolo="Che cosa insegna la griglia">
        <p>
          I numeri dei due tavoli sono un&apos;informazione condivisa,
          preparata prima della scelta dei formati: per la fisica sono{" "}
          <strong>variabili nascoste locali</strong>. Con il sistema casuale
          sono quasi indipendenti e le sole regole sul numero arrivano a stento al 53%; con
          quello collineare la geometria della griglia li correla un po&apos; di
          più (55%).
        </p>
        <p className="mt-2">
          Il sistema <strong>gemello</strong> è il caso estremo: Bob riceve un
          tavolo con lo stesso numero di quello di Alice, cioè la correlazione più forte
          possibile. Eppure anche lì il massimo è il <strong>75%</strong>, lo
          stesso che si ottiene ordinando sempre rosso senza guardare i numeri. È
          il teorema CHSH: nessuna informazione condivisa in anticipo, per
          quanto ricca o ben correlata, supera il 75%.
        </p>
        <p className="mt-2">
          Il riferimento stregato non usa i numeri, eppure ha una probabilità
          di successo dell&apos;85,4%. Non è una regola sul numero migliore:
          è un tipo di correlazione che nessun accordo locale può imitare.
        </p>
      </Dettagli>

      <Dettagli titolo="Dalla percentuale al valore S">
        <p>
          Con quattro coppie di formati ugualmente probabili, la probabilità di
          vittoria P e il valore CHSH S sono legati da P = 1/2 + S/8, cioè S =
          8P − 4.
        </p>
        <ul className="ml-6 mt-2 list-disc space-y-1">
          <li>75% → S = 2, il limite classico.</li>
          <li>85,4% → S = 2√2 ≈ 2,83, il limite quantistico (Tsirelson).</li>
          <li>
            La strategia classica attuale ({pct(pClassica)}) → S ={" "}
            {(8 * pClassica - 4).toFixed(2).replace(".", ",")}.
          </li>
        </ul>
        <p className="mt-2">
          Il numero S riassume le correlazioni fra i colori per le quattro
          coppie di formati, come nel registro del maître del capitolo 3.
        </p>
      </Dettagli>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Box({ titolo, children }) {
  return (
    <section className="rounded-lg border border-gray-300 p-4 dark:border-gray-700">
      {titolo && <h2 className="mb-2 text-base font-semibold">{titolo}</h2>}
      {children}
    </section>
  );
}

function Dettagli({ titolo, children }) {
  return (
    <details className="rounded-lg border border-gray-300 bg-black/[0.02] p-4 dark:border-gray-700 dark:bg-white/[0.03]">
      <summary className="cursor-pointer font-semibold">{titolo}</summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function Btn({ children, onClick, primario, attivo, piccolo, disabled }) {
  const base = piccolo ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";
  const stile = primario
    ? "border-violet-700 bg-violet-700 text-white hover:bg-violet-800"
    : attivo
      ? "border-gray-800 bg-gray-800 text-white dark:border-gray-200 dark:bg-gray-200 dark:text-gray-900"
      : "border-gray-400 hover:bg-black/5 dark:hover:bg-white/10";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded border ${base} ${stile} disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function EditorStrategia({ strategia, onChange }) {
  const riga = (chi, k, etichetta) => {
    const r = strategia[chi][k];
    const cambia = (campo, valore) => {
      const nuovo = { alice: [...strategia.alice], bob: [...strategia.bob] };
      nuovo[chi][k] = { ...r, [campo]: valore };
      onChange(nuovo);
    };
    const fissa = r.modo === "si" || r.modo === "no";
    return (
      <tr key={`${chi}${k}`}>
        <td className="py-1 pr-3 text-xs">{etichetta}</td>
        <td className="pr-2">
          <select
            value={r.modo}
            onChange={(e) => cambia("modo", e.target.value)}
            className="rounded border border-gray-400 bg-transparent px-1 py-0.5 text-xs dark:bg-gray-900"
          >
            {MODI.map((m) => (
              <option key={m.id} value={m.id}>
                {m.testo}
              </option>
            ))}
          </select>
        </td>
        <td>
          <select
            value={r.d}
            disabled={fissa}
            onChange={(e) => cambia("d", Number(e.target.value))}
            className="rounded border border-gray-400 bg-transparent px-1 py-0.5 text-xs disabled:opacity-40 dark:bg-gray-900"
          >
            {QUESTIONS.map((q, i) => (
              <option key={q.id} value={i}>
                {q.id} · {q.label}
              </option>
            ))}
          </select>
        </td>
      </tr>
    );
  };
  return (
    <table>
      <tbody>
        {riga("alice", 0, "Alice, calice")}
        {riga("alice", 1, "Alice, bottiglia")}
        {riga("bob", 0, "Bob, calice")}
        {riga("bob", 1, "Bob, bottiglia")}
      </tbody>
    </table>
  );
}

function Punteggio({ titolo, v, n, teoria, colore }) {
  return (
    <div className="flex items-end justify-between rounded-lg border border-gray-300 p-4 dark:border-gray-700">
      <div>
        <div className="text-xs text-gray-500">{titolo}</div>
        <div
          className="text-3xl font-semibold tabular-nums"
          style={{ color: colore }}
        >
          {n ? pct(v / n) : "—"}
        </div>
        <div className="text-xs tabular-nums text-gray-500">
          {v.toLocaleString("it-IT")} cene offerte su {n.toLocaleString("it-IT")}
        </div>
      </div>
      <div className="text-right text-xs text-gray-500">
        valore esatto
        <div className="text-lg font-medium tabular-nums text-gray-700 dark:text-gray-300">
          {pct(teoria)}
        </div>
      </div>
    </div>
  );
}

function Griglia({ ultimo }) {
  const size = 17;
  const pos = (c) => ({
    x: size * Math.sqrt(3) * (c.q + c.r / 2),
    y: size * 1.5 * c.r,
  });
  const punti = MODEL_COORDS.map(pos);
  const minX = Math.min(...punti.map((p) => p.x)) - size;
  const minY = Math.min(...punti.map((p) => p.y)) - size;
  const W = Math.max(...punti.map((p) => p.x)) - minX + size;
  const H = Math.max(...punti.map((p) => p.y)) - minY + size;
  const esagono = (cx, cy) =>
    Array.from({ length: 6 }, (_, k) => {
      const a = (Math.PI / 180) * (60 * k - 30);
      return `${(cx + (size - 1) * Math.cos(a)).toFixed(1)},${(cy + (size - 1) * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
  return (
    <div className="w-64">
      <svg
        viewBox={`${minX} ${minY} ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Sala a nido d’ape con 37 tavoli"
      >
        {MODEL_COORDS.map((c, idx) => {
          const { x, y } = pos(c);
          const isA = ultimo && ultimo.i === idx;
          const isB = ultimo && ultimo.j === idx;
          let fill = "transparent";
          if (idx === MODEL_EXCLUDED_INDEX) fill = "rgba(127,127,127,0.25)";
          if (isA) fill = "#0e7490";
          if (isB) fill = "#be185d";
          return (
            <g key={idx}>
              <polygon
                points={esagono(x, y)}
                fill={fill}
                stroke="currentColor"
                strokeOpacity="0.35"
              />
              {idx !== MODEL_EXCLUDED_INDEX && (
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isA || isB ? "white" : "currentColor"}
                  fontWeight={isA || isB ? 700 : 400}
                >
                  {MODEL_VALUES[idx]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="mt-1 text-xs">
        <span className="text-cyan-700">■ Alice</span> ·{" "}
        <span className="text-pink-700">■ Bob</span>
        {ultimo ? ` · domande ${ultimo.x + 1} e ${ultimo.y + 1}` : ""}
      </p>
    </div>
  );
}

function Grafico({ c, q }) {
  const W = 640;
  const H = 200;
  const m = { l: 44, r: 12, t: 10, b: 20 };
  const nMax = Math.max(10, c.at(-1)?.[0] ?? 0);
  const yMin = 0.3;
  const yMax = 1;
  const sx = (n) => m.l + (n / nMax) * (W - m.l - m.r);
  const sy = (p) =>
    m.t +
    ((yMax - Math.min(yMax, Math.max(yMin, p))) / (yMax - yMin)) *
      (H - m.t - m.b);
  const linea = (s) =>
    s.map(([n, p]) => `${sx(n).toFixed(1)},${sy(p).toFixed(1)}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Andamento delle cene offerte"
    >
      {[0.3, 0.5, 0.7, 0.9].map((t) => (
        <g key={t}>
          <line
            x1={m.l}
            x2={W - m.r}
            y1={sy(t)}
            y2={sy(t)}
            stroke="currentColor"
            strokeOpacity="0.1"
          />
          <text
            x={m.l - 6}
            y={sy(t) + 4}
            textAnchor="end"
            fontSize="11"
            fill="currentColor"
            opacity="0.6"
          >
            {Math.round(t * 100)}%
          </text>
        </g>
      ))}
      <line
        x1={m.l}
        x2={W - m.r}
        y1={sy(0.75)}
        y2={sy(0.75)}
        stroke="#d97706"
        strokeDasharray="5 4"
      />
      <text
        x={W - m.r}
        y={sy(0.75) + 14}
        textAnchor="end"
        fontSize="11"
        fill="#d97706"
      >
        limite classico 75%
      </text>
      <line
        x1={m.l}
        x2={W - m.r}
        y1={sy(P_QUANTISTICA)}
        y2={sy(P_QUANTISTICA)}
        stroke="#7c3aed"
        strokeDasharray="5 4"
      />
      <text
        x={W - m.r}
        y={sy(P_QUANTISTICA) - 6}
        textAnchor="end"
        fontSize="11"
        fill="#7c3aed"
      >
        limite quantistico 85,4%
      </text>
      <polyline
        points={linea(c)}
        fill="none"
        stroke="#d97706"
        strokeWidth="2"
      />
      <polyline
        points={linea(q)}
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2"
      />
    </svg>
  );
}

function Log({ log }) {
  if (!log.length)
    return (
      <p className="text-gray-500">Premi Avvia o aggiungi qualche cena.</p>
    );
  const sn = (v) => (v ? "rosso" : "bianco");
  const esito = (r) => (
    <span
      className={
        r.vinto
          ? "text-green-700 dark:text-green-400"
          : "text-red-700 dark:text-red-400"
      }
    >
      {sn(r.a)} · {sn(r.b)} {r.vinto ? "✔" : "✘"}
    </span>
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th className="py-1">Numeri (Alice · Bob)</th>
            <th>Formati</th>
            <th>Normale</th>
            <th>Stregato</th>
          </tr>
        </thead>
        <tbody>
          {log.map((r, k) => (
            <tr
              key={k}
              className="border-t border-gray-200 dark:border-gray-800"
            >
              <td className="py-1 tabular-nums">
                {MODEL_VALUES[r.i]} · {MODEL_VALUES[r.j]}
              </td>
              <td>
                {r.x === 0 ? "calice" : "bottiglia"} · {r.y === 0 ? "calice" : "bottiglia"}{" "}
                {r.x & r.y ? "(devono differire)" : "(devono coincidere)"}
              </td>
              <td>{esito(r.classica)}</td>
              <td>{esito(r.quantistica)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
