# R59 · CHSH sulla griglia 4x4 dei venti

Da `Next07/src/app/R04`, copiato senza modifiche al simulatore.

Replica un esperimento di psicologia cognitiva (Aerts et al., _Foundations of
Science_, 2018): i partecipanti scelgono coppie di direzioni del vento
(N, NE, E, ...) come "miglior esempio di due direzioni diverse". Dalle
probabilità pubblicate si calcolano i quattro correlatori E(AB), E(AB'),
E(A'B), E(A'B') e il valore CHSH S (≈ 2,48 > 2). Il simulatore estrae N
risposte per contesto e confronta S simulato e teorico.

Video di riferimento: Massimiliano Sassoli de Bianchi, "La mente quantistica:
pensieri entangled come gli spin (98)", https://www.youtube.com/watch?v=GkXDCwzsXSg

## File

- `page.js`: nuovo (senza `usePageSharedStateSync` di Next07)
- `Grid4x4WithVectors.js`: il simulatore
- `_Grid4x4WithVectors-trick.js`: variante precedente, non usata dalla pagina
- `spieghe.txt`: spiegazioni (S simulato/teorico, significato dei correlatori)

Collegato a R58 (gioco CHSH del ristorante).
