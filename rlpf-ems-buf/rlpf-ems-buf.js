const BYTES_PER_SAMPLE = 4;
const BUFFER_SIZE = 128;

class RLPFProcessor extends AudioWorkletProcessor {
   constructor(options) {
        super();
        this._filter = new Module.RLPF(sampleRate);
        this._inputPointer =  Module._malloc(BUFFER_SIZE * BYTES_PER_SAMPLE);
        this._outputPointer =  Module._malloc(BUFFER_SIZE * BYTES_PER_SAMPLE);
        this.inputBuffer = new Float32Array(
          Module.asm.memory.buffer, 
          this._inputPointer, 
          BUFFER_SIZE
        )
        this.outputBuffer = new Float32Array(
          Module.asm.memory.buffer, 
          this._outputPointer, 
          BUFFER_SIZE
        )
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
     const input = inputs[0];
     const out = outputs[0];
     if(input.length <= 0) return true;
     // using only 1st input channel
     const in0 = input[0];
     this.inputBuffer.set(in0);
     const cutoff = parameters.cutoff[0];
     const reson = parameters.resonance[0];
     this._filter.process(this._inputPointer, this._outputPointer, cutoff, reson);
     for (let i = 0; i < out.length; i++)  {
      out[i].set(this.outputBuffer);
    }
      return true;
    }
  }

registerProcessor('rlpf-ems-buf-processor', RLPFProcessor);
