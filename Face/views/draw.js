/*
 * Draws API responses on Canvas
 */
var canvas, context, picture;
$(function() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    picture = document.getElementById("picture");
    $("#picture").attr("src", image);
});

/* Drawing methods */
function drawings(response) {
    var faceRect = response[0].faceRectangle;
    drawImage(picture, 0, 0);
    drawRect(faceRect);
}

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