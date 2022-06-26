#include <string>
#include <math.h>
#include <emscripten/bind.h>
#define BUFFER_SIZE 128

class RLPF {
  public:
    RLPF(float sampleRate):mSampleRate(sampleRate)
    {
      memset(mCoefs, 0, sizeof(mCoefs));
      memset(mMemory, 0, sizeof(mMemory));
    }

    void updateCoefs(double cutoff, double resonance){
      double c = cutoff/(mSampleRate/2);
      double g = pow(10.0, -0.05 * resonance);
      double w0 = M_PI * c;
      double cos_w0 = cos(w0);
      double alpha = 0.5 * sin(w0) * g;
      double a0Inv = 1.0 / (1  + alpha);
      mCoefs[1] = 1.0 - cos_w0; //b1
      mCoefs[0] = 0.5 * mCoefs[1]; //b0
      mCoefs[2] = mCoefs[0]; //b2
      mCoefs[3] = -2.0 * cos_w0; // a1
      mCoefs[4] = 1.0 - alpha; // a2
      for(int i = 0; i < 5; i++){
          mCoefs[i] =  mCoefs[i]  * a0Inv;
      }
      mCutoff = cutoff;
      mResonance = resonance;
   }

  void process (uintptr_t input_ptr, uintptr_t output_ptr, float cutoff, float resonance) {
      float* in = reinterpret_cast<float*>(input_ptr);
      float* out = reinterpret_cast<float*>(output_ptr);
      if(cutoff != mCutoff || resonance != mResonance)
          updateCoefs(cutoff, resonance);
      for (int i = 0; i < BUFFER_SIZE; i++) {
          float y = mCoefs[0] * in[i]
            + mCoefs[1] * mMemory[0] 
            + mCoefs[2] * mMemory[1] 
            - mCoefs[3] * mMemory[2] 
            - mCoefs[4] * mMemory[3];

            mMemory[1] = mMemory[0];
            mMemory[3] = mMemory[2];
            mMemory[0] =  in[i];
            mMemory[2] = y;
            out[i] = y;
      }
  }



private:
 double mCoefs[5];
 double mMemory[4];
 double mSampleRate;
 double mCutoff{0};
 double mResonance{0};

};

// Binding code
EMSCRIPTEN_BINDINGS(rlpf) {
  emscripten::class_<RLPF>("RLPF")
    .constructor<float>()
    .function("process", &RLPF::process);
}


