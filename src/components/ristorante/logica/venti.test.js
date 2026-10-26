import { expect, it } from 'vitest';
import { DOMANDE, DIREZIONI, distanza, risposta, attesiVenti } from './venti';
import { valoreS } from './terrazza';

it('confronta esattamente calma e causa comune', () => {
  expect(attesiVenti(false)).toEqual([0,0,0,0]);
  expect(attesiVenti(true)).toEqual([0.5,-0.5,0.5,0.5]);
  expect(valoreS(attesiVenti(true))).toBe(2);
});
it('la coppia scelta minimizza davvero la somma degli scarti', () => {
  DOMANDE.forEach((d,i) => {
    for (const a of DIREZIONI) for (const b of DIREZIONI) {
      const scelta = risposta(i,a,b);
      const costo = (ia,ib) => distanza(a,(d.angoli[0]+180*ia)%360)+distanza(b,(d.angoli[1]+180*ib)%360);
      expect(costo(scelta.ia,scelta.ib)).toBe(Math.min(costo(0,0),costo(0,1),costo(1,0),costo(1,1)));
    }
  });
});
