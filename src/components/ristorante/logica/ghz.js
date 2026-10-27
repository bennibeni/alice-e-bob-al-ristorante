export const INPUT_GHZ = [[0,0,0],[0,1,1],[1,0,1],[1,1,0]];
export const STRATEGIE_GHZ = [[0,0],[0,1],[1,0],[1,1]];
export const parityGHZ = values => values.reduce((sum,v)=>sum^v,0);
export const targetGHZ = inputs => inputs.reduce((sum,v)=>sum+v,0)/2;
export const vinceGHZ = (inputs, outputs) => parityGHZ(outputs)===targetGHZ(inputs);
export function risultatiGHZ(plan) {
  return INPUT_GHZ.map(inputs=>{
    const outputs=inputs.map((input,player)=>plan[player][input]);
    return {inputs,outputs,win:vinceGHZ(inputs,outputs)};
  });
}
export const probabilitaGHZ = plan => risultatiGHZ(plan).filter(s=>s.win).length/4;
export function tuttiAccordiGHZ() {
  return STRATEGIE_GHZ.flatMap(a=>STRATEGIE_GHZ.flatMap(b=>STRATEGIE_GHZ.map(c=>{
    const plan=[a,b,c];return {plan,probability:probabilitaGHZ(plan)};
  })));
}
export function cenaGHZ(plan, quantum, rng=Math.random) {
  const inputs=INPUT_GHZ[Math.floor(rng()*4)];
  let outputs;
  if(quantum) {
    const a=Number(rng()<.5),b=Number(rng()<.5);
    outputs=[a,b,a^b^targetGHZ(inputs)];
  } else outputs=inputs.map((input,i)=>plan[i][input]);
  return {inputs,outputs,win:vinceGHZ(inputs,outputs)};
}
