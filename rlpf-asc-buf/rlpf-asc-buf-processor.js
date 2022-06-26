class RLPFProcessor extends AudioWorkletProcessor {
   constructor() {
        super();
        this.port.onmessage = async (e) => {
          let wasm = await WebAssembly.instantiate(e.data,
            {env:{
              abort: () => console.log('webassembly abort')
              }
            }
          );
          this._filter = wasm.instance.exports;
          this.inputBuffer = new Float32Array(this._filter.memory.buffer,0, 128);
          this.outputBuffer = new Float32Array(this._filter.memory.buffer, 512, 128);
          this._filter.init(sampleRate);
        }
   }

   static get parameterDescriptors() {
    return [{
        name: 'cutoff',
        defaultValue: 440,
        maxValue:22000
      },{
        name: 'resonance',
        defaultValue: 1.0
      } 
    ];
   }

   process (inputs, outputs, parameters) {   
      const input = inputs[0];
      const out = outputs[0];
      if(input.length <= 0) return true;
      // using only 1st input channel
      const in0 = input[0];
      if(this._filter){
          this.inputBuffer.set(in0);
          const cutoff = parameters.cutoff[0];
          const reson = parameters.resonance[0];
          this._filter.process(cutoff, reson);
          for (let i = 0; i < out.length; i++)  {
            out[i].set(this.outputBuffer);
          }
    }
    return true;
   }
 }

 registerProcessor('rlpf-asc-buf-processor', RLPFProcessor);
