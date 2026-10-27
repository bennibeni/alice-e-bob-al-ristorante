"use client";

// Il racconto di R04: Alice e Bob tra due ristoranti gemelli, uno normale
// (gusti scritti in anticipo: variabili nascoste locali) e uno stregato
// (bottiglie gemelle: entanglement), fino al teorema di Bell.
// Ogni capitolo ha illustrazione (public/r04), testo, lezione, simulazione
// e riferimenti ufficiali.

import { BottleWine, Wine } from "lucide-react";
import dynamic from "next/dynamic";
import { Problema } from "./problema";
import { TabellaAccordi } from "./sim/TabellaAccordi";
import { TeoremaBell } from "./teorema";
import { ParalleloFisica } from "./ParalleloFisica";
import { CorrelatoreInfo } from "./CorrelatoreInfo";
import { CodiceCalcolatrice } from "./CodiceCalcolatrice";

function Caricamento() {
  return (
    <p className="py-8 text-center text-sm text-zinc-500">
      Apparecchiamo la tavola…
    </p>
  );
}

const sim = (carica) => dynamic(carica, { ssr: false, loading: Caricamento });

const GustiOpposti = sim(() =>
  import("./sim/SimPortate").then((m) => m.GustiOpposti),
);
const TrePortate = sim(() =>
  import("./sim/SimPortate").then((m) => m.TrePortate),
);
const SfidaChef = sim(() => import("./sim/SimSfida").then((m) => m.SfidaChef));
const MenuStelle = sim(() => import("./sim/MenuStelle"));
const TerzoOspite = sim(() => import("./sim/TerzoOspite"));
const MenuDegustazione = sim(() =>
  import("./sim/SimQuadrato").then((m) => m.MenuDegustazione),
);
const Contabile = sim(() =>
  import("./sim/SimContabile").then((m) => m.Contabile),
);
const NessunMessaggio = sim(() =>
  import("./sim/SimMessaggi").then((m) => m.NessunMessaggio),
);
const Trucchi = sim(() => import("./sim/SimTrucchi").then((m) => m.Trucchi));
// La sala a nido d’ape conserva la simulazione originale.
const SalaAlveare = sim(() => import("../archivio/R60/v4/Pagina"));
const GiocoVenti = sim(() => import("./sim/SimVenti"));
const Terrazza = sim(() => import("./sim/SimTerrazza"));

function P({ children }) {
  return <p className="leading-relaxed">{children}</p>;
}

function A() {
  return <strong className="text-rose-700 dark:text-rose-300">Alice</strong>;
}

function B() {
  return <strong className="text-sky-700 dark:text-sky-300">Bob</strong>;
}

// Riferimenti ufficiali (articoli originali, DOI o archivi pubblici).
const R = {
  epr: {
    testo:
      "A. Einstein, B. Podolsky, N. Rosen, «Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?», Physical Review 47, 777 (1935)",
    url: "https://doi.org/10.1103/PhysRev.47.777",
  },
  bohr: {
    testo:
      "N. Bohr, «Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?», Physical Review 48, 696 (1935)",
    url: "https://doi.org/10.1103/PhysRev.48.696",
  },
  born: {
    testo:
      "A. Einstein, lettera a M. Born del 3 marzo 1947 («spukhafte Fernwirkung»), in The Born–Einstein Letters, Macmillan (1971)",
  },
  bell: {
    testo:
      "J. S. Bell, «On the Einstein Podolsky Rosen Paradox», Physics 1, 195 (1964)",
    url: "https://doi.org/10.1103/PhysicsPhysiqueFizika.1.195",
  },
  mermin: {
    testo:
      "N. D. Mermin, «Bringing home the atomic world: Quantum mysteries for anybody», American Journal of Physics 49, 940 (1981)",
    url: "https://doi.org/10.1119/1.12594",
  },
  mermin1990: {
    testo:
      "N. D. Mermin, «Simple unified form for the major no-hidden-variables theorems», Physical Review Letters 65, 3373 (1990)",
    url: "https://doi.org/10.1103/PhysRevLett.65.3373",
  },
  mermin1993: {
    testo:
      "N. D. Mermin, «Hidden variables and the two theorems of John Bell», Reviews of Modern Physics 65, 803 (1993)",
    url: "https://doi.org/10.1103/RevModPhys.65.803",
  },
  aravind: {
    testo:
      "P. K. Aravind, «The magic squares and Bell's theorem» (2002), arXiv:quant-ph/0206070",
    url: "https://arxiv.org/abs/quant-ph/0206070",
  },
  cleve: {
    testo:
      "R. Cleve, P. Høyer, B. Toner, J. Watrous, «Consequences and Limits of Nonlocal Strategies» (2004), arXiv:quant-ph/0404076",
    url: "https://arxiv.org/abs/quant-ph/0404076",
  },
  chsh: {
    testo:
      "J. F. Clauser, M. A. Horne, A. Shimony, R. A. Holt, «Proposed Experiment to Test Local Hidden-Variable Theories», Physical Review Letters 23, 880 (1969)",
    url: "https://doi.org/10.1103/PhysRevLett.23.880",
  },
  tsirelson: {
    testo:
      "B. S. Cirel'son, «Quantum generalizations of Bell's inequality», Letters in Mathematical Physics 4, 93 (1980)",
    url: "https://doi.org/10.1007/BF00417500",
  },
  hardy: {
    testo:
      "L. Hardy, «Nonlocality for two particles without inequalities for almost all entangled states», Physical Review Letters 71, 1665 (1993)",
    url: "https://doi.org/10.1103/PhysRevLett.71.1665",
  },
  grw: {
    testo:
      "G. C. Ghirardi, A. Rimini, T. Weber, «A general argument against superluminal transmission through the quantum mechanical measurement process», Lettere al Nuovo Cimento 27, 293 (1980)",
    url: "https://doi.org/10.1007/BF02817964",
  },
  pearle: {
    testo:
      "P. M. Pearle, «Hidden-Variable Example Based upon Data Rejection», Physical Review D 2, 1418 (1970)",
    url: "https://doi.org/10.1103/PhysRevD.2.1418",
  },
  pr: {
    testo:
      "S. Popescu, D. Rohrlich, «Quantum nonlocality as an axiom», Foundations of Physics 24, 379 (1994)",
    url: "https://doi.org/10.1007/BF02058098",
  },
  aspect: {
    testo:
      "A. Aspect, J. Dalibard, G. Roger, «Experimental Test of Bell's Inequalities Using Time-Varying Analyzers», Physical Review Letters 49, 1804 (1982)",
    url: "https://doi.org/10.1103/PhysRevLett.49.1804",
  },
  hensen: {
    testo:
      "B. Hensen et al., «Loophole-free Bell inequality violation using electron spins separated by 1.3 kilometres», Nature 526, 682 (2015)",
    url: "https://doi.org/10.1038/nature15759",
  },
  giustina: {
    testo:
      "M. Giustina et al., «Significant-Loophole-Free Test of Bell's Theorem with Entangled Photons», Physical Review Letters 115, 250401 (2015)",
    url: "https://doi.org/10.1103/PhysRevLett.115.250401",
  },
  shalm: {
    testo:
      "L. K. Shalm et al., «Strong Loophole-Free Test of Local Realism», Physical Review Letters 115, 250402 (2015)",
    url: "https://doi.org/10.1103/PhysRevLett.115.250402",
  },
  bigbell: {
    testo:
      "The BIG Bell Test Collaboration, «Challenging local realism with human choices», Nature 557, 212 (2018)",
    url: "https://doi.org/10.1038/s41586-018-0085-3",
  },
  aerts: {
    testo:
      "D. Aerts et al., «Spin and Wind Directions I: Identifying Entanglement in Nature and Cognition», Foundations of Science 23, 323 (2018)",
    url: "https://arxiv.org/abs/1508.00434",
  },
  videoBell: {
    testo: "Massimiliano Sassoli de Bianchi, «La dimostrazione completa delle diseguaglianze di Bell (24)» — video, dal minuto 3:41",
    url: "https://www.youtube.com/watch?v=59N46vZyS3k&t=221s",
  },
  videoEntanglement: {
    testo: "Massimiliano Sassoli de Bianchi, «Qual è il mistero dell’entanglement quantistico? (20)» — video",
    url: "https://www.youtube.com/watch?v=AknvAmoXDuM",
  },
  videoVenti: {
    testo: "Massimiliano Sassoli de Bianchi, «La mente quantistica: pensieri entangled come gli spin (98)» — approfondimento sull’esperimento cognitivo delle direzioni del vento; distinto dal modello meteorologico di questo capitolo",
    url: "https://www.youtube.com/watch?v=GkXDCwzsXSg",
  },
  nobel: {
    testo:
      "Premio Nobel per la Fisica 2022 ad A. Aspect, J. F. Clauser e A. Zeilinger",
    url: "https://www.nobelprize.org/prizes/physics/2022/summary/",
  },
};

const NOMI_PORTATE = ["antipasto", "primo", "secondo"];
const COLORE_VINO = { R: "#9f1239", B: "#eadb7a" };
const opposto = (c) => (c === "R" ? "B" : "R");

function Bicchierino({ c }) {
  return (
    <span
      className="inline-block h-3 w-3 rounded-full border border-zinc-500 align-middle"
      style={{ background: COLORE_VINO[c] }}
      aria-label={c === "R" ? "rosso" : "bianco"}
    />
  );
}

