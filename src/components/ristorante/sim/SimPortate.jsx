"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  LISTE,
  PORTATE,
  complementare,
  creaRng,
  pOppostiDiverseListe,
  semeCasuale,
  seraPortate,
  ugualiSuNove,
} from "../logica/ristorante";
import {
  Barra,
  Commensale,
  Dato,
  NOME_COLORE,
  Pulsante,
  Riquadro,
  Schede,
  Vino,
  formatta,
  percento,
  useIntervallo,
} from "./ui";

const CON_ARTICOLO = {
  antipasto: "l'antipasto",
  primo: "il primo",
  secondo: "il secondo",
};

// ---------------------------------------------------------------------------
// Capitolo 1 — gusti opposti
// ---------------------------------------------------------------------------

// Un solo ristorante, con i risultati del registro del ristorante stregato. I camerieri
// scelgono le portate in modo indipendente: la stessa portata capita solo una
// sera su tre. «Sbircia» dice che cosa si sa davvero di Alice e Bob.
export function GustiOpposti() {
  const [sere, setSere] = useState([]);
  const [sbircia, setSbircia] = useState(false);
  const [attivo, setAttivo] = useState(false);
  const rng = useRef(creaRng(semeCasuale()));

  const servi = useCallback(() => {
    const s = seraPortate({ modo: "stregata" }, rng.current);
    setSere((prev) => [s, ...prev].slice(0, 2000));
  }, []);

  useIntervallo(servi, 500, attivo);

  const ultima = sere[0];
  const stesse = sere.filter((s) => s.a === s.b);
  const opposteStesse = stesse.filter((s) => s.alice !== s.bob).length;
  const uguali = sere.filter((s) => s.alice === s.bob).length;
  const stessaUltima = ultima && ultima.a === ultima.b;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Pulsante primario onClick={servi} disabled={attivo}>
          Servi una sera
        </Pulsante>
        <Pulsante onClick={() => setAttivo((a) => !a)}>
          {attivo ? "Pausa" : "Una sera dopo l'altra"}
        </Pulsante>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sbircia}
            onChange={(e) => setSbircia(e.target.checked)}
          />
          Sbircia negli accordi
        </label>
      </div>

      {sbircia && (
        <p className="rounded-md border border-dashed border-zinc-400 p-2 text-sm dark:border-zinc-600">
          Le possibilità sono due:{" "}
          <strong>
            o il ristorante è stregato e non esiste nessun accordo
          </strong>
          , oppure è il ristorante normale e Alice e Bob hanno una strategia che
          nessuno conosce, sempre che una strategia così esista. Lo scopriremo
          nel capitolo 2.
        </p>
      )}

      <div className="flex flex-wrap items-stretch justify-center gap-4">
        {["alice", "bob"].map((chi) => (
          <Commensale
            key={chi}
            nome={chi === "alice" ? "Alice" : "Bob"}
            colore={chi}
          >
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              {ultima
                ? `Portata ${chi === "alice" ? ultima.a : ultima.b}: «Che vino per ${CON_ARTICOLO[PORTATE[chi === "alice" ? ultima.a : ultima.b]]}?»`
                : "aspetta il cameriere"}
            </span>
            <Vino colore={ultima ? ultima[chi] : null} dimensione={56} />
            <span className="text-sm">
              {ultima ? NOME_COLORE[ultima[chi]] : "—"}
            </span>
          </Commensale>
        ))}
      </div>
      {ultima && (
        <p className="text-center text-sm">
          {stessaUltima
            ? "Stasera la stessa portata per tutti e due."
            : "Stasera portate diverse."}
        </p>
      )}

      <div className="flex flex-wrap gap-6">
        <Dato etichetta="Sere servite" valore={sere.length} />
        <Dato etichetta="Sere con la stessa portata" valore={stesse.length} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Dato
          etichetta="1. Sere con lo stesso colore, se ordinato nella stessa portata"
          valore={stesse.length - opposteStesse}
          enfasi
          nota={`obiettivo: nessuna · ${stesse.length} sere con la stessa portata`}
        />
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            2. Rosso e bianco nei registri
          </span>
          <table className="mt-1 w-fit text-center text-xs">
            <caption className="sr-only">
              Percentuale di rosso e di bianco nei registri di Alice e di Bob
            </caption>
            <thead>
              <tr>
                <td />
                <th scope="col" className="px-2 font-normal text-zinc-500">
                  rosso
                </th>
                <th scope="col" className="px-2 font-normal text-zinc-500">
                  bianco
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Alice", "alice"],
                ["Bob", "bob"],
              ].map(([nome, chi]) => {
                const n = sere.length;
                const pr = n
                  ? Math.round(
                      (100 * sere.filter((x) => x[chi] === "R").length) / n,
                    )
                  : null;
                return (
                  <tr key={chi}>
                    <th scope="row" className="pr-2 text-right font-normal">
                      {nome}
                    </th>
                    <td className="border border-zinc-300 px-2 py-0.5 font-mono tabular-nums dark:border-zinc-700">
                      {pr === null ? "—" : `${pr}%`}
                    </td>
                    <td className="border border-zinc-300 px-2 py-0.5 font-mono tabular-nums dark:border-zinc-700">
                      {pr === null ? "—" : `${100 - pr}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            obiettivo: metà in ogni casella
          </span>
        </div>
        <Dato
          etichetta="3. Colori diversi, con qualunque portata"
          valore={percento(
            sere.length ? (sere.length - uguali) / sere.length : null,
          )}
          enfasi
          nota={`obiettivo: solo metà · ${sere.length - uguali} su ${sere.length} sere`}
        />
      </div>
      <div className="pb-6">
        <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
          Obiettivo 3 sulla barra: sotto la tacca di 5/9 nessuna strategia
          scende (lo vedremo in seguito); servono alcune centinaia di sere per
          raggiungere l'obiettivo.
        </p>
        <Barra
          valore={sere.length ? (sere.length - uguali) / sere.length : null}
          colore="bg-violet-700"
          tacche={[
            { valore: 0.5, etichetta: "1/2 = 50%", lato: "sinistra" },
            {
              valore: 5 / 9,
              etichetta: "5/9 ≈ 55,6%: minimo con una strategia",
            },
          ]}
        />
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        I camerieri scelgono le portate ciascuno per conto suo: la stessa
        portata capita solo una sera su tre, eppure in quelle sere i vini sono
        sempre opposti. Tutti e tre gli obiettivi sono raggiunti, come nel
        registro del ristorante stregato.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Capitolo 2 — tre portate
// ---------------------------------------------------------------------------

const VELOCITA = [
  { id: "1", testo: "una sera" },
  { id: "50", testo: "50 per volta" },
  { id: "1000", testo: "1000 per volta" },
];

const vuoto = () => ({
  uguali: 0,
  diversi: 0,
  nDiverse: 0,
  oppDiverse: 0,
  cella: PORTATE.map(() => PORTATE.map(() => ({ o: 0, n: 0 }))),
});

function aggiungi(stat, s) {
  const cella = stat.cella.map((r) => r.map((c) => ({ ...c })));
  const opp = s.alice !== s.bob;
  const diverse = s.a !== s.b;
  cella[s.a][s.b].n += 1;
  if (opp) cella[s.a][s.b].o += 1;
  return {
    uguali: stat.uguali + (opp ? 0 : 1),
    diversi: stat.diversi + (opp ? 1 : 0),
    nDiverse: stat.nDiverse + (diverse ? 1 : 0),
    oppDiverse: stat.oppDiverse + (diverse && opp ? 1 : 0),
    cella,
  };
}

function Pallino({ colore }) {
  return (
    <span
      className="inline-block h-3 w-3 rounded-full border border-zinc-500"
      style={{ background: colore === "R" ? "#9f1239" : "#eadb7a" }}
      aria-label={NOME_COLORE[colore]}
    />
  );
}

const MONOCOLORI = LISTE.filter((l) => ugualiSuNove(l) === 0);
const MISTI = LISTE.filter((l) => ugualiSuNove(l) > 0);

/** Pesi delle 8 schede a partire dalla quota di accordi misti (0–1). */
function pesiDaQuota(quotaMisti) {
  return Object.fromEntries(
    LISTE.map((l) => [
      l,
      MISTI.includes(l) ? quotaMisti / MISTI.length : (1 - quotaMisti) / 2,
    ]),
  );
}

function Pallini({ lista }) {
  return (
    <span className="inline-flex gap-1">
      {[...lista].map((c, i) => (
        <Pallino key={i} colore={c} />
      ))}
    </span>
  );
}

function Tipologia({ titolo, accordi, opposti, nota }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <p className="text-sm font-semibold">
        {titolo}{" "}
        <span className="font-normal text-zinc-500">
          · {accordi.length} schede · con portate diverse opposti {opposti} su 6
        </span>
      </p>
      <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">{nota}</p>
      <table className="text-sm">
        <thead>
          <tr className="text-xs text-zinc-500">
            <th scope="col" className="pr-4 text-left font-normal">
              Alice · 0 1 2
            </th>
            <th scope="col" className="text-left font-normal">
              Bob · 0 1 2
            </th>
          </tr>
        </thead>
        <tbody>
          {accordi.map((l) => (
            <tr key={l}>
              <td className="py-0.5 pr-4">
                <Pallini lista={l} />
              </td>
              <td className="py-0.5">
                <Pallini lista={complementare(l)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditorAccordi({ quota, onCambia }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Una scheda dà un vino per ogni portata (i pallini sono antipasto, primo
        e secondo): le schede di Alice sono 2 × 2 × 2 = 8, e Bob ha sempre
        quella opposta. Si dividono in due soli tipi, e dentro ciascun tipo sono
        tutte equivalenti.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Tipologia
          titolo="Monocolori"
          accordi={MONOCOLORI}
          opposti={6}
          nota="Stesso vino per tutte le portate: con portate diverse i vini sono sempre opposti."
        />
        <Tipologia
          titolo="Miste"
          accordi={MISTI}
          opposti={2}
          nota="Un vino due volte e l'altro una volta: con portate diverse, opposti un terzo delle volte."
        />
      </div>
      <div>
        <label className="block text-sm" htmlFor="quota-misti">
          Sere con una scheda mista: <strong>{quota}%</strong> · monocolore:{" "}
          <strong>{100 - quota}%</strong>
        </label>
        <input
          id="quota-misti"
          type="range"
          min="0"
          max="100"
          step="5"
          value={quota}
          onChange={(e) => onCambia(Number(e.target.value))}
          className="w-full max-w-md"
        />
      </div>
    </div>
  );
}

function Rapporto({ titolo, stat, atteso }) {
  const p = stat.nDiverse ? stat.oppDiverse / stat.nDiverse : null;
  const tot = stat.uguali + stat.diversi;
  const pd = tot ? stat.diversi / tot : null;
  const r = stat.uguali ? stat.diversi / stat.uguali : null;
  return (
    <Riquadro titolo={titolo}>
      <div className="mb-3 flex flex-wrap gap-5">
        <Dato
          etichetta="Colori diversi, su tutte le sere"
          valore={percento(pd)}
          enfasi
          nota={`atteso ${percento(atteso)} · ${stat.diversi} su ${tot} sere`}
        />
        <Dato
          etichetta="Opposti, con portate diverse"
          valore={percento(p)}
          nota={`${stat.oppDiverse} su ${stat.nDiverse} sere · diversi ÷ uguali ${formatta(r)}`}
        />
      </div>
      <Barra
        valore={pd}
        tacche={[
          { valore: 0.5, etichetta: "1/2", lato: "sinistra" },
          { valore: 5 / 9, etichetta: "5/9: minimo con una strategia" },
        ]}
      />
      <p className="mt-7 mb-1 text-xs text-zinc-500">
        Vini opposti per coppia di portate (Alice ↓, Bob →; 0 antipasto, 1
        primo, 2 secondo)
      </p>
      <table className="text-center text-xs">
        <caption className="sr-only">
          Vini opposti per coppia di portate
        </caption>
        <thead>
          <tr>
            <th scope="col" />
            {PORTATE.map((q) => (
              <th key={q} scope="col" className="px-3 font-normal">
                {PORTATE.indexOf(q)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PORTATE.map((q, a) => (
            <tr key={q}>
              <th scope="row" className="pr-2 text-right font-normal">
                {a}
              </th>
              {PORTATE.map((w, b) => {
                const c = stat.cella[a][b];
                return (
                  <td key={w} className="px-2 py-1 font-mono">
                    {c.n ? percento(c.o / c.n, 0) : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Riquadro>
  );
}

export function TrePortate() {
  const [quota, setQuota] = useState(50);
  const pesi = useMemo(() => pesiDaQuota(quota / 100), [quota]);
  const [velocita, setVelocita] = useState("50");
  const [attivo, setAttivo] = useState(false);
  const [statL, setStatL] = useState(vuoto);
  const [statQ, setStatQ] = useState(vuoto);
  const rng = useRef(creaRng(11));
  // Generatore separato: le schede del ristorante normale non toccano
  // la sequenza delle sere del ristorante stregato.
  const rngQ = useRef(creaRng(12));

  const pDiverse = pOppostiDiverseListe(pesi);
  const pTeorica = pDiverse === null ? null : 1 / 3 + (2 / 3) * pDiverse;

  const azzeraNormale = () => {
    setStatL(vuoto());
    rng.current = creaRng(semeCasuale());
  };

  const azzera = () => {
    azzeraNormale();
    setStatQ(vuoto());
    rngQ.current = creaRng(semeCasuale());
  };

  const servi = useCallback(() => {
    const n = Number(velocita);
    setStatL((s) => {
      let t = s;
      for (let i = 0; i < n; i++)
        t = aggiungi(t, seraPortate({ modo: "liste", pesi }, rng.current));
      return t;
    });
    setStatQ((s) => {
      let t = s;
      for (let i = 0; i < n; i++)
        t = aggiungi(t, seraPortate({ modo: "stregata" }, rngQ.current));
      return t;
    });
  }, [pesi, velocita]);

  useIntervallo(servi, 400, attivo);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Pulsante primario onClick={() => setAttivo((a) => !a)}>
          {attivo ? "Pausa" : "Apri i ristoranti"}
        </Pulsante>
        <Pulsante onClick={servi} disabled={attivo}>
          Servi
        </Pulsante>
        <Pulsante onClick={azzera}>Azzera</Pulsante>
        <Schede
          etichetta="Sere per volta"
          voci={VELOCITA}
          valore={velocita}
          onCambia={setVelocita}
        />
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-2">
        <div className="space-y-3">
          <Riquadro titolo="Ristorante normale · le schede di Alice e Bob">
            <EditorAccordi
              quota={quota}
              onCambia={(q) => {
                setQuota(q);
                azzeraNormale();
              }}
            />
            <p className="mt-2 text-sm">
              Con questa scelta i colori sono diversi{" "}
              <strong>{percento(pTeorica)}</strong> delle sere (con portate
              diverse, opposti {percento(pDiverse)}). Il minimo possibile è 5/9
              (55,6%), con sole schede miste.
            </p>
          </Riquadro>
          <Rapporto
            titolo="Ristorante normale · risultati"
            stat={statL}
            atteso={pTeorica}
          />
        </div>
        <div className="space-y-3">
          <Riquadro titolo="Ristorante stregato · nessuna scheda">
            <p className="text-sm">
              Qui Alice e Bob non hanno schede né strategie: ordinano e basta.
              Le schede del ristorante normale non lo riguardano, e cambiarle
              non azzera i suoi conti.
            </p>
          </Riquadro>
          <Rapporto
            titolo="Ristorante stregato · risultati"
            stat={statQ}
            atteso={0.5}
          />
        </div>
      </div>
    </div>
  );
}
