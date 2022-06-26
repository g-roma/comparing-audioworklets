const BUFFER_SIZE:i32 = 128;
const outOffset = BUFFER_SIZE << 2;
let coefs:Float32Array = new Float32Array(5);// b0, b1, b2, a1, a2
let memory:Float32Array = new Float32Array(4);//x1, x2, y1, y2
let cutoff:f32 = 440;
let resonance:f32 = -20;
let sampleRate:f32;

function updateCoefs(co:f32, res:f32):void{
  const c:f32 = co / (sampleRate/2);
  const g:f32 = Math.pow(10.0, -0.05 * res);
  const w0:f32 = Math.PI * c;
  const cos_w0:f32 = Math.cos(w0);
  const alpha:f32 = 0.5 * Math.sin(w0) * g;
  const a0Inv:f32 = 1.0 / (1  + alpha);
  coefs[1] = 1.0 - cos_w0; //b1
  coefs[0] = 0.5 * coefs[1]; //b0
  coefs[2] = coefs[0]; //b2
  coefs[3] = -2.0 * cos_w0; // a1
  coefs[4] = 1.0 - alpha; // a2
  for(let i:i32 = 0; i < coefs.length; i++){
    coefs[i] *= a0Inv;
  }
  cutoff = co;
  resonance = res;
 }

 export function init(sr:f32):void{
  sampleRate = sr;
  updateCoefs(cutoff, resonance);
 }


export function process (_cutoff:f32, _resonance:f32):void {
  if(_cutoff!=cutoff ||_resonance != resonance){
    updateCoefs(_cutoff, _resonance);
  }

  for(let i:i32 = 0; i < BUFFER_SIZE; i++){
    let input:f32 = load<f32>(i<<2);
    let y:f32 = coefs[0] * input 
    + coefs[1] * memory[0] 
    + coefs[2] * memory[1] 
    - coefs[3] * memory[2] 
    - coefs[4] * memory[3];
  
    memory[1] = memory[0];
    memory[3] = memory[2];
    memory[0] = input;
    memory[2] = y;

    store<f32>(outOffset + (i <<2), y);
  }
}