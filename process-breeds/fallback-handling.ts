import type {
  BreedEntry,
  EggGroupTag,
  FilterTag,
  MetaData,
  GenderOnly,
  DragonGender,
} from '../app/shared/types';

export interface FallbackBreedsJSON {
  [breedName: string]: FallbackBreedEntry;
}

interface FallbackBreedEntry {
  genderOnly: GenderOnly;
  group: EggGroupTag;
  sprites:
    | FallbackNonDimorphicSprite
    | FallbackDimorphicSpritePair
    | FallbackBreedEntryAltList;
  tags: FilterTag[];
}

interface FallbackBreedEntryAltList {
  [altName: string]: FallbackNonDimorphicSprite | FallbackDimorphicSpritePair;
}

type FallbackSprite = [string, number, number, number];

type FallbackNonDimorphicSprite = FallbackSprite;

// [m, f]
type FallbackDimorphicSpritePair = [...FallbackSprite, ...FallbackSprite];

interface FallbackImage {
  left: number;
  top: number;
  height: number | null;
  code: string;
}

const isDimorphic = (
  spriteArray: FallbackNonDimorphicSprite | FallbackDimorphicSpritePair,
) => !!spriteArray[4];

const hasAlts = (
  sprites:
    | FallbackNonDimorphicSprite
    | FallbackDimorphicSpritePair
    | FallbackBreedEntryAltList,
): sprites is FallbackBreedEntryAltList =>
  typeof sprites === 'object' && !Array.isArray(sprites);

function getImages(json: FallbackBreedsJSON) {
  /**
   * @param gender for gender only breeds without dimorphism, we'll _always_ assume the sprite data is as with no array indices shenanigans.
   */
  const getDataForSprite = (
    spriteArray: FallbackNonDimorphicSprite | FallbackDimorphicSpritePair,
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

  const addToImages = (
    spriteArray: FallbackNonDimorphicSprite | FallbackDimorphicSpritePair,
    images: FallbackImage[],
  ) => {
    if (isDimorphic(spriteArray)) {
      images.push(getDataForSprite(spriteArray, 'm'));
      images.push(getDataForSprite(spriteArray, 'f'));
    } else {
      images.push(getDataForSprite(spriteArray));
    }
  };

  const images: FallbackImage[] = [];

  for (const breedName in json) {
    const breed = json[breedName];

    if (hasAlts(breed.sprites)) {
      for (const altName in breed.sprites) {
        addToImages(breed.sprites[altName], images);
      }
    } else {
      addToImages(breed.sprites, images);
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
    spriteArray: FallbackNonDimorphicSprite | FallbackDimorphicSpritePair,
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
    const breed = json[breedName];
    const metaData: MetaData = {
      group: breed.group,
      tags: breed.tags,
      src: 'dc',
    };

    // determine if this breed has alts
    if (hasAlts(breed.sprites)) {
      for (const altName in breed.sprites) {
        const spriteArray = breed.sprites[altName];
        breeds.push({
          name: breedName + ' ' + altName,
          ...getGenderProperties(spriteArray, breed.genderOnly),
          genderOnly: breed.genderOnly,
          metaData,
        });
      }
    } else {
      const spriteArray = breed.sprites;
      breeds.push({
        name: breedName,
        ...getGenderProperties(spriteArray, breed.genderOnly),
        genderOnly: breed.genderOnly,
        metaData,
      });
    }
  }

  return breeds;
}
