const BUFFER_SIZE = 128;
class RLPFProcessor extends AudioWorkletProcessor {
  constructor() {
        super();
        this.coefs = new Float32Array(5);// b0, b1, b2, a1, a2
        this.memory = new Float32Array(4);//x1, x2, y1, y2
        this.buffer = new Float32Array(BUFFER_SIZE);
        this.cutoff = 440;
        this.resonance = -20;
        this.updateParameters(this.cutoff, this.resonance);
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

   updateParameters(cutoff, resonance){
    const c = cutoff/(sampleRate/2);
    const g = Math.pow(10.0, -0.05 * resonance);
    const w0 = Math.PI * c;
    const cos_w0 = Math.cos(w0);
    const alpha = 0.5 * Math.sin(w0) * g;
    const a0Inv = 1.0 / (1  + alpha);
    this.coefs[1] = 1.0 - cos_w0; //b1
    this.coefs[0] = 0.5 * this.coefs[1]; //b0
    this.coefs[2] = this.coefs[0]; //b2
    this.coefs[3] = -2.0 * cos_w0; // a1
    this.coefs[4] = 1.0 - alpha; // a2
    this.coefs=this.coefs.map(x => x * a0Inv);
    this.cutoff = cutoff;
    this.resonance = resonance;
   }

  process (inputs, outputs, parameters) {
      const input = inputs[0];
      const out = outputs[0]; 
      if(input.length <= 0) return true;
    
      // using only 1st input channel
      const in0 = input[0];
      const memory = this.memory;
      const buffer = this.buffer;
      const cutoff = parameters.cutoff[0];
      const resonance = parameters.resonance[0];

      if((cutoff != this.cutoff) || (resonance != this.resonance)){
        this.updateParameters(cutoff, resonance);
        console.log("cutoff", cutoff);
        console.log("resonance", resonance);
      }
      const coefs = this.coefs;

      for (let i = 0; i < buffer.length; i++) {
        this.buffer[i] = in0[i] * coefs[0] + 
        coefs[1] * memory[0] + coefs[2] * 
        memory[1] - coefs[3] * memory[2] - coefs[4] * memory[3];

        memory[1] = memory[0];
        memory[3] = memory[2];
        memory[0] = in0[i];
        memory[2] = buffer[i];
      }

      for (let i = 0; i < out.length; i++)  {
        out[i].set(buffer);

      }
      return true;
    }
  }
  
registerProcessor('rlpf-js-processor', RLPFProcessor);