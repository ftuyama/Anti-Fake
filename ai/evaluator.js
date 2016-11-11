/*
 * Evaluate picture simili
 */

var faceIds = [];
var similar;

function evaluate() {
    faceIds = [];
    pics.forEach(function(pic) {
        faceIds.push(evaluateOne(pic));
    });
    similar = compare({
        'faceId': image,
        'faceIds': faceIds,
        "mode": "matchPerson"
    });
    alert(similar);
    return judge(similar);
}

function judge(similar) {
    var consensus = 0;
    similar.forEach(function(rate) {
        consensus += rate.confindence;
    });
    return consensus > rate.length / 2;
}

function evaluateOne(picture) {
    detect(pic, {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
    }).then(function(response) {
        return response[0].faceId;
    });
}