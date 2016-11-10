var FACE_API_URL = "https://api.projectoxford.ai/face/v1.0/detect?";
var SUBSCRIPTION_KEY = "79d40fa92b1140f28b4401858b34c877";

function detect(image, params) {
    return new Promise(function(resolve, reject) {
        resolve([{
            "faceId": "ec974c0d-1cf2-4d0c-8efb-e22f9be64742",
            "faceRectangle": {
                "top": 64,
                "left": 82,
                "width": 86,
                "height": 86
            }
        }]);

        $.ajax({
                // Request params
                url: FACE_API_URL + $.param(params),
                beforeSend: function(xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY);
                },
                type: "POST",
                // Request body
                data: JSON.stringify({
                    "url": image
                }),
            })
            .done(function(data) {
                resolve(data);
            })
            .fail(function(error) {
                reject(error);
            });
    });
}