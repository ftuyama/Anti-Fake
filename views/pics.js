/*
 * Displays Instagram's Pictures
 */

var pics = [];

function display(response) {
    if (response == undefined || response.user == undefined || response.user.username == undefined)
        return;
    if (response.user.is_private) {
        alert("Instagram privado!");
        return;
    }
    show(response.user);
}

function show(user) {
    pics = [user.profile_pic_url];
    user.media.nodes.forEach(function(node) {
        if (!node.is_video)
            pics.push(node.display_src);
    });
    $("#insta").html("");
    pics.forEach(function(pic) {
        if (pic != undefined && pic != "")
            $("#insta").append(
                "<div class=\"imgContainer\"><img src=\"" + pic +
                "\" height=\"200\" width=\"200\"/></div>");
    });
}