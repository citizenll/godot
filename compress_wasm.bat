@echo off
setlocal

if not exist ".\bin\.web_zip\godot.wasm" (
    echo Missing .\bin\.web_zip\godot.wasm
    exit /b 1
)

del /F ".\bin\.web_zip\godot.wasm.br" >NUL 2>NUL
brotli.exe ".\bin\.web_zip\godot.wasm"
node ".\godot_process.js"
