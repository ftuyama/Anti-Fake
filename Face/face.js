/*
 * Application View Controller
 */
var image = "https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAkEAAAAJGI4Mjg0NTJmLTdmNzItNDRlYi05OTNlLTk3NTNlNjFkNjQ2NQ.jpg";

$(function() {
    /* Request Microsoft API */
    detect(image, {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
    }).then(function(response) {
        $("#face_reponse").html(syntaxHighlight(response));
        drawings(response);
    }).catch(function(error) {
        error = error ? error : 'Erro da API';
        $("#face_reponse").html(syntaxHighlight(error));
    });

    /* Request Instagram API */
    $('#query').on('input', function() {
        query($('#query').val())
            .then(function(response) {
                $("#insta_reponse").html(syntaxHighlight(response));
                display(response);
            }).catch(function(error) {
                error = error ? error : 'Erro da API';
                $("#insta_reponse").html(syntaxHighlight(error));
            });
    });
});