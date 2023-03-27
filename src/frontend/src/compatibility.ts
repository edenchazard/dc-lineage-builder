import hasOwn from 'object.hasown';

// Shims and polyfills
if (!Object.hasOwn) {
  hasOwn.shim();
}
