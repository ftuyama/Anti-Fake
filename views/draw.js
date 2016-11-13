/*
 * Draws API responses on Canvas
 */
var canvas, context, picture;
var x_scale, y_scale;

$(function() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    picture = document.getElementById("picture");
});

/* Setting image */
function setImage(image, upload) {
    imageUrl = image;
    $("#picture").attr("src", image);
    $("#original").attr("src", image);
    if (!upload) $('#url').val(image);
    drawImage(picture, 0, 0);
}

/* Drawing methods */
function drawings(response) {
    x_scale = picture.clientWidth / original.clientWidth;
    y_scale = picture.clientHeight / original.clientHeight;
    drawImage(picture, 0, 0);
    drawRect(response[0].faceRectangle);
}

function drawImage(image, x, y) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, x, y, picture.clientWidth, picture.clientHeight);
}

function drawRect(rect) {
    context.beginPath();
    context.rect(
        rect.left * x_scale, rect.top * y_scale,
        rect.width * y_scale, rect.height * x_scale
    );
    context.lineWidth = 3;
    context.strokeStyle = 'green';
    context.stroke();
}