"use client";

// Il racconto di R04: Alice e Bob tra due ristoranti gemelli, uno normale
// (gusti scritti in anticipo: variabili nascoste locali) e uno stregato
// (bottiglie gemelle: entanglement), fino al teorema di Bell.
// Ogni capitolo ha illustrazione (public/r04), testo, lezione, simulazione
// e riferimenti ufficiali.

import { BottleWine, Wine } from "lucide-react";
import dynamic from "next/dynamic";
import { Problema } from "./problema";
import { LezioneEsterna } from "./lezione";
import { TabellaAccordi } from "./sim/TabellaAccordi";
import { TeoremaBell } from "./teorema";
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
              const vinta = a === 1 && b === 1 ? !uguali : uguali;
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
    riferimenti: [R.bell, R.mermin],
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
                se i due colori sono uguali, tranne quando arrivano due
                bottiglie: due bottiglie dello stesso vino sarebbero uno spreco,
                e allora i colori devono essere diversi. Il registro speciale
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
              titolo: "Se c'è almeno un calice, colori quasi sempre uguali.",
              testo:
                "In queste sere Alice e Bob ordinano lo stesso colore circa 85 volte su 100.",
            },
            {
              titolo: "Con due bottiglie, colori quasi sempre diversi.",
              testo:
                "In queste sere ordinano colori diversi circa 85 volte su 100.",
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
                esempio, con il piano «sempre bianco», ecco le due schede e che
                cosa succede nelle quattro combinazioni di formati:
              </P>
              <SchedeSfida alice="BB" bob="BB" />
              <P>
                Nessuna coppia di schede vince tutte e quattro le combinazioni.
                Proviamo a vincerle tutte e vediamo dove si inceppa (= vuol dire
                stesso colore):
              </P>
              <ol className="ml-5 list-decimal space-y-2">
                <li>
                  <strong>Calice con calice:</strong> per vincere servono colori
                  uguali.
                  <Confronto a={["Alice", "calice"]} b={["Bob", "calice"]} />
                </li>
                <li>
                  <strong>Bottiglia di Alice con calice di Bob:</strong> anche
                  qui colori uguali.
                  <Confronto a={["Alice", "bottiglia"]} b={["Bob", "calice"]} />
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
                  uguali anche qui.
                  <Confronto a={["Alice", "calice"]} b={["Bob", "bottiglia"]} />
                </li>
                <li>
                  <strong>Quindi</strong>, dai passi 3 e 4, anche le due
                  bottiglie hanno lo stesso colore.
                  <Confronto
                    a={["Alice", "bottiglia"]}
                    b={["Bob", "bottiglia"]}
                  />
                </li>
                <li>
                  <strong>Ma</strong> con due bottiglie, per vincere, i colori
                  devono essere diversi: il passo 5 lo impedisce.
                  <Confronto
                    a={["Alice", "bottiglia"]}
                    b={["Bob", "bottiglia"]}
                    uguali={false}
                  />
                </li>
              </ol>
              <P>
                Ogni coppia di schede perde quindi almeno una combinazione su
                quattro. Il piano «sempre bianco», come si vede nella tabella,
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
                coppie di fotoni, sempre preparate nello stesso modo, e le manda
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
                nella quarta (−22,5° per Bob con 45° per Alice): sono i tre
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
                  ["Esito: passa (+) / non passa (−)", "Vino rosso / bianco"],
                  [
                    "Esiti uguali circa 85 volte su 100, tranne −22,5° con 45°",
                    "Colori uguali, tranne con due bottiglie",
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
            uguali, −1 se sono diversi.
          </li>
          <li className="leading-relaxed">
            <strong>In ogni gruppo fa la media dei punteggi.</strong> Viene un
            numero fra −1 (colori sempre diversi) e +1 (sempre uguali); per
            esempio, con colori uguali in 85 sere su 100 la media è 0,85 − 0,15
            = 0,70.
          </li>
          <li className="leading-relaxed">
            <strong>
              Somma le medie dei primi tre gruppi e sottrae quella delle due
              bottiglie.
            </strong>{" "}
            Il meno c'è perché con due bottiglie lo chef vuole colori diversi:
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
                  Piano «sempre bianco»
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
        <LezioneEsterna
          src="/chsh-game.html"
          titolo="Approfondimento: il gioco CHSH"
          nota="lezione di IBM Quantum Learning, in inglese"
        />
      </>
    ),
    lezione:
      "Ristorante normale: al massimo 75% di cene offerte, S ≤ 2. Ristorante stregato: 85,4%, S ≈ 2,83, senza che le sale comunichino.",
    Sim: SfidaChef,
    guida: {
      cosa: "Ogni sera il cameriere di ciascuna sala decide a caso se servire in calice o in bottiglia. Lo chef offre la cena se i colori sono uguali, ma con due bottiglie devono essere diversi. A sinistra Alice e Bob nel ristorante normale con un piano deciso prima; a destra il ristorante stregato, dove Alice e Bob non hanno nessun piano.",
      avvio:
        "A sinistra scegli il colore che Alice e Bob ordineranno per ogni formato (si parte da «sempre bianco»); Poi premi «Fai partire le cene» o «Una cena».",
      leggere:
        "Per ogni ristorante: la percentuale di cene offerte con la barra (tacche 75% e 85,4%) e, sotto, il registro del maître con le quattro medie e il numero S.",
      mostra:
        "Nessun piano del ristorante normale supera il 75% e S = 2: la tabellina delle quattro serate mostra sempre almeno una sera persa. Il ristorante stregato arriva all'85,4% e S ≈ 2,83.",
    },
    riferimenti: [R.chsh, R.tsirelson],
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
    id: "contabile",
    numero: "Capitolo 5",
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
    numero: "Capitolo 6",
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
    numero: "Capitolo 7",
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
            messaggio fra le sale che i camerieri cercavano nel capitolo 6: lì
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
          capitolo 6, la colonna di Alice resta metà rossi e metà bianchi:
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
    numero: "Capitolo 8",
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
    id: "terrazza",
    numero: "Capitolo 9",
    titolo: "Insieme in terrazza",
    immagine: "/r04/8-terrazza-cena.svg",
    alt: "Alice e Bob allo stesso tavolo in terrazza, con due piatti, vino e il menù delle quattro cene.",
    domanda: "Che cosa succede ai conti quando si può scegliere insieme?",
    Testo: () => (
      <>
        <P>Dopo la poco entusiasmante esperienza nella sala a nido d’ape, <A /> e <B /> decidono che nelle prossime sere ceneranno allo stesso tavolo. E non in una sala qualsiasi: in terrazza.</P>
        <P>Le portate sono già decise quando arriva il momento di ordinare da bere. «Al colore del vino penso io», dice Alice. «Allora io scelgo se prenderlo al calice o in bottiglia», risponde Bob. Questa volta possono parlare, guardare entrambi i piatti e assaggiare l’uno dal piatto dell’altra.</P>
        <P>Ogni sera Alice riceve, a sorte, un risotto ai funghi oppure pesce al forno; Bob pesce al forno oppure arrosto. Non devono scegliere nello stesso momento: basta che ciascuno estragga il proprio piatto senza farsi guidare dalla scelta dell’altro. Chiamiamo A il risotto di Alice e A′ il suo pesce; B il pesce di Bob e B′ il suo arrosto. AB, AB′, A′B e A′B′ indicano quindi quattro coppie di piatti, non quattro risposte.</P>
        <P>Bob preferisce una bottiglia da condividere quando i due piatti si accompagnano allo stesso vino: rosso con risotto ai funghi e arrosto, bianco con due piatti di pesce. Quando invece uno mangia pesce e l’altro un piatto più intenso, preferisce ordinare al calice, così ciascuno può scegliere il proprio vino.</P>
        <P>Alice ama il rosso con i funghi. Quando entrambi ordinano pesce, preferisce il bianco. Se invece Bob ordina arrosto, Alice gli chiede sempre un assaggio: anche quando il suo piatto è pesce, sceglie il rosso per accompagnare quei bocconi di carne. Il registro annota il colore del vino di Alice e la scelta di Bob fra calici e bottiglia. Quando ordinano calici separati, il colore del vino di Bob non entra nel conto.</P>
        <P>Ma una preferenza non è un obbligo. Possiamo immaginare che entrambi scelgano ciò che preferiscono quattro sere su cinque; nella quinta Alice cambia colore e Bob cambia formato, ciascuno per conto proprio. Oppure che siano meno abitudinari e cambino una sera su quattro, o più abitudinari e cambino soltanto una sera su dieci. Proviamo queste diverse ipotesi, usando la stessa frequenza per entrambi, e osserviamo quali conti ne vengono fuori. Sono ipotesi sui personaggi, non frequenze misurate su persone reali.</P>
        <P>Il maître assegna +1 a rosso e calice, −1 a bianco e bottiglia, poi calcola S con la stessa formula dei capitoli precedenti. Se entrambi mantengono la preferenza quattro sere su cinque, S medio è <strong>1,44</strong>. Se lo fanno nove sere su dieci, diventa <strong>2,56</strong>. Il risultato dipende dunque da quanto sono stabili queste abitudini: non scegliamo le percentuali per ottenere un particolare S.</P>
        <P>Il motivo è sul tavolo: entrambi conoscono l’intero menù. A parità del proprio piatto, Alice può cambiare vino guardando quello di Bob; anche Bob considera tutti e due i piatti. Il limite 2 richiedeva decisioni basate soltanto sulle informazioni della propria sala. Qui quelle condizioni non ci sono più. Non assegniamo cene vinte: confrontiamo i correlatori, senza introdurre una nuova regola di vittoria.</P>
      </>
    ),
    lezione: "S oltre 2, da solo, non basta: bisogna chiedersi quali informazioni hanno guidato le risposte. In terrazza si decide conoscendo entrambi i piatti.",
    Sim: Terrazza,
    avvertenzaSim: "Questa simulazione usa preferenze classiche inventate e decisioni che conoscono entrambi i piatti. Non riproduce dati sperimentali né correlazioni quantistiche fra sistemi isolati.",
    guida: {
      cosa: "Cene allo stesso tavolo: Alice sceglie il colore del proprio vino e Bob il formato dell’ordinazione. Le scelte dipendono da entrambi i piatti.",
      avvio: "Premi +1 cena, +200 cene o +10.000 cene. Puoi cambiare quanto spesso entrambi mantengono la propria preferenza: il registro si azzera. Azzera mantiene le preferenze selezionate.",
      leggere: "Confronta S atteso e osservato. La tabella spiega ogni coppia di piatti e mostra i quattro correlatori. Le sigle indicano i piatti: A = risotto, A′ = pesce di Alice; B = pesce, B′ = arrosto di Bob.",
      mostra: "Confronta le ipotesi: preferenza mantenuta nel 75%, 80%, 85%, 90% o 95% delle sere. S atteso cambia; quello osservato oscilla intorno a esso. Il confronto con 2 riguarda le condizioni delle sale isolate, che qui non valgono. Non è una prova di stregoneria.",
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
          A fine stagione il proprietario chiude i conti. Einstein sperava che
          dietro ogni stregoneria ci fosse un ristorante normale con gusti
          decisi in anticipo e sale indipendenti. Nel 1964 John Bell mostrò che
          la domanda si poteva decidere contando le sere, con quello che oggi si
          chiama <TeoremaBell />: nessun ristorante normale, per quanto furbo e
          senza imbrogli, può avere i conti del ristorante stregato.
        </P>
        <P>
          Il ristorante stregato esiste davvero. Al posto delle bottiglie
          gemelle ci sono coppie di particelle prodotte insieme, che i fisici
          chiamano entangled; al posto delle sale, laboratori lontani. Gli
          esperimenti, da quelli di Alain Aspect nel 1982 a quelli senza
          scappatoie del 2015, hanno dato sempre ragione al ristorante stregato,
          e nel 2022 Aspect, John Clauser e Anton Zeilinger hanno ricevuto il
          Nobel per la fisica.
        </P>
        <P>
          La stregoneria ha però i suoi limiti: non manda messaggi e non supera
          2,83. E il ristorante non dice quale idea abbandonare: che i gusti
          esistano prima della domanda, che le sale siano davvero indipendenti,
          o qualcos'altro ancora. Dice soltanto che non si possono tenere tutte
          insieme.
        </P>
      </>
    ),
    lezione:
      "Escluso: gusti decisi in anticipo in un mondo locale. Confermato: il ristorante stregato esiste, ma non manda messaggi. Ancora aperto: quale idea lasciare andare.",
    riferimenti: [R.bell, R.hensen, R.nobel],
  },
];
