#include <string>
#include <math.h>
#include <emscripten/bind.h>

#define BUFFER_SIZE 128

class SineOsc {
public:
  SineOsc(double sampleRate)
  {
      mTwoPiOverSR = 2 * M_PI / sampleRate;
  }

  void setFrequency(double freq) {
      mFreq = freq;
  }

  void process (uintptr_t output_ptr, double freq) {
        float* out = reinterpret_cast<float*>(output_ptr);
        if (freq != mFreq){
            mIncrement = freq * mTwoPiOverSR;
            freq = mFreq;
        }
        for (int i = 0; i < BUFFER_SIZE; i++) {
          out[i] = sin (mPhase);
          mPhase = fmod(mPhase + mIncrement,  2 * M_PI);
        }
  }


private:
 double mTwoPiOverSR;
 double mPhase{0};
 double mFreq{0};
 double mIncrement{0};
};

// Binding code
EMSCRIPTEN_BINDINGS(sineosc) {
  emscripten::class_<SineOsc>("SineOsc")
    .constructor<double>()
    .function("setFrequency", &SineOsc::setFrequency)
    .function("process", &SineOsc::process, emscripten::allow_raw_pointers());
}