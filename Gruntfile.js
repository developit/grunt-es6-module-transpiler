/*
 * grunt-es6-module-transpiler
 * https://github.com/joefiorini/grunt-es6-module-transpiler
 *
 * Copyright (c) 2013 Joe Fiorini
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    release: {
      options: {
        tagName: 'v<%= version %>',
        commitMessage: 'Release v<%= version %> :tada:',
        tagMessage: 'Release v<%= version %>'
      }
    },

    // Configuration to be run (and then tested).
    transpile: {
      toCJS: {
        type: "cjs",
        files: [{
          expand: true,
          cwd: 'test/fixtures',
          src: ['**/*.js'],
          dest: 'tmp'
        }],
    }/*,
      toGlobals: {
        type: "globals",
        imports: { bar: "Bar" },
        files: {
          'tmp/globals.js': ['test/fixtures/input.js'],
          'tmp/globals-bar.js': ['test/fixtures/bar.js']
        }
      }*/
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-release');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'transpile', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
