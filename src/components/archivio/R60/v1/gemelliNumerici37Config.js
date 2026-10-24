function buildHexCoordsR3() {
  const HEX_DIRECTIONS = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ];

  const coords = [{ q: 0, r: 0 }];

  for (let k = 1; k <= 3; k += 1) {
    let q = HEX_DIRECTIONS[4].q * k;
    let r = HEX_DIRECTIONS[4].r * k;

    for (let dir = 0; dir < 6; dir += 1) {
      const stepDir = HEX_DIRECTIONS[dir];
      for (let step = 0; step < k; step += 1) {
        coords.push({ q, r });
        q += stepDir.q;
        r += stepDir.r;
      }
    }
  }

  return coords;
}

export const MODEL_RADIUS = 3;
export const MODEL_EXCLUDED_INDEX = 0;
export const MODEL_ACTIVE_INDEX_START = 1;
export const MODEL_ACTIVE_INDEX_END = 36;
export const MODEL_CELL_COUNT = 37;

export const MODEL_VALUES = [
  0, 1, 2, 3, 4, 5, 6, 3, 5, 7, 6, 5, 1, 8, 2, 1, 3, 9, 4, 2, 6, 9, 8, 1, 9, 4,
  2, 7, 9, 3, 7, 6, 4, 8, 7, 5, 8,
];

export const MODEL_COORDS = buildHexCoordsR3();

export const MODEL_COLLINEAR_LINES = [
  [35, 33],
  [36, 17, 32],
  [19, 18, 16, 31],
  [7, 6, 15],
  [20, 1, 5, 30],
  [8, 0, 14],
  [21, 2, 4, 29],
  [9, 3, 13],
  [22, 10, 12, 28],
  [23, 11, 27],
  [24, 26],

  [34, 35, 36, 19],
  [33, 17, 18, 7, 20],
  [32, 16, 6, 1, 8, 21],
  [31, 15, 5, 0, 2, 9, 22],
  [30, 14, 4, 3, 10, 23],
  [29, 13, 12, 11, 24],
  [28, 27, 26, 25],

  [32, 30],
  [33, 15, 29],
  [34, 16, 14, 28],
  [17, 5, 13],
  [35, 6, 4, 27],
  [18, 0, 12],
  [36, 1, 3, 26],
  [7, 2, 11],
  [19, 8, 10, 25],
  [20, 9, 24],
  [21, 23],

  [34, 33, 32, 31],
  [35, 17, 16, 15, 30],
  [36, 18, 6, 5, 14, 29],
  [19, 7, 1, 0, 4, 13, 28],
  [20, 8, 2, 3, 12, 27],
  [21, 9, 10, 11, 26],
  [22, 23, 24, 25],

  [36, 20],
  [35, 7, 21],
  [34, 18, 8, 22],
  [17, 1, 9],
  [33, 6, 2, 23],
  [16, 0, 10],
  [32, 5, 3, 24],
  [15, 4, 11],
  [31, 14, 12, 25],
  [30, 13, 26],
  [29, 27],

  [31, 30, 29, 28],
  [32, 15, 14, 13, 27],
  [33, 16, 5, 4, 12, 26],
  [34, 17, 6, 0, 3, 11, 25],
  [35, 18, 1, 2, 10, 24],
  [36, 7, 8, 9, 23],
  [19, 20, 21, 22],
];

// IDEAL_EQUAL_RATIO = P(stessa risposta | le due celle hanno valori diversi)
// calcolato analiticamente con le 4 domande e distribuzione uniforme 9 valori × 4 celle
// = 29/54
export const IDEAL_EQUAL_RATIO = 29 / 54;

// RANDOM_EQUAL_RATIO = P(stessa risposta | sistema random, totale)
// = ratio atteso con scelta uniforme tra le 35 altre celle attive
// = 71/135
export const RANDOM_EQUAL_RATIO = 71 / 135;
