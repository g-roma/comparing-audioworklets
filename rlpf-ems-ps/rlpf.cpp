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

   

  float process (float input, float cutoff, float resonance) {
      if(cutoff!=mCutoff || resonance != mResonance)
        updateCoefs(cutoff, resonance);
      
      double y = mCoefs[0] * input 
        + mCoefs[1] * mMemory[0] 
        + mCoefs[2] * mMemory[1] 
        - mCoefs[3] * mMemory[2] 
        - mCoefs[4] * mMemory[3];

        mMemory[1] = mMemory[0];
        mMemory[3] = mMemory[2];
        mMemory[0] = input;
        mMemory[2] = y;
        return y;
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


