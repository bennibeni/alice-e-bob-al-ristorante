"use client";

import { useCallback, useRef, useState } from "react";
import {
  creaRng,
  registroS,
  semeCasuale,
  seraTrucco,
} from "../logica/ristorante";
import {
  Barra,
  Dato,
  Pulsante,
  Riquadro,
  Schede,
  formatta,
  percento,
  useIntervallo,
} from "./ui";

const TRUCCHI = [
  {
    id: "chiacchierone",
    testo: "Il cameriere chiacchierone",
    cursore: "Sere in cui corre tra le sale",
    spiega:
      "Il cameriere riferisce a Bob come è stata servita Alice e che vino ha scelto. Le sale comunicano: è la scappatoia della località. Negli esperimenti si chiude mettendo le sale così lontane che nessun messaggio, nemmeno alla velocità della luce, arriva in tempo.",
  },
  {
    id: "registro",
    testo: "Il registro incompleto",
    cursore: "Ordini «persi» quando la scommessa è sbagliata",
    spiega:
      "Alice e Bob scommettono su come li serviranno i camerieri e si accordano su un piano che vince in quel caso. Quando sbaglia, a volte l'ordine «si perde» e la sera non finisce nel registro. Il maître conta solo le sere segnate, che non sono più un campione onesto: è la scappatoia della rilevazione. Si chiude perdendo pochissime sere, come negli esperimenti del 2015.",
  },
  {
    id: "cucina",
    testo: "Le domande già note",
    cursore: "Sere in cui Alice e Bob sanno già come li serviranno",
    spiega:
      "Alice e Bob sanno già come li serviranno i camerieri e si accordano su vini su misura. Allora le domande non sono più libere: è la scappatoia della libertà di scelta. Gli esperimenti la rendono sempre più implausibile facendo decidere il servizio a sorgenti casuali lontane, perfino a migliaia di volontari (Big Bell Test, 2018).",
  },
  {
    id: "superstregato",
    testo: "Il ristorante super-stregato",
    cursore: null,
    spiega:
      "Un ristorante immaginario che vince sempre senza far passare nessun messaggio: Alice vede ancora metà rosso e metà bianco. Non viola nessuna regola del racconto, eppure la natura non lo permette: il ristorante stregato vero si ferma a 2,83. Perché proprio lì è ancora una domanda aperta.",
  },
];

const vuoto = () => ({ servite: 0, sere: [] });

export function Trucchi() {
  const [trucco, setTrucco] = useState("chiacchierone");
  const [intensita, setIntensita] = useState(50);
  const [stat, setStat] = useState(vuoto);
  const [attivo, setAttivo] = useState(false);
  const rng = useRef(creaRng(61));
  const info = TRUCCHI.find((t) => t.id === trucco);

  const azzera = () => {
    setStat(vuoto());
    rng.current = creaRng(semeCasuale());
  };

  const servi = useCallback(
    (quante) => {
      const nuove = Array.from({ length: quante }, () =>
        seraTrucco(trucco, intensita / 100, rng.current),
      );
      setStat((s) => ({
        servite: s.servite + quante,
        sere: [...s.sere, ...nuove.filter((x) => x.registrata)].slice(-60000),
      }));
    },
    [trucco, intensita],
  );

  useIntervallo(() => servi(200), 300, attivo);

  const reg = stat.sere;
  const vinte = reg.filter((s) => s.vinta).length;
  const rossiA = reg.filter((s) => s.a === "R").length;
  const { S } = registroS(reg);

  return (
    <div className="space-y-4">
      <Schede
        etichetta="Trucco"
        voci={TRUCCHI}
        valore={trucco}
        onCambia={(t) => {
          setTrucco(t);
          azzera();
        }}
      />
      <p className="text-sm">{info.spiega}</p>
      {info.cursore && (
        <div>
          <label className="block text-sm" htmlFor="intensita">
            {info.cursore}: <strong>{intensita}%</strong>
          </label>
          <input
            id="intensita"
            type="range"
            min="0"
            max="100"
            value={intensita}
            onChange={(e) => {
              setIntensita(Number(e.target.value));
              azzera();
            }}
            className="w-full max-w-md"
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Pulsante primario onClick={() => setAttivo((a) => !a)}>
          {attivo ? "Pausa" : "Fai partire il trucco"}
        </Pulsante>
        <Pulsante onClick={() => servi(20)} disabled={attivo}>
          20 sere
        </Pulsante>
        <Pulsante onClick={azzera}>Azzera</Pulsante>
      </div>
      <Riquadro titolo="Quello che vede il maître">
        <div className="mb-4 flex flex-wrap gap-6">
          <Dato
            etichetta="Sere segnate / servite"
            valore={`${reg.length} / ${stat.servite}`}
          />
          <Dato
            etichetta="Cene offerte (sere segnate)"
            valore={percento(reg.length ? vinte / reg.length : null)}
          />
          {trucco === "superstregato" && (
            <Dato
              etichetta="Rosso nella colonna di Alice"
              valore={percento(reg.length ? rossiA / reg.length : null)}
            />
          )}
          <Dato etichetta="S" valore={formatta(S, 3)} enfasi />
        </div>
        <Barra
          valore={S === null ? null : Math.max(0, S)}
          massimo={4}
          colore={S !== null && S > 2.9 ? "bg-amber-600" : "bg-rose-700"}
          tacche={[
            { valore: 2, etichetta: "ristorante normale: 2" },
            { valore: 2 * Math.SQRT2, etichetta: "ristorante stregato: 2,83" },
          ]}
        />
        <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
          {trucco === "superstregato"
            ? "S arriva a 4 e la colonna di Alice resta a metà rosso: nessun messaggio, eppure nessun ristorante vero ci riesce."
            : "Con il trucco a zero il ristorante normale resta a S = 2; alzandolo, il registro sembra stregato. Ma è un imbroglio, non una stregoneria."}
        </p>
      </Riquadro>
    </div>
  );
}
