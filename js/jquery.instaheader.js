/*
 *  Project: Instaheader
 *  Description: Instagram Header made easy
 *  Author: Mathieu BUONOMO <www.mathieubuonomo.com>
 *  License: 
 */

;(function ( $, window, document, undefined ) {

    var pluginName = "instaheader",
        defaults = {
            auto: true,
            imgs:[],
            time:3000,
            animate:true,
            scan:false
        };

    var imgs = new Array();
    var divs = Array(1,2,3,4,5,6,7);
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            this.draw(this.element, this.options);
        },

        draw: function(el, options) {

            if (options.auto === true) {
                if(options.scan === false) {
                    $('img').each(function(index, item){
                        imgs.push({key:index, url:$(item).attr('src')});
                    });
                } else {
                    $(options.scan).find('img').each(function(index, item){
                        imgs.push({key:index, url:$(item).attr('src')});
                    });
                }
            } else {
                imgs = options.imgs;
            }

            if (imgs.length == 0) {
                console.error('['+pluginName+'] No images found. Please set a images list');
            }

            var w = $(el).width();
            var unit = Math.round(w/5);
            var bunit = unit*2;
            var h = unit*2;


            var html = '<div class="col" style="width:'+unit+'px"><div class="img1" style="height:'+unit+'px;"></div><div class="img2" style="height:'+unit+'px;"></div></div><div class="col" style="width:'+bunit+'px"><div class="img3" style="height:'+h+'px;"></div></div><div class="col" style="width:'+bunit+'px"><div class="img4" style="height:'+unit+'px;width:'+unit+'px;"></div><div class="img5" style="height:'+unit+'px;width:'+unit+'px;"></div><div class="img6" style="height:'+unit+'px;width:'+unit+'px;"></div><div class="img7" style="height:'+unit+'px;width:'+unit+'px;"></div></div>';
            $(el).html('<div class="instaheader" style="height:'+h+'px;">'+html+'</div>');

            $('.instaheader .col > div').each(function(index, item) {
                var i = imgs[index];
                $(item).html('<img rel="'+i.key+'" src="'+i.url+'" />');
            });

            if (options.animate) {
                setInterval(function(){

                    var imgs_clone = imgs.slice();

                    $('.instaheader').find('img').each(function(index, item){
                        
                        var rel = parseInt($(item).attr('rel'));

                        $(imgs_clone).each(function(current, it){
                            if (it.key == rel) {
                                imgs_clone.splice(current,1);
                            }
                        });
                    });

                    var new_index = Math.floor(Math.random()*imgs_clone.length);
                    var i = imgs_clone[new_index];
                    var d = divs[Math.floor(Math.random()*divs.length)];

                    $('.img'+d+' > img').attr('src', i.url).attr('rel', i.key);
                }, options.time);                
            }
        }

    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );