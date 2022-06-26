const context = new AudioContext();
const select = document.getElementById("worklet");
let noiseNode, workletNode;

document.getElementById("test").onchange = async (e) => {
    if(e.target.checked){
        await context.resume();
        //TODO: use a worklet! :S
        var bufferSize = 2048;
        noiseNode = context.createScriptProcessor(bufferSize, 1, 1);
        noiseNode.onaudioprocess = (e) => {
                var output = e.outputBuffer.getChannelData(0);
                for (var i = 0; i < bufferSize; i++) {
                    output[i] = 0.5* (Math.random() * 2 - 1);
                }
        }

        let workletFile = select.value;
        let workleType = workletFile.split("/")[1].split(".")[0];
        await context.audioWorklet.addModule(workletFile);
        workletNode = new AudioWorkletNode(context, workleType);
        if(workleType.indexOf("asc") >= 0){
            let path = workletFile.split("/")[0]+"/build/rlpf.wasm";
            let wasm = await fetch(path);
            wasm = await wasm.arrayBuffer();
            workletNode.port.start();
            workletNode.port.postMessage(wasm);
        }
        noiseNode.connect(workletNode).connect(context.destination);
        //noiseNode.connect(context.destination);
    } 
    else
    {
        if(workletNode) workletNode.disconnect(context.destination);
        context.suspend();
    }
    
};

document.getElementById("cutoff").oninput = async (e) => {
    if(workletNode){
        const cutoffParam = workletNode.parameters.get('cutoff');    
        cutoffParam.value = parseFloat(e.target.value);
    }
};


document.getElementById("resonance").oninput = async (e) => {
    if(workletNode){
        const resonParam = workletNode.parameters.get('resonance');    
        resonParam.value = parseFloat(e.target.value);
    }
};





