"use client";

import { useCallback, useRef, useState } from "react";
import {
  B,
  PERCORSI,
  PORTATE_Q,
  R,
  accordoMigliore,
  accordoMiglioreCasuale,
  colonna,
  copia,
  esitiAccordo,
  percentualeAccordo,
  rossi,
  seraQuadrato,
} from "../logica/quadrato";
import { creaRng, semeCasuale } from "../logica/ristorante";
import {
  Barra,
  Dato,
  NOME_COLORE,
  Pulsante,
  Riquadro,
  percento,
  useIntervallo,
} from "./ui";

const VINO = { R: "#9f1239", B: "#eadb7a" };
const TACCHE = [
  { valore: 8 / 9, etichetta: "8/9" },
  { valore: 1, etichetta: "100%" },
];

function Pallino({ c, grande = false }) {
  const d = grande ? "h-5 w-5" : "h-4 w-4";
  return (
    <span
      aria-hidden="true"
      className={`inline-block ${d} rounded-full border border-zinc-500 align-middle`}
      style={{ background: c ? VINO[c] : "transparent" }}
    />
  );
}

function Spunta({ ok, testo }) {
  return (
    <span
      className={`text-xs ${ok ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
    >
      {ok ? "✓" : "✗"} {testo}
    </span>
  );
}

/** Griglia modificabile: Alice controlla le righe, Bob le colonne. */
function Griglia({ chi, griglia, onCambia }) {
  const alice = chi === "Alice";
  const cambia = (i, j) => {
    const g = copia(griglia);
    g[i][j] = g[i][j] === R ? B : R;
    onCambia(g);
  };
  return (
    <table className="text-center text-xs">
      <caption className="mb-1 text-left text-sm font-semibold">
        La griglia di {chi}
      </caption>
      <thead>
        <tr>
          <td />
          {PORTATE_Q.map((p) => (
            <th key={p} scope="col" className="px-1 font-normal text-zinc-500">
              {p}
            </th>
          ))}
          {alice && <td />}
        </tr>
      </thead>
      <tbody>
        {griglia.map((riga, i) => (
          <tr key={PERCORSI[i]}>
            <th
              scope="row"
              className="pr-2 text-right font-normal text-zinc-500"
            >
              {PERCORSI[i]}
            </th>
            {riga.map((c, j) => (
              <td key={PORTATE_Q[j]} className="p-0.5">
                <button
                  type="button"
                  onClick={() => cambia(i, j)}
                  aria-label={`${chi}, ${PORTATE_Q[j]} di ${PERCORSI[i]}: ${NOME_COLORE[c]}. Cambia colore`}
                  className="rounded-md border border-zinc-300 p-1.5 hover:bg-black/5 dark:border-zinc-700 dark:hover:bg-white/10"
                >
                  <Pallino c={c} grande />
                </button>
              </td>
            ))}
            {alice && (
              <td className="pl-2 text-left">
                <Spunta ok={rossi(riga) % 2 === 0} testo="pari" />
              </td>
            )}
          </tr>
        ))}
        {!alice && (
          <tr>
            <td />
            {[0, 1, 2].map((j) => (
              <td key={PORTATE_Q[j]}>
                <Spunta
                  ok={rossi(colonna(griglia, j)) % 2 === 1}
                  testo="disp."
                />
              </td>
            ))}
          </tr>
        )}
      </tbody>
    </table>
  );
}

function TabellaEsiti({ esiti }) {
  return (
    <table className="text-center text-xs">
      <caption className="mb-1 text-left text-xs text-zinc-500">
        Le 9 sere possibili: percorso di Alice (riga) e portata di Bob (colonna)
      </caption>
      <thead>
        <tr>
          <td />
          {PORTATE_Q.map((p) => (
            <th key={p} scope="col" className="px-2 font-normal text-zinc-500">
              {p}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {esiti.map((riga, i) => (
          <tr key={PERCORSI[i]}>
            <th
              scope="row"
              className="pr-2 text-right font-normal text-zinc-500"
            >
              {PERCORSI[i]}
            </th>
            {riga.map((ok, j) => (
              <td
                key={PORTATE_Q[j]}
                className={`px-2 py-0.5 font-semibold ${
                  ok
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                }`}
              >
                {ok ? "offerta" : "si paga"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** L'ultima sera: il percorso di Alice e la portata di Bob sulla griglia. */
function UltimaSera({ sera }) {
  if (!sera) {
    return (
      <p className="text-sm text-zinc-500">Nessuna cena servita, per ora.</p>
    );
  }
  const { r, c, rigaAlice, colonnaBob, vinta } = sera;
  return (
    <div className="space-y-2">
      <table className="text-center text-xs">
        <caption className="mb-1 text-left text-xs text-zinc-500">
          Ultima sera: Alice ha avuto il percorso {PERCORSI[r]}, Bob la portata{" "}
          {PORTATE_Q[c]}
        </caption>
        <thead>
          <tr>
            <td />
            {PORTATE_Q.map((p, j) => (
              <th
                key={p}
                scope="col"
                className={`px-2 font-normal ${j === c ? "text-sky-700 dark:text-sky-300" : "text-zinc-500"}`}
              >
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2].map((i) => (
            <tr key={PERCORSI[i]}>
              <th
                scope="row"
                className={`pr-2 text-right font-normal ${i === r ? "text-rose-700 dark:text-rose-300" : "text-zinc-500"}`}
              >
                {PERCORSI[i]}
              </th>
              {[0, 1, 2].map((j) => {
                const a = i === r ? rigaAlice[j] : null;
                const b = j === c ? colonnaBob[i] : null;
                return (
                  <td
                    key={PORTATE_Q[j]}
                    className={`px-2 py-1 ${i === r ? "bg-rose-50 dark:bg-rose-950/30" : ""} ${j === c ? "bg-sky-50 dark:bg-sky-950/30" : ""}`}
                  >
                    <span className="inline-flex gap-0.5">
                      {a && <Pallino c={a} />}
                      {b && <Pallino c={b} />}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm">
        Rossi di Alice: {rossi(rigaAlice)}, di Bob: {rossi(colonnaBob)}; sul
        piatto in comune {NOME_COLORE[rigaAlice[c]]} e{" "}
        {NOME_COLORE[colonnaBob[r]]}:{" "}
        <strong>{vinta ? "cena offerta" : "si paga"}</strong>.
      </p>
    </div>
  );
}

const vuoto = () => ({ vinte: 0, sere: 0, rossiAlice: 0, ultima: null });

function aggiorna(s, sera) {
  return {
    vinte: s.vinte + (sera.vinta ? 1 : 0),
    sere: s.sere + 1,
    rossiAlice: s.rossiAlice + rossi(sera.rigaAlice),
    ultima: sera,
  };
}

function Conteggi({ stat, atteso, colore, conRossi = false }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-5">
        <Dato
          etichetta="Cene offerte"
          valore={percento(stat.sere ? stat.vinte / stat.sere : null)}
          enfasi
          nota={`atteso ${percento(atteso)}`}
        />
        <Dato
          etichetta="offerte / sere"
          valore={`${stat.vinte} / ${stat.sere}`}
        />
        {conRossi && (
          <Dato
            etichetta="Rosso nei vini di Alice"
            valore={percento(
              stat.sere ? stat.rossiAlice / (3 * stat.sere) : null,
            )}
          />
        )}
      </div>
      <Barra
        valore={stat.sere ? stat.vinte / stat.sere : null}
        colore={colore}
        tacche={TACCHE}
      />
    </div>
  );
}

export function MenuDegustazione() {
  // Si parte da un accordo migliore (8 su 9), fisso per non avere
  // differenze fra il rendering del server e quello del browser.
  const [accordo, setAccordo] = useState(accordoMigliore);
  const [statL, setStatL] = useState(vuoto);
  const [statG, setStatG] = useState(vuoto);
  const [attivo, setAttivo] = useState(false);
  const rng = useRef(creaRng(44));

  const azzera = () => {
    setStatL(vuoto());
    setStatG(vuoto());
    rng.current = creaRng(semeCasuale());
  };

  const nuovoAccordo = (a) => {
    setAccordo(a);
    azzera();
  };

  const servi = useCallback(
    (quante) => {
      const lista = [];
      const gemelle = [];
      for (let i = 0; i < quante; i++) {
        lista.push(seraQuadrato({ modo: "liste", accordo }, rng.current));
        gemelle.push(seraQuadrato({ modo: "gemelle" }, rng.current));
      }
      setStatL((s) => lista.reduce(aggiorna, s));
      setStatG((s) => gemelle.reduce(aggiorna, s));
    },
    [accordo],
  );

  useIntervallo(() => servi(30), 300, attivo);

  const esatta = percentualeAccordo(accordo);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Pulsante primario onClick={() => setAttivo((a) => !a)}>
          {attivo ? "Pausa" : "Fai partire le cene"}
        </Pulsante>
        <Pulsante onClick={() => servi(1)} disabled={attivo}>
          Una cena
        </Pulsante>
        <Pulsante onClick={azzera}>Azzera</Pulsante>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Riquadro titolo="Ristorante normale · accordo scritto">
          <p className="mb-3 text-sm">
            Clicca un piatto per cambiare il colore. Alice usa la riga del suo
            percorso, Bob la colonna della sua portata.
          </p>
          <div className="flex flex-wrap gap-6">
            <Griglia
              chi="Alice"
              griglia={accordo.alice}
              onCambia={(g) => nuovoAccordo({ ...accordo, alice: g })}
            />
            <Griglia
              chi="Bob"
              griglia={accordo.bob}
              onCambia={(g) => nuovoAccordo({ ...accordo, bob: g })}
            />
          </div>
          <div className="my-3 flex flex-wrap gap-2">
            <Pulsante
              onClick={() =>
                nuovoAccordo(accordoMiglioreCasuale(Math.random, accordo))
              }
            >
              Accordo ottimo casuale
            </Pulsante>
          </div>
          <TabellaEsiti esiti={esitiAccordo(accordo)} />
          <p className="my-3 text-sm">
            Questo accordo vince{" "}
            <strong>{Math.round(esatta * 9)} sere su 9</strong> (
            {percento(esatta)}). Nessuno dei 4096 accordi possibili va oltre 8.
          </p>
          <div className="mb-3">
            <UltimaSera sera={statL.ultima} />
          </div>
          <Conteggi stat={statL} atteso={esatta} colore="bg-amber-600" />
        </Riquadro>

        <Riquadro titolo="Ristorante stregato · nessun accordo">
          <p className="mb-3 text-sm">
            Qui Alice e Bob non hanno nessun accordo: ordinano sul momento, per
            il percorso o la portata che è toccata loro, e il registro mostra i
            tre fatti del problema.
          </p>
          <UltimaSera sera={statG.ultima} />
          <div className="mt-3">
            <Conteggi stat={statG} atteso={1} colore="bg-rose-700" conRossi />
          </div>
        </Riquadro>
      </div>
    </div>
  );
}
