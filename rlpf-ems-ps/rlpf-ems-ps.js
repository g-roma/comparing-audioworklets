const BUFFER_SIZE = 128;

class RLPFProcessor extends AudioWorkletProcessor {
   constructor(options) {
        super();
        this._filter = new Module.RLPF(sampleRate);
        this.buffer = new Float32Array(BUFFER_SIZE);
   }

   static get parameterDescriptors() {
    return [{
        name: 'cutoff',
        defaultValue: 440,
        maxValue:22000
      },{
        name: 'resonance',
        defaultValue: -20
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
     let curCutoff = cutoffP[0]
     let curRes = resonP[0];
      for (let j = 0; j < buf.length; j++) {
          if(cutoffP.length > 1) curCutoff = cutoffP[j];
          if(resonP.length > 1) curRes = resonP[j];
          buf[j] = this._filter.process(in0[j], curCutoff, curRes);
      }
      for (let i = 0; i < out.length; i++)  {
        out[i].set(buf);

      }
      return true;
    }
  }

registerProcessor('rlpf-ems-ps-processor', RLPFProcessor);
