emcc -lembind -o saw-ems-ps-processor.js sawosc.cpp -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1  -s ENVIRONMENT="shell" --post-js saw-ems-ps.js
