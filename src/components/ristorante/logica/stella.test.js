import { describe, it, expect } from "vitest";
import { PIATTI_STELLA, PERCORSI_STELLA, PARITA_STELLA, DOMANDE_STELLA, parity, pianoBobStella, probabilitaStella, seraStella, OSSERVABILI_STELLA } from "./stella";
import { creaRng } from "./ristorante";

// Products of Pauli strings: phase is an exponent of i, modulo 4.
function product(a,b) {
  const multiplication={XY:["Z",1],YX:["Z",3],YZ:["X",1],ZY:["X",3],ZX:["Y",1],XZ:["Y",3]};
  let phase=0;
  const value=[...a].map((x,k)=>{
    const y=b[k];
    if(x==="I") return y;
    if(y==="I") return x;
    if(x===y)return "I";
    const [z,p]=multiplication[x+y];phase+=p;return z;
  }).join("");
  return {value,phase:phase%4};
}
describe("menù a cinque stelle",()=>{
  it("contiene 10 piatti, 5 percorsi e 20 domande equiprobabili",()=>{
    expect(PIATTI_STELLA).toHaveLength(10);expect(DOMANDE_STELLA).toHaveLength(20);
    for(const points of PERCORSI_STELLA)expect(points).toHaveLength(4);
    for(let p=0;p<10;p++)expect(PERCORSI_STELLA.filter(line=>line.includes(p))).toHaveLength(2);
  });
  it("enumera i 1024 accordi di Alice: il migliore vince 19/20",()=>{
    let best=0;
    for(let mask=0;mask<1024;mask++){
      const a=Array.from({length:10},(_,i)=>(mask>>i)&1),bob=pianoBobStella(a);
      for(let i=0;i<5;i++)expect(parity(bob[i])).toBe(PARITA_STELLA[i]);
      const wrong=PERCORSI_STELLA.filter((points,i)=>parity(points.map(p=>a[p]))!==PARITA_STELLA[i]).length;
      expect(probabilitaStella(a)).toBe(1-wrong/20);
      best=Math.max(best,probabilitaStella(a));
    }
    expect(best).toBe(.95);expect(probabilitaStella(Array(10).fill(0))).toBe(.95);
  });
  it("ogni percorso ha osservabili compatibili e il prodotto richiesto",()=>{
    PERCORSI_STELLA.forEach((points,line)=>{
      const ops=points.map(p=>OSSERVABILI_STELLA[p]);
      for(const a of ops)for(const b of ops)expect(product(a,b)).toEqual(product(b,a));
      let value="III",phase=0;
      for(const op of ops){const r=product(value,op);value=r.value;phase=(phase+r.phase)%4;}
      expect(value).toBe("III");expect(phase).toBe(PARITA_STELLA[line]*2);
    });
  });
  it("le cene simulate rispettano parità, accordo e marginali quantistiche",()=>{
    const rng=creaRng(507),a=Array(10).fill(0);let red=0;
    for(let i=0;i<12000;i++){
      const q=seraStella(a,true,rng);red+=q.a;
      expect(parity(q.colors)).toBe(PARITA_STELLA[q.line]);
      expect(q.a).toBe(q.colors[PERCORSI_STELLA[q.line].indexOf(q.point)]);expect(q.win).toBe(true);
      const c=seraStella(a,false,rng);expect(c.a).toBe(a[c.point]);
      expect(c.win).toBe(c.a===c.colors[PERCORSI_STELLA[c.line].indexOf(c.point)]);
    }
    expect(Math.abs(red/12000-.5)).toBeLessThan(.02);
  });
});
