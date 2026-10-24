"use client";

import { useCallback, useRef, useState } from "react";
import {
  T_HARDY,
  creaRng,
  pDueCaliciRossi,
  semeCasuale,
  seraHardy,
} from "../logica/ristorante";
import { Dato, Pulsante, Riquadro, Vino, percento, useIntervallo } from "./ui";

const COL = ["B", "R"];
const vuoto = () => ({ sere: 0, regole: 0, caliciRossi: 0, diario: [] });

function violaRegole({ x, y, a, b }) {
  if (x === 0 && y === 1 && a === 1 && b === 0) return true;
  if (x === 1 && y === 0 && a === 0 && b === 1) return true;
  if (x === 1 && y === 1 && a === 1 && b === 1) return true;
  return false;
}

export function Contabile() {
  const [stat, setStat] = useState(vuoto);
  const [attivo, setAttivo] = useState(false);
  const rng = useRef(creaRng(41));
  const t = T_HARDY;

  const azzera = () => {
    setStat(vuoto());
    rng.current = creaRng(semeCasuale());
  };

  const servi = useCallback(
    (quante) => {
      setStat((s) => {
        let { sere, regole, caliciRossi, diario } = s;
        const nuove = [];
        for (let i = 0; i < quante; i++) {
          const r = seraHardy(t, rng.current);
          sere++;
          if (violaRegole(r)) regole++;
          if (r.x === 0 && r.y === 0 && r.a === 1 && r.b === 1) {
            caliciRossi++;
            nuove.push({ n: sere, ...r });
          }
        }
        return {
          sere,
          regole,
          caliciRossi,
          diario: [...nuove.reverse(), ...diario].slice(0, 8),
        };
      });
    },
    [t],
  );

  useIntervallo(() => servi(40), 250, attivo);

  return (
    <div className="space-y-4">
      <Riquadro titolo="Le tre regole del contabile">
        <ol className="ml-5 list-decimal space-y-1 text-sm">
          <li>
            Se Alice ha un calice di rosso e Bob la bottiglia, la bottiglia di
            Bob è rossa.
          </li>
          <li>
            Se Bob ha un calice di rosso e Alice la bottiglia, la bottiglia di
            Alice è rossa.
          </li>
          <li>Due bottiglie di rosso non arrivano mai: costano troppo.</li>
        </ol>
      </Riquadro>

      <div className="flex flex-wrap items-center gap-2">
        <Pulsante primario onClick={() => setAttivo((a) => !a)}>
          {attivo ? "Pausa" : "Sfoglia i conti del ristorante stregato"}
        </Pulsante>
        <Pulsante onClick={() => servi(1)} disabled={attivo}>
          Una sera
        </Pulsante>
        <Pulsante onClick={azzera}>Azzera</Pulsante>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Riquadro titolo="Il libro dei conti">
          <div className="flex flex-wrap gap-5">
            <Dato etichetta="Sere" valore={stat.sere} />
            <Dato etichetta="Regole violate" valore={stat.regole} />
            <Dato
              etichetta="Due calici di rosso"
              valore={stat.caliciRossi}
              enfasi
              nota={`attese ${percento(pDueCaliciRossi(t) / 4)} delle sere`}
            />
          </div>
          <ul className="mt-3 space-y-1 text-sm">
            {stat.diario.map((d) => (
              <li key={d.n} className="flex items-center gap-2">
                <span className="w-20 font-mono text-xs text-zinc-500">
                  sera {d.n}
                </span>
                <Vino colore={COL[d.a]} dimensione={26} />
                <Vino colore={COL[d.b]} dimensione={26} />
                <span className="text-rose-700 dark:text-rose-400">
                  «impossibile!»
                </span>
              </li>
            ))}
          </ul>
        </Riquadro>
        <Riquadro titolo="Il ragionamento del contabile">
          <p className="text-sm">
            Se Alice e Bob avessero schede scritte prima di cena, per le tre
            regole due calici di rosso non arriverebbero mai.
          </p>
          <p className="mt-2 text-sm">
            Nel ristorante stregato invece le regole non sono mai violate,
            eppure due calici di rosso arrivano nel{" "}
            <strong>{percento(pDueCaliciRossi(t))}</strong> delle sere con due
            calici: guarda «Due calici di rosso» nel libro dei conti.
          </p>
        </Riquadro>
      </div>
    </div>
  );
}
