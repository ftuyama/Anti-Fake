jQuery(window).load(function() {

	load_fonts();
	
	hover_elements();
	
	filter_button();
	
	filter_buttons();
	
	layout_options();
	
	mobile_menu_button();
	
	load_youtube();
	
	search_expand();
	
	fold_content();
	
	//stick_sidebar();
	
	readmore_links();
	
	fancybox();
	
	entry_submit();
	
	pagination_fix();
	
	filter_count();
	
	bx_slider();
	
	clear_loading();
	
	dropdown_fix();
	
	tooltips();
	
	home_hover();
	
	fluid_videos();
	
	product_images();
	
	woo_custom();
	
	//bg_disqus_comments();

    quantity_styles();
			
});


function quantity_styles(){
    jQuery('.quantity .plus').val('▲');
    jQuery('.quantity .minus').val('▼');
}

function load_fonts(){
	
	WebFont.load({
		google: {
			families: ['Roboto:400,300italic,300,500,700:latin']
		}
	});
	
}

function hover_elements(){
	
	jQuery('.hover_replace').live('hover', 
		function(){
		
			var new_style = jQuery(this).data('hover');
			
			var old_style = jQuery(this).attr('style');
			
			jQuery(this).attr('style', new_style).data('hover', old_style);
			
		}, 
		function(){
			
			var new_style = jQuery(this).data('hover');
			
			var old_style = jQuery(this).attr('style');
			
			jQuery(this).attr('style', new_style).data('hover', old_style);
			
		}
	);
	
	jQuery('.post_thumb_wrapper').hover( 
		function(){
			jQuery(this).find('.thumbnail_cover').animate({'opacity' : 1}, 500);
		},
		function(){
			jQuery(this).find('.thumbnail_cover').animate({'opacity' : 0}, 500);
		}
	);
}

function filter_button(){
	
	jQuery('#filter_button').click(function(){
	
		if(jQuery(this).hasClass('filter_menu_open')){
			
			jQuery(this).removeClass('filter_menu_open');
			
			jQuery('#fliter_options').slideUp();
			
			get_posts();
			
		}else{
			
			jQuery(this).addClass('filter_menu_open');
			
			jQuery('#fliter_options').slideDown();
			
		}
		
		return false;
		
	});
	
}

function filter_buttons(){
	
	jQuery('.filter_checkbox').change(function(){
	
		if(jQuery(this).hasClass('checkbox')){
			
			if(jQuery(this).prop('checked')){
				
				jQuery(this).prev().addClass('selected');
				
			}else{
				
				jQuery(this).prev().removeClass('selected');
				
			}
			
		}else{
		
			jQuery(this).parent().parent().find('label.selected').removeClass('selected');
		
			jQuery(this).prev().addClass('selected');
		
		}
		
	});
	
	jQuery('#clear_filter').click(function(){
	
		location.reload();
		
		return false;
		
	});
	
	jQuery('a#apply_filters').click(function(){
		
		get_posts();
		
		return false;
		
	});
	
}

function get_posts(offset){

	if(!offset){
		
		offset = 0;
		
	}

	loading();

	var sort_by = jQuery('.filter_button:checked');
	
	var custom_fields = new Array;
	
	var meta_query = new Array;
	
	var tax_query = new Array;
	
	jQuery(sort_by).each(function(){
	
		if(jQuery(this).data('custom') && jQuery(this).data('custom') != ''){
		
			var fields = jQuery(this).data('custom').split('~');
			
			var i;
			
			for (i = 0; i < fields.length; ++i) {
				
				data = fields[i].split(':');
				
				if(jQuery(this).hasClass('meta_query')){
					
					meta_query.push({key : data[0], val : data[1], compare: data[2]});
					
				}else if(jQuery(this).hasClass('tax_query')){
				
					tax_query.push({tax : data[0], field : data[1], terms: data[2]});
					
				}else{
	
					custom_fields.push({key : data[0], val : data[1]});
				
				}
				
			}
	
		}
	
	});
	
	var post_type = jQuery('#posts_container').data('post-type');
	
	var data = {
			action: 'bg_get_posts',
			post_type: post_type,
			custom_fields: custom_fields,
			meta_query: meta_query,
			tax_query: tax_query,
			offset: offset
		};

	jQuery.post(options.ajax_url, data, function(response) {
	
		jQuery('#posts_container').fadeOut(function(){
		
			jQuery('#posts_container').remove();
				
			jQuery('#content_wrapper').addClass('ajaxed').prepend(response).fadeIn(function(){

				//jQuery('#fliter_options').slideUp();
				
				jQuery('html,body').animate({scrollTop: jQuery('#posts_container').offset().top},'slow');
				
				filter_count();
				
			});
	
			loading_stop();
		
		});
		
	});
	
}

