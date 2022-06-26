class SineProcessor extends AudioWorkletProcessor {
   constructor() {
        super();
        this.buffer = new Float32Array(128);
        this.port.onmessage = async (e) => {
          let wasm = await WebAssembly.instantiate(e.data,
            {env:{
              abort: () => console.log('webassembly abort')
              }
            }
          );
          this._osc = wasm.instance.exports;
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
          for (let i = 0; i < this.buffer.length; i++) {
            buf[i] =  this._osc.process(curFreq);
            if(freqParam.length > 1) curFreq = freqParam[i];
            if(curFreq != this.freq){
                  this.freq = curFreq;
            }
          }
          for (let i = 0; i < out.length; i++) {
            out[i].set(buf);
         }    
      }
      return true;
    }
  }

registerProcessor('sine-asc-ps-processor', SineProcessor);
