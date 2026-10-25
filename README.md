# Alice e Bob al ristorante

Applicazione autonoma Next.js 16 / React 19 estratta da `Next14/src/app/rxx/R04`. Conserva il racconto, le illustrazioni, i riferimenti, le finestre di approfondimento e tutte le simulazioni. Include favicon con due calici e footer «← All projects».

## Avvio

```powershell
npm run dev
```

Aprire http://localhost:3018. È disponibile anche `Apri Alice e Bob.cmd`.

Dipendenze già installate. Su un altro computer: `npm ci`. Per produzione: `npm run build`, poi `npm start`. Test: `npm test`.

## Struttura

- `src/app`: pagina principale, layout, favicon e stile Tailwind.
- `src/components/ristorante`: sorgenti R04, navigazione fra capitoli, simulazioni e logica.
- `src/components/archivio/R59`: simulazione della terrazza.
- `src/components/archivio/R60/v4` e due moduli `v1`: simulazione della sala a nido d’ape.
- `public/r04`: tutte le illustrazioni e fotografie locali.
- `public/chsh-game.html`: approfondimento CHSH già presente nel progetto originale.

I capitoli sono raggiungibili tramite hash, per esempio `/#sfida`, `/#alveare` e `/#terrazza`. Le dipendenze archiviate sono copie locali: la nuova applicazione non richiede il progetto Next14. I sorgenti originali non sono stati modificati.

Le simulazioni riproducono statistiche matematiche: non costituiscono un esperimento fisico fra sistemi isolati. Le fonti e le attribuzioni originali sono conservate nei capitoli e negli approfondimenti.

## Terrazza — modello delle ordinazioni

Il capitolo 9, «Insieme in terrazza», usa `sim/SimTerrazza.jsx` e `logica/terrazza.js`.
I piatti sono estratti indipendentemente; colore e formato dipendono da entrambi i piatti. Alice e Bob seguono sempre le proprie regole. Il cameriere inverte il formato richiesto con probabilità 20%, mantenendo il colore: il registro del servizio ha S atteso = 2,4. Senza errori S sarebbe 4. Il modello è narrativo, con parametri fissi e decisioni che conoscono entrambi i piatti; non usa dati sperimentali sui venti.

La versione precedente è salvata in `backups/terrazza-dei-venti-20261025-113910`; il simulatore R59 rimane intatto nell’archivio.
