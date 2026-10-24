// QUESTIONS per valori 1..9
//
// Pattern assegnati:
//   1 -> NNNS    5 -> NNSN    9 -> NSNN
//   2 -> SNSN    6 -> SSNN
//   3 -> NSSN    7 -> NNSS
//   4 -> SNNS    8 -> SNNN
//
// Bilanciamento:
//   D1 (pari)   : S per {2,4,6,8} → 4 valori su 9
//   D2 (mult3)  : S per {3,6,9}   → 3 valori su 9
//   D3 (primo)  : S per {2,3,5,7} → 4 valori su 9
//   D4 (mod3=1) : S per {1,4,7}   → 3 valori su 9

export const QUESTIONS = [
  {
    id: "D1",
    label: "Sei pari?",
    ask: (n) => n % 2 === 0,
  },
  {
    id: "D2",
    label: "Sei multiplo di 3?",
    ask: (n) => n % 3 === 0,
  },
  {
    id: "D3",
    label: "Sei primo?",
    ask: (n) => n === 2 || n === 3 || n === 5 || n === 7,
  },
  {
    id: "D4",
    label: "Diviso per 3 lasci resto 1?",
    ask: (n) => n % 3 === 1,
  },
];
