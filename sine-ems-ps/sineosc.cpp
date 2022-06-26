#include <string>
#include <math.h>
#include <emscripten/bind.h>
#define BUFFER_SIZE 128

class SineOsc {
  public:
    SineOsc(float sampleRate)
    {
       mHz2Rps = 2 * M_PI / sampleRate;
    }

  float process (float freq) {
    float result = sin (mPhase);
    if (freq != mFreq){
        mIncrement = freq * mHz2Rps;
        freq = mFreq;
    }
    mPhase = fmod(mPhase + mIncrement,  2 * M_PI);
    return result;
  }

private:
 double mHz2Rps;
 double mPhase{0};
 double mFreq{0};
 double mIncrement{0};
};

// Binding code
EMSCRIPTEN_BINDINGS(sineosc) {
  emscripten::class_<SineOsc>("SineOsc")
    .constructor<float>()
    .function("process", &SineOsc::process);
}


