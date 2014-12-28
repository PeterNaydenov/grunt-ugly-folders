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

exports.uglyFolders = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
/*
  TEST CASES

  - default
  - src folder does not exists
  - src folder with '/' 
  - src folder without '/'
  - dest folder with '/' 
  - dest folder without '/'
  - folder name without '.js'
  - folder name with '.js'
  - uglify options - butify : true
  - uglify options - butify : false
  - very short foldername
  - duplication of target filename for folder and file
  - rename for existing folder
  - rename for non-existing folder
  - renameFile for existing file
  - renameFile for non-exisitng file
  - ignore for element that exists
  - ignore for element that not exists

*/
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options');
    var expected = grunt.file.read('test/expected/default_options');
    test.equal(actual, expected, 'should describe what the default behavior is.');

    test.done();
  },
  custom_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/custom_options');
    var expected = grunt.file.read('test/expected/custom_options');
    test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

    test.done();
  },
};