function layout_options(){
	
	jQuery('a.layout_option_buttons').click(function(){
	
		var $this = jQuery(this);
	
		jQuery('#content_wrapper').fadeOut(function(){
			
			jQuery('a.layout_option_buttons').each(function(){
			
				jQuery('body').removeClass(jQuery(this).attr('id'));
				
			});
			
			jQuery('body').addClass($this.attr('id'));
			
			jQuery('#content_wrapper').fadeIn();
			
		});
		
		jQuery('.active_layout').removeClass('active_layout');

		jQuery(this).addClass('active_layout');
		
		return false;
		
	});
	
}

function mobile_menu_button(){
	
	jQuery('#mobile_menu_button').click(function(){
		
		jQuery('#mobile_menu_wrapper').slideToggle();
		
		return false;
		
	});
	
}

function search_expand(){
	
	jQuery('#search-input').focus(function(){
		
		jQuery(this).parent().animate({
			'width': '70%'
		});
		
	});
	
	jQuery('#search-input').focusout(function(){
		
		jQuery(this).parent().animate({
			'width': '50%'
		});
		
	});
	
	jQuery('#mobile_search_icon').focus(function(){
		
		jQuery(this).parent().animate({
			'width': '150px'
		});
		
	});
	
	jQuery('#mobile_search_icon').focusout(function(){
		
		jQuery(this).parent().animate({
			'width': 'auto'
		});
		
	});
	
}

function loading(){
	
	jQuery('body').append('<div id="loading"><img src="'+options.template_url+'/images/loading_notext.gif" /></div>');

}

function loading_stop(){
	
	jQuery('#loading').fadeOut().remove();
	
}

function load_youtube(){
	
	var player;
	
	var tag = document.createElement('script');
	
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

}

function onYouTubePlayerAPIReady() {

    player = new YT.Player('ytapiplayer', {
        videoId: jQuery('#video_embed').data('id'),
        playerVars: {
            controls: 1,
            wmode:'transparent'
        },
        height: '440',
        width: '740',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
    });
}

function onPlayerReady(event) { 

	var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );

	if(player.getDuration() == 0 && !iOS){
		
		player.loadVideoById(jQuery('#video_embed').data('id'));
		
	}else{

		full_length(event.target);
	
	}
	
	jQuery('.timeline_event').click(function(){
		
		player.seekTo(jQuery(this).data('seconds'));
		
	});
		
	jQuery('.play_video').click(function(){
	
		jQuery('.play_video.now_playing').removeClass('now_playing');
	
		jQuery(this).addClass('now_playing');
	
		jQuery('#video_embed').data('id', jQuery(this).data('id'));
			
		player.loadVideoById(jQuery(this).data('id'));
			
		return false;
			
	});

}

function onPlayerStateChange(event){
	
	full_length(event.target);
	
}

function full_length(ytplayer){
	
	var duration = parseInt(player.getDuration().toFixed(0));
	
	var minutes = Math.floor(duration / 60);

	var full_seconds = duration - minutes * 60;
	
	full_seconds = (full_seconds < 10) ? ("0" + full_seconds) : full_seconds;
	
	jQuery('#full_length').attr('data-seconds', duration).html(minutes+':'+full_seconds);
	
	//var seconds = full_length();

	jQuery('.timeline_event').each(function(){
		
		var ms = jQuery(this).data('time');   

		var a = ms.toString().split('.'); 

		var seconds = (+a[0]) * 60 + (+a[1]);
		
		jQuery(this).attr('data-seconds', seconds);
		
		var perc = ((seconds/duration)*100);

		jQuery(this).css('left', perc+'%');
		
	});
	
	jQuery('.timeline_event').hide();
	
	jQuery('.bg_youtube_id_'+jQuery('#video_embed').data('id')).show();
	
	//return seconds;
	
}

