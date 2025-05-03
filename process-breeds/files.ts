import { getFileAndDirName } from './utils.js';
import { PortraitCache } from './portraitCache.js';

const { __dirname } = getFileAndDirName();

export const ignoreFile = __dirname + '/breedignore';

// Each of these has the cache folder we want to use, and the
// device settings for use with puppeteer
export const caches = {
  cache36: new PortraitCache({
    folder: __dirname + '/caches/36/',
    inject: __dirname + '/inject/36/',
    device: {
      dpr: 1,
    },
  }),

  cache72: new PortraitCache({
    folder: __dirname + '/caches/72/',
    inject: __dirname + '/inject/72/',
    device: {
      dpr: 2.75,
    },
  }),
};
