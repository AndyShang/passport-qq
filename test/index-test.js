var vows = require('vows');
var assert = require('assert');
var util = require('util');
var qq = require('passport-qq');


vows.describe('passport-qq').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(qq.version);
    },
  },
  
}).export(module);
