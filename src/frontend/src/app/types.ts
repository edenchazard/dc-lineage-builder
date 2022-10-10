interface DragonParents {
    m: DragonType,
    f: DragonType
}

interface MetaData {
    group: Groups,
    tags: string[] | [],
    src: Sources
}

type Gender = "m" | "f";
type Groups = "Standard" | "Pygmy" | "Two-headed" | "Drake" | "Other" | "*";
type Sources = "local" | "dc" | "ghost";
type GenderOnly = Gender | false;

interface BreedEntry {
    name: string,
    male: string,
    female: string,
    genderOnly: GenderOnly,
    metaData: MetaData
}

interface DragonType {
    code: string,
    name: string,
    // need a solution for this any, it can be {} but TS
    // gets upset
    parents: DragonParents | null,
    gender: Gender,
    breed: string,
    //disabled: Boolean,
    display: DragonDisplay,
    selected: boolean
}

type DragonDisplay = 0 | 1;

type LineageRoot = DragonType;

interface PortraitData {
    name: string,
    image: string,
    metaData: MetaData
}

interface Tag {
    name: string,
    active: boolean
}

interface LineageConfig {
    showLabels: boolean,
    showInterface: boolean,
    disabled: boolean
}

export type {
    DragonParents,
    DragonType,
    Tag,
    BreedEntry,
    Gender,
    MetaData,
    LineageRoot,
    LineageConfig,
    DragonDisplay,
    PortraitData
}