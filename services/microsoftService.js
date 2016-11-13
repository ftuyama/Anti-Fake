/*
 * Microsoft API Service
 */
var DETECT_API_URL = "https://api.projectoxford.ai/face/v1.0/detect?";
var SIMILAR_API_URL = "https://api.projectoxford.ai/face/v1.0/findsimilars";
var SUBSCRIPTION_KEY = "79d40fa92b1140f28b4401858b34c877";

/* Detect Microsoft API */
function detect(image, upload, params) {
    return new Promise(function(resolve, reject) {
        var body = (upload) ? makeblob(image) : JSON.stringify({ "url": image });
        var content = (upload) ? "application/octet-stream" : "application/json";

        $.ajax({
                url: DETECT_API_URL + $.param(params),
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", content);
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY);
                },
                type: "POST",
                processData: false,
                contentType: content,
                data: body
            })
            .done(function(data) { resolve(data); })
            .fail(function(error) { reject(error); });
    });
}

/* Compare Microsoft API */
function compare(params) {
    return new Promise(function(resolve, reject) {
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