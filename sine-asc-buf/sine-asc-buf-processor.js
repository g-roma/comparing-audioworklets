const BUFFER_SIZE = 128;

class SineProcessor extends AudioWorkletProcessor {
   constructor() {
        super();
        this.port.onmessage = async (e) => {
          let wasm = await WebAssembly.instantiate(e.data,
            {env:{
              abort: () => console.log('webassembly abort')
              }
            }
          );
          this._osc = wasm.instance.exports;
          this.buffer = new Float32Array(this._osc.memory.buffer,0, BUFFER_SIZE);
          this._osc.init(sampleRate);
        }
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
    if(this._osc) {
        this._osc.process(curFreq);
        for (let i = 0; i < out.length; i++) {
          out[i].set(buf);
       }    
    }
    return true;
    }
  }

registerProcessor('sine-asc-buf-processor', SineProcessor);