/*
 * grunt-flash4canvas-support-datauri
 * https://github.com/dameleon/grunt-flash4canvas-support-datauri
 *
 * Copyright (c) 2014 dameleon
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var readline = require('readline');
  var MIME_TYPES = {
    'png'  : 'image/png',
    'gif'  : 'image/gif',
    'jpg'  : 'image/jpeg',
    'jpeg' : 'image/jpeg'
  };
  var TYPE_REPLACE_TARGET = '%TYPE_REPLACE_TARGET%';

  grunt.registerMultiTask('flash4canvas_support_datauri', 'Converted to DataURL, the images of manifest in output from Flash CC (or Toolkit for createjs)', function() {
    var done = this.async();
    var options = this.options({
        varName       : 'manifest',
        namespace     : null,
        cjsImageType  : 'createjs.LoadQueue.IMAGE',
        imageBasePath : null,
        ignore        : []
    });

    this.files.forEach(function(f) {
      var manifests = '[';
      var taskLength = f.src.length;
      var counter = function(manifest) {
        counter.count++;
        manifests += manifest;

        if (taskLength <= counter.count) {
          manifests += ']';
          var obj;

          try {
            // FIXME: Security fix
            obj = eval(manifests);
          } catch (e) {
            grunt.log.error('JSON.parse error', e, manifests);
          }
          createBase64AssetListWithManifests(f, obj, options.imageBasePath, done);
        }
      };

      counter.count = 0;

      f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        var rs = fs.ReadStream(filepath);
        var reading = false;
        var reader = readline.createInterface({ 'input': rs, 'output': {} });
        var manifest = '';

        if (!options.imageBasePath) {
          options.imageBasePath = path.dirname(filepath) + '/';
        }

        reader.on('close', function() {
          counter(manifest);
        });
        reader.on('line', function(line) {
          var matches;

          if (reading) {
            if ((matches = line.match(/^(.*)?\]/))) {
              if (matches[1]) {
                manifest += matches[1].trim();
              }
              reader.close();
            } else if (!isIgnore(line)) {
              manifest += line.trim();
            }
          }
          else if ((matches = line.match(/manifest:\s?\[(.*)?$/))) {
            if (matches[1]) {
              manifest += matches[1].trim();
            }
            reading = true;
          }
        });
      });
    });

    function isIgnore(str) {
      var ignore = options.ignore;
      var res = false;

      if (!ignore || !ignore.length) {
        return res;
      }
      for (var i = 0, re; re = ignore[i]; i++) {
        var type = typeof re;

        if (type === 'string') {
          re = new RegExp(re);
        }
        if (re.test(str)) {
          res = true;
          break;
        }
      }
      return res;
    }

    function createBase64AssetListWithManifests(f, manifests, basePath, callback) {
      var prefix = getPrefixByOption(options);

      manifests.map(function(manifest) {
        var filepath = path.normalize(basePath + '/' + manifest.src);

        if (!grunt.file.exists(filepath)) {
          grunt.log.error("Can't find file.", filepath);
          callback(false);
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

      grunt.file.write(f.dest, prefix + jsonStr + ';');
      grunt.log.writeln('File "' + f.dest + '" created.');
      callback(true);
    }
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
  }

};
