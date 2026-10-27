import { describe, it, expect } from "vitest";
import { INPUT_GHZ, targetGHZ, vinceGHZ, probabilitaGHZ, tuttiAccordiGHZ, cenaGHZ } from "./ghz";
import { creaRng } from "./ristorante";

describe("Un terzo ospite: gioco Mermin–GHZ",()=>{
  it("ammette solo zero o due bottiglie e richiede le parità corrette",()=>{
    expect(INPUT_GHZ).toHaveLength(4);
    for(const input of INPUT_GHZ){
      const sum=input.reduce((a,b)=>a+b,0);
      expect([0,2]).toContain(sum);expect(targetGHZ(input)).toBe(sum/2);
    }
    expect(vinceGHZ([0,0,0],[0,0,0])).toBe(true);
    expect(vinceGHZ([0,1,1],[0,0,0])).toBe(false);
    expect(vinceGHZ([0,1,1],[1,0,0])).toBe(true);
  });
  it("i 64 accordi si dividono in 32 al 75% e 32 al 25%",()=>{
    const all=tuttiAccordiGHZ();expect(all).toHaveLength(64);
    expect(all.filter(p=>p.probability===.75)).toHaveLength(32);
    expect(all.filter(p=>p.probability===.25)).toHaveLength(32);
    expect(probabilitaGHZ([[0,0],[0,0],[1,1]])).toBe(.75);
  });
  it("le misure X/Y sullo stato GHZ danno quattro triple vincenti equiprobabili",()=>{
    // <out|GHZ> = (1 + product(signs) * (-i)^numberOfY)/4.
    // All allowed inputs contain an even number of Y measurements.
    for(const input of INPUT_GHZ){
      const numberY=input.reduce((sum,v)=>sum+v,0);
      const phase=numberY===0?1:-1;
      let total=0;
      for(let mask=0;mask<8;mask++){
        const out=[mask&1,(mask>>1)&1,(mask>>2)&1];
        const product=out.reduce((p,a)=>p*(a?-1:1),1);
        const amplitude=(1+product*phase)/4;
        const probability=amplitude**2;total+=probability;
        expect(probability).toBe(vinceGHZ(input,out)?.25:0);
      }
      expect(total).toBe(1);
    }
  });
  it("la distribuzione ideale ha marginali a uno e due giocatori uniformi",()=>{
    for(const input of INPUT_GHZ){
      const outputs=Array.from({length:8},(_,m)=>[m&1,(m>>1)&1,(m>>2)&1]).filter(out=>vinceGHZ(input,out));
      for(let a=0;a<3;a++){
        expect(outputs.filter(out=>out[a]===1)).toHaveLength(2);
        for(let b=a+1;b<3;b++)for(const x of [0,1])for(const y of [0,1])
          expect(outputs.filter(out=>out[a]===x && out[b]===y)).toHaveLength(1);
      }
    }
  });
  it("le cene classiche seguono il piano, quelle quantistiche rispettano la parità",()=>{
    const rng=creaRng(202610),plan=[[0,1],[1,0],[1,1]],counts=[0,0,0,0];
    let quantumRed=0;
    for(let i=0;i<12000;i++){
      const c=cenaGHZ(plan,false,rng);expect(c.outputs).toEqual(c.inputs.map((x,k)=>plan[k][x]));
      expect(c.win).toBe(vinceGHZ(c.inputs,c.outputs));
      const q=cenaGHZ(plan,true,rng);expect(q.win).toBe(true);quantumRed+=q.outputs[2];
      counts[INPUT_GHZ.findIndex(v=>v.every((x,k)=>x===q.inputs[k]))]++;
    }
    for(const n of counts)expect(Math.abs(n/12000-.25)).toBeLessThan(.02);
    expect(Math.abs(quantumRed/12000-.5)).toBeLessThan(.02);
  });
});
