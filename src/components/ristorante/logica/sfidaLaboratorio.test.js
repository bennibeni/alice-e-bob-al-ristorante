import { describe, it, expect } from "vitest";
import { cenaOfferta, percentualeStrategia, tutteLeStrategie, seraSfida, creaRng, DELTA_OTTIMALE } from "./sfidaLaboratorio";
import { wins } from "../../laboratorio/model";

describe("capitolo 3 con la convenzione del laboratorio", () => {
  it("coincide con il laboratorio in tutti i 16 esiti", () => {
    for (const x of [0,1]) for (const y of [0,1])
      for (const a of [0,1]) for (const b of [0,1])
        expect(cenaOfferta(x,y,a ? "R":"B",b ? "R":"B")).toBe(wins(x,y,a,b));
    expect(percentualeStrategia({a0:"B",a1:"B",b0:"R",b1:"R"})).toBe(.75);
    expect(percentualeStrategia({a0:"B",a1:"B",b0:"B",b1:"B"})).toBe(.25);
    expect(tutteLeStrategie().filter(s=>s.percentuale===.75)).toHaveLength(8);
  });
  it("la simulazione classica rispetta ogni risposta concordata", () => {
    const rng=creaRng(17);
    for(const strategia of tutteLeStrategie()) for(let n=0;n<32;n++) {
      const s=seraSfida({modo:"liste",strategia},rng);
      expect(s.a).toBe(s.x ? strategia.a1:strategia.a0);
      expect(s.b).toBe(s.y ? strategia.b1:strategia.b0);
      expect(s.vinta).toBe(cenaOfferta(s.x,s.y,s.a,s.b));
    }
  });
  it("le correlazioni quantistiche vincono circa 85,36% in ogni abbinamento", () => {
    const rng=creaRng(2026),counts=Array.from({length:4},()=>({n:0,w:0}));
    for(let i=0;i<60000;i++) {
      const s=seraSfida({modo:"gemelle",delta:DELTA_OTTIMALE},rng);
      const c=counts[2*s.x+s.y];c.n++;if(s.vinta)c.w++;
      expect(s.vinta).toBe(cenaOfferta(s.x,s.y,s.a,s.b));
    }
    for(const c of counts) expect(Math.abs(c.w/c.n-Math.cos(Math.PI/8)**2)).toBeLessThan(.02);
  });
});
