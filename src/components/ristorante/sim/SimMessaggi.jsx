"use client";

import { useRef, useState } from "react";
import {
  DELTA_OTTIMALE,
  FORMATI,
  creaRng,
  semeCasuale,
  seraGemelle,
} from "../logica/ristorante";
import { Dato, Pulsante, Riquadro, Vino, percento } from "./ui";

// Il gioco «indovina il formato segreto». A ogni mese il cameriere di Bob
// sceglie in segreto un formato e lo serve a Bob tutte le sere; il cameriere
// di Alice sceglie a caso. Chi gioca vede solo la colonna di Alice e prova
// a indovinare. Poi la scelta viene svelata, insieme al confronto dei due
// colonne del registro.

const SERE_MESE = 30;
const CON = { calice: "il calice", bottiglia: "la bottiglia" };
// Il primo segreto è fisso, così server e browser mostrano lo stesso mese.
const SEGRETO_INIZIALE = creaRng(7)() < 0.5 ? 0 : 1;

const meseVuoto = (segreto) => ({
  segreto,
  sere: [],
  risposta: null,
});

function conta(sere) {
  const n = [0, 0];
  const rossi = [0, 0];
  const uguali = [0, 0];
  for (const s of sere) {
    n[s.x] += 1;
    if (s.a === "R") rossi[s.x] += 1;
    if (s.a === s.b) uguali[s.x] += 1;
  }
  return { n, rossi, uguali };
}

/** Indovina come farebbe un cameriere attento: più rossi, più calici. */
function indovinaDaRegistro(sere) {
  const rossi = sere.filter((s) => s.a === "R").length;
  if (2 * rossi === sere.length) return null;
  return 2 * rossi > sere.length ? 0 : 1;
}

