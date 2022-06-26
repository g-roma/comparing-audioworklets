const TWOPI = 2 * Math.PI;
const BUF_SIZE = 128;

class SineProcessor extends AudioWorkletProcessor {
   constructor() {
        super();
        this.hz2rps = TWOPI / sampleRate;
        this.freq = 0;
        this.phase = 0;
        this.incr = 0;
        this.buf = new Float32Array(BUF_SIZE);
   }
      
   static get parameterDescriptors() {
    return [{
      name: 'frequency',
      defaultValue: 440
    }];
   }

  process (inputs, outputs, parameters) {
      let out = outputs[0];
      let buf = this.buf;
      const freqP = parameters.frequency;
      let curFreq = freqP[0];
      for (let i = 0; i < BUF_SIZE; i++) {
        buf[i] = Math.sin(this.phase);
        if(freqP.length > 1) curFreq = freqP[i];
        if(curFreq != this.freq){
              this.incr = curFreq * this.hz2rps;
              this.freq = curFreq;
        }  
        this.phase =  (this.phase + this.incr) % TWOPI;
      }
      for (let i = 0; i < out.length; i++)  {
        out[i].set(buf);
      }
      return true;
    }
  }
  
registerProcessor('sine-js-processor', SineProcessor);