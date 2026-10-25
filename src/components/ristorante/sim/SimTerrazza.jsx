"use client";

import { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { Vino, useIntervallo } from './ui';
import { CENE, cenaTerrazza, correlatori, valoreS } from '../logica/terrazza';

const vuoto = () => ({ n: [0, 0, 0, 0], somme: [0, 0, 0, 0], ultime: [null, null, null, null], errori: 0, ultima: null });
const f = n => n.toLocaleString('it-IT', { maximumFractionDigits: 3, minimumFractionDigits: 2 });
const button = 'rounded border border-zinc-400 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10';

function InfoCorrelatore({ osservato = false }) {
  const titolo = osservato ? 'E osservato sul servizio' : 'E atteso';
  return <DialogTrigger>
    <Button aria-label={`Spiegazione di ${titolo}`} className="ml-1 inline-flex rounded-full align-middle text-sky-700 outline-none hover:text-sky-900 focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-300"><Info aria-hidden="true" className="h-4 w-4" /></Button>
    <ModalOverlay isDismissable className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Modal className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-sky-200 bg-white p-6 text-left text-sm font-normal text-zinc-900 shadow-xl outline-none dark:border-sky-800 dark:bg-zinc-900 dark:text-zinc-100">
        <Dialog className="outline-none">{({ close }) => <div className="space-y-4">
          <div className="flex items-center justify-between gap-4"><Heading slot="title" className="text-xl font-semibold">{titolo}</Heading><Button onPress={close} aria-label="Chiudi spiegazione" className="rounded p-2 hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-white/10"><X aria-hidden="true" className="h-5 w-5" /></Button></div>
          <p><strong>E è una media calcolata separatamente per ciascuna coppia di piatti.</strong> A ogni cena assegniamo un numero al colore e uno al formato serviti, poi li moltiplichiamo.</p>
          <table className="w-full border-collapse text-left"><caption className="mb-2 text-left">I prodotti possibili per una cena</caption><thead><tr><th className="border p-2">Vino</th><th className="border p-2">Due calici (+1)</th><th className="border p-2">Bottiglia (−1)</th></tr></thead><tbody><tr><th className="border p-2">Rosso (+1)</th><td className="border p-2">+1</td><td className="border p-2">−1</td></tr><tr><th className="border p-2">Bianco (−1)</th><td className="border p-2">−1</td><td className="border p-2">+1</td></tr></tbody></table>
          {osservato ? <>
            <p><strong>E osservato</strong> è la media dei prodotti delle cene già simulate per quella riga: sommiamo i +1 e i −1 e dividiamo per il numero di cene di quel menù.</p>
            <p>Per esempio, se con risotto e frittura il cameriere serve rosso e due calici 8 volte e rosso in bottiglia 2 volte, E osservato = (8 − 2) / 10 = <strong>0,6</strong>.</p>
            <p>Il cameriere non sbaglia necessariamente esattamente una volta ogni cinque cene. Il valore osservato può quindi differire da quello atteso, soprattutto con pochi servizi. Il trattino indica che per quel menù non è ancora stata simulata nessuna cena.</p>
          </> : <>
            <p><strong>E atteso</strong> è la media prevista dalle regole del modello, prima di simulare le cene. Considera l’80% di servizi corretti e il 20% di errori nel formato.</p>
            <p>Con risotto e frittura l’ordine è rosso e due calici: prodotto +1. Se arriva una bottiglia il prodotto diventa −1. Quindi E atteso = 0,8 × (+1) + 0,2 × (−1) = <strong>0,6</strong>.</p>
            <p>Con risotto e arrosto, invece, l’ordine è rosso in bottiglia: i segni si invertono ed E atteso è <strong>−0,6</strong>. Le quattro righe hanno valori attesi +0,6, −0,6, +0,6, +0,6.</p>
          </>}
          <p>E varia fra −1 e +1; non è una percentuale di vittorie. I quattro valori di E entrano nel calcolo di S.</p>
          <Button onPress={close} className="rounded border border-zinc-400 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">Chiudi</Button>
        </div>}</Dialog>
      </Modal>
    </ModalOverlay>
  </DialogTrigger>;
}

function Ordinazione({ rosso, bottiglia }) {
  return <div className="flex min-w-24 items-center gap-1" aria-label={`${bottiglia ? 'Una bottiglia' : 'Due calici'} di vino ${rosso ? 'rosso' : 'bianco'}`}>
    <Vino formato={bottiglia ? 'bottiglia' : 'calice'} colore={rosso ? 'R' : 'B'} dimensione={40} />
    {!bottiglia && <Vino formato="calice" colore={rosso ? 'R' : 'B'} dimensione={40} />}
    <span className="sr-only">{bottiglia ? 'Bottiglia' : 'Due calici'}, {rosso ? 'rosso' : 'bianco'}</span>
  </div>;
}

export default function SimTerrazza() {
  // Alice non cambia colore; il servizio inverte il formato nel 20% dei casi.
  const pVino = 1;
  const pFormato = 0.8;
  const [registro, setRegistro] = useState(vuoto);
  const [inCorso, setInCorso] = useState(false);
  const e = correlatori(pVino, pFormato);
  const completo = registro.n.every(n => n > 0);
  const osservati = registro.n.map((n, i) => n ? registro.somme[i] / n : 0);
  const totale = registro.n.reduce((a, b) => a + b, 0);
  useEffect(() => {
    if (totale >= 200) setInCorso(false);
  }, [totale]);
  function genera(numero) {
    numero = Math.min(numero, 200 - totale);
    if (numero <= 0) return;
    const cene = Array.from({ length: numero }, () => cenaTerrazza(Math.floor(Math.random() * 4), pVino, pFormato));
    setRegistro(prima => {
      const prossimo = { n: [...prima.n], somme: [...prima.somme], ultime: [...prima.ultime], errori: prima.errori, ultima: prima.ultima };
      for (const cena of cene) {
        const i = cena.i;
        prossimo.n[i]++;
        prossimo.somme[i] += cena.prodotto;
        prossimo.ultima = cena;
        prossimo.ultime[i] = cena;
        if (cena.bottiglia !== CENE[i].bottiglia) prossimo.errori++;
      }
      return prossimo;
    });
  }
  useIntervallo(() => genera(2), 100, inCorso);
  return <div className="space-y-5">
    <p className="text-sm">Alice e Bob seguono sempre le proprie regole. Il cameriere porta il formato opposto a quello chiesto da Bob con probabilità 20% a ogni cena, indipendentemente dai piatti. Il colore scelto da Alice viene sempre rispettato. Il registro conta ciò che arriva al tavolo.</p>
    <p className="text-sm">Ogni portata è scelta casualmente con probabilità ½ e indipendentemente da quella dell’altro. Prima di ordinare da bere, entrambi conoscono tutti e due i piatti.</p>
    <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
      <div className="rounded-lg border p-4"><p className="text-sm">S atteso dal modello</p><strong className="text-3xl">{f(valoreS(e))}</strong></div>
      <div className="rounded-lg border p-4"><p className="text-sm">S osservato</p><strong className="text-3xl">{completo ? f(valoreS(osservati)) : '—'}</strong><p className="text-xs">{completo ? 'Può oscillare, soprattutto con poche cene.' : 'Servono osservazioni per tutti e quattro i menù.'}</p></div>
      <div className="rounded-lg border p-4"><p className="text-sm">Cene registrate (massimo 200)</p><strong className="text-3xl">{totale.toLocaleString('it-IT')}</strong></div>
    </div>
    <div className="flex flex-wrap gap-2">
      <button className={button} disabled={totale >= 200} aria-pressed={inCorso} onClick={() => setInCorso(v => !v)}>{inCorso ? "❚❚ Pausa" : "▶ Avvia"}</button>
      <button className={button} disabled={inCorso || totale >= 200} onClick={() => genera(1)}>+1 cena</button>
      <button className={button} onClick={() => { setInCorso(false); setRegistro(vuoto()); }}>Azzera</button>
    </div>
    {registro.ultima && <p className="rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-950/30" aria-live="polite">Ultima cena: Alice mangia {CENE[registro.ultima.i].alice.toLowerCase()}, Bob {CENE[registro.ultima.i].bob.toLowerCase()}. Vino servito per entrambi: <strong>{registro.ultima.rosso ? 'rosso' : 'bianco'}</strong>, <strong>{registro.ultima.bottiglia ? 'bottiglia' : 'due calici'}</strong>. {registro.ultima.bottiglia !== CENE[registro.ultima.i].bottiglia ? 'Il cameriere ha sbagliato formato.' : 'Il formato è quello richiesto da Bob.'}</p>}
    <div className="overflow-x-auto"><table className="w-full text-left text-sm">
      <caption className="mb-2 text-left font-semibold">Le quattro cene e le ordinazioni richieste</caption>
      <thead><tr>{['Situazione / piatti', 'Ordinazione richiesta', 'Ultimo servizio per questo menù', 'Cene', 'E atteso', 'E osservato sul servizio'].map(t => <th key={t} className="border-b p-2">{t}{t === "E atteso" && <InfoCorrelatore />}{t === "E osservato sul servizio" && <InfoCorrelatore osservato />}</th>)}</tr></thead>
      <tbody>{CENE.map((c, i) => {
        const ultima = registro.ultime[i];
        const attiva = registro.ultima?.i === i;
        const errore = ultima && ultima.bottiglia !== c.bottiglia;
        return <tr key={c.id} className={`transition-colors duration-300 ${attiva ? 'bg-amber-100 dark:bg-amber-950/60' : ''}`}>
          <td className="min-w-48 border-b p-2">
            <div className="mt-2 rounded-md border-2 border-rose-500 px-2 py-1 text-rose-700 dark:text-rose-300">Alice · {c.alice}</div>
            <div className="mt-1 rounded-md border-2 border-sky-500 px-2 py-1 text-sky-700 dark:text-sky-300">Bob · {c.bob}</div>
          </td>
          <td className="min-w-52 border-b p-2"><Ordinazione rosso={c.rosso} bottiglia={c.bottiglia} /><p className="mt-2 text-xs">{c.motivo}</p></td>
          <td className="min-w-40 border-b p-2">{ultima ? <div key={registro.n[i]} className={attiva ? 'motion-safe:animate-[comparsa-cena_350ms_ease-out]' : ''}>
            <Ordinazione rosso={ultima.rosso} bottiglia={ultima.bottiglia} />
            <span className={`mt-2 inline-flex rounded border px-2 py-1 text-xs font-bold ${errore ? 'border-red-600 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300' : 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}`}>{errore ? '✗ Formato sbagliato' : '✓ Ordine rispettato'}</span>
          </div> : <span className="text-xs text-zinc-500">In attesa della prima cena</span>}</td>
          <td className="border-b p-2">{registro.n[i]}</td><td className="border-b p-2">{f(e[i])}</td><td className="border-b p-2">{registro.n[i] ? f(osservati[i]) : '—'}</td>
        </tr>;
      })}</tbody>
    </table></div>
    <p className="text-xs text-zinc-600 dark:text-zinc-400">La riga gialla indica l’ultima cena. Rosa: piatto di Alice; azzurro: piatto di Bob. A destra dell’ordine richiesto resta visibile l’ultimo servizio di ciascun menù; verde e rosso segnalano se il formato è corretto, non una cena vinta o persa.</p>
    <style>{`@keyframes comparsa-cena { from { opacity: 0.4; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    <section aria-label="Risultati del test" className="space-y-3 rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
      <h4 className="text-lg font-semibold">Risultati del test</h4>
      {totale === 0 ? <p className="text-sm">Avvia il test: al termine delle 200 cene troverai qui il risultato e il confronto con la previsione del modello.</p> : <>
        <p className="text-sm"><strong>{totale >= 200 ? 'Test concluso' : 'Test in corso'}: {totale} cene su 200.</strong> Il cameriere ha sbagliato formato <strong>{registro.errori} volte</strong> ({f(100 * registro.errori / totale)}% dei servizi). La probabilità prevista è 20%: su 200 cene ci aspettiamo in media 40 errori, non necessariamente esattamente 40.</p>
        {completo ? <>
          <p className="text-sm">Dalle quattro medie osservate nella tabella risulta:</p>
          <p className="overflow-x-auto rounded bg-zinc-100 p-3 font-mono text-sm dark:bg-zinc-800">S osservato = |{f(osservati[0])} − ({f(osservati[1])}) + ({f(osservati[2])}) + ({f(osservati[3])})| = <strong>{f(valoreS(osservati))}</strong></p>
          <p className="text-sm">Il modello prevede <strong>S medio = 2,40</strong>. In questo test lo scarto è <strong>{f(Math.abs(valoreS(osservati) - valoreS(e)))}</strong>. Ogni menù ha un proprio numero di cene e di errori: S usa le quattro medie separate, non soltanto la percentuale totale di errori.</p>
          <p className="text-sm">{valoreS(osservati) > 2 ? 'In questa esecuzione S supera 2.' : 'In questa esecuzione S non supera 2, anche se il valore medio previsto è 2,40.'} Con 200 cene rimangono oscillazioni casuali; ripetendo il test si possono ottenere risultati diversi.</p>
        </> : <p className="text-sm">Per calcolare S manca ancora almeno una delle quattro coppie di piatti. Il risultato comparirà quando tutte avranno almeno una cena registrata.</p>}
      </>}
    </section>
    <aside className="space-y-3 rounded-lg bg-sky-50 p-4 text-sm dark:bg-sky-950/30">
      <h4 className="font-semibold">Perché non è stregoneria?</h4>
      <p>Nelle sale separate, ciascuno doveva rispondere conoscendo soltanto la propria domanda. È in quelle condizioni che il ristorante normale non poteva superare S = 2.</p>
      <p>In terrazza Alice e Bob conoscono invece entrambi i piatti prima di ordinare il vino. La regola di Alice è sempre la stessa — bianco se entrambi mangiano pesce, altrimenti rosso — ma per applicarla deve sapere anche che cosa mangia Bob. Anche Bob deve conoscere entrambi i piatti per decidere fra bottiglia e calici. Una regola fissa può dunque usare informazioni che nelle sale separate non erano disponibili.</p>
      <p>Con queste regole, un servizio senza errori darebbe S = 4. Gli errori di formato del cameriere, una volta su cinque in media, riducono il valore atteso a 2,4. Non creano il superamento di 2: lo attenuano.</p>
      <p><strong>La conclusione:</strong> il ristorante normale può ottenere S = 2,4 quando si decide conoscendo entrambi i piatti. Il risultato sorprendente del ristorante stregato è superare 2 anche con le sale separate, senza comunicare le domande prima delle risposte. Per confrontare i due ristoranti bisogna confrontare anche le informazioni disponibili, non soltanto il valore di S.</p>
    </aside>
  </div>;
}
