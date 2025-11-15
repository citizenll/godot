/**************************************************************************/
/*  audio.worker.js                                                       */
/**************************************************************************/
/*                         This file is part of:                          */
/*                             GODOT ENGINE                               */
/*                        https://godotengine.org                         */
/**************************************************************************/
/* Copyright (c) 2014-present Godot Engine contributors (see AUTHORS.md). */
/* Copyright (c) 2007-2014 Juan Linietsky, Ariel Manzur.                  */
/*                                                                        */
/* Permission is hereby granted, free of charge, to any person obtaining  */
/* a copy of this software and associated documentation files (the        */
/* "Software"), to deal in the Software without restriction, including    */
/* without limitation the rights to use, copy, modify, merge, publish,    */
/* distribute, sublicense, and/or sell copies of the Software, and to     */
/* permit persons to whom the Software is furnished to do so, subject to  */
/* the following conditions:                                              */
/*                                                                        */
/* The above copyright notice and this permission notice shall be         */
/* included in all copies or substantial portions of the Software.        */
/*                                                                        */
/* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,        */
/* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF     */
/* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. */
/* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY   */
/* CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,   */
/* TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE      */
/* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                 */
/**************************************************************************/

/**
 * WeChat Mini Game Worker for async audio buffer management.
 *
 * Design pattern: Triple-buffering to prevent audio glitches
 *
 * Problem: onaudioprocess is synchronous - if processing takes too long, audio stutters
 * Solution: Worker maintains a pool of pre-filled buffers
 *
 * Flow:
 * 1. Worker pre-fills 3 buffers on startup
 * 2. onaudioprocess grabs next ready buffer (instant, non-blocking)
 * 3. Main thread sends empty buffer back to Worker
 * 4. Worker fills it asynchronously (doesn't block audio playback)
 * 5. Buffer goes back to ready pool
 *
 * This decouples audio timing from processing time!
 */

// Configuration
const BUFFER_POOL_SIZE = 3;  // Triple buffering
let channels = 2;
let frameCount = 0;

// Buffer management
let readyBuffers = [];  // Filled buffers ready to be consumed
let processingQueue = [];  // Empty buffers waiting to be filled


worker.onMessage(function (event) {
    const cmd = event.cmd;
    const data = event.data;

    switch (cmd) {

        case 'init':
            channels = data.channels || 2;
            frameCount = data.frameCount;

            // Create cached silent buffer
            if (!self.silentBuffer) {
                self.silentBuffer = createEmptyBuffer();
            }

            // Signal ready immediately
            // Pre-filling will happen when main thread sends 'start_prefill' after setup
            worker.postMessage({
                cmd: 'ready',
                data: { channels, frameCount }
            });
            break;

        case 'start_prefill':
            // Main thread is ready to receive execute_process messages
            // Now pre-fill buffer pool
            for (let i = 0; i < BUFFER_POOL_SIZE; i++) {
                fillNextBuffer();
            }
            break;

        case 'request_buffer':
            // Main thread needs audio data
            if (readyBuffers.length > 0) {
                // Send a ready buffer immediately
                const buffer = readyBuffers.shift();
                worker.postMessage({
                    cmd: 'buffer',
                    data: buffer
                });
            } else {
                // No buffer ready - send silence and warn
                // Use cached silent buffer
                worker.postMessage({
                    cmd: 'buffer',
                    data: self.silentBuffer || createEmptyBuffer()
                });
                // Immediately fill a buffer for next time
                fillNextBuffer();
            }
            break;

        case 'return_input':
            // Main thread returns input data to be processed
            // Add to processing queue
            processingQueue.push(data.input);

            // Process next buffer if available
            fillNextBuffer();
            break;

        case 'process_done':
            // Main thread finished processing, returns output data
            handleProcessDone(data.output);
            break;

        case 'stop':
            readyBuffers = [];
            processingQueue = [];
            worker.postMessage({ cmd: 'stopped' });
            break;

        default:
            break;
    }
});

/**
 * Fill next buffer by requesting main thread to process audio
 */
function fillNextBuffer() {
    // Prepare input data (or null if none available)
    const input = processingQueue.length > 0 ? processingQueue.shift() : null;

    // Request main thread to execute WASM callback
    // Main thread will:
    // 1. Write input to WASM memory
    // 2. Call onprocess()
    // 3. Read output from WASM memory
    // 4. Send back 'process_done' with output
    worker.postMessage({
        cmd: 'execute_process',
        data: {
            input: input
        }
    });
}

/**
 * Called by main thread after WASM processing is done
 */
function handleProcessDone(outputData) {
    // Add processed output to ready pool
    readyBuffers.push(outputData);

    // Continue filling only if:
    // 1. There's input data waiting to be processed, OR
    // 2. Pool is not full AND there's demand (someone requested a buffer)
    // This prevents infinite loop of filling silence
    if (processingQueue.length > 0 && readyBuffers.length < BUFFER_POOL_SIZE) {
        fillNextBuffer();
    }
}

function createEmptyBuffer() {
    const buffer = new Array(channels);
    for (let ch = 0; ch < channels; ch++) {
        buffer[ch] = new Float32Array(frameCount);
    }
    return buffer;
}