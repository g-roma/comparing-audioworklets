Comparing approaches for new AudioWorklets
==========================================
This repository contains the code for comparing different ways to create audioworklets: using JavaScript or WebAssembly compoiled from C++ or AssemblyScript. For WebAssembly, using one call per sample or one call per audio buffer.

Requirements
============
[emcc](https://emscripten.org/docs/tools_reference/emcc.html) for the C++ examples, [asc](https://www.assemblyscript.org/compiler.html) (install usung npm) for the AssembyScript examples.
Note: the tests were run on Firefox 99 and Chrome 100. Current Chrome seems to have limited the number of WebAssembly.Memory instances you can create, so the test does not work any more...

How to use
==========
Install the requirements and build each of the WASM audioworklets using the code in build.sh in each folder. Use a web server such as http-server. The test_xxx.html files can be used to check that the different worklets are working. The eval_xxx.html files are used to compare performance. Enter a target number of AudioWorkles and press "run". For high numbers, the audio starts glitching or stops altogether.





