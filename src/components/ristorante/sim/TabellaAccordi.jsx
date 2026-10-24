"use client";

import { listeContabile } from "../logica/ristorante";
import { Vino } from "./ui";

const COL = ["B", "R"];

function Esito({ ok }) {
  return (
    <span
      className={
        ok
          ? "text-emerald-700 dark:text-emerald-400"
          : "font-semibold text-rose-700 dark:text-rose-400"
      }
    >
      {ok ? "✓" : "✗"}
    </span>
  );
}

/** I 16 accordi possibili: colori di Alice e Bob per calice e bottiglia. */
export function TabellaAccordi() {
  const liste = listeContabile();
  const valide = liste.filter((l) => l.rispetta);
  const regole = (l) => [
    !(l.a0 === 1 && l.b1 === 0),
    !(l.b0 === 1 && l.a1 === 0),
    !(l.a1 === 1 && l.b1 === 1),
  ];
  return (
    <div className="mt-3 space-y-2">
      <div className="overflow-x-auto">
        <table className="text-center text-xs">
          <caption className="mb-1 text-left text-xs text-zinc-500">
            I 16 accordi possibili (in verde quelli che rispettano le tre
            regole)
          </caption>
          <thead>
            <tr className="text-zinc-500">
              <th scope="col" className="px-1 font-normal">
                Alice calice
              </th>
              <th scope="col" className="px-1 font-normal">
                Alice bottiglia
              </th>
              <th scope="col" className="px-1 font-normal">
                Bob calice
              </th>
              <th scope="col" className="px-1 font-normal">
                Bob bottiglia
              </th>
              <th scope="col" className="px-1 font-normal">
                Regola 1
              </th>
              <th scope="col" className="px-1 font-normal">
                Regola 2
              </th>
              <th scope="col" className="px-1 font-normal">
                Regola 3
              </th>
              <th scope="col" className="px-1 font-normal">
                Due calici di rosso?
              </th>
            </tr>
          </thead>
          <tbody>
            {liste.map((l) => {
              const [r1, r2, r3] = regole(l);
              return (
                <tr
                  key={`${l.a0}${l.a1}${l.b0}${l.b1}`}
                  className={`border-t border-zinc-200 dark:border-zinc-800 ${
                    l.rispetta
                      ? "bg-emerald-50 dark:bg-emerald-950/40"
                      : "text-zinc-500"
                  }`}
                >
                  <td className="px-1 py-0.5">
                    <Vino formato="calice" colore={COL[l.a0]} dimensione={22} />
                  </td>
                  <td className="px-1">
                    <Vino
                      formato="bottiglia"
                      colore={COL[l.a1]}
                      dimensione={22}
                    />
                  </td>
                  <td className="px-1">
                    <Vino formato="calice" colore={COL[l.b0]} dimensione={22} />
                  </td>
                  <td className="px-1">
                    <Vino
                      formato="bottiglia"
                      colore={COL[l.b1]}
                      dimensione={22}
                    />
                  </td>
                  <td>
                    <Esito ok={r1} />
                  </td>
                  <td>
                    <Esito ok={r2} />
                  </td>
                  <td>
                    <Esito ok={r3} />
                  </td>
                  <td>{l.dueCaliciRossi ? "sì" : "no"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {valide.length} accordi su 16 rispettano le tre regole, e in nessuno di
        questi i due calici sono rossi. I{" "}
        {liste.filter((l) => l.dueCaliciRossi).length} accordi con due calici di
        rosso violano sempre almeno una regola.
      </p>
    </div>
  );
}
