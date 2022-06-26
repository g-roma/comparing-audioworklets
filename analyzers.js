export let scopeAnalyzer, fftAnalyzer;
let scopeCanvas = document.querySelector('#scope');
let scopeCtx = scopeCanvas.getContext("2d");
const WIDTH = scopeCanvas.width;
const HEIGHT = scopeCanvas.height;

let freqCanvas = document.querySelector('#freq-scope');
let freqCtx = freqCanvas.getContext("2d");

let scopeArray, freqArray, scopeSize, freqSize;

export const initAnalyzers = (context) => {
  scopeAnalyzer = context.createAnalyser();
  fftAnalyzer = context.createAnalyser();
  scopeAnalyzer.fftSize = 2048;
  fftAnalyzer.fftSize = 4096;
  scopeSize = scopeAnalyzer.frequencyBinCount;
  scopeArray = new Uint8Array(scopeSize);
  freqSize = fftAnalyzer.frequencyBinCount;
  freqArray = new Uint8Array(freqSize);
  scopeCtx.clearRect(0, 0, WIDTH, HEIGHT);
  freqCtx.clearRect(0, 0, WIDTH, HEIGHT);

}

export const drawScope = ()=>{
  requestAnimationFrame(drawScope);
  //let scopeCtx = scopeCanvas.getContext("2d");
  scopeAnalyzer.getByteTimeDomainData(scopeArray);
  scopeCtx.fillStyle = 'rgb(0, 0, 0)';
  scopeCtx.fillRect(0, 0, WIDTH, HEIGHT);
  scopeCtx.lineWidth = 2;
  scopeCtx.strokeStyle = 'white';
  scopeCtx.beginPath();
  var sliceWidth = WIDTH * 1.0 / scopeSize;
  var x = 0;
  for(var i = 0; i < scopeSize; i++) {
      var v = scopeArray[i] / 128.0;
      var y = v * HEIGHT/2;
      if(i === 0) {
         scopeCtx.moveTo(x, y);
       } else {
         scopeCtx.lineTo(x, y);
       }
       x += sliceWidth;
     }
     scopeCtx.lineTo(WIDTH, HEIGHT/2);
  scopeCtx.stroke();
};


export const drawFreq = () =>{
     requestAnimationFrame(drawFreq);
     fftAnalyzer.getByteFrequencyData(freqArray);
     freqCtx.fillStyle = 'rgb(0, 0, 0)';
     freqCtx.fillRect(0, 0, WIDTH, HEIGHT);
     var barWidth = (WIDTH / freqSize) * 2.5;
     var barHeight;
     var x = 0;
     for(var i = 0; i < freqSize; i++) {
       barHeight = freqArray[i]/2;
       freqCtx.fillStyle = 'white';
       freqCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);
       x += barWidth + 1;
     }
};
