'use strict';

// get the buttons:
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const downloadButton = document.getElementById('downloadButton');
stopButton.disabled = true;
downloadButton.disabled = true;

// access drawing canvas:
const vga = document.getElementById('vga');
const ctx = vga.getContext('2d');
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, vga.width, vga.height);

// set up video streaming to blobs:
const stream = vga.captureStream();
let recorder = null;
const chunks = [];

startButton.onclick = () => {
    downloadButton.disabled = true;
    stopButton.disabled = false;

    while (chunks.pop()); // empty the "chunks" array

    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = ev => {
        console.log('recorder.ondataavailable', ev);
        chunks.push(ev.data)
        downloadButton.disabled = false;
    };
    recorder.start(3000);

}

stopButton.onclick = () => {
    stopButton.disabled = true;
    startButton.disabled = false;

    recorder.stop();
}

downloadButton.onclick = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob)
    console.log(blob, url);

    const link = document.createElement('a');
    link.href = url;
    link.download = "test.webm";
    link.click()
};





let x = Math.floor(.5 * vga.width);
let y = Math.floor(.5 * vga.height);
let k = 0;

window.setInterval(() => {

    // now just demo moving things:

    ////// "elevator" rectangle
    ctx.fillStyle = (k >= 32) ? '#00F' : '#0F0';
    ctx.fillRect(10, (k % 32) + 10, 32, 1);

    ////// brownian motion, with fading trace:
    x += Math.floor(3 * Math.random() - 1);
    y += Math.floor(3 * Math.random() - 1);
    k += 1;

    // paint cursor:
    ctx.fillStyle = '#FF0';
    ctx.fillRect(x, y, 1, 1);

    if (k >= 64) {
        k = 0;

        // reset cursor if out of bounds:
        if (x < 0 || y < 0 || x >= vga.width || y >= vga.width) {
            x = Math.floor(.5 * vga.width)
            y = Math.floor(.5 * vga.height)
        }

        // fade to black:
        ctx.fillStyle = '#00000008';
        ctx.fillRect(0, 0, vga.width, vga.height);
    }
}, 1);