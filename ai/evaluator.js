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
            if (Mock) faceIds = ["b3a126d5-1c66-4df3-aeec-92d45c48bba6", "77242438-7284-46ba-8f29-7c60e3d2301f", "af8d2366-bc23-46b4-97c3-c48030046e50"];
            compare({
                'faceId': imageId,
                'faceIds': faceIds
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
    detect(pic, {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
    }).then(function(response) {
        if (response != undefined && response.length == 1)
            faceIds.push(response[0].faceId);
        dfd.resolve();
    });
    return dfd.promise();
}