/*
 * Application View Controller
 */
var selFace, faces, imageUrl = "https://instagram.fsjk1-1.fna.fbcdn.net/t51.2885-15/e35/13687367_608310479350599_763014570_n.jpg?ig_cache_key=MTMyMzM4NzgyNjE3OTUwOTcyMg%3D%3D.2";

$(function() {
    drawer.init();
    drawer.setImage(imageUrl, false);
    detection(imageUrl, false, false);

    /* Request Microsoft API */
    function detection(image, upload, details) {
        detect(image, upload, {
            "returnFaceId": "true",
            "returnFaceLandmarks": details,
            "returnFaceAttributes": "age,gender,smile,facialHair,glasses"
        }).then(function(response) {
            $("#face_reponse").html(syntaxHighlight(response));
            if (response.length > 0) {
                faces = response, selFace = faces[0];
                drawer.drawings(faces);
            }
            loaderStop();
        }).catch(function(error) {
            error = error ? error : 'Erro da API';
            $("#face_reponse").html(syntaxHighlight(error));
            loaderStop();
        });
    }

    /* Upload new picture */
    $("#upload").change(function() {
        loaderStart();
        var input = document.getElementById("upload");
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function() {
                drawer.setImage(reader.result, true);
                detection(reader.result, true, false);
            };
            reader.readAsDataURL(input.files[0]);
        }
    });

    /* Update picture Url */
    $('#url').on('input', function() {
        drawer.setImage($('#url').val(), false);
    });

    /* Request Instagram API */
    $('#query').on('input', function() {
        query($('#query').val())
            .then(function(response) {
                display(JSON.parse(response));
            }).catch(function(error) {
                error = error ? error : 'Erro da API';
                $("#insta_reponse").html(syntaxHighlight(error));
            });
    });

    /* Request AI */
    $('#evaluate').click(function() {
        loaderStart();
        $(this).prop("disabled", true);
        setTimeout(function() {
            $('#evaluate').prop("disabled", false);
        }, 26000);
        evaluate(selFace, pics).then(function(response) {
            [similar, evaluation] = response;
            $("#evaluation").html((similar.length == 0) ? "<h4>Comparação inválida</h4>" :
                "<h4><b>" + name + "</b> com confiabilidade de " + evaluation + " %</h4>"
            );
            $("#status").attr("src", (evaluation > 50.0) ? "img/right.png" : "img/wrong.png");
            $("#face_reponse").html(syntaxHighlight(similar));
            window.scrollTo(0, 0);
            loaderStop();
        }).catch(function(error) {
            $("#face_reponse").html(syntaxHighlight(error));
            window.scrollTo(0, 0);
            loaderStop();
        });
    });

    /* Request Details */
    $('#details').click(function() {
        detection(imageUrl, false, true);
    });
});