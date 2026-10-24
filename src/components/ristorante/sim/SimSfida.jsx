"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  DELTA_OTTIMALE,
  FORMATI,
  ROSSO,
  BIANCO,
  cenaOfferta,
  creaRng,
  pVittoriaGemelle,
  percentualeStrategia,
  semeCasuale,
  seraSfida,
  tutteLeStrategie,
} from "../logica/ristorante";
import {
  Barra,
  Dato,
  NOME_COLORE,
  Pulsante,
  Riquadro,
  Vino,
  formatta,
  percento,
  useIntervallo,
} from "./ui";

const LIMITE_CLASSICO = 0.75;
const LIMITE_GEMELLE = Math.cos(Math.PI / 8) ** 2;

function SceltaColore({ chi, formato, valore, onCambia }) {
  return (
    <div className="flex items-center gap-2">
      <Vino formato={formato} colore={valore} dimensione={34} />
      <span className="w-24 text-sm">
        {chi} in {formato}:
      </span>
      {[ROSSO, BIANCO].map((c) => (
        <Pulsante
          key={c}
          className="px-2 py-1"
          attivo={valore === c}
          aria-pressed={valore === c}
          onClick={() => onCambia(c)}
        >
          {NOME_COLORE[c]}
        </Pulsante>
      ))}
    </div>
  );
}

function Tabellino({ titolo, stat, atteso, colore }) {
  const n = stat.vinte + stat.perse;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-5">
        <Dato
          etichetta={titolo}
          valore={percento(n ? stat.vinte / n : null)}
          enfasi
          nota={`atteso ${percento(atteso)}`}
        />
        <Dato etichetta="cene offerte / sere" valore={`${stat.vinte} / ${n}`} />
      </div>
      <Barra
        valore={n ? stat.vinte / n : null}
        colore={colore}
        tacche={[
          { valore: LIMITE_CLASSICO, etichetta: "75%" },
          { valore: LIMITE_GEMELLE, etichetta: "85,4%" },
        ]}
      />
    </div>
  );
}

