# grunt-flash4canvas-support-datauri

> Converted to Data URI with images of manifest in published from Flash CC (Or Toolkit for createjs).

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-flash4canvas-support-datauri --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-flash4canvas-support-datauri');
```

## The "flash4canvas_support_datauri" task

### Overview
In your project's Gruntfile, add a section named `flash4canvas_support_datauri` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  flash4canvas_support_datauri: {
    files: {
      'dest_file_name': ['SRC_FILES'],  
    },
    options: {
      basepath: '',
      outputType: 'embed',
      ignores: null,
      mimeTypeToManifestTypeMap: {
          image  : 'image',
          audio  : 'sound',
          binary : 'binary'
      },
    }
  },
});
```

### Options

#### options.basepath
Type: `String`
Default value: `''`

A string value that is use to define base path of image. If you don't specify, It determine the base path of the image based on the path of the file that you defined.


### options.outputType
Type: `String`
Default value: `'embed'`

A string value that is use to detect output type. You have choice between 'embed' and 'json'.


### options.ignores
Type: `Array`
Default value: `null`

An array value that contain RegExp or String for ignore manifest id.


#### options.mimeTypeToManifestTypeMap
Type: `Object`
Default value: `{ image: 'image', audio: 'sound', binary: 'binary' }`

An object value that contain createjs manifest types.


### Usage Examples

#### Default Options

```js
grunt.initConfig({
  flash4canvas_support-datauri: {
    files: {
      'dest_file_name': ['./target_file.js'],  
    },
    options: {}
  },
});
```

#### Custom Options

```js
grunt.initConfig({
  flash4canvas_support_datauri: {
    files: {
      'dest_file_name': ['./target_file.js'],  
    },
    options: {
      basepath: '/path/to/image',
      outputType: 'embed',
      ignores: [
        /foo/,
        'bar'
      ],
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

- 0.0.3: add embed mode
- 0.0.0: pre release.
