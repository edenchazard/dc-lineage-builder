import {
  type BreedEntry,
  type MetaData,
  type GenderOnly,
  type DragonGender,
  type NewTag,
  tags,
} from '../app/shared/types';

type EntryName = string;

export interface FallbackBreedsJSON {
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

type Sprite = [string, number, number, number];

// [m, f]
type Sprites = Sprite | [...Sprite, ...Sprite];

interface FallbackImage {
  left: number;
  top: number;
  height: number | null;
  code: string;
}

const isDimorphic = (spriteArray: Sprites) => !!spriteArray[4];

function getImages(json: FallbackBreedsJSON) {
  /**
   * @param gender for gender only breeds without dimorphism, we'll _always_ assume the sprite data is as with no array indices shenanigans.
   */
  const getDataForSprite = (
    spriteArray: Sprites,
    gender: DragonGender = 'm',
  ): FallbackImage => {
    const offset = gender === 'm' ? 0 : 4;

    return {
      code: spriteArray[offset] as string,
      left: spriteArray[offset + 1] as number,
      top: spriteArray[offset + 2] as number,
      height: spriteArray[offset + 3] as number | null,
    };
  };

  const getSprites = (spriteArray: Sprites) => {
    if (isDimorphic(spriteArray)) {
      return [
        getDataForSprite(spriteArray, 'm'),
        getDataForSprite(spriteArray, 'f'),
      ];
    } else {
      return [getDataForSprite(spriteArray)];
    }
  };

  const images: FallbackImage[] = [];

  for (const breedName in json) {
    const breed = json[breedName];

    if (breed.subentries) {
      for (const subentryName in breed.subentries) {
        images.push(...getSprites(breed.subentries[subentryName].sprites));
      }
    } else {
      images.push(...getSprites(breed.sprites));
    }
  }

  return images;
}

export function makeCSSStyleSheet(json: FallbackBreedsJSON) {
  const makeClass = ({ code, left, top, height }: FallbackImage) => {
    const attributes = (
      `left:${left}px;` +
      `top:${top}px;` +
      (height !== null ? `height:${height}px;` : '')
    ).trim();

    return `.d-${code}{` + attributes + `}`;
  };

  return getImages(json).map(makeClass).join('');
}

export function getBreedTable(json: FallbackBreedsJSON): BreedEntry[] {
  const getGenderProperties = (
    spriteArray: Sprites,
    genderOnly: GenderOnly,
  ) => {
    const entry: Pick<BreedEntry, 'female' | 'male'> = {},
      dimorphic = isDimorphic(spriteArray);

    if (dimorphic) {
      entry.male = spriteArray[0];
      entry.female = spriteArray[4];
    } else {
      // no dimorphism, the code is always the first data
      // in the sprite array
      const [code] = spriteArray;
      if (!genderOnly) {
        entry.male = code;
        entry.female = code;
      } else {
        const gender = genderOnly == 'm' ? 'male' : 'female';
        entry[gender] = code;
      }
    }

    return entry;
  };

  // create a flat list of breeds, with alts as "separate breeds"
  const breeds: BreedEntry[] = [];

  for (const breedName in json) {
    const overallBreed = { ...json[breedName] };
    const metaData: MetaData = {
      tags: overallBreed.tags,
      src: 'dc',
    };

    // determine if this breed has alts
    if (overallBreed.subentries) {
      for (const subentryName in overallBreed.subentries) {
        const subentry = overallBreed.subentries[subentryName];

        const entry = {
          name: `${breedName} ${subentryName}`,
          ...getGenderProperties(subentry.sprites, overallBreed.genderOnly),
          genderOnly: overallBreed.genderOnly,
          metaData,
        };

        // Append any subentry tags to the overall breed tags.
        if ((subentry.tags ?? []).length > 0) {
          entry.metaData.tags = [
            ...overallBreed.tags,
            ...(subentry.tags ?? []),
          ];
        }

        // Sort them by preferred order.
        entry.metaData.tags = entry.metaData.tags.toSorted(
          (a, b) => tags.indexOf(a) - tags.indexOf(b),
        );

        breeds.push(entry);
      }
    } else {
      const spriteArray = overallBreed.sprites;
      breeds.push({
        name: breedName,
        ...getGenderProperties(spriteArray, overallBreed.genderOnly),
        genderOnly: overallBreed.genderOnly,
        metaData,
      });
    }
  }

  return breeds;
}
