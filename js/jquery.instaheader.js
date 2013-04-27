/*
 *  Project: Instaheader
 *  Description: Instagram Header made easy
 *  Author: Mathieu BUONOMO <www.mathieubuonomo.com>
 *  Version: 0.4
 *  License: Permission is hereby granted, free of charge, to any person obtaining
 *  a copy of this software and associated documentation files (the
 *  "Software"), to deal in the Software without restriction, including
 *  without limitation the rights to use, copy, modify, merge, publish,
 *  distribute, sublicense, and/or sell copies of the Software, and to
 *  permit persons to whom the Software is furnished to do so, subject to
 *  the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 *  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 *  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function ( $, window, document, undefined ) {

    var pluginName = "instaheader",
        defaults = {
            auto: true,
            selector:'img',
            imgs:[],
            time:3000,
            animate:true,
            scan:false,
            animation_time:500
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
                    if(options.selector === 'img'){
                        $('img').each(function(index, item){
                            imgs.push({key:index, url:$(item).attr('src')});
                        });
                    }else {
                        $('a').each(function(index, item){
                            var first = $(item).first('img');
                            imgs.push({key:index, link:$(item).attr('href'), url:$(first).attr('src')});
                        });
                    }
                } else {

                    if(options.selector === 'img'){
                        $(options.scan).find('img').each(function(index, item){
                            imgs.push({key:index, url:$(item).attr('src')});
                        });
                    }else {
                        $(options.scan).find('a').each(function(index, item){
                            var first = $(item).find('img');
                            imgs.push({key:index, link:$(item).attr('href'), url:$(first[0]).attr('src')});
                        });
                    }
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
                if(options.selector == 'img') {
                    $(item).html('<img rel="'+i.key+'" src="'+i.url+'" class="active first"/><img class="last" />');
                } else {
                    $(item).html('<a href="'+i.link+'"><img rel="'+i.key+'" src="'+i.url+'" class="active first"/></a><a href="'+i.link+'"><img class="last" /></a>');
                }
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

                    $('.img'+d+' img.last').attr('src', i.url).attr('rel', i.key);

                    if(options.selector == 'a'){
                        $('.img'+d+' > img.last').parent('a').attr('src', i.url).attr('rel', i.key);
                    }
                    var $active = $('.img'+d+' img.first');
                    var $next = $('.img'+d+' img.last');

                    $('.img'+d+' > img.last').css('z-index',1);

                    $active.fadeOut(options.animation_time,function(){

                        $active.css('z-index',1).show().removeClass('active');
                        $active.attr('rel', '');
                        $active.attr('src', '');

                        $next.css('z-index',3).addClass('active');

                        $active.removeClass('first').addClass('last');
                        $next.removeClass('last').addClass('first');

                    });
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