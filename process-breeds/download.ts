import { setTimeout } from 'timers/promises';

import puppeteer from 'puppeteer';
import { caches, chromiumSettings } from './files';

await (async function main() {
  // parse args for codes
  const codes = process.argv.slice(2);

  const expectedFormat = /^[a-zA-Z0-9]{4,5}$/;

  codes.forEach((code) => {
    if (!code.match(expectedFormat)) {
      throw new Error(`bad code: ${code}`);
    }
  });

  const cacheArray = Object.values(caches);
  await Promise.all(cacheArray.map((cache) => cache.tryAccess()));

  const browser = await puppeteer.launch(chromiumSettings);

  let throttle = 0;

  // all ok, download the image for each cache
  await Promise.all(
    cacheArray.map(async (cache) => {
      await Promise.all(
        codes.map(async (code) => {
          // we don't want to ddos DC, so we'll throttle our requests to 1/second.
          throttle++;
          await setTimeout(throttle * 1000);
          await cache.downloadPortrait(code, browser);
        }),
      );
    }),
  );

  await browser.close();
})();
