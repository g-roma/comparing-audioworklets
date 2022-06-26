emcc -lembind -o rlpf-ems-ps-processor.js rlpf.cpp -s BINARYEN_ASYNC_COMPILATION=0 -s SINGLE_FILE=1  -s ENVIRONMENT="shell" --post-js rlpf-ems-ps.js
