interface TileSize {
  width: number;
  height: number;
  widthpx: string;
  heightpx: string;
}
interface Settings {
  ghostBreedSize: number;
  tileSizes: {
    [x: string]: TileSize;
  };
  gens: {
    min: number;
    max: number;
  };
}

function createTilesize(w: number, h: number): TileSize {
  return {
    width: w,
    height: h,
    widthpx: `${w}px`,
    heightpx: `${h}px`,
  };
}

const settings: Settings = {
  ghostBreedSize: 20000,
  tileSizes: {
    fullSize: createTilesize(36, 48),
    twoThirds: createTilesize(24, 32),
  },
  // inclusive
  gens: {
    min: 2,
    max: 12,
  },
};

export default settings;
