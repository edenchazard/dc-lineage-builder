const filterTags = [
  'Valentine',
  'Christmas',
  'Halloween',
  'Hybrid',
  'CB',
  'Regular',
] as const;
const eggGroups = [
  'Standard',
  'Pygmy',
  'Two-headed',
  'Drake',
  'Other',
  '*',
] as const;
type FilterTag = (typeof filterTags)[number];
type EggGroupTag = (typeof eggGroups)[number];

interface TagListOption {
  name: string;
  active: boolean;
}

//= Record<never,never>

interface DragonParents {
  m?: PartialLineage;
  f?: PartialLineage;
}

type NoDragonParents = Record<string, never>;

interface DragonMetadata {
  selected: boolean;
}

/* interface DragonType {
  code: string;
  name: string;
  parents: DragonParents;
  gender: DragonGender;
  breed: string;
  display: DragonDisplay;
} */

type PartialLineageWithMetadata = PartialLineage &
  DragonMetadata & {
    parents: DragonParents & {
      m?: PartialLineageWithMetadata;
      f?: PartialLineageWithMetadata;
    };
  };

interface PartialLineage {
  code: string;
  name: string;
  parents: DragonParents;
  gender: DragonGender;
  breed: string;
  display: DragonDisplay;
}

//interface PartialLineageWithMetadata extends PartialLineage {}

type MaybePartialLineageWithMetadata = PartialLineage & Partial<DragonMetadata>;

//type MaybeDragonTypeWithMetaData = DragonType & Partial<DragonTypeWithMetadata>;

type DragonGender = 'm' | 'f';

type DragonDisplay = 0 | 1;

interface BreedEntry {
  name: string;
  male?: string;
  female?: string;
  genderOnly: GenderOnly;
  metaData: MetaData;
}
type GenderOnly = DragonGender | false;
interface MetaData {
  group: EggGroupTag;
  tags: FilterTag[];
  src: Sources;
}
type Sources = 'local' | 'dc' | 'ghost';

interface PortraitData {
  name: string;
  image: string;
  metaData: MetaData;
}

interface LineageConfig {
  showLabels: boolean;
  showInterface: boolean;
  disabled: boolean;
}

export type {
  GenderOnly,
  DragonMetadata,
  DragonParents,
  NoDragonParents,
  DragonGender,
  DragonDisplay,
  //DragonType,
  //DragonTypeWithMetadata,
  PartialLineage,
  PartialLineageWithMetadata,
  MaybePartialLineageWithMetadata,
  //MaybeDragonTypeWithMetaData,
  TagListOption,
  BreedEntry,
  MetaData,
  LineageConfig,
  PortraitData,
  FilterTag,
  EggGroupTag,
};

export { filterTags, eggGroups };
