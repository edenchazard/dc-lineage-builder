const isDimorphic = (spriteArray) => !!spriteArray[4];
const hasAlts = (spriteObj) =>
  Object.getPrototypeOf(spriteObj) === Object.prototype;

function getImages(fallbacks) {
  const getDataForSprite = (spriteArray, gender) => {
    const offset = gender === 'm' ? 0 : 4;

    return {
      left: spriteArray[offset + 1],
      top: spriteArray[offset + 2],
      height: spriteArray[offset + 3],
      code: spriteArray[offset],
    };
  };

  const addToImages = (spriteArray, images, genderOnly) => {
    const dimorphic = isDimorphic(spriteArray);

    if (dimorphic) {
      images.push(getDataForSprite(spriteArray, 'm'));
      images.push(getDataForSprite(spriteArray, 'f'));
    } else {
      if (!genderOnly) {
        const image = getDataForSprite(spriteArray, 'm');
        images.push(image);
      } else {
        images.push(getDataForSprite(spriteArray, genderOnly));
      }
    }
  };

  const images = [];

  for (let breedName in fallbacks) {
    const breed = fallbacks[breedName];

    if (hasAlts(breed.sprites)) {
      for (let altName in breed.sprites) {
        const spriteArray = breed.sprites[altName];
        addToImages(spriteArray, images);
      }
    } else {
      const spriteArray = breed.sprites;
      addToImages(spriteArray, images);
    }
  }

  return images;
}

export function makeCSSStyleSheet(json) {
  const makeClass = ({ code, left, top, height }) => {
    let attributes = (
      `left:${left}px;` +
      `top:${top}px;` +
      (height !== '' ? `height:${height}px;` : '')
    ).trim();

    return `.d-${code}{` + attributes + `}`;
  };

  return getImages(json).map(makeClass).join('');
}

export function getBreedTable(json) {
  const createBreed = (spriteArray, genderOnly) => {
    const entry = {},
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
  const breeds = [];

  for (let breedName in json) {
    const breed = json[breedName];
    const metaData = {
      group: breed.group,
      tags: breed.tags,
      src: 'dc',
    };

    // determine if this breed has alts
    if (hasAlts(breed.sprites)) {
      for (let altName in breed.sprites) {
        const spriteArray = breed.sprites[altName];
        breeds.push({
          name: breedName + ' ' + altName,
          ...createBreed(spriteArray, breed.genderOnly),
          genderOnly: breed.genderOnly,
          metaData,
        });
      }
    } else {
      const spriteArray = breed.sprites;
      breeds.push({
        name: breedName,
        ...createBreed(spriteArray, breed.genderOnly),
        genderOnly: breed.genderOnly,
        metaData,
      });
    }
  }

  return breeds;
}
