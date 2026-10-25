"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Vino } from "../../../ristorante/sim/ui";
import {
  MODEL_COORDS,
  MODEL_EXCLUDED_INDEX,
} from "../v1/gemelliNumerici37Config";
import {
  MODEL_VALUES,
  ATTIVE, candidatiBob, rispondi, vince,
  P_QUANTISTICA,
  SISTEMI as SISTEMI_ORIGINALI,
  creaRng,
  migliorStrategia,
  round,
  vittoriaClassicaEsatta,
} from "./giocoGriglia";

// Restaurant vocabulary only: strategy IDs and probability calculations are unchanged.
const SISTEMI = SISTEMI_ORIGINALI.map(s=>({...s,nota:({separati:'Tavoli non allineati, numeri diversi.',collineare:'Tavoli allineati, numeri diversi.',gemello:'Stesso numero, tavoli non allineati.'})[s.id]}));

const pct = (v, d = 1) => `${(v * 100).toFixed(d).replace(".", ",")}%`;
const MAX_PUNTI = 300;
const MAX_LOG = 8;
const MAX_CENE = 200;

const ROSSO_PLAN={alice:[{d:0,modo:'si'},{d:0,modo:'si'}],bob:[{d:0,modo:'si'},{d:0,modo:'si'}]};
function descriviRegola(r){
 if(r.modo==='si')return 'Sempre rosso: il numero non conta.';
 if(r.modo==='no')return 'Sempre bianco: il numero non conta.';
 const condizione=['il numero è pari','il numero è multiplo di 3','il numero è primo','il resto della divisione del numero per 3 è 1'][r.d];
 return r.modo==='inversa'?'Bianco se '+condizione+'; altrimenti rosso.':'Rosso se '+condizione+'; altrimenti bianco.';
}

function statoVuoto() {
  return { n: 0, vc: 0, vb: 0, vq: 0, serieC: [], serieB: [], serieQ: [], log: [] };
}

function aggiungi(serie, n, p) {
  let s = [...serie, [n, p]];
  if (s.length > MAX_PUNTI)
    s = s.filter((_, k) => k % 2 === 0 || k === s.length - 1);
  return s;
}

