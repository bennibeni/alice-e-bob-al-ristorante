export function ParalleloFisica() {
  return <details className="group rounded-lg border border-sky-200 bg-sky-50/60 p-4 dark:border-sky-900 dark:bg-sky-950/30">
    <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-sky-900 dark:text-sky-200">Il parallelo con la fisica</summary>
    <div className="mt-4 space-y-4">
    <p>Una sorgente invia due fotoni entangled a due laboratori distanti, uno ad Alice e uno a Bob. Qui torniamo alle condizioni delle sale separate: ciascuno sceglie la propria misura senza conoscere la scelta dell’altro e senza riceverne informazioni prima di rispondere.</p>
    <h4 className="font-semibold">1. Le scelte e i risultati</h4>
    <p>Alice sceglie fra due orientamenti del suo analizzatore di polarizzazione, A e A′; Bob fra B e B′. Le scelte sono indipendenti fra loro e dalle informazioni portate dalle particelle. Ogni misura produce uno di due risultati, codificati +1 e −1. Gli orientamenti sono le domande; i numeri sono le risposte.</p>
    <h4 className="font-semibold">2. Quattro correlatori</h4>
    <p>Dopo molte prove, Alice e Bob confrontano i registri e dividono i risultati secondo la coppia di orientamenti usata. Per ciascun gruppo calcolano la media del prodotto delle due risposte: E(A,B), E(A,B′), E(A′,B), E(A′,B′). Ogni correlatore usa le prove del proprio gruppo, non quattro misure simultanee sulla stessa coppia di fotoni.</p>
    <h4 className="font-semibold">3. Il limite locale: la disuguaglianza CHSH</h4>
    <p>Supponiamo che le particelle condividano informazioni dalla sorgente e che ciascuna risposta dipenda soltanto da quelle informazioni e dalla misura scelta nel proprio laboratorio. Anche ammettendo risposte casuali, questi modelli locali rispettano il limite CHSH, purché le scelte delle misure siano indipendenti dalle informazioni condivise.</p>
    <p className="overflow-x-auto rounded bg-white p-3 font-mono text-sm dark:bg-zinc-900">S = |E(A,B) − E(A,B′) + E(A′,B) + E(A′,B′)| ≤ 2</p>
    <p>Usiamo la stessa convenzione del ristorante: il segno meno è davanti a E(A,B′). Esistono forme equivalenti con il segno meno in un’altra posizione, ottenute cambiando le etichette.</p>
    <p>Per vedere da dove nasce il limite, immaginiamo risposte locali già assegnate a ogni possibile domanda: a, a′, b e b′ valgono ±1. La combinazione a(b − b′) + a′(b + b′) vale sempre +2 oppure −2: una delle parentesi è zero, l’altra è ±2. <strong>Facendo la media, il valore assoluto non può superare 2</strong>.</p>
    <figure className="space-y-4 rounded-lg border border-sky-200 bg-white p-4 dark:border-sky-800 dark:bg-zinc-900">
      <figcaption className="font-semibold">Dai singoli valori alla media: quattro esempi</figcaption>
      <p className="text-sm">Ogni quadrato rappresenta una combinazione di risposte locali assegnate alle quattro domande. Il suo contributo alla somma CHSH, prima del valore assoluto, è +2 oppure −2. Non è il prodotto di una sola cena, che vale invece ±1.</p>
      <div className="flex flex-wrap gap-4 text-xs"><span className="rounded bg-sky-100 px-2 py-1 font-semibold text-sky-900 dark:bg-sky-900 dark:text-sky-100">+2</span><span className="rounded bg-orange-100 px-2 py-1 font-semibold text-orange-900 dark:bg-orange-900 dark:text-orange-100">−2</span></div>
      <div className="grid gap-3 sm:grid-cols-2">{[
        { titolo: 'Tutti i contributi sono +2', valori: [2, 2, 2, 2], media: 2, conto: '(2 + 2 + 2 + 2) / 4 = 2', assoluto: '2' },
        { titolo: 'Tre contributi +2 e uno −2', valori: [2, 2, 2, -2], media: 1, conto: '(2 + 2 + 2 − 2) / 4 = 1', assoluto: '1' },
        { titolo: 'Un contributo +2 e tre −2', valori: [2, -2, -2, -2], media: -1, conto: '(2 − 2 − 2 − 2) / 4 = −1', assoluto: '1' },
        { titolo: 'Tanti +2 quanti −2', valori: [2, 2, -2, -2], media: 0, conto: '(2 + 2 − 2 − 2) / 4 = 0', assoluto: '0' },
      ].map(esempio => <div key={esempio.titolo} className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
        <p className="text-sm font-medium">{esempio.titolo}</p>
        <div className="flex flex-wrap items-center gap-2">{esempio.valori.map((v, i) => <span key={i} className={`inline-flex h-8 w-8 items-center justify-center rounded font-bold ${v > 0 ? 'bg-sky-100 text-sky-900 dark:bg-sky-900 dark:text-sky-100' : 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100'}`}>{v > 0 ? '+2' : '−2'}</span>)}<span className="ml-2 text-sm">Media = <strong>{esempio.media}</strong>; valore assoluto = <strong>{esempio.assoluto}</strong></span></div>
        <p className="text-xs font-mono">{esempio.conto}</p>
      </div>)}</div>
      <p className="text-sm">Cambiare le proporzioni cambia la media, ma non può portarla fuori dall’intervallo da −2 a +2. Anche usando molte più prove, o proporzioni diverse, <strong>il valore assoluto della media resta al massimo 2</strong>.</p>
    </figure>
    <h4 className="font-semibold">4. Le correlazioni quantistiche</h4>
    <p>Per una particolare coppia di fotoni entangled, idealmente il correlatore di polarizzazione è <strong>cos[2(α − β)]</strong>, dove α e β sono gli orientamenti degli analizzatori. Scegliamo A = 0°, A′ = 45°, B = 22,5° e B′ = 67,5°. Si ottengono, nell’ordine della formula, circa +0,707, −0,707, +0,707 e +0,707.</p>
    <figure className="space-y-3 rounded-lg border border-sky-200 bg-white p-4 dark:border-sky-800 dark:bg-zinc-900">
      <figcaption className="font-semibold">Gli orientamenti e i quattro correlatori</figcaption>
      <svg viewBox="0 0 620 255" className="h-auto w-full" role="img" aria-labelledby="angoli-title angoli-desc">
        <title id="angoli-title">Orientamenti degli analizzatori di Alice e Bob</title>
        <desc id="angoli-desc">Alice sceglie zero o quarantacinque gradi, Bob ventidue virgola cinque o sessantasette virgola cinque gradi. Tutti gli angoli sono misurati dallo stesso riferimento orizzontale.</desc>
        {[{cx:155, nome:'Alice', colore:'#e11d48', angoli:[0,45], etichette:['A = 0°','A′ = 45°']}, {cx:465, nome:'Bob', colore:'#0284c7', angoli:[22.5,67.5], etichette:['B = 22,5°','B′ = 67,5°']}].map(persona => <g key={persona.nome}>
          <text x={persona.cx} y="24" textAnchor="middle" fill={persona.colore} fontSize="18" fontWeight="bold">{persona.nome}</text>
          <circle cx={persona.cx} cy="145" r="80" fill="none" stroke="currentColor" strokeOpacity="0.2" />
          <line x1={persona.cx-90} x2={persona.cx+90} y1="145" y2="145" stroke="currentColor" strokeOpacity="0.4" strokeDasharray="4 4" />
          {persona.angoli.map((angolo,i) => {
            const r=angolo*Math.PI/180;
            const x=80*Math.cos(r), y=80*Math.sin(r);
            return <g key={angolo}>
              <line x1={persona.cx-x} y1={145+y} x2={persona.cx+x} y2={145-y} stroke={persona.colore} strokeWidth="4" strokeDasharray={i ? '9 4' : undefined} />
              <path d={`M ${persona.cx+30} 145 A 30 30 0 0 0 ${persona.cx+30*Math.cos(r)} ${145-30*Math.sin(r)}`} fill="none" stroke={persona.colore} strokeWidth="1.5" />
            </g>;
          })}
          <circle cx={persona.cx} cy="145" r="4" fill={persona.colore} />
          <text x={persona.cx} y="237" textAnchor="middle" fill="currentColor" fontSize="13">{persona.etichette.join('   ·   ')}</text>
        </g>)}
      </svg>
      <p className="text-xs">Angoli misurati in senso antiorario rispetto allo stesso riferimento orizzontale. Linea continua: A o B; tratteggiata: A′ o B′. Sono assi degli analizzatori, non traiettorie dei fotoni.</p>
      <div className="grid gap-2 text-sm sm:grid-cols-2">{[
        ['A, B', '0° − 22,5° = −22,5°', '−45°', '+0,707'],
        ['A, B′', '0° − 67,5° = −67,5°', '−135°', '−0,707'],
        ['A′, B', '45° − 22,5° = 22,5°', '45°', '+0,707'],
        ['A′, B′', '45° − 67,5° = −22,5°', '−45°', '+0,707'],
      ].map(([coppia,differenza,doppio,risultato]) => <div key={coppia} className={`rounded border p-3 ${risultato.startsWith('−') ? 'border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30' : 'border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/30'}`}>
        <p className="font-semibold">{coppia}</p><p className="text-xs">α − β = {differenza}</p><p className="mt-1">E = cos({doppio}) ≈ <strong>{risultato}</strong></p>
      </div>)}</div>
      <p className="text-xs">La formula <strong>cos[2(α − β)]</strong> usa il doppio della differenza fra gli orientamenti. Per A e B′ la differenza è −67,5°: raddoppiandola otteniamo −135°, il cui coseno è circa −0,707. Negli altri tre casi la differenza è ±22,5°: il doppio è ±45°, il cui coseno è circa +0,707.</p>
    </figure>
    <p className="overflow-x-auto rounded bg-white p-3 font-mono text-sm dark:bg-zinc-900">S ≈ |0,707 − (−0,707) + 0,707 + 0,707| = 2,828</p>
    <p>Il valore esatto è <strong>2√2</strong>, il massimo quantistico CHSH. Nei tre gruppi con correlatore positivo i segni coincidono in circa l’85,4% delle prove; nel gruppo negativo sono opposti con la stessa probabilità. Un esperimento reale può dare valori inferiori per rumore e imperfezioni.</p>
    <h4 className="font-semibold">5. Che cosa significa «non-località»?</h4>
    <p>Le violazioni di Bell escludono i modelli locali descritti sopra, sotto le ipotesi del test: istruzioni condivise dalla sorgente e sole risposte locali non bastano. Questo è il significato della <strong>non-località di Bell</strong>. Non obbliga a immaginare un segnale controllabile che viaggi istantaneamente da Alice a Bob.</p>
    <p>Bob, guardando soltanto i propri risultati, non può scoprire quale orientamento abbia scelto Alice: le sue statistiche locali non cambiano. Le correlazioni emergono confrontando i due registri, tramite una comunicazione ordinaria. <strong>La violazione non permette di inviare messaggi più veloci della luce.</strong></p>
    <p>La terrazza ottiene invece S medio = 2,4 perché le decisioni usano entrambi i piatti. La fisica quantistica supera 2 anche senza rendere disponibile a ciascun laboratorio la scelta dell’altro: è questa la differenza decisiva.</p>
    <p className="text-xs text-zinc-600 dark:text-zinc-400">Approfondimenti: <a className="underline" href="https://quantum.cloud.ibm.com/docs/en/tutorials/chsh-inequality" target="_blank" rel="noreferrer">CHSH · IBM Quantum</a>; <a className="underline" href="https://www.nobelprize.org/prizes/physics/2022/advanced-information/" target="_blank" rel="noreferrer">Nobel per la fisica 2022 · documentazione scientifica</a>.</p>
    </div>
  </details>;
}
