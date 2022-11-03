const filterTags = ['Valentine', 'Christmas', 'Halloween', 'Hybrid', 'CB', 'Regular'] as const;
const groupTags = ["Standard", "Pygmy",  "Two-headed",  "Drake",  "Other", "*"] as const;
type FilterTag = typeof filterTags[number];
type GroupTag = typeof groupTags[number];
interface TagListOption {
    name: string,
    active: boolean
}

interface DragonType {
    code: string,
    name: string,
    parents: DragonParents | EmptyParents,
    gender: Gender,
    breed: string,
    //disabled: Boolean,
    display: DragonDisplay,
    selected: boolean
}
interface DragonParents {
    m: DragonType,
    f: DragonType
}
type EmptyParents = Record<string, never>;
type Gender = "m" | "f";
type DragonDisplay = 0 | 1;

interface BreedEntry {
    name: string,
    male?: string,
    female?: string,
    genderOnly: GenderOnly,
    metaData: MetaData
}
type GenderOnly = Gender | false;
interface MetaData {
    group: GroupTag,
    tags: FilterTag[],
    src: Sources
}
type Sources = "local" | "dc" | "ghost";

interface PortraitData {
    name: string,
    image: string,
    metaData: MetaData
}

type LineageRoot = DragonType;
type PartialLineage = DragonType | LineageRoot;

interface LineageConfig {
    showLabels: boolean,
    showInterface: boolean,
    disabled: boolean
}

export type {
    GenderOnly,
    DragonParents,
    EmptyParents,
    DragonType,
    TagListOption,
    BreedEntry,
    Gender,
    MetaData,
    LineageRoot,
    LineageConfig,
    DragonDisplay,
    PortraitData,
    FilterTag,
    GroupTag,
    PartialLineage
}

export {
    filterTags,
    groupTags
}