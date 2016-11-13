/*
 * Application View Controller
 */
var imageId, imageUrl = "https://instagram.fsjk1-1.fna.fbcdn.net/t51.2885-15/e35/13687367_608310479350599_763014570_n.jpg?ig_cache_key=MTMyMzM4NzgyNjE3OTUwOTcyMg%3D%3D.2";

$(function() {
    detection(imageUrl, false, false);
    setImage(imageUrl, false);

    /* Request Microsoft API */
    function detection(image, upload, details) {
        detect(image, upload, {
            "returnFaceId": "true",
            "returnFaceLandmarks": details,
            "returnFaceAttributes": "age,gender,smile,facialHair,glasses"
        }).then(function(response) {
            $("#face_reponse").html(syntaxHighlight(response));
            if (response.length == 1) {
                drawings(response);
                imageId = response[0].faceId;
            }
        }).catch(function(error) {
            error = error ? error : 'Erro da API';
            $("#face_reponse").html(syntaxHighlight(error));
        });
    }

    /* Upload new picture */
    $("#upload").change(function() {
        var input = document.getElementById("upload");
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function() {
                setImage(reader.result, true);
                detection(reader.result, true, false);
            };
            reader.readAsDataURL(input.files[0]);
        }
    });

    /* Update picture Url */
    $('#url').on('input', function() {
        setImage($('#url').val(), false);
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
        $(this).prop("disabled", true);
        setTimeout(function() {
            $('#evaluate').prop("disabled", false);
        }, 26000);
        evaluate(imageId, pics).then(function(response) {
            [similar, evaluation] = response;
            $("#evaluation").html((similar.length == 0) ? "<h4>Comparação inválida</h4>" :
                "<h4><b>" + name + "</b> com confiabilidade de " + evaluation + " %</h4>"
            );
            $("#status").attr("src", (evaluation > 0.5) ? "img/right.png" : "img/wrong.png");
            $("#face_reponse").html(syntaxHighlight(similar));
            window.scrollTo(0, 0);
        }).catch(function(error) {
            $("#face_reponse").html(syntaxHighlight(error));
            window.scrollTo(0, 0);
        });
    });

    /* Request Details */
    $('#details').click(function() {
        detection(imageUrl, false, true);
    });
});