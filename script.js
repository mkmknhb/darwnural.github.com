// script.js
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const clearButton = document.getElementById('clearButton');
    const recognizeButton = document.getElementById('recognizeButton');
    const resultDiv = document.getElementById('result');

    let model;

    async function loadModel() {
        model = await tf.loadLayersModel('models/model.json');
    }

    loadModel();

    clearButton.addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        resultDiv.innerText = '';
    });

    recognizeButton.addEventListener('click', function () {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const tensor = tf.browser.fromPixels(imageData, 1)
            .resizeBilinear([28, 28])
            .reshape([1, 28, 28, 1])
            .toFloat()
            .div(tf.scalar(255));

        const prediction = model.predict(tensor);
        const result = prediction.argMax(1).dataSync()[0];
        resultDiv.innerText = `Predicted digit: ${result}`;
    });

    let isDrawing = false;
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        draw(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, false);
    });
    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            draw(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, true);
        }
    });
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });
    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });

    function draw(x, y, isDown) {
        if (isDown) {
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 10;
            ctx.lineJoin = 'round';
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }
        lastX = x; lastY = y;
    }
});
