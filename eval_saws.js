const MAX_OSCS = 10000;
const context = new AudioContext();

let button = document.getElementById("start");
let select = document.getElementById("worklet");
let refOsc;
let intervalID;
let oscs = [];
let wasm;

const makeOsc = function(context, gain, osc_type){
    const freq = 50 + Math.random() * 10000;
    let workletFile = select.value;
    let osc = new AudioWorkletNode(context, osc_type);
    if(osc_type.indexOf("asc") >= 0){
            osc.port.start();
            osc.port.postMessage(wasm);
    }
    const freqParam = osc.parameters.get('frequency');
    freqParam.value = freq;

    osc.connect(gain);
    return osc;
}

const runTest = function(context, osc_type){

    refOsc = context.createOscillator();
    refOsc.type = 'sine';
    refOsc.frequency.setValueAtTime(200, context.currentTime);
    refOsc.connect(context.destination);
    refOsc.start();

    const gain = context.createGain();
    const numOscs = document.getElementById("num-oscs");
    const maxOscs = document.getElementById("max-oscs");
    const interval = document.getElementById("interval");

    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.connect(context.destination);

    intervalID = setInterval(()=>{
        oscs.push(makeOsc(context, gain, osc_type))
        numOscs.value = oscs.length;
        console.log(maxOscs.value);
        console.log(oscs.length);
        if(oscs.length >= maxOscs.value) clearInterval(intervalID);
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
                let path = workletFile.split("/")[0]+"/build/sawosc.wasm";
                wasm = await fetch(path);
                wasm = await wasm.arrayBuffer();
            }
        }
        else workletType = workletFile;
        runTest(context, workletType);
    } else {
        clearInterval(intervalID);
        if(refOsc)refOsc.disconnect(context.destination);
    }
};
