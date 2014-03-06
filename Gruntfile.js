/*
 * grunt-cjs-support-datauri
 * https://github.com/dameleon/grunt-cjs-support-datauri
 *
 * Copyright (c) 2014 dameleon
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    cjs_support_datauri: {
      test: {
        options: {
        },
        files: {
          'testsssss': ['./Untitled.js'],
        },
      }
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'cjs_support_datauri']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
