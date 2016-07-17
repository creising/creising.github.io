'use strict';

describe('myApp.view2 module', function() {

  beforeEach(module('myApp.view3'));

  describe('view3 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view2Ctrl = $controller('View3Ctrl');
      expect(view2Ctrl).toBeDefined();
    }));

  });
});