class SineProcessor extends AudioWorkletProcessor {
   constructor(options) {
        super();
        this._osc = new Module.SineOsc(sampleRate);
        this.buffer = new Float32Array(128);
   }

   static get parameterDescriptors() {
    return [{
      name: 'frequency',
      defaultValue: 440
    }];
   }

  process (inputs, outputs, parameters) {
     let out = outputs[0];
     let buf = this.buffer;
     const freqP = parameters.frequency;
     let curFreq = freqP[0];
     for (let i = 0; i < buf.length; i++) {
        if(freqP.length > 1) curFreq = freqP[i];
        buf[i] = this._osc.process(curFreq);
      }
      for (let i = 0; i < out.length; i++)  {
        out[i].set(buf);
      }
      return true;
    }
  }

registerProcessor('sine-ems-ps-processor', SineProcessor);