function fold_content(){
	
	jQuery('.fold_button').click(function(){
		
		jQuery(this).toggleClass('open').next().slideToggle();
		
		return false;
		
	});
	
	jQuery('.fold_button_close').click(function(){
		
		jQuery(this).parent().slideUp();
		
		jQuery('html,body').animate({scrollTop: jQuery('.fold_button').offset().top},'slow');
		
		return false;
		
	});
	
	jQuery('#enter_competition_header_button').click(function(){
		
		var submit = jQuery('#competition_entry .fold_content');
		
		if(!submit.hasClass('open')){
			
			submit.slideDown();
			
		}
		
	});
	
}

function stick_sidebar() {

	if(jQuery('.single #sidebar').length > 0){


		var $window = jQuery(window),
	        $mainMenuBar = jQuery('.single #sidebar'),
	        $mainMenuBarAnchor = jQuery('#sidebar_anchor');
	        $windowHeight = jQuery(window).height();
	
	    $window.scroll(function() {
	        var window_top = $window.scrollTop();
	        var div_top = $mainMenuBarAnchor.offset().top;
	        if (window_top > div_top) {
	            $mainMenuBar.addClass('stick');
	            $mainMenuBar.css('left', ($mainMenuBarAnchor.position().left));
	            $mainMenuBar.width($mainMenuBarAnchor.width());
	            //$mainMenuBar.css('height', $windowHeight);
	            $mainMenuBarAnchor.height($mainMenuBar.height());
	        }
	        else {
	            $mainMenuBar.removeClass('stick');
	            $mainMenuBar.css('left', "");
	            $mainMenuBarAnchor.height(0);
	            $mainMenuBar.width("");
	        }
	    });

	//jQuery(".single #sidebar").stick_in_parent();
    
    }
}

function readmore_links(){
	
	jQuery('#author_readmore').click(function(){
		
		var des = jQuery('#footer_top_inner .footer_column p.author_description');
		
		des.toggleClass('open');
		
		if(des.hasClass('open')){
			
			jQuery(this).html('<span>&#x2C4;</span>Read Less');
			
		}else{
			
			jQuery(this).html('<span>&#x2C5;</span>Read More');
			
		}
		
		return false;
		
	});
	
	jQuery('a#winner_comments_read_more').click(function(){
		
		var des = jQuery('#winner_comments');
		
		des.toggleClass('open');
		
		if(des.hasClass('open')){
			
			jQuery(this).html('Read Less...');
			
		}else{
			
			jQuery(this).html('Read More...');
			
		}
		
		return false;
		
	});
	
}

function fancybox(){
	
	jQuery(".fancybox").fancybox({
		padding : 0,
		beforeLoad: function() {
			this.title = jQuery(this.element).attr('caption');
        },
		helpers : {
	        title: {
	            type: 'inside',
	            position: 'top'
	        }
	    },
	    afterLoad   : function() {
	    	if(jQuery(this.element).attr('comments') != undefined){
	        	this.inner.append( '<span class="pop_up_comments">'+ jQuery(this.element).attr('comments') +'</span>');
	        }
	    }
	    //fitToView: false
	});
	
	jQuery("#product_content a > img").each(function(){
	
		var imgtitle = jQuery(this).attr("alt");
		
		jQuery(this).parent().fancybox({
			padding : 0,
			title: imgtitle,
			helpers : {
		        title: {
		            type: 'inside',
		            position: 'top'
		        }
		    }
		});
	
	});
}

function entry_submit(){
	
	jQuery('#competition_entry_form_submit').click(function(){
	
		jQuery('#competition_entry_messages').html('');
	
		jQuery('#form_cover').html('Submitting...').show();
		
		var data = {
			action: 'bg_submit_entry',
			postid: jQuery('#competition_entry_form_postid').val(),
			name: jQuery('#competition_entry_form_name').val(),
			email: jQuery('#competition_entry_form_email').val(),
			entry_name: jQuery('#competition_entry_form_entry_name').val(),
			desc: jQuery('#competition_entry_form_description').val(),
			image: jQuery('input[name="aaiu_image_id[]"]').val()
		};

		jQuery.post(options.ajax_url, data, function(response) {
		
			if(response == 'success'){
				
				jQuery('#form_cover').html('<strong>Submission Received!</strong><br>Your image will appear in the Entries section once it\'s been approved for listing.<br>Thanks and good luck in the competition!');
				
			}else{
				
				jQuery('#form_cover').hide();
				
				jQuery('#competition_entry_messages').html(response);
				
			}
		
		});
		
		return false;
		
	})
	
}

function pagination_fix(){
	
	jQuery('.ajaxed .wp-pagenavi a').live('click', function(){
		
		var offset = jQuery(this).attr('href').replace('paged=', '');
		
		get_posts(offset);
		
		return false;
		
	});
	
}

