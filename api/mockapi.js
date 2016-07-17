(function (global) {
    'use strict';

    var MyModule = function () {
      /* Your awesome module logic here… */
    };

    /* …and here */
    MyModule.print = function() {
      console.log('here we go!');
    }

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return MyModule; });
    // CommonJS and Node.js module support.
    } else if (typeof exports !== 'undefined') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = MyModule;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.MyModule = MyModule;
    } else {
        global.MyModule = MyModule;
    }
})(this);
