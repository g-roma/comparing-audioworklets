emcc -lembind -o saw-ems-buf-processor.js sawosc.cpp -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1  -s ENVIRONMENT="shell" --post-js saw-ems-buf.js
