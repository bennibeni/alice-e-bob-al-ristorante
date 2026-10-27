"use client";

import React, { useState } from "react";
import { Wine, BottleWine, Info, X } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { strategies, cases, wins, score, quantumProbability } from "./model.js";
import "./chsh.css";
import { LezioneEsterna } from "../ristorante/lezione";

const percent = (value) =>
  `${(value * 100).toLocaleString("it-IT", { maximumFractionDigits: 2 })}%`;
const wine = (value) => (value === 0 ? "Bianco" : "Rosso");

function StrategyIcons({ strategy }) {
  return (
    <span className="chsh-strategy-icons" aria-hidden="true">
      {strategy.map((color, index) => {
        const Icon = index === 0 ? Wine : BottleWine;
        return (
          <Icon
            key={index}
            className={color ? "chsh-strategy-red" : "chsh-strategy-green"}
            focusable="false"
          />
        );
      })}
    </span>
  );
}

const strategyGroups = [
  {
    title: "Nessuno cambia colore",
    description:
      "Entrambi scelgono un colore fisso. Colori diversi: 75%; colori uguali: 25%.",
    changes: 0,
  },
  {
    title: "Uno solo cambia colore",
    description:
      "Uno mantiene il colore fisso, l’altro lo cambia tra calice e bottiglia. Vincono al 75% se con la bottiglia scelgono lo stesso colore; al 25% se scelgono colori diversi.",
    changes: 1,
  },
  {
    title: "Entrambi cambiano colore",
    description:
      "Entrambi cambiano colore tra calice e bottiglia. Se seguono lo stesso schema vincono al 75%; se seguono schemi opposti vincono al 25%.",
    changes: 2,
  },
];

