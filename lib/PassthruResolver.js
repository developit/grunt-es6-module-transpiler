var Module = require('../node_modules/es6-module-transpiler/lib/module');

function PassthruResolver(ignore) {
    this.ignore = ignore;
}

/**
 * Resolves `importedPath` imported by the given module `fromModule` to a
 * an external module.
 *
 * @param {string} importedPath
 * @param {?Module} fromModule
 * @param {Container} container
 * @return {?Module}
 */
PassthruResolver.prototype.resolveModule = function (importedPath, fromModule, container) {
  var module;

  if (this.ignore.indexOf(importedPath)>-1) {
    return null;
  }

  module = container.getCachedModule(importedPath);

  if (!module) {
    module = new Module(importedPath, importedPath, container);
    module.external = true;
    console.log('INFO: External module detected: "%s"', importedPath);
  }

  return module;
};

module.exports = PassthruResolver;
