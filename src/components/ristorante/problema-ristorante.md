# Alice e Bob al ristorante: il problema

21 ottobre 2026 · Ben

> Copia del documento «Alice e Bob al ristorante: il problema». All'algoritmo va data solo la sezione «Il problema», non «Il parallelo con la fisica».

## Il problema

**Lo scenario**

Alice e Bob cenano ogni sera nello stesso ristorante ma, per un'abitudine di cui non conosciamo il motivo, in due sale diverse. Ogni sala ha il suo cameriere. Il menù ha tre portate: antipasto (0), primo (1) e secondo (2).

A ogni cena ciascun cameriere sceglie, per il cliente della sua sala, una sola portata per cui chiedere il vino. La sceglie a caso al momento, senza consultare nessuno, e ognuna delle tre portate ha la stessa probabilità di essere scelta. I due camerieri non si parlano, e nessuno, nemmeno Alice e Bob, conosce in anticipo le loro scelte. Alice e Bob rispondono con una parola sola: rosso o bianco. Per le altre due portate non viene chiesto né registrato nulla.

Durante la cena nessuno passa da una sala all'altra: Alice non sa quale portata è stata scelta per Bob né che vino ha ordinato, e lo stesso vale per Bob. Il proprietario tiene un registro speciale in cui annota, sera dopo sera e per ciascuna sala, la portata scelta dal cameriere e il vino ordinato.

**I tre fatti**

Dopo moltissime sere, il registro speciale del proprietario mostra tre fatti:

1. **Con la stessa portata, vini sempre opposti.** Le sere in cui i camerieri scelgono per Alice e per Bob la stessa portata, se lei ordina rosso lui ordina bianco, e viceversa.
2. **Preso da solo, ognuno ordina a caso.** Nel quaderno di Alice (o di Bob), per qualunque portata, metà delle sere c'è rosso e metà bianco.
3. **Nel complesso, metà uguali.** Considerando tutte le sere insieme, senza distinguere le portate scelte, Alice e Bob ordinano lo stesso colore con probabilità 1/2.

**L'indagine**

Il fatto 1 fa pensare che Alice e Bob si mettano d'accordo. Proviamo allora questa ipotesi: prima di entrare Alice e Bob concordano che vino ordinare per ciascuna portata. Possono stabilire regole o schede a piacere, e anche tirare a sorte: insieme prima di entrare, o ciascuno per conto suo durante la cena. Ognuno ordina basandosi solo su quanto concordato, sui propri sorteggi e sulla portata scelta dal suo cameriere. Le scelte dei camerieri non dipendono da questi accordi.

**La domanda**

Un accordo di questo tipo può produrre i tre fatti? Se sì, descrivilo. Se no, dimostra perché.

## Il parallelo con la fisica

_Da non dare all'algoritmo: questa sezione suggerisce la risposta._

**Lo scenario in fisica**

Una sorgente emette coppie di particelle, sempre preparate nello stesso modo, e le manda verso due rivelatori lontani. Ogni rivelatore ha un selettore con tre posizioni, 0, 1 e 2: tre orientazioni di un magnete, a 120° l'una dall'altra.

Prima dell'arrivo di ogni particella, ciascun selettore viene impostato a caso, in modo indipendente dall'altro e da tutto ciò che è successo alla sorgente. Ogni particella viene misurata una sola volta, nella posizione del suo selettore, e la misura dà uno di due esiti, + o −. Le altre due misure possibili su quella particella non vengono fatte.

Gli esperimenti e la meccanica quantistica mostrano gli stessi tre fatti: esiti sempre opposti con la stessa posizione, metà + e metà − per ciascun rivelatore, esiti uguali con probabilità 1/2 nel complesso.

**Corrispondenza**

| Fisica                                          | Ristorante                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Sorgente che prepara la coppia                  | Quello che succede prima di cena                                                                      |
| Particella misurata da Alice / da Bob           | Alice / Bob                                                                                           |
| Due rivelatori lontani                          | Due sale, nessuno passa dall'una all'altra                                                            |
| Selettore di ciascun rivelatore                 | Cameriere di ciascuna sala                                                                            |
| Posizione del selettore (0, 1, 2)               | Portata scelta (0, 1, 2)                                                                              |
| Impostazione casuale e indipendente             | Scelta casuale dei due camerieri, che non si parlano                                                  |
| Esito + / −                                     | Vino rosso / bianco                                                                                   |
| Una sola misura per particella                  | Una sola portata con il vino per sera                                                                 |
| Dati dell'esperimento                           | Registro speciale del proprietario                                                                    |
| Proprietà nascoste, località, libertà di scelta | Accordo prima di cena, ordine basato solo sulla propria portata, camerieri indipendenti dagli accordi |
