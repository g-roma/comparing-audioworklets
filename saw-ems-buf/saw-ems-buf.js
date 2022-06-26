const BYTES_PER_SAMPLE = 4;
const BUFFER_SIZE = 128;

class SawProcessor extends AudioWorkletProcessor {
   constructor(options) {
        super();
        this._osc = new Module.SawOsc(sampleRate);
        this._outputPointer =  Module._malloc(BUFFER_SIZE * BYTES_PER_SAMPLE);
        this.buffer = new Float32Array(
          Module.asm.memory.buffer,
          this._outputPointer,
          BUFFER_SIZE
        )
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
      const freqParam = parameters.frequency;
      let curFreq = freqParam[0];
      this._osc.process(this._outputPointer, curFreq);
      for (let i = 0; i < outputs.length; i++) {
        out[i].set(buf);
     }
      return true;
    }
  }

registerProcessor('saw-ems-buf-processor', SawProcessor);
