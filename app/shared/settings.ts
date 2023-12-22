interface TileSize {
  width: number;
  height: number;
  widthPX: string;
  heightPX: string;
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

function createTileSize(w: number, h: number): TileSize {
  return {
    width: w,
    height: h,
    widthPX: `${w}px`,
    heightPX: `${h}px`,
  };
}

const settings: Settings = {
  ghostBreedSize: 20000,
  tileSizes: {
    fullSize: createTileSize(36, 48),
    twoThirds: createTileSize(24, 32),
  },
  // inclusive
  gens: {
    min: 2,
    max: 12,
  },
};

export default settings;
