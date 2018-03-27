'use strict';

describe('myApp.recipe module', function() {

  beforeEach(module('myApp.favorite'));

  describe('recipe controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var favoriteCtrl = $controller('RecipeCtrl');
      expect(favoriteCtrl).toBeDefined();
    }));
  });
});