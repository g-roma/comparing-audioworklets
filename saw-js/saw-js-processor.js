const BUF_SIZE = 128;

class SawProcessor
      extends AudioWorkletProcessor {
   constructor() {
        super();
        this.freq = 0;
        this.buf = new Float32Array(BUF_SIZE);
        this.incr = 0;
        this.phase = 0;
   }

   static get parameterDescriptors() {
    return [{
      name: 'frequency',
      defaultValue: 440
    }];
   }

  polyblep(t, dt){
    if (t < dt) {
      t /= dt;
      return  2*((t - (t*t)/2 - 0.5));
    }
    else if (t > 1.0 - dt) {
      t = (t - 1.0) / dt;
      return 2*((t * t)/2 + t  + 0.5);
    }
    else return 0;
  }

  process (inputs, outputs, parameters) {
      let out = outputs[0];
      let buf = this.buf;
      const freqP = parameters.frequency;
      let curFreq = freqP[0];
      for (let i = 0; i < BUF_SIZE; i++) {
        buf[i] = (2 * this.phase - 1) - 
                  this.polyblep(this.phase, this.incr);
        if(freqP.length > 1) curFreq = freqP[i];
        if(curFreq != this.freq){
              this.freq = curFreq;
              this.incr = curFreq  / sampleRate;
        }
        this.phase = (this.phase + this.incr)  % 1.0;
      }
      for (let i = 0; i < out.length; i++)  {
        out[i].set(buf);
      }
      return true;
    }
  }

registerProcessor('saw-js-processor', SawProcessor);
