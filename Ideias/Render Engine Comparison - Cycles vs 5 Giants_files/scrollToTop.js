/**
 * When a user scrolls the page it will call the backToTop function,
 * which will show or hide the button depending on the position of the scroll bar.
 *
 * When the button is clicked, the page wil scroll to the top.
 *
 * Add an element with an id "back-to-top" on each page you want the "Bak To Top" functionality
 * or in the footer to be available on all pages.
 *
 */
jQuery(document).ready(function($) {
    var scrollTrigger = 100; // px

    backToTop();

    function backToTop() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > scrollTrigger) {
            $('#back-to-top').addClass('show');
        } else {
            $('#back-to-top').removeClass('show');
        }
    }

    $(window).on('scroll', function () {
        backToTop();
    });

    $('#back-to-top').on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: 0
        }, 700);
    });
}(jQuery));