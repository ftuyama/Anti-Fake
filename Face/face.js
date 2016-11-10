$(function() {
    var image = "https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAkEAAAAJGI4Mjg0NTJmLTdmNzItNDRlYi05OTNlLTk3NTNlNjFkNjQ2NQ.jpg";

    /* Requesting methods */
    detect(image, {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
    }).then(function(response) {
        $("#face_reponse").html(syntaxHighlight(response));

        /* Drawing methods */
        var picture = document.getElementById("picture");
        $("#picture").attr("src", image);

        var faceRect = response[0].faceRectangle;
        drawImage(picture, 0, 0);
        drawRect(faceRect);

    }).then(function(error) {
        $("#face_reponse").html(syntaxHighlight(response));
    });
});