/*
 * Evaluate picture simili
 */

var faceIds = [];

function evaluate(pics) {
    faceIds = [];
    pics.forEach(function(pic) {
        var faceId = evaluateOne(pic);
        if (faceId != undefined)
            faceIds.push(faceId);
    });
    compare({
        'faceId': image,
        'faceIds': faceIds,
        "mode": "matchPerson"
    }).then(function(response) {
        alert(response);
        return [response, judge(response)];
    });
}

function judge(similar) {
    var consensus = 0;
    similar.forEach(function(rate) {
        consensus += rate.confindence;
    });
    return consensus / rate.length;
}

function evaluateOne(picture) {
    detect(picture, {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
    }).then(function(response) {
        if (response != undefined && response.length == 1)
            return response[0].faceId;
        return undefined;
    });
}