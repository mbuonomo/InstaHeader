/*
 *  Project: Instaheader
 *  Description: Instagram Header made easy
 *  Author: Mathieu BUONOMO <www.mathieubuonomo.com>
 *  Version: 0.6
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

    // HTML5 PageVisibility API
    // http://www.html5rocks.com/en/tutorials/pagevisibility/intro/
    // by Joe Marini (@joemarini)
    function getHiddenProp(){
        var prefixes = ['webkit','moz','ms','o'];

        // if 'hidden' is natively supported just return it
        if ('hidden' in document) return 'hidden';

        // otherwise loop over all the known prefixes until we find one
        for (var i = 0; i < prefixes.length; i++){
            if ((prefixes[i] + 'Hidden') in document) 
                return prefixes[i] + 'Hidden';
        }

        // otherwise it's not supported
        return null;
    }
    function isHidden() {
        var prop = getHiddenProp();
        if (!prop) return false;

        return document[prop];
    }

    function isEmpty( obj ) {
        return Object.keys(obj).length === 0;
    }


;(function ( $, window, document, undefined ) {

    var pluginName = "instaheader",
        defaults = {
            auto: true,
            selector:'img',
            imgs:[],
            urls:[],
            time:3000,
            animate:true,
            scan:false,
            animation_time:800,
            animationType:'random'
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
            if(typeof(Modernizr) == 'undefined' ){
                console.error('Modernizr is required : http://modernizr.com/');
            }else{
                var self = this,
                    transEndEventNames = {
                        'WebkitTransition' : 'webkitTransitionEnd',
                        'MozTransition' : 'transitionend',
                        'OTransition' : 'oTransitionEnd',
                        'msTransition' : 'MSTransitionEnd',
                        'transition' : 'transitionend'
                    };

                // support CSS transitions and 3d transforms
                this.supportTransitions = Modernizr.csstransitions;
                this.supportTransforms3D = Modernizr.csstransforms3d;

                this.transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ] + '.gridrotator';
                // all animation types for the random option
                this.animTypes = this.supportTransforms3D ? [
                    'fadeInOut',
                    'slideLeft', 
                    'slideRight', 
                    'slideTop', 
                    'slideBottom', 
                    'rotateLeft', 
                    'rotateRight', 
                    'rotateTop', 
                    'rotateBottom', 
                    'scale', 
                    'rotate3d', 
                    'rotateLeftScale', 
                    'rotateRightScale', 
                    'rotateTopScale', 
                    'rotateBottomScale' ] :
                    [ 'fadeInOut', 'slideLeft', 'slideRight', 'slideTop', 'slideBottom' ];

                this.animType = 'random';

                if( this.animType !== 'random' && !this.supportTransforms3D && $.inArray( this.animType, this.animTypes ) === -1 && this.animType !== 'showHide' ) {

                    // fallback to 'fadeInOut' if user sets a type which is not supported
                    this.animType = 'fadeInOut';

                }

                this.animTypesTotal = this.animTypes.length;
                this.draw(this.element, this.options);
            }
        },
        // get which type of animation
        _getAnimType : function() {

            return this.options.animationType === 'random' ? this.animTypes[ Math.floor( Math.random() * this.animTypesTotal ) ] : this.options.animationType;

        },

        // get css properties for the transition effect
        _getAnimProperties : function( $out ) {

            var startInProp = {}, startOutProp = {}, endInProp = {}, endOutProp = {},
                animType = this._getAnimType(), speed, delay = 0;

            switch( animType ) {

                case 'showHide' :
                    
                    speed = 0;
                    endOutProp.opacity = 0;
                    break;

                case 'fadeInOut' :

                    endOutProp.opacity = 0;
                    break;

                case 'slideLeft' :
                    
                    startInProp.left = $out.width();
                    endInProp.left = 0;
                    endOutProp.left = -$out.width();
                    break;

                case 'slideRight' :
                    
                    startInProp.left = -$out.width();
                    endInProp.left = 0;
                    endOutProp.left = $out.width();
                    break;

                case 'slideTop' :
                    
                    startInProp.top = $out.height();
                    endInProp.top = 0;
                    endOutProp.top = -$out.height();
                    break;

                case 'slideBottom' :
                    
                    startInProp.top = -$out.height();
                    endInProp.top = 0;
                    endOutProp.top = $out.height();
                    break;

                case 'rotateLeft' :
                    
                    speed = this.options.animation_time / 2;
                    startInProp.transform = 'rotateY(90deg)';
                    endInProp.transform = 'rotateY(0deg)';
                    delay = speed;
                    endOutProp.transform = 'rotateY(-90deg)';
                    break;

                case 'rotateRight' :
                    
                    speed = this.options.animation_time / 2;
                    startInProp.transform = 'rotateY(-90deg)';
                    endInProp.transform = 'rotateY(0deg)';
                    delay = speed;
                    endOutProp.transform = 'rotateY(90deg)';
                    break;

                case 'rotateTop' :
                    
                    speed = this.options.animation_time / 2;
                    startInProp.transform= 'rotateX(90deg)';
                    endInProp.transform = 'rotateX(0deg)';
                    delay = speed;
                    endOutProp.transform = 'rotateX(-90deg)';
                    break;

                case 'rotateBottom' :
                    
                    speed = this.options.animation_time / 2;
                    startInProp.transform = 'rotateX(-90deg)';
                    endInProp.transform = 'rotateX(0deg)';
                    delay = speed;
                    endOutProp.transform = 'rotateX(90deg)';
                    break;

                case 'scale' :
                    
                    speed = this.options.animation_time / 2;
                    startInProp.transform = 'scale(0)';
                    startOutProp.transform = 'scale(1)';
                    endInProp.transform = 'scale(1)';
                    delay = speed;
                    endOutProp.transform = 'scale(0)';
                    break;

                case 'rotateLeftScale' :
                    
                    startOutProp.transform = 'scale(1)';
                    speed = this.options.animation_time / 2; 
                    startInProp.transform = 'scale(0.3) rotateY(90deg)';
                    endInProp.transform = 'scale(1) rotateY(0deg)';
                    delay = speed;
                    endOutProp.transform = 'scale(0.3) rotateY(-90deg)';
                    break;

                case 'rotateRightScale' :
                    
                    startOutProp.transform = 'scale(1)';
                    speed = this.options.animation_time / 2;
                    startInProp.transform = 'scale(0.3) rotateY(-90deg)';
                    endInProp.transform = 'scale(1) rotateY(0deg)';
                    delay = speed;
                    endOutProp.transform = 'scale(0.3) rotateY(90deg)';
                    break;

                case 'rotateTopScale' :
                    
                    startOutProp.transform = 'scale(1)';
                    speed = this.options.animation_time / 2;
                    startInProp.transform = 'scale(0.3) rotateX(90deg)';
                    endInProp.transform = 'scale(1) rotateX(0deg)';
                    delay = speed;
                    endOutProp.transform = 'scale(0.3) rotateX(-90deg)';
                    break;

                case 'rotateBottomScale' :
                    
                    startOutProp.transform = 'scale(1)';
                    speed = this.options.animation_time / 2;
                    startInProp.transform = 'scale(0.3) rotateX(-90deg)';
                    endInProp.transform = 'scale(1) rotateX(0deg)';
                    delay = speed;
                    endOutProp.transform = 'scale(0.3) rotateX(90deg)';
                    break;

                case 'rotate3d' :
                    
                    speed = this.options.animation_time / 2;
                    startInProp.transform = 'rotate3d( 1, 1, 0, 90deg )';
                    endInProp.transform = 'rotate3d( 1, 1, 0, 0deg )';
                    delay = speed;
                    endOutProp.transform = 'rotate3d( 1, 1, 0, -90deg )';
                    break;

            }

            return {
                startInProp : startInProp,
                startOutProp : startOutProp,
                endInProp : endInProp,
                endOutProp : endOutProp,                
                delay : delay,
                animSpeed : speed != undefined ? speed : this.options.animation_time
            };

        },

        _setTransition : function( el, prop, speed, delay, easing ) {

            setTimeout( function() {
                el.css( 'transition', prop + ' ' + speed + 'ms ' + delay + 'ms ' + easing );
            }, 25 );

        },
        _applyTransition : function( el, styleCSS, speed, fncomplete, force ) {

            var self = this;
            setTimeout( function() {
                $.fn.applyStyle = self.supportTransitions ? $.fn.css : $.fn.animate;

                if( fncomplete && self.supportTransitions ) {

                    el.on( self.transEndEventName, fncomplete );

                    if( force ) {
                        fncomplete.call( el );                  
                    }

                }

                fncomplete = fncomplete || function() { return false; };

                el.stop().applyStyle( styleCSS, $.extend( true, [], { duration : speed + 'ms', complete : fncomplete } ) );
            }, 25 );

        },

        draw: function(el, options) {
            var withurl = false;
            var that = this;
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

                if(options.imgs.length == 0){
                    console.error('['+pluginName+'] No images found. Please set a images list');
                }
                if (options.urls.length > 0) {
                    if(options.urls.length != options.imgs.length) {
                        console.error('['+pluginName+'] You must set the exact same number of urls and images');
                    }else {
                        withurl = true;
                    }
                }
                $(options.imgs).each(function(index, img){
                    if(withurl){
                        imgs.push({key:index, link:options.urls[index], url:img});
                    }else {
                        imgs.push({key:index, url:img});
                    }
                });
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
                if(typeof(imgs[index]) != 'undefined'){
                    var i = imgs[index];
                    if(options.selector == 'img' && withurl === false) {
                        $(item).html('<a href="javascript:void(0);" rel="'+i.key+'" style="background-image:url('+i.url+')"></a>');
                    } else {
                        $(item).html('<a href="'+i.link+'" style="background-image:url('+i.url+')"></a>');
                    }
                }
            });

            if (options.animate) {
                setInterval(function(){

                    var imgs_clone = imgs.slice();

                    $('.instaheader').find('a').each(function(index, item){
                        
                        var rel = parseInt($(item).attr('rel'));

                        $(imgs_clone).each(function(current, it){
                            if (it.key == rel) {
                                imgs_clone.splice(current,1);
                            }
                        });
                    });

                    var new_index = Math.floor(Math.random()*imgs_clone.length);
                    if(typeof(imgs_clone[new_index]) != 'undefined'){
                        var i = imgs_clone[new_index];
                        var d = divs[Math.floor(Math.random()*divs.length)];
                        var $out = $('.instaheader .img'+d);

                        var self = this,
                            $outA = $out.children( 'a:last' ),
                            newElProp = {
                                width : $outA.width(),
                                height : $outA.height(),
                                backgroundImage: 'url("'+i.url+'")'

                            };

                        // element stays active
                        $out.data( 'active', true );
                        $inA = $('<a href="" rel="'+i.key+'" ></a>');
                        // prepend in element
                        $inA.css( newElProp ).prependTo( $out );

                        var animProp = that._getAnimProperties( $outA );

                        $inA.css( animProp.startInProp );
                        $outA.css( animProp.startOutProp );

                        that._setTransition( $inA, 'all', animProp.animSpeed, animProp.delay, 'linear' );
                        that._setTransition( $outA, 'all', animProp.animSpeed, 0, 'linear' );

                        that._applyTransition( $inA, animProp.endInProp, that.options.animation_time, function() {

                            var $el = $( this ),
                                t = animProp.animSpeed === that.options.animation_time && isEmpty( animProp.endInProp ) ? animProp.animSpeed : 0;
                                
                            setTimeout( function() {
                                
                                if( self.supportTransitions ) {
                                    $el.off( self.transEndEventName );
                                }
                                
                                $el.next().remove();
                                $el.parent().data( 'active', false );

                            }, t );

                        }, animProp.animSpeed === 0 || isEmpty( animProp.endInProp ) );
                        that._applyTransition( $outA, animProp.endOutProp, animProp.animSpeed );

                    }
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