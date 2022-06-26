import { scopeAnalyzer, fftAnalyzer, drawScope, drawFreq, initAnalyzers } from './analyzers.js';

const context = new AudioContext();
initAnalyzers(context);
const select = document.getElementById("worklet");
let workletNode;


document.getElementById("test").onchange = async (e) => {
    if(e.target.checked){
        await context.resume();
        let workletFile = select.value;
        let workleType = workletFile.split("/")[1].split(".")[0];
        console.log(workletFile);
        await context.audioWorklet.addModule(workletFile);
        workletNode = new AudioWorkletNode(context, workleType);
        if(workleType.indexOf("asc") >= 0){
            let path = workletFile.split("/")[0]+"/build/sawosc.wasm";
            let wasm = await fetch(path);
            wasm = await wasm.arrayBuffer();
            workletNode.port.start();
            workletNode.port.postMessage(wasm);
        }
        workletNode.connect(context.destination);
        workletNode.connect(scopeAnalyzer);
        workletNode.connect(fftAnalyzer);
        drawScope();
        drawFreq();
    }
    else
    {
        if(workletNode) {
          workletNode.disconnect(context.destination);
          workletNode.disconnect(scopeAnalyzer);
          workletNode.disconnect(fftAnalyzer);
        }
        context.suspend();
    }

};

document.getElementById("frequency").oninput = async (e) => {
    if(workletNode){
        const freqParam = workletNode.parameters.get('frequency');
        freqParam.value = parseFloat(e.target.value);
    }
};
