const BUFFER_SIZE = 128;

class SawProcessor extends AudioWorkletProcessor {
   constructor(options) {
        super();
        this._osc = new Module.SawOsc(sampleRate);
        this.buffer = new Float32Array(BUFFER_SIZE);
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

registerProcessor('saw-ems-ps-processor', SawProcessor);
