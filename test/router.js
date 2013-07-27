var assert = require('assert');
var vows = require('vows');
var router = require('./../router');

var tester = Object.create(router);
var ok = function(){};

function testRoute(path){
  return router.match(path);
}

tester.add('/<param1>/<param2>/', ok);
tester.add('/', ok);

vows.describe('router matches').addBatch({
  '/': function(){
    assert.isTrue(testRoute('/').matched);
  },
  'not /a or /a/': function(){
    assert.isFalse(testRoute('/a').matched);
    assert.isFalse(testRoute('/a/').matched);
  },
  '/a/b and /a/b/ and get params': function() {
    var result = [testRoute('/a/b'), testRoute('/a/b/')];
    assert.equal(result[0].params.param1, 'a');
    assert.equal(result[0].params.param2, 'b');
    assert.equal(result[1].params.param1, 'a');
    assert.equal(result[1].params.param2, 'b');
  },
  'not /a/b/c': function(){
    assert.isFalse(testRoute('/a/b/c').matched, false);
  }
}).export(module)