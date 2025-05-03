import { promises as fs } from 'fs';
import type { PortraitCacheSettings } from './types';
import sharp from 'sharp';
import { ofetch } from 'ofetch';
import nodeHTMLParser from 'node-html-parser';

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

  async downloadPortrait(code: string): never | Promise<void> {
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

    const responseLineage = await ofetch(
      `https://dragcave.net/lineage/${code}`,
      {
        headers: {
          Cookie: `dpr=${this.settings.device.dpr};`,
        },
      },
    );

    // Parse the text
    const page = nodeHTMLParser.parse(responseLineage);

    // find the img tag of the dragon we're looking for
    const element = page.querySelector(`img[alt='${actualCode}']`);

    if (!element || 'src' in element.attributes === false) {
      throw new Error(`Failed to find image node for ${actualCode}`);
    }

    // go to the image and then download it to our cache
    const responseLineageTile = await ofetch(
      new URL(element.attributes.src, 'https://dragcave.net').href,
      {
        headers: {
          Cookie: `dpr=${this.settings.device.dpr};`,
        },
      },
    );

    const image = Buffer.from(await responseLineageTile.arrayBuffer());

    if (!image) {
      throw new Error(`Image failed to download: ${actualCode}`);
    }

    await sharp(image)
      .webp({
        nearLossless: true,
      })
      .toFile(filePath.substring(0, filePath.lastIndexOf('.')) + '.webp');
  }
}

export { Cache, PortraitCache };
