import { promises as fs } from 'fs';
import type { Browser } from 'puppeteer';
import type { PortraitCacheSettings } from './types';
import sharp from 'sharp';

class Cache {
  private path: string;

  constructor(cachePath: string) {
    this.path = cachePath;
  }

  async tryAccess() {
    try {
      await fs.access(this.path);
    } catch (_) {
      throw new Error(`Cannot access cache: ${this.path}`);
    }
  }
}

class PortraitCache extends Cache {
  readonly settings: PortraitCacheSettings;

  constructor(settings: PortraitCacheSettings) {
    super(settings.folder);
    this.settings = settings;
  }

  // returns a new page with custom headers and cookies for dc
  // set
  async newPage(browser: Browser, options: PortraitCacheSettings['device']) {
    const page = await browser.newPage();

    if (options.device) {
      // emulate specifed device
      await page.emulate(options.device);
    }

    // set device pixel ratio in the header and cookie
    await page.setExtraHTTPHeaders({ dpr: (options.dpr ?? 1).toString() });

    const cookies = [
      {
        name: 'dpr',
        value: options.dpr.toString(),
        domain: '.dragcave.net',
      },
    ];

    await page.setCookie(...cookies);
    return page;
  }

  async downloadPortrait(
    code: string,
    browser: Browser,
  ): never | Promise<void> {
    // sometimes we might want to pick the same dragon
    // but it can have a variable image we only fetch
    // at certain times.
    const underscore = code.indexOf('_');
    const isVariable = underscore > -1;
    const actualCode = code.substring(0, isVariable ? underscore : undefined);
    const filePath = `${this.settings.folder}${code}.png`;

    console.log(
      `... Downloading image for ${actualCode} to ${this.settings.folder} as file ${code}`,
    );
    const page = await this.newPage(browser, this.settings.device);

    // navigate to the lineage page
    await page.goto(`https://dragcave.net/lineage/${actualCode}`);

    // find the img tag of the dragon we're looking for
    const element = await page.$(`img[alt='${actualCode}']`);

    if (!element) {
      throw new Error(`Failed to find image node for ${actualCode}`);
    }

    // get the uniquely generated src
    const imgUrl = await (await element.getProperty('src')).jsonValue();

    // go to the image and then download it to our cache
    const image = await page.goto(imgUrl);

    if (!image) {
      throw new Error(`Image failed to download: ${actualCode}`);
    }

    await sharp(await image.buffer())
      .webp({
        nearLossless: true,
      })
      .toFile(filePath.substring(0, filePath.lastIndexOf('.')) + '.webp');
    await page.close();
  }
}

export { Cache, PortraitCache };