function Registro({ celle }) {
  const E = celle.map((r) => r.map((c) => (c.n ? (2 * c.u) / c.n - 1 : null)));
  const completo = E.every((r) => r.every((v) => v !== null));
  const S = completo ? E[0][0] + E[0][1] + E[1][0] - E[1][1] : null;
  return (
    <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-800">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Il registro del maître
      </p>
      <table className="text-center text-sm">
        <caption className="sr-only">
          Media di +1 (stesso colore) e −1 (colori diversi) per formato
        </caption>
        <thead>
          <tr>
            <th scope="col" className="px-2 text-xs font-normal text-zinc-500">
              Alice ↓ · Bob →
            </th>
            {FORMATI.map((f) => (
              <th key={f} scope="col" className="px-2 font-normal">
                {f}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FORMATI.map((f, x) => (
            <tr key={f}>
              <th scope="row" className="px-2 text-right font-normal">
                {f}
              </th>
              {FORMATI.map((g, y) => (
                <td key={g} className="px-2 font-mono">
                  {formatta(E[x][y])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-sm">
        S = E(c,c) + E(c,b) + E(b,c) − E(b,b) ={" "}
        <strong className="font-mono">{formatta(S, 3)}</strong>
      </p>
    </div>
  );
}

const vuoto = () => ({
  vinte: 0,
  perse: 0,
  ultima: null,
  celle: [
    [
      { u: 0, n: 0 },
      { u: 0, n: 0 },
    ],
    [
      { u: 0, n: 0 },
      { u: 0, n: 0 },
    ],
  ],
});

export function SfidaChef() {
  const [strategia, setStrategia] = useState({
    a0: BIANCO,
    a1: BIANCO,
    b0: BIANCO,
    b1: BIANCO,
  });
  const delta = DELTA_OTTIMALE;
  const [attivo, setAttivo] = useState(false);
  const [statL, setStatL] = useState(vuoto);
  const [statG, setStatG] = useState(vuoto);
  const rng = useRef(creaRng(21));

  const azzera = () => {
    setStatL(vuoto());
    setStatG(vuoto());
    rng.current = creaRng(semeCasuale());
  };

  const servi = useCallback(
    (quante = 25) => {
      const aggiorna = (modo) => (s) => {
        let { vinte, perse, ultima } = s;
        const celle = s.celle.map((r) => r.map((c) => ({ ...c })));
        for (let i = 0; i < quante; i++) {
          ultima = seraSfida({ modo, strategia, delta }, rng.current);
          const c = celle[ultima.x][ultima.y];
          c.n += 1;
          if (ultima.a === ultima.b) c.u += 1;
          if (ultima.vinta) vinte++;
          else perse++;
        }
        return { vinte, perse, ultima, celle };
      };
      setStatL(aggiorna("liste"));
      setStatG(aggiorna("gemelle"));
    },
    [strategia, delta],
  );

  useIntervallo(() => servi(25), 300, attivo);

  const imposta = (k, c) => {
    setStrategia((s) => ({ ...s, [k]: c }));
    azzera();
  };

  const esatta = percentualeStrategia(strategia);
  const migliori = useMemo(
    () => tutteLeStrategie().filter((s) => s.percentuale === 0.75).length,
    [],
  );
  const ultima = statG.ultima;

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
        <Riquadro titolo="Ristorante normale · piano scritto">
          <div className="space-y-2">
            <SceltaColore
              chi="Alice"
              formato="calice"
              valore={strategia.a0}
              onCambia={(c) => imposta("a0", c)}
            />
            <SceltaColore
              chi="Alice"
              formato="bottiglia"
              valore={strategia.a1}
              onCambia={(c) => imposta("a1", c)}
            />
            <SceltaColore
              chi="Bob"
              formato="calice"
              valore={strategia.b0}
              onCambia={(c) => imposta("b0", c)}
            />
            <SceltaColore
              chi="Bob"
              formato="bottiglia"
              valore={strategia.b1}
              onCambia={(c) => imposta("b1", c)}
            />
          </div>
          <table className="my-3 text-center text-sm">
            <caption className="text-left text-xs text-zinc-500">
              Le quattro serate possibili con questo piano
            </caption>
            <tbody>
              {[0, 1].map((x) =>
                [0, 1].map((y) => {
                  const a = x ? strategia.a1 : strategia.a0;
                  const b = y ? strategia.b1 : strategia.b0;
                  const ok = cenaOfferta(x, y, a, b);
                  return (
                    <tr
                      key={`${x}${y}`}
                      className="border-t border-zinc-200 dark:border-zinc-800"
                    >
                      <td className="px-2 py-1 text-left">
                        {FORMATI[x]} + {FORMATI[y]}
                      </td>
                      <td className="px-2">
                        {NOME_COLORE[a]} / {NOME_COLORE[b]}
                      </td>
                      <td
                        className={
                          ok
                            ? "px-2 text-emerald-700 dark:text-emerald-400"
                            : "px-2 text-rose-700 dark:text-rose-400"
                        }
                      >
                        {ok ? "offerta" : "si paga"}
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
          <p className="mb-3 text-sm">
            Questo piano vince <strong>{percento(esatta, 0)}</strong> delle
            sere. Dei 16 piani possibili, {migliori} arrivano al 75% e nessuno
            va oltre.
          </p>
          <Tabellino
            titolo="Cene offerte"
            stat={statL}
            atteso={esatta}
            colore="bg-amber-600"
          />
          <Registro celle={statL.celle} />
        </Riquadro>

        <Riquadro titolo="Ristorante stregato · nessun piano">
          <p className="mb-3 text-sm">
            Qui Alice e Bob non hanno nessun piano: ordinano e basta. Il
            registro mostra i tre fatti del problema: colori uguali circa 85
            volte su 100 se c'è almeno un calice, diversi circa 85 volte su 100
            con due bottiglie.
          </p>
          <Tabellino
            titolo="Cene offerte"
            stat={statG}
            atteso={pVittoriaGemelle(delta)}
            colore="bg-rose-700"
          />
          <Registro celle={statG.celle} />
        </Riquadro>
      </div>

      {ultima && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Ultima cena nel ristorante stregato: Alice ha avuto un{" "}
          {FORMATI[ultima.x]} di {NOME_COLORE[ultima.a]}, Bob un{" "}
          {FORMATI[ultima.y]} di {NOME_COLORE[ultima.b]}:{" "}
          {ultima.vinta ? "offerta dallo chef" : "pagano loro"}.
        </p>
      )}
    </div>
  );
}
