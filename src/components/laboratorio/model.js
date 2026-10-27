export const strategies = [[0,0], [0,1], [1,0], [1,1]];
export const cases = [[0,0], [0,1], [1,0], [1,1]];
export const wins = (x,y,a,b) => (a ^ b) === (1 ^ (x * y));
export const score = (a,b) => cases.filter(([x,y]) => wins(x,y,a[x],b[y])).length / 4;
export const quantumProbability = Math.cos(Math.PI / 8) ** 2;
