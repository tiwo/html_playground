'use strict';

// get the buttons:
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const downloadButton = document.getElementById('downloadButton');
const playButton = document.getElementById('playButton');
const overlayDiv = document.getElementById('overlay');
const overlayVid = document.querySelector('#overlay > video');
stopButton.disabled = true;
downloadButton.disabled = true;
playButton.disabled = true;
overlayDiv.hidden = true;

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
    playButton.disabled = true;
    stopButton.disabled = false;

    while (chunks.pop()); // empty the "chunks" array

    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = ev => {
        console.log('recorder.ondataavailable', chunks.length, ev);
        chunks.push(ev.data)
        downloadButton.disabled = false;
        playButton.disabled = false;
    };
    recorder.start(3000);
}



stopButton.onclick = () => {
    stopButton.disabled = true;
    startButton.disabled = false;

    recorder.stop();
}

const fullBlobUrl = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    return URL.createObjectURL(blob);
}

downloadButton.onclick = () => {

    const link = document.createElement('a');
    link.href = fullBlobUrl();
    link.download = "test.webm";
    link.click()
};

playButton.onclick = () => {
    overlayDiv.hidden = false;

    overlayVid.src = fullBlobUrl();
    overlayVid.controls = true;
}

overlayVid.onended = () => {
    overlayDiv.hidden = true;
}





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