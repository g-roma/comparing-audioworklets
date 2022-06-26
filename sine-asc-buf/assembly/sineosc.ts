const BUFFER_SIZE = 128;
let phase:f32 = 0;
let freq:f32 = 0;
let incr:f32 = 0;
let hz2rad:f32;
const PI: f32 = 3.141592653589793;
const TWOPI: f32 = PI * 2;

export function sin(x: f32): f32 {
  var y: f32, z: f32;
  x *= 1 / PI;
  y  = floor(x);
  z  = x - y;
  z *= 1.0 - z;
  z *= 3.6 * z + 3.1;
  return select(-z, z, <i32>y & 1);
}

export function init(sampleRate:f32):void{
  hz2rad = TWOPI / sampleRate;
}

export function process (curFreq:f32):void {
  if(freq != curFreq){
    incr = curFreq * hz2rad;
    freq = curFreq;
  }
  for(let i:i32 = 0; i < BUFFER_SIZE; i++){
    store<f32>(i <<2, sin(phase));
    phase = Math.mod(phase + incr, TWOPI);
  }
}