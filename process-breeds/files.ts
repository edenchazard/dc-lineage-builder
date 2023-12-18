import type { PuppeteerLaunchOptions } from 'puppeteer';
import { KnownDevices } from 'puppeteer';
import { getFileAndDirName } from './utils';
import { PortraitCache } from './portraitCache';

const { __dirname } = getFileAndDirName();

export const ignoreFile = __dirname + '/breed-ignore';

// Each of these has the cache folder we want to use, and the
// device settings for use with puppeteer
export const caches = {
  cache36: new PortraitCache({
    folder: __dirname + '/caches/72/',
    inject: __dirname + '/inject/72/',
    device: {
      dpr: 2.75,
      device: KnownDevices['Pixel 5'],
    },
  }),

  cache72: new PortraitCache({
    folder: __dirname + '/caches/36/',
    inject: __dirname + '/inject/36/',
    device: {
      dpr: 1,
      device: null,
    },
  }),
};

export const chromiumSettings: PuppeteerLaunchOptions = {
  args: ['--no-sandbox'],
  headless: 'new',
  executablePath: '/usr/bin/google-chrome',
};
