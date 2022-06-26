emcc -lembind -o sine-ems-buf-processor.js sineosc.cpp -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1  -s ENVIRONMENT="shell" --post-js sine-ems-buf.js
