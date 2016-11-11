/*
 * Displays Instagram's Pictures
 */
function display(response) {
    if (response == undefined || response.user == undefined || response.user.username == undefined)
        return;
    if (response.user.is_private) {
        alert("Instagram privado!");
        return;
    }
    pictures(response.user);
}

function pictures(user) {
    var pics = [];
    pics.push(user.profile_pic_url);

    user.media.nodes.forEach(function(node) {
        if (!node.is_video)
            pics.push(node.display_src);
    });

    pics.forEach(function(pic) {
        if (pic != undefined && pic != "")
            $("#insta").append("<img src=\"" + pic + "\"");
    });
}