export default function GiocoCHSHGriglia() {
  const [sistema, setSistema] = useState("collineare");

  const [stato, setStato] = useState(statoVuoto);
  const [inCorso, setInCorso] = useState(false);
  const rng = useRef(creaRng(37));
  const ceneServite=useRef(0);

  const migliori = useMemo(
    () =>
      SISTEMI.map((s) => ({
        ...s,
        firme: migliorStrategia(s.id, true),
        tutte: migliorStrategia(s.id, false),
      })),
    [],
  );

  const ottimo=migliori.find(m=>m.id===sistema);
  // Prefer a number-dependent optimum when it ties the unrestricted optimum.
  const risultato=Math.abs(ottimo.firme.p-ottimo.tutte.p)<1e-12?ottimo.firme:ottimo.tutte;
  const strategia=risultato.strategia;
  const pClassica=risultato.p;

  const azzera = useCallback(() => {
    rng.current = creaRng(Math.floor(Math.random() * 1e9));
    ceneServite.current=0;
    setStato(statoVuoto());
  }, []);

  // Cambiare sistema o strategia rende i conteggi non confrontabili.
  const conAzzeramento = (imposta) => (valore) => {
    imposta(valore);
    azzera();
    setInCorso(false);
  };
  const cambiaSistema = conAzzeramento(setSistema);

  const gioca = useCallback(
    (quanti) => {
      const count=Math.min(quanti,MAX_CENE-ceneServite.current);
      if(count<=0)return;
      const rr = [];
      for (let k = 0; k < count; k++)
        rr.push(round(rng.current, strategia, sistema));
      ceneServite.current+=rr.length;
      if(ceneServite.current>=MAX_CENE)setInCorso(false);
      setStato((prev) => {
        let { n, vc, vb, vq, serieC, serieB, serieQ } = prev;
        const passo = Math.max(1, Math.floor(quanti / MAX_CENE));
        rr.forEach((r, k) => {
          n += 1;
          vc += r.classica.vinto ? 1 : 0;
          vb += (r.x & r.y) ? 0 : 1;
          vq += r.quantistica.vinto ? 1 : 0;
          if ((k + 1) % passo === 0 || k === rr.length - 1) {
            serieC = aggiungi(serieC, n, vc / n);
            serieB = aggiungi(serieB, n, vb / n);
            serieQ = aggiungi(serieQ, n, vq / n);
          }
        });
        return {
          n,
          vc,
          vb,
          vq,
          serieC,
          serieB,
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
    const id = setInterval(() => giocaRef.current(2), 100);
    return () => clearInterval(id);
  }, [inCorso]);

  const ultimo = stato.log[0];
  const esempio=ultimo || {i:ATTIVE[0],j:candidatiBob(ATTIVE[0],sistema)[0]};

  return (
    <div className="space-y-6 text-sm leading-relaxed text-gray-900 dark:text-gray-100">
      <Box titolo="La sfida nella sala">
        <p>A ogni cena:</p>
        <ol className="ml-6 mt-2 list-decimal space-y-1">
          <li>
            Il maître assegna ad Alice uno dei 36 tavoli disponibili, a caso,
            e a Bob un altro tavolo compatibile con l’assegnazione scelta.
          </li>
          <li>
            I camerieri scelgono indipendentemente per ciascuno il{" "}
            <strong>calice</strong> o la <strong>bottiglia</strong>.
          </li>
          <li>Lo chef serve rosso o bianco applicando il piano della calcolatrice: per ogni cliente usa il numero del suo tavolo e il formato scelto dal suo cameriere.</li>
          <li>
            La cena è offerta se i colori <strong>coincidono</strong>, tranne
            quando entrambi ricevono una bottiglia: lì devono essere{" "}
            <strong>diversi</strong>.
          </li>
        </ol>
        <p className="mt-2">
          La calcolatrice ha già scelto il piano prima dell’estrazione dei
          formati. Le regole sono mostrate qui sotto; possono usare i numeri
          oppure prescrivere un colore fisso. «Sempre rosso» e il riferimento
          stregato sono confronti sulle stesse cene; le statistiche
          quantistiche sono simulate dal programma.
        </p>
      </Box>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <Box titolo={<span className="inline-flex items-center gap-2">Il piano scelto dalla calcolatrice<svg viewBox="0 0 24 28" width="24" height="28" fill="none" aria-hidden="true" className="shrink-0 text-amber-700 dark:text-amber-400"><rect x="2" y="1" width="20" height="26" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.7"/><rect x="6" y="5" width="12" height="5" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 15h1m4 0h1m4 0h1M7 19h1m4 0h1m4 0h1M7 23h1m4 0h1m4 0h1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg></span>}>
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
          <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {SISTEMI.find((s) => s.id === sistema).nota}
          </p>
          <div className="space-y-3">
          <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-xs"><caption className="sr-only">Colori serviti dallo chef secondo il piano scelto</caption><thead><tr><th scope="col" className="pr-4">Cliente</th><th scope="col" className="px-2">Con il calice</th><th scope="col" className="px-2">Con la bottiglia</th></tr></thead><tbody>{['alice','bob'].map(chi=><tr key={chi} className="border-t border-gray-200"><th className="py-2 pr-2">{chi==='alice'?'Alice':'Bob'}</th><td className="p-2">{descriviRegola(strategia[chi][0])}</td><td className="p-2">{descriviRegola(strategia[chi][1])}</td></tr>)}</tbody></table></div></div>
          <p className="mt-2 text-xs text-gray-500">Cambiare assegnazione azzera le cene e ricalcola il piano. Il confronto «Sempre rosso» usa gli stessi formati estratti per il piano ottimizzato.</p>
        </Box>
        <Box titolo="Cena per cena">
          <Griglia ultimo={ultimo} />
        </Box>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Btn primario disabled={stato.n>=MAX_CENE} onClick={() => setInCorso((v) => !v)}>
          {stato.n>=MAX_CENE ? "200 cene concluse" : inCorso ? "⏸ Pausa" : "▶ Avvia"}
        </Btn>
        <Btn onClick={() => gioca(1)} disabled={inCorso || stato.n>=MAX_CENE}>
          +1 cena
        </Btn>
        <Btn onClick={() => gioca(MAX_CENE)} disabled={inCorso || stato.n>=MAX_CENE}>
          Completa 200 cene
        </Btn>
        <Btn
          onClick={() => {
            setInCorso(false);
            azzera();
          }}
        >
          ↺ Ricomincia
        </Btn>

        <span className="text-gray-500">
          Cene: {stato.n.toLocaleString("it-IT")} / {MAX_CENE}
        </span>
      </div>

      <p className="text-xs text-gray-500" role="status">{stato.n>=MAX_CENE ? "Esperimento concluso: premi Ricomincia per ripetere. Su 200 cene i risultati possono differire dalle probabilità esatte." : "Arresto automatico a 200 cene per ciascun ristorante. La tabella mostra le probabilità esatte, indipendenti dalla durata della simulazione."}</p>
      <p className="rounded-lg bg-amber-50 p-4 font-medium dark:bg-amber-950/30">Il piano della calcolatrice è buono tanto quanto “Sempre rosso”: entrambi vincono mediamente 3 volte su 4.</p>
      <section className="space-y-3"><h3 className="font-semibold">Quattro possibili cene, due piani a confronto</h3><div className="grid gap-4 lg:grid-cols-2"><TabellaQuattro titolo="Sempre rosso" strategia={ROSSO_PLAN} esempio={esempio}/><TabellaQuattro titolo="Piano dalla calcolatrice" strategia={strategia} esempio={esempio}/></div></section>
      <div className="grid gap-4 xl:grid-cols-3">
        <Punteggio titolo="Riferimento: sempre rosso" v={stato.vb} n={stato.n} teoria={.75} colore="#64748b"/>
        <Punteggio
          titolo="Riferimento: piano ottimizzato"
          v={stato.vc}
          n={stato.n}
          teoria={pClassica}
          colore="#d97706"
        />
        <Punteggio
          titolo="Riferimento: stregato"
          v={stato.vq}
          n={stato.n}
          teoria={P_QUANTISTICA}
          colore="#7c3aed"
        />
      </div>

      <Box titolo="Percentuale di cene offerte nel tempo">
        <div className="mb-3 flex flex-wrap gap-4 text-xs" aria-label="Legenda delle curve"><span className="flex items-center gap-2"><i className="inline-block h-1 w-5 bg-slate-500"/>Sempre rosso</span><span className="flex items-center gap-2"><i className="inline-block h-1 w-5 bg-amber-600"/>Piano ottimizzato</span><span className="flex items-center gap-2"><i className="inline-block h-1 w-5 bg-violet-600"/>Stregato</span></div><Grafico b={stato.serieB} c={stato.serieC} q={stato.serieQ} /><p className="mt-2 text-xs text-gray-500">Le tre curve usano gli stessi formati estratti in ogni cena. Se i due piani classici vincono nelle stesse cene, le loro curve coincidono. Le linee tratteggiate indicano il 75% classico e l’85,4% quantistico.</p>
      </Box>


      <Box titolo="Confronto esatto delle tre assegnazioni">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="py-1">Sistema</th>
              <th>Sempre rosso</th>
              <th>Piano dalla calcolatrice</th>
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
                <td className="tabular-nums">{pct(vittoriaClassicaEsatta(ROSSO_PLAN,m.id))}</td>
                <td className="tabular-nums">{pct(m.tutte.p)}</td>
                <td className="tabular-nums">{pct(P_QUANTISTICA)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">
          Valori esatti: tutte le coppie di tavoli ammesse e le quattro coppie di formati, con i loro pesi. La ricerca confronta tutte le 65.536 combinazioni della famiglia di regole disponibile (quattro proprietà del numero, dirette o invertite, e colori fissi). Il miglior piano ammesso raggiunge il 75%: il limite CHSH esclude che strategie esterne alla famiglia possano superarlo. Le frequenze simulate possono oscillare, soprattutto su poche cene.
        </p>
      </Box>

      <Dettagli titolo="Che cosa insegna la griglia">
        <p>La disposizione dei tavoli cambia quali numeri vengono assegnati insieme. Nei gemelli coincidono perfettamente; negli altri casi sono diversi. Questi vincoli possono cambiare il rendimento di una particolare regola, ma non alzano il miglior risultato ammesso: <strong>mediamente tre cene offerte su quattro</strong>.</p>
        <p className="mt-2">La calcolatrice ottimizza soltanto nella famiglia dichiarata. Il limite generale del 75% deriva invece dalla dimostrazione CHSH e vale anche per altri piani locali, purché i formati siano scelti indipendentemente dalla preparazione, le quattro coppie siano equiprobabili e non si usi il formato dell’altra sala per decidere un colore. La simulazione illustra questa differenza: non è un esperimento fisico che dimostra la nonlocalità.</p>
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
          if (isA) fill = "#be123c";
          if (isB) fill = "#0369a1";
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
      <div className="mt-1 flex items-center justify-center gap-4 text-xs">
        <span className="inline-flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-300">
          ■ Alice
          {ultimo && <Vino formato={ultimo.x === 0 ? "calice" : "bottiglia"} colore={ultimo.classica.a ? "R" : "B"} dimensione={36} />}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-sky-700 dark:text-sky-300">
          ■ Bob
          {ultimo && <Vino formato={ultimo.y === 0 ? "calice" : "bottiglia"} colore={ultimo.classica.b ? "R" : "B"} dimensione={36} />}
        </span>
      </div>
    </div>
  );
}

function Grafico({ b, c, q }) {
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
      aria-label="Percentuali cumulative di cene offerte: sempre rosso in grigio, piano ottimizzato in arancione, stregato in viola"
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
      <polyline points={linea(b)} fill="none" stroke="#64748b" strokeWidth="2" />
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

function TabellaQuattro({titolo,strategia,esempio}){
 const righe=[[0,0],[0,1],[1,0],[1,1]].map(([x,y])=>{
  const a=rispondi(MODEL_VALUES[esempio.i],strategia.alice[x]),b=rispondi(MODEL_VALUES[esempio.j],strategia.bob[y]);
  return {x,y,a,b,ok:vince(x,y,a,b)};
 });
 return <div className="overflow-x-auto rounded-lg border border-gray-200 p-3 dark:border-gray-700">
  <table className="w-full text-left text-xs">
   <caption className="mb-3 text-left text-sm font-semibold">{titolo}</caption>
   <thead><tr>
    <th scope="col" className="p-2"><span className="inline-flex whitespace-nowrap rounded-md border-2 border-rose-500 px-2 py-1 font-bold text-rose-700 dark:text-rose-300">Alice · {MODEL_VALUES[esempio.i]}</span></th>
    <th scope="col" className="p-2"><span className="inline-flex whitespace-nowrap rounded-md border-2 border-sky-500 px-2 py-1 font-bold text-sky-700 dark:text-sky-300">Bob · {MODEL_VALUES[esempio.j]}</span></th>
    <th scope="col" className="p-2">Cena</th>
   </tr></thead>
   <tbody>{righe.map(r=>{
    return <tr key={r.x+':'+r.y} className={esempio.x===r.x&&esempio.y===r.y?'border-t border-gray-200 bg-amber-100 dark:border-gray-700 dark:bg-amber-950/60':'border-t border-gray-200 dark:border-gray-700'}>
     <td className="p-2"><Vino formato={r.x?"bottiglia":"calice"} colore={r.a?"R":"B"} dimensione={40}/></td>
     <td className="p-2"><Vino formato={r.y?"bottiglia":"calice"} colore={r.b?"R":"B"} dimensione={40}/></td>
     <td className="p-2"><span className={r.ok?'inline-flex items-center gap-1 whitespace-nowrap rounded border border-emerald-600 bg-emerald-50 px-2 py-1 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300':'inline-flex items-center gap-1 whitespace-nowrap rounded border border-red-600 bg-red-50 px-2 py-1 font-bold text-red-800 dark:bg-red-950 dark:text-red-300'}><span aria-hidden="true">{r.ok?'✓':'✗'}</span>{r.ok?'Offerta':'Si paga'}</span></td>
    </tr>;
   })}</tbody>
  </table><p className="mt-2 text-xs font-semibold">{righe.filter(r=>r.ok).length} casi vincenti su 4.</p>
 </div>;
}
