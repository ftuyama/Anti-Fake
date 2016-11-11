/*
 * Microsoft API Service
 */
var DETECT_API_URL = "https://api.projectoxford.ai/face/v1.0/detect?";
var SIMILAR_API_URL = "https://api.projectoxford.ai/face/v1.0/findsimilars";
var SUBSCRIPTION_KEY = "79d40fa92b1140f28b4401858b34c877";

/* Detect Microsoft API */
function detect(image, params) {
    return new Promise(function(resolve, reject) {
        if (Mock) {
            resolve([{
                "faceId": "c01b43ec-e04f-4ebc-8d61-5c035605e576",
                "faceRectangle": {
                    "top": 0,
                    "left": 176,
                    "width": 383,
                    "height": 343
                }
            }]);
            return;
        }

        $.ajax({
                url: DETECT_API_URL + $.param(params),
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY);
                },
                type: "POST",
                data: JSON.stringify({ "url": image }),
            })
            .done(function(data) { resolve(data); })
            .fail(function(error) { reject(error); });
    });
}

/* Compare Microsoft API */
function compare(params) {
    return new Promise(function(resolve, reject) {
        if (Mock) {
            resolve([{ "faceId": "af8d2366-bc23-46b4-97c3-c48030046e50", "confidence": 0.7688518 }]);
            return;
        }

        $.ajax({
                url: SIMILAR_API_URL,
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY);
                },
                data: JSON.stringify(params),
                type: "POST"
            })
            .done(function(data) { resolve(data); })
            .fail(function(error) { reject(error); });
    });
}