function CHSHDefinition({ quantum = false }) {
  const title = quantum
    ? "Formulazione quantistica del gioco CHSH"
    : "Formulazione classica del gioco CHSH";
  return (
    <div className="chsh-definition-link">
      <span>{title}</span>
      <DialogTrigger>
        <Button className="chsh-strategies-info" aria-label={`Apri: ${title}`}>
          <Info size={20} aria-hidden="true" />
        </Button>
        <ModalOverlay className="chsh-guide-overlay" isDismissable>
          <Modal className="chsh-guide-modal">
            <Dialog className="chsh-guide-dialog">
              <div className="chsh-guide-heading">
                <Heading slot="title">{title}</Heading>
                <Button
                  slot="close"
                  className="chsh-guide-close"
                  aria-label="Chiudi"
                >
                  <X size={22} aria-hidden="true" />
                </Button>
              </div>
              <p>
                Un arbitro estrae due bit indipendenti e uniformi x, y ∈
                &#123;0, 1&#125;. Invia x ad Alice e y a Bob. Ciascuno conosce
                solo il proprio input.
              </p>
              <p>
                Alice restituisce un bit a e Bob un bit b. Possono concordare
                una strategia e condividere risorse prima del gioco, ma non
                possono comunicare dal momento in cui ricevono gli input fino
                alla consegna delle risposte. Gli input sono indipendenti dalle
                risorse condivise.
              </p>
              <h3>Condizione di vittoria</h3>
              <p className="chsh-definition-formula">a ⊕ b = xy</p>
              <p>
                Qui ⊕ è la somma modulo 2 e xy è il prodotto dei bit. Le
                risposte devono essere uguali per gli input (0,0), (0,1), (1,0),
                e diverse per (1,1).
              </p>
              <p className="chsh-definition-formula">
                P(vittoria) = ¼ ∑<sub>x,y∈&#123;0,1&#125;</sub> P(a ⊕ b = xy |
                x,y)
              </p>
              {quantum ? (
                <>
                  <h3>Stato condiviso e misure locali</h3>
                  <p>
                    Una strategia quantistica è specificata da uno stato
                    bipartito ρ e da misure locali: gli operatori positivi Mᵃₓ
                    di Alice e Nᵇᵧ di Bob sommano all’identità rispetto ai
                    risultati. La regola di Born dà:
                  </p>
                  <p className="chsh-definition-formula">
                    P(a,b | x,y) = Tr[ρ (Mᵃₓ ⊗ Nᵇᵧ)].
                  </p>
                  <p>
                    Ogni misura dipende solo dall’input locale. Le distribuzioni
                    locali non dipendono dall’input remoto: queste correlazioni
                    non consentono comunicazione.
                  </p>
                  <h3>Valore quantistico ottimale</h3>
                  <p>
                    Definendo Eₓᵧ = ∑ₐ,ᵦ (−1)ᵃ⁺ᵇ P(a,b | x,y), per la regola
                    CHSH standard poniamo S = E₀₀ + E₀₁ + E₁₀ − E₁₁. Il limite
                    di Tsirelson impone S ≤ 2√2.
                  </p>
                  <p className="chsh-definition-formula">
                    P(vittoria) = 1/2 + S/8 ≤ (2 + √2)/4 ≈ 85,36%.
                  </p>
                  <p>
                    Il limite è raggiunto con uno stato massimamente entangled e
                    misure appropriate. Per passare dalla strategia del
                    ristorante alla convenzione standard si inverte il risultato
                    di Bob.
                  </p>
                </>
              ) : (
                <>
                  <h3>Strategie locali deterministiche</h3>
                  <p>
                    Alice risponde a = f(x) e Bob b = g(y). Esistono quattro
                    funzioni da un bit a un bit per ciascuno: in totale 16
                    coppie di strategie.
                  </p>
                  <p>
                    Le quattro condizioni richieste sono a₀ ⊕ b₀ = 0, a₀ ⊕ b₁ =
                    0, a₁ ⊕ b₀ = 0 e a₁ ⊕ b₁ = 1. Sommandole modulo 2 si ottiene
                    0 = 1, perché ogni risposta compare due volte: almeno una
                    condizione deve fallire.
                  </p>
                  <h3>Distribuzioni classiche locali</h3>
                  <p>
                    La forma generale è P(a,b | x,y) = ∑λ p(λ) P(a | x,λ) P(b |
                    y,λ), con λ indipendente dagli input. È una miscela di
                    strategie deterministiche: il massimo resta 3/4 = 75%.
                  </p>
                  <p className="chsh-definition-formula">P(vittoria) ≤ 3/4.</p>
                  <p>
                    Scegliere risposte indipendenti e uniformi dà invece
                    P(vittoria) = 1/2.
                  </p>
                </>
              )}
              <h3>Corrispondenza con il ristorante</h3>
              <p>
                Calice = 0 e bottiglia = 1; vino bianco (verde nelle icone) = 0
                e rosso = 1. Nel ristorante chiediamo colori diversi tranne con
                due bottiglie: la regola è quindi a ⊕ b = 1 ⊕ xy.
              </p>
              <p>
                Rinominando il risultato di Bob come b′ = 1 ⊕ b, otteniamo a ⊕
                b′ = xy. Questa inversione rende i due giochi equivalenti e
                conserva ogni probabilità di vittoria.
              </p>
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </div>
  );
}

