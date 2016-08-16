/*global wc_add_to_cart_variation_params, wc_cart_fragments_params */
/*!
 * Variations Plugin
 */
;(function ( $, window, document, undefined ) {

    $.fn.wc_variation_form = function() {
        var $form                  = this,
            $single_variation      = $form.find( '.single_variation' ),
            $product               = $form.closest( '.product' ),
            $product_id            = parseInt( $form.data( 'product_id' ), 10 ),
            $product_variations    = $form.data( 'product_variations' ),
            $use_ajax              = $product_variations === false,
            $xhr                   = false,
            $reset_variations      = $form.find( '.reset_variations' ),
            template               = wp.template( 'variation-template' ),
            unavailable_template   = wp.template( 'unavailable-variation-template' ),
            $single_variation_wrap = $form.find( '.single_variation_wrap' );

        // Always visible since 2.5.0
        $single_variation_wrap.show();

        // Unbind any existing events
        $form.unbind( 'check_variations update_variation_values found_variation' );
        $form.find( '.reset_variations' ).unbind( 'click' );
        // Bind new events to form
        $form

        // On clicking the reset variation button
            .on( 'click', '.reset_variations', function( event ) {
                event.preventDefault();
                $form.find( '.variations input[type=radio]:checked' ).removeAttr('checked').change();
                $form.trigger( 'reset_data' );
            } )

            // When the variation is hidden
            .on( 'hide_variation', function( event ) {
                event.preventDefault();
                $form.find( '.single_add_to_cart_button' ).attr( 'disabled', 'disabled' ).attr( 'title', wc_add_to_cart_variation_params.i18n_make_a_selection_text );
            } )

            // When the variation is revealed
            .on( 'show_variation', function( event, variation, purchasable ) {
                event.preventDefault();
                if ( purchasable ) {
                    $form.find( '.single_add_to_cart_button' ).removeAttr( 'disabled' ).removeAttr( 'title' );
                } else {
                    $form.find( '.single_add_to_cart_button' ).attr( 'disabled', 'disabled' ).attr( 'title', wc_add_to_cart_variation_params.i18n_unavailable_text );
                }
            } )

            // Reload product variations data
            .on( 'reload_product_variations', function() {
                $product_variations = $form.data( 'product_variations' );
                $use_ajax           = $product_variations === false;
            } )

            // Reset product data
            .on( 'reset_data', function() {
                $('.sku').wc_reset_content();
                $('.product_weight').wc_reset_content();
                $('.product_dimensions').wc_reset_content();
                $form.trigger( 'reset_image' );
                $single_variation.slideUp( 200 ).trigger( 'hide_variation' );
            } )

            // Reset product image
            .on( 'reset_image', function() {
                $form.wc_variations_image_update( false );
            } )

            // On changing an attribute
            .on( 'change', '.variations input[type=radio]', function() {
                $form.find( 'input[name="variation_id"], input.variation_id' ).val( '' ).change();
                $form.find( '.wc-no-matching-variations' ).remove();

                if ( $use_ajax ) {
                    if ( $xhr ) {
                        $xhr.abort();
                    }

                    var all_attributes_chosen  = true;
                    var some_attributes_chosen = false;
                    var data                   = {};

                    $form.find( '.variations value' ).each( function() {
                        var $radios = $( this ).find( 'input[type=radio]' );
                        var $checked_radio = $radios.filter(':checked');
                        var attribute_name = $radios.attr( 'name' );

                        if ( $checked_radio.length == 0 ) {
                            all_attributes_chosen = false;
                        } else {
                            some_attributes_chosen = true;
                        }

                        data[ attribute_name ] = $checked_radio.val();
                    });

                    if ( all_attributes_chosen ) {
                        // Get a matching variation via ajax
                        data.product_id = $product_id;

                        $xhr = $.ajax( {
                            url: wc_cart_fragments_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'get_variation' ),
                            type: 'POST',
                            data: data,
                            success: function( variation ) {
                                if ( variation ) {
                                    $form.find( 'input[name="variation_id"], input.variation_id' )
                                        .val( variation.variation_id )
                                        .change();
                                    $form.trigger( 'found_variation', [ variation ] );
                                } else {
                                    $form.trigger( 'reset_data' );
                                    $form.find( '.single_variation' ).after( '<p class="wc-no-matching-variations woocommerce-info">' + wc_add_to_cart_variation_params.i18n_no_matching_variations_text + '</p>' );
                                    $form.find( '.wc-no-matching-variations' ).slideDown( 200 );
                                }
                            }
                        } );
                    } else {
                        $form.trigger( 'reset_data' );
                    }
                    if ( some_attributes_chosen ) {
                        if ( $reset_variations.css( 'visibility' ) === 'hidden' ) {
                            $reset_variations.css( 'visibility', 'visible' ).hide().fadeIn();
                        }
                    } else {
                        $reset_variations.css( 'visibility', 'hidden' );
                    }
                } else {
                    $form.trigger( 'woocommerce_variation_select_change' );
                    $form.trigger( 'check_variations', [ '', false ] );
                    $( this ).blur();
                }

                // added to get around variation image flicker issue
                $( '.product.has-default-attributes > .images' ).fadeTo( 200, 1 );

                // Custom event for when variation selection has been changed
                $form.trigger( 'woocommerce_variation_has_changed' );
            } )

            // Upon gaining focus
            .on( 'focusin touchstart', '.variations select', function() {
                $( this ).find( 'option:selected' ).attr( 'selected', 'selected' );

                if ( ! $use_ajax ) {
                    $form.trigger( 'woocommerce_variation_select_focusin' );
                    $form.trigger( 'check_variations', [ $( this ).data( 'attribute_name' ) || $( this ).attr( 'name' ), true ] );
                }
            } )

            // Check variations
            .on( 'check_variations', function( event, exclude, focus ) {
                if ( $use_ajax ) {
                    return;
                }

                var all_attributes_chosen  = true,
                    some_attributes_chosen = false,
                    current_settings       = {},
                    $form                  = $( this ),
                    $reset_variations      = $form.find( '.reset_variations' );

                $form.find( '.variations .value' ).each( function() {
                    var $radios = $( this ).find( 'input[type=radio]' );
                    var $checked_radio = $radios.filter(':checked');

                    var attribute_name = $radios.attr( 'name' );

                    if ( $checked_radio.length === 0 ) {
                        all_attributes_chosen = false;
                    } else {
                        some_attributes_chosen = true;
                    }

                    if ( exclude && attribute_name === exclude ) {
                        all_attributes_chosen = false;
                        current_settings[ attribute_name ] = '';
                    } else {
                        // Add to settings array
                        current_settings[ attribute_name ] = $checked_radio.val();
                    }
                });

                var matching_variations = wc_variation_form_matcher.find_matching_variations( $product_variations, current_settings );

                if ( all_attributes_chosen ) {

                    var variation = matching_variations.shift();

                    if ( variation ) {
                        $form.find( 'input[name="variation_id"], input.variation_id' )
                            .val( variation.variation_id )
                            .change();
                        $form.trigger( 'found_variation', [ variation ] );
                    } else {
                        // Nothing found - reset fields
                        $form.find( '.variations input[type=radio]:checked' ).removeAttr('checked');

                        if ( ! focus ) {
                            $form.trigger( 'reset_data' );
                        }

                        window.alert( wc_add_to_cart_variation_params.i18n_no_matching_variations_text );
                    }

                } else {

                    $form.trigger( 'update_variat ion_values', [ matching_variations ] );

                    if ( ! focus ) {
                        $form.trigger( 'reset_data' );
                    }

                    if ( ! exclude ) {
                        $single_variation.slideUp( 200 ).trigger( 'hide_variation' );
                    }
                }
                if ( some_attributes_chosen ) {
                    if ( $reset_variations.css( 'visibility' ) === 'hidden' ) {
                        $reset_variations.css( 'visibility', 'visible' ).hide().fadeIn();
                    }
                } else {
                    $reset_variations.css( 'visibility', 'hidden' );
                }

                $form.trigger( 'check_available_attributes', [ $product_variations ] );
            } )

            // Disable / enable radio buttons, according to other checked attributes
            .on( 'check_available_attributes', function( event, variations ) {
                if ( $use_ajax ) {
                    return;
                }

                // Check each radio buttons group (attribute)
                $form.find( '.variations .value' ).each( function( index, el ) {

                    // Get other attributes, if any
                    $other_attrs = $form.find( '.variations .value' ).not(el);

                    var other_settings = {};

                    // Loop through other attributes
                    $other_attrs.each( function() {
                        var $radios = $( this ).find( 'input[type=radio]' );
                        var attribute_name = $radios.attr( 'name' );
                        var $checked_radio = $radios.filter(':checked');

                        // Add to settings array
                        other_settings[ attribute_name ] = $checked_radio.val();
                    });

                    // Get matching variations, according to the other attributes
                    var matching_variations = wc_variation_form_matcher.find_matching_variations( variations, other_settings );

                    // Disable all radio options of this attribute, then we'll check if should be enabled
                    var $current_radios = $( el ).find( 'input[type=radio]' );
                    $current_radios.attr( 'disabled', 'disabled' );

                    var current_attr_name = $current_radios.attr( 'name' );

                    // Loop through variations
                    for ( var num in matching_variations ) {

                        if ( typeof( matching_variations[ num ] ) == 'undefined' || ! matching_variations[ num ].variation_is_active ) {
                            continue;
                        }

                        var attributes = matching_variations[ num ].attributes;

                        for ( var attr_name in attributes ) {
                            if ( ! attributes.hasOwnProperty( attr_name ) || attr_name != current_attr_name  ) {
                                continue;
                            }

                            var attr_val = attributes[ attr_name ];

                            if ( attr_val ) {

                                // Decode entities
                                attr_val = $( '<div/>' ).html( attr_val ).text();

                                // Add slashes
                                attr_val = attr_val.replace( /'/g, "\\'" );
                                attr_val = attr_val.replace( /"/g, "\\\"" );

                                // Compare the meerkat
                                $current_radios.filter( '[value="' + attr_val + '"]' ).removeAttr( 'disabled' );

                            } else {
                                $current_radios.removeAttr( 'disabled' );
                            }
                        }
                    }

                });

                // Custom event for when variations have been updated
                $form.trigger( 'woocommerce_update_variation_values' );
            });

        $form.find( '.variations input[type=radio]' ).unbind( 'change focusin' );

        $form.trigger( 'wc_variation_form' );

        return $form;
    };

    /**
     * Matches inline variation objects to chosen attributes
     * @type {Object}
     */
    var wc_variation_form_matcher = {
        find_matching_variations: function( product_variations, settings ) {
            var matching = [];
            for ( var i = 0; i < product_variations.length; i++ ) {
                var variation    = product_variations[i];

                if ( wc_variation_form_matcher.variations_match( variation.attributes, settings ) ) {
                    matching.push( variation );
                }
            }
            return matching;
        },
        variations_match: function( attrs1, attrs2 ) {
            var match = true;
            for ( var attr_name in attrs1 ) {
                if ( attrs1.hasOwnProperty( attr_name ) ) {
                    var val1 = attrs1[ attr_name ];
                    var val2 = attrs2[ attr_name ];
                    if ( val1 !== undefined && val2 !== undefined && val1.length !== 0 && val2.length !== 0 && val1 !== val2 ) {
                        match = false;
                    }
                }
            }
            return match;
        }
    };

    /**
     * Stores the default text for an element so it can be reset later
     */
    $.fn.wc_set_content = function( content ) {
        if ( undefined === this.attr( 'data-o_content' ) ) {
            this.attr( 'data-o_content', this.text() );
        }
        this.text( content );
    };

    /**
     * Stores the default text for an element so it can be reset later
     */
    $.fn.wc_reset_content = function() {
        if ( undefined !== this.attr( 'data-o_content' ) ) {
            this.text( this.attr( 'data-o_content' ) );
        }
    };

    /**
     * Stores a default attribute for an element so it can be reset later
     */
    $.fn.wc_set_variation_attr = function( attr, value ) {
        if ( undefined === this.attr( 'data-o_' + attr ) ) {
            this.attr( 'data-o_' + attr, ( ! this.attr( attr ) ) ? '' : this.attr( attr ) );
        }
        this.attr( attr, value );
    };

    /**
     * Reset a default attribute for an element so it can be reset later
     */
    $.fn.wc_reset_variation_attr = function( attr ) {
        if ( undefined !== this.attr( 'data-o_' + attr ) ) {
            this.attr( attr, this.attr( 'data-o_' + attr ) );
        }
    };

    /**
     * Sets product images for the chosen variation
     */
    $.fn.wc_variations_image_update = function( variation ) {
        var $form             = this,
            $product          = $form.closest('.product'),
            $product_img      = $product.find( 'div.images img:eq(0)' ),
            $product_link     = $product.find( 'div.images a.zoom:eq(0)' );

        if ( variation && variation.image_src && variation.image_src.length > 1 ) {
            $product_img.wc_set_variation_attr( 'src', variation.image_src );
            $product_img.wc_set_variation_attr( 'title', variation.image_title );
            $product_img.wc_set_variation_attr( 'alt', variation.image_title );
            $product_img.wc_set_variation_attr( 'srcset', variation.image_srcset );
            $product_img.wc_set_variation_attr( 'sizes', variation.image_sizes );
            $product_link.wc_set_variation_attr( 'href', variation.image_link );
            $product_link.wc_set_variation_attr( 'title', variation.image_caption );
        } else {
            $product_img.wc_reset_variation_attr( 'src' );
            $product_img.wc_reset_variation_attr( 'title' );
            $product_img.wc_reset_variation_attr( 'alt' );
            $product_img.wc_reset_variation_attr( 'srcset' );
            $product_img.wc_reset_variation_attr( 'sizes' );
            $product_link.wc_reset_variation_attr( 'href' );
            $product_link.wc_reset_variation_attr( 'title' );
        }
    };

    $( function() {
        if ( typeof wc_add_to_cart_variation_params !== 'undefined' ) {
            $( '.variations_form' ).each( function() {
                $( this ).wc_variation_form().find('.variations select:eq(0)').change();
            });
        }
    });

})( jQuery, window, document );
