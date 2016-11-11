/*
 * Instagram API Service
 */
var INSTAGRAM_URL = "https://www.instagram.com/";

/* Request Instagram API */
function query(username) {
    return new Promise(function(resolve, reject) {
        if (!username || username == undefined || username == '')
            reject();

        if (this.timeoutId) window.clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(function() {
            $.ajax({ url: '/instagram?' + $.param({ username: username }), type: "GET", })
                .done(function(response) { resolve(response); })
                .fail(function(error) { reject(error); });
        }, 250);
    });
}