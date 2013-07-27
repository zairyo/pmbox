var assert = require('assert');
var vows = require('vows');
var router = require('./../router');

var tester = Object.create(router);
var ok = function(){};

function testRoute(path){
  return router.match(path);
}

tester.add('/<param1>/<param2>/', ok);
tester.add(/^\/abc$/, ok);
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
    var table = {
      '01': 'a',
      '02': 'b',
      '11': 'a',
      '12': 'b'
    };
    for(var i in table){
      assert.equal((result[i[0]].params)['param'+i[1]], table[i]);
    }
  },
  'not /a/b/c': function() {
    assert.isFalse(testRoute('/a/b/c').matched, false);
  },
  '/abc': function() {
    assert.isTrue(testRoute('/abc').matched, true);
  }
}).export(module)