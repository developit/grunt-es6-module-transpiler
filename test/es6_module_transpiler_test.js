'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function normalizedFileRead(path) {
  return grunt.util.normalizelf(grunt.file.read(path));
}

exports.es6_module_transpiler = {
  setUp: function(done) {
    done();
  },
  toCJS: function(test) {
    test.expect(2);

    var actual = normalizedFileRead('tmp/index.js').trim();
    var expected = normalizedFileRead('test/expected/index.js').trim();
    test.equal(actual, expected, 'outputs CommonJS');

    test.equal(
      normalizedFileRead('tmp/bar.js').trim(),
      normalizedFileRead('test/expected/bar.js').trim(),
      'outputs CommonJS dependencies'
    );

    test.done();
  }/*,
  toGlobals: function(test) {
    test.expect(1);

    var actual = normalizedFileRead('tmp/globals.js');
    var expected = normalizedFileRead('test/expected/globals.js');
    test.equal(actual, expected, 'outputs Globals');

    test.done();
  }*/
};