function QuantumExplanation() {
  return (
    <details className="chsh-panel">
      <summary>Perché il limite quantistico è circa 85,36%?</summary>
      <p>
        Con una coppia di qubit nello stato singoletto, Alice e Bob scelgono la
        propria misura in base al formato ricevuto. Non assegnano in anticipo un
        colore a ciascun formato: l’entanglement produce correlazioni tra i
        risultati delle misure locali.
      </p>
      <p>
        Una scelta ottimale degli assi è: Alice a 0° per il calice e 90° per la
        bottiglia; Bob a 45° per il calice e −45° per la bottiglia. Questi
        angoli descrivono misure di spin di qubit, non gli angoli di
        polarizzatori ottici.
      </p>
      <div className="chsh-theoretical-grid">
        {cases.map(([x, y]) => (
          <div className="chsh-theoretical-group" key={`${x}${y}`}>
            <FormatPair x={x} y={y} />
            <p>
              Colori {x && y ? "uguali" : "diversi"}:{" "}
              <b>{percent(quantumProbability)}</b>
            </p>
          </div>
        ))}
      </div>
      <p>
        I tre abbinamenti che richiedono colori diversi e quello che richiede
        colori uguali hanno tutti la stessa probabilità di successo. Anche la
        media è quindi <b>{percent(quantumProbability)}</b>.
      </p>
      <p>
        Ogni colore locale rimane casuale al 50%: Alice non controlla il
        risultato di Bob e nessuno può usare queste correlazioni per comunicare.
        Il vantaggio emerge confrontando i risultati.
      </p>
      <p>
        <b>Perché non il 100%?</b> La teoria quantistica impone un vincolo alle
        correlazioni delle quattro coppie di misure: il limite di Tsirelson. La
        scelta di assi qui sopra lo raggiunge, ma nessuna strategia quantistica
        può superarlo.
      </p>
      <details className="chsh-proof-math">
        <summary>Mostra la formulazione matematica</summary>
        <p>
          Indichiamo i risultati bianco e rosso con +1 e −1. Per il singoletto
          la correlazione di due misure lungo assi separati dall’angolo θ è E =
          −cos θ. Quindi P(stesso colore) = (1 + E)/2 e P(colori diversi) = (1 −
          E)/2.
        </p>
        <p>
          Nei primi tre abbinamenti θ = 45°, perciò E = −1/√2. Con due bottiglie
          θ = 135°, perciò E = +1/√2. La probabilità di soddisfare la regola è
          sempre:
        </p>
        <p className="chsh-definition-formula">
          P(vittoria) = (1 + 1/√2)/2 = cos²(π/8) ≈ 85,36%.
        </p>
        <p>
          Definiamo S = −E<sub>00</sub> − E<sub>01</sub> − E<sub>10</sub> + E
          <sub>11</sub>, con 0 = calice e 1 = bottiglia. Per input uniformi,
          P(vittoria) = 1/2 + S/8.
        </p>
        <p>
          Per osservabili locali con risultati ±1, l’operatore CHSH C soddisfa
          ‖C‖ ≤ 2√2, e dunque S ≤ 2√2 (limite di Tsirelson). Ne segue:
        </p>
        <p className="chsh-definition-formula">
          P(vittoria) ≤ 1/2 + √2/4 ≈ 85,36%.
        </p>
        <p>
          Il limite classico S ≤ 2 dà invece P(vittoria) ≤ 75%. La strategia del
          singoletto raggiunge S = 2√2, quindi il limite quantistico è
          effettivamente ottenibile.
        </p>
        <CHSHDefinition quantum />
      </details>
    </details>
  );
}

