/*
 * grunt-flash4canvas-support-datauri
 * https://github.com/dameleon/grunt-flash4canvas-support-datauri
 *
 * Copyright (c) 2014 dameleon
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    flash4canvas_support_datauri: {
      test: {
        options: {
            ignores: ['aaa'],
            basepath: __dirname + '/test/fixtures'
        },
        files: [
          {
            src: ['./test/fixtures/*.js'],
            dest: './tmp.hoge/'
          }
        ]
      }
    },

    jshint: {
      all: ['./tasks/**/*.js'],
      options: {
        evil: true
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['clean', 'flash4canvas_support_datauri']);

  grunt.registerTask('default', ['jshint']);
};