/** Le 6 sere con portate diverse per una coppia di schede opposte. */
function TabellaSei({ alice }) {
  const bob = [...alice].map(opposto).join("");
  const nome = (c) => (c === "R" ? "rosso" : "bianco");
  const Nome = (p) => p.charAt(0).toUpperCase() + p.slice(1);
  const righe = [];
  for (let a = 0; a < 3; a++)
    for (let b = 0; b < 3; b++) if (a !== b) righe.push([a, b]);
  return (
    <table
      className="my-2 text-sm"
      aria-label="Le sei sere con portate diverse"
    >
      <thead>
        <tr className="text-xs text-zinc-500">
          <th scope="col" className="pr-3 text-left font-normal">
            Portata di Alice
          </th>
          <th scope="col" className="pr-3 text-left font-normal">
            Portata di Bob
          </th>
          <th scope="col" className="pr-3 text-left font-normal">
            Vino di Alice
          </th>
          <th scope="col" className="pr-3 text-left font-normal">
            Vino di Bob
          </th>
          <th scope="col" className="text-left font-normal">
            Confronto
          </th>
        </tr>
      </thead>
      <tbody>
        {righe.map(([a, b]) => {
          const opp = alice[a] !== bob[b];
          return (
            <tr key={`${a}${b}`}>
              <td className="pr-3">{Nome(NOMI_PORTATE[a])}</td>
              <td className="pr-3">{Nome(NOMI_PORTATE[b])}</td>
              <td className="pr-3">
                <Bicchierino c={alice[a]} /> {nome(alice[a])}
              </td>
              <td className="pr-3">
                <Bicchierino c={bob[b]} /> {nome(bob[b])}
              </td>
              <td
                className={
                  opp
                    ? "font-semibold text-rose-700 dark:text-rose-400"
                    : "text-zinc-500"
                }
              >
                {opp ? "opposti" : "uguali"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Tabella «Fisica ↔ Ristorante» dei paralleli con la fisica. */
function Corrispondenza({ righe }) {
  return (
    <table
      className="w-full text-left text-sm"
      aria-label="Corrispondenza fra fisica e ristorante"
    >
      <thead>
        <tr className="text-xs text-zinc-500">
          <th scope="col" className="pr-4 font-normal">
            Fisica
          </th>
          <th scope="col" className="font-normal">
            Ristorante
          </th>
        </tr>
      </thead>
      <tbody>
        {righe.map(([f, r]) => (
          <tr
            key={f}
            className="border-t border-zinc-200 align-top dark:border-zinc-800"
          >
            <td className="py-1 pr-4">{f}</td>
            <td className="py-1">{r}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Le due schede di una sera: un vino per portata, Bob sempre l'opposto. */
function TabellaListe({ alice }) {
  const bob = [...alice].map(opposto).join("");
  const nome = (c) => (c === "R" ? "rosso" : "bianco");
  return (
    <table className="my-2 text-sm" aria-label="Le schede di Alice e di Bob">
      <thead>
        <tr className="text-xs text-zinc-500">
          <th scope="col" className="pr-4 text-left font-normal">
            Portata
          </th>
          <th scope="col" className="pr-4 text-left font-normal">
            Alice
          </th>
          <th scope="col" className="text-left font-normal">
            Bob
          </th>
        </tr>
      </thead>
      <tbody>
        {NOMI_PORTATE.map((p, k) => (
          <tr key={p}>
            <th scope="row" className="pr-4 text-left font-normal">
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </th>
            <td className="pr-4">
              <Bicchierino c={alice[k]} /> {nome(alice[k])}
            </td>
            <td>
              <Bicchierino c={bob[k]} /> {nome(bob[k])}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const FORMATI = ["calice", "bottiglia"];

/** Le schede della sfida (un colore per formato) e l'esito delle quattro combinazioni. */
function SchedeSfida({ alice, bob }) {
  const nome = (c) => (c === "R" ? "rosso" : "bianco");
  const Maiusc = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  return (
    <div className="my-2 flex flex-wrap items-start gap-x-10 gap-y-3">
      <table className="text-sm" aria-label="Le schede di Alice e di Bob">
        <thead>
          <tr className="text-xs text-zinc-500">
            <th scope="col" className="pr-4 text-left font-normal">
              Formato
            </th>
            <th scope="col" className="pr-4 text-left font-normal">
              Alice
            </th>
            <th scope="col" className="text-left font-normal">
              Bob
            </th>
          </tr>
        </thead>
        <tbody>
          {FORMATI.map((f, k) => (
            <tr key={f}>
              <th scope="row" className="pr-4 text-left font-normal">
                {Maiusc(f)}
              </th>
              <td className="pr-4">
                <Bicchierino c={alice[k]} /> {nome(alice[k])}
              </td>
              <td>
                <Bicchierino c={bob[k]} /> {nome(bob[k])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <table
        className="text-sm"
        aria-label="Le quattro combinazioni di formati"
      >
        <thead>
          <tr className="text-xs text-zinc-500">
            <th scope="col" className="pr-3 text-left font-normal">
              Alice
            </th>
            <th scope="col" className="pr-3 text-left font-normal">
              Bob
            </th>
            <th scope="col" className="pr-3 text-left font-normal">
              Colori
            </th>
            <th scope="col" className="text-left font-normal">
              Cena
            </th>
          </tr>
        </thead>
        <tbody>
          {[0, 1].flatMap((a) =>
            [0, 1].map((b) => {
              const uguali = alice[a] === bob[b];
              const vinta = a === 1 && b === 1 ? uguali : !uguali;
              return (
                <tr key={`${a}${b}`}>
                  <td className="pr-3">{FORMATI[a]}</td>
                  <td className="pr-3">{FORMATI[b]}</td>
                  <td className="pr-3">
                    <Bicchierino c={alice[a]} /> <Bicchierino c={bob[b]} />{" "}
                    {uguali ? "uguali" : "diversi"}
                  </td>
                  <td
                    className={
                      vinta
                        ? "font-semibold text-emerald-700 dark:text-emerald-400"
                        : "font-semibold text-rose-700 dark:text-rose-400"
                    }
                  >
                    {vinta ? "offerta" : "si paga"}
                  </td>
                </tr>
              );
            }),
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Un'ordinazione della sfida: chi e in che formato. */
function Ordine({ chi, formato }) {
  const Icona = formato === "calice" ? Wine : BottleWine;
  const colore =
    chi === "Alice"
      ? "border-rose-300 text-rose-800 dark:border-rose-800 dark:text-rose-200"
      : "border-sky-300 text-sky-800 dark:border-sky-800 dark:text-sky-200";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${colore}`}
    >
      <Icona aria-hidden="true" className="h-3.5 w-3.5" />
      {chi} in {formato}
    </span>
  );
}

/** Un passo del ragionamento: due ordinazioni, uguali (=) o diverse (≠). */
function Confronto({ a, b, uguali = true }) {
  return (
    <span className="my-1 flex flex-wrap items-center gap-2">
      <Ordine chi={a[0]} formato={a[1]} />
      <span
        className="font-mono text-base"
        aria-label={uguali ? "stesso colore di" : "colore diverso da"}
      >
        {uguali ? "=" : "≠"}
      </span>
      <Ordine chi={b[0]} formato={b[1]} />
    </span>
  );
}

/** Un'ordinazione con il suo colore: chip della sfida e pallino del vino. */
function OrdineColore({ chi, formato, c }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Ordine chi={chi} formato={formato} />
      <Bicchierino c={c} />
      <span className="text-xs">{c === "R" ? "rosso" : "bianco"}</span>
    </span>
  );
}

/** Una regola del contabile: «se … allora …», oppure un divieto. */
function Regola({ se, allora, mai }) {
  return (
    <span className="my-1 flex flex-wrap items-center gap-2 text-sm">
      {mai ? (
        <>
          <span className="font-semibold text-rose-700 dark:text-rose-400">
            mai
          </span>
          <OrdineColore {...mai[0]} />
          <span>e</span>
          <OrdineColore {...mai[1]} />
        </>
      ) : (
        <>
          <span>se</span>
          <OrdineColore {...se} />
          <span>e</span>
          <Ordine chi={allora.chi} formato={allora.formato} />
          <span aria-label="allora">→</span>
          <Bicchierino c={allora.c} />
          <span className="text-xs">
            {allora.c === "R" ? "rossa" : "bianca"}
          </span>
        </>
      )}
    </span>
  );
}

export const CAPITOLI = [
  {
    id: "prologo",
    numero: "Prologo",
    titolo: "Due ristoranti gemelli",
    immagine: "/r04/0-prologo.svg",
    alt: "Due ristoranti identici nella stessa via, il Ristorante Normale e il Ristorante Stregato; Alice e Bob in mezzo li indicano.",
    domanda: "Che cosa succede quando due amici cenano senza potersi parlare?",
    Testo: () => (
      <>
        <P>Nei dodici capitoli che seguono accompagneremo Alice e Bob in situazioni diverse: dalle cene in sale separate alle sfide del proprietario, fino ai giochi e alle ordinazioni allo stesso tavolo in terrazza. Ogni situazione ci aiuterà a capire che cosa possono spiegare gli accordi fra i due amici e che cosa rende sorprendenti le correlazioni quantistiche.</P>
        <P>Cominciamo presentando i due ristoranti e lo scenario della prima cena, da cui prenderà avvio il Capitolo 1.</P>
        <P>
          In fondo alla stessa via ci sono due ristoranti identici: stesse sale,
          stesso menù, stessa cantina, almeno all'apparenza. Il primo è un
          ristorante normale. Del secondo, in quartiere, dicono che è stregato.
        </P>
        <P>
          <A /> e <B /> li frequentano entrambi, sempre con la stessa abitudine
          strana: si siedono in due sale diverse, separate dalla cucina, e
          durante la cena nessuno passa da una sala all'altra. Niente telefoni,
          niente bigliettini: per tutta la cena non sanno nulla l'uno
          dell'altra.
        </P>
        <P>
          <strong>
            Ogni sala ha il suo cameriere. Il menù ha tre portate, che numeriamo
            per comodità: antipasto (0), primo (1) e secondo (2). A ogni cena
            ciascun cameriere sceglie a caso, per il cliente della sua sala,{" "}
            <span className="text-rose-700 dark:text-rose-400">
              una sola portata per cui chiedere il vino
            </span>
          </strong>
          ; i due camerieri non si parlano. Alice e Bob rispondono con una
          parola sola, rosso o bianco. Il proprietario dei due locali tiene un
          registro speciale in cui annota, sera dopo sera e per ciascuna sala,
          il numero della portata scelta dal cameriere e il vino ordinato. Il
          resto della storia è il tentativo di capire che cosa ha di strano il
          ristorante stregato.
        </P>
      </>
    ),
    lezione:
      "Tre regole valgono in entrambi i ristoranti: Alice e Bob non comunicano; le domande dei camerieri sono decise a caso sul momento; si guarda solo il registro di tante sere.",
  },
  {
    id: "gusti",
    numero: "Capitolo 1",
    titolo: "Gusti opposti",
    immagine: "/r04/1-gusti.svg",
    alt: "Il cameriere, vedendo il calice di rosso di Alice, pensa che a Bob arriverà il bianco; a destra la scritta «spukhafte Fernwirkung», Einstein 1947.",
    domanda: "Se scelgono sempre vini opposti, devono per forza parlarsi?",
    Testo: () => (
      <>
        <P>
          In tutti e due i ristoranti sono in gioco gli stessi tre risultati,
          che il proprietario controlla su un registro speciale:
        </P>
        <ol className="ml-5 list-decimal space-y-1.5 leading-relaxed">
          <li>
            <strong>Con la stessa portata, i vini sono sempre opposti.</strong>{" "}
            Le sere in cui i camerieri scelgono per <A /> e per <B /> la stessa
            portata, se lei ordina rosso lui ordina bianco, e viceversa.
          </li>
          <li>
            <strong>Preso da solo, ognuno sembra ordinare a caso.</strong> Nel
            registro di Alice (o di Bob), per qualunque portata, metà delle sere
            c'è rosso e metà bianco.
          </li>
          <li>
            <strong>Nel complesso, metà uguali e metà diversi.</strong> Contando
            tutte le sere insieme, senza distinguere le portate scelte dai
            camerieri, a lungo andare Alice e Bob scelgono lo stesso vino in
            metà delle sere e diverso nell'altra metà.
          </li>
        </ol>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/30">
            <p className="mb-1 font-semibold">Ristorante normale</p>
            <p className="leading-relaxed">
              Per Alice e Bob i tre risultati sono <strong>obiettivi</strong>:
              se li danno per gioco, e sulla porta, prima di separarsi,
              concordano una strategia per raggiungerli. Domanda:{" "}
              <strong>esiste una strategia che ci riesce?</strong>
            </p>
          </div>
          <div className="rounded-lg border border-violet-300 bg-violet-50 p-3 text-sm dark:border-violet-800 dark:bg-violet-950/30">
            <p className="mb-1 font-semibold">Ristorante stregato</p>
            <p className="leading-relaxed">
              Nessuna strategia: nessuno ha mai visto Alice e Bob accordarsi, e
              durante la cena non si parlano. Eppure il registro mostra{" "}
              <strong>tutti e tre i risultati</strong>, sera dopo sera. Domanda:{" "}
              <strong>come si spiega?</strong>
            </p>
          </div>
        </div>
        <P>
          <strong>Le prime strategie.</strong> Nel ristorante normale
          l'obiettivo 1 si raggiunge con una strategia che non guarda la
          portata: Alice ordina sempre rosso e Bob sempre bianco. Ma così
          l'obiettivo 2 fallisce. Va meglio la sua versione con il sorteggio:
          prima di entrare Alice e Bob tirano a sorte insieme chi prende il
          rosso per tutta la sera. Gli obiettivi 1 e 2 sono raggiunti.
        </P>
        <P>
          L'obiettivo 3, però, no. Per rispettare l'obiettivo 1 i vini devono
          essere opposti quando le portate sono uguali; ma se la scelta del vino
          non dipende dalla portata, restano opposti in tutte le sere, comprese
          quelle in cui le portate sono diverse. Il risultato è che Alice e Bob
          scelgono un vino diverso ogni sera, mentre l'obiettivo 3 richiede che
          succeda solo in metà delle sere. Alice e Bob devono quindi tenere
          conto della portata: un vino per l'antipasto, uno per il primo e uno
          per il secondo. Se una strategia così possa bastare è la domanda del
          capitolo 2.
        </P>
        <P>
          <strong>Le sere con la stessa portata.</strong> Per ora guardiamo
          soprattutto queste. Qui i due registri sono identici: nel ristorante
          normale grazie alla strategia, nel ristorante stregato senza nessuna
          strategia concordata. E in entrambi il cameriere di Alice, appena vede
          il suo calice, sa già con certezza che cosa arriverà nell'altra sala,
          senza averci messo piede.
        </P>
        <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
          <P>
            Einstein, Podolsky e Rosen, nel 1935, avrebbero risposto così alla
            domanda sul ristorante stregato. Se posso prevedere con certezza il
            vino di Bob senza disturbarlo in alcun modo, quel vino doveva essere
            già deciso: è un «elemento di realtà». E se la descrizione del
            ristorante non lo contiene, allora è incompleta: devono esserci
            informazioni nascoste, oggi le chiamiamo variabili nascoste. Sotto
            c'è un principio che sembra ovvio, la località: ciò che accade nella
            sala di Alice non può cambiare istantaneamente ciò che accade in
            quella di Bob. In breve: anche nel ristorante stregato c'è una
            strategia, solo che nessuno l'ha vista.
          </P>
          <P>
            Niels Bohr rispose pochi mesi dopo, con un articolo dallo stesso
            titolo. Per lui non ha senso dire che il vino di Bob è già deciso
            per tutte e tre le portate: un vino esiste solo come risposta a una
            domanda precisa, cioè alla portata scelta dal cameriere. Chiedersi
            quale vino Bob avrebbe ordinato per una portata che nessuno gli ha
            chiesto è, secondo Bohr, una domanda senza senso.
          </P>
          <P>
            Per trent'anni, fino al <TeoremaBell /> (1964), restò una disputa
            filosofica: nessuno sapeva come decidere con un esperimento chi
            avesse ragione. Einstein chiamava quell'apparente influenza a
            distanza «spukhafte Fernwirkung», un'azione a distanza da fantasmi.
            Noi diciamo: stregato.
          </P>
        </div>
        <P>
          <strong>Le risposte provvisorie alle due domande.</strong> Ristorante
          normale, «esiste una strategia che ci riesce?»: con la stessa portata
          sì, ma per l'obiettivo 3 serve una strategia che tenga conto della
          portata. Ristorante stregato, «come si spiega?»: se Einstein ha
          ragione, non è davvero stregato, ma nasconde una strategia che nessuno
          ha visto. Il capitolo 2 le verifica entrambe: cerca una strategia che
          raggiunga tutti e tre gli obiettivi, e se non esiste, nemmeno il
          ristorante stregato può nasconderne una.
        </P>
      </>
    ),
    lezione:
      "Nel ristorante normale i tre risultati sono obiettivi da raggiungere con una strategia; nel ristorante stregato si verificano senza nessuna strategia. Con la stessa portata una strategia basta a pareggiare i conti, e per Einstein anche il ristorante stregato ne nasconde una; per metterlo alla prova servono le sere con portate diverse.",
    Sim: GustiOpposti,
    guida: {
      cosa: "Ogni sera ciascun cameriere sceglie a caso, per la sua sala, una portata (0 antipasto, 1 primo, 2 secondo) e chiede il vino: a volte la stessa per Alice e Bob, più spesso diverse. Il ristorante è uno solo, e non sai quale dei due.",
      avvio:
        "Premi «Servi una sera» per una cena alla volta o «Una sera dopo l'altra» per farle scorrere da sole. «Sbircia negli accordi» dice che cosa si sa davvero di Alice e Bob.",
      leggere: (
        <>
          Dall'alto in basso:
          <ul className="mt-1 ml-5 list-disc space-y-1">
            <li>
              <strong>Alice e Bob:</strong> la portata scelta da ciascun
              cameriere e il vino ordinato nell'ultima sera; sotto, se era la
              stessa portata per tutti e due.
            </li>
            <li>
              <strong>Sere servite</strong> e{" "}
              <strong>Sere con la stessa portata</strong>: quante cene finora, e
              in quante i camerieri hanno scelto la stessa portata (circa una su
              tre).
            </li>
            <li>
              <strong>I tre numeri grandi</strong>, uno per obiettivo, con il
              traguardo scritto sotto: il primo deve restare a 0; la tabellina
              del secondo dà rosso e bianco nei registri di Alice e di Bob, e
              ogni casella deve stare vicina al 50%; anche il terzo, la
              percentuale di sere con colori diversi, deve stare vicino al 50%.
              La barra sotto i numeri segue il terzo: la tacca di 5/9 (55,6%) è
              il minimo di colori diversi che una strategia può ottenere, e
              servono alcune centinaia di sere perché il valore si fermi sotto.
            </li>
          </ul>
        </>
      ),
      mostra: (
        <>
          Tutti e tre gli obiettivi sono raggiunti: con la stessa portata vini
          sempre opposti, Alice metà rosso e metà bianco, e nel complesso colori
          diversi solo una volta su due circa. I camerieri non devono scegliere
          la stessa portata: scelgono ciascuno per conto suo, e nelle sere in
          cui per caso la portata coincide (circa una su tre) i vini risultano
          sempre opposti. Sbirciando si scopre che le possibilità sono due:{" "}
          <strong className="text-rose-700 dark:text-rose-400">
            o il ristorante è stregato e non esiste nessun accordo
          </strong>
          , oppure è il ristorante normale e Alice e Bob hanno una strategia che
          nessuno conosce, sempre che una strategia così esista. Il capitolo 2
          lo mette alla prova.
        </>
      ),
    },
    riferimenti: [R.epr, R.bohr, R.born],
  },
  {
    id: "portate",
    numero: "Capitolo 2",
    titolo: "Tre portate",
    immagine: "/r04/2-portate.svg",
    alt: "Un menù con antipasto, primo e secondo; accanto a ogni portata un calice di Alice e uno di Bob, sempre di colore opposto.",
    domanda: "Che cosa succede quando le portate sono diverse?",
    Testo: () => (
      <>
        <P>
          Riprendiamo dal capitolo 1. Nel ristorante normale Alice e Bob cercano
          una strategia che raggiunga i tre obiettivi:
        </P>
        <ol className="ml-5 list-decimal space-y-1 leading-relaxed">
          <li>
            <strong>con la stessa portata, vini sempre opposti;</strong>
          </li>
          <li>
            <strong>ognuno, da solo, metà rosso e metà bianco;</strong>
          </li>
          <li>
            <strong>nel complesso, metà uguali e metà diversi.</strong>
          </li>
        </ol>
        <P>
          Le strategie che ignorano la portata mancano l'obiettivo 3. Restano
          quelle che ne tengono conto.
        </P>
        <Problema
          titolo="Il problema della strategia"
          titoloIndagine="La strategia"
          indagine={
            <P>
              Prima di separarsi <A /> e <B /> possono organizzarsi liberamente:
              concordare regole, preparare schede con un vino per ogni portata,
              guardare i risultati delle cene precedenti, tirare a sorte insieme
              (per esempio estraendo uno stuzzicadenti da un bicchiere). Una
              volta nelle rispettive sale, però, ciascuno può usare soltanto
              quello che sa già e la portata scelta dal suo cameriere. Le scelte
              dei camerieri non dipendono da nessuno di questi accordi.
            </P>
          }
          domanda="Una strategia di questo tipo può raggiungere i tre obiettivi? Se sì, descrivila. Se no, dimostra perché."
          soluzione={
            <>
              <ol className="ml-5 list-decimal space-y-3 leading-relaxed">
                <li>
                  <strong>Ogni sera, due schede.</strong> Regole, sorteggi e
                  ricordi delle sere passate servono solo a decidere, prima di
                  separarsi, che cosa risponderà ciascuno per ogni portata. Ogni
                  sera, quindi, Alice entra in sala con una scheda di tre vini e
                  Bob con un'altra.
                </li>
                <li>
                  <strong>
                    L'obiettivo 1 rende le schede opposte, voce per voce.
                  </strong>{" "}
                  Se avessero lo stesso vino per una portata, prima o poi, per
                  puro caso, i due camerieri sceglierebbero entrambi quella
                  portata, e l'obiettivo 1 fallirebbe. Quindi la scheda di Bob è
                  sempre l'opposta di quella di Alice, e basta conoscere quella
                  di Alice. Per esempio, se Alice ha «rosso, rosso, bianco», Bob
                  ha «bianco, bianco, rosso»:
                  <TabellaListe alice="RRB" />
                </li>
                <li>
                  <strong>Le sere con portate diverse.</strong> Con la stessa
                  portata i vini sono ora opposti per costruzione. Resta da
                  vedere che cosa succede quando le portate sono diverse, perché
                  è lì che si decide l'obiettivo 3. Le sere con portate diverse
                  sono sei, tutte ugualmente probabili. Poiché la scheda di Bob
                  dipende da quella di Alice, basta guardare quella di Alice,
                  che ha per forza una di queste due forme:
                  <ul className="mt-1 ml-5 list-disc space-y-2">
                    <li>
                      <strong>schede monocolori</strong>(*), con lo stesso vino
                      per tutte e tre le portate: Bob ha sempre il vino opposto,
                      e i vini sono opposti in tutte e sei le sere. Per esempio,
                      con Alice sempre rosso e Bob sempre bianco:
                      <TabellaSei alice="RRR" />
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        (*) Sono le strategie che ignorano la portata, già
                        scartate nel capitolo 1, ma conviene tenerle nel conto
                        perché si possono mescolare con le altre.
                      </p>
                    </li>
                    <li>
                      <strong>schede miste</strong>, con un vino due volte e
                      l'altro una volta: i vini sono opposti solo due volte su
                      sei, cioè un terzo delle volte. Per esempio, con Alice
                      «rosso, rosso, bianco» e Bob «bianco, bianco, rosso»:
                      <TabellaSei alice="RRB" />
                      Cambiare l'ordine o scambiare rosso e bianco non cambia la
                      proporzione.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>La conclusione.</strong> Nelle sere in cui i camerieri
                  scelgono portate diverse, le schede danno vini opposti o tutte
                  le volte (schede monocolori) o un terzo delle volte (schede
                  miste). Cambiandole o sorteggiandole da una sera all'altra si
                  ottiene una media fra questi due valori, mai meno di un terzo:
                  esattamente un terzo solo usando sempre schede miste. Per
                  questo, in quelle sere, i vini sono opposti almeno un terzo
                  delle volte. Ora contiamo tutte le sere. In una sera su tre i
                  camerieri scelgono la stessa portata, e i vini sono sempre
                  opposti; nelle altre due sono opposti almeno un terzo delle
                  volte. In tutto, quindi, i vini sono opposti almeno 1/3 × 1
                  (le sere con la stessa portata) + 2/3 × 1/3 (quelle con
                  portate diverse) = 5/9 delle sere, più della metà: l'obiettivo
                  3 è irraggiungibile.
                </li>
              </ol>
              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <P>
                  <strong>Due osservazioni. La prima:</strong> l'obiettivo 2
                  (ognuno, da solo, metà rosso e metà bianco) non entra nel
                  ragionamento, perché gli obiettivi 1 e 3 bastano da soli a
                  escludere ogni strategia. Non è però superfluo: è un obiettivo
                  da rispettare, per due motivi:
                </P>
                <ol className="ml-5 list-decimal space-y-1">
                  <li>
                    <strong>Esclude le spiegazioni banali:</strong> senza di
                    esso, per l'obiettivo 1 basterebbe «Alice sempre rosso, Bob
                    sempre bianco», e i vini opposti non avrebbero nulla di
                    strano.
                  </li>
                  <li>
                    <strong>Descrive quello che si osserva davvero</strong>, nel
                    ristorante stregato come negli esperimenti.
                  </li>
                </ol>
                <P>
                  Rispettare anche l'obiettivo 2 è possibile: tutte le sei
                  schede miste ottengono lo stesso risultato (5/9 delle sere con
                  vini diversi), ed è sufficiente sorteggiare all'ingresso la
                  scheda di Alice fra le sei e dare a Bob l'opposta.
                </P>
                <P>
                  <strong>La seconda:</strong> nemmeno decidere a caso dopo
                  essersi seduti aiuterebbe: quei sorteggi si possono immaginare
                  fatti in anticipo, e per l'obiettivo 1 le risposte così
                  preparate devono comunque essere opposte voce per voce.
                </P>
              </div>
            </>
          }
          parallelo={
            <>
              <P>
                <strong>Lo scenario in fisica.</strong> Una sorgente emette
                coppie di particelle, sempre preparate nello stesso modo, e le
                manda verso due rivelatori lontani. Ogni rivelatore ha un
                selettore con tre posizioni, 0, 1 e 2: tre orientazioni di un
                magnete, a 120° l'una dall'altra.
              </P>
              <P>
                Prima dell'arrivo di ogni particella, ciascun selettore viene
                impostato a caso, in modo indipendente dall'altro e da tutto ciò
                che è successo alla sorgente. Ogni particella viene misurata una
                sola volta, nella posizione del suo selettore, e la misura dà
                uno di due esiti, + o −. Le altre due misure possibili su quella
                particella non vengono fatte.
              </P>
              <P>
                Gli esperimenti e la meccanica quantistica mostrano proprio i
                tre obiettivi: esiti sempre opposti con la stessa posizione,
                metà + e metà − per ciascun rivelatore, esiti diversi solo metà
                delle volte nel complesso. Con posizioni diverse, a 120°, gli
                esiti sono opposti solo una volta su quattro (uguali con
                probabilità sin²60° = 3/4). Le «schede» della soluzione sono le
                proprietà nascoste che la coppia porterebbe con sé dalla
                sorgente: la soluzione dimostra che nessuna proprietà di questo
                tipo spiega i dati.
              </P>
              <Corrispondenza
                righe={[
                  [
                    "Sorgente che prepara la coppia",
                    "Quello che succede prima di cena",
                  ],
                  ["Particella misurata da Alice / da Bob", "Alice / Bob"],
                  [
                    "Due rivelatori lontani",
                    "Due sale, nessuno passa dall'una all'altra",
                  ],
                  [
                    "Selettore di ciascun rivelatore",
                    "Cameriere di ciascuna sala",
                  ],
                  [
                    "Posizione del selettore (0, 1, 2)",
                    "Portata scelta (0, 1, 2)",
                  ],
                  [
                    "Impostazione casuale e indipendente",
                    "Scelta casuale dei due camerieri, che non si parlano",
                  ],
                  ["Esito + / −", "Vino rosso / bianco"],
                  [
                    "Una sola misura per particella",
                    "Una sola portata con il vino per sera",
                  ],
                  [
                    "Dati dell'esperimento",
                    "Registro speciale del proprietario",
                  ],
                  [
                    "Proprietà nascoste, località, libertà di scelta",
                    "Strategia prima di cena, ordine basato solo sulla propria portata, camerieri indipendenti dalla strategia",
                  ],
                ]}
              />
            </>
          }
        />
        <P>
          Ecco le risposte definitive alle due domande del capitolo 1.
          Ristorante normale: nessuna strategia raggiunge i tre obiettivi,
          perché le sere con vini diversi sono almeno 5/9 invece di metà.
          Ristorante stregato: raggiunge tutti e tre senza nessuna strategia,
          quindi non ne nasconde una come pensava Einstein; con portate diverse
          i suoi vini sono opposti solo una volta su quattro, meno del terzo che
          ogni strategia impone. Ogni risultato, preso da solo, sembra innocuo;
          è il loro insieme a essere incompatibile con qualunque strategia fatta
          di accordi e sorteggi. È il <TeoremaBell />, nella forma resa celebre
          da David Mermin.
        </P>
        <details className="group rounded-lg border border-amber-200 bg-white/70 p-3 dark:border-amber-900 dark:bg-zinc-900/50">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">
            Un terzo, 5/9, 1,25: tre modi di leggere lo stesso risultato
          </summary>
          <div className="mt-3 space-y-3">
            <P>
              Tutto parte da come si dividono le sere: i camerieri scelgono a
              caso, quindi in 1/3 delle sere le portate sono uguali e in 2/3
              sono diverse.
            </P>
            <P>
              <strong>1. Le sere con portate diverse.</strong> Con la stessa
              portata i vini sono sempre opposti, in tutti e due i ristoranti:
              la differenza sta tutta nelle sere con portate diverse. Con una
              strategia i vini sono opposti almeno 1/3 delle volte (le schede
              miste 2 su 6, le monocolori 6 su 6); nel ristorante stregato solo
              1/4. Un quarto è meno di un terzo: il ristorante stregato fa una
              cosa che nessuna strategia può fare.
            </P>
            <P>
              <strong>2. Tutte le sere: l'obiettivo 3.</strong> Con una
              strategia le sere con vini diversi sono 1/3 × 1 + 2/3 × 1/3 = 5/9,
              o di più. Nel ristorante stregato sono 1/3 × 1 + 2/3 × 1/4 = 1/3 +
              1/6 = 1/2, proprio l'obiettivo 3.
            </P>
            <P>
              <strong>3. Lo stesso confronto come rapporto.</strong> Dividendo
              le sere con vini diversi per quelle con vini uguali: con una
              strategia almeno 5/9 diverse e al massimo 4/9 uguali, quindi
              diversi ÷ uguali almeno 5/9 ÷ 4/9 = 1,25, cioè per ogni 4 sere
              uguali almeno 5 diverse. Nel ristorante stregato 1/2 ÷ 1/2 = 1,00:
              tante sere diverse quante uguali.
            </P>
            <table className="w-full text-left text-sm">
              <caption className="mb-1 text-left text-xs text-zinc-500">
                Riepilogo
              </caption>
              <thead>
                <tr className="text-xs text-zinc-500">
                  <th scope="col" className="pr-4 font-normal">
                    <span className="sr-only">Grandezza</span>
                  </th>
                  <th scope="col" className="pr-4 font-normal">
                    Con una strategia
                  </th>
                  <th scope="col" className="font-normal">
                    Ristorante stregato
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Opposti con portate diverse", "almeno 1/3", "1/4"],
                  ["Vini diversi su tutte le sere", "almeno 5/9", "1/2"],
                  ["Rapporto diversi ÷ uguali", "almeno 1,25", "1,00"],
                ].map(([g, n, st]) => (
                  <tr
                    key={g}
                    className="border-t border-zinc-200 align-top dark:border-zinc-800"
                  >
                    <th scope="row" className="py-1 pr-4 font-normal">
                      {g}
                    </th>
                    <td className="py-1 pr-4">{n}</td>
                    <td className="py-1">{st}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </>
    ),
    lezione: (
      <>
        Nessuna strategia decisa prima di separarsi raggiunge i tre obiettivi:
        con portate diverse i vini sono opposti almeno un terzo delle volte, e
        in tutto le sere con vini diversi sono almeno 5/9. Il ristorante
        stregato ci riesce senza strategia, con metà delle sere: è il{" "}
        <TeoremaBell />.
      </>
    ),
    Sim: TrePortate,
    guida: {
      cosa: "Ogni sera ciascun cameriere sceglie a caso, per la sua sala, la portata per cui chiedere il vino (0 antipasto, 1 primo, 2 secondo). I due ristoranti lavorano in parallelo: nel ristorante normale Alice e Bob seguono le loro schede, nel ristorante stregato no.",
      avvio:
        "Nel riquadro delle schede del ristorante normale trovi le 8 schede di Alice divise nei due tipi, con quelle opposte di Bob. Con il cursore scegli in quale percentuale di sere usano una scheda mista. Il ristorante stregato non ha schede: il cursore non lo riguarda. Poi premi «Apri i ristoranti» (oppure «Servi»); «sere per volta» regola la velocità.",
      leggere:
        "In ciascun ristorante guarda il numero grande «Colori diversi, su tutte le sere» e la barra con le tacche 1/2 e 5/9. Accanto ci sono i vini opposti con portate diverse e il rapporto diversi ÷ uguali. Sotto, la tabella 3 × 3 dà la percentuale di vini opposti per ogni coppia di portate (Alice in riga, Bob in colonna).",
      mostra:
        "Il ristorante normale non scende mai sotto 5/9: ci arriva solo con il 100% di schede miste, e più monocolori usa più sale (la frase sotto le schede dà il valore esatto). Il ristorante stregato si assesta su metà. Il motivo si vede nella tabella: sulla diagonale (stessa portata) 100% in entrambi; fuori diagonale il ristorante normale ha almeno il 33%, il ristorante stregato solo il 25%.",
    },
    riferimenti: [R.bell, R.mermin, R.videoBell],
  },
  {
    id: "sfida",
    numero: "Capitolo 3",
    titolo: "La sfida dello chef",
    immagine: "/r04/3-sfida.svg",
    alt: "Lo chef davanti a una lavagna con le regole della sfida; Alice alza un calice di rosso, Bob una bottiglia di bianco.",
    domanda: "Quanto spesso possono vincere, se si preparano prima?",
    Testo: () => (
      <>
        <P>
          Lo chef, incuriosito dalle strane doti telepatiche di Alice e Bob,
          decide di metterli alla prova con una sfida.
        </P>
        <Problema
          titolo="Il problema della sfida"
          scenario={
            <>
              <P>
                Stesse sale, stessi camerieri, stesso registro speciale. A ogni
                cena ciascun cameriere sceglie a caso, per il cliente della sua
                sala, se servire il vino in calice o in bottiglia, con la stessa
                probabilità. I due camerieri non si parlano, e nessuno conosce
                in anticipo le loro scelte.
              </P>
              <P>
                <A /> e <B />, che non sanno come è stato servito l'altro,
                scelgono solo il colore: rosso o bianco. Lo chef offre la cena
                se i due colori sono diversi, tranne quando arrivano due
                bottiglie: in quel caso lo chef richiede lo stesso vino
                per entrambi. Il registro speciale
                annota, sera dopo sera e per ciascuna sala, il formato e il
                colore.{" "}
                <strong>
                  L'obiettivo di Alice e Bob è farsi offrire la cena il più
                  spesso possibile.
                </strong>
              </P>
            </>
          }
          introFatti="Dopo moltissime sere, il registro speciale del ristorante stregato mostra tre fatti. Gli ultimi due, insieme, dicono che lì la cena è offerta circa 85 sere su 100, senza nessun accordo:"
          fatti={[
            {
              titolo: "Preso da solo, ognuno ordina a caso.",
              testo:
                "Nel registro di Alice (o di Bob), sia con il calice sia con la bottiglia, metà delle sere c'è rosso e metà bianco.",
            },
            {
              titolo: "Se c'è almeno un calice, colori quasi sempre diversi.",
              testo:
                "In queste sere Alice e Bob ordinano colori diversi circa 85 volte su 100.",
            },
            {
              titolo: "Con due bottiglie, colori quasi sempre uguali.",
              testo:
                "In queste sere ordinano colori uguali circa 85 volte su 100.",
            },
          ]}
          indagine={
            <P>
              Prima di entrare Alice e Bob concordano che colore ordinare per
              ciascun formato. Possono stabilire regole o schede a piacere, e
              anche tirare a sorte insieme, sulla porta, quale usare quella
              sera. Durante la cena ognuno ordina basandosi solo su quanto
              concordato e sul formato scelto dal suo cameriere. Le scelte dei
              camerieri non dipendono da questi accordi.
            </P>
          }
          domanda="Con un accordo di questo tipo, quante sere su 100 al massimo Alice e Bob possono farsi offrire la cena? Possono arrivare all'85% del ristorante stregato, rispettando anche il fatto 1? Se sì, descrivi l'accordo; se no, dimostra perché."
          soluzione={
            <>
              <P>
                Prima di entrare Alice e Bob si preparano le schede: ciascuno la
                sua, con un colore per il calice e uno per la bottiglia. Se ne
                hanno preparate diverse, il sorteggio sulla porta sceglie quali
                usare quella sera; durante la cena ognuno segue la propria. Per
                esempio, con il piano «Alice sempre bianco, Bob sempre rosso», ecco le due schede e che
                cosa succede nelle quattro combinazioni di formati:
              </P>
              <SchedeSfida alice="BB" bob="RR" />
              <P>
                Nessuna coppia di schede vince tutte e quattro le combinazioni.
                Proviamo a vincerle tutte e vediamo dove si inceppa (= vuol dire
                stesso colore):
              </P>
              <ol className="ml-5 list-decimal space-y-2">
                <li>
                  <strong>Calice con calice:</strong> per vincere servono colori
                  diversi.
                  <Confronto a={["Alice", "calice"]} b={["Bob", "calice"]} uguali={false} />
                </li>
                <li>
                  <strong>Bottiglia di Alice con calice di Bob:</strong> anche
                  qui colori diversi.
                  <Confronto a={["Alice", "bottiglia"]} b={["Bob", "calice"]} uguali={false} />
                </li>
                <li>
                  <strong>Quindi</strong>, dai passi 1 e 2, Alice ordina lo
                  stesso colore con il calice e con la bottiglia.
                  <Confronto
                    a={["Alice", "calice"]}
                    b={["Alice", "bottiglia"]}
                  />
                </li>
                <li>
                  <strong>Calice di Alice con bottiglia di Bob:</strong> colori
                  diversi anche qui.
                  <Confronto a={["Alice", "calice"]} b={["Bob", "bottiglia"]} uguali={false} />
                </li>
                <li>
                  <strong>Quindi</strong>, dai passi 3 e 4, le due
                  bottiglie hanno colori diversi.
                  <Confronto
                    a={["Alice", "bottiglia"]}
                    b={["Bob", "bottiglia"]}
                    uguali={false}
                  />
                </li>
                <li>
                  <strong>Ma</strong> con due bottiglie, per vincere, i colori
                  devono essere uguali: il passo 5 lo impedisce.
                  <Confronto
                    a={["Alice", "bottiglia"]}
                    b={["Bob", "bottiglia"]}
                  />
                </li>
              </ol>
              <P>
                Ogni coppia di schede perde quindi almeno una combinazione su
                quattro. Il piano «Alice sempre bianco, Bob sempre rosso», come si vede nella tabella,
                perde solo le due bottiglie e vince 3 sere su 4; mescolare le
                schede da una sera all'altra fa solo la media (e tirando a sorte
                sulla porta se scambiare tutti i colori si ottiene anche il
                fatto 1). Con gli accordi la cena è offerta al massimo il 75%
                delle sere, mentre i fatti 2 e 3 chiedono circa l'85%. Il
                ristorante stregato arriva a (2 + √2) ÷ 4 ≈ 85,4%, e nessun
                ristorante vero può fare di meglio: è il limite di Tsirelson.
              </P>
            </>
          }
          parallelo={
            <>
              <P>
                <strong>Lo scenario in fisica.</strong> Una sorgente emette
                coppie di fotoni nello stato entangled di polarizzazione Φ⁺, e le manda
                verso due rivelatori lontani. Davanti a ogni rivelatore c'è un
                filtro di polarizzazione con due sole posizioni: per Alice 0° o
                45°, per Bob 22,5° o −22,5°. Ogni fotone passa o non passa il
                filtro: due esiti, + o −.
              </P>
              <P>
                Prima dell'arrivo di ogni fotone, ciascun filtro viene messo in
                una delle sue due posizioni a caso, in modo indipendente
                dall'altro e da ciò che è successo alla sorgente. Con questi
                angoli la meccanica quantistica prevede esiti uguali circa 85
                volte su 100 in tre combinazioni e diversi circa 85 volte su 100
                nella quarta (−22,5° per Bob con 45° per Alice): Invertendo i nomi dei due esiti di Bob si ottengono i tre
                fatti del ristorante stregato. Con proprietà nascoste portate
                dalla sorgente si arriva al massimo a 75 su 100, cioè S ≤ 2. È
                la forma del <TeoremaBell /> usata negli esperimenti veri, da
                Alain Aspect (1982) ai test senza scappatoie del 2015.
              </P>
              <Corrispondenza
                righe={[
                  [
                    "Sorgente di coppie di fotoni",
                    "Quello che succede prima di cena",
                  ],
                  ["Fotone misurato da Alice / da Bob", "Alice / Bob"],
                  [
                    "Due rivelatori lontani",
                    "Due sale, nessuno passa dall'una all'altra",
                  ],
                  [
                    "Filtro di ciascun rivelatore, in una di due posizioni scelta a caso",
                    "Calice o bottiglia, scelto a caso dal cameriere di ciascuna sala",
                  ],
                  ["Alice: 0° o 45°", "Alice: calice o bottiglia"],
                  ["Bob: 22,5° o −22,5°", "Bob: calice o bottiglia"],
                  ["Alice: passa / non passa; Bob: etichette invertite", "Vino rosso / bianco"],
                  [
                    "Esiti con Bob rietichettato: diversi circa 85 volte su 100, tranne −22,5° con 45°",
                    "Colori diversi, tranne con due bottiglie",
                  ],
                  [
                    "Numero S dei correlatori: ≤ 2 con proprietà nascoste, 2√2 nei dati",
                    "Il registro del maître: S ≤ 2 nel ristorante normale, 2,83 nel ristorante stregato",
                  ],
                  [
                    "Proprietà nascoste, località, libertà di scelta",
                    "Strategia prima di cena, ordine basato solo sul proprio formato, camerieri indipendenti dalla strategia",
                  ],
                ]}
              />
            </>
          }
        />
        <P>
          <strong>Il numero S del maître.</strong> Il maître riassume la sfida
          in un solo numero, S, calcolato in quattro passi.
        </P>
        <ol className="ml-5 list-decimal space-y-2">
          <li className="leading-relaxed">
            <strong>Divide le sere in quattro gruppi</strong>, uno per ogni
            combinazione di formati: calice e calice, calice e bottiglia,
            bottiglia e calice, bottiglia e bottiglia (prima il formato di
            Alice, poi quello di Bob).
          </li>
          <li className="leading-relaxed">
            <strong>Dà un punteggio a ogni sera:</strong> +1 se i colori sono
            diversi, −1 se sono uguali.
          </li>
          <li className="leading-relaxed">
            <strong>In ogni gruppo fa la media dei punteggi.</strong> Viene un
            numero fra −1 (colori sempre uguali) e +1 (sempre diversi); per
            esempio, con colori diversi in 85 sere su 100 la media è 0,85 − 0,15
            = 0,70.
          </li>
          <li className="leading-relaxed">
            <strong>
              Somma le medie dei primi tre gruppi e sottrae quella delle due
              bottiglie.
            </strong>{" "}
            Il meno c'è perché con due bottiglie lo chef vuole colori uguali:
            così ogni gruppo conta in positivo quando Alice e Bob fanno quello
            che serve per vincere.
          </li>
        </ol>
        <div className="overflow-x-auto">
          <table className="text-sm" aria-label="Due esempi di calcolo di S">
            <thead>
              <tr className="text-xs text-zinc-500">
                <th scope="col" className="pr-4 text-left font-normal">
                  <span className="sr-only">Esempio</span>
                </th>
                <th scope="col" className="pr-3 font-normal">
                  calice e calice
                </th>
                <th scope="col" className="pr-3 font-normal">
                  calice e bottiglia
                </th>
                <th scope="col" className="pr-3 font-normal">
                  bottiglia e calice
                </th>
                <th scope="col" className="pr-3 font-normal">
                  − bottiglia e bottiglia
                </th>
                <th scope="col" className="font-normal">
                  S
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr className="border-t border-zinc-200 dark:border-zinc-800">
                <th scope="row" className="py-1 pr-4 text-left font-normal">
                  Alice bianco, Bob rosso
                </th>
                <td>+1</td>
                <td>+1</td>
                <td>+1</td>
                <td>− (+1)</td>
                <td className="font-semibold">2</td>
              </tr>
              <tr className="border-t border-zinc-200 dark:border-zinc-800">
                <th scope="row" className="py-1 pr-4 text-left font-normal">
                  Ristorante stregato
                </th>
                <td>+0,71</td>
                <td>+0,71</td>
                <td>+0,71</td>
                <td>− (−0,71)</td>
                <td className="font-semibold">2,83</td>
              </tr>
            </tbody>
          </table>
        </div>
        <P>
          S non è altro che la quota di cene offerte scritta in un'altra scala:
          S = 8 × (cene offerte %) − 4, con la percentuale scritta come numero
          decimale (75% = 0,75). Con il 75% di cene offerte, il massimo di
          qualunque accordo, S = 8 × 0,75 − 4 = 2; con l'85,4% del ristorante
          stregato, S = 8 × 0,854 − 4 ≈ 2,83; vincendo sempre si arriverebbe a
          4. È la stessa sfida vista dal registro, e la forma del{" "}
          <TeoremaBell /> usata in tutti gli esperimenti veri.
        </P>

      </>
    ),
    lezione:
      "Ristorante normale: al massimo 75% di cene offerte, S ≤ 2. Ristorante stregato: 85,4%, S ≈ 2,83, senza che le sale comunichino.",
    Sim: SfidaChef,
    guida: {
      cosa: "Ogni sera il cameriere di ciascuna sala decide a caso se servire in calice o in bottiglia. Lo chef offre la cena se i colori sono diversi, ma con due bottiglie devono essere uguali. A sinistra Alice e Bob nel ristorante normale con un piano deciso prima; a destra il ristorante stregato, dove Alice e Bob non hanno nessun piano.",
      avvio:
        "A sinistra scegli il colore che Alice e Bob ordineranno per ogni formato (si parte da Alice sempre bianco e Bob sempre rosso); Poi premi «Fai partire le cene» o «Una cena».",
      leggere:
        "Per ogni ristorante: la percentuale di cene offerte con la barra (tacche 75% e 85,4%) e, sotto, il registro del maître con le quattro medie e il numero S.",
      mostra:
        "Nessun piano del ristorante normale supera il 75% e S = 2: la tabellina delle quattro serate mostra sempre almeno una sera persa. Il ristorante stregato arriva all'85,4% e S ≈ 2,83.",
    },
    riferimenti: [R.chsh, R.tsirelson, R.videoBell, R.videoEntanglement],
  },
  {
    id: "quadrato",
    numero: "Capitolo 4",
    titolo: "Il menù degustazione",
    immagine: "/r04/4-quadrato.svg",
    alt: "Una lavagna con il menù degustazione: nove piatti in una griglia, il percorso terra di Alice evidenziato in rosa e la colonna dei secondi di Bob in azzurro; sul piatto in comune due calici di rosso.",
    domanda:
      "Esiste una sfida in cui il ristorante stregato vince tutte le sere?",
    Testo: () => (
      <>
        <P>
          Con la sfida dei due formati il ristorante stregato vince l'85% delle
          sere: molto, ma non sempre. Lo chef si chiede se esista una sfida in
          cui il ristorante stregato vince ogni sera, mentre nessun accordo ci
          riesce. La trova in un menù degustazione.
        </P>
        <Problema
          titolo="Il problema del menù degustazione"
          scenario={
            <>
              <P>
                Stesse sale, stessi camerieri, stesso registro speciale. Il menù
                degustazione ha nove piatti in una griglia 3 × 3: le righe sono
                tre percorsi (mare, terra, orto), le colonne le tre portate
                (antipasto, primo, secondo). A ogni cena il cameriere di <A />{" "}
                sceglie a caso un percorso, e Alice ordina il vino, rosso o
                bianco, per i suoi tre piatti. Il cameriere di <B /> sceglie a
                caso una portata, e Bob ordina il vino per i tre piatti di
                quella colonna, uno per percorso. Un piatto, l'incrocio, è in
                comune. I camerieri non si parlano e nessuno conosce in anticipo
                le loro scelte.
              </P>
              <P>
                Lo chef offre la cena se valgono tre regole: nel percorso di
                Alice i rossi sono pari (0 o 2), nella portata di Bob sono
                dispari (1 o 3), e sul piatto in comune i due vini hanno lo
                stesso colore. Il registro speciale annota, sera dopo sera, il
                percorso, la portata e i sei vini.
              </P>
            </>
          }
          introFatti="Dopo moltissime sere, il registro speciale del ristorante stregato mostra tre fatti:"
          fatti={[
            {
              titolo: "Le regole dei rossi sono sempre rispettate.",
              testo:
                "Nel percorso di Alice i rossi sono sempre pari, nella portata di Bob sempre dispari.",
            },
            {
              titolo: "Sul piatto in comune, sempre lo stesso colore.",
              testo:
                "Qualunque percorso e qualunque portata siano toccati, Alice e Bob ordinano lo stesso vino per il piatto in comune.",
            },
            {
              titolo: "Preso da solo, ognuno ordina a caso.",
              testo:
                "Nel registro di Alice (o di Bob), per ogni piatto, metà delle sere c'è rosso e metà bianco.",
            },
          ]}
          indagine={
            <P>
              Prima di entrare Alice e Bob concordano che vino ordinare per
              ciascun piatto. Possono stabilire regole o schede a piacere, e
              anche tirare a sorte insieme, sulla porta, quale usare quella
              sera. Durante la cena ognuno ordina basandosi solo su quanto
              concordato e sul percorso o sulla portata scelti dal suo
              cameriere. Le scelte dei camerieri non dipendono da questi
              accordi.
            </P>
          }
          domanda="Un accordo di questo tipo può produrre i tre fatti? Se sì, descrivilo. Se no, dimostra perché."
          soluzione={
            <>
              <P>
                <strong>Due griglie per sera.</strong> Prima di entrare Alice e
                Bob si preparano le griglie: ciascuno la sua, con un vino per
                ognuno dei nove piatti. Alice userà la riga del suo percorso,
                Bob la colonna della sua portata. Se ne hanno preparate diverse,
                il sorteggio sulla porta sceglie quali usare quella sera.
              </P>
              <P>
                <strong>Una sola griglia.</strong> Ogni piatto è quello in
                comune una sera su 9, quando i camerieri scelgono il suo
                percorso e la sua portata. Su moltissime sere prima o poi
                succede, quindi per il fatto 2 le due griglie devono coincidere
                piatto per piatto.
              </P>
              <P>
                <strong>Pari e dispari.</strong> Contiamo i rossi della griglia.
                Per righe sono tre numeri pari, e il totale è pari. Per colonne
                sono tre numeri dispari, e il totale è dispari. Lo stesso numero
                non può essere pari e dispari: una griglia così non esiste.
              </P>
              <P>
                <strong>Quanto si può vincere.</strong> Ogni accordo sbaglia
                almeno una delle 9 sere possibili, quindi vince al massimo 8
                sere su 9, circa l'88,9%. Ci si arriva con due griglie uguali
                tranne su un piatto. Il fatto 3 si ottiene lo stesso: il
                sorteggio sulla porta decide se scambiare i colori dei quattro
                piatti agli angoli di un rettangolo, e nessuna regola cambia. Il
                ristorante stregato, senza nessun accordo, vince 9 sere su 9.
              </P>
            </>
          }
          parallelo={
            <>
              <P>
                <strong>Lo scenario in fisica.</strong> La sorgente prepara due
                coppie di particelle gemelle invece di una, e ogni rivelatore ne
                riceve una per coppia: due particelle per parte. Su queste due
                particelle si possono fare nove misure diverse, disposte in una
                griglia 3 × 3. Le tre misure di una stessa riga (o di una stessa
                colonna) si possono fare insieme, senza disturbarsi, e ognuna dà
                +1 o −1.
              </P>
              <P>
                Un selettore sceglie a caso una riga per Alice e una colonna per
                Bob. La meccanica quantistica (Mermin e Peres, 1990) fissa il
                prodotto degli esiti: con un'opportuna scelta dei segni, +1
                lungo ogni riga e −1 lungo ogni colonna, e i due rivelatori
                danno sempre lo stesso esito sulla misura in comune. Contare i
                −1 è contare i rossi: prodotto +1 vuol dire rossi pari, prodotto
                −1 rossi dispari. Con valori nascosti già scritti in una
                griglia, come nella soluzione, il conto pari/dispari è
                impossibile: è una versione del <TeoremaBell /> «senza
                disuguaglianze», che non ha bisogno di statistiche.
              </P>
              <Corrispondenza
                righe={[
                  [
                    "Due coppie di particelle gemelle",
                    "Quello che succede prima di cena",
                  ],
                  ["Due particelle per rivelatore", "Alice / Bob"],
                  [
                    "Nove misure possibili in una griglia 3 × 3",
                    "Nove piatti del menù degustazione",
                  ],
                  [
                    "Riga scelta per Alice, colonna scelta per Bob",
                    "Percorso e portata scelti dai camerieri",
                  ],
                  ["Esito +1 / −1", "Vino bianco / rosso"],
                  [
                    "Prodotto +1 lungo la riga",
                    "Rossi pari nel percorso di Alice",
                  ],
                  [
                    "Prodotto −1 lungo la colonna",
                    "Rossi dispari nella portata di Bob",
                  ],
                  [
                    "Stesso esito sulla misura in comune",
                    "Stesso colore sul piatto in comune",
                  ],
                  [
                    "Valori nascosti in una griglia: al massimo 8 su 9",
                    "Accordo prima di cena: al massimo 8 sere su 9",
                  ],
                ]}
              />
            </>
          }
        />
        <P>
          Rispetto alla sfida dei due formati, il ristorante stregato non vince
          più spesso: vince sempre. La prova è un conteggio di pari e dispari,
          semplice come «tre portate, due colori». Il gioco nasce dal quadrato
          magico di David Mermin e Asher Peres (1990), e la sua versione a due
          giocatori è stata studiata, fra gli altri, da Padmanabhan Aravind e da
          Cleve, Høyer, Toner e Watrous.
        </P>
      </>
    ),
    lezione:
      "Nel menù degustazione un accordo vince al massimo 8 sere su 9, perché nessuna griglia ha i rossi pari in ogni riga e dispari in ogni colonna. Il ristorante stregato, senza nessun accordo, vince tutte le sere.",
    Sim: MenuDegustazione,
    guida: {
      cosa: "Ogni sera il cameriere di Alice sceglie a caso un percorso (riga) e quello di Bob una portata (colonna). La cena è offerta se nel percorso di Alice i rossi sono pari, nella portata di Bob dispari e sul piatto in comune il colore è lo stesso. A sinistra il ristorante normale con un accordo scritto, a destra il ristorante stregato.",
      avvio:
        "A sinistra si parte da un accordo ottimo (8 sere su 9, il massimo possibile): cambia i colori cliccando i piatti delle due griglie, oppure premi «Accordo ottimo casuale», che ogni volta propone una coppia diversa di griglie da 8 sere su 9. Poi premi «Fai partire le cene» o «Una cena».",
      leggere:
        "Accanto alle griglie le spunte segnano le righe pari di Alice e le colonne dispari di Bob; sotto, la tabella delle 9 sere possibili dice quali vincono. In entrambi i ristoranti c'è l'ultima sera, con il percorso di Alice in rosa e la portata di Bob in azzurro. Per entrambi i ristoranti: percentuale di cene offerte e barra con le tacche 8/9 e 100%.",
      mostra:
        "Nessuna coppia di griglie supera 8 sere su 9: con due griglie uguali qualche colonna di Bob resta pari; se le griglie differiscono, sbagliano su un piatto in comune. Il ristorante stregato vince il 100% delle sere, e il rosso nei vini di Alice resta a metà.",
    },
    riferimenti: [R.mermin1990, R.mermin1993, R.aravind, R.cleve],
  },
  {
    id: "stelle",
    numero: "Capitolo 5",
    titolo: "Il menù a cinque stelle",
    immagine: "/r04/5-stelle.svg",
    alt: "Dieci piatti ai punti di una stella: cinque percorsi da quattro piatti, quattro con rossi pari e uno con rossi dispari.",
    domanda: "Che cosa succede se Alice e Bob devono seguire regole diverse?",
    Testo: () => (
      <>
        <P>Il menù degustazione ha lasciato il proprietario senza parole: nel ristorante stregato si può vincere ogni sera. Lo chef decide di cambiare la forma della sfida. Disegna una stella con dieci piatti e cinque percorsi, ognuno di quattro piatti. Ogni piatto appartiene esattamente a due percorsi. Il quinto percorso è disegnato in blu con un tratto più spesso. Nel tabellone interattivo il rosso evidenzia il percorso selezionato di Bob.</P>
        <P>I camerieri estraggono a sorte un piatto e lo assegnano ad Alice che sceglie il suo vino. Uno dei due percorsi che contengono il piatto di Alice viene scelto casualmente e assegnato a Bob che sceglie i vini dei quattro piatti. Alice non conosce il percorso di Bob e Bob non sa quale piatto è stato assegnato ad Alice.</P>
        <P>Ogni cena propone quindi una coppia di richieste: ad Alice «Che vino scegli per questo piatto?», a Bob «Quali vini scegli per questo percorso?». Chiameremo questa coppia una <strong>domanda del gioco</strong>.</P>
        <P>Ci sono <strong>10 piatti possibili per Alice</strong> e, per ciascuno, <strong>2 percorsi possibili per Bob</strong>: in totale <strong>10 × 2 = 20 domande</strong>. Per esempio, se viene estratto il piatto 1, Bob può ricevere il percorso 1 oppure il percorso 2, i due che lo contengono. Sono due domande distinte, anche se Alice riceve lo stesso piatto.</P>
        <P>Ogni piatto viene estratto con probabilità 1/10 e ciascuno dei suoi due percorsi con probabilità 1/2. Ogni coppia piatto–percorso ha dunque probabilità <strong>1/10 × 1/2 = 1/20, cioè il 5%</strong>. È su queste venti possibilità che si calcola quante cene può vincere un accordo.</P>
        <P>Lo chef conta <strong>quanti dei quattro piatti di ogni percorso hanno vino rosso</strong>:</P>
        <ul className="ml-5 list-disc space-y-2">
          <li>Nei <strong>percorsi 1, 2, 3 e 4</strong>, devono essere <strong>0, 2 oppure 4</strong>: un numero pari.</li>
          <li>Nel <strong>percorso 5</strong>, devono essere <strong>1 oppure 3</strong>: un numero dispari.</li>
        </ul>
        <P>Gli altri piatti hanno vino bianco.</P>
        <P>Lo chef offre la cena solo se Bob rispetta questa regola e i vini scelti dai due amici coincidono sul piatto comune. Possono prepararsi insieme prima di entrare, ma durante la cena non possono comunicare.</P>
        <P>Un accordo classico può vincere al massimo diciannove sere su venti, il 95%. Il ristorante stregato può ancora vincere sempre. Il limite è diverso dall’88,9% del quadrato perché sono cambiate le domande del gioco: non stiamo misurando la stessa sfida.</P>
        <details className="rounded-lg border border-zinc-300 bg-white/70 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
          <summary className="cursor-pointer font-semibold">Perché il massimo classico è diciannove sere su venti?</summary>
          <div className="mt-4 space-y-3">
            <P>Fissiamo un accordo: per ciascuno dei dieci piatti Alice ha deciso un vino; per ciascuno dei cinque percorsi Bob ha deciso quattro vini. Supponiamo che questo accordo vinca tutte le venti domande e vediamo perché è impossibile.</P>
            <ol className="ml-5 list-decimal space-y-3">
              <li><strong>Vincere sempre impone che Bob copi i colori di Alice.</strong> Prendiamo un percorso di Bob. Ognuno dei suoi quattro piatti può essere quello assegnato ad Alice. Per vincere tutte e quattro queste domande, Bob deve quindi scegliere, su ciascun piatto, il vino che Alice ha previsto per quel piatto. Questo vale per tutti e cinque i percorsi.</li>
              <li><strong>Contiamo i rossi seguendo i colori di Alice.</strong> Se Alice ha scelto rosso per N piatti, sommando i conteggi dei cinque percorsi otteniamo 2 × N: ogni piatto appartiene esattamente a due percorsi. Questa somma è necessariamente pari.</li>
              <li><strong>Contiamo i rossi seguendo le regole dello chef.</strong> I primi quattro percorsi devono avere ciascuno un numero pari di rossi; il quinto un numero dispari. La somma di quattro numeri pari e uno dispari è necessariamente dispari.</li>
              <li><strong>Le due somme non possono coincidere.</strong> Se Bob copia tutti i colori di Alice, almeno un percorso viola la regola dello chef. Se invece corregge un colore per rispettarla, su quel piatto non coincide più con Alice: la domanda formata da quel piatto e quel percorso è perdente. In ogni caso, un accordo non può vincere tutte le venti domande.</li>
              <li><strong>Almeno una sconfitta su venti dà il limite del 95%.</strong> Ciascuna domanda ha probabilità 1/20. Un accordo che ne perde almeno una ha probabilità di vittoria al massimo 19/20 = 95%. Non significa che in ogni gruppo di venti cene si perdano esattamente una o più cene: è un limite alla probabilità, non al risultato di un campione casuale.</li>
            </ol>
            <P><strong>Il 95% si raggiunge davvero.</strong> Alice sceglie sempre bianco. Bob sceglie quattro bianchi nei primi quattro percorsi e un solo rosso nel quinto. Le parità sono tutte rispettate; perdono soltanto quando ad Alice viene assegnato proprio quel piatto e a Bob il quinto percorso. È una sola domanda su venti: le altre diciannove sono vincenti.</P>
            <P>Sorteggiare accordi prima della cena non migliora il massimo: ogni accordo vince al massimo il 95% e la loro media non può superare il 95%.</P>
          </div>
        </details>
      </>
    ),
    lezione: "Nessun accordo classico può soddisfare tutte le regole: la probabilità massima di vittoria è 19/20, il 95%. La strategia quantistica ideale arriva invece al 100%, senza comunicazione tra le sale.",
    Sim: () => <MenuStelle standalone />,
    guida: {
      cosa: "Il gioco del pentagramma magico di Mermin nella variante punto-percorso: dieci piatti, cinque percorsi e venti domande equiprobabili.",
      avvio: "Cambia i vini dei piatti nella stella oppure scegli le correlazioni quantistiche ideali. Premi Una cena o Avvia 200 cene: la sequenza mostra una cena ogni 0,125 secondi, con pausa e ripresa.",
      leggere: "Seleziona un percorso per vedere i quattro vini concordati da Bob. Il bordo rosso segnala un disaccordo con Alice. Confronta probabilità teorica e vittorie osservate.",
      mostra: "Il miglior accordo classico arriva al 95%; il modello quantistico ideale al 100%. Gli approfondimenti spiegano il conteggio di parità, le venti domande e le osservabili su tre qubit.",
    },
    riferimenti: [{testo: "Alex Arkhipov, Extending and Characterizing Quantum Magic Games (2012), PDF: pentagramma e protocollo punto-percorso.", url: "/documenti/arkhipov-quantum-magic-games.pdf"}, R.mermin1993],
  },
  {
    id: "terzo-ospite",
    numero: "Capitolo 6",
    titolo: "Un terzo ospite",
    immagine: "/r04/6-terzo-ospite.svg",
    alt: "Alice, Bob e Charlie in tre sale separate. Ognuno riceve un formato e sceglie un vino, senza comunicare con gli altri.",
    domanda: "Che cosa cambia se la sfida coinvolge tre commensali in tre sale separate?",
    Testo: () => (
      <>
        <P>La sera seguente Alice e Bob invitano Charlie. Lo chef fa accomodare i tre amici in tre sale separate: niente telefoni, biglietti o messaggi. Propone una nuova sfida in cui ciascuno deve scegliere un solo vino.</P>
        <P>Prima di servire, i camerieri estraggono a sorte una delle quattro combinazioni ammesse, tutte con probabilità 25%: tre calici; un calice ad Alice e due bottiglie agli altri; un calice a Bob e due bottiglie agli altri; un calice a Charlie e due bottiglie agli altri. I formati non vengono estratti indipendentemente: lo chef garantisce che le bottiglie siano zero oppure due. L’estrazione è indipendente dagli accordi dei tre amici.</P>
        <P>Ogni ospite vede soltanto il proprio formato e sceglie vino bianco o rosso. Conosce le regole, ma non conosce i formati assegnati agli altri due. I tre possono preparare un accordo prima di entrare; durante la cena non possono comunicare.</P>
        <P>Lo chef conta i vini rossi delle tre sale e offre la cena se valgono queste regole:</P>
        <ul className="ml-5 list-disc space-y-2">
          <li>Con <strong>tre calici</strong>, i rossi devono essere <strong>pari: 0 oppure 2</strong>.</li>
          <li>Con <strong>un calice e due bottiglie</strong>, in qualunque disposizione, i rossi devono essere <strong>dispari: 1 oppure 3</strong>.</li>
        </ul>
        <P>Un accordo classico può vincere al massimo tre domande su quattro, il 75%. Tre qubit entangled nello stato GHZ consentono invece una strategia quantistica ideale che vince sempre. Le singole risposte restano casuali: il risultato sorprendente si vede confrontando tutti e tre i vini.</P>
        <P>Nel menù a cinque stelle Bob rispondeva per quattro piatti. Qui ciascuno risponde una volta sola: la novità è la relazione tra tre risposte, e il terzo ospite è indispensabile. Questa è una versione del gioco Mermin–GHZ, dal nome di Mermin e dello stato di Greenberger, Horne e Zeilinger.</P>
      </>
    ),
    lezione: "Con tre ospiti e quattro combinazioni ammesse, nessun accordo classico supera il 75%: le quattro richieste di parità sono incompatibili con sei risposte prestabilite. Una strategia con uno stato GHZ arriva idealmente al 100%, senza comunicazione tra le sale.",
    Sim: TerzoOspite,
    guida: {
      cosa: "Il gioco Mermin–GHZ con Alice, Bob e Charlie: ognuno vede un solo formato e sceglie un vino; la vittoria dipende dalla parità dei tre rossi.",
      avvio: "Modifica i sei colori dell’accordo classico oppure seleziona le correlazioni GHZ ideali. Premi Una cena o Avvia 100 cene; puoi mettere in pausa e riprendere.",
      leggere: "Le tre sale mostrano i formati e i vini dell’ultima cena nell’ordine Alice, Bob, Charlie. Confronta il conteggio dei rossi con la parità richiesta e osserva la percentuale di vittoria.",
      mostra: "Le 64 strategie deterministiche vincono al 25% oppure al 75%. La strategia GHZ ideale vince sempre. Le scelte casuali indipendenti ed equiprobabili vincono al 50%.",
    },
    riferimenti: [{testo: "Gilles Brassard, Anne Broadbent e Alain Tapp, Quantum Pseudo-Telepathy, §3: gioco Mermin–GHZ e strategie classiche e quantistiche.", url: "https://arxiv.org/abs/quant-ph/0407221"}, R.mermin1990, R.mermin1993],
  },
  {
    id: "contabile",
    numero: "Capitolo 7",
    titolo: "Il contabile",
    immagine: "/r04/4-contabile.svg",
    alt: "Il contabile alla scrivania, stupito, mentre Alice e Bob alzano entrambi un calice di rosso.",
    domanda: "Cosa serve per scoprire che non c'è nessun accordo?",
    Testo: () => (
      <>
        <P>
          Il proprietario dei due ristoranti ha un contabile: un uomo
          meticoloso, che passa le giornate sul registro speciale e controlla
          ogni riga. Un giorno prende i conti delle ultime cene del ristorante
          stregato, dove non era in gioco nessuna sfida: nessuna cena offerta,
          nessun premio. Anche qui ogni sera ciascun cameriere sceglie a caso,
          per la sua sala, se servire il vino in calice o in bottiglia, e Alice
          e Bob scelgono solo il colore. Sfogliandole trova qualcosa di
          inaspettato: tre regole che non hanno mai un'eccezione.
        </P>
        <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
          <h3 className="mb-2 text-base font-semibold">
            Le tre regole del contabile
          </h3>
          <ol className="ml-5 list-decimal space-y-3">
            <li className="leading-relaxed">
              <strong>Calice rosso di Alice, bottiglia rossa di Bob.</strong>{" "}
              Nelle sere in cui Alice ha il calice e Bob la bottiglia, se il
              calice di Alice è rosso, la bottiglia di Bob è sempre rossa. Il
              contrario non vale: se il calice di Alice è bianco, la bottiglia
              di Bob può essere dell'uno o dell'altro colore.
              <Regola
                se={{ chi: "Alice", formato: "calice", c: "R" }}
                allora={{ chi: "Bob", formato: "bottiglia", c: "R" }}
              />
            </li>
            <li className="leading-relaxed">
              <strong>Calice rosso di Bob, bottiglia rossa di Alice.</strong> La
              stessa regola a parti invertite: nelle sere in cui Bob ha il
              calice e Alice la bottiglia, se il calice di Bob è rosso, la
              bottiglia di Alice è sempre rossa.
              <Regola
                se={{ chi: "Bob", formato: "calice", c: "R" }}
                allora={{ chi: "Alice", formato: "bottiglia", c: "R" }}
              />
            </li>
            <li className="leading-relaxed">
              <strong>Mai due bottiglie di rosso.</strong> Nelle sere in cui
              tutti e due hanno la bottiglia, non sono mai rosse entrambe:
              costerebbero troppo. Una rossa e una bianca, o due bianche, sì.
              <Regola
                mai={[
                  { chi: "Alice", formato: "bottiglia", c: "R" },
                  { chi: "Bob", formato: "bottiglia", c: "R" },
                ]}
              />
            </li>
          </ol>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Ogni regola riguarda un solo tipo di sera; sulle sere con due calici
            le regole non dicono niente.
          </p>
        </div>
        <P>
          <strong>Il ragionamento del contabile.</strong> Il contabile si
          chiede: e se Alice e Bob avessero un accordo, come nel ristorante
          normale? Allora ogni sera ciascuno arriverebbe con una scheda già
          scritta, con un colore per il calice e uno per la bottiglia. Il
          cameriere sceglie quale voce viene servita, ma anche l'altra è
          scritta, pur se quella sera nessuno la vede. E perché le regole non
          abbiano mai eccezioni, le schede devono rispettarle qualunque cosa
          scelgano i camerieri.
        </P>
        <P>
          Prendiamo allora una sera con <strong>due calici di rosso</strong>: su
          tutte e due le schede la voce «calice» dice rosso. Che cosa dicono le
          voci «bottiglia», che quella sera non sono state servite?
        </P>
        <ol className="ml-5 list-decimal space-y-2">
          <li className="leading-relaxed">
            Il calice di Alice è rosso. Per la regola 1 la voce «bottiglia» di
            Bob deve essere rossa: altrimenti, se il cameriere di Bob avesse
            scelto la bottiglia, la regola 1 sarebbe stata violata.
          </li>
          <li className="leading-relaxed">
            Allo stesso modo il calice di Bob è rosso, e per la regola 2 la voce
            «bottiglia» di Alice deve essere rossa.
          </li>
          <li className="leading-relaxed">
            Quindi tutte e due le schede dicono «bottiglia: rosso». In una sera
            con due bottiglie arriverebbero due bottiglie di rosso, e la regola
            3 lo vieta.
          </li>
          <li className="leading-relaxed">
            <strong>Conclusione:</strong> se le schede rispettano le tre regole,
            le due voci «calice» non possono essere rosse insieme. Con un
            accordo, due calici di rosso non arrivano mai.
          </li>
        </ol>
        <P>
          Eppure, una sera, a <A /> e a <B /> arrivano due calici di rosso. E
          succede ancora: quasi una sera su undici tra quelle con due calici,
          mentre le tre regole restano sempre vere.
        </P>
        <P>
          Qui non serve nessuna statistica: basta una sola sera così per sapere
          che il ristorante stregato non funziona come il ristorante normale. È
          il ragionamento con cui Lucien Hardy, nel 1993, mostrò il{" "}
          <TeoremaBell /> senza contare medie.
        </P>
        <P>
          Per esserne sicuro, il contabile controlla uno per uno tutti i 16
          accordi possibili: tutti i modi di scegliere in anticipo un colore per
          il calice e uno per la bottiglia, per Alice e per Bob.
        </P>
        <TabellaAccordi />
        <details className="group rounded-lg border border-sky-200 bg-white/70 p-3 dark:border-sky-900 dark:bg-zinc-900/50">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">
            Il parallelo con la fisica{" "}
            <span className="font-normal normal-case tracking-normal text-zinc-500 group-open:hidden">
              (perché proprio il 9%)
            </span>
          </summary>
          <div className="mt-3 space-y-3">
            <P>
              Il paradosso di Hardy è un celebre esperimento mentale di
              meccanica quantistica, proposto dal fisico britannico Lucien Hardy
              nel 1993 e poi realizzato in laboratorio. Mostra che la meccanica
              quantistica è incompatibile con il realismo locale, cioè con
              l'idea classica che le proprietà fisiche esistano
              indipendentemente dall'osservazione e che nessuna influenza possa
              viaggiare più veloce della luce. È una dimostrazione del{" "}
              <TeoremaBell /> diversa da quella con le disuguaglianze: invece di
              confrontare medie arriva a una contraddizione logica, perché una
              sola sera «impossibile» basta a escludere ogni spiegazione con
              variabili nascoste locali. Negli esperimenti veri, però, bisogna
              comunque verificare con molte misure che le tre probabilità siano
              davvero zero.
            </P>
            <P>
              Il 9% non si ricava dal ragionamento del contabile: quello dice
              solo che con le schede due calici di rosso non arrivano mai (0%).
              È un limite del ristorante stregato stesso, come l'85,4% del
              capitolo 3: il massimo che la natura concede quando si chiede che
              le tre regole valgano sempre.
            </P>
            <P>
              <strong>Perché non di più.</strong> Le tre regole sono vincoli
              rigidi: certe combinazioni non devono capitare mai. Il ristorante
              stregato le rispetta, ma ha poco margine. Se facesse arrivare più
              spesso due calici di rosso, nelle sere con calice e bottiglia
              comparirebbero eccezioni alle regole 1 e 2, oppure, con due
              bottiglie, alla regola 3. La sera «impossibile» può esistere solo
              come evento raro, schiacciata fra i tre divieti. Il massimo che la
              meccanica quantistica consente, con le tre regole sempre vere, è
            </P>
            <p className="text-center font-mono">
              ((√5 − 1) / 2)⁵ ≈ 0,0902, cioè circa il 9%,
            </p>
            <P>
              dove (√5 − 1) / 2 ≈ 0,618 è l'inverso della sezione aurea, qui
              alla quinta potenza. Il 9% si ottiene con la regolazione
              migliore(*), quella usata nella simulazione; con altre regolazioni
              le regole possono valere ancora, ma i due calici di rosso arrivano
              più di rado.
            </P>
            <P>
              <strong>«Una sera su undici».</strong> È un'approssimazione: 1/11
              ≈ 9,09%, il valore esatto è 9,02%. «Quasi una sera su undici» è
              giusto.
            </P>
            <P>
              <strong>Attenzione al totale.</strong> Il 9% riguarda solo le sere
              con due calici, che sono un quarto di tutte (ciascun cameriere
              sceglie calice o bottiglia a metà). Su tutte le sere i due calici
              di rosso sono quindi circa 9% ÷ 4 ≈ 2,3%: è il numero «attese 2,3%
              delle sere» sotto il contatore della simulazione.
            </P>
            <P>
              <strong>In fisica</strong> è il paradosso di Hardy (1993). Le due
              particelle sono preparate in uno stato entangled ma non al
              massimo, diverso da quello della sfida del capitolo 3. Per Alice e
              per Bob si scelgono due misure (calice e bottiglia) tali che tre
              delle probabilità congiunte siano esattamente zero: sono le tre
              regole. La quarta, due calici di rosso, resta positiva.
              Ottimizzando sullo stato e sulle misure, il suo massimo è (5√5 −
              11) / 2 ≈ 9,02%: lo stesso numero, scritto in un altro modo.
            </P>
            <Corrispondenza
              righe={[
                [
                  "Stato entangled non al massimo",
                  "Le ultime cene del ristorante stregato",
                ],
                ["Due misure possibili per parte", "Calice o bottiglia"],
                [
                  "Tre probabilità congiunte uguali a zero",
                  "Le tre regole del contabile",
                ],
                [
                  "Quarta probabilità, al massimo ≈ 9%",
                  "Due calici di rosso, quasi una sera su undici",
                ],
                [
                  "Variabili nascoste locali: probabilità zero",
                  "Schede scritte prima di cena: mai due calici di rosso",
                ],
              ]}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              (*) «Regolazione» indica le scelte fatte nell'esperimento: come
              vengono preparate le due particelle (quanto è entangled il loro
              stato; nel paradosso di Hardy non deve esserlo al massimo) e quali
              misure corrispondono a «calice» e a «bottiglia» per Alice e per
              Bob (gli angoli degli strumenti). Per ogni preparazione esistono
              misure che rendono vere le tre regole, ma la probabilità dei due
              calici di rosso cambia; con la preparazione migliore si arriva al
              9%.
            </p>
          </div>
        </details>
      </>
    ),
    lezione:
      "Nel ristorante normale «due calici di rosso» non può succedere neanche una volta. Nel ristorante stregato succede, e le tre regole restano sempre vere.",
    Sim: Contabile,
    guida: {
      cosa: "Tante sere nel ristorante stregato, con calice o bottiglia scelti a caso dai camerieri, controllate dal contabile con le sue tre regole.",
      avvio:
        "Premi «Sfoglia i conti del ristorante stregato» (oppure «Una sera»).",
      leggere:
        "A sinistra: «Regole violate», che deve restare a zero, e «Due calici di rosso», con l'elenco delle sere «impossibili». A destra il ragionamento del contabile.",
      mostra:
        "Le tre regole non sono mai violate, eppure le sere con due calici di rosso compaiono: circa il 9% di quelle con due calici. Nessun accordo del ristorante normale lo permette, e basta una sera per smentirlo.",
    },
    riferimenti: [R.hardy],
  },
  {
    id: "messaggi",
    numero: "Capitolo 8",
    titolo: "Nessun messaggio tra le sale",
    immagine: "/r04/5-messaggi.svg",
    alt: "Il cameriere di Bob sceglie in segreto calice o bottiglia; nella sala di Alice la colonna del registro dice sempre rosso 50%, bianco 50%; una busta barrata sul muro.",
    domanda:
      "Se il ristorante stregato collega le sale, i camerieri possono mandarsi un messaggio?",
    Testo: () => (
      <>
        <P>
          <strong>L'idea dei camerieri.</strong> Nel ristorante stregato, quando
          Alice ha la bottiglia, i colori coincidono circa 85 volte su 100 se
          Bob ha il calice, ma soltanto 15 se ha la bottiglia. Un accordo preso
          prima di entrare non basta a spiegarlo (con un accordo non si supera
          il 75%, capitolo 3), e i clienti non possono conoscere i formati in
          anticipo: li scelgono i camerieri al momento. «Si parlano
          telepaticamente», sospettano questi ultimi: Bob comunica ad Alice
          formato e colore, e lei si regola di conseguenza.
        </P>
        <P>
          <strong>La prova del messaggio.</strong> «Se il legame
          <span aria-describedby="nota-legame">(*)</span> è delle sale e non dei
          clienti, possiamo usare questo legame per comunicarci qualcosa?» Si
          accordano: per un mese il cameriere di Bob servirà sempre lo stesso
          formato, scelto in segreto e tenuto nascosto al collega. Quello di
          Alice continuerà a scegliere a caso e, alla fine del mese, proverà a
          indovinare il formato di Bob telepaticamente. Ripetere lo stesso
          messaggio per molte sere dovrebbe aiutarlo a riconoscere anche un
          segnale debole. Se riuscisse a indovinare più spesso che tirando a
          sorte, avrebbero già un codice: calice significa «sì», bottiglia
          significa «no».
        </P>
        <P>
          <strong>L'esito.</strong> Ripetono la prova per molti mesi, cambiando
          ogni volta il formato segreto. Il cameriere di Alice indovina circa un
          mese su due, come tirando a sorte:{" "}
          <strong>nella sua colonna i rossi restano intorno alla metà</strong>,
          sia con il calice sia con la bottiglia, qualunque formato abbia scelto
          il collega. Non trova nessun indizio.
        </P>
        <P>
          <strong>Il verdetto.</strong> La prova non conferma l'ipotesi di
          telepatia. Ma i camerieri hanno imparato qualcosa: sapevano già che
          ognuno, preso da solo, ordina a caso.{" "}
          <strong>Ora sanno di più:</strong> i vini di Alice restano gli stessi
          qualunque formato scelga Bob. Il legame rimane, ma non permette di
          mandare messaggi.
        </P>
        <p
          id="nota-legame"
          className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
          * «Legame» è qui una possibile resa italiana di <em>entanglement</em>,
          il termine usato in fisica, traducibile anche con «intreccio». I
          camerieri non lo sanno: è il nome fisico del legame che stanno
          cercando di capire.
        </p>
        <details className="group rounded-lg border border-sky-200 bg-white/70 p-3 dark:border-sky-900 dark:bg-zinc-900/50">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">
            Il parallelo con la fisica: nessun segnale
          </summary>
          <div className="mt-3 space-y-3">
            <P>
              In fisica questa proprietà si chiama <em>no-signalling</em>,
              assenza di segnali. Il formato corrisponde alla scelta della
              misura, cioè alla posizione del selettore di ciascun rivelatore;
              il colore corrisponde all'esito, + o −. Il cameriere di Bob che
              serve sempre lo stesso formato è uno sperimentatore che tiene
              fermo il selettore lontano, sperando di mandare un segnale.
            </P>
            <P>
              Nell'esperimento che il ristorante rappresenta, la meccanica
              quantistica prevede + e − con probabilità uguali. Queste
              probabilità non cambiano al cambiare della misura scelta per Bob:
              la sua scelta cambia soltanto le correlazioni, cioè quanto spesso
              gli esiti dei due coincidono. Guardando solo i propri dati, Alice
              non può scoprire quale misura abbia scelto Bob. Nel modello, non
              sono soltanto le percentuali: l'intera sequenza dei dati locali ha
              le stesse probabilità nei due casi. Nessun metodo di lettura può
              quindi rivelare la scelta lontana.
            </P>
            <P>
              Le correlazioni emergono solo confrontando i dati dei due
              laboratori, e per confrontarli i due laboratori devono scambiarsi
              informazioni con un mezzo ordinario (un telefono, un cavo, un
              messaggero), mai più veloce della luce. Per questo l'entanglement
              non contraddice la relatività: produce correlazioni che nessuna
              strategia basata soltanto su accordi presi in anticipo, senza
              comunicare durante la prova, può riprodurre, ma non permette di
              mandare messaggi.
            </P>
            <Corrispondenza
              righe={[
                [
                  "Scelta della misura (posizione del selettore)",
                  "Formato servito (calice o bottiglia)",
                ],
                ["Esito + / −", "Vino rosso / bianco"],
                [
                  "Selettore lontano tenuto fermo",
                  "Cameriere di Bob che serve sempre lo stesso formato",
                ],
                ["Dati di un solo rivelatore", "Colonna di Alice nel registro"],
                [
                  "Confronto dei dati, dopo uno scambio di informazioni",
                  "Confronto delle due colonne del registro",
                ],
              ]}
            />
          </div>
        </details>
      </>
    ),
    lezione:
      "Il mistero del ristorante stregato non sta in nessuna delle due sale: sta nel confronto fra le due colonne del registro, dove le coppie di colori rispettano la regola dello chef più spesso di quanto permetta qualunque accordo preso prima di entrare. Il cameriere di Alice, che vede solo la sua colonna, ci trova metà rossi e metà bianchi qualunque formato abbia scelto il collega: per questo non riesce a indovinarlo, e i camerieri non possono usare il ristorante stregato per mandarsi messaggi.",
    Sim: NessunMessaggio,
    guida: {
      cosa: "Il gioco della prova del messaggio, nel ristorante stregato. A ogni mese il cameriere di Bob sceglie in segreto un formato e lo serve a Bob tutte le sere; quello di Alice sceglie a caso, come sempre. Tu sei il cameriere di Alice: vedi solo i vini della sua sala e devi indovinare il formato segreto.",
      avvio:
        "Premi «Una sera» o «Tutto il mese» (30 sere), poi rispondi con «Secondo me: calice» o «Secondo me: bottiglia». «Nuovo mese» ricomincia con un nuovo segreto.",
      leggere:
        "A sinistra la colonna di Alice nel registro: la percentuale di rossi con il calice e con la bottiglia, e le ultime sere. Dopo la risposta, a destra, il formato svelato e quello che si vede mettendo accanto le due colonne del registro. In basso il tuo punteggio e la prova di cento mesi con la regola del cameriere che cerca un indizio nei conteggi.",
      mostra:
        "I rossi di Alice restano intorno al 50% qualunque formato abbia scelto il cameriere di Bob: si indovina circa una volta su due, come tirando a sorte, e anche la regola del cameriere che cerca un indizio nei conteggi non fa meglio. La stranezza delle coppie di colori compare solo confrontando le due colonne del registro.",
    },
    riferimenti: [],
  },
  {
    id: "trucchi",
    numero: "Capitolo 9",
    titolo: "Come si bara",
    immagine: "/r04/6-trucchi.svg",
    alt: "Il maître con il registro; un cameriere corre tra le sale e sussurra a Bob come è stata servita Alice.",
    domanda: "Il ristorante normale può fingersi stregato?",
    Testo: () => (
      <>
        <P>
          <strong>Il piano del proprietario.</strong> Il ristorante stregato
          attira clienti da tutta la città, e il proprietario dei due locali
          vorrebbe che anche il ristorante normale sembrasse stregato. Sceglie
          la sfida dello chef del capitolo 3: lì un ristorante normale, con un
          accordo preso prima di entrare, offre al massimo tre cene su quattro
          (S = 2), mentre quello stregato arriva a 85 su 100 (S ≈ 2,83). Per
          superare il 75% nel ristorante normale prova tre trucchi.
        </P>
        <ol className="ml-5 list-decimal space-y-2">
          <li className="leading-relaxed">
            <strong>Il cameriere chiacchierone.</strong> Un cameriere corre fra
            le sale e sussurra a <B /> come è stata servita <A />. Con questa
            notizia Bob sceglie il colore giusto quasi ogni sera. È proprio il
            messaggio fra le sale che i camerieri cercavano nel capitolo 8: lì
            non passava, qui passa davvero, perché qualcuno lo porta di persona.
          </li>
          <li className="leading-relaxed">
            <strong>Le sere che si perdono.</strong> Prima di cena Alice e Bob
            scommettono su come li serviranno i camerieri e scelgono un piano
            che vince proprio in quel caso. Quando la scommessa è sbagliata,
            l'ordine a volte «si perde» e la sera non finisce nel registro. Le
            sere rimaste non sono più un campione onesto.
          </li>
          <li className="leading-relaxed">
            <strong>I formati già noti.</strong> I camerieri non scelgono
            davvero a caso: Alice e Bob sanno già, prima di cena, come li
            serviranno, e preparano il piano giusto per ogni sera.
          </li>
        </ol>
        <P>
          Con ognuno di questi trucchi il registro del ristorante normale sembra
          stregato. Per credere a un ristorante stregato, quindi, bisogna
          controllare tre cose: che fra le sale non passi nessuno, che il
          registro contenga tutte le sere, e che i formati siano scelti davvero
          a caso, senza che nessuno possa saperli prima.
        </P>
        <P>
          C'è infine un quarto ristorante, solo immaginato: il super-stregato.
          Vince la sfida dello chef tutte le sere (S = 4), eppure, come nel
          capitolo 8, la colonna di Alice resta metà rossi e metà bianchi:
          nessun messaggio passa fra le sale. Non viola nessuna delle regole del
          racconto, ma la natura non lo permette: il ristorante stregato vero si
          ferma a 2,83. Perché proprio lì è una domanda ancora aperta.
        </P>
        <details className="group rounded-lg border border-sky-200 bg-white/70 p-3 dark:border-sky-900 dark:bg-zinc-900/50">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">
            Il parallelo con la fisica{" "}
            <span className="font-normal normal-case tracking-normal text-zinc-500 group-open:hidden">
              (le scappatoie)
            </span>
          </summary>
          <div className="mt-3 space-y-3">
            <P>
              I tre trucchi sono le tre scappatoie (in inglese
              <em> loopholes</em>) che gli esperimenti sul <TeoremaBell /> hanno
              dovuto chiudere:
            </P>
            <ul className="ml-5 list-disc space-y-1">
              <li className="leading-relaxed">
                <strong>località:</strong> le due misure vanno fatte così
                lontane e così in fretta che nessun segnale, nemmeno alla
                velocità della luce, possa passare dall'una all'altra;
              </li>
              <li className="leading-relaxed">
                <strong>rilevazione:</strong> se si perdono troppe particelle,
                quelle registrate possono non essere un campione onesto;
              </li>
              <li className="leading-relaxed">
                <strong>libertà di scelta:</strong> le misure devono essere
                scelte a caso, indipendentemente da come è stata preparata la
                coppia di particelle.
              </li>
            </ul>
            <P>
              Gli esperimenti del 2015, a Delft, Vienna e Boulder, le hanno
              chiuse insieme per la prima volta. Nel 2018 il Big Bell Test ha
              fatto scegliere le misure a circa centomila volontari in tutto il
              mondo.
            </P>
            <P>
              Il ristorante super-stregato è la «scatola» di Popescu e Rohrlich
              (1994): rispetta l'assenza di segnali ma arriva a S = 4. La
              meccanica quantistica si ferma prima, al limite di Tsirelson, 2√2
              ≈ 2,83.
            </P>
            <Corrispondenza
              righe={[
                ["Scappatoia della località", "Il cameriere chiacchierone"],
                ["Scappatoia della rilevazione", "Le sere che si perdono"],
                ["Scappatoia della libertà di scelta", "I formati già noti"],
                [
                  "Scatola di Popescu e Rohrlich",
                  "Il ristorante super-stregato",
                ],
                [
                  "Limite di Tsirelson, 2√2",
                  "Il ristorante stregato vero, 2,83",
                ],
              ]}
            />
          </div>
        </details>
      </>
    ),
    lezione:
      "Barare si può: comunicando, scartando sere o conoscendo le domande. Per questo un ristorante stregato vero va controllato con sale lontane, registri completi e domande davvero libere.",
    Sim: Trucchi,
    guida: {
      cosa: "Il ristorante normale con l'accordo «sempre bianco», che da solo vince il 75% delle sere (S = 2), prova a sembrare stregato con un trucco.",
      avvio:
        "Scegli il trucco in alto, regola il cursore (quanto spesso si bara), poi premi «Fai partire il trucco» o «20 sere».",
      leggere:
        "Nel riquadro «Quello che vede il maître»: sere segnate su quelle servite, cene offerte e il numero S con la barra (tacche 2 e 2,83).",
      mostra:
        "Con il cursore a zero S resta 2; alzandolo supera 2 e perfino 2,83, ma è un imbroglio. Con il registro incompleto guarda anche quante sere mancano all'appello. Il super-stregato arriva a 4 senza messaggi, ed è proprio quello che la natura non fa.",
    },
    riferimenti: [],
  },
  {
    id: "alveare",
    numero: "Capitolo 10",
    titolo: "La sala a nido d'ape",
    immagine: "/r04/7-alveare.svg",
    alt: "Una sala con 37 tavoli esagonali numerati da 1 a 9; Alice e Bob ai lati.",
    domanda: "Sfruttando al meglio i numeri dei tavoli, si può superare il 75%?",
    Testo: () => (
      <>
        <P>
          Rinunciando agli imbrogli, il proprietario tenta di battere il 75%
          con una sala più ingegnosa. Questa volta Alice e Bob non scelgono
          il colore del vino: lo chef decide quale vino servire a ciascuno,
          rosso o bianco, in base al numero del tavolo occupato e al formato
          scelto dal cameriere, calice o bottiglia.
        </P>
        <P>
          Il proprietario dispone 37 tavoli esagonali a nido d&apos;ape.
          Quello centrale resta fuori gioco; gli altri 36 sono numerati
          da 1 a 9. I numeri sono equidistribuiti: ciascuno compare quattro
          volte. Su ogni linea definita dalla griglia i numeri sono tutti
          diversi; quelli uguali ricompaiono su tavoli che non hanno mai
          una linea comune.
          Il maître prova tre assegnazioni di tavoli per <A /> e <B />.
          Il proprietario vuole scoprire quale delle tre
          assegnazioni permetta di ottenere più cene offerte:
        </P>
        <ul className="ml-5 list-disc space-y-2 leading-relaxed">
          <li><strong>Stessa linea:</strong> i due numeri sono diversi.</li>
          <li><strong>Nessuna linea comune, numeri diversi:</strong> manca
            sia l&apos;allineamento sia l&apos;uguaglianza.</li>
          <li><strong>Gemelli:</strong> stesso numero, nessuna linea comune.</li>
        </ul>
        <P>
          Il proprietario fornisce allo chef una speciale calcolatrice.
          Per ciascun tipo di assegnazione, la calcolatrice valuta diversi modi
          di associare numero e formato al colore del vino. Per esempio:
          «con il calice, rosso per i numeri pari e bianco per i dispari».
          Prima che i camerieri scelgano i formati, calcola la probabilità
          di vincere la sfida per ogni piano esaminato
          e indica allo chef quello con la probabilità più alta.<CodiceCalcolatrice /> Può scegliere
          anche un colore fisso, se i numeri non migliorano il risultato.
        </P>
        <P>
          Poi, in ciascuna sala, il cameriere sceglie a caso calice o
          bottiglia, con uguale probabilità. Le due scelte sono indipendenti
          fra loro, dai numeri dei tavoli e dal piano: ciascuna delle quattro
          coppie di formati ha quindi probabilità di un quarto.
        </P>
        <aside aria-label="Il risultato centrale" className="space-y-3 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <h3 className="font-semibold">Anche il miglior tentativo si ferma a tre cene su quattro.</h3>
          <P>
            Il piano della calcolatrice è buono tanto quanto “Sempre rosso”:
            entrambi vincono mediamente 3 volte su 4. Anche con i gemelli,
            la perfetta coincidenza dei numeri non permette di superarlo.
            Il riferimento stregato arriva invece a circa <strong>85,4%</strong>,
            senza usare i numeri e senza comunicazione fra le due sale.
          </P>
          <P>
            Sono probabilità attese: su 200 cene le percentuali osservate
            possono oscillare. Il limite riguarda la probabilità di successo,
            non il risultato di ogni breve sequenza.
          </P>
        </aside>
        <details className="group rounded-lg border border-sky-200 bg-sky-50/60 p-4 dark:border-sky-900 dark:bg-sky-950/30">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">
            Il parallelo con la fisica
          </summary>
          <div className="mt-3 space-y-3">
            <P>
              I numeri sono <strong>variabili nascoste locali correlate</strong>:
              informazioni distribuite prima della scelta delle misure.
              «Locali» non significa indipendenti fra loro: i due numeri
              possono essere legati, anche uguali. Lo chef applica però
              una regola separata per ciascuna sala: il colore servito
              dipende soltanto dal numero e dal formato di quel cliente.
            </P>
            <P>
              Con scelte delle misure indipendenti dalla preparazione e senza
              comunicazione, il <TeoremaBell /> limita già tutti questi piani,
              anche oltre la famiglia esplorata dalla calcolatrice. Nella sfida
              CHSH il massimo classico è il 75% (S = 2); il riferimento
              quantistico raggiunge circa l&apos;85,4% (S = 2√2 ≈ 2,83).
              Aggiungere informazioni condivise più elaborate non colma
              questa differenza.
            </P>
          </div>
        </details>
      </>
    ),
    lezione:
      "Nelle condizioni della sfida, neppure numeri perfettamente uguali permettono di superare il 75%: il miglior piano del proprietario non batte «Sempre rosso».",
    Sim: SalaAlveare,
    guida: {
      cosa: "Il proprietario mette alla prova il piano più vantaggioso per ciascuna disposizione dei tavoli. Riuscirà a ottenere più cene offerte di «Sempre rosso» e ad avvicinarsi al ristorante stregato?",
      avvio: "Scegli soltanto l’assegnazione dei tavoli. Leggi le regole del piano ottimizzato, poi premi «+1 cena», «▶ Avvia» o «Completa 200 cene». L’esperimento si ferma a 200 cene per ciascun confronto. Cambiare assegnazione ricalcola il piano e azzera i conteggi.",
      leggere: "Confronta i tre riquadri: sempre rosso, piano ottimizzato, riferimento stregato. Le due tabelline mantengono i numeri dell’ultima cena (una coppia di esempio prima dell’avvio) e mostrano i vini che i due piani servirebbero per ciascuna coppia di formati. Lo sfondo giallino indica i formati effettivamente estratti nell’ultima cena. La tabella confronta i valori esatti di «Sempre rosso», del piano dalla calcolatrice e del riferimento stregato per tutte le assegnazioni.",
      mostra: "La calcolatrice valuta 65.536 combinazioni di regole basate su proprietà dei numeri e colori fissi. Il miglior piano ammesso raggiunge il 75%, come sempre rosso; nessun piano locale può superare quel limite nelle condizioni della sfida. Nei gemelli, a parità di successo, viene preferito il piano basato sui numeri. Il riferimento stregato resta all’85,4% atteso. Su 200 cene le frequenze osservate possono differire anche fra piani con la stessa probabilità.",

    },
  },
  {
    id: "venti",
    numero: "Capitolo 11",
    titolo: "Il gioco dei venti",
    immagine: "/r04/8-terrazza.svg",
    alt: "Alice e Bob in terrazza davanti a una rosa dei venti.",
    domanda: "Un valore di S oltre 2 basta per parlare di stregoneria?",
    Testo: () => (
      <>
        <P>Dopo la poco entusiasmante esperienza nella sala a nido d’ape, <A /> e <B /> decidono che nelle prossime sere ceneranno allo stesso tavolo. E non in una sala qualsiasi: in terrazza.</P>
        <P>Il sommelier appoggia sul tavolo una rosa dei venti. «Scegliete ciascuno una direzione, senza consultarvi». Nelle sere senza vento non hanno indizi: Alice e Bob scelgono a caso, indipendentemente. Nelle sere ventose, invece, la stessa brezza raggiunge entrambi e può orientare le loro scelte.</P>
        <P>Solo dopo che hanno annotato le proprie direzioni, il sommelier estrae a caso una delle quattro domande del gioco, ciascuna con probabilità ¼, indipendentemente dal vento e dalle direzioni annotate. Nella prima serata viene estratta la domanda che propone queste quattro coppie: Nord e Nord-est, Nord e Sud-ovest, Sud e Nord-est, Sud e Sud-ovest. È il sommelier a individuare la coppia più simile alle direzioni annotate: la prima direzione corrisponde ad Alice, la seconda a Bob. Ogni sera ripete l’estrazione della domanda: la stessa può ricomparire anche per più sere consecutive.</P>
        <P>Il sommelier ha dimestichezza con i conti e non si affida a un’impressione: per ogni coppia proposta calcola lo scarto angolare rispetto alla direzione di Alice e quello rispetto alla direzione di Bob. Somma i due scarti e sceglie la coppia con la somma più piccola. In questo modo ottiene un risultato preciso. Con questo criterio il calcolo equivale a trovare separatamente l’alternativa più vicina alla direzione di Alice e quella più vicina alla direzione di Bob.</P>
        <details className="group rounded-lg border border-sky-200 bg-white/70 p-3 dark:border-sky-900 dark:bg-zinc-900/50">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">Le alternative del sommelier</summary>
          <div className="mt-3 space-y-3 overflow-x-auto">
            <p className="text-sm">La domanda estratta nella prima serata del racconto è la prima riga, AB. Ogni riga elenca tutte e quattro le coppie fra cui il sommelier cerca quella più vicina alle direzioni annotate.</p>
            <table className="w-full text-left text-sm"><thead><tr><th className="p-2">Domanda</th><th className="p-2">Le quattro coppie proposte</th></tr></thead><tbody>{[
              ["AB", ["Nord e Nord-est", "Nord e Sud-ovest", "Sud e Nord-est", "Sud e Sud-ovest"]],
              ["AB′", ["Nord e Sud-est", "Nord e Nord-ovest", "Sud e Sud-est", "Sud e Nord-ovest"]],
              ["A′B", ["Est e Nord-est", "Est e Sud-ovest", "Ovest e Nord-est", "Ovest e Sud-ovest"]],
              ["A′B′", ["Est e Sud-est", "Est e Nord-ovest", "Ovest e Sud-est", "Ovest e Nord-ovest"]],
            ].map(([id, coppie]) => <tr key={id} className={id === "AB" ? "bg-amber-50 dark:bg-amber-950/30" : ""}><td className="border-t p-2 align-top font-semibold">{id}{id === "AB" && <span className="mt-1 block text-xs font-normal">Prima serata del racconto</span>}</td><td className="border-t p-2"><ul className="grid gap-x-4 gap-y-1 sm:grid-cols-2">{coppie.map(c => <li key={c}>{c}</li>)}</ul></td></tr>)}</tbody></table>
            <p className="text-sm">In ciascuna coppia, la prima direzione riguarda Alice e la seconda Bob. A significa Nord/Sud, A′ Est/Ovest; B significa Nord-est/Sud-ovest, B′ Sud-est/Nord-ovest. Le prime alternative di ciascun gruppo valgono +1, le seconde −1. La domanda è estratta a caso, indipendentemente dalle direzioni annotate e dal vento.</p>
          </div>
        </details>
        <P>«Se sentiamo lo stesso vento, le nostre risposte dovrebbero assomigliarsi di più», osserva Bob. È possibile: una causa comune può creare correlazioni. Ma basta a superare S = 2? Il maître propone di confrontare due modelli semplici.</P>
        <P>Nel modello senza vento, tutte le direzioni sono equiprobabili e le scelte sono indipendenti. Nel modello con vento, Alice e Bob percepiscono perfettamente la stessa direzione, che cambia a caso da una sera all’altra. È un caso ideale, senza errori di percezione, utile per isolare l’effetto della causa comune.</P>
        <P>Il risultato atteso è <strong>S = 0 senza vento</strong> e <strong>S = 2 con vento</strong>. Il vento rende le risposte correlate, ma con questa regola non permette di oltrepassare il limite: ciascuna componente della coppia finale dipende soltanto dalla propria direzione e dalle proprie alternative. Nelle 200 sere simulate i valori osservati possono oscillare, anche oltre 2 per caso.</P>
        <P>Nel capitolo successivo torneremo a piatti e vino: lì le due decisioni useranno davvero entrambe le portate e il confronto cambierà.</P>
      </>
    ),
    lezione: "Una causa comune può correlare le risposte senza superare il limite CHSH. Conta come vengono prodotte le risposte, non soltanto il fatto che si assomiglino.",
    Sim: GiocoVenti,
    avvertenzaSim: "Modello classico inventato: nessun dato psicologico o meteorologico. Con vento si assume una percezione identica per entrambi; le oscillazioni del campione non modificano il limite teorico.",
    guida: {
      cosa: "Confronta direzioni iniziali indipendenti, senza vento, e una direzione condivisa, con vento. Il sommelier determina la coppia finale minimizzando la somma degli scarti angolari.",
      avvio: "Scegli senza vento o con vento, poi premi Avvia oppure +1 sera. Il test si ferma a 200 sere. Cambiare scenario azzera il registro.",
      leggere: "La rosa mostra le direzioni iniziali dell’ultima sera; la riga gialla indica la domanda estratta. Confronta i quattro correlatori e S osservato con la previsione esatta.",
      mostra: "S atteso passa da 0 a 2: emergono correlazioni da una causa comune, senza superamento teorico del limite locale. Con poche sere S osservato può essere diverso.",
    },
    riferimenti: [R.videoVenti],
  },
  {
    id: "terrazza",
    numero: "Capitolo 12",
    titolo: "Insieme in terrazza",
    immagine: "/r04/8-terrazza-cena.svg",
    alt: "Alice e Bob allo stesso tavolo in terrazza; il cameriere guarda Alice mentre serve il vino.",
    domanda: "Che cosa succede ai conti quando si può scegliere insieme?",
    Testo: () => (
      <>
        <P>Dopo il gioco dei venti, <A /> e <B /> restano al loro tavolo in terrazza. «Per ottenere un numero oltre 2 servono davvero pensieri quantistici?» si chiedono. Il maître propone di guardare le loro normali ordinazioni: anche lì le decisioni possono dipendere dall’intera situazione.</P>
        <h3 className="text-lg font-semibold">Il colore e il formato: le regole del tavolo</h3>
        <P>Le portate sono già decise quando arriva il momento di ordinare da bere.<br />
          «Scelgo io il colore del vino per entrambi», dice Alice.<br />
          «Allora io scelgo il formato: se prenderlo al calice o in bottiglia», risponde Bob.</P>
        <P>Questa volta possono parlare, guardare entrambi i piatti e assaggiare l’uno dal piatto dell’altra. Alice sceglie casualmente fra risotto ai funghi e pesce al forno; Bob fra frittura di pesce e arrosto. Ciascuno sceglie per conto proprio, con la stessa probabilità per le due portate e senza farsi influenzare dall’altro.</P>
        <P>Alice propone una regola semplice per il colore: «Prendiamo bianco se mangiamo entrambi pesce; altrimenti rosso». Il colore scelto vale per tutto il tavolo.</P>
        <P>«Il colore lo scegli tu», dice Bob. «Se si abbina bene a entrambi i piatti, prendiamo una bottiglia; altrimenti basta un calice a testa».</P>
        <P>Il menù parla chiaro: risotto ai funghi e arrosto suggeriscono entrambi il rosso; pesce al forno e frittura di pesce suggeriscono entrambi il bianco. Al tavolo, quindi, l’ordinazione resta sempre unica: un solo tipo di vino (rosso o bianco), servito o in bottiglia o in due calici.</P>
        <h3 className="text-lg font-semibold">L’imprevisto e i conti del maître</h3>
        <P>Alice e Bob seguono sempre queste regole. È il cameriere a introdurre un imprevisto: intento ad ammirare Alice, <strong>una sera su cinque in media sbaglia il formato richiesto da Bob</strong>. Se Bob chiede una bottiglia, porta due calici; se chiede due calici, porta una bottiglia. Il colore del vino, invece, resta sempre quello corretto scelto da Alice. L’errore avviene in modo del tutto casuale, con la stessa probabilità per qualsiasi coppia di piatti.</P>
        <details className="group rounded-lg border border-sky-200 bg-white/70 p-3 dark:border-sky-900 dark:bg-zinc-900/50">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">I conti del maître</summary>
          <div className="mt-4 space-y-4">
            <P>Il maître registra sul suo taccuino ciò che viene effettivamente servito al tavolo e assegna dei punteggi numerici:</P>
            <ul className="list-disc space-y-1 pl-6">
              <li><strong>Colore:</strong> Rosso = +1, Bianco = −1.</li>
              <li><strong>Formato:</strong> Due calici = +1, Bottiglia = −1.</li>
            </ul>
            <P>Per ogni cena, il maître moltiplica il numero del colore per il numero del formato. Poi calcola il correlatore E<CorrelatoreInfo />, cioè la media di questi prodotti per ciascuno dei quattro menù possibili.</P>
            <P>Per capire come si arriva al valore finale S, usiamo delle abbreviazioni: <strong>A</strong> indica il risotto di Alice e <strong>A′</strong> il suo pesce al forno; <strong>B</strong> indica la frittura di Bob e <strong>B′</strong> il suo arrosto. La formula per calcolare l’indice delle correlazioni S è:</P>
            <p className="overflow-x-auto rounded-lg bg-zinc-100 p-3 font-mono text-sm dark:bg-zinc-800">S = |E(AB) − E(AB′) + E(A′B) + E(A′B′)|</p>
            <P>Se il cameriere fosse perfetto e non sbagliasse mai, le regole di Alice e Bob produrrebbero questi risultati:</P>
            <ul className="list-disc space-y-2 pl-6">
              <li>Per il menù <strong>AB</strong> (Risotto e Frittura): i piatti chiedono due calici di rosso. Il prodotto è (+1) × (+1) = <strong>+1</strong>.</li>
              <li>Per il menù <strong>AB′</strong> (Risotto e Arrosto): i piatti chiedono una bottiglia di rosso. Il prodotto è (+1) × (−1) = <strong>−1</strong>.</li>
              <li>Per il menù <strong>A′B</strong> (Pesce e Frittura): i piatti chiedono una bottiglia di bianco. Il prodotto è (−1) × (−1) = <strong>+1</strong>.</li>
              <li>Per il menù <strong>A′B′</strong> (Pesce e Arrosto): i piatti chiedono due calici di rosso. Il prodotto è (+1) × (+1) = <strong>+1</strong>.</li>
            </ul>
            <P>Inserendo questi quattro correlatori senza errori (+1, −1, +1, +1) nella formula, il segno meno davanti a E(AB′) trasforma quel −1 in un +1. Il calcolo diventa così una somma perfetta: |1 − (−1) + 1 + 1| = 4. Senza errori, S arriverebbe al massimo algebrico di 4.</P>
            <P>Ma il cameriere sbaglia il formato nel 20% dei casi. In quelle cene distratte, il formato si inverte e il prodotto finale cambia segno. Ogni correlatore viene quindi moltiplicato per 0,8 − 0,2 = 0,6.</P>
            <P>I quattro correlatori medi attesi diventano quindi +0,6, −0,6, +0,6, +0,6. Quelli osservati sul taccuino possono oscillare, soprattutto con poche cene. Applicando la formula ai valori attesi:</P>
            <p className="overflow-x-auto rounded-lg bg-zinc-100 p-3 font-mono text-sm dark:bg-zinc-800">S = |0,6 − (−0,6) + 0,6 + 0,6| = 2,4</p>
          </div>
        </details>
        <P>Con un errore su cinque, emerge un valore medio di <strong>2,4</strong>: un numero che oltrepassa il limite classico di 2, pur restando sotto il massimo quantistico di circa 2,83.</P>
        <P>Il motivo è sul tavolo: entrambi conoscono l’intero menù. La regola di Alice resta sempre la stessa, ma per applicarla deve conoscere entrambi i piatti. Anche Bob considera tutti e due i piatti. Il limite 2 richiedeva decisioni basate soltanto sulle informazioni della propria sala. Qui quelle condizioni non ci sono più. Non assegniamo cene vinte: confrontiamo i correlatori, senza introdurre una nuova regola di vittoria.</P>
        <P>Questo modello delle ordinazioni non spiega le risposte dell’esperimento sui venti. Mostra però perché un valore di S oltre 2, da solo, non basta a identificare un fenomeno quantistico.</P>
        <ParalleloFisica />
      </>
    ),
    lezione: "S oltre 2, da solo, non basta: bisogna chiedersi quali informazioni hanno guidato le risposte. In terrazza si decide conoscendo entrambi i piatti.",
    Sim: Terrazza,
    avvertenzaSim: "Questa simulazione usa preferenze classiche inventate e decisioni che conoscono entrambi i piatti. Non riproduce dati sperimentali né correlazioni quantistiche fra sistemi isolati.",
    guida: {
      cosa: "Cene allo stesso tavolo: Alice sceglie il colore del vino per entrambi e Bob decide fra bottiglia e due calici dello stesso vino. Le scelte dipendono da entrambi i piatti.",
      avvio: "Premi ▶ Avvia per animare le cene e Pausa per fermarle; oppure usa +1 cena. L’esperimento si ferma a 200 cene. Azzera ricomincia il registro. Alice e Bob mantengono le loro regole; il cameriere inverte il formato richiesto con probabilità 20% a ogni cena.",
      leggere: "Confronta S atteso e osservato. La tabella spiega ogni coppia di piatti e mostra i quattro correlatori.",
      mostra: "Il valore medio atteso è S = 2,4. Il registro conta il colore e il formato serviti, non soltanto quelli richiesti. Qui conoscono entrambi i piatti, quindi non valgono le condizioni delle sale isolate. Con poche cene il valore osservato può oscillare molto; aumentando le cene tende ad avvicinarsi al valore atteso. Il confronto con 2 riguarda le condizioni delle sale isolate, che qui non valgono. Non è una prova di stregoneria.",
    },
  },
  {
    id: "conto",
    numero: "Epilogo",
    titolo: "Il conto",
    immagine: "/r04/9-epilogo.svg",
    alt: "Alice e Bob brindano con un calice di rosso e uno di bianco; accanto, il conto.",
    domanda: "Che cosa ci hanno insegnato i due ristoranti?",
    Testo: () => (
      <>
        <P>
          A fine stagione il proprietario chiude i conti. Si può spiegare il
          ristorante stregato con istruzioni concordate in anticipo e risposte
          basate soltanto sulle informazioni disponibili nella propria sala?
          Nel 1964 John Bell mostrò come mettere alla prova questa possibilità,
          con quello che oggi si chiama <TeoremaBell />. Nella sfida del nostro
          racconto, se le domande sono scelte liberamente e indipendentemente
          dalle istruzioni e non passano informazioni fra le sale prima delle
          risposte, un ristorante normale non può superare il 75% di cene vinte,
          equivalente a S = 2. Nemmeno istruzioni che includano scelte casuali
          permettono di superare quel limite.
          Ah! L'ultima volta che si sono visti Alice e Bob al ristorante, il maitre gli aveva fatto trovare un tavolo speciale, riservato per loro, con 4 mazzetti di carte da gioco coperti sopra uno strano dispositivo elettronico.
          Sembra che i due si siano calati giù dalla terrazza del ristorante per poi sparire nel nulla.
        </P>
        <P>
          Le correlazioni del ristorante stregato esistono davvero. Negli
          esperimenti fisici si usano coppie di particelle entangled e misure
          effettuate in laboratori lontani. Dagli esperimenti di Alain Aspect
          del 1982 a quelli del 2015 che hanno chiuso insieme le principali
          scappatoie sperimentali, i risultati hanno confermato violazioni
          delle disuguaglianze di Bell. Nel 2022 Aspect, John Clauser e Anton
          Zeilinger hanno ricevuto il Nobel per la fisica.
        </P>
        <figure className="max-w-3xl space-y-2">
          <img
            src="https://scienzapertutti.infn.it/images/stories/evidenza/nobel_2022.jpg"
            alt="Alain Aspect, John F. Clauser e Anton Zeilinger, premi Nobel per la fisica 2022."
            loading="lazy"
            className="h-auto w-full rounded-xl"
          />
          <figcaption className="text-xs text-zinc-600 dark:text-zinc-400">
            Alain Aspect, John F. Clauser e Anton Zeilinger: Nobel per la fisica 2022.
            {" "}<a href="https://scienzapertutti.infn.it/images/stories/evidenza/nobel_2022.jpg" target="_blank" rel="noreferrer" className="underline">Immagine: ScienzaPerTutti · INFN</a>.
          </figcaption>
        </figure>
        <P>
          Il gioco dei venti distingue il caso indipendente da una causa
          comune. Senza vento, nel nostro modello S atteso è 0; con la stessa
          brezza percepita da entrambi arriva a 2. Le risposte diventano
          correlate, ma il criterio degli scarti angolari equivale a due
          decisioni separate. Il vento comune non basta a superare il limite.
        </P>
        <P>
          Nell’ordinazione del vino, invece, le regole di Alice e Bob usano
          entrambe le portate: senza errori darebbero S = 4. Il cameriere,
          sbagliando formato una volta su cinque in media, attenua il valore
          atteso a 2,4. Qui non sono gli errori a creare il superamento di 2:
          è cambiata l’informazione usata nelle decisioni. Questo non riproduce
          il risultato delle sale separate, dove ciascuno dispone soltanto
          della propria domanda e delle eventuali istruzioni condivise.
        </P>
        <P>
          Nella sfida CHSH con le sale separate, il massimo quantistico è
          S = 2√2, circa 2,83, che corrisponde a circa l’85,4% di cene vinte.
          Queste correlazioni non permettono di inviare messaggi scegliendo
          il risultato della propria misura. Il risultato sorprendente non è
          dunque un numero alto da solo: è superare 2 rispettando le condizioni
          che impediscono al ristorante normale di farlo.
        </P>
        <P>
          Quale descrizione della realtà dobbiamo allora rivedere? Il teorema
          non sceglie per noi un’interpretazione della fisica quantistica.
          Esclude però che tutte quelle correlazioni si possano spiegare con
          sole istruzioni condivise e risposte locali, mantenendo indipendenti
          le scelte delle misure. È questo il conto che il ristorante normale
          non riesce a pagare.
        </P>
      </>
    ),
    lezione:
      "Una causa comune, come il vento, può correlare risposte locali senza superare S = 2. Usare entrambe le domande cambia le condizioni. Il risultato quantistico supera 2 anche senza questo scambio di informazioni.",
    riferimenti: [R.bell, R.hensen, R.nobel, R.videoEntanglement],
  },
];
