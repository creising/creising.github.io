(function (global) {
    'use strict';

    var Query = function () {
      /* Your awesome module logic here… */
    };

    /* …and here */
    Query.print = function() {
      console.log('here we go!');
    }

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return Query; });
    // CommonJS and Node.js module support.
    } else if (typeof exports !== 'undefined') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Query;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Query = Query;
    } else {
        global.Query = Query;
    }
})(this);
