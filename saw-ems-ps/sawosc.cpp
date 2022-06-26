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

  float process(float freq) {
    float result =  (2 * mPhase - 1) - polyBlep(mPhase, mIncr);
    if (freq != mFreq){
        mIncr = freq / mSampleRate;
        freq = mFreq;
    }
    mPhase = fmod(mPhase + mIncr,  1.0);
    return result;
  }

private:
 float mPhase{0};
 float mFreq{0};
 float mSampleRate{0};
 float mIncr{0};

};

// Binding code
EMSCRIPTEN_BINDINGS(sawosc) {
  emscripten::class_<SawOsc>("SawOsc")
    .constructor<float>()
    .function("process", &SawOsc::process);
}
