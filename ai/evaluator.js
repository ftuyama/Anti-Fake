/*
 * Evaluate picture simili
 */

var promises, faceIds = [];

function evaluate(imageId, pics) {
    return new Promise(function(resolve, reject) {
        var deferreds = [];
        faceIds = [];
        pics.forEach(function(pic) {
            deferreds.push(evaluateOne(pic));
        });
        $.when.apply($, deferreds).then(function() {
            compare({
                'faceId': imageId,
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
    var consensus = 0;
    similar.forEach(function(rate) {
        consensus += rate.confidence;
    });
    return Math.round(1000 * consensus / similar.length) / 10.0;
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
    });
    return dfd.promise();
}