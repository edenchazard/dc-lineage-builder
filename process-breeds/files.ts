import type { PuppeteerLaunchOptions } from 'puppeteer';
import { KnownDevices } from 'puppeteer';
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
      device: null,
    },
  }),

  cache72: new PortraitCache({
    folder: __dirname + '/caches/72/',
    inject: __dirname + '/inject/72/',
    device: {
      dpr: 2.75,
      device: KnownDevices['Pixel 5'],
    },
  }),
};

export const chromiumSettings: PuppeteerLaunchOptions = {
  args: ['--no-sandbox'],
  headless: 'shell',
  executablePath: '/usr/bin/google-chrome',
};
