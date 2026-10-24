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
