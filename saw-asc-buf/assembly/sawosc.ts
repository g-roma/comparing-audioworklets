const BUFFER_SIZE = 128;
let phase:f32 = 0;
let frequency:f32 = 0;
let incr:f32 = 0;
let sampleRate:f32 = 0;

export function init(_sampleRate:f32):void{
  sampleRate = _sampleRate;
}

function polyBlep(t:f32, dt:f32):f32{
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

export function process (freq:f32):void {
  if(frequency!=freq){
    incr = freq / sampleRate;
    frequency = freq;
  }
  for(let i:i32 = 0; i < BUFFER_SIZE; i++){
    store<f32>(i <<2, (2 * phase - 1) - polyBlep(phase, incr));
    phase = Mathf.mod(phase + incr,  1.);
  }
}