'use strict';

describe('myApp.favorite module', function() {

  beforeEach(module('myApp.favorite'));

  describe('favorite controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var favoriteCtrl = $controller('FavoriteCtrl');
      expect(favoriteCtrl).toBeDefined();
    }));
  });
});