function QuantumOutcomesInfo() {
  return (
    <DialogTrigger>
      <Button
        className="chsh-strategies-info"
        aria-label="Come si calcolano le probabilità dei 16 esiti quantistici"
      >
        <Info size={20} aria-hidden="true" />
      </Button>
      <ModalOverlay className="chsh-guide-overlay" isDismissable>
        <Modal className="chsh-guide-modal">
          <Dialog className="chsh-guide-dialog">
            <div className="chsh-guide-heading">
              <Heading slot="title">Da 85,36% alle 16 possibilità</Heading>
              <Button
                slot="close"
                className="chsh-guide-close"
                aria-label="Chiudi"
              >
                <X size={22} aria-hidden="true" />
              </Button>
            </div>
            <p>
              Ogni esito completo specifica sia i due formati assegnati, sia i
              due colori ottenuti. Le quattro coppie di formati e le quattro
              coppie di colori danno 4 × 4 = 16 esiti.
            </p>
            <h3>1. Fissiamo una coppia di formati</h3>
            <p>
              Nella strategia quantistica ideale usata qui, la probabilità di
              vincere è p = cos²(π/8) ≈ 85,36% per ciascuna coppia di formati.
              Due coppie di colori vincono e due perdono.
            </p>
            <p>
              La distribuzione del singoletto è simmetrica quando si invertono
              entrambi i colori: le due coppie vincenti hanno la stessa
              probabilità, e così le due perdenti. Ogni coppia vincente ha
              quindi probabilità p/2 ≈ 42,68%; ogni coppia perdente (1 − p)/2 ≈
              7,32%.
            </p>
            <p>
              Per esempio, con due bottiglie vincono verde–verde e rosso–rosso,
              ciascuna al 42,68%. Perdono verde–rosso e rosso–verde, ciascuna al
              7,32%. Negli altri abbinamenti sono vincenti i colori diversi.
            </p>
            <h3>2. Includiamo l’assegnazione dei formati</h3>
            <p>
              Ogni coppia di formati viene assegnata con probabilità 1/4. Per
              ottenere la probabilità della riga completa moltiplichiamo quella
              condizionata ai formati per 1/4.
            </p>
            <table className="chsh-guide-table">
              <caption>Probabilità di ogni singolo esito completo</caption>
              <thead>
                <tr>
                  <th scope="col">Esito</th>
                  <th scope="col">Calcolo</th>
                  <th scope="col">Probabilità</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Vincente</th>
                  <td>¼ × p/2</td>
                  <td>{percent(quantumProbability / 8)}</td>
                </tr>
                <tr>
                  <th scope="row">Perdente</th>
                  <td>¼ × (1 − p)/2</td>
                  <td>{percent((1 - quantumProbability) / 8)}</td>
                </tr>
              </tbody>
            </table>
            <h3>3. Sommiamo gli esiti</h3>
            <p>
              Ci sono 8 esiti vincenti e 8 perdenti. Prima degli arrotondamenti,
              8 × (p/8) = p ≈ 85,36% e 8 × ((1 − p)/8) = 1 − p ≈ 14,64%. Tutti i
              16 esiti insieme sommano al 100%.
            </p>
            <p className="chsh-definition-formula">
              P(formati, colori) = P(formati) × P(colori | formati)
            </p>
            <p>
              Questi valori descrivono lo stato e le misure ottimali simulati
              qui. Strategie quantistiche diverse possono produrre distribuzioni
              diverse: la divisione in due parti uguali non deriva dal solo
              valore medio di vittoria.
            </p>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

function StrategyGuide() {
  return (
    <DialogTrigger>
      <Button
        className="chsh-strategies-info"
        aria-label="Informazioni: tutte le strategie e le probabilità di vittoria"
      >
        <Info size={20} aria-hidden="true" />
      </Button>
      <ModalOverlay className="chsh-guide-overlay" isDismissable>
        <Modal className="chsh-guide-modal">
          <Dialog className="chsh-guide-dialog">
            <div className="chsh-guide-heading">
              <Heading slot="title">Le 16 strategie, per criterio</Heading>
              <Button
                slot="close"
                className="chsh-guide-close"
                aria-label="Chiudi"
              >
                <X size={22} aria-hidden="true" />
              </Button>
            </div>
            <p>
              Una strategia personale specifica il colore per il calice e per la
              bottiglia, in quest’ordine. Ogni coppia di formati ha probabilità
              25%. Le icone verdi indicano vino bianco, quelle rosse vino rosso.
            </p>
            {strategyGroups.map((group) => (
              <section key={group.changes}>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <table className="chsh-guide-table">
                  <caption>
                    {group.changes === 0
                      ? "4 accordi con colori fissi"
                      : group.changes === 1
                        ? "8 accordi con un solo giocatore che cambia colore"
                        : "4 accordi con entrambi che cambiano colore"}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Alice</th>
                      <th scope="col">Bob</th>
                      <th scope="col">Vittoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {strategies.flatMap((a, i) =>
                      strategies.map((b, j) => {
                        const changes =
                          Number(a[0] !== a[1]) + Number(b[0] !== b[1]);
                        if (changes !== group.changes) return null;
                        return (
                          <tr key={`${i}-${j}`}>
                            <td
                              aria-label={`Calice: ${wine(a[0])}, bottiglia: ${wine(a[1])}`}
                            >
                              <StrategyIcons strategy={a} />
                            </td>
                            <td
                              aria-label={`Calice: ${wine(b[0])}, bottiglia: ${wine(b[1])}`}
                            >
                              <StrategyIcons strategy={b} />
                            </td>
                            <td>
                              <b>{percent(score(a, b))}</b>
                            </td>
                          </tr>
                        );
                      }),
                    )}
                  </tbody>
                </table>
              </section>
            ))}
            <p>
              <b>In totale: 8 accordi migliori al 75% e 8 peggiori al 25%.</b>{" "}
              Ogni accordo vince in tre casi oppure in uno: mai in zero, due o
              quattro. Cambiare una sola risposta capovolge due esiti e mantiene
              dispari il numero dei casi vinti.
            </p>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

function FormatIcon({ value, color }) {
  const Icon = value ? BottleWine : Wine;
  return (
    <Icon
      className={`chsh-format-icon${color ? ` chsh-format-${color}` : ""}`}
      aria-hidden="true"
      focusable="false"
    />
  );
}

function FormatPair({ x, y }) {
  return (
    <span
      className="chsh-format-pair"
      role="img"
      aria-label={`Formati assegnati: Alice ${x ? "bottiglia" : "calice"}, Bob ${y ? "bottiglia" : "calice"}`}
    >
      <span className="chsh-format-person">
        <small>Alice</small>
        <FormatIcon value={x} />
      </span>
      <span className="chsh-format-person">
        <small>Bob</small>
        <FormatIcon value={y} />
      </span>
    </span>
  );
}

export default function CHSHGame() {
  const [alice, setAlice] = useState(0);
  const [bob, setBob] = useState(3);
  const [mode, setMode] = useState("classical");
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const classical = score(strategies[alice], strategies[bob]);
  const expected = mode === "quantum" ? quantumProbability : classical;
  const successes = history.filter((round) => round.win).length;

  function play(count) {
    setBusy(true);
    const rounds = Array.from({ length: count }, () => {
      const x = Math.random() < 0.5 ? 0 : 1;
      const y = Math.random() < 0.5 ? 0 : 1;
      let a, b;
      if (mode === "quantum") {
        // Sample the ideal CHSH joint distribution: unbiased local marginals.
        a = Math.random() < 0.5 ? 0 : 1;
        const success = Math.random() < quantumProbability;
        const desiredParity = x * y === 1 ? 0 : 1;
        b = a ^ (success ? desiredParity : 1 - desiredParity);
      } else {
        a = strategies[alice][x];
        b = strategies[bob][y];
      }
      return { x, y, a, b, win: wins(x, y, a, b) };
    });
    setHistory((previous) => [...previous, ...rounds]);
    setBusy(false);
  }

  function changeMode(value) {
    setMode(value);
    setHistory([]);
  }

  return (
    <section className="chsh-game" aria-label="Laboratorio del gioco CHSH">
      <header>
        <h1>Laboratorio CHSH</h1>
        <p>
          Due scelte locali. Quattro tavoli possibili. Un limite da esplorare.
        </p>
      </header>
      <div className="chsh-panel">
        <h2>Le regole</h2>
        <p>
          Il cameriere assegna a ciascuno{" "}
          <b className="chsh-format-label" aria-label="un calice">
            <FormatIcon value={0} />
          </b>{" "}
          oppure{" "}
          <b className="chsh-format-label" aria-label="una bottiglia">
            <FormatIcon value={1} />
          </b>
          : i quattro abbinamenti sono equiprobabili e indipendenti dalla
          strategia. Ognuno vede solo il proprio formato, poi sceglie{" "}
          <b
            className="chsh-format-label"
            aria-label="V: vino bianco, indicato in verde"
          >
            V ={" "}
            <span
              className="chsh-wine-dot chsh-wine-dot-green"
              aria-hidden="true"
            />
          </b>{" "}
          o{" "}
          <b className="chsh-format-label" aria-label="R: vino rosso">
            R ={" "}
            <span
              className="chsh-wine-dot chsh-wine-dot-red"
              aria-hidden="true"
            />
          </b>
          . Nessuna comunicazione dopo l’assegnazione.
        </p>
        <div className="chsh-cases">
          {cases.map(([x, y]) => (
            <div key={`${x}${y}`}>
              <small>Probabilità 25%</small>
              <small>Il cameriere assegna</small>
              <FormatPair x={x} y={y} />
              <div className="chsh-case-goal">
                <small>Per vincere</small>
                <span>{x && y ? "Stesso vino" : "Vini diversi"}</span>
                <span
                  className="chsh-case-examples"
                  role="img"
                  aria-label={
                    x && y
                      ? "Verde e verde, oppure rosso e rosso"
                      : "Verde e rosso, oppure rosso e verde"
                  }
                >
                  <span>
                    <FormatIcon value={x} color="green" />
                    <FormatIcon value={y} color={x && y ? "green" : "red"} />
                  </span>
                  <small>oppure</small>
                  <span>
                    <FormatIcon value={x} color="red" />
                    <FormatIcon value={y} color={x && y ? "red" : "green"} />
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chsh-tabs" role="group" aria-label="Tipo di strategia">
        <button
          aria-pressed={mode === "classical"}
          onClick={() => changeMode("classical")}
        >
          Strategie classiche
        </button>
        <button
          aria-pressed={mode === "quantum"}
          onClick={() => changeMode("quantum")}
        >
          Correlazioni quantistiche
        </button>
      </div>
      {mode === "classical" ? (
        <div className="chsh-panel">
          <h2>Scrivi il loro accordo</h2>
          <p>
            Ogni strategia indica il colore scelto per il calice e per la
            bottiglia, in quest’ordine. Alice e Bob hanno quattro strategie
            ciascuno: gli accordi possibili sono quindi 4 × 4 = 16.
          </p>
          <div className="chsh-players">
            {[
              ["Alice", alice, setAlice],
              ["Bob", bob, setBob],
            ].map(([name, value, setter]) => (
              <div key={name}>
                <strong>{name}</strong>
                <details className="chsh-strategy-menu">
                  <summary
                    aria-label={`Strategia di ${name}: X ${wine(strategies[value][0])}, Y ${wine(strategies[value][1])}`}
                  >
                    <StrategyIcons strategy={strategies[value]} />
                    <span aria-hidden="true">▾</span>
                  </summary>
                  <div
                    className="chsh-strategy-list"
                    role="group"
                    aria-label={`Scegli la strategia di ${name}`}
                  >
                    {strategies.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-pressed={value === i}
                        aria-label={`X: ${wine(s[0])}, Y: ${wine(s[1])}`}
                        onClick={(event) => {
                          setter(i);
                          setHistory([]);
                          const menu = event.currentTarget.closest("details");
                          menu.open = false;
                          menu.querySelector("summary").focus();
                        }}
                      >
                        <StrategyIcons strategy={s} />
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
          <div className="chsh-scroll">
            <table>
              <caption>
                Le 16 strategie: percentuale di vittoria. Clicca una casella.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Alice ↓ / Bob →</th>
                  {strategies.map((s, i) => (
                    <th
                      scope="col"
                      key={i}
                      aria-label={`X: ${wine(s[0])}, Y: ${wine(s[1])}`}
                    >
                      <StrategyIcons strategy={s} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {strategies.map((a, i) => (
                  <tr key={i}>
                    <th
                      scope="row"
                      aria-label={`X: ${wine(a[0])}, Y: ${wine(a[1])}`}
                    >
                      <StrategyIcons strategy={a} />
                    </th>
                    {strategies.map((b, j) => (
                      <td key={j}>
                        <button
                          aria-pressed={alice === i && bob === j}
                          aria-label={`Alice ${a.map((v) => (v ? "R" : "V")).join("")}, Bob ${b.map((v) => (v ? "R" : "V")).join("")}: ${percent(score(a, b))}`}
                          onClick={() => {
                            setAlice(i);
                            setBob(j);
                            setHistory([]);
                          }}
                        >
                          {percent(score(a, b))}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="chsh-strategy-explanation">
            <h3>
              Strategie migliori e peggiori <StrategyGuide />
            </h3>
            <p>
              <b>Le migliori vincono nel 75% dei casi:</b> sono 8 accordi su 16
              e soddisfano la regola in tre abbinamenti su quattro. Un esempio
              semplice: Alice sceglie sempre verde e Bob sempre rosso, o
              viceversa.
            </p>
            <p>
              <b>Le peggiori vincono nel 25% dei casi:</b> sono gli altri 8
              accordi e soddisfano la regola in un solo abbinamento. Per
              esempio, scegliere entrambi sempre lo stesso colore fa vincere
              solo con due bottiglie.
            </p>
            <p>
              <b>La strategia casuale vince nel 50% dei casi:</b> Alice e Bob
              scelgono ciascuno verde o rosso con uguale probabilità, in modo
              indipendente dall’altro e dai formati. Per ogni abbinamento, i
              colori sono uguali nella metà dei casi e diversi nell’altra metà:
              la probabilità di soddisfare la regola è quindi sempre 50%.
            </p>
            <p>
              Adattare il colore al proprio formato può dare il 75% oppure il
              25%: conta come si combinano le risposte dei due giocatori. Nessun
              accordo classico supera il 75%.
            </p>
          </div>
        </div>
      ) : (
        <div className="chsh-panel">
          <h2>Una risorsa diversa: l’entanglement</h2>
          <p>
            Con una coppia di qubit entangled e misure locali scelte in base al
            formato, la probabilità ideale di vittoria è cos²(π/8) ≈{" "}
            <b>85,36%</b> per ciascuna coppia di formati.
          </p>
          <p>
            Un esempio usa lo stato singoletto, con assi di misura di Alice a 0°
            e 90°, e di Bob a 45° e −45°. Risultati +1 e −1 corrispondono a
            bianco e rosso.
          </p>
          <p className="chsh-muted">
            Questa è una simulazione della distribuzione quantistica ideale con
            numeri casuali classici; non esegue un esperimento quantistico. Ogni
            risultato locale è bianco o rosso con probabilità 50%: non permette
            di comunicare.
          </p>
        </div>
      )}
      <div className="chsh-panel chsh-results">
        <div>
          <span>Probabilità teorica</span>
          <strong>{percent(expected)}</strong>
        </div>
        <div>
          <span>Vittorie osservate</span>
          <strong>
            {history.length ? percent(successes / history.length) : "—"}
          </strong>
          <small>
            {successes} su {history.length} turni
          </small>
        </div>
        <div className="chsh-actions">
          <button disabled={busy} onClick={() => play(1)}>
            Gioca un turno
          </button>
          <button disabled={busy} onClick={() => play(1000)}>
            Simula 1.000 turni
          </button>
          <button onClick={() => setHistory([])}>Azzera</button>
        </div>
        <p className="chsh-muted">
          Le frequenze di un campione possono superare o scendere sotto il
          valore teorico per fluttuazioni casuali. Il limite del 75% riguarda la
          probabilità classica.
        </p>
        <details className="chsh-theoretical">
          <summary>Le 16 possibilità teoriche</summary>
          {mode === "quantum" && (
            <div className="chsh-definition-link">
              <span>Come si calcolano le probabilità?</span>
              <QuantumOutcomesInfo />
            </div>
          )}
          <p className="chsh-muted">
            Ogni riga combina i formati assegnati e i colori scelti, nell’ordine
            Alice–Bob. La probabilità comprende sia l’assegnazione dei formati
            sia i risultati della strategia attuale. Gli esiti allo 0% non si
            verificano con questa strategia.
          </p>
          <div className="chsh-theoretical-grid">
            {cases.map(([x, y]) => (
              <div className="chsh-theoretical-group" key={`${x}${y}`}>
                <h4
                  aria-label={`Formati: Alice ${x ? "bottiglia" : "calice"}, Bob ${y ? "bottiglia" : "calice"}`}
                >
                  <span>Alice · Bob</span>
                  <span className="chsh-round-pair">
                    <FormatIcon value={x} />
                    <FormatIcon value={y} />
                  </span>
                </h4>
                {cases.map(([a, b]) => {
                  const win = wins(x, y, a, b);
                  const probability =
                    mode === "quantum"
                      ? (win ? quantumProbability : 1 - quantumProbability) / 8
                      : strategies[alice][x] === a && strategies[bob][y] === b
                        ? 0.25
                        : 0;
                  return (
                    <div
                      key={`${a}${b}`}
                      className={`chsh-theoretical-outcome ${win ? "chsh-win" : "chsh-loss"}`}
                    >
                      <span
                        className="chsh-round-pair"
                        role="img"
                        aria-label={`Alice: ${x ? "bottiglia" : "calice"}, vino ${wine(a)}; Bob: ${y ? "bottiglia" : "calice"}, vino ${wine(b)}`}
                      >
                        <FormatIcon value={x} color={a ? "red" : "green"} />
                        <FormatIcon value={y} color={b ? "red" : "green"} />
                      </span>
                      <span>{win ? "Vittoria" : "Sconfitta"}</span>
                      <b>{percent(probability)}</b>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="chsh-muted">
            Le probabilità dei 16 esiti sommano al 100% prima
            dell’arrotondamento. La somma degli esiti vincenti è{" "}
            {percent(expected)}.
          </p>
        </details>
      </div>
      {mode === "quantum" ? (
        <QuantumExplanation />
      ) : (
        <details className="chsh-panel">
          <summary>Perché il limite classico è 75%?</summary>
          <p>
            Proviamo a costruire un accordo che vinca in tutti e quattro gli
            abbinamenti. Ogni giocatore deve dare la stessa risposta al proprio
            formato, qualunque sia quello ricevuto dall’altro.
          </p>
          <p>
            Supponiamo che Alice scelga verde con il calice. Scambiando tutti i
            colori, il ragionamento resta identico: copriamo così anche il caso
            in cui scelga rosso.
          </p>
          <ol className="chsh-proof-steps">
            {[
              {
                x: 0,
                y: 0,
                a: "green",
                b: "red",
                text: "Con due calici servono colori diversi. Il calice verde di Alice impone quindi il calice rosso di Bob.",
              },
              {
                x: 0,
                y: 1,
                a: "green",
                b: "red",
                text: "Con il calice di Alice e la bottiglia di Bob servono ancora colori diversi. Anche la bottiglia di Bob deve essere rossa.",
              },
              {
                x: 1,
                y: 0,
                a: "green",
                b: "red",
                text: "Con la bottiglia di Alice e il calice di Bob servono colori diversi. Dato che il calice di Bob è rosso, la bottiglia di Alice deve essere verde.",
              },
              {
                x: 1,
                y: 1,
                a: "green",
                b: "red",
                text: "Con due bottiglie servono colori uguali. Ma le risposte imposte dai primi tre casi sono verde per Alice e rosso per Bob: questo caso è perdente.",
              },
            ].map((step, index) => (
              <li key={index}>
                <div
                  className="chsh-proof-pair"
                  role="img"
                  aria-label={`Alice: ${step.x ? "bottiglia" : "calice"} ${step.a === "green" ? "verde" : "rosso"}; Bob: ${step.y ? "bottiglia" : "calice"} ${step.b === "green" ? "verde" : "rosso"}`}
                >
                  <span>
                    <small>Alice</small>
                    <FormatIcon value={step.x} color={step.a} />
                  </span>
                  <span>
                    <small>Bob</small>
                    <FormatIcon value={step.y} color={step.b} />
                  </span>
                  <b className={index === 3 ? "chsh-proof-failure" : ""}>
                    {index === 3 ? "Contraddizione" : "Colori diversi"}
                  </b>
                </div>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <p>
            <b>Vincere sempre è impossibile.</b> Se un accordo soddisfa i primi
            tre casi, perde il quarto. Se non li soddisfa tutti, ha già almeno
            una sconfitta. Poiché i quattro abbinamenti sono equiprobabili, ogni
            accordo vince al massimo in tre casi su quattro: <b>75%</b>.
          </p>
          <p>
            Il limite si raggiunge, per esempio, se Alice sceglie sempre verde e
            Bob sempre rosso.
          </p>
          <details className="chsh-proof-math">
            <summary>Mostra la formulazione matematica</summary>
            <p>
              Legenda: X = calice, Y = bottiglia; V = bianco (verde nelle
              icone), R = rosso. A_X e A_Y sono i colori scelti da Alice per i
              due formati; B_X e B_Y quelli di Bob.
            </p>
            <div
              className="chsh-proof-equations"
              aria-label="Condizioni per vincere nei quattro abbinamenti"
            >
              <div>
                A<sub>X</sub> ≠ B<sub>X</sub>
              </div>
              <div>
                A<sub>X</sub> ≠ B<sub>Y</sub>
              </div>
              <div>
                A<sub>Y</sub> ≠ B<sub>X</sub>
              </div>
              <div>
                A<sub>Y</sub> = B<sub>Y</sub>
              </div>
            </div>
            <p>
              Con soli due colori, le prime due condizioni implicano B
              <sub>X</sub> = B<sub>Y</sub>. La terza impone allora A<sub>Y</sub>{" "}
              ≠ B<sub>Y</sub>, in contraddizione con la quarta.
            </p>
            <p>Quindi P(vittoria) ≤ 3/4 = 75%.</p>
            <p>
              Codificando X = 0, Y = 1, V = 0 e R = 1, la regola è a ⊕ b = 1 ⊕
              xy. Il simbolo ⊕ indica la somma modulo 2. Invertendo il risultato
              di Bob si ottiene il gioco CHSH standard: a ⊕ b = xy.
            </p>
            <CHSHDefinition />
          </details>
        </details>
      )}
      <div className="chsh-panel">
        <LezioneEsterna
          src="/chsh-game.html"
          titolo="Approfondimento: il gioco CHSH"
          nota="lezione di IBM Quantum Learning, in inglese"
        />
      </div>
    </section>
  );
}
