interface Settings {
    ghostBreedSize: number,
    tileSizes: { [x: string]: { width: string, height: string } },
    gens: {
        min: number,
        max: number
    }
}

const settings: Settings = {
    ghostBreedSize: 8000,
    tileSizes: {
        fullSize: {
            width: '36px',
            height: '48px'
        },
        twoThirds: {
            width: '24px',
            height: '32px'
        }
    },
    // inclusive
    gens: {
        min: 2,
        max: 12
    }
}

export default settings;