function filter_count(){

	var count = jQuery('#fliter_options :radio:checked, :checkbox:checked').length;
	
	if(count > 0){
	
		jQuery('#filter_count').html(count).addClass('filled');
	
	}else{
		
		jQuery('#filter_count').html('').removeClass('filled');
		
	}
	
}

function bx_slider(){

	jQuery('#header_banner').fadeIn();
	
	jQuery('#header_banner').bxSlider({
		adaptiveHeight: true,
		pager: false,
		useCSS: false
	});
	
	jQuery("#products_menu")
    .appendTo("ul#menu-main-menu > li.products");
	
	products_slider = jQuery('#products_menu_list');
	products_slider.bxSlider({
		adaptiveHeight: true,
		pager: false,
		onSlideAfter: function($slideElement, oldIndex, newIndex){
			jQuery('span#product_count > span').html((products_slider.getCurrentSlide()+1) + ' / ' + products_slider.getSlideCount());
	    },
	    onSliderLoad: function(currentIndex){
			jQuery('span#product_count > span').html((products_slider.getCurrentSlide()+1) + ' / ' + products_slider.getSlideCount());
	    }
	});
	
	jQuery('ul#menu-main-menu > li.products').hover(function(){
		
		products_slider.reloadSlider();
	
	}, function(){});
	
	jQuery('.images a').each(function(){
		
		if(jQuery(this).attr('data-href') != ''){
			
			jQuery(this).attr('href', jQuery(this).attr('data-href'));
			
		}
		
	});
	
	jQuery('.woocommerce div.product div.images div.thumbnails').bxSlider({
		minSlides: 3,
		maxSlides: 14,
		moveSlides: 3,
		slideWidth: 68,
		slideHeight: 68,
		slideMargin: 12,
		pager: false,
		infiniteLoop: false,
		hideControlOnEnd: true
	});
	
}

function clear_loading(){
	
	jQuery('#page_loading').fadeOut('slow');
	
}

function dropdown_fix(){
	
	jQuery('ul#menu-main-menu li').hover(function(){
		
		if(jQuery(this).find('ul.sub-menu')){
			
			var win = jQuery(window);
			
			var viewport = {
				left : win.scrollLeft()
			};
			
			viewport.right = viewport.left + win.width();
			
			var bounds = jQuery(this).find('ul.sub-menu').offset();
			
			if(bounds){

				bounds.right = bounds.left + jQuery(this).find('ul.sub-menu').outerWidth();
				
				if(bounds.right > viewport.right){
					
					jQuery(this).find('ul.sub-menu').css('margin-left', '-' + (bounds.right - viewport.right) + 'px');
					
					document.styleSheets[0].addRule('ul#menu-main-menu li > ul.sub-menu:before','left: '+((bounds.right - viewport.right) + 38) + 'px!important;');
					
				}
				
			}
			
		}
		
	}, function(){
		
		jQuery(this).find('ul.sub-menu').css('margin-left', 0);
		
		jQuery(this).removeClass('fixed');
		
		document.styleSheets[0].addRule('ul#menu-main-menu li > ul.sub-menu:before','left: 38px!important;');
		
	});
	
	jQuery('div.woo_cart').hover(function(){
		
		if(jQuery(this).find('#woo_cart_dropdown')){
			
			var win = jQuery(window);
			
			var viewport = {
				left : win.scrollLeft()
			};
			
			viewport.right = viewport.left + win.width();
			
			var bounds = jQuery(this).find('#woo_cart_dropdown').offset();
			
			if(bounds){

				bounds.right = bounds.left + jQuery(this).find('#woo_cart_dropdown').outerWidth();
				
				if(bounds.right > viewport.right){
					
					jQuery(this).find('#woo_cart_dropdown').css('margin-left', '-' + (bounds.right - viewport.right) + 'px');
					
					document.styleSheets[0].addRule('#woo_cart_dropdown:before','left: '+((bounds.right - viewport.right) + 15) + 'px!important;');
					
				}
				
			}
			
		}
		
	}, function(){
		
		jQuery(this).find('#woo_cart_dropdown').css('margin-left', 0);
		
		jQuery(this).removeClass('fixed');
		
		document.styleSheets[0].addRule('#woo_cart_dropdown:before','left: 38px!important;');
		
	});
	
}

function tooltips(){
	
	jQuery('.tooltip').tooltipster();
	
}

