const MAX_OSCS = 10000;
const context = new AudioContext();

let button = document.getElementById("start");
let select = document.getElementById("worklet");
let refOsc;
let noise;
let intervalID;
let filters = [];
let wasm;

const makeFilter = function(context, gain, workletType){
    const freq = 50 + (Math.random() * 1000);
    let node;
    if (workletType === "native"){
        node = context.createBiquadFilter()
        node.type = 'lowpass';
        node.frequency.setValueAtTime(freq, context.currentTime);
    }
    else{
        node = new AudioWorkletNode(context, workletType);
        if(workletType.indexOf("asc") >= 0){
            node.port.start();
            node.port.postMessage(wasm);
        }
        const freqParam = node.parameters.get('cutoff');
        const res = node.parameters.get('resonance');
        freqParam.value = freq;
        res.value = 1.0;
    }
    noise.connect(node).connect(gain);
    return node;
}

const runTest = function(context, workletType){

    //TODO: use a worklet! :S
    var bufferSize = 2048;
    noise = context.createScriptProcessor(bufferSize, 1, 1);
    noise.onaudioprocess = (e) => {
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            output[i] = 0.5* (Math.random() * 2 - 1);
        }
    }

            
    refOsc = context.createOscillator();
    refOsc.type = 'sine';
    refOsc.frequency.setValueAtTime(200, context.currentTime); 
    refOsc.connect(context.destination);
    refOsc.start();

    const gain = context.createGain();
    const numNodes = document.getElementById("num-nodes");
    const maxNodes = document.getElementById("max-nodes");
    const interval = document.getElementById("interval");

    gain.gain.setValueAtTime(0.000001, context.currentTime);
    gain.connect(context.destination);

    intervalID = setInterval(()=>{
        filters.push(makeFilter(context, gain, workletType))
        numNodes.value = filters.length;
        console.log(maxNodes.value);
        console.log(filters.length);
        if(filters.length >= maxNodes.value) clearInterval(intervalID);
    }, interval);
}

document.getElementById("run").onchange = async (e) => {
    if(e.target.checked){
        await context.resume();
        let workletFile = select.value;
        let workletType;
        if(workletFile !== "native"){
            workletType = workletFile.split("/")[1].split(".")[0];
            await context.audioWorklet.addModule(workletFile);    
            if(workletType.indexOf("asc") >= 0){
                let path = workletFile.split("/")[0]+"/build/rlpf.wasm";
                wasm = await fetch(path);
                wasm = await wasm.arrayBuffer();
                console.log(wasm);
            }
        }
        else workletType = workletFile;
        runTest(context, workletType);
    } else {
        clearInterval(intervalID);
        if(refOsc)refOsc.disconnect(context.destination);
    }
};
