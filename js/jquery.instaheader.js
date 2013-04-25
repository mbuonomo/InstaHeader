/*
 *  Project: Instaheader
 *  Description: Instagram Header made easy
 *  Author: Mathieu BUONOMO <www.mathieubuonomo.com>
 *  License: 
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "instaheader",
        defaults = {
            auto: true,
            imgs:[],
            time:3000,
            animate:true
        };
    var imgs = new Array();
    var divs = Array(1,2,3,4,5,6,7);
    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            this.draw(this.element, this.options);
        },

        draw: function(el, options) {

            if (options.auto === true) {
                $('img').each(function(index, item){
                    imgs.push($(item).attr('src'));
                });
            } else {
                imgs = options.imgs;
            }

            if (imgs.length == 0) {
                console.error('['+pluginName+'] No images found. Please set a images list');
            }

            //on recupere la largeur du div
            var w = $(el).width();
            var unit = Math.round(w/5);
            var bunit = unit*2;
            var h = unit*2;


            var html = '<div class="col" style="width:'+unit+'px"><div class="img1" style="height:'+unit+'px;"></div><div class="img2" style="height:'+unit+'px;"></div></div><div class="col" style="width:'+bunit+'px"><div class="img3" style="height:'+h+'px;"></div></div><div class="col" style="width:'+bunit+'px"><div class="img4" style="height:'+unit+'px;width:'+unit+'px;"></div><div class="img5" style="height:'+unit+'px;width:'+unit+'px;"></div><div class="img6" style="height:'+unit+'px;width:'+unit+'px;"></div><div class="img7" style="height:'+unit+'px;width:'+unit+'px;"></div></div>';
            $(el).html('<div class="instaheader" style="height:'+h+'px;">'+html+'</div>');

            $('.instaheader .col > div').each(function(index, item) {
                var i = imgs[Math.floor(Math.random()*imgs.length)];
                $(item).html('<img src="'+i+'" />');
            });

            if (options.animate) {
                setInterval(function(){
                    var i = imgs[Math.floor(Math.random()*imgs.length)];
                    var d = divs[Math.floor(Math.random()*divs.length)];

                    $('.img'+d+' > img').attr('src', i);
                }, options.time);                
            }
        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );