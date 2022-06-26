class RLPFProcessor extends AudioWorkletProcessor {
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
          this._filter = wasm.instance.exports;
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
    let input = inputs[0];
    if(input.length <= 0) return true;
    // using only 1st input channel
    const in0 = input[0];
    let out = outputs[0];
    let buf = this.buffer;
    const cutoffP = parameters.cutoff;
    const resonP = parameters.resonance;
    let curCutoff, curRes;
    curCutoff = cutoffP[0];
    curRes = resonP[0];
    if(this._filter){
        for (let j = 0; j < buf.length; j++) {
            if(cutoffP.length > 1) curCutoff = cutoffP[j];
            if(resonP.length > 1) curRes = resonP[j];
            buf[j] = this._filter.process(in0[j], curCutoff, curRes);
        }
        for (let i = 0; i < out.length; i++)  {
          out[i].set(buf);
        }
    }
     return true;
   }
 }

 registerProcessor('rlpf-asc-ps-processor', RLPFProcessor);