export function NessunMessaggio() {
  const rng = useRef(creaRng(61));
  const [mese, setMese] = useState(() => meseVuoto(SEGRETO_INIZIALE));
  const [punteggio, setPunteggio] = useState({ giusti: 0, tentativi: 0 });
  const [automatico, setAutomatico] = useState(null);

  const nuovoMese = () => setMese(meseVuoto(rng.current() < 0.5 ? 0 : 1));

  const servi = (quante) =>
    setMese((m) => {
      const sere = [...m.sere];
      for (let i = 0; i < quante && sere.length < SERE_MESE; i++) {
        const x = rng.current() < 0.5 ? 0 : 1;
        sere.push(seraGemelle(x, m.segreto, DELTA_OTTIMALE, rng.current));
      }
      return { ...m, sere };
    });

  const rispondi = (formato) => {
    setMese((m) => ({ ...m, risposta: formato }));
    setPunteggio((p) => ({
      giusti: p.giusti + (formato === mese.segreto ? 1 : 0),
      tentativi: p.tentativi + 1,
    }));
  };

  const centoMesi = () => {
    let giusti = 0;
    for (let k = 0; k < 100; k++) {
      const segreto = rng.current() < 0.5 ? 0 : 1;
      const sere = [];
      for (let i = 0; i < SERE_MESE; i++) {
        const x = rng.current() < 0.5 ? 0 : 1;
        sere.push(seraGemelle(x, segreto, DELTA_OTTIMALE, rng.current));
      }
      let ipotesi = indovinaDaRegistro(sere);
      if (ipotesi === null) ipotesi = rng.current() < 0.5 ? 0 : 1;
      if (ipotesi === segreto) giusti++;
    }
    setAutomatico((a) => ({
      giusti: (a?.giusti ?? 0) + giusti,
      tentativi: (a?.tentativi ?? 0) + 100,
    }));
  };

  const azzera = () => {
    rng.current = creaRng(semeCasuale());
    setMese(meseVuoto(rng.current() < 0.5 ? 0 : 1));
    setPunteggio({ giusti: 0, tentativi: 0 });
    setAutomatico(null);
  };

  const stat = conta(mese.sere);
  const finito = mese.sere.length === SERE_MESE;
  const svelato = mese.risposta !== null;
  const ultime = mese.sere.slice(-10);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Pulsante onClick={() => servi(1)} disabled={finito || svelato}>
          Una sera
        </Pulsante>
        <Pulsante
          primario
          onClick={() => servi(SERE_MESE)}
          disabled={finito || svelato}
        >
          Tutto il mese
        </Pulsante>
        <Pulsante onClick={nuovoMese}>Nuovo mese</Pulsante>
        <Pulsante onClick={azzera}>Azzera</Pulsante>
        <span className="text-sm text-zinc-500">
          Sere: {mese.sere.length} / {SERE_MESE}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Riquadro titolo="La colonna di Alice nel registro">
          <p className="mb-3 text-sm">
            Il cameriere di Bob ha scelto in segreto il formato del mese. Tu
            vedi solo i vini della sala di Alice.
          </p>
          <div className="mb-3 flex flex-wrap gap-5">
            {FORMATI.map((f, x) => (
              <Dato
                key={f}
                etichetta={`rosso, quando Alice ha ${CON[f]}`}
                valore={percento(stat.n[x] ? stat.rossi[x] / stat.n[x] : null)}
                nota={`${stat.rossi[x]} su ${stat.n[x]} sere`}
              />
            ))}
          </div>
          {ultime.length > 0 && (
            <div>
              <p className="mb-1 text-xs text-zinc-500">Le ultime sere</p>
              <div className="flex flex-wrap gap-1">
                {ultime.map((s, k) => (
                  <Vino
                    key={mese.sere.length - ultime.length + k}
                    formato={FORMATI[s.x]}
                    colore={s.a}
                    dimensione={28}
                  />
                ))}
              </div>
            </div>
          )}
        </Riquadro>

        <Riquadro titolo="Che formato ha servito il cameriere di Bob?">
          {!svelato ? (
            <>
              <p className="mb-3 text-sm">
                Quando ti sembra di aver capito, rispondi. Puoi farlo anche
                prima della fine del mese.
              </p>
              <div className="flex flex-wrap gap-2">
                {FORMATI.map((f, x) => (
                  <Pulsante
                    key={f}
                    onClick={() => rispondi(x)}
                    disabled={mese.sere.length === 0}
                  >
                    Secondo me: {f}
                  </Pulsante>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="mb-2 text-sm">
                Il cameriere di Bob ha servito sempre{" "}
                <strong>{CON[FORMATI[mese.segreto]]}</strong>. Hai risposto{" "}
                {FORMATI[mese.risposta]}:{" "}
                <strong
                  className={
                    mese.risposta === mese.segreto
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-rose-700 dark:text-rose-400"
                  }
                >
                  {mese.risposta === mese.segreto ? "indovinato" : "sbagliato"}
                </strong>
                .
              </p>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Ora, mettendo accanto le due colonne del registro
              </p>
              <div className="mb-3 flex flex-wrap gap-5">
                {FORMATI.map((f, x) => (
                  <Dato
                    key={f}
                    etichetta={`stesso colore, Alice con ${CON[f]}`}
                    valore={percento(
                      stat.n[x] ? stat.uguali[x] / stat.n[x] : null,
                    )}
                  />
                ))}
              </div>
              <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
                Le coppie di colori hanno le solite proporzioni della sfida
                dello chef, ma si vede solo confrontando le due colonne del
                registro.
              </p>
              <Pulsante primario onClick={nuovoMese}>
                Nuovo mese
              </Pulsante>
            </>
          )}
          <div className="mt-4 flex flex-wrap gap-5 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <Dato
              etichetta="I tuoi tentativi"
              valore={`${punteggio.giusti} / ${punteggio.tentativi}`}
              nota={
                punteggio.tentativi
                  ? `indovinati ${percento(punteggio.giusti / punteggio.tentativi)}`
                  : "nessun tentativo"
              }
              enfasi
            />
          </div>
        </Riquadro>
      </div>

      <Riquadro titolo="Un indizio nei conteggi?">
        <p className="mb-3 text-sm">
          Un cameriere che cerca un indizio nei conteggi potrebbe seguire una
          regola: se nel mese i rossi di Alice sono più della metà, risponde
          «calice», altrimenti «bottiglia». Mettiamolo alla prova per cento mesi
          di fila. Questa è una delle regole possibili. Nessun metodo può
          distinguere i due formati: l’intero registro locale ha le stesse
          probabilità in entrambi i casi.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Pulsante onClick={centoMesi}>Prova cento mesi</Pulsante>
          {automatico && (
            <Dato
              etichetta="Mesi indovinati"
              valore={`${automatico.giusti} / ${automatico.tentativi}`}
              nota={`${percento(automatico.giusti / automatico.tentativi)}: come tirare a sorte`}
            />
          )}
        </div>
      </Riquadro>
    </div>
  );
}
