'use strict';

function isMobile() {
    return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/BlackBerry/);
}

//Height
//Doing this just for window detection
jQuery.browser = {};
(function() {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

//SET VIEW PORT HEIGHT Functionally
function getBrowserHeight() {
    if ($.browser.msie) {
        return document.compatMode == 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight;
    } else {
        return self.innerHeight;
    }
}

function getBrowserWidth() {
    if ($.browser.msie) {
        return document.compatMode == 'CSS1Compat' ? document.documentElement.clientWidth : document.body.clientWidth;
    } else {
        return self.innerWidth;
    }
}
//# sourceMappingURL=viewport.js.map

'use strict';

/*!
 * Slidebars - A jQuery Framework for Off-Canvas Menus and Sidebars
 * Version: 2.0.2
 * Url: http://www.adchsm.com/slidebars/
 * Author: Adam Charles Smith
 * Author url: http://www.adchsm.com/
 * License: MIT
 * License url: http://www.adchsm.com/slidebars/license/
 */

var slidebars = function() {

    /**
     * Setup
     */

    // Cache all canvas elements
    var canvas = $('[canvas]'),

        // Object of Slidebars
        offCanvas = {},

        // Variables, permitted sides and styles
        init = false,
        registered = false,
        sides = ['top', 'right', 'bottom', 'left'],
        styles = ['reveal', 'push', 'overlay', 'shift'],

        /**
         * Get Animation Properties
         */

        getAnimationProperties = function(id) {
            // Variables
            var elements = $(),
                amount = '0px, 0px',
                duration = parseFloat(offCanvas[id].element.css('transitionDuration'), 10) * 1000;

            // Elements to animate
            if (offCanvas[id].style === 'reveal' || offCanvas[id].style === 'push' || offCanvas[id].style === 'shift') {
                elements = elements.add(canvas);
            }

            if (offCanvas[id].style === 'push' || offCanvas[id].style === 'overlay' || offCanvas[id].style === 'shift') {
                elements = elements.add(offCanvas[id].element);
            }

            // Amount to animate
            if (offCanvas[id].active) {
                if (offCanvas[id].side === 'top') {
                    amount = '0px, ' + offCanvas[id].element.css('height');
                } else if (offCanvas[id].side === 'right') {
                    amount = '-' + offCanvas[id].element.css('width') + ', 0px';
                } else if (offCanvas[id].side === 'bottom') {
                    amount = '0px, -' + offCanvas[id].element.css('height');
                } else if (offCanvas[id].side === 'left') {
                    amount = offCanvas[id].element.css('width') + ', 0px';
                }
            }

            // Return animation properties
            return { 'elements': elements, 'amount': amount, 'duration': duration };
        },

        /**
         * Slidebars Registration
         */

        registerSlidebar = function(id, side, style, element) {
            // Check if Slidebar is registered
            if (isRegisteredSlidebar(id)) {
                throw "Error registering Slidebar, a Slidebar with id '" + id + "' already exists.";
            }

            // Register the Slidebar
            offCanvas[id] = {
                'id': id,
                'side': side,
                'style': style,
                'element': element,
                'active': false
            };
        },

        isRegisteredSlidebar = function(id) {
            // Return if Slidebar is registered
            if (offCanvas.hasOwnProperty(id)) {
                return true;
            } else {
                return false;
            }
        };

    /**
     * Initialization
     */

    this.init = function(callback) {
        // Check if Slidebars has been initialized
        if (init) {
            throw "Slidebars has already been initialized.";
        }

        // Loop through and register Slidebars
        if (!registered) {
            $('[off-canvas]').each(function() {
                // Get Slidebar parameters
                var parameters = $(this).attr('off-canvas').split(' ', 3);

                // Make sure a valid id, side and style are specified
                if (!parameters || !parameters[0] || sides.indexOf(parameters[1]) === -1 || styles.indexOf(parameters[2]) === -1) {
                    throw "Error registering Slidebar, please specifiy a valid id, side and style'.";
                }

                // Register Slidebar
                registerSlidebar(parameters[0], parameters[1], parameters[2], $(this));
            });

            // Set registered variable
            registered = true;
        }

        // Set initialized variable
        init = true;

        // Set CSS
        this.css();

        // Trigger event
        $(events).trigger('init');

        // Run callback
        if (typeof callback === 'function') {
            callback();
        }
    };

    this.exit = function(callback) {
        // Check if Slidebars has been initialized
        if (!init) {
            throw "Slidebars hasn't been initialized.";
        }

        // Exit
        var exit = function() {
            // Set init variable
            init = false;

            // Trigger event
            $(events).trigger('exit');

            // Run callback
            if (typeof callback === 'function') {
                callback();
            }
        };

        // Call exit, close open Slidebar if active
        if (this.getActiveSlidebar()) {
            this.close(exit);
        } else {
            exit();
        }
    };

    /**
     * CSS
     */

    this.css = function(callback) {
        // Check if Slidebars has been initialized
        if (!init) {
            throw "Slidebars hasn't been initialized.";
        }

        // Loop through Slidebars to set negative margins
        for (var id in offCanvas) {
            // Check if Slidebar is registered
            if (isRegisteredSlidebar(id)) {
                // Calculate offset
                var offset;

                if (offCanvas[id].side === 'top' || offCanvas[id].side === 'bottom') {
                    offset = offCanvas[id].element.css('height');
                } else {
                    offset = offCanvas[id].element.css('width');
                }

                // Apply negative margins
                if (offCanvas[id].style === 'push' || offCanvas[id].style === 'overlay' || offCanvas[id].style === 'shift') {
                    offCanvas[id].element.css('margin-' + offCanvas[id].side, '-' + offset);
                }
            }
        }

        // Reposition open Slidebars
        if (this.getActiveSlidebar()) {
            this.open(this.getActiveSlidebar());
        }

        // Trigger event
        $(events).trigger('css');

        // Run callback
        if (typeof callback === 'function') {
            callback();
        }
    };

    /**
     * Controls
     */

    this.open = function(id, callback) {
        // Check if Slidebars has been initialized
        if (!init) {
            throw "Slidebars hasn't been initialized.";
        }

        // Check if id wasn't passed or if Slidebar isn't registered
        if (!id || !isRegisteredSlidebar(id)) {
            throw "Error opening Slidebar, there is no Slidebar with id '" + id + "'.";
        }

        // Open
        var open = function() {
            // Set active state to true
            offCanvas[id].active = true;

            // Display the Slidebar
            offCanvas[id].element.css('display', 'block');

            // Trigger event
            $(events).trigger('opening', [offCanvas[id].id]);

            // Get animation properties
            var animationProperties = getAnimationProperties(id);

            // Apply css
            animationProperties.elements.css({
                'transition-duration': animationProperties.duration + 'ms',
                'transform': 'translate(' + animationProperties.amount + ')'
            });

            // Transition completed
            setTimeout(function() {
                // Trigger event
                $(events).trigger('opened', [offCanvas[id].id]);

                // Run callback
                if (typeof callback === 'function') {
                    callback();
                }
            }, animationProperties.duration);
        };

        // Call open, close open Slidebar if active
        if (this.getActiveSlidebar() && this.getActiveSlidebar() !== id) {
            this.close(open);
        } else {
            open();
        }
    };

    this.close = function(id, callback) {
        // Shift callback arguments
        if (typeof id === 'function') {
            callback = id;
            id = null;
        }

        // Check if Slidebars has been initialized
        if (!init) {
            throw "Slidebars hasn't been initialized.";
        }

        // Check if id was passed but isn't a registered Slidebar
        if (id && !isRegisteredSlidebar(id)) {
            throw "Error closing Slidebar, there is no Slidebar with id '" + id + "'.";
        }

        // If no id was passed, get the active Slidebar
        if (!id) {
            id = this.getActiveSlidebar();
        }

        // Close a Slidebar
        if (id && offCanvas[id].active) {
            // Set active state to false
            offCanvas[id].active = false;

            // Trigger event
            $(events).trigger('closing', [offCanvas[id].id]);

            // Get animation properties
            var animationProperties = getAnimationProperties(id);

            // Apply css
            animationProperties.elements.css('transform', '');

            // Transition completetion
            setTimeout(function() {
                // Remove transition duration
                animationProperties.elements.css('transition-duration', '');

                // Hide the Slidebar
                offCanvas[id].element.css('display', '');

                // Trigger event
                $(events).trigger('closed', [offCanvas[id].id]);

                // Run callback
                if (typeof callback === 'function') {
                    callback();
                }
            }, animationProperties.duration);
        }
    };

    this.toggle = function(id, callback) {
        // Check if Slidebars has been initialized
        if (!init) {
            throw "Slidebars hasn't been initialized.";
        }

        // Check if id wasn't passed or if Slidebar isn't registered
        if (!id || !isRegisteredSlidebar(id)) {
            throw "Error toggling Slidebar, there is no Slidebar with id '" + id + "'.";
        }

        // Check Slidebar state
        if (offCanvas[id].active) {
            // It's open, close it
            this.close(id, function() {
                // Run callback
                if (typeof callback === 'function') {
                    callback();
                }
            });
        } else {
            // It's closed, open it
            this.open(id, function() {
                // Run callback
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    };

    /**
     * Active States
     */

    this.isActive = function(id) {
        // Return init state
        return init;
    };

    this.isActiveSlidebar = function(id) {
        // Check if Slidebars has been initialized
        if (!init) {
            throw "Slidebars hasn't been initialized.";
        }

        // Check if id wasn't passed
        if (!id) {
            throw "You must provide a Slidebar id.";
        }

        // Check if Slidebar is registered
        if (!isRegisteredSlidebar(id)) {
            throw "Error retrieving Slidebar, there is no Slidebar with id '" + id + "'.";
        }

        // Return the active state
        return offCanvas[id].active;
    };

    this.getActiveSlidebar = function() {
        // Check if Slidebars has been initialized
        if (!init) {
            throw "Slidebars hasn't been initialized.";
        }

        // Variable to return
        var active = false;

        // Loop through Slidebars
        for (var id in offCanvas) {
            // Check if Slidebar is registered
            if (isRegisteredSlidebar(id)) {
                // Check if it's active
                if (offCanvas[id].active) {
                    // Set the active id
                    active = offCanvas[id].id;
                    break;
                }
            }
        }

        // Return
        return active;
    };

    this.getSlidebars = function() {
        // Check if Slidebars has been initialized
        if (!init) {
            throw "Slidebars hasn't been initialized.";
        }

        // Create an array for the Slidebars
        var slidebarsArray = [];

        // Loop through Slidebars
        for (var id in offCanvas) {
            // Check if Slidebar is registered
            if (isRegisteredSlidebar(id)) {
                // Add Slidebar id to array
                slidebarsArray.push(offCanvas[id].id);
            }
        }

        // Return
        return slidebarsArray;
    };

    this.getSlidebar = function(id) {
        // Check if Slidebars has been initialized
        if (!init) {
            throw "Slidebars hasn't been initialized.";
        }

        // Check if id wasn't passed
        if (!id) {
            throw "You must pass a Slidebar id.";
        }

        // Check if Slidebar is registered
        if (!id || !isRegisteredSlidebar(id)) {
            throw "Error retrieving Slidebar, there is no Slidebar with id '" + id + "'.";
        }

        // Return the Slidebar's properties
        return offCanvas[id];
    };

    /**
     * Events
     */

    this.events = {};
    var events = this.events;

    /**
     * Resizes
     */

    $(window).on('resize', this.css.bind(this));
};

'use strict';

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function swing(x, t, b, c, d) {
        //alert(jQuery.easing.default);
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function easeInQuad(x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function easeOutQuad(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function easeInOutQuad(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * (--t * (t - 2) - 1) + b;
    },
    easeInCubic: function easeInCubic(x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function easeOutCubic(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function easeInOutCubic(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function easeInQuart(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function easeOutQuart(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function easeInOutQuart(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function easeInQuint(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function easeOutQuint(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function easeInOutQuint(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function easeInSine(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function easeOutSine(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function easeInOutSine(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function easeInExpo(x, t, b, c, d) {
        return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function easeOutExpo(x, t, b, c, d) {
        return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function easeInOutExpo(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function easeInCirc(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function easeOutCirc(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function easeInOutCirc(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function easeInElastic(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function easeOutElastic(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function easeInOutElastic(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack: function easeInBack(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function easeOutBack(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function easeInOutBack(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function easeInBounce(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function easeOutBounce(x, t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
        }
    },
    easeInOutBounce: function easeInOutBounce(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
//# sourceMappingURL=jquery.easing.1.3.js.map

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj; } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// Sticky Plugin v1.0.3 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    var slice = Array.prototype.slice; // save ref to original slice()
    var splice = Array.prototype.splice; // save ref to original slice()

    var defaults = {
            topSpacing: 0,
            bottomSpacing: 0,
            className: 'is-sticky',
            wrapperClassName: 'sticky-wrapper',
            center: false,
            getWidthFrom: '',
            widthFromWrapper: true, // works only when .getWidthFrom is empty
            responsiveWidth: false
        },
        $window = $(window),
        $document = $(document),
        sticked = [],
        windowHeight = $window.height(),
        scroller = function() {
            var scrollTop = $window.scrollTop(),
                documentHeight = $document.height(),
                dwh = documentHeight - windowHeight,
                extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

            for (var i = 0, l = sticked.length; i < l; i++) {
                var s = sticked[i],
                    elementTop = s.stickyWrapper.offset().top,
                    etse = elementTop - s.topSpacing - extra;

                //update height in case of dynamic content
                s.stickyWrapper.css('height', s.stickyElement.outerHeight());
                console.log('height');

                if (scrollTop <= etse) {
                    if (s.currentTop !== null) {
                        s.stickyElement
                            .css({
                                'width': '',
                                'position': '',
                                'top': ''
                            });
                        s.stickyElement.parent().removeClass(s.className);
                        s.stickyElement.trigger('sticky-end', [s]);
                        s.currentTop = null;
                    }
                } else {
                    var newTop = documentHeight - s.stickyElement.outerHeight() - s.topSpacing - s.bottomSpacing - scrollTop - extra;
                    if (newTop < 0) {
                        newTop = newTop + s.topSpacing;
                    } else {
                        newTop = s.topSpacing;
                    }
                    if (s.currentTop !== newTop) {
                        var newWidth;
                        if (s.getWidthFrom) {
                            newWidth = $(s.getWidthFrom).width() || null;
                        } else if (s.widthFromWrapper) {
                            newWidth = s.stickyWrapper.width();
                        }
                        if (newWidth == null) {
                            newWidth = s.stickyElement.width();
                        }
                        s.stickyElement
                            .css('width', newWidth)
                            .css('position', 'fixed')
                            .css('top', newTop);

                        s.stickyElement.parent().addClass(s.className);

                        if (s.currentTop === null) {
                            s.stickyElement.trigger('sticky-start', [s]);
                        } else {
                            // sticky is started but it have to be repositioned
                            s.stickyElement.trigger('sticky-update', [s]);
                        }

                        if (s.currentTop === s.topSpacing && s.currentTop > newTop || s.currentTop === null && newTop < s.topSpacing) {
                            // just reached bottom || just started to stick but bottom is already reached
                            s.stickyElement.trigger('sticky-bottom-reached', [s]);
                        } else if (s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) {
                            // sticky is started && sticked at topSpacing && overflowing from top just finished
                            s.stickyElement.trigger('sticky-bottom-unreached', [s]);
                        }

                        s.currentTop = newTop;
                    }
                }
            }
        },
        resizer = function() {
            windowHeight = $window.height();

            for (var i = 0, l = sticked.length; i < l; i++) {
                var s = sticked[i];
                var newWidth = null;
                if (s.getWidthFrom) {
                    if (s.responsiveWidth) {
                        newWidth = $(s.getWidthFrom).width();
                    }
                } else if (s.widthFromWrapper) {
                    newWidth = s.stickyWrapper.width();
                }
                if (newWidth != null) {
                    s.stickyElement.css('width', newWidth);
                }
            }
        },
        methods = {
            init: function(options) {
                var o = $.extend({}, defaults, options);
                return this.each(function() {
                    var stickyElement = $(this);

                    var stickyId = stickyElement.attr('id');
                    var stickyHeight = stickyElement.outerHeight();
                    var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName;
                    var wrapper = $('<div></div>')
                        .attr('id', wrapperId)
                        .addClass(o.wrapperClassName);

                    stickyElement.wrapAll(wrapper);

                    var stickyWrapper = stickyElement.parent();

                    if (o.center) {
                        stickyWrapper.css({ width: stickyElement.outerWidth(), marginLeft: "auto", marginRight: "auto" });
                    }

                    if (stickyElement.css("float") === "right") {
                        stickyElement.css({ "float": "none" }).parent().css({ "float": "right" });
                    }

                    stickyWrapper.css('height', stickyHeight);

                    o.stickyElement = stickyElement;
                    o.stickyWrapper = stickyWrapper;
                    o.currentTop = null;

                    sticked.push(o);
                });
            },
            update: scroller,
            unstick: function(options) {
                return this.each(function() {
                    var that = this;
                    var unstickyElement = $(that);

                    var removeIdx = -1;
                    var i = sticked.length;
                    while (i-- > 0) {
                        if (sticked[i].stickyElement.get(0) === that) {
                            splice.call(sticked, i, 1);
                            removeIdx = i;
                        }
                    }
                    if (removeIdx !== -1) {
                        unstickyElement.unwrap();
                        unstickyElement
                            .css({
                                'width': '',
                                'position': '',
                                'top': '',
                                'float': ''
                            });
                    }
                });
            }
        };

    // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
    if (window.addEventListener) {
        window.addEventListener('scroll', scroller, false);
        window.addEventListener('resize', resizer, false);
    } else if (window.attachEvent) {
        window.attachEvent('onscroll', scroller);
        window.attachEvent('onresize', resizer);
    }

    $.fn.sticky = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.sticky');
        }
    };

    $.fn.unstick = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.unstick.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.sticky');
        }
    };
    $(function() {
        setTimeout(scroller, 0);
    });
}));


'use strict';

/**
 * BxSlider v4.1.2 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2014, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
! function(t) {
    var e = {},
        s = { mode: 'horizontal', slideSelector: '', infiniteLoop: !0, hideControlOnEnd: !1, speed: 500, easing: null, slideMargin: 0, startSlide: 0, randomStart: !1, captions: !1, ticker: !1, tickerHover: !1, adaptiveHeight: !1, adaptiveHeightSpeed: 500, video: !1, useCSS: !0, preloadImages: 'visible', responsive: !0, slideZIndex: 50, touchEnabled: !0, swipeThreshold: 50, oneToOneTouch: !0, preventDefaultSwipeX: !0, preventDefaultSwipeY: !1, pager: !0, pagerType: 'full', pagerShortSeparator: ' / ', pagerSelector: null, buildPager: null, pagerCustom: null, controls: !0, nextText: 'Next', prevText: 'Prev', nextSelector: null, prevSelector: null, autoControls: !1, startText: 'Start', stopText: 'Stop', autoControlsCombine: !1, autoControlsSelector: null, auto: !1, pause: 4e3, autoStart: !0, autoDirection: 'next', autoHover: !1, autoDelay: 0, minSlides: 1, maxSlides: 1, moveSlides: 0, slideWidth: 0, onSliderLoad: function onSliderLoad() {}, onSlideBefore: function onSlideBefore() {}, onSlideAfter: function onSlideAfter() {}, onSlideNext: function onSlideNext() {}, onSlidePrev: function onSlidePrev() {}, onSliderResize: function onSliderResize() {} };
    t.fn.bxSlider = function(n) {
        if (0 == this.length) return this;
        if (this.length > 1) return this.each(function() {
            t(this).bxSlider(n);
        }), this;
        var o = {},
            r = this;
        e.el = this;
        var a = t(window).width(),
            l = t(window).height(),
            d = function d() {
                o.settings = t.extend({}, s, n), o.settings.slideWidth = parseInt(o.settings.slideWidth), o.children = r.children(o.settings.slideSelector), o.children.length < o.settings.minSlides && (o.settings.minSlides = o.children.length), o.children.length < o.settings.maxSlides && (o.settings.maxSlides = o.children.length), o.settings.randomStart && (o.settings.startSlide = Math.floor(Math.random() * o.children.length)), o.active = { index: o.settings.startSlide }, o.carousel = o.settings.minSlides > 1 || o.settings.maxSlides > 1, o.carousel && (o.settings.preloadImages = 'all'), o.minThreshold = o.settings.minSlides * o.settings.slideWidth + (o.settings.minSlides - 1) * o.settings.slideMargin, o.maxThreshold = o.settings.maxSlides * o.settings.slideWidth + (o.settings.maxSlides - 1) * o.settings.slideMargin, o.working = !1, o.controls = {}, o.interval = null, o.animProp = 'vertical' == o.settings.mode ? 'top' : 'left', o.usingCSS = o.settings.useCSS && 'fade' != o.settings.mode && function() {
                    var t = document.createElement('div'),
                        e = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
                    for (var i in e) {
                        if (void 0 !== t.style[e[i]]) return o.cssPrefix = e[i].replace('Perspective', '').toLowerCase(), o.animProp = '-' + o.cssPrefix + '-transform', !0;
                    }
                    return !1;
                }(), 'vertical' == o.settings.mode && (o.settings.maxSlides = o.settings.minSlides), r.data('origStyle', r.attr('style')), r.children(o.settings.slideSelector).each(function() {
                    t(this).data('origStyle', t(this).attr('style'));
                }), c();
            },
            c = function c() {
                r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'), o.viewport = r.parent(), o.loader = t('<div class="bx-loading" />'), o.viewport.prepend(o.loader), r.css({ width: 'horizontal' == o.settings.mode ? 100 * o.children.length + 215 + '%' : 'auto', position: 'relative' }), o.usingCSS && o.settings.easing ? r.css('-' + o.cssPrefix + '-transition-timing-function', o.settings.easing) : o.settings.easing || (o.settings.easing = 'swing'), f(), o.viewport.css({ width: '100%', overflow: 'hidden', position: 'relative' }), o.viewport.parent().css({ maxWidth: p() }), o.settings.pager || o.viewport.parent().css({ margin: '0 auto 0px' }), o.children.css({ 'float': 'horizontal' == o.settings.mode ? 'left' : 'none', listStyle: 'none', position: 'relative' }), o.children.css('width', u()), 'horizontal' == o.settings.mode && o.settings.slideMargin > 0 && o.children.css('marginRight', o.settings.slideMargin), 'vertical' == o.settings.mode && o.settings.slideMargin > 0 && o.children.css('marginBottom', o.settings.slideMargin), 'fade' == o.settings.mode && (o.children.css({ position: 'absolute', zIndex: 0, display: 'none' }), o.children.eq(o.settings.startSlide).css({ zIndex: o.settings.slideZIndex, display: 'block' })), o.controls.el = t('<div class="bx-controls" />'), o.settings.captions && P(), o.active.last = o.settings.startSlide == x() - 1, o.settings.video && r.fitVids();
                var e = o.children.eq(o.settings.startSlide);
                'all' == o.settings.preloadImages && (e = o.children), o.settings.ticker ? o.settings.pager = !1 : (o.settings.pager && T(), o.settings.controls && C(), o.settings.auto && o.settings.autoControls && E(), (o.settings.controls || o.settings.autoControls || o.settings.pager) && o.viewport.after(o.controls.el)), g(e, h);
            },
            g = function g(e, i) {
                var s = e.find('img, iframe').length;
                if (0 == s) return i(), void 0;
                var n = 0;
                e.find('img, iframe').each(function() {
                    t(this).one('load', function() {
                        ++n == s && i();
                    }).each(function() {
                        this.complete && t(this).load();
                    });
                });
            },
            h = function h() {
                if (o.settings.infiniteLoop && 'fade' != o.settings.mode && !o.settings.ticker) {
                    var e = 'vertical' == o.settings.mode ? o.settings.minSlides : o.settings.maxSlides,
                        i = o.children.slice(0, e).clone().addClass('bx-clone'),
                        s = o.children.slice(-e).clone().addClass('bx-clone');
                    r.append(i).prepend(s);
                }
                o.loader.remove(), S(), 'vertical' == o.settings.mode && (o.settings.adaptiveHeight = !0), o.viewport.height(v()), r.redrawSlider(), o.settings.onSliderLoad(o.active.index), o.initialized = !0, o.settings.responsive && t(window).bind('resize', Z), o.settings.auto && o.settings.autoStart && H(), o.settings.ticker && L(), o.settings.pager && q(o.settings.startSlide), o.settings.controls && W(), o.settings.touchEnabled && !o.settings.ticker && O();
            },
            v = function v() {
                var e = 0,
                    s = t();
                if ('vertical' == o.settings.mode || o.settings.adaptiveHeight) {
                    if (o.carousel) {
                        var n = 1 == o.settings.moveSlides ? o.active.index : o.active.index * m();
                        for (s = o.children.eq(n), i = 1; i <= o.settings.maxSlides - 1; i++) {
                            s = n + i >= o.children.length ? s.add(o.children.eq(i - 1)) : s.add(o.children.eq(n + i));
                        }
                    } else s = o.children.eq(o.active.index);
                } else s = o.children;
                return 'vertical' == o.settings.mode ? (s.each(function() {
                    e += t(this).outerHeight();
                }), o.settings.slideMargin > 0 && (e += o.settings.slideMargin * (o.settings.minSlides - 1))) : e = Math.max.apply(Math, s.map(function() {
                    return t(this).outerHeight(!1);
                }).get()), e;
            },
            p = function p() {
                var t = '100%';
                return o.settings.slideWidth > 0 && (t = 'horizontal' == o.settings.mode ? o.settings.maxSlides * o.settings.slideWidth + (o.settings.maxSlides - 1) * o.settings.slideMargin : o.settings.slideWidth), t;
            },
            u = function u() {
                var t = o.settings.slideWidth,
                    e = o.viewport.width();
                return 0 == o.settings.slideWidth || o.settings.slideWidth > e && !o.carousel || 'vertical' == o.settings.mode ? t = e : o.settings.maxSlides > 1 && 'horizontal' == o.settings.mode && (e > o.maxThreshold || e < o.minThreshold && (t = (e - o.settings.slideMargin * (o.settings.minSlides - 1)) / o.settings.minSlides)), t;
            },
            f = function f() {
                var t = 1;
                if ('horizontal' == o.settings.mode && o.settings.slideWidth > 0) {
                    if (o.viewport.width() < o.minThreshold) t = o.settings.minSlides;
                    else if (o.viewport.width() > o.maxThreshold) t = o.settings.maxSlides;
                    else {
                        var e = o.children.first().width();
                        t = Math.floor(o.viewport.width() / e);
                    }
                } else 'vertical' == o.settings.mode && (t = o.settings.minSlides);
                return t;
            },
            x = function x() {
                var t = 0;
                if (o.settings.moveSlides > 0) {
                    if (o.settings.infiniteLoop) t = o.children.length / m();
                    else
                        for (var e = 0, i = 0; e < o.children.length;) {
                            ++t, e = i + f(), i += o.settings.moveSlides <= f() ? o.settings.moveSlides : f();
                        }
                } else t = Math.ceil(o.children.length / f());
                return t;
            },
            m = function m() {
                return o.settings.moveSlides > 0 && o.settings.moveSlides <= f() ? o.settings.moveSlides : f();
            },
            S = function S() {
                if (o.children.length > o.settings.maxSlides && o.active.last && !o.settings.infiniteLoop) {
                    if ('horizontal' == o.settings.mode) {
                        var t = o.children.last(),
                            e = t.position();
                        b(-(e.left - (o.viewport.width() - t.width())), 'reset', 0);
                    } else if ('vertical' == o.settings.mode) {
                        var i = o.children.length - o.settings.minSlides,
                            e = o.children.eq(i).position();
                        b(-e.top, 'reset', 0);
                    }
                } else {
                    var e = o.children.eq(o.active.index * m()).position();
                    o.active.index == x() - 1 && (o.active.last = !0), void 0 != e && ('horizontal' == o.settings.mode ? b(-e.left, 'reset', 0) : 'vertical' == o.settings.mode && b(-e.top, 'reset', 0));
                }
            },
            b = function b(t, e, i, s) {
                if (o.usingCSS) {
                    var n = 'vertical' == o.settings.mode ? 'translate3d(0, ' + t + 'px, 0)' : 'translate3d(' + t + 'px, 0, 0)';
                    r.css('-' + o.cssPrefix + '-transition-duration', i / 1e3 + 's'), 'slide' == e ? (r.css(o.animProp, n), r.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
                        r.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd'), D();
                    })) : 'reset' == e ? r.css(o.animProp, n) : 'ticker' == e && (r.css('-' + o.cssPrefix + '-transition-timing-function', 'linear'), r.css(o.animProp, n), r.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
                        r.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd'), b(s.resetValue, 'reset', 0), N();
                    }));
                } else {
                    var a = {};
                    a[o.animProp] = t, 'slide' == e ? r.animate(a, i, o.settings.easing, function() {
                        D();
                    }) : 'reset' == e ? r.css(o.animProp, t) : 'ticker' == e && r.animate(a, speed, 'linear', function() {
                        b(s.resetValue, 'reset', 0), N();
                    });
                }
            },
            w = function w() {
                for (var e = '', i = x(), s = 0; i > s; s++) {
                    var n = '';
                    o.settings.buildPager && t.isFunction(o.settings.buildPager) ? (n = o.settings.buildPager(s), o.pagerEl.addClass('bx-custom-pager')) : (n = s + 1, o.pagerEl.addClass('bx-default-pager')), e += '<div class="bx-pager-item"><a href="" data-slide-index="' + s + '" class="bx-pager-link">' + n + '</a></div>';
                }
                o.pagerEl.html(e);
            },
            T = function T() {
                o.settings.pagerCustom ? o.pagerEl = t(o.settings.pagerCustom) : (o.pagerEl = t('<div class="bx-pager" />'), o.settings.pagerSelector ? t(o.settings.pagerSelector).html(o.pagerEl) : o.controls.el.addClass('bx-has-pager').append(o.pagerEl), w()), o.pagerEl.on('click', 'a', I);
            },
            C = function C() {
                o.controls.next = t('<a class="bx-next" href="">' + o.settings.nextText + '</a>'), o.controls.prev = t('<a class="bx-prev" href="">' + o.settings.prevText + '</a>'), o.controls.next.bind('click', y), o.controls.prev.bind('click', z), o.settings.nextSelector && t(o.settings.nextSelector).append(o.controls.next), o.settings.prevSelector && t(o.settings.prevSelector).append(o.controls.prev), o.settings.nextSelector || o.settings.prevSelector || (o.controls.directionEl = t('<div class="bx-controls-direction" />'), o.controls.directionEl.append(o.controls.prev).append(o.controls.next), o.controls.el.addClass('bx-has-controls-direction').append(o.controls.directionEl));
            },
            E = function E() {
                o.controls.start = t('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + o.settings.startText + '</a></div>'), o.controls.stop = t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + o.settings.stopText + '</a></div>'), o.controls.autoEl = t('<div class="bx-controls-auto" />'), o.controls.autoEl.on('click', '.bx-start', k), o.controls.autoEl.on('click', '.bx-stop', M), o.settings.autoControlsCombine ? o.controls.autoEl.append(o.controls.start) : o.controls.autoEl.append(o.controls.start).append(o.controls.stop), o.settings.autoControlsSelector ? t(o.settings.autoControlsSelector).html(o.controls.autoEl) : o.controls.el.addClass('bx-has-controls-auto').append(o.controls.autoEl), A(o.settings.autoStart ? 'stop' : 'start');
            },
            P = function P() {
                o.children.each(function() {
                    var e = t(this).find('img:first').attr('title');
                    void 0 != e && ('' + e).length && t(this).append('<div class="bx-caption"><span>' + e + '</span></div>');
                });
            },
            y = function y(t) {
                o.settings.auto && r.stopAuto(), r.goToNextSlide(), t.preventDefault();
            },
            z = function z(t) {
                o.settings.auto && r.stopAuto(), r.goToPrevSlide(), t.preventDefault();
            },
            k = function k(t) {
                r.startAuto(), t.preventDefault();
            },
            M = function M(t) {
                r.stopAuto(), t.preventDefault();
            },
            I = function I(e) {
                o.settings.auto && r.stopAuto();
                var i = t(e.currentTarget),
                    s = parseInt(i.attr('data-slide-index'));
                s != o.active.index && r.goToSlide(s), e.preventDefault();
            },
            q = function q(e) {
                var i = o.children.length;
                return 'short' == o.settings.pagerType ? (o.settings.maxSlides > 1 && (i = Math.ceil(o.children.length / o.settings.maxSlides)), o.pagerEl.html(e + 1 + o.settings.pagerShortSeparator + i), void 0) : (o.pagerEl.find('a').removeClass('active'), o.pagerEl.each(function(i, s) {
                    t(s).find('a').eq(e).addClass('active');
                }), void 0);
            },
            D = function D() {
                if (o.settings.infiniteLoop) {
                    var t = '';
                    0 == o.active.index ? t = o.children.eq(0).position() : o.active.index == x() - 1 && o.carousel ? t = o.children.eq((x() - 1) * m()).position() : o.active.index == o.children.length - 1 && (t = o.children.eq(o.children.length - 1).position()), t && ('horizontal' == o.settings.mode ? b(-t.left, 'reset', 0) : 'vertical' == o.settings.mode && b(-t.top, 'reset', 0));
                }
                o.working = !1, o.settings.onSlideAfter(o.children.eq(o.active.index), o.oldIndex, o.active.index);
            },
            A = function A(t) {
                o.settings.autoControlsCombine ? o.controls.autoEl.html(o.controls[t]) : (o.controls.autoEl.find('a').removeClass('active'), o.controls.autoEl.find('a:not(.bx-' + t + ')').addClass('active'));
            },
            W = function W() {
                1 == x() ? (o.controls.prev.addClass('disabled'), o.controls.next.addClass('disabled')) : !o.settings.infiniteLoop && o.settings.hideControlOnEnd && (0 == o.active.index ? (o.controls.prev.addClass('disabled'), o.controls.next.removeClass('disabled')) : o.active.index == x() - 1 ? (o.controls.next.addClass('disabled'), o.controls.prev.removeClass('disabled')) : (o.controls.prev.removeClass('disabled'), o.controls.next.removeClass('disabled')));
            },
            H = function H() {
                o.settings.autoDelay > 0 ? setTimeout(r.startAuto, o.settings.autoDelay) : r.startAuto(), o.settings.autoHover && r.hover(function() {
                    o.interval && (r.stopAuto(!0), o.autoPaused = !0);
                }, function() {
                    o.autoPaused && (r.startAuto(!0), o.autoPaused = null);
                });
            },
            L = function L() {
                var e = 0;
                if ('next' == o.settings.autoDirection) r.append(o.children.clone().addClass('bx-clone'));
                else {
                    r.prepend(o.children.clone().addClass('bx-clone'));
                    var i = o.children.first().position();
                    e = 'horizontal' == o.settings.mode ? -i.left : -i.top;
                }
                b(e, 'reset', 0), o.settings.pager = !1, o.settings.controls = !1, o.settings.autoControls = !1, o.settings.tickerHover && !o.usingCSS && o.viewport.hover(function() {
                    r.stop();
                }, function() {
                    var e = 0;
                    o.children.each(function() {
                        e += 'horizontal' == o.settings.mode ? t(this).outerWidth(!0) : t(this).outerHeight(!0);
                    });
                    var i = o.settings.speed / e,
                        s = 'horizontal' == o.settings.mode ? 'left' : 'top',
                        n = i * (e - Math.abs(parseInt(r.css(s))));
                    N(n);
                }), N();
            },
            N = function N(t) {
                speed = t ? t : o.settings.speed;
                var e = { left: 0, top: 0 },
                    i = { left: 0, top: 0 };
                'next' == o.settings.autoDirection ? e = r.find('.bx-clone').first().position() : i = o.children.first().position();
                var s = 'horizontal' == o.settings.mode ? -e.left : -e.top,
                    n = 'horizontal' == o.settings.mode ? -i.left : -i.top,
                    a = { resetValue: n };
                b(s, 'ticker', speed, a);
            },
            O = function O() {
                o.touch = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }, o.viewport.bind('touchstart', X);
            },
            X = function X(t) {
                if (o.working) t.preventDefault();
                else {
                    o.touch.originalPos = r.position();
                    var e = t.originalEvent;
                    o.touch.start.x = e.changedTouches[0].pageX, o.touch.start.y = e.changedTouches[0].pageY, o.viewport.bind('touchmove', Y), o.viewport.bind('touchend', V);
                }
            },
            Y = function Y(t) {
                var e = t.originalEvent,
                    i = Math.abs(e.changedTouches[0].pageX - o.touch.start.x),
                    s = Math.abs(e.changedTouches[0].pageY - o.touch.start.y);
                if (3 * i > s && o.settings.preventDefaultSwipeX ? t.preventDefault() : 3 * s > i && o.settings.preventDefaultSwipeY && t.preventDefault(), 'fade' != o.settings.mode && o.settings.oneToOneTouch) {
                    var n = 0;
                    if ('horizontal' == o.settings.mode) {
                        var r = e.changedTouches[0].pageX - o.touch.start.x;
                        n = o.touch.originalPos.left + r;
                    } else {
                        var r = e.changedTouches[0].pageY - o.touch.start.y;
                        n = o.touch.originalPos.top + r;
                    }
                    b(n, 'reset', 0);
                }
            },
            V = function V(t) {
                o.viewport.unbind('touchmove', Y);
                var e = t.originalEvent,
                    i = 0;
                if (o.touch.end.x = e.changedTouches[0].pageX, o.touch.end.y = e.changedTouches[0].pageY, 'fade' == o.settings.mode) {
                    var s = Math.abs(o.touch.start.x - o.touch.end.x);
                    s >= o.settings.swipeThreshold && (o.touch.start.x > o.touch.end.x ? r.goToNextSlide() : r.goToPrevSlide(), r.stopAuto());
                } else {
                    var s = 0;
                    'horizontal' == o.settings.mode ? (s = o.touch.end.x - o.touch.start.x, i = o.touch.originalPos.left) : (s = o.touch.end.y - o.touch.start.y, i = o.touch.originalPos.top), !o.settings.infiniteLoop && (0 == o.active.index && s > 0 || o.active.last && 0 > s) ? b(i, 'reset', 200) : Math.abs(s) >= o.settings.swipeThreshold ? (0 > s ? r.goToNextSlide() : r.goToPrevSlide(), r.stopAuto()) : b(i, 'reset', 200);
                }
                o.viewport.unbind('touchend', V);
            },
            Z = function Z() {
                var e = t(window).width(),
                    i = t(window).height();
                (a != e || l != i) && (a = e, l = i, r.redrawSlider(), o.settings.onSliderResize.call(r, o.active.index));
            };
        return r.goToSlide = function(e, i) {
            if (!o.working && o.active.index != e)
                if (o.working = !0, o.oldIndex = o.active.index, o.active.index = 0 > e ? x() - 1 : e >= x() ? 0 : e, o.settings.onSlideBefore(o.children.eq(o.active.index), o.oldIndex, o.active.index), 'next' == i ? o.settings.onSlideNext(o.children.eq(o.active.index), o.oldIndex, o.active.index) : 'prev' == i && o.settings.onSlidePrev(o.children.eq(o.active.index), o.oldIndex, o.active.index), o.active.last = o.active.index >= x() - 1, o.settings.pager && q(o.active.index), o.settings.controls && W(), 'fade' == o.settings.mode) o.settings.adaptiveHeight && o.viewport.height() != v() && o.viewport.animate({ height: v() }, o.settings.adaptiveHeightSpeed), o.children.filter(':visible').fadeOut(o.settings.speed).css({ zIndex: 0 }), o.children.eq(o.active.index).css('zIndex', o.settings.slideZIndex + 1).fadeIn(o.settings.speed, function() {
                    t(this).css('zIndex', o.settings.slideZIndex), D();
                });
                else {
                    o.settings.adaptiveHeight && o.viewport.height() != v() && o.viewport.animate({ height: v() }, o.settings.adaptiveHeightSpeed);
                    var s = 0,
                        n = { left: 0, top: 0 };
                    if (!o.settings.infiniteLoop && o.carousel && o.active.last) {
                        if ('horizontal' == o.settings.mode) {
                            var a = o.children.eq(o.children.length - 1);
                            n = a.position(), s = o.viewport.width() - a.outerWidth();
                        } else {
                            var l = o.children.length - o.settings.minSlides;
                            n = o.children.eq(l).position();
                        }
                    } else if (o.carousel && o.active.last && 'prev' == i) {
                        var d = 1 == o.settings.moveSlides ? o.settings.maxSlides - m() : (x() - 1) * m() - (o.children.length - o.settings.maxSlides),
                            a = r.children('.bx-clone').eq(d);
                        n = a.position();
                    } else if ('next' == i && 0 == o.active.index) n = r.find('> .bx-clone').eq(o.settings.maxSlides).position(), o.active.last = !1;
                    else if (e >= 0) {
                        var c = e * m();
                        n = o.children.eq(c).position();
                    }
                    if ('undefined' != typeof n) {
                        var g = 'horizontal' == o.settings.mode ? -(n.left - s) : -n.top;
                        b(g, 'slide', o.settings.speed);
                    }
                }
        }, r.goToNextSlide = function() {
            if (o.settings.infiniteLoop || !o.active.last) {
                var t = parseInt(o.active.index) + 1;
                r.goToSlide(t, 'next');
            }
        }, r.goToPrevSlide = function() {
            if (o.settings.infiniteLoop || 0 != o.active.index) {
                var t = parseInt(o.active.index) - 1;
                r.goToSlide(t, 'prev');
            }
        }, r.startAuto = function(t) {
            o.interval || (o.interval = setInterval(function() {
                'next' == o.settings.autoDirection ? r.goToNextSlide() : r.goToPrevSlide();
            }, o.settings.pause), o.settings.autoControls && 1 != t && A('stop'));
        }, r.stopAuto = function(t) {
            o.interval && (clearInterval(o.interval), o.interval = null, o.settings.autoControls && 1 != t && A('start'));
        }, r.getCurrentSlide = function() {
            return o.active.index;
        }, r.getCurrentSlideElement = function() {
            return o.children.eq(o.active.index);
        }, r.getSlideCount = function() {
            return o.children.length;
        }, r.redrawSlider = function() {
            o.children.add(r.find('.bx-clone')).outerWidth(u()), o.viewport.css('height', v()), o.settings.ticker || S(), o.active.last && (o.active.index = x() - 1), o.active.index >= x() && (o.active.last = !0), o.settings.pager && !o.settings.pagerCustom && (w(), q(o.active.index));
        }, r.destroySlider = function() {
            o.initialized && (o.initialized = !1, t('.bx-clone', this).remove(), o.children.each(function() {
                void 0 != t(this).data('origStyle') ? t(this).attr('style', t(this).data('origStyle')) : t(this).removeAttr('style');
            }), void 0 != t(this).data('origStyle') ? this.attr('style', t(this).data('origStyle')) : t(this).removeAttr('style'), t(this).unwrap().unwrap(), o.controls.el && o.controls.el.remove(), o.controls.next && o.controls.next.remove(), o.controls.prev && o.controls.prev.remove(), o.pagerEl && o.settings.controls && o.pagerEl.remove(), t('.bx-caption', this).remove(), o.controls.autoEl && o.controls.autoEl.remove(), clearInterval(o.interval), o.settings.responsive && t(window).unbind('resize', Z));
        }, r.reloadSlider = function(t) {
            void 0 != t && (n = t), r.destroySlider(), d();
        }, d(), this;
    };
}(jQuery);
//# sourceMappingURL=jquery.bxslider.min.js.map

'use strict';

/*global $ */
$(document).ready(function() {

    'use strict';

    $('.menu > ul > li:has( > ul)').addClass('menu-dropdown-icon');
    //Checks if li has sub (ul) and adds class for toggle icon - just an UI


    $('.menu > ul > li > ul:not(:has(ul))').addClass('normal-sub');
    //Checks if drodown menu's li elements have anothere level (ul), if not the dropdown is shown as regular dropdown, not a mega menu (thanks Luka Kladaric)

    // $(".menu > ul").before("<a href=\"#\" class=\"menu-mobile\">Navigation</a>");

    //Adds menu-mobile class (for mobile toggle menu) before the normal menu
    //Mobile menu is hidden if width is more then 959px, but normal menu is displayed
    //Normal menu is hidden if width is below 959px, and jquery adds mobile menu
    //Done this way so it can be used with wordpress without any trouble

    $('.menu > ul > li').hover(function(e) {
        if ($(window).width() > 943) {
            $(this).children('ul').stop(true, false).fadeToggle(150);
            e.preventDefault();
        }
    });
    //If width is more than 943px dropdowns are displayed on hover

    $('.menu > ul > li').click(function(e) {
        if ($(window).width() <= 943) {
            $(this).children('ul').fadeToggle(150);
            e.preventDefault();
        }
    });
    //If width is less or equal to 943px dropdowns are displayed on click (thanks Aman Jain from stackoverflow)

    $('.menu-mobile').click(function(e) {
        $('.menu > ul').toggleClass('show-on-mobile');
        e.preventDefault();
    });
    //when clicked on mobile-menu, normal menu is shown as a list, classic rwd menu story (thanks mwl from stackoverflow)
});
//# sourceMappingURL=megamenu.js.map

'use strict';

//============================================================
//
// The MIT License
//
// Copyright (C) 2014 Matthew Wagerfield - @wagerfield
//
// Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the
// Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
//
// The above copyright notice and this permission notice
// shall be included in all copies or substantial portions
// of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY
// OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
// AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.
//
//============================================================

/**
 * Parallax.js
 * @author Matthew Wagerfield - @wagerfield
 * @description Creates a parallax effect between an array of layers,
 *              driving the motion from the gyroscope output of a smartdevice.
 *              If no gyroscope is available, the cursor position is used.
 */
;
(function(window, document, undefined) {

    // Strict Mode
    'use strict';

    // Constants

    var NAME = 'Parallax';
    var MAGIC_NUMBER = 30;
    var DEFAULTS = {
        relativeInput: false,
        clipRelativeInput: false,
        calibrationThreshold: 100,
        calibrationDelay: 500,
        supportDelay: 500,
        calibrateX: false,
        calibrateY: true,
        invertX: true,
        invertY: true,
        limitX: false,
        limitY: false,
        scalarX: 10.0,
        scalarY: 10.0,
        frictionX: 0.1,
        frictionY: 0.1,
        originX: 0.5,
        originY: 0.5
    };

    function Parallax(element, options) {

        // DOM Context
        this.element = element;
        this.layers = element.getElementsByClassName('layer');

        // Data Extraction
        var data = {
            calibrateX: this.data(this.element, 'calibrate-x'),
            calibrateY: this.data(this.element, 'calibrate-y'),
            invertX: this.data(this.element, 'invert-x'),
            invertY: this.data(this.element, 'invert-y'),
            limitX: this.data(this.element, 'limit-x'),
            limitY: this.data(this.element, 'limit-y'),
            scalarX: this.data(this.element, 'scalar-x'),
            scalarY: this.data(this.element, 'scalar-y'),
            frictionX: this.data(this.element, 'friction-x'),
            frictionY: this.data(this.element, 'friction-y'),
            originX: this.data(this.element, 'origin-x'),
            originY: this.data(this.element, 'origin-y')
        };

        // Delete Null Data Values
        for (var key in data) {
            if (data[key] === null) delete data[key];
        }

        // Compose Settings Object
        this.extend(this, DEFAULTS, options, data);

        // States
        this.calibrationTimer = null;
        this.calibrationFlag = true;
        this.enabled = false;
        this.depths = [];
        this.raf = null;

        // Element Bounds
        this.bounds = null;
        this.ex = 0;
        this.ey = 0;
        this.ew = 0;
        this.eh = 0;

        // Element Center
        this.ecx = 0;
        this.ecy = 0;

        // Element Range
        this.erx = 0;
        this.ery = 0;

        // Calibration
        this.cx = 0;
        this.cy = 0;

        // Input
        this.ix = 0;
        this.iy = 0;

        // Motion
        this.mx = 0;
        this.my = 0;

        // Velocity
        this.vx = 0;
        this.vy = 0;

        // Callbacks
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
        this.onOrientationTimer = this.onOrientationTimer.bind(this);
        this.onCalibrationTimer = this.onCalibrationTimer.bind(this);
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        // Initialise
        this.initialise();
    }

    Parallax.prototype.extend = function() {
        if (arguments.length > 1) {
            var master = arguments[0];
            for (var i = 1, l = arguments.length; i < l; i++) {
                var object = arguments[i];
                for (var key in object) {
                    master[key] = object[key];
                }
            }
        }
    };

    Parallax.prototype.data = function(element, name) {
        return this.deserialize(element.getAttribute('data-' + name));
    };

    Parallax.prototype.deserialize = function(value) {
        if (value === 'true') {
            return true;
        } else if (value === 'false') {
            return false;
        } else if (value === 'null') {
            return null;
        } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
            return parseFloat(value);
        } else {
            return value;
        }
    };

    Parallax.prototype.camelCase = function(value) {
        return value.replace(/-+(.)?/g, function(match, character) {
            return character ? character.toUpperCase() : '';
        });
    };

    Parallax.prototype.transformSupport = function(value) {
        var element = document.createElement('div');
        var propertySupport = false;
        var propertyValue = null;
        var featureSupport = false;
        var cssProperty = null;
        var jsProperty = null;
        for (var i = 0, l = this.vendors.length; i < l; i++) {
            if (this.vendors[i] !== null) {
                cssProperty = this.vendors[i][0] + 'transform';
                jsProperty = this.vendors[i][1] + 'Transform';
            } else {
                cssProperty = 'transform';
                jsProperty = 'transform';
            }
            if (element.style[jsProperty] !== undefined) {
                propertySupport = true;
                break;
            }
        }
        switch (value) {
            case '2D':
                featureSupport = propertySupport;
                break;
            case '3D':
                if (propertySupport) {
                    var body = document.body || document.createElement('body');
                    var documentElement = document.documentElement;
                    var documentOverflow = documentElement.style.overflow;
                    if (!document.body) {
                        documentElement.style.overflow = 'hidden';
                        documentElement.appendChild(body);
                        body.style.overflow = 'hidden';
                        body.style.background = '';
                    }
                    body.appendChild(element);
                    element.style[jsProperty] = 'translate3d(1px,1px,1px)';
                    propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty);
                    featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== 'none';
                    documentElement.style.overflow = documentOverflow;
                    body.removeChild(element);
                }
                break;
        }
        return featureSupport;
    };

    Parallax.prototype.ww = null;
    Parallax.prototype.wh = null;
    Parallax.prototype.wcx = null;
    Parallax.prototype.wcy = null;
    Parallax.prototype.wrx = null;
    Parallax.prototype.wry = null;
    Parallax.prototype.portrait = null;
    Parallax.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
    Parallax.prototype.vendors = [null, ['-webkit-', 'webkit'],
        ['-moz-', 'Moz'],
        ['-o-', 'O'],
        ['-ms-', 'ms']
    ];
    Parallax.prototype.motionSupport = !!window.DeviceMotionEvent;
    Parallax.prototype.orientationSupport = !!window.DeviceOrientationEvent;
    Parallax.prototype.orientationStatus = 0;
    Parallax.prototype.propertyCache = {};

    Parallax.prototype.initialise = function() {

        if (Parallax.prototype.transform2DSupport === undefined) {
            Parallax.prototype.transform2DSupport = Parallax.prototype.transformSupport('2D');
            Parallax.prototype.transform3DSupport = Parallax.prototype.transformSupport('3D');
        }

        // Configure Context Styles
        if (this.transform3DSupport) this.accelerate(this.element);
        var style = window.getComputedStyle(this.element);
        if (style.getPropertyValue('position') === 'static') {
            this.element.style.position = 'relative';
        }

        // Setup
        this.updateLayers();
        this.updateDimensions();
        this.enable();
        this.queueCalibration(this.calibrationDelay);
    };

    Parallax.prototype.updateLayers = function() {

        // Cache Layer Elements
        this.layers = this.element.getElementsByClassName('layer');
        this.depths = [];

        // Configure Layer Styles
        for (var i = 0, l = this.layers.length; i < l; i++) {
            var layer = this.layers[i];
            if (this.transform3DSupport) this.accelerate(layer);
            layer.style.position = i ? 'absolute' : 'relative';
            layer.style.display = 'block';
            layer.style.left = 0;
            layer.style.top = 0;

            // Cache Layer Depth
            this.depths.push(this.data(layer, 'depth') || 0);
        }
    };

    Parallax.prototype.updateDimensions = function() {
        this.ww = window.innerWidth;
        this.wh = window.innerHeight;
        this.wcx = this.ww * this.originX;
        this.wcy = this.wh * this.originY;
        this.wrx = Math.max(this.wcx, this.ww - this.wcx);
        this.wry = Math.max(this.wcy, this.wh - this.wcy);
    };

    Parallax.prototype.updateBounds = function() {
        this.bounds = this.element.getBoundingClientRect();
        this.ex = this.bounds.left;
        this.ey = this.bounds.top;
        this.ew = this.bounds.width;
        this.eh = this.bounds.height;
        this.ecx = this.ew * this.originX;
        this.ecy = this.eh * this.originY;
        this.erx = Math.max(this.ecx, this.ew - this.ecx);
        this.ery = Math.max(this.ecy, this.eh - this.ecy);
    };

    Parallax.prototype.queueCalibration = function(delay) {
        clearTimeout(this.calibrationTimer);
        this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay);
    };

    Parallax.prototype.enable = function() {
        if (!this.enabled) {
            this.enabled = true;
            if (this.orientationSupport) {
                this.portrait = null;
                window.addEventListener('deviceorientation', this.onDeviceOrientation);
                setTimeout(this.onOrientationTimer, this.supportDelay);
            } else {
                this.cx = 0;
                this.cy = 0;
                this.portrait = false;
                window.addEventListener('mousemove', this.onMouseMove);
            }
            window.addEventListener('resize', this.onWindowResize);
            this.raf = requestAnimationFrame(this.onAnimationFrame);
        }
    };

    Parallax.prototype.disable = function() {
        if (this.enabled) {
            this.enabled = false;
            if (this.orientationSupport) {
                window.removeEventListener('deviceorientation', this.onDeviceOrientation);
            } else {
                window.removeEventListener('mousemove', this.onMouseMove);
            }
            window.removeEventListener('resize', this.onWindowResize);
            cancelAnimationFrame(this.raf);
        }
    };

    Parallax.prototype.calibrate = function(x, y) {
        this.calibrateX = x === undefined ? this.calibrateX : x;
        this.calibrateY = y === undefined ? this.calibrateY : y;
    };

    Parallax.prototype.invert = function(x, y) {
        this.invertX = x === undefined ? this.invertX : x;
        this.invertY = y === undefined ? this.invertY : y;
    };

    Parallax.prototype.friction = function(x, y) {
        this.frictionX = x === undefined ? this.frictionX : x;
        this.frictionY = y === undefined ? this.frictionY : y;
    };

    Parallax.prototype.scalar = function(x, y) {
        this.scalarX = x === undefined ? this.scalarX : x;
        this.scalarY = y === undefined ? this.scalarY : y;
    };

    Parallax.prototype.limit = function(x, y) {
        this.limitX = x === undefined ? this.limitX : x;
        this.limitY = y === undefined ? this.limitY : y;
    };

    Parallax.prototype.origin = function(x, y) {
        this.originX = x === undefined ? this.originX : x;
        this.originY = y === undefined ? this.originY : y;
    };

    Parallax.prototype.clamp = function(value, min, max) {
        value = Math.max(value, min);
        value = Math.min(value, max);
        return value;
    };

    Parallax.prototype.css = function(element, property, value) {
        var jsProperty = this.propertyCache[property];
        if (!jsProperty) {
            for (var i = 0, l = this.vendors.length; i < l; i++) {
                if (this.vendors[i] !== null) {
                    jsProperty = this.camelCase(this.vendors[i][1] + '-' + property);
                } else {
                    jsProperty = property;
                }
                if (element.style[jsProperty] !== undefined) {
                    this.propertyCache[property] = jsProperty;
                    break;
                }
            }
        }
        element.style[jsProperty] = value;
    };

    Parallax.prototype.accelerate = function(element) {
        this.css(element, 'transform', 'translate3d(0,0,0)');
        this.css(element, 'transform-style', 'preserve-3d');
        this.css(element, 'backface-visibility', 'hidden');
    };

    Parallax.prototype.setPosition = function(element, x, y) {
        x += 'px';
        y += 'px';
        if (this.transform3DSupport) {
            this.css(element, 'transform', 'translate3d(' + x + ',' + y + ',0)');
        } else if (this.transform2DSupport) {
            this.css(element, 'transform', 'translate(' + x + ',' + y + ')');
        } else {
            element.style.left = x;
            element.style.top = y;
        }
    };

    Parallax.prototype.onOrientationTimer = function() {
        if (this.orientationSupport && this.orientationStatus === 0) {
            this.disable();
            this.orientationSupport = false;
            this.enable();
        }
    };

    Parallax.prototype.onCalibrationTimer = function() {
        this.calibrationFlag = true;
    };

    Parallax.prototype.onWindowResize = function() {
        this.updateDimensions();
    };

    Parallax.prototype.onAnimationFrame = function() {
        this.updateBounds();
        var dx = this.ix - this.cx;
        var dy = this.iy - this.cy;
        if (Math.abs(dx) > this.calibrationThreshold || Math.abs(dy) > this.calibrationThreshold) {
            this.queueCalibration(0);
        }
        if (this.portrait) {
            this.mx = this.calibrateX ? dy : this.iy;
            this.my = this.calibrateY ? dx : this.ix;
        } else {
            this.mx = this.calibrateX ? dx : this.ix;
            this.my = this.calibrateY ? dy : this.iy;
        }
        this.mx *= this.ew * (this.scalarX / 100);
        this.my *= this.eh * (this.scalarY / 100);
        if (!isNaN(parseFloat(this.limitX))) {
            this.mx = this.clamp(this.mx, -this.limitX, this.limitX);
        }
        if (!isNaN(parseFloat(this.limitY))) {
            this.my = this.clamp(this.my, -this.limitY, this.limitY);
        }
        this.vx += (this.mx - this.vx) * this.frictionX;
        this.vy += (this.my - this.vy) * this.frictionY;
        for (var i = 0, l = this.layers.length; i < l; i++) {
            var layer = this.layers[i];
            var depth = this.depths[i];
            var xOffset = this.vx * depth * (this.invertX ? -1 : 1);
            var yOffset = this.vy * depth * (this.invertY ? -1 : 1);
            this.setPosition(layer, xOffset, yOffset);
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame);
    };

    Parallax.prototype.onDeviceOrientation = function(event) {

        // Validate environment and event properties.
        if (!this.desktop && event.beta !== null && event.gamma !== null) {

            // Set orientation status.
            this.orientationStatus = 1;

            // Extract Rotation
            var x = (event.beta || 0) / MAGIC_NUMBER; //  -90 :: 90
            var y = (event.gamma || 0) / MAGIC_NUMBER; // -180 :: 180

            // Detect Orientation Change
            var portrait = this.wh > this.ww;
            if (this.portrait !== portrait) {
                this.portrait = portrait;
                this.calibrationFlag = true;
            }

            // Set Calibration
            if (this.calibrationFlag) {
                this.calibrationFlag = false;
                this.cx = x;
                this.cy = y;
            }

            // Set Input
            this.ix = x;
            this.iy = y;
        }
    };

    Parallax.prototype.onMouseMove = function(event) {

        // Cache mouse coordinates.
        var clientX = event.clientX;
        var clientY = event.clientY;

        // Calculate Mouse Input
        if (!this.orientationSupport && this.relativeInput) {

            // Clip mouse coordinates inside element bounds.
            if (this.clipRelativeInput) {
                clientX = Math.max(clientX, this.ex);
                clientX = Math.min(clientX, this.ex + this.ew);
                clientY = Math.max(clientY, this.ey);
                clientY = Math.min(clientY, this.ey + this.eh);
            }

            // Calculate input relative to the element.
            this.ix = (clientX - this.ex - this.ecx) / this.erx;
            this.iy = (clientY - this.ey - this.ecy) / this.ery;
        } else {

            // Calculate input relative to the window.
            this.ix = (clientX - this.wcx) / this.wrx;
            this.iy = (clientY - this.wcy) / this.wry;
        }
    };

    // Expose Parallax
    window[NAME] = Parallax;
})(window, document);

/**
 * Request Animation Frame Polyfill.
 * @author Tino Zijdel
 * @author Paul Irish
 * @see https://gist.github.com/paulirish/1579671
 */
;
(function() {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
})();
//# sourceMappingURL=parallax.js.map

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj; } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

//Browserify
//Require
//Expose Jquery Globally.
// window.$ = window.jQuery = require('jquery');

// const slick = require('./slick');

(function($) {

    $.fn.fiveAce = function(method) {
        // currentWrapper.addClass('currentWrapper');
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if ((typeof method === 'undefined' ? 'undefined' : _typeof(method)) === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };
    //Global
    var stopClick = false;
    //Methods
    var methods = {
        init: function init(options) {
            var Wrapper = this,
                currentWrapper = $('.currentWrapper'),
                controls = $('<div class=controls></div>');
            controls.append($('<a href=javascript:; class=fa-prev>Prev</a>'), $('<a href=javascript:; class=fa-next>Next</a>'));

            var prevBtn = controls.find('.fa-prev'),
                nextBtn = controls.find('.fa-next');

            //Init Controller
            Wrapper.prepend(controls);
            var _defaultSettings = {
                'gap': 30,
                'itemHeight': 200,
                'item': '.item'
            };

            var _settings = $.extend(_defaultSettings, options);
            var items = currentWrapper.find(_defaultSettings.item);

            return this.each(function() {
                console.log('initial');
                //Set Item Size
                items.css({
                    'height': _settings.itemHeight,
                    'overflow': 'hidden'
                });

                //Scale Container Size
                currentWrapper.css('height', items.outerHeight());
                //Bind Container Resize on Window Resize
                $(window).resize(function() {
                    currentWrapper.css('height', items.outerHeight());
                });
                //Bind Controller Event
                prevBtn.on('click', function() {
                    slidePrev(currentWrapper, _settings);
                });
                nextBtn.on('click', function() {
                    slideNext(currentWrapper, _settings);
                });

                //Init Positioning
                items.each(function(index) {
                    console.log($(this));
                    $(this).css('bottom', _settings.gap * index * -1);
                    $(this).css('z-index', items.length - index);
                    $(this).attr('data-rel', index);
                });
            });
        }
    };

    //Private Function

    function slideNext(currentWrapper, options) {
        console.log(stopClick);
        if (stopClick) return;
        stopClick = true;
        console.log('go next');
        //Fake Item
        var fakeEl = $(currentWrapper).children(options.item + ':first-child').clone();

        var tempWrapper = $('<div class=tempWrapper></div>');

        tempWrapper.css({
            'z-index': 9999,
            'position': 'absolute',
            'width': '100%',
            'bottom': options.gap * -1
        });

        //Wrap all items except first Element
        currentWrapper.children(':not(:first-child)').wrapAll(tempWrapper);

        //Reposition items
        $('.tempWrapper').children(options.item).each(function(index) {
            $(this).css('bottom', options.gap * index * -1);
            $(this).css('z-index', $('.tempWrapper').children().length + 1 - index);
            $(this).attr('data-rel', index);
        });

        fakeEl.css('z-index', 1);
        fakeEl.css('bottom', ($('.tempWrapper').children().length - 1) * options.gap * -1);
        fakeEl.css('position', 'absolute');
        //
        $('.tempWrapper').animate({
            bottom: 0
        }, 300, function() {
            //Remove first item
            currentWrapper.children(options.item).remove();
            //Load New item from bottom
            $('.tempWrapper').append(fakeEl);
            console.log('appended');
            // fakeEl.css('top',$('.tempWrapper').children().length*options.gap-options.gap);
            fakeEl.animate({
                bottom: ($('.tempWrapper').children().length - 1) * options.gap * -1
            }, 300, function() {
                //Release
                // $('.tempWrapper').children(options.item).unwrap();
                // console.log($(this));
                $(this).unwrap();
                stopClick = false;
            });
        });
    }

    function slidePrev(currentWrapper, options) {
        console.log(stopClick);
        if (stopClick) return;
        stopClick = true;
        console.log('go prev');
        //Fake Item
        var fakeEl = $(currentWrapper).children(options.item + ':last-child').clone();

        var tempWrapper = $('<div class=tempWrapper></div>');

        tempWrapper.css({
            'z-index': 9999,
            'position': 'absolute',
            'width': '100%',
            'bottom': 0
        });

        //Wrap all items except first Element
        currentWrapper.children(':not(:last-child)').wrapAll(tempWrapper);

        fakeEl.css('z-index', $('.tempWrapper').children().length + 1);
        fakeEl.css('bottom', options.gap);
        fakeEl.css('position', 'absolute');
        // fakeEl.css('opacity', 0);
        //
        $('.tempWrapper').animate({
            bottom: options.gap * -1
        }, 300, function() {
            //Remove first item
            console.log('ddd');
            currentWrapper.children(options.item).remove();
            //Reposition items
            $('.tempWrapper').children(options.item).each(function(index) {
                $(this).css('bottom', options.gap * (index + 1) * -1);
                $(this).css('z-index', $('.tempWrapper').children().length - index);
                $(this).attr('data-rel', index);
            });
            //Load New item from bottom
            $('.tempWrapper').prepend(fakeEl);
            console.log('appe');
            // fakeEl.css('top',$('.tempWrapper').children().length*options.gap-options.gap);
            fakeEl.animate({
                bottom: 0
            });
            $('.tempWrapper').animate({
                bottom: 0
            }, 300, function() {
                fakeEl.unwrap();
                stopClick = false;
            });
        });
    }
})(jQuery);
//# sourceMappingURL=fiveAce.js.map

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj; } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! jQuery tinyMap v3.3.19, Licensed MIT (c) essoduke.org | https://code.essoduke.org/tinyMap/ */
window.gMapsCallback = function() {
    $(window).trigger('gMapsCallback');
};
(function(g, v, r, I) {
    function A(a) {
        var b = 0,
            c;
        if (a instanceof Array)
            for (b = 0; b < a.length; b += 1) {
                A(a[b]);
            } else if ('object' === (typeof a === 'undefined' ? 'undefined' : _typeof(a)))
                for (c in a) {
                    'string' !== typeof a[c] ? A(a[c]) : /^google\.map/gi.test(a[c]) && (b = a[c].split('.'), 4 === b.length && (a[c] = google.maps[b[2]][b[3]]));
                }
    }

    function q(a, b) {
        var c = { lat: '', lng: '' },
            d = [],
            e = /^[+-]?\d+(\.\d+)?$/;
        if ('string' === typeof a || Array.isArray(a)) {
            if (d = Array.isArray(a) ? a : a.toString().replace(/\s+/, '').split(','), 2 === d.length) e.test(d[0]) && e.test(d[1]) && (c.lat = d[0], c.lng = d[1]);
            else return a;
        } else if ('object' === (typeof a === 'undefined' ? 'undefined' : _typeof(a))) {
            if ('function' === typeof a.lat) return a;
            a.hasOwnProperty('x') && a.hasOwnProperty('y') ? (c.lat = a.x, c.lng = a.y) : a.hasOwnProperty('lat') && a.hasOwnProperty('lng') && (c.lat = a.lat, c.lng = a.lng);
        }
        return !0 === b ? new google.maps.LatLng(c.lat, c.lng) : c;
    }

    function y(a) {
        var b = a.hasOwnProperty('css') ? a.css.toString() : '';
        this.setValues(a);
        this.span = g('<span/>').css({ position: 'relative', left: '-50%', top: '0', 'white-space': 'nowrap' }).addClass(b);
        this.div = g('<div/>').css({ position: 'absolute', display: 'none' });
        this.span.appendTo(this.div);
    }

    function B(a, b) {
        var c = this,
            d = g.extend({}, H, b);
        c['const'] = {};
        c.map = null;
        c._markers = [];
        c._markersCluster = [];
        c._clusters = {};
        c._bounds = {};
        c._labels = [];
        c._polylines = [];
        c._polygons = [];
        c._circles = [];
        c._kmls = [];
        c._directions = [];
        c._directionsMarkers = [];
        c._places = [];
        c.container = a;
        c.options = d;
        c.googleMapOptions = {};
        c.interval = parseInt(c.options.interval, 10) || 200;
        g(v).on('gMapsCallback', function() {
            c.init();
        });
        g(this.container).html(d.loading);
        return c.init();
    }
    var E = !1,
        F = !1,
        G = !1,
        z = {
            language: 'en',
            callback: 'gMapsCallback',
            api: 'https://maps.googleapis.com/maps/api/js',
            clusterer: 'https://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/src/markerclusterer_packed.js',
            withLabel: 'https://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerwithlabel/src/markerwithlabel_packed.js'
        },
        H = { autoLocation: !1, center: [24, 121], infoWindowAutoClose: !0, interval: 200, loading: '讀取中&hellip;', notFound: '找不到查詢的地點', zoom: 8 },
        C = {},
        C = { greyscale: [{ featureType: 'all', stylers: [{ saturation: -100 }, { gamma: .5 }] }] };
    B.prototype = {
        VERSION: '3.3.19',
        formatSize: function formatSize(a) {
            return Array.isArray(a) && 2 === a.length ? new google.maps.Size(a[0], a[1]) : a;
        },
        formatPoint: function formatPoint(a) {
            return Array.isArray(a) && 2 === a.length ? new google.maps.Point(a[0], a[1]) : a;
        },
        overlay: function overlay() {
            var a = this.map,
                b = this.options;
            try {
                this.kml(a, b), this.directionService(a, b), this.placeMarkers(a, b), this.drawPolyline(a, b), this.drawPolygon(a, b), this.drawCircle(a, b), this.streetView(a, b), this.places(a, b), this.geoLocation(a, b);
            } catch (c) {
                console.error(c);
            } finally {
                google.maps.event.trigger(a, 'resize');
            }
        },
        bindEvents: function bindEvents(a, b) {
            var c = this,
                d = {};
            switch (typeof b === 'undefined' ? 'undefined' : _typeof(b)) {
                case 'function':
                    google.maps.event.clearListeners(a, 'click');
                    google.maps.event.addListener(a, 'click', b);
                    break;
                case 'object':
                    for (d in b) {
                        'function' === typeof b[d] ? 'created' === d ? b[d].call(a) : (google.maps.event.clearListeners(a, d), google.maps.event.addListener(a, d, b[d])) : b[d].hasOwnProperty('func') && 'function' === typeof b[d].func ? b[d].hasOwnProperty('once') && !0 === b[d].once ? google.maps.event.addListenerOnce(a, d, b[d].func) : (google.maps.event.clearListeners(a, d), google.maps.event.addListener(a, d, b[d].func)) : 'function' === typeof b[d] && (google.maps.event.clearListeners(a, d), google.maps.event.addListener(a, d, b[d]));
                    }
            }
            a.hasOwnProperty('defaultInfoWindow') && (google.maps.event.clearListeners(a, 'click'), google.maps.event.addListener(a, 'click', function() {
                var b = 0,
                    d = {};
                if (c.options.hasOwnProperty('infoWindowAutoClose') && !0 === c.options.infoWindowAutoClose)
                    for (b = 0; b < c._markers.length; b += 1) {
                        d = c._markers[b], d.hasOwnProperty('infoWindow') && 'function' === typeof d.infoWindow.close && d.infoWindow.close();
                    }
                a.infoWindow.open(c.map, a);
            }));
        },
        kml: function kml(a, b) {
            var c = { url: '', map: a, preserveViewport: !1, suppressInfoWindows: !1 },
                d = {},
                e = 0;
            if (b.hasOwnProperty('kml'))
                if ('string' === typeof b.kml) c.url = b.kml, d = new google.maps.KmlLayer(c), this._kmls.push(d);
                else if (Array.isArray(b.kml))
                for (e = 0; e < b.kml.length; e += 1) {
                    'string' === typeof b.kml[e] ? (c.url = b.kml[e], d = new google.maps.KmlLayer(c)) : 'object' === _typeof(b.kml[e]) && (c = g.extend({}, c, b.kml[e]), d = new google.maps.KmlLayer(c), c.hasOwnProperty('event') && this.bindEvents(d, c.event)), this._kmls.push(d);
                }
        },
        drawPolyline: function drawPolyline(a, b) {
            var c = {},
                d = [],
                e = {},
                f = {},
                h = {},
                h = {},
                l = [],
                k = [],
                p = 0,
                h = {},
                h = {},
                m = 0,
                w = function w(a, b) {
                    if (b === google.maps.DirectionsStatus.OK) {
                        for (m = 0; m < a.routes[0].overview_path.length; m += 1) {
                            k.push(a.routes[0].overview_path[m]);
                        }
                        e.setPath(k);
                        'function' === typeof c.getDistance && (f = a.routes[0].legs[0].distance, c.getDistance.call(this, f));
                    }
                };
            if (b.hasOwnProperty('polyline') && Array.isArray(b.polyline))
                for (p = 0; p < b.polyline.length; p += 1) {
                    if (c = b.polyline[p], c.hasOwnProperty('coords') && Array.isArray(c.coords)) {
                        l = new google.maps.MVCArray();
                        for (m = 0; m < c.coords.length; m += 1) {
                            h = c.coords[m], h = q(h, !0), 'function' === typeof h.lat && l.push(h);
                        }
                        h = g.extend({}, { strokeColor: c.color || '#FF0000', strokeOpacity: c.opacity || 1, strokeWeight: c.width || 2 }, c);
                        e = new google.maps.Polyline(h);
                        this._polylines.push(e);
                        if (2 < l.getLength())
                            for (m = 0; m < l.length; m += 1) {
                                0 < m && l.length - 1 > m && d.push({ location: l.getAt(m), stopover: !1 });
                            }
                        c.hasOwnProperty('event') && this.bindEvents(e, c.event);
                        c.hasOwnProperty('snap') && !0 === c.snap ? (h = new google.maps.DirectionsService(), h.route({ origin: l.getAt(0), waypoints: d, destination: l.getAt(l.length - 1), travelMode: google.maps.DirectionsTravelMode.DRIVING }, w)) : (e.setPath(l), google.maps.hasOwnProperty('geometry') && google.maps.geometry.hasOwnProperty('spherical') && 'function' === typeof google.maps.geometry.spherical.computeDistanceBetween && (f = google.maps.geometry.spherical.computeDistanceBetween(l.getAt(0), l.getAt(l.length - 1)), 'function' === typeof c.getDistance && c.getDistance.call(this, f)));
                        e.setMap(a);
                    }
                }
        },
        drawPolygon: function drawPolygon(a, b) {
            var c = {},
                d = {},
                c = [],
                e = 0,
                d = 0,
                f = {},
                f = {};
            if (b.hasOwnProperty('polygon') && Array.isArray(b.polygon))
                for (e = 0; e < b.polygon.length; e += 1) {
                    if (c = [], b.polygon[e].hasOwnProperty('coords')) {
                        for (d = 0; d < b.polygon[e].coords.length; d += 1) {
                            f = b.polygon[e].coords[d], f = q(f, !0), 'function' === typeof f.lat && c.push(f);
                        }
                        d = g.extend({}, { path: c, strokeColor: b.polygon[e].color || '#FF0000', strokeOpacity: 1, strokeWeight: b.polygon[e].width || 2, fillColor: b.polygon[e].fillcolor || '#CC0000', fillOpacity: .35 }, b.polygon[e]);
                        c = new google.maps.Polygon(d);
                        this._polygons.push(c);
                        c.setMap(a);
                        d.hasOwnProperty('event') && this.bindEvents(c, d.event);
                    }
                }
        },
        drawCircle: function drawCircle(a, b) {
            var c = {},
                d = {},
                c = {},
                e = {},
                f = 0;
            if (b.hasOwnProperty('circle') && Array.isArray(b.circle))
                for (f = 0; f < b.circle.length; f += 1) {
                    d = b.circle[f], c = g.extend({ map: a, strokeColor: d.color || '#FF0000', strokeOpacity: d.opacity || .8, strokeWeight: d.width || 2, fillColor: d.fillcolor || '#FF0000', fillOpacity: d.fillopacity || .35, radius: d.radius || 10, zIndex: 100, id: d.hasOwnProperty('id') ? d.id : '' }, d), d.hasOwnProperty('center') && (e = q(d.center, !0), c.center = e), 'function' === typeof e.lat && (c = new google.maps.Circle(c), this._circles.push(c), d.hasOwnProperty('event') && this.bindEvents(c, d.event));
                }
        },
        markerIcon: function markerIcon(a) {
            var b = {};
            if (a.hasOwnProperty('icon')) {
                b = a.icon;
                if ('string' === typeof a.icon) return a.icon;
                a.icon.hasOwnProperty('url') && (b.url = a.icon.url);
                a.icon.hasOwnProperty('size') && Array.isArray(a.icon.size) && 2 === a.icon.size.length && (b.size = this.formatSize(a.icon.size));
                a.icon.hasOwnProperty('scaledSize') && Array.isArray(a.icon.scaledSize) && 2 === a.icon.scaledSize.length && (b.scaledSize = this.formatSize(a.icon.scaledSize));
                a.icon.hasOwnProperty('anchor') && Array.isArray(a.icon.anchor) && 2 === a.icon.anchor.length && (b.anchor = this.formatPoint(a.icon.anchor));
            }
            return b;
        },
        processMarker: function processMarker(a, b, c, d) {
            var e = this,
                f = e.get('marker'),
                h = {},
                l = {},
                k = {};
            c.hasOwnProperty('position') && ('function' === typeof c.getPosition && e._bounds.extend(c.position), b.hasOwnProperty('markerFitBounds') && !0 === b.markerFitBounds && f.length === b.marker.length && a.fitBounds(e._bounds));
            c.hasOwnProperty('text') && (c.infoWindow = new google.maps.InfoWindow({ content: c.text }), c.infoWindow.close(), c.hasOwnProperty('event') && c.event.hasOwnProperty('click') || (c.defaultInfoWindow = !0), e.bindEvents(c, c.event), c.hasOwnProperty('infoWindowOptions') && (k = g.extend({}, { content: c.infoWindowOptions.hasOwnProperty('content') ? c.infoWindowOptions.content : c.text }, c.infoWindowOptions), c.infoWindow.setOptions(k), k.hasOwnProperty('event') && 'undefined' !== typeof k.event && e.bindEvents(c.infoWindow, k.event)));
            d || (!c.hasOwnProperty('cluster') || c.hasOwnProperty('cluster') && !0 === c.cluster) && 'function' === typeof e._clusters.addMarker && e._clusters.addMarker(c);
            c.hasOwnProperty('newLabel') && (l = { id: c.id, text: c.newLabel, map: a, css: c.hasOwnProperty('newLabelCSS') ? c.newLabelCSS.toString() : '' }, e.get({ label: [c.id] }, function(a) {
                var d = 0,
                    f = a.label.length,
                    k = {};
                if (f)
                    for (d = 0; d < f; d += 1) {
                        k = a.label[d], k.text = c.newLabel, g(k.span).addClass(c.newLabelCSS), k.bindTo('position', c), k.draw();
                    } else h = new y(l), h.bindTo('position', c), e._labels.push(h), h.set('visible', c.showLabel), 'object' === (typeof h === 'undefined' ? 'undefined' : _typeof(h)) && !0 === b.markerCluster && google.maps.event.addListener(c, 'map_changed', function() {
                        'function' === typeof h.setMap && h.set('visible', null !== c.getMap());
                    });
            }));
            e.bindEvents(c, c.event);
        },
        markerControl: function markerControl() {
            var a = this,
                b = a.options,
                c = { css: '', label: '請選擇&hellip;', infoWindow: !0, panTo: !0, onChange: '' },
                d;
            b.hasOwnProperty('markerControl') && ('string' === typeof b.markerControl ? d = g(b.markerControl.toString()) : (d = b.markerControl.hasOwnProperty('container') ? g(b.markerControl.container) : g(b.markerControl), c = g.extend({}, c, b.markerControl)), d.length && a.get('marker', function(b) {
                var f = ['<select class="marker-list-control">', '<option>' + c.label + '</option>'];
                b.forEach(function(a) {
                    'undefined' !== typeof a.infoWindow && a.infoWindow.close();
                    f.push('<option value="' + a.id + '">' + (a.title ? a.title : a.id) + '</option>');
                });
                f.push('</select>');
                d.on('change.tinyMap', 'select', function() {
                    var b = g(this);
                    a.close('marker');
                    this.value.length && a.get({ marker: [this.value] }, function(d) {
                        var e = {};
                        d.marker.length && 'undefined' !== d.marker[0] && (e = d.marker[0], !0 === c.infoWindow && 'undefined' !== typeof e.infoWindow && 'function' === typeof e.infoWindow.open && e.infoWindow.open(a.map, e), !0 === c.panTo && a.map.panTo(e.getPosition()), 'function' === typeof c.onChange && c.onChange.call(b, e));
                    });
                }).html(f.join(''));
                'string' === typeof c.css && d.find('select').addClass(c.css);
            }));
        },
        placeMarkers: function placeMarkers(a, b, c) {
            var d = this,
                e = {},
                f = {
                    maxZoom: null,
                    gridSize: 60
                },
                h = Array.isArray(b.marker) ? b.marker : [];
            d.options.hasOwnProperty('markerCluster') && 'function' === typeof MarkerClusterer && (f = g.extend({}, f, b.markerCluster), d._clusters = new MarkerClusterer(a, [], f), f.hasOwnProperty('event') && d.bindEvents(d._clusters, f.event));
            h.forEach(function(f) {
                var h = q(f.addr, !0),
                    p = d.markerIcon(f),
                    m = !0,
                    w = !1,
                    t = {},
                    x = {},
                    D = 'undefined' !== typeof f.id ? f.id : f.addr.toString().replace(/\s/g, ''),
                    n = { id: D, map: a, animation: null, showLabel: !0 },
                    n = g.extend({}, n, f);
                'modify' === c && D && d.get({ marker: [D] }, function(a) {
                    !Array.isArray(a.marker) || !a.marker.length || f.hasOwnProperty('forceInsert') && !0 === f.forceInsert || (f = g.extend(a.marker[0], f), 'function' === typeof d._clusters.removeMarker && d._clusters.removeMarker(a.marker[0]), m = !1, w = !0);
                });
                f.hasOwnProperty('title') && (n.title = f.title.toString().replace(/<([^>]+)>/g, ''));
                g.isEmptyObject(p) || (n.icon = p);
                f.hasOwnProperty('animation') && 'string' === typeof f.animation && (n.animation = google.maps.Animation[f.animation.toUpperCase()]);
                'string' === typeof h ? (e = new google.maps.Geocoder(), e.geocode({ address: h }, function(e, h) {
                    h === google.maps.GeocoderStatus.OVER_QUERY_LIMIT ? setTimeout(function() {
                        d.placeMarkers(a, b, c);
                    }, d.interval) : h === google.maps.GeocoderStatus.OK && (!m && w ? ('function' === typeof f.setPosition && (f.setPosition(e[0].geometry.location), n.hasOwnProperty('title') && f.setTitle(n.title), n.hasOwnProperty('icon') && f.setIcon(n.icon)), x = f) : (n.position = e[0].geometry.location, t = b.hasOwnProperty('markerWithLabel') && !0 === b.markerWithLabel ? 'function' === typeof MarkerWithLabel ? new MarkerWithLabel(n) : new google.maps.Marker(n) : new google.maps.Marker(n), d._markers.push(t), x = t), d.processMarker(a, b, x, c));
                })) : (!m && w ? ('function' === typeof f.setPosition && (f.setPosition(h), n.hasOwnProperty('title') && f.setTitle(n.title), n.hasOwnProperty('icon') && f.setIcon(n.icon)), x = f) : (n.position = h, t = b.hasOwnProperty('markerWithLabel') && !0 === b.markerWithLabel ? 'function' === typeof MarkerWithLabel ? new MarkerWithLabel(n) : new google.maps.Marker(n) : new google.maps.Marker(n), d._markers.push(t), x = t), d.processMarker(a, b, x, c));
            });
            d.markerControl();
        },
        directionService: function directionService(a, b) {
            var c = this,
                d = new google.maps.DirectionsService();
            Array.isArray(b.direction) && b.direction.forEach(function(b) {
                if ('undefined' !== typeof b.from && 'undefined' !== typeof b.to) {
                    var f = {},
                        h = new google.maps.DirectionsRenderer(),
                        l = g.extend({}, { infoWindow: new google.maps.InfoWindow(), map: c.map }, b),
                        k = [],
                        p = [],
                        m = [];
                    f.origin = q(b.from, !0);
                    f.destination = q(b.to, !0);
                    f.travelMode = b.hasOwnProperty('travel') && google.maps.TravelMode[b.travel.toString().toUpperCase()] ? google.maps.TravelMode[b.travel.toString().toUpperCase()] : google.maps.TravelMode.DRIVING;
                    b.hasOwnProperty('panel') && g(b.panel).length && (l.panel = g(b.panel).get(0));
                    b.hasOwnProperty('requestExtra') && b.requestExtra && (f = g.extend({}, f, b.requestExtra));
                    b.hasOwnProperty('optimize') && (f.optimizeWaypoints = b.optimize);
                    b.hasOwnProperty('waypoint') && Array.isArray(b.waypoint) && (b.waypoint.forEach(function(a) {
                        var b = { stopover: !0 };
                        'string' === typeof a || Array.isArray(a) ? b.location = q(a, !0) : a.hasOwnProperty('location') && (b.location = q(a.location, !0), b.stopover = a.hasOwnProperty('stopover') ? a.stopover : !0);
                        p.push(a.text || a.toString());
                        a.hasOwnProperty('icon') && m.push(a.icon.toString());
                        k.push(b);
                    }), f.waypoints = k);
                    d.route(f, function(d, g) {
                        g === google.maps.DirectionsStatus.OK && (d.routes.forEach(function(h, g) {
                            b.hasOwnProperty('renderAll') && !0 === b.renderAll && !0 === f.provideRouteAlternatives && new google.maps.DirectionsRenderer({ map: a, directions: d, routeIndex: g });
                            var k = h.legs,
                                t = '',
                                q = '',
                                r = {},
                                u = 0;
                            b.hasOwnProperty('fromText') && (t = k[0].start_address = b.fromText);
                            b.hasOwnProperty('toText') && (1 === k.length ? k[0].end_address = b.toText : k[k.length - 1].end_address = b.toText, q = b.toText);
                            b.hasOwnProperty('icon') && (l.suppressMarkers = !0, b.icon.hasOwnProperty('from') && 'string' === typeof b.icon.from && c.directionServiceMarker(k[0].start_location, { icon: b.icon.from, text: t }, l.infoWindow, b), b.icon.hasOwnProperty('to') && 'string' === typeof b.icon.to && c.directionServiceMarker(k[k.length - 1].end_location, { icon: b.icon.to, text: q }, l.infoWindow, b));
                            for (u = 1; u < k.length; u += 1) {
                                b.hasOwnProperty('icon') && (b.icon.hasOwnProperty('waypoint') && 'string' === typeof b.icon.waypoint ? r.icon = b.icon.waypoint : 'string' === typeof m[u - 1] && (r.icon = m[u - 1]), r.text = p[u - 1], c.directionServiceMarker(k[u].start_location, r, l.infoWindow, b));
                            }
                        }), c.bindEvents(h, b.event), h.setOptions(l), h.setDirections(d), c._directions.push(h));
                    });
                }
            });
        },
        directionServiceMarker: function directionServiceMarker(a, b, c, d) {
            var e = this,
                f = {},
                h = g.extend({}, { position: a, map: e.map, id: d.hasOwnProperty('id') ? d.id : '' }, b),
                l = new google.maps.Marker(h);
            h.hasOwnProperty('text') && (f = function f() {
                c.setPosition(a);
                c.setContent(h.text);
                c.open(e.map, l);
            });
            e._directionsMarkers.push(l);
            e.bindEvents(l, f);
        },
        getDirectionsInfo: function getDirectionsInfo() {
            var a = [];
            this.get('direction', function(b) {
                b.forEach(function(b, d) {
                    var e = b.getDirections();
                    e.hasOwnProperty('routes') && 'undefined' !== typeof e.routes[0] && 'undefined' !== typeof e.routes[0].legs && (a[d] = [], e.routes[0].legs.forEach(function(b, c) {
                        a[d].push({ from: b.start_address, to: b.end_address, distance: b.distance, duration: b.duration });
                    }));
                });
            });
            return a;
        },
        streetView: function streetView(a, b) {
            var c = b.hasOwnProperty('streetViewObj') ? b.streetViewObj : {},
                d = {},
                d = {};
            'function' === typeof a.getStreetView && (c.hasOwnProperty('position') ? (d = q(c.position, !0), c.position = 'object' === (typeof d === 'undefined' ? 'undefined' : _typeof(d)) ? a.getCenter() : d) : c.position = a.getCenter(), c.hasOwnProperty('pov') && (c.pov = g.extend({}, { heading: 0, pitch: 0, zoom: 1 }, c.pov)), d = a.getStreetView(), d.setOptions(c), c.hasOwnProperty('event') && this.bindEvents(d, c.event), c.hasOwnProperty('visible') && d.setVisible(c.visible));
        },
        places: function places(a, b) {
            var c = this,
                d = {},
                d = b.hasOwnProperty('places') ? b.places : {},
                e = g.extend({
                    location: a.getCenter(),
                    radius: 100
                }, d);
            e.location = q(e.location, !0);
            'undefined' !== typeof google.maps.places && (d = new google.maps.places.PlacesService(a), d.nearbySearch(e, function(b, d) {
                d === google.maps.places.PlacesServiceStatus.OK && (c._places.push(b), e.hasOwnProperty('createMarker') && !0 === e.createMarker && b.forEach(function(b) {
                    b.hasOwnProperty('geometry') && c._markers.push(new google.maps.Marker({ map: a, position: b.geometry.location }));
                }), e.hasOwnProperty('callback') && 'function' === typeof e.callback && e.callback.call(b));
            }));
        },
        geoLocation: function geoLocation(a, b) {
            try {
                var c = this,
                    d = {},
                    e = navigator.geolocation;
                e && (b.hasOwnProperty('geolocation') && (d = g.extend({}, { maximumAge: 6E5, timeout: 3E3, enableHighAccuracy: !1 }, b.geolocation)), !0 !== b.autoLocation && 'function' !== typeof b.autoLocation || e.watchPosition(function(d) {
                    'undefined' !== typeof d && 'coords' in d && 'latitude' in d.coords && 'longitude' in d.coords && (a.panTo(new google.maps.LatLng(d.coords.latitude, d.coords.longitude)), 'function' === typeof b.autoLocation && b.autoLocation.call(c, d));
                }, function(a) {
                    console.error(a);
                }, d));
            } catch (f) {}
        },
        panTo: function panTo(a) {
            var b = this.map,
                c = {},
                d = {};
            null !== b && 'undefined' !== typeof b && (c = q(a, !0), 'string' === typeof c ? (d = new google.maps.Geocoder(), d.geocode({ address: c }, function(a, c) {
                c === google.maps.GeocoderStatus.OK && 'function' === typeof b.panTo && Array.isArray(a) && a.length ? a[0].hasOwnProperty('geometry') && b.panTo(a[0].geometry.location) : console.error(c);
            })) : 'function' === typeof b.panTo && b.panTo(c));
            return g(this.container);
        },
        close: function close(a, b) {
            var c = this.get(a),
                d = {},
                e = '';
            c.hasOwnProperty('map') && delete c.map;
            Array.isArray(c) ? d[a] = c : d = c;
            try {
                for (e in d) {
                    Array.isArray(d[e]) && d[e].forEach(function(a) {
                        a.hasOwnProperty('infoWindow') && 'function' === typeof a.infoWindow.close && a.infoWindow.close();
                    });
                }
                'function' === typeof b && b.call(this);
            } catch (f) {
                console.warn(f);
            } finally {
                return g(this.container);
            }
        },
        clear: function clear(a, b) {
            function c(a, b) {
                'function' === typeof a.setMap && f._directionsMarkers[b].setMap(null);
            }

            function d(a) {
                'direction' === m && (h.forEach(c), f._directionsMarkers.filter(function(a) {
                    return 'undefined' !== typeof a;
                }));
                'function' === typeof a.set && a.set('visible', !1);
                'function' === typeof a.setMap && a.setMap(null); - 1 !== f[p].indexOf(a) && delete f[p][f[p].indexOf(a)];
            }

            function e(a) {
                return 'undefined' !== typeof a;
            }
            var f = this,
                h = f._directionsMarkers,
                l = f.get(a),
                k = {},
                p = '',
                m = '';
            'undefined' !== typeof l && 'undefined' !== typeof l.map && delete l.map;
            Array.isArray(l) ? k[a] = l : k = l;
            try {
                for (m in k) {
                    Array.isArray(k[m]) && (p = '_' + m.toString().toLowerCase() + 's', k[m].forEach(d), f[p] = f[p].filter(e));
                }
                'function' === typeof b && b.call(this);
            } catch (w) {
                console.warn(w);
            } finally {
                return g(f.container);
            }
        },
        get: function get(a, b) {
            function c(b) {
                (0 === a[f].length || -1 !== a[f].indexOf(k) || 'undefined' !== typeof b.id && 0 < b.id.length && -1 !== b.id.indexOf(a[f])) && e[f].push(b);
            }
            var d = [],
                e = {},
                f = {},
                h = '',
                l = '',
                k = 0;
            'undefined' === typeof a && (a = { marker: [], label: [], polygon: [], polyline: [], circle: [], direction: [], kml: [], cluster: [], bound: [] });
            try {
                if ('string' === typeof a) {
                    if (-1 !== a.indexOf(','))
                        for (d = a.replace(/\s/gi, '').split(','), k = 0; k < d.length; k += 1) {
                            l = d[k].toString().toLowerCase(), 'map' === l ? e[l] = this.map : (h = '_' + l + 's', e[l] = this[h]);
                        } else 'map' === a.toString().toLowerCase() ? e = this.map : (h = '_' + a.toString().toLowerCase() + 's', e = this[h]);
                } else {
                    for (f in a) {
                        Array.isArray(a[f]) && (h = '_' + f.toString().toLowerCase() + 's', Array.isArray(this[h]) && (e[f] = [], this[h].forEach(c)));
                    }
                    e.map = this.map;
                }
                'function' === typeof b && b.call(this, e);
                return e;
            } catch (g) {
                console.error(g);
            } finally {
                return e;
            }
        },
        modify: function modify(a) {
            var b = [],
                c = [
                    ['kml', 'kml'],
                    ['marker', 'placeMarkers'],
                    ['direction', 'directionService'],
                    ['polyline', 'drawPolyline'],
                    ['polygon', 'drawPolygon'],
                    ['circle', 'drawCircle'],
                    ['streetView', 'streetView'],
                    ['markerFitBounds', 'markerFitBounds'],
                    ['places', 'places']
                ],
                d = 0,
                e = this.map;
            if ('undefined' !== typeof a) {
                for (d = 0; d < c.length; d += 1) {
                    a.hasOwnProperty(c[d][0]) && b.push(c[d][1]);
                }
                if (null !== e) {
                    if (b.length)
                        for (d = 0; d < b.length; d += 1) {
                            'function' === typeof this[b[d]] && ('streetView' === b[d] && (a.streetViewObj = a.streetView, delete a.streetView), this[b[d]](e, a, 'modify'));
                        } else e.setOptions(a);
                    a.hasOwnProperty('event') && this.bindEvents(e, a.event);
                    google.maps.event.trigger(e, 'resize');
                }
            }
            return g(this.container);
        },
        query: function query(a, b) {
            var c = this,
                d = new google.maps.Geocoder(),
                e = q(a),
                f = {};
            'string' === typeof e ? f.address = e : f = { location: { lat: parseFloat(e.lat, 10), lng: parseFloat(e.lng, 10) } };
            d.geocode(f, function(d, e) {
                try {
                    if (e === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) setTimeout(function() {
                        c.query(a, b);
                    }, c.interval);
                    else if (e === google.maps.GeocoderStatus.OK && Array.isArray(d)) {
                        if (0 < d.length && d[0].hasOwnProperty('geometry'))
                            if ('function' === typeof b) b.call(c, d[0]);
                            else return d[0];
                    } else console.error('Geocoder Error Code: ' + e);
                } catch (f) {
                    console.error(f);
                }
            });
        },
        destroy: function destroy() {
            var a = g(this.container);
            a.length && g.removeData(this.container, 'tinyMap');
            return a.empty();
        },
        getKML: function getKML(a) {
            var b = g.extend({}, { marker: !0, polyline: !0, polygon: !0, circle: !0, direction: !0, download: !1 }, a),
                c = '<Placemark> <name><![CDATA[#NAME#]]\x3e</name> <Snippet></Snippet> <description><![CDATA[]]\x3e</description> <styleUrl>#style1</styleUrl> <ExtendedData></ExtendedData> #DATA# </Placemark>'.split(' '),
                d = '<Placemark> <styleUrl>#style1</styleUrl> <name><![CDATA[#NAME#]]\x3e</name> <Polygon> <tessellate>1</tessellate> <extrude>1</extrude> <altitudeMode>clampedToGround</altitudeMode> <outerBoundaryIs> <LinearRing> <coordinates>#LATLNG#</coordinates> </LinearRing> </outerBoundaryIs> </Polygon> </Placemark>'.split(' '),
                e = '',
                f = '',
                h = '',
                l = '',
                k = '';
            a = '';
            this.get('marker,polyline,polygon,circle,direction', function(a) {
                var g = '';
                !0 === b.marker && 'undefined' !== typeof a.marker && a.marker.forEach(function(a) {
                    g = [a.getPosition().lng(), a.getPosition().lat()].join();
                    e += c.join('').replace(/#NAME#/gi, 'Markers').replace(/#DATA#/gi, '<Point><coordinates>#LATLNG#,0.000000</coordinates></Point>'.replace(/#LATLNG#/gi, g));
                });
                !0 === b.polyline && 'undefined' !== typeof a.polyline && a.polyline.forEach(function(a) {
                    g = '';
                    a.getPath().getArray().forEach(function(a) {
                        g += [a.lng(), a.lat(), '0.000000\n'].join();
                    });
                    f += c.join('').replace(/#NAME#/gi, 'Polylines').replace(/#DATA#/gi, '<LineString><tessellate>1</tessellate><coordinates>#LATLNG#</coordinates></LineString>'.replace(/#LATLNG#/gi, g));
                });
                !0 === b.polygon && 'undefined' !== typeof a.polygon && a.polygon.forEach(function(a) {
                    g = '';
                    a.getPath().getArray().forEach(function(a) {
                        g += [a.lng(), a.lat(), '0.000000\n'].join();
                    });
                    h += d.join('').replace(/#NAME#/gi, 'Polygons').replace(/#LATLNG#/gi, g);
                });
                !0 === b.circle && 'undefined' !== typeof a.circle && a.circle.forEach(function(a) {
                    g = '';
                    for (var b = Math.PI / 180, c = 180 / Math.PI, c = a.getRadius() / 6378137 * c, b = c / Math.cos(a.getCenter().lat() * b), e = 0, f = 0, h = e = 0, h = 0; 65 > h; h += 1) {
                        e = h / 32 * Math.PI, f = a.getCenter().lng() + b * Math.cos(e), e = a.getCenter().lat() + c * Math.sin(e), g += [f, e, '0.000000\n'].join();
                    }
                    l += d.join('').replace(/#NAME#/gi, 'Circles').replace(/#LATLNG#/gi, g);
                });
                !0 === b.direction && 'undefined' !== typeof a.direction && a.direction.forEach(function(a) {
                    a = a.getDirections();
                    a.hasOwnProperty('routes') && Array.isArray(a.routes) && 'undefined' !== typeof a.routes[0] && 'undefined' !== typeof a.routes[0].legs && Array.isArray(a.routes[0].legs) && a.routes[0].legs.forEach(function(a) {
                        Array.isArray(a.steps) && a.steps.forEach(function(a) {
                            g = '';
                            Array.isArray(a.path) && a.path.forEach(function(a) {
                                g += [a.lng(), a.lat(), '0.000000\n'].join();
                            });
                            k += c.join('').replace(/#NAME#/gi, 'Directions').replace(/#DATA#/gi, '<LineString><tessellate>1</tessellate><coordinates>#LATLNG#</coordinates></LineString>'.replace(/#LATLNG#/gi, g));
                        });
                    });
                });
            });
            a = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://earth.google.com/kml/2.2"><Document><name><![CDATA[jQuery tinyMap Plugin]]\x3e</name><description><![CDATA[]]\x3e</description><Style id="style1"><PolyStyle><color>50F05A14</color><colorMode>normal</colorMode><fill>1</fill><outline>1</outline></PolyStyle><IconStyle><Icon><href>https://maps.google.com/mapfiles/kml/paddle/grn-circle_maps.png</href></Icon></IconStyle></Style>#PLACEMARKS#</Document></kml>'.replace(/#NAME#/gi, '').replace(/#PLACEMARKS#/gi, e + f + h + l + k);
            if (!0 === b.download) v.open('data:application/vnd.google-earth.kml+xml;charset=utf-8;base64,' + v.btoa(v.decodeURIComponent(v.encodeURIComponent(a))));
            else return a;
        },
        init: function init() {
            var a = this,
                b = {},
                c = {},
                c = g.extend({}, z),
                d = c.api.split('?')[0],
                e = '',
                b = {},
                f = {};
            try {
                delete c.api, delete c.clusterer, delete c.withLabel, c = g.param(c);
            } catch (h) {}
            E || 'undefined' !== typeof v.google || (b = r.createElement('script'), b.setAttribute('src', [d, c].join('?')), (r.getElementsByTagName('head')[0] || r.documentElement).appendChild(b), E = !0, b = null);
            if ('object' === _typeof(v.google)) {
                A(a.options);
                !F && a.options.hasOwnProperty('markerCluster') && !1 !== a.options.markerCluster && 'undefined' === typeof MarkerClusterer && (b = r.createElement('script'), b.setAttribute('src', z.clusterer), (r.getElementsByTagName('head')[0] || r.documentElement).appendChild(b), F = !0, b = null);
                !G && a.options.hasOwnProperty('markerWithLabel') && !0 === a.options.markerWithLabel && 'undefined' === typeof MarkerWithLabel && (b = r.createElement('script'), b.setAttribute('src', z.withLabel), (r.getElementsByTagName('head')[0] || r.documentElement).appendChild(b), G = !0, b = null);
                a._bounds = new google.maps.LatLngBounds();
                y.prototype = new google.maps.OverlayView();
                y.prototype.onAdd = function() {
                    var a = this;
                    null !== a.div && (a.div.appendTo(g(a.getPanes().overlayLayer)), a.listeners = [google.maps.event.addListener(a, 'visible_changed', function() {
                        a.draw();
                    }), google.maps.event.addListener(a, 'position_changed', function() {
                        a.draw();
                    }), google.maps.event.addListener(a, 'visible_changed', function() {
                        a.draw();
                    }), google.maps.event.addListener(a, 'clickable_changed', function() {
                        a.draw();
                    }), google.maps.event.addListener(a, 'text_changed', function() {
                        a.draw();
                    }), google.maps.event.addListener(a, 'zindex_changed', function() {
                        a.draw();
                    })]);
                };
                y.prototype.draw = function() {
                    var a = this.getProjection(),
                        b = {};
                    try {
                        null !== this.div && a && ((b = a.fromLatLngToDivPixel(this.get('position'))) && this.div.css({ left: b.x + 'px', top: b.y + 'px', display: this.get('visible') ? 'block' : 'none' }), this.text && this.span.html(this.text.toString()));
                    } catch (c) {
                        console.error(c);
                    }
                };
                y.prototype.onRemove = function() {
                    g(this.div).remove();
                    this.div = null;
                };
                for (f in a.options) {
                    a.options.hasOwnProperty(f) && (b = a.options[f], /ControlOptions/g.test(f) && b.hasOwnProperty('position') && 'string' === typeof b.position && (a.options[f].position = google.maps.ControlPosition[b.position.toUpperCase()]));
                }
                a.googleMapOptions = a.options;
                a.options.hasOwnProperty('streetView') && (a.googleMapOptions.streetViewObj = a.options.streetView, delete a.googleMapOptions.streetView);
                a.googleMapOptions.center = q(a.options.center, !0);
                a.options.hasOwnProperty('styles') && ('string' === typeof a.options.styles && C.hasOwnProperty(a.options.styles) ? a.googleMapOptions.styles = C[a.options.styles] : Array.isArray(a.options.styles) && (a.googleMapOptions.styles = a.options.styles));
                'string' === typeof a.options.center ? (c = new google.maps.Geocoder(), c.geocode({ address: a.options.center }, function(b, c) {
                    try {
                        c === google.maps.GeocoderStatus.OVER_QUERY_LIMIT ? setTimeout(function() {
                            a.init();
                        }, a.interval) : c === google.maps.GeocoderStatus.OK && Array.isArray(b) ? 0 < b.length && b[0].hasOwnProperty('geometry') && (a.googleMapOptions.center = b[0].geometry.location, a.map = new google.maps.Map(a.container, a.googleMapOptions), a.overlay(), a.bindEvents(a.map, a.options.event)) : (e = (a.options.notFound || c).toString(), a.container.innerHTML(g('<div/>').text(e).html()), console.error('Geocoder Error Code: ' + c));
                    } catch (d) {
                        console.error(d);
                    }
                })) : (a.map = new google.maps.Map(a.container, a.googleMapOptions), a.overlay(), a.bindEvents(a.map, a.options.event));
            }
        }
    };
    g.fn.tinyMapConfigure = function(a) {
        z = g.extend(z, a);
    };
    g.fn.tinyMap = function(a) {
        var b = {},
            c = [],
            d = arguments;
        return 'string' === typeof a ? (this.each(function() {
            b = g.data(this, 'tinyMap');
            b instanceof B && 'function' === typeof b[a] && (c = b[a].apply(b, Array.prototype.slice.call(d, 1)));
        }), 'undefined' !== typeof c ? c : this) : this.each(function() {
            g.data(this, 'tinyMap') || g.data(this, 'tinyMap', new B(this, a));
        });
    };
})(window.jQuery || {}, window, document);
//# sourceMappingURL=tinyMap.js.map

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj; } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! Magnific Popup - v1.0.0 - 2015-01-03
 * http://dimsemenov.com/plugins/magnific-popup/
 * Copyright (c) 2015 Dmitry Semenov; */
! function(a) {
    'function' == typeof define && define.amd ? define(['jquery'], a) : a('object' == (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) ? require('jquery') : window.jQuery || window.Zepto);
}(function(a) {
    var b,
        c,
        d,
        e,
        f,
        g,
        h = 'Close',
        i = 'BeforeClose',
        j = 'AfterClose',
        k = 'BeforeAppend',
        l = 'MarkupParse',
        m = 'Open',
        n = 'Change',
        o = 'mfp',
        p = '.' + o,
        q = 'mfp-ready',
        r = 'mfp-removing',
        s = 'mfp-prevent-close',
        t = function t() {},
        u = !!window.jQuery,
        v = a(window),
        w = function w(a, c) {
            b.ev.on(o + a + p, c);
        },
        x = function x(b, c, d, e) {
            var f = document.createElement('div');
            return f.className = 'mfp-' + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), c && f.appendTo(c)), f;
        },
        y = function y(c, d) {
            b.ev.triggerHandler(o + c, d), b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1), b.st.callbacks[c] && b.st.callbacks[c].apply(b, a.isArray(d) ? d : [d]));
        },
        z = function z(c) {
            return c === g && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace('%title%', b.st.tClose)), g = c), b.currTemplate.closeBtn;
        },
        A = function A() {
            a.magnificPopup.instance || (b = new t(), b.init(), a.magnificPopup.instance = b);
        },
        B = function B() {
            var a = document.createElement('p').style,
                b = ['ms', 'O', 'Moz', 'Webkit'];
            if (void 0 !== a.transition) return !0;
            for (; b.length;) {
                if (b.pop() + 'Transition' in a) return !0;
            }
            return !1;
        };
    t.prototype = {
        constructor: t,
        init: function init() {
            var c = navigator.appVersion;
            b.isIE7 = -1 !== c.indexOf('MSIE 7.'), b.isIE8 = -1 !== c.indexOf('MSIE 8.'), b.isLowIE = b.isIE7 || b.isIE8, b.isAndroid = /android/gi.test(c), b.isIOS = /iphone|ipad|ipod/gi.test(c), b.supportsTransition = B(), b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), d = a(document), b.popupsCache = {};
        },
        open: function open(c) {
            var e;
            if (c.isObj === !1) {
                b.items = c.items.toArray(), b.index = 0;
                var g,
                    h = c.items;
                for (e = 0; e < h.length; e++) {
                    if (g = h[e], g.parsed && (g = g.el[0]), g === c.el[0]) {
                        b.index = e;
                        break;
                    }
                }
            } else b.items = a.isArray(c.items) ? c.items : [c.items], b.index = c.index || 0;
            if (b.isOpen) return void b.updateItemHTML();
            b.types = [], f = '', b.ev = c.mainEl && c.mainEl.length ? c.mainEl.eq(0) : d, c.key ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}), b.currTemplate = b.popupsCache[c.key]) : b.currTemplate = {}, b.st = a.extend(!0, {}, a.magnificPopup.defaults, c), b.fixedContentPos = 'auto' === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos, b.st.modal && (b.st.closeOnContentClick = !1, b.st.closeOnBgClick = !1, b.st.showCloseBtn = !1, b.st.enableEscapeKey = !1), b.bgOverlay || (b.bgOverlay = x('bg').on('click' + p, function() {
                b.close();
            }), b.wrap = x('wrap').attr('tabindex', -1).on('click' + p, function(a) {
                b._checkIfClose(a.target) && b.close();
            }), b.container = x('container', b.wrap)), b.contentContainer = x('content'), b.st.preloader && (b.preloader = x('preloader', b.container, b.st.tLoading));
            var i = a.magnificPopup.modules;
            for (e = 0; e < i.length; e++) {
                var j = i[e];
                j = j.charAt(0).toUpperCase() + j.slice(1), b['init' + j].call(b);
            }
            y('BeforeOpen'), b.st.showCloseBtn && (b.st.closeBtnInside ? (w(l, function(a, b, c, d) {
                c.close_replaceWith = z(d.type);
            }), f += ' mfp-close-btn-in') : b.wrap.append(z())), b.st.alignTop && (f += ' mfp-align-top'), b.wrap.css(b.fixedContentPos ? { overflow: b.st.overflowY, overflowX: 'hidden', overflowY: b.st.overflowY } : { top: v.scrollTop(), position: 'absolute' }), (b.st.fixedBgPos === !1 || 'auto' === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({ height: d.height(), position: 'absolute' }), b.st.enableEscapeKey && d.on('keyup' + p, function(a) {
                27 === a.keyCode && b.close();
            }), v.on('resize' + p, function() {
                b.updateSize();
            }), b.st.closeOnContentClick || (f += ' mfp-auto-cursor'), f && b.wrap.addClass(f);
            var k = b.wH = v.height(),
                n = {};
            if (b.fixedContentPos && b._hasScrollBar(k)) {
                var o = b._getScrollbarSize();
                o && (n.marginRight = o);
            }
            b.fixedContentPos && (b.isIE7 ? a('body, html').css('overflow', 'hidden') : n.overflow = 'hidden');
            var r = b.st.mainClass;
            return b.isIE7 && (r += ' mfp-ie7'), r && b._addClassToMFP(r), b.updateItemHTML(), y('BuildControls'), a('html').css(n), b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)), b._lastFocusedEl = document.activeElement, setTimeout(function() {
                b.content ? (b._addClassToMFP(q), b._setFocus()) : b.bgOverlay.addClass(q), d.on('focusin' + p, b._onFocusIn);
            }, 16), b.isOpen = !0, b.updateSize(k), y(m), c;
        },
        close: function close() {
            b.isOpen && (y(i), b.isOpen = !1, b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(r), setTimeout(function() {
                b._close();
            }, b.st.removalDelay)) : b._close());
        },
        _close: function _close() {
            y(h);
            var c = r + ' ' + q + ' ';
            if (b.bgOverlay.detach(), b.wrap.detach(), b.container.empty(), b.st.mainClass && (c += b.st.mainClass + ' '), b._removeClassFromMFP(c), b.fixedContentPos) {
                var e = { marginRight: '' };
                b.isIE7 ? a('body, html').css('overflow', '') : e.overflow = '', a('html').css(e);
            }
            d.off('keyup' + p + ' focusin' + p), b.ev.off(p), b.wrap.attr('class', 'mfp-wrap').removeAttr('style'), b.bgOverlay.attr('class', 'mfp-bg'), b.container.attr('class', 'mfp-container'), !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(), b._lastFocusedEl && a(b._lastFocusedEl).focus(), b.currItem = null, b.content = null, b.currTemplate = null, b.prevHeight = 0, y(j);
        },
        updateSize: function updateSize(a) {
            if (b.isIOS) {
                var c = document.documentElement.clientWidth / window.innerWidth,
                    d = window.innerHeight * c;
                b.wrap.css('height', d), b.wH = d;
            } else b.wH = a || v.height();
            b.fixedContentPos || b.wrap.css('height', b.wH), y('Resize');
        },
        updateItemHTML: function updateItemHTML() {
            var c = b.items[b.index];
            b.contentContainer.detach(), b.content && b.content.detach(), c.parsed || (c = b.parseEl(b.index));
            var d = c.type;
            if (y('BeforeChange', [b.currItem ? b.currItem.type : '', d]), b.currItem = c, !b.currTemplate[d]) {
                var f = b.st[d] ? b.st[d].markup : !1;
                y('FirstMarkupParse', f), b.currTemplate[d] = f ? a(f) : !0;
            }
            e && e !== c.type && b.container.removeClass('mfp-' + e + '-holder');
            var g = b['get' + d.charAt(0).toUpperCase() + d.slice(1)](c, b.currTemplate[d]);
            b.appendContent(g, d), c.preloaded = !0, y(n, c), e = c.type, b.container.prepend(b.contentContainer), y('AfterChange');
        },
        appendContent: function appendContent(a, c) {
            b.content = a, a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0 ? b.content.find('.mfp-close').length || b.content.append(z()) : b.content = a : b.content = '', y(k), b.container.addClass('mfp-' + c + '-holder'), b.contentContainer.append(b.content);
        },
        parseEl: function parseEl(c) {
            var d,
                e = b.items[c];
            if (e.tagName ? e = { el: a(e) } : (d = e.type, e = { data: e, src: e.src }), e.el) {
                for (var f = b.types, g = 0; g < f.length; g++) {
                    if (e.el.hasClass('mfp-' + f[g])) {
                        d = f[g];
                        break;
                    }
                }
                e.src = e.el.attr('data-mfp-src'), e.src || (e.src = e.el.attr('href'));
            }
            return e.type = d || b.st.type || 'inline', e.index = c, e.parsed = !0, b.items[c] = e, y('ElementParse', e), b.items[c];
        },
        addGroup: function addGroup(a, c) {
            var d = function d(_d) {
                _d.mfpEl = this, b._openClick(_d, a, c);
            };
            c || (c = {});
            var e = 'click.magnificPopup';
            c.mainEl = a, c.items ? (c.isObj = !0, a.off(e).on(e, d)) : (c.isObj = !1, c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a, a.off(e).on(e, d)));
        },
        _openClick: function _openClick(c, d, e) {
            var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick;
            if (f || 2 !== c.which && !c.ctrlKey && !c.metaKey) {
                var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn;
                if (g)
                    if (a.isFunction(g)) {
                        if (!g.call(b)) return !0;
                    } else if (v.width() < g) return !0;
                c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()), e.el = a(c.mfpEl), e.delegate && (e.items = d.find(e.delegate)), b.open(e);
            }
        },
        updateStatus: function updateStatus(a, d) {
            if (b.preloader) {
                c !== a && b.container.removeClass('mfp-s-' + c), d || 'loading' !== a || (d = b.st.tLoading);
                var e = { status: a, text: d };
                y('UpdateStatus', e), a = e.status, d = e.text, b.preloader.html(d), b.preloader.find('a').on('click', function(a) {
                    a.stopImmediatePropagation();
                }), b.container.addClass('mfp-s-' + a), c = a;
            }
        },
        _checkIfClose: function _checkIfClose(c) {
            if (!a(c).hasClass(s)) {
                var d = b.st.closeOnContentClick,
                    e = b.st.closeOnBgClick;
                if (d && e) return !0;
                if (!b.content || a(c).hasClass('mfp-close') || b.preloader && c === b.preloader[0]) return !0;
                if (c === b.content[0] || a.contains(b.content[0], c)) {
                    if (d) return !0;
                } else if (e && a.contains(document, c)) return !0;
                return !1;
            }
        },
        _addClassToMFP: function _addClassToMFP(a) {
            b.bgOverlay.addClass(a), b.wrap.addClass(a);
        },
        _removeClassFromMFP: function _removeClassFromMFP(a) {
            this.bgOverlay.removeClass(a), b.wrap.removeClass(a);
        },
        _hasScrollBar: function _hasScrollBar(a) {
            return (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height());
        },
        _setFocus: function _setFocus() {
            (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus();
        },
        _onFocusIn: function _onFocusIn(c) {
            return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target) ? void 0 : (b._setFocus(), !1);
        },
        _parseMarkup: function _parseMarkup(b, c, d) {
            var e;
            d.data && (c = a.extend(d.data, c)), y(l, [b, c, d]), a.each(c, function(a, c) {
                if (void 0 === c || c === !1) return !0;
                if (e = a.split('_'), e.length > 1) {
                    var d = b.find(p + '-' + e[0]);
                    if (d.length > 0) {
                        var f = e[1];
                        'replaceWith' === f ? d[0] !== c[0] && d.replaceWith(c) : 'img' === f ? d.is('img') ? d.attr('src', c) : d.replaceWith('<img src="' + c + '" class="' + d.attr('class') + '" />') : d.attr(e[1], c);
                    }
                } else b.find(p + '-' + a).html(c);
            });
        },
        _getScrollbarSize: function _getScrollbarSize() {
            if (void 0 === b.scrollbarSize) {
                var a = document.createElement('div');
                a.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;', document.body.appendChild(a), b.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a);
            }
            return b.scrollbarSize;
        }
    }, a.magnificPopup = {
        instance: null,
        proto: t.prototype,
        modules: [],
        open: function open(b, c) {
            return A(), b = b ? a.extend(!0, {}, b) : {}, b.isObj = !0, b.index = c || 0, this.instance.open(b);
        },
        close: function close() {
            return a.magnificPopup.instance && a.magnificPopup.instance.close();
        },
        registerModule: function registerModule(b, c) {
            c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), this.modules.push(b);
        },
        defaults: { disableOn: 0, key: null, midClick: !1, mainClass: '', preloader: !0, focus: '', closeOnContentClick: !1, closeOnBgClick: !0, closeBtnInside: !0, showCloseBtn: !0, enableEscapeKey: !0, modal: !1, alignTop: !1, removalDelay: 0, prependTo: null, fixedContentPos: 'auto', fixedBgPos: 'auto', overflowY: 'auto', closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>', tClose: 'Close (Esc)', tLoading: 'Loading...' }
    }, a.fn.magnificPopup = function(c) {
        A();
        var d = a(this);
        if ('string' == typeof c) {
            if ('open' === c) {
                var e,
                    f = u ? d.data('magnificPopup') : d[0].magnificPopup,
                    g = parseInt(arguments[1], 10) || 0;
                f.items ? e = f.items[g] : (e = d, f.delegate && (e = e.find(f.delegate)), e = e.eq(g)), b._openClick({ mfpEl: e }, d, f);
            } else b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1));
        } else c = a.extend(!0, {}, c), u ? d.data('magnificPopup', c) : d[0].magnificPopup = c, b.addGroup(d, c);
        return d;
    };
    var C,
        D,
        E,
        F = 'inline',
        G = function G() {
            E && (D.after(E.addClass(C)).detach(), E = null);
        };
    a.magnificPopup.registerModule(F, {
        options: { hiddenClass: 'hide', markup: '', tNotFound: 'Content not found' },
        proto: {
            initInline: function initInline() {
                b.types.push(F), w(h + '.' + F, function() {
                    G();
                });
            },
            getInline: function getInline(c, d) {
                if (G(), c.src) {
                    var e = b.st.inline,
                        f = a(c.src);
                    if (f.length) {
                        var g = f[0].parentNode;
                        g && g.tagName && (D || (C = e.hiddenClass, D = x(C), C = 'mfp-' + C), E = f.after(D).detach().removeClass(C)), b.updateStatus('ready');
                    } else b.updateStatus('error', e.tNotFound), f = a('<div>');
                    return c.inlineElement = f, f;
                }
                return b.updateStatus('ready'), b._parseMarkup(d, {}, c), d;
            }
        }
    });
    var H,
        I = 'ajax',
        J = function J() {
            H && a(document.body).removeClass(H);
        },
        K = function K() {
            J(), b.req && b.req.abort();
        };
    a.magnificPopup.registerModule(I, {
        options: { settings: null, cursor: 'mfp-ajax-cur', tError: '<a href="%url%">The content</a> could not be loaded.' },
        proto: {
            initAjax: function initAjax() {
                b.types.push(I), H = b.st.ajax.cursor, w(h + '.' + I, K), w('BeforeChange.' + I, K);
            },
            getAjax: function getAjax(c) {
                H && a(document.body).addClass(H), b.updateStatus('loading');
                var d = a.extend({
                    url: c.src,
                    success: function success(d, e, f) {
                        var g = { data: d, xhr: f };
                        y('ParseAjax', g), b.appendContent(a(g.data), I), c.finished = !0, J(), b._setFocus(), setTimeout(function() {
                            b.wrap.addClass(q);
                        }, 16), b.updateStatus('ready'), y('AjaxContentAdded');
                    },
                    error: function error() {
                        J(), c.finished = c.loadError = !0, b.updateStatus('error', b.st.ajax.tError.replace('%url%', c.src));
                    }
                }, b.st.ajax.settings);
                return b.req = a.ajax(d), '';
            }
        }
    });
    var L,
        M = function M(c) {
            if (c.data && void 0 !== c.data.title) return c.data.title;
            var d = b.st.image.titleSrc;
            if (d) {
                if (a.isFunction(d)) return d.call(b, c);
                if (c.el) return c.el.attr(d) || '';
            }
            return '';
        };
    a.magnificPopup.registerModule('image', {
        options: { markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>', cursor: 'mfp-zoom-out-cur', titleSrc: 'title', verticalFit: !0, tError: '<a href="%url%">The image</a> could not be loaded.' },
        proto: {
            initImage: function initImage() {
                var c = b.st.image,
                    d = '.image';
                b.types.push('image'), w(m + d, function() {
                    'image' === b.currItem.type && c.cursor && a(document.body).addClass(c.cursor);
                }), w(h + d, function() {
                    c.cursor && a(document.body).removeClass(c.cursor), v.off('resize' + p);
                }), w('Resize' + d, b.resizeImage), b.isLowIE && w('AfterChange', b.resizeImage);
            },
            resizeImage: function resizeImage() {
                var a = b.currItem;
                if (a && a.img && b.st.image.verticalFit) {
                    var c = 0;
                    b.isLowIE && (c = parseInt(a.img.css('padding-top'), 10) + parseInt(a.img.css('padding-bottom'), 10)), a.img.css('max-height', b.wH - c);
                }
            },
            _onImageHasSize: function _onImageHasSize(a) {
                a.img && (a.hasSize = !0, L && clearInterval(L), a.isCheckingImgSize = !1, y('ImageHasSize', a), a.imgHidden && (b.content && b.content.removeClass('mfp-loading'), a.imgHidden = !1));
            },
            findImageSize: function findImageSize(a) {
                var c = 0,
                    d = a.img[0],
                    e = function e(f) {
                        L && clearInterval(L), L = setInterval(function() {
                            return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(L), c++, void(3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500)));
                        }, f);
                    };
                e(1);
            },
            getImage: function getImage(c, d) {
                var e = 0,
                    f = function f() {
                        c && (c.img[0].complete ? (c.img.off('.mfploader'), c === b.currItem && (b._onImageHasSize(c), b.updateStatus('ready')), c.hasSize = !0, c.loaded = !0, y('ImageLoadComplete')) : (e++, 200 > e ? setTimeout(f, 100) : g()));
                    },
                    g = function g() {
                        c && (c.img.off('.mfploader'), c === b.currItem && (b._onImageHasSize(c), b.updateStatus('error', h.tError.replace('%url%', c.src))), c.hasSize = !0, c.loaded = !0, c.loadError = !0);
                    },
                    h = b.st.image,
                    i = d.find('.mfp-img');
                if (i.length) {
                    var j = document.createElement('img');
                    j.className = 'mfp-img', c.el && c.el.find('img').length && (j.alt = c.el.find('img').attr('alt')), c.img = a(j).on('load.mfploader', f).on('error.mfploader', g), j.src = c.src, i.is('img') && (c.img = c.img.clone()), j = c.img[0], j.naturalWidth > 0 ? c.hasSize = !0 : j.width || (c.hasSize = !1);
                }
                return b._parseMarkup(d, { title: M(c), img_replaceWith: c.img }, c), b.resizeImage(), c.hasSize ? (L && clearInterval(L), c.loadError ? (d.addClass('mfp-loading'), b.updateStatus('error', h.tError.replace('%url%', c.src))) : (d.removeClass('mfp-loading'), b.updateStatus('ready')), d) : (b.updateStatus('loading'), c.loading = !0, c.hasSize || (c.imgHidden = !0, d.addClass('mfp-loading'), b.findImageSize(c)), d);
            }
        }
    });
    var N,
        O = function O() {
            return void 0 === N && (N = void 0 !== document.createElement('p').style.MozTransform), N;
        };
    a.magnificPopup.registerModule('zoom', {
        options: {
            enabled: !1,
            easing: 'ease-in-out',
            duration: 300,
            opener: function opener(a) {
                return a.is('img') ? a : a.find('img');
            }
        },
        proto: {
            initZoom: function initZoom() {
                var a,
                    c = b.st.zoom,
                    d = '.zoom';
                if (c.enabled && b.supportsTransition) {
                    var e,
                        f,
                        g = c.duration,
                        j = function j(a) {
                            var b = a.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
                                d = 'all ' + c.duration / 1e3 + 's ' + c.easing,
                                e = { position: 'fixed', zIndex: 9999, left: 0, top: 0, '-webkit-backface-visibility': 'hidden' },
                                f = 'transition';
                            return e['-webkit-' + f] = e['-moz-' + f] = e['-o-' + f] = e[f] = d, b.css(e), b;
                        },
                        k = function k() {
                            b.content.css('visibility', 'visible');
                        };
                    w('BuildControls' + d, function() {
                        if (b._allowZoom()) {
                            if (clearTimeout(e), b.content.css('visibility', 'hidden'), a = b._getItemToZoom(), !a) return void k();
                            f = j(a), f.css(b._getOffset()), b.wrap.append(f), e = setTimeout(function() {
                                f.css(b._getOffset(!0)), e = setTimeout(function() {
                                    k(), setTimeout(function() {
                                        f.remove(), a = f = null, y('ZoomAnimationEnded');
                                    }, 16);
                                }, g);
                            }, 16);
                        }
                    }), w(i + d, function() {
                        if (b._allowZoom()) {
                            if (clearTimeout(e), b.st.removalDelay = g, !a) {
                                if (a = b._getItemToZoom(), !a) return;
                                f = j(a);
                            }
                            f.css(b._getOffset(!0)), b.wrap.append(f), b.content.css('visibility', 'hidden'), setTimeout(function() {
                                f.css(b._getOffset());
                            }, 16);
                        }
                    }), w(h + d, function() {
                        b._allowZoom() && (k(), f && f.remove(), a = null);
                    });
                }
            },
            _allowZoom: function _allowZoom() {
                return 'image' === b.currItem.type;
            },
            _getItemToZoom: function _getItemToZoom() {
                return b.currItem.hasSize ? b.currItem.img : !1;
            },
            _getOffset: function _getOffset(c) {
                var d;
                d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem);
                var e = d.offset(),
                    f = parseInt(d.css('padding-top'), 10),
                    g = parseInt(d.css('padding-bottom'), 10);
                e.top -= a(window).scrollTop() - f;
                var h = { width: d.width(), height: (u ? d.innerHeight() : d[0].offsetHeight) - g - f };
                return O() ? h['-moz-transform'] = h.transform = 'translate(' + e.left + 'px,' + e.top + 'px)' : (h.left = e.left, h.top = e.top), h;
            }
        }
    });
    var P = 'iframe',
        Q = '//about:blank',
        R = function R(a) {
            if (b.currTemplate[P]) {
                var c = b.currTemplate[P].find('iframe');
                c.length && (a || (c[0].src = Q), b.isIE8 && c.css('display', a ? 'block' : 'none'));
            }
        };
    a.magnificPopup.registerModule(P, {
        options: { markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>', srcAction: 'iframe_src', patterns: { youtube: { index: 'youtube.com', id: 'v=', src: '//www.youtube.com/embed/%id%?autoplay=1' }, vimeo: { index: 'vimeo.com/', id: '/', src: '//player.vimeo.com/video/%id%?autoplay=1' }, gmaps: { index: '//maps.google.', src: '%id%&output=embed' } } },
        proto: {
            initIframe: function initIframe() {
                b.types.push(P), w('BeforeChange', function(a, b, c) {
                    b !== c && (b === P ? R() : c === P && R(!0));
                }), w(h + '.' + P, function() {
                    R();
                });
            },
            getIframe: function getIframe(c, d) {
                var e = c.src,
                    f = b.st.iframe;
                a.each(f.patterns, function() {
                    return e.indexOf(this.index) > -1 ? (this.id && (e = 'string' == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)), e = this.src.replace('%id%', e), !1) : void 0;
                });
                var g = {};
                return f.srcAction && (g[f.srcAction] = e), b._parseMarkup(d, g, c), b.updateStatus('ready'), d;
            }
        }
    });
    var S = function S(a) {
            var c = b.items.length;
            return a > c - 1 ? a - c : 0 > a ? c + a : a;
        },
        T = function T(a, b, c) {
            return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c);
        };
    a.magnificPopup.registerModule('gallery', {
        options: { enabled: !1, arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', preload: [0, 2], navigateByImgClick: !0, arrows: !0, tPrev: 'Previous (Left arrow key)', tNext: 'Next (Right arrow key)', tCounter: '%curr% of %total%' },
        proto: {
            initGallery: function initGallery() {
                var c = b.st.gallery,
                    e = '.mfp-gallery',
                    g = Boolean(a.fn.mfpFastClick);
                return b.direction = !0, c && c.enabled ? (f += ' mfp-gallery', w(m + e, function() {
                    c.navigateByImgClick && b.wrap.on('click' + e, '.mfp-img', function() {
                        return b.items.length > 1 ? (b.next(), !1) : void 0;
                    }), d.on('keydown' + e, function(a) {
                        37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next();
                    });
                }), w('UpdateStatus' + e, function(a, c) {
                    c.text && (c.text = T(c.text, b.currItem.index, b.items.length));
                }), w(l + e, function(a, d, e, f) {
                    var g = b.items.length;
                    e.counter = g > 1 ? T(c.tCounter, f.index, g) : '';
                }), w('BuildControls' + e, function() {
                    if (b.items.length > 1 && c.arrows && !b.arrowLeft) {
                        var d = c.arrowMarkup,
                            e = b.arrowLeft = a(d.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, 'left')).addClass(s),
                            f = b.arrowRight = a(d.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, 'right')).addClass(s),
                            h = g ? 'mfpFastClick' : 'click';
                        e[h](function() {
                            b.prev();
                        }), f[h](function() {
                            b.next();
                        }), b.isIE7 && (x('b', e[0], !1, !0), x('a', e[0], !1, !0), x('b', f[0], !1, !0), x('a', f[0], !1, !0)), b.container.append(e.add(f));
                    }
                }), w(n + e, function() {
                    b._preloadTimeout && clearTimeout(b._preloadTimeout), b._preloadTimeout = setTimeout(function() {
                        b.preloadNearbyImages(), b._preloadTimeout = null;
                    }, 16);
                }), void w(h + e, function() {
                    d.off(e), b.wrap.off('click' + e), b.arrowLeft && g && b.arrowLeft.add(b.arrowRight).destroyMfpFastClick(), b.arrowRight = b.arrowLeft = null;
                })) : !1;
            },
            next: function next() {
                b.direction = !0, b.index = S(b.index + 1), b.updateItemHTML();
            },
            prev: function prev() {
                b.direction = !1, b.index = S(b.index - 1), b.updateItemHTML();
            },
            goTo: function goTo(a) {
                b.direction = a >= b.index, b.index = a, b.updateItemHTML();
            },
            preloadNearbyImages: function preloadNearbyImages() {
                var a,
                    c = b.st.gallery.preload,
                    d = Math.min(c[0], b.items.length),
                    e = Math.min(c[1], b.items.length);
                for (a = 1; a <= (b.direction ? e : d); a++) {
                    b._preloadItem(b.index + a);
                }
                for (a = 1; a <= (b.direction ? d : e); a++) {
                    b._preloadItem(b.index - a);
                }
            },
            _preloadItem: function _preloadItem(c) {
                if (c = S(c), !b.items[c].preloaded) {
                    var d = b.items[c];
                    d.parsed || (d = b.parseEl(c)), y('LazyLoad', d), 'image' === d.type && (d.img = a('<img class="mfp-img" />').on('load.mfploader', function() {
                        d.hasSize = !0;
                    }).on('error.mfploader', function() {
                        d.hasSize = !0, d.loadError = !0, y('LazyLoadError', d);
                    }).attr('src', d.src)), d.preloaded = !0;
                }
            }
        }
    });
    var U = 'retina';
    a.magnificPopup.registerModule(U, {
            options: {
                replaceSrc: function replaceSrc(a) {
                    return a.src.replace(/\.\w+$/, function(a) {
                        return '@2x' + a;
                    });
                },
                ratio: 1
            },
            proto: {
                initRetina: function initRetina() {
                    if (window.devicePixelRatio > 1) {
                        var a = b.st.retina,
                            c = a.ratio;
                        c = isNaN(c) ? c() : c, c > 1 && (w('ImageHasSize.' + U, function(a, b) {
                            b.img.css({ 'max-width': b.img[0].naturalWidth / c, width: '100%' });
                        }), w('ElementParse.' + U, function(b, d) {
                            d.src = a.replaceSrc(d, c);
                        }));
                    }
                }
            }
        }),
        function() {
            var b = 1e3,
                c = 'ontouchstart' in window,
                d = function d() {
                    v.off('touchmove' + f + ' touchend' + f);
                },
                e = 'mfpFastClick',
                f = '.' + e;
            a.fn.mfpFastClick = function(e) {
                return a(this).each(function() {
                    var g,
                        h = a(this);
                    if (c) {
                        var i, j, k, l, m, n;
                        h.on('touchstart' + f, function(a) {
                            l = !1, n = 1, m = a.originalEvent ? a.originalEvent.touches[0] : a.touches[0], j = m.clientX, k = m.clientY, v.on('touchmove' + f, function(a) {
                                m = a.originalEvent ? a.originalEvent.touches : a.touches, n = m.length, m = m[0], (Math.abs(m.clientX - j) > 10 || Math.abs(m.clientY - k) > 10) && (l = !0, d());
                            }).on('touchend' + f, function(a) {
                                d(), l || n > 1 || (g = !0, a.preventDefault(), clearTimeout(i), i = setTimeout(function() {
                                    g = !1;
                                }, b), e());
                            });
                        });
                    }
                    h.on('click' + f, function() {
                        g || e();
                    });
                });
            }, a.fn.destroyMfpFastClick = function() {
                a(this).off('touchstart' + f + ' click' + f), c && v.off('touchmove' + f + ' touchend' + f);
            };
        }(), A();
});
//# sourceMappingURL=jquery.magnific-popup.min.js.map
