/*
 * grunt-cjs-support-datauri
 * https://github.com/dameleon/grunt-cjs-support-datauri
 *
 * Copyright (c) 2014 dameleon
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var fs = require('fs');
  var path = require('path');
  var readline = require('readline');
  var MIME_TYPES = {
    'png': 'image/png',
    'gif': 'image/gif',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg'
  };
  var TYPE_REPLACE_TARGET = '%TYPE_REPLACE_TARGET%';

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('cjs_support_datauri', 'Converted to DataURL, the images of manifest in output from Flash CC (or Toolkit for createjs)', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var done = this.async();
    var options = this.options({
      varName: 'manifest',
      namespace: null,
      cjsImageType: 'createjs.LoadQueue.IMAGE'
    });

    this.files.forEach(function(f) {
      f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        var rs = fs.ReadStream(filepath);
        var manifests = '[';
        var reading = false;
        var reader = readline.createInterface({ 'input': rs, 'output': {} });

        reader.on('close', function() {
          var manifest;

          try {
            manifest = eval(manifests);
          } catch (e) {
            grunt.log.error('JSON.parse error', e, manifests);
          }
          convertImageToBase64WithManifest(manifest);
        });
        reader.on('line', function(line) {
          if (reading) {
            if (/\]/.test(line)) {
              manifests += ']';
              reader.close();
            } else {
              manifests += line.trim();
            }
          }
          // Read start to next line
          else if (/manifest:\s\[/.test(line)) {
            reading = true;
          }
        });
      });

      function convertImageToBase64WithManifest(manifests) {
        var prefix = getPrefixByOption(options);

        manifests.map(function(manifest) {
          var filepath = manifest.src;

          if (!grunt.file.exists(filepath)) {
            grunt.log.error("Can't find file.", filepath);
          }
          var extName = path.extname(filepath);
          var mimeType = MIME_TYPES[extName.substr(1, extName.length)];

          if (!mimeType) {
            return;
          }
          var file = fs.readFileSync(filepath);

          manifest.src = 'data:' + mimeType + ';base64,' + new Buffer(file).toString('base64');
          manifest.type = TYPE_REPLACE_TARGET;
        });

        var jsonStr = JSON.stringify(manifests, null, 2).
                        replace(new RegExp('"' + TYPE_REPLACE_TARGET + '"', 'gi'), options.cjsImageType);

        grunt.file.write(f.dest + '.js', prefix + jsonStr + ';');
        grunt.log.writeln('File "' + f.dest + '" created.');
        done();
      }
    });
  });

  function getPrefixByOption(options) {
    var ns = options.namespace;
    var vn = options.varName;
    var res;

    if (ns) {
      res = ns + '||(' + ns + '={});\n' +
            ns + '.' + vn;
    } else {
      res = 'var ' + vn;
    }
    return res + ' = ';
  };

};
