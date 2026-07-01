#!/bin/sh
set -eu

if [ ! -f ./bin/.web_zip/godot.wasm ]; then
  echo "Missing ./bin/.web_zip/godot.wasm" >&2
  exit 1
fi

rm -f ./bin/.web_zip/godot.wasm.br
brotli ./bin/.web_zip/godot.wasm
node ./godot_process.js
