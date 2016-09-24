/*!
 * progressively 0.1
 * https://github.com/thinker3197/progressively.js
 * @license MIT licensed
 *
 * Copyright (C) 2016 Ashish
 */

;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.progressively = factory(root);
    }
})(this, function(root) {

    'use strict';

    var progressively = {};

    var defaults, callback, poll, useDebounce;

    callback = function() {};

    function extend(primaryObject, secondaryObject) {
        var o = {};
        for (var prop in primaryObject) {
            o[prop] = secondaryObject.hasOwnProperty(prop) ? secondaryObject[prop] : primaryObject[prop];
        }
        return o;
    };

    function isHidden(el) {
        return (el.offsetParent === null);
    };

    function inView(el, view) {
        if (isHidden(el)) {
            return false;
        }

        var box = el.getBoundingClientRect();
        return (
            box.top >= 0 &&
            box.left >= 0 &&
            box.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            box.right <= (window.innerWidth || document.documentElement.clientWidth));

    };

    function loadImg(el, callback) {
        setTimeout(function() {
            var img = new Image();

            img.onload = function() {
                el.src = this.src;
                if (typeof callback === 'function')
                    callback();
            };

            img.src = el.dataset.progressive;
        }, defaults.delay);
    };

    function listen() {
        if (!useDebounce && !!poll) {
            return;
        }
        clearTimeout(poll);
        poll = setTimeout(function() {
            progressively.render();
            poll = null;
        }, defaults.throttle);
    }
    /*
     * default settings
     */

    defaults = {
        throttle: 250,
        blur: 20,
        delay: 12
    };

    progressively.init = function(options) {
        options = options || {};

        defaults = extend(defaults, options);

        progressively.render();

        if (document.addEventListener) {
            root.addEventListener('scroll', listen, false);
            root.addEventListener('load', listen, false);
        } else {
            root.attachEvent('onscroll', listen);
            root.attachEvent('onload', listen);
        }
    };

    progressively.render = function() {
        var fnodes = document.querySelectorAll('.progressive-img'),
            inodes = document.querySelectorAll('[data-progressive]'),
            elem;

        for (var i = inodes.length - 1; i >= 0; --i) {
            elem = inodes[i];

            if (inView(elem))
                loadImg(elem);

        }

        if (!inodes.length) {
            progressively.drop();
        }
    };

    progressively.drop = function() {};

    return progressively;
});
