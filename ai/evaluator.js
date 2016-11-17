/*
 * Evaluate picture simili
 */

var promises, faceIds = [];

function evaluate(face, pics) {
    return new Promise(function(resolve, reject) {
        var deferreds = [];
        faceIds = [];
        pics.forEach(function(pic) {
            deferreds.push(evaluateOne(pic));
        });
        $.when.apply($, deferreds).then(function() {
            compare({
                'faceId': face.faceId,
                'faceIds': faceIds,
                'mode': 'matchFace'
            }).then(function(response) {
                resolve([response, judge(response)]);
            }).catch(function(error) {
                reject(error);
            });
        });
    });
}

function judge(similar) {
    var consensus = 0,
        photos = 0;
    similar.forEach(function(rate) {
        if (photos < 5) {
            consensus += rate.confidence;
            photos++;
        }
    });
    if (photos == 0) return 0;
    return Math.round(1000 * consensus / photos) / 10.0;
}

function evaluateOne(pic) {
    var dfd = $.Deferred();
    detect(pic, false, {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
    }).then(function(response) {
        if (response != undefined && response.length == 1)
            faceIds.push(response[0].faceId);
        dfd.resolve();
    }).catch(function(error) {
        dfd.resolve();
    });
    return dfd.promise();
}