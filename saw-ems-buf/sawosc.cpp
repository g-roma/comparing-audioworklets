#include <string>
#include <math.h>
#include <emscripten/bind.h>

#define BUFFER_SIZE 128

class SawOsc {
  public:
    SawOsc(float sampleRate):mSampleRate(sampleRate){}

    float polyBlep(float t, float dt){
      if (t < dt) {
        t /= dt;
        return t + t - t * t - 1.0;
      }
      else if (t > 1.0 - dt) {
        t = (t - 1.0) / dt;
        return t * t + t + t + 1.0;
      }
      else return 0;
   }

  void process (uintptr_t output_ptr, float freq) {
      float* out = reinterpret_cast<float*>(output_ptr);
      if (freq != mFreq){
          mIncr = freq / mSampleRate;
          freq = mFreq;
      }
      for (int i = 0; i < BUFFER_SIZE; i++) {
        out[i] =  (2 * mPhase - 1) - polyBlep(mPhase, mIncr);
        mPhase = fmod(mPhase + mIncr,  1.0);
      }
  }

private:
  float mPhase{0};
  float mFreq{0};
  float mSampleRate{0};
  float mIncr{0};
};

// Binding code
EMSCRIPTEN_BINDINGS(SawOsc) {
  emscripten::class_<SawOsc>("SawOsc")
    .constructor<double>()
    .function("process", &SawOsc::process, emscripten::allow_raw_pointers());
}
