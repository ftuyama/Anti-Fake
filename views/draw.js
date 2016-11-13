/*
 * Draws API responses on Canvas
 */
var drawer = new Canvas();

function Canvas() {
    // HTML Objects
    var canvas, context, picture;
    // Canvas properties
    var x_scale, y_scale;

    /* Initializes Canvas Object */
    this.init = function() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');
        picture = document.getElementById("picture");

        // Add event listener for canvas click events.
        canvas.addEventListener('click', function(event) {
            var x = event.pageX - canvas.offsetLeft,
                y = event.pageY - canvas.offsetTop;
            selFace = closestFace(x, y);
        }, false);
    }

    /* Setting image */
    this.setImage = function(image, upload) {
        imageUrl = image;
        $("#picture").attr("src", image);
        $("#original").attr("src", image);
        if (!upload) $('#url').val(image);
        drawImage(picture, 0, 0);
    }

    /* Drawing methods */
    this.drawings = function(faces) {
        x_scale = picture.clientWidth / original.clientWidth;
        y_scale = picture.clientHeight / original.clientHeight;
        drawImage(picture, 0, 0);
        faces.forEach(function(face) {
            drawRect(face.faceRectangle, face == selFace);
        });
    }

    /* Drawing image on Canvas */
    drawImage = function(image, x, y) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, x, y, picture.clientWidth, picture.clientHeight);
    }

    /* Drawing Rect on canvas */
    drawRect = function(rect, selected) {
        context.beginPath();
        context.rect(
            rect.left * x_scale, rect.top * y_scale,
            rect.width * x_scale, rect.height * y_scale
        );
        context.lineWidth = 3;
        context.strokeStyle = (selected) ? 'red' : 'green';
        context.stroke();
    }

    /* Returns closest face */
    closestFace = function(x, y) {
        var min_dist = 100000,
            min_face = faces[0];
        faces.forEach(function(face) {
            var rect = face.faceRectangle;
            var distance = Math.dist(x, y,
                (rect.left + rect.width / 2) * x_scale,
                (rect.top + rect.top / 2) * y_scale);
            if (distance < min_dist)
                min_face = face, min_dist = distance;
        });
        drawRect(selFace.faceRectangle, false);
        drawRect(min_face.faceRectangle, true);
        return min_face;
    }
}