function home_hover(){
	
	jQuery('a#main_menu_home').hover(
		function(){
			jQuery(this).find('img').attr('src', jQuery(this).find('img').attr('src').replace('.png', '_hover.png'));
		},
		function(){
			jQuery(this).find('img').attr('src', jQuery(this).find('img').attr('src').replace('_hover.png', '.png'));
		}
	);
	
}

function fluid_videos(){
	
	jQuery(".fold_content").fitVids();
	
}

function product_images(){

	jQuery('.images .thumbnails').show();

	jQuery('.thumbnails .zoom.first').first().addClass('selected');
	
	jQuery(document).on('click','.thumbnails .zoom', function(){
	
		var thumb = jQuery(this);
		
		if(!thumb.hasClass('selected')){
	
			jQuery('.images').append('<div id="loading"><img src="'+options.template_url+'/images/loading-black.gif" /></div>');
	
	        var photo_fullsize =  jQuery(this).attr('href');
	        
	        if(jQuery('.woocommerce-main-image img').length == 0 && !thumb.hasClass('video')){
		        
		        jQuery('.images .embed').remove();
		        
		        jQuery('.images').prepend('<a href="#" itemprop="image" class="woocommerce-main-image zoom" title="" data-rel="prettyPhoto[product-gallery]"><img width="900" height="506" src="http://placehold.it/900/ffffff/ffffff" class="attachment-shop_single wp-post-image" alt="" title=""></a>');
		        
	        }
	        
	        if(thumb.hasClass('video')){
	        
	        	jQuery('.woocommerce-main-image').remove();
	        	
	        	jQuery('.images .embed').remove();
	        	
	        	jQuery('.images').prepend('<div class="embed">'+thumb.attr('data-embed')+'</div>');
	        	
	        	jQuery('.images #loading').remove();
	        	
	        	jQuery('.selected').removeClass('selected');
					
				thumb.addClass('selected');
	        
	        }else{
	        
		        jQuery('.woocommerce-main-image img').load(function() {
		
					jQuery('.images #loading').remove();
					
					jQuery('.selected').removeClass('selected');
					
					thumb.addClass('selected');
		
				}).attr('src', photo_fullsize);
		        
		        jQuery('.woocommerce-main-image').attr('href', photo_fullsize);
	        
	        }
        
        }

        return false;
    }); 
    
    jQuery(".woocommerce-main-image").fancybox({
		padding : 0,
		beforeLoad: function() {
			this.title = L10n.product + ': ' + jQuery('#product_title_price > h2').text();
        },
		helpers : {
	        title: {
	            type: 'inside',
	            position: 'top'
	        }
	    }
	});
	
}

function bg_disqus_comments(){

	var disqusPublicKey = window.DISQUS_KEY;
	var disqusShortname = window.DISQUS_SHORTNAME; // Replace with your own shortname

	var urlArray = [];

	jQuery('.comment_count').each(function () {
	  var url = jQuery(this).attr('data-disqus-url');
	  urlArray.push('link:' + url);
	});

	jQuery.ajax({
    type: 'POST',
    url: "https://disqus.com/api/3.0/threads/set.jsonp",
    data: { api_key: disqusPublicKey, forum : disqusShortname, thread : urlArray },
    cache: false,
    dataType: 'jsonp',
    success: function (result) {

      for (var i in result.response) {

        var countText = " comments";
        var count = result.response[i].posts;

        if (count == 1)
          countText = " comment";

        $('div[data-disqus-url="' + result.response[i].link + '"]').html(count + '!');

      }
    }
  });

}

function woo_custom(){

	//jQuery(document).load(function() {

		// Validates that the password is at least 8 characters long and that the confirm password input matches the
		// password input
		var validatePassword = function() {

			var wrapper  = jQuery( 'form.register, form.checkout, form.edit-account, form.lost_reset_password' ),
				submit   = jQuery( 'input[type="submit"]', wrapper ),
				passwordInput = jQuery('#reg_password, #password_1, #account_password'),
				confirmPasswordInput = jQuery('#reg_password_2, #password_2');

			jQuery(wrapper).find('.error').remove();

			var valid = true;
			var minLength = 8;

			if (passwordInput.length !== 0) {
				if (passwordInput.val().length < minLength && (passwordInput.prop('required') || passwordInput.val().length != 0)) {
					passwordInput.parent().append('<span class="error">Passwords must contain at least ' + minLength + ' characters</span>');
					valid = false;
				}
			}

			if (confirmPasswordInput.length !== 0) {

				if (confirmPasswordInput.val() != passwordInput.val()){
					confirmPasswordInput.parent().append('<span class="error">Please enter the same password as above</span>');
					valid = false;
				}
			}

			if (!valid) {
				submit.attr( 'disabled', 'disabled' ).addClass( 'disabled' );
				jQuery(this).addClass('blank');

			}else{
				submit.removeAttr( 'disabled' ).removeClass( 'disabled' );
				jQuery(this).removeClass('blank');

			}
		}
	
		jQuery('.woocommerce-result-count, .woocommerce-ordering').remove();
		
		jQuery('.plus, .minus').val(' ');
		
		jQuery('form.register span.required').parent().parent().find('input').on('blur', function(){
			
			if(jQuery(this).val() == ''){
			
				jQuery('input[name=register]').attr( 'disabled', 'disabled' );
				
				jQuery(this).addClass('blank');
				
			}else{
				
				jQuery('input[name=register]').removeAttr( 'disabled' );
				
				jQuery(this).removeClass('blank');
				
			}
			
		});
		
		jQuery('input[name=register]').hover(function(){
			
			jQuery('form.register span.required').parent().parent().find('input').each(function(){
				
				if(jQuery(this).val() == ''){
			
					jQuery('input[name=register]').attr( 'disabled', 'disabled' );
					
					jQuery(this).addClass('blank');
					
				}else{
					
					jQuery('input[name=register]').removeAttr( 'disabled' );
					
					jQuery(this).removeClass('blank');
					
				}
				
			});

			validatePassword();
			
		});
		
		jQuery('form.register input').on('keyup', function(){
			
			jQuery('form.register span.required').parent().parent().find('input').each(function(){
				
				if(jQuery(this).val() == ''){
			
					jQuery('input[name=register]').attr( 'disabled', 'disabled' );
					
					jQuery(this).addClass('blank');
					
				}else{
					
					jQuery('input[name=register]').removeAttr( 'disabled' );
					
					jQuery(this).removeClass('blank');
					
				}
				
			});
			
		});

		// Validates passwords on the registration, checkout, edit account and lost password pages
		jQuery('#reg_password, #reg_password_2, #password_1, #password_2, #account_password').on('keyup change', function(e) {
			validatePassword();
		});
	
	//});
	
}

/* WOOCOMMERCE */

function checkPasswordStrength( $pass1,
                                $pass2,
                                $strengthResult,
                                $submitButton,
                                blacklistArray ) {
        var pass1 = $pass1.val();
    var pass2 = $pass2.val();
 
    // Reset the form & meter
    $submitButton.attr( 'disabled', 'disabled' );
        $strengthResult.removeClass( 'short bad good strong' );
 
    // Extend our blacklist array with those from the inputs & site data
    blacklistArray = blacklistArray.concat( wp.passwordStrength.userInputBlacklist() )
 
    // Get the password strength
    var strength = wp.passwordStrength.meter( pass1, blacklistArray, pass2 );
 
    // Add the strength meter results
    switch ( strength ) {
 
        case 2:
            $strengthResult.addClass( 'bad' ).html( pwsL10n.bad );
            break;
 
        case 3:
            $strengthResult.addClass( 'good' ).html( pwsL10n.good );
            break;
 
        case 4:
            $strengthResult.addClass( 'strong' ).html( pwsL10n.strong );
            break;
 
        case 5:
            $strengthResult.addClass( 'short' ).html( pwsL10n.mismatch );
            break;
 
        default:
            $strengthResult.addClass( 'short' ).html( pwsL10n.short );
 
    }
 
    // The meter function returns a result even if pass2 is empty,
    // enable only the submit button if the password is strong and
    // both passwords are filled up
    if ( 3 === strength && '' !== pass2.trim() ) {
        $submitButton.removeAttr( 'disabled' );
    }
 
    return strength;
}
 
jQuery( document ).ready( function( $ ) {
    // Binding to trigger checkPasswordStrength
    $( 'body' ).on( 'keyup', 'input#reg_password, input#reg_password_2',
        function( event ) {
            checkPasswordStrength(
                $('input#reg_password'),         // First password field
                $('input#reg_password_2'), // Second password field
                $('#password-strength'),           // Strength meter
                $('input[name=register]'),           // Submit button
                ['black', 'listed', 'word']        // Blacklisted words
            );
        }
    );
});