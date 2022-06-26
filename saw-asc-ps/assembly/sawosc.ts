//const TWOPI: f32 = Math.PI * 2;
let phase:f32 = 0;
let frequency:f32 = 0;
let incr:f32 = 0;
let sampleRate:f32 = 0;

const PI: f32 = 3.141592653589793;

export function init(_sampleRate:f32):void{
  sampleRate = _sampleRate;
}

function polyblep(t:f32, dt:f32):f32{
  if (t < dt) {
    t /= dt;
    return t + t - t * t - 1.0;
  }
  else if (t > 1.0 - dt) {
    t = (t - 1.0) / dt;
    return t * t + t + t + 1.0;
  }
  else return 0;
}

export function process (freq:f32):f32 {
  let result:f32 = (2 * phase - 1) - polyblep(phase, incr);
  if(frequency!=freq){
    incr = freq / sampleRate;
    frequency = freq;
  }
  phase = Mathf.mod(phase + incr,  1.);
  return result;
}
