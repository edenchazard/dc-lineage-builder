import { setTimeout } from 'timers/promises';

import puppeteer from 'puppeteer';

import { cache36, cache72, chromiumSettings } from './files.js';
import { portraitCache } from './cache.js';

async function main() {
    // parse args for codes
    const codes = process.argv.slice(2);

    const expectedFormat = /^[a-zA-Z0-9]{4,5}$/;

    codes.forEach((code) => {
        if (!code.match(expectedFormat)) {
            throw new Error(`bad code: ${code}`);
        }
    });

    const [driver36, driver72] = await Promise.all([
        portraitCache.load(cache36.folder),
        portraitCache.load(cache72.folder),
    ]);

    const caches = [
        {
            driver: driver36,
            settings: cache36
        },
        {
            driver: driver72,
            settings: cache72
        }
    ];

    const browser = await puppeteer.launch(chromiumSettings);

    let throttle = 0;

    // all ok, download the image for each cache
    await Promise.all(caches.map(async (cache) => {
        await Promise.all(codes.map(async (code) => {
            // we don't want to ddos DC, so we'll throttle our requests to 1/second.
            throttle++;
            await setTimeout(throttle * 1000);
            await cache.driver.downloadPortrait(code, browser, cache.settings.device);
        }));
    }));

    browser.close();
}

main();