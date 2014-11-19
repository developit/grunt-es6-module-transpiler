/*
 * grunt-es6-module-transpiler
 * https://github.com/joefiorini/grunt-es6-module-transpiler
 *
 * Copyright (c) 2013 Joe Fiorini
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var path = require('path'),
      transpiler = require("es6-module-transpiler"),
      PassthruResolver = require('../lib/PassthruResolver');

  function transpile(file, options) {
    var src = file.src,
        compiled, ext, method, moduleName;

    ext = path.extname(src);

    if (options.anonymous) {
      moduleName = '';
    } else if (typeof options.moduleName === 'string') {
      moduleName = options.moduleName;
    } else {
      moduleName = path.join(path.dirname(src), path.basename(src, ext)).replace(/[\\]/g, '/');
      if (file.orig.cwd) {
        moduleName = moduleName.slice(file.orig.cwd.length);
      }
      if (options.moduleName) {
        moduleName = options.moduleName(moduleName, file);
      }
    }

    //compiler = new Compiler(grunt.file.read(src), moduleName, options);

    var formatter;

    switch(String(options.type).toLowerCase()){
    case 'cjs':
    case 'commonjs':
      formatter = new transpiler.formatters.commonjs();
      break;
    case 'bundle':
      formatter = new transpiler.formatters.bundle();
      break;
    default:
      throw new Error("unknown transpile destination type: " + options.type);
    }

    var container = new transpiler.Container({
      resolvers: [
        new PassthruResolver([ moduleName ]),
        new transpiler.FileResolver([ path.dirname(src) ])
      ],
      formatter: formatter
    });

    // patched in support for a pass-through resolver
    container.getModules = function() {
        var modules = this.modules;
        return Object.keys(modules).map(function(key) {
            return modules[key];
        }).filter(function (module) {
            return !module.external;
        });
    };

    container.getModule( path.basename(moduleName) );
    //container.getModule( moduleName );
    container.write(file.dest);
  }

  function formatTranspilerError(filename, e) {
    var pos = '[' + 'L' + e.lineNumber + ':' + ('C' + e.column) + ']';
    return filename + ': ' + pos + ' ' + e.description;
  }

  grunt.registerMultiTask("transpile", function(){

    var opts = {};

    opts.imports = this.data.imports;
    opts.type = this.data.type;
    opts.moduleName = this.data.moduleName;
    opts.anonymous = this.data.anonymous;
    opts.compatFix = this.data.compatFix;

    this.files.forEach(function(file){
      file.src.filter(function(path){
        if(!grunt.file.exists(path)){
          grunt.log.warn('Source file "' + path + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function(path){
          transpile({src:path, dest:file.dest, orig:file.orig}, opts);
        // try {
        //   transpile({src:path, dest:file.dest, orig:file.orig}, opts);
        // } catch (e) {
        //   var message = formatTranspilerError(path, e);
        //
        //   grunt.log.error(message);
        //   grunt.fail.warn('Error compiling ' + path);
        // }
      });
    });

  });

};
