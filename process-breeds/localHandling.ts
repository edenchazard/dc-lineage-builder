import { promises as fs } from 'fs';
import { setTimeout } from 'timers/promises';
import puppeteer from 'puppeteer';
import { chromiumSettings } from './files';
import type { IgnoreFile, IgnoreList, PortraitSizing } from './types';
import type { PortraitCache } from './portraitCache';
import {
  tags,
  type BreedEntry,
  type GenderOnly,
  type NewTag,
} from '../app/shared/types';

type EntryName = string;

export interface LocalBreedsJSON {
  [breedName: EntryName]: Entry;
}

interface Base {
  dimorphism: boolean;
  genderOnly: GenderOnly;
  tags: NewTag[];
}

interface Simple extends Base {
  sprites: Sprites;
  subentries?: never;
}

interface Extended extends Base {
  subentries: {
    [name: EntryName]: {
      sprites: Sprites;
      tags?: NewTag[];
    };
  };
  sprites?: never;
}

type Entry = Simple | Extended;

type Sprites = [string, string] | [string];

export function getBreedTable(json: LocalBreedsJSON) {
  const entries: BreedEntry[] = [];

  const createEntry = function (
    name: EntryName,
    overallBreed: Entry,
    spriteData: Sprites,
  ) {
    const entry: BreedEntry = {
      name: name,
      genderOnly: overallBreed.genderOnly,
      metaData: {
        tags: overallBreed.tags,
        src: 'local',
      },
    };

    if (overallBreed.dimorphism) {
      entry.male = spriteData[0];
      entry.female = spriteData[1];
    } else {
      if (!overallBreed.genderOnly) {
        entry.male = entry.female = spriteData[0];
      } else {
        const gender = overallBreed.genderOnly == 'm' ? 'male' : 'female';
        entry[gender] = spriteData[0];
      }
    }

    return entry;
  };

  for (const breedName in json) {
    const overallBreed = { ...json[breedName] };

    const subentries: Extended['subentries'] = overallBreed.subentries ?? {
      __regular__: {
        sprites: overallBreed.sprites,
        tags: [],
      },
    };

    for (const subentryName in subentries) {
      const subentry = subentries[subentryName];
      const entryName =
        subentryName === '__regular__'
          ? breedName
          : `${breedName} ${subentryName}`;

      const entry = createEntry(entryName, overallBreed, subentry.sprites);

      // Append any subentry tags to the overall breed tags.
      if ((subentry.tags ?? []).length > 0) {
        entry.metaData.tags = [...overallBreed.tags, ...(subentry.tags ?? [])];
      }

      // Sort them by preferred order.
      entry.metaData.tags = entry.metaData.tags.toSorted(
        (a, b) => tags.indexOf(a) - tags.indexOf(b),
      );

      entries.push(entry);
    }
  }

  return entries;
}

async function getTileFullPaths(dir: string): Promise<string[]> {
  return (await fs.readdir(dir)).map((file) => dir + file);
}

async function getIgnoredBreeds(ignoreFile: IgnoreFile): Promise<IgnoreList> {
  const content = (await fs.readFile(ignoreFile, { encoding: 'utf8' })).trim();
  return (
    content
      // standardise line endings
      .replace(/\r\n/g, '\n')
      // split by line
      .split('\n')
      // trim whitespaces for each line
      .map((line) => line.trim())
      // filter out any line that isn't a code
      .filter((line) => line.match(/^[a-z0-9]{4,5}$/i))
  );
}

export async function checkCache(
  json: LocalBreedsJSON,
  cache: PortraitCache,
  ignoreFile: IgnoreFile | null = null,
): Promise<void> {
  // get a list of codes we want to check our specified cache for
  // while ignoring any on our ignore file
  const getCodes = (breeds: BreedEntry[], ignoreList: IgnoreList): string[] => {
    const codes = new Set<string>();

    breeds.forEach((breed) => {
      if (breed.male !== undefined) {
        codes.add(breed.male);
      }
      if (breed.female !== undefined) {
        codes.add(breed.female);
      }
    });

    // return only the codes not in our ignore list
    return [...codes].filter((code) => !ignoreList.includes(code));
  };

  const browser = await puppeteer.launch(chromiumSettings);

  console.log(`Checking cache for: ${cache.settings.folder}`);

  // remove ignored images
  const ignored = ignoreFile !== null ? await getIgnoredBreeds(ignoreFile) : [];
  console.log(`... IGNORING: ${ignored.join(', ')}`);

  const codes = getCodes(getBreedTable(json), ignored);

  let throttle = 0;
  await Promise.all(
    codes.map(async (code) => {
      const path = `${cache.settings.folder}${code}.webp`;

      // check cache. if we don't have the image, we'll redownload it.
      try {
        // If this doesn't throw an exception, it means the file exists
        // in this cache, so we won't download it.
        await fs.access(path, fs.constants.R_OK);
      } catch (e) {
        // doesn't exist in cache, download it.
        // we don't want to ddos DC, so we'll throttle our requests to 1/second.
        throttle++;
        await setTimeout(throttle * 1000);
        await cache.downloadPortrait(code, browser);
      }
    }),
  );

  browser.close();
  console.log(`... Cache ${cache.settings.folder} OK.`);
}

// Takes a list of *full* file paths to tiles and combines them into a single
// css file with base64 data
async function makeCSS(tilePaths: string[]) {
  const base64 = await Promise.all(
    tilePaths.map(async (tile) => {
      // we just want the code, so we have to parse it from the filepath
      // and exclude the extension
      const code = tile.slice(tile.lastIndexOf('/') + 1, tile.lastIndexOf('.'));
      return { code, base64: await fs.readFile(tile, { encoding: 'base64' }) };
    }),
  );

  const stylesheet = base64
    .map((tile) => {
      return `.d-${tile.code}{background:url('data:image/webp;base64,${tile.base64}')}`;
    })
    .join('');

  return stylesheet;
}

// if we want to 'inject' additional tiles outside of the cache,
// for example our placeholders, we can use the inject folder.
export async function saveResolutionStylesheet({
  locTiles,
  locCSSFile,
  sizing,
  injectFolder = null,
}: {
  locTiles: string;
  locCSSFile: string;
  sizing: PortraitSizing;
  injectFolder: null | string;
}) {
  const { width, height } = sizing;
  const tiles = await getTileFullPaths(locTiles);
  const injectedTiles =
    injectFolder !== null ? await getTileFullPaths(injectFolder) : [];

  console.log(`Creating stylesheet with sizes: ${width}w x ${height}h.`);
  console.log(`... Found ${tiles.length} sprites in folder ${locTiles}`);

  if (injectFolder !== null) {
    console.log(
      `... Found ${injectedTiles.length} injected sprites in folder ${injectFolder}`,
    );
  }

  const stylesheet = await makeCSS([...tiles, ...injectedTiles]);

  await fs.writeFile(locCSSFile, stylesheet, 'utf8');
  console.log(`... Saved css stylesheet to ${locCSSFile}`);
}
