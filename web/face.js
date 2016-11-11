/*
 * Application View Controller
 */
var image = "https://instagram.fsjk1-1.fna.fbcdn.net/t51.2885-15/e35/13687367_608310479350599_763014570_n.jpg?ig_cache_key=MTMyMzM4NzgyNjE3OTUwOTcyMg%3D%3D.2";

$(function() {
    /* Request Microsoft API */
    detect(image, {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
    }).then(function(response) {
        $("#face_reponse").html(syntaxHighlight(response));
        if (response.length == 1)
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
                display(JSON.parse(response));
            }).catch(function(error) {
                error = error ? error : 'Erro da API';
                $("#insta_reponse").html(syntaxHighlight(error));
            });
    });

    /* Request AI */
    $('#evaluate').click(function() {
        var [similar, evaluation] = evaluate(pics);
        $("#evaluation").html("<h4>As fotos pertecem a <b>" + name + "</b> com confiabilidade " + evaluation + "</h4>");
        if (evaluation > 0.5)
            $("#status").attr("src", "img/right.png");
        else $("#status").attr("src", "img/wrong.png");
        $("#face_reponse").html(syntaxHighlight(similar));
    });
});