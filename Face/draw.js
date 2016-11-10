/*
 * Draws API responses on Canvas
 */
var canvas, context;
$(function() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
});

function drawImage(picture, x, y) {
    context.drawImage(picture, x, y);
}

function drawRect(rect) {
    context.beginPath();
    context.rect(rect.top, rect.left, rect.width, rect.height);
    context.lineWidth = 3;
    context.strokeStyle = 'green';
    context.stroke();
}