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
    var MIME_TYPES = {
        'png'  : 'image/png',
        'gif'  : 'image/gif',
        'jpg'  : 'image/jpeg',
        'jpeg' : 'image/jpeg'
    };
    var MANIFEST_RE = /manifest\s?:\s?(\[[\s\w\d\/-{}"'.,]*?\])/m;
    var MANIFEST_PREFIX = 'manifest: ';
    var OUTPUT_TYPE = {
        EMBED: 'embed',
        JSON:  'json'
    };
    var DEFAULT_PARAMS = {
        basepath: '',
        outputType: OUTPUT_TYPE.EMBED,
        ignores: null,
        mimeTypeToManifestTypeMap: {
            image  : 'image',
            audio  : 'sound',
            binary : 'binary'
        },
    };

    grunt.registerMultiTask('flash4canvas_support_datauri', 'Converted to DataURL, the images of manifest in output from Flash CC (or Toolkit for createjs)', function() {
        var options = this.options(DEFAULT_PARAMS);

        this.files.forEach(function(f) {
            f.src
                .filter(function(filepath) {
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                })
                .map(function(filepath) {
                    var file = fs.readFileSync(filepath).toString('utf8');
                    var matched = MANIFEST_RE.exec(file);

                    if (!matched || matched.length < 2) {
                        grunt.log.warn('Undefined manifest in file: ' + filepath);
                        return;
                    }
                    var manifests = eval(matched[1]);
                    var res = [];

                    manifests.forEach(function(m) {
                        if (isIgnore(m.id)) {
                            res.push(m);
                            return;
                        }
                        var targetFilePath = path.join(options.basepath || path.dirname(filepath), m.src);

                        if (!fs.existsSync(targetFilePath)) {
                            grunt.log.warn('Target file not found : ' + targetFilePath);
                            res.push(m);
                            return;
                        }
                        var mimeType = getMimeTypeByFilePath(targetFilePath);
                        var targetFile = fs.readFileSync(targetFilePath);

                        m.src = generateDataUrl(targetFile, mimeType);
                        m.type = getManifestTypeByMimeType(mimeType);
                        res.push(m);
                    });

                    res = JSON.stringify(res);

                    if (options.outputType === OUTPUT_TYPE.JSON) {
                        grunt.file.write(f.dest, res);
                        grunt.log.writeln('JSON File "' + f.dest + '" created.');
                    } else {
                        grunt.file.write(f.dest, file.replace(MANIFEST_RE, MANIFEST_PREFIX + res));
                        grunt.log.writeln('Created file and replace manifests to Base64 string in "' + f.dest + '"');
                    }
                });
        });


        function isIgnore(str) {
            var ignores = options.ignores;

            if (!ignores || !ignores.length) {
                return false;
            } else if (!Array.isArray(ignores)) {
                grunt.log.error('TypeError: options.ignores must be Array');
            }
            return ignores.some(function(re) {
                if (typeof re === 'string') {
                    re = new RegExp(re);
                }
                if (re.test(str)) {
                    return true;
                }
            });
        }

        function getMimeTypeByFilePath(filepath) {
            var ext = path.extname(filepath);
            var mimeType = MIME_TYPES[ext.substr(1, ext.length)];

            if (!mimeType) {
                grunt.log.error('Undefined mimetype : ' + ext);
            }
            return mimeType;
        }

        function generateDataUrl(file, mimeType) {
            return ['data:', mimeType, ';base64,' + new Buffer(file).toString('base64')].join('');
        }

        function getManifestTypeByMimeType(mimeType) {
            var mimeHeader = mimeType.split('/')[0];
            var res = options.mimeTypeToManifestTypeMap[mimeHeader];

            if (!res) {
                res = options.mimeTypeToManifestTypeMap.binary;
            }
            return res;
        }
    });
};
