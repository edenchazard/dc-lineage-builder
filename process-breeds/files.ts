import type { PuppeteerLaunchOptions } from 'puppeteer';
import { KnownDevices } from 'puppeteer';
import { getFileAndDirName } from './utils';
import type { PortraitCacheSettings } from './types';

const { __dirname } = getFileAndDirName();

export const ignoreFile = __dirname + '/breed-ignore';

// Each of these has the cache folder we want to use, and the
// device settings for use with puppeteer
export const cache72: PortraitCacheSettings = {
  folder: __dirname + '/caches/72/',
  inject: __dirname + '/inject/72/',
  device: {
    dpr: 2.75,
    device: KnownDevices['Pixel 5'],
  },
};

export const cache36: PortraitCacheSettings = {
  folder: __dirname + '/caches/36/',
  inject: __dirname + '/inject/36/',
  device: {
    dpr: 1,
    device: null,
  },
};

export const chromiumSettings: PuppeteerLaunchOptions = {
  args: ['--no-sandbox'],
  headless: 'new',
  executablePath: '/usr/bin/google-chrome',
};
