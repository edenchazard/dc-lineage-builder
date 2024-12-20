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
  group: string;
  tags: NewTag;
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

const elementTags = [
  'light',
  'dark',
  'magi',
  'life',
  'death',
  'time',
  'earth',
  'lightning',
  'air',
  'water',
  'fire',
  'ice',
  'neutral',
] as const;

const bodyTypeTags = [
  'amphiptere',
  'wingless',
  'drake',
  'western',
  'eastern',
  'leviathan',
  'wyvern',
  'lindwyrm',
  'wyrm',
  'pygmy eastern',
  'pygmy lindwyrm',
  'pygmy wyrm',
  'pygmy wyvern',
  'pygmy western',
  'pygmy wingless',
  'pygmy amphiptere',
  'two-head eastern',
  'two-head lindwyrm',
  'two-head amphiptere',
  'two-head leviathan',
  'two-head wyrm',
  'two-head wyvern',
  'two-head wingless',
  'two-head western',
] as const;

type TagFilterCollection = {
  primaryElement: (typeof elementTags)[number][];
  secondaryElement: (typeof elementTags)[number][];
  bodyType: (typeof bodyTypeTags)[number][];
};

type NewTag =
  | TagFilterCollection['primaryElement'][number]
  | TagFilterCollection['secondaryElement'][number]
  | TagFilterCollection['bodyType'][number];

export { elementTags, bodyTypeTags };

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
  BreedEntry,
  MetaData,
  LineageConfig,
  PortraitData,
  NewTag,
  TagFilterCollection,
};
