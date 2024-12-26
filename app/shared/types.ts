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
type GenderOnly = DragonGender | boolean;
interface MetaData {
  tags: NewTag[];
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

const elements = [
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

const primaryElementTags = elements.map<`p:${(typeof elements)[number]}`>(
  (tag) => `p:${tag}`,
);

const secondaryElementTags = elements.map<`s:${(typeof elements)[number]}`>(
  (tag) => `s:${tag}`,
);

const bodyTypeTags = ['standard', 'drake', 'pygmy', 'two-head'] as const;

const bodySubtypeTags = [
  'amphiptere',
  'wingless',
  'western',
  'eastern',
  'leviathan',
  'wyvern',
  'lindwyrm',
  'wyrm',
] as const;

const habitatTags = [
  'hybrid',
  'alpine',
  'coast',
  'desert',
  'forest',
  'jungle',
  'volcano',
  'cave',
  'all',
] as const;

const miscTags = ['Has BSA', 'summonable', 'CB-only', 'salt'] as const;

const releaseTags = ['regular', 'valentine', 'halloween', 'christmas'] as const;

type TagFilterCollection = {
  primaryElement: (typeof primaryElementTags)[number][];
  secondaryElement: (typeof secondaryElementTags)[number][];
  bodyType: (typeof bodyTypeTags)[number][];
  bodySubtype: (typeof bodySubtypeTags)[number][];
  habitat: (typeof habitatTags)[number][];
  release: (typeof releaseTags)[number][];
  misc: (typeof miscTags)[number][];
};

const tags = [
  ...bodyTypeTags,
  ...bodySubtypeTags,
  ...elements,
  ...primaryElementTags,
  ...secondaryElementTags,
  ...habitatTags,
  ...releaseTags,
  ...miscTags,
] as const;

type NewTag = Readonly<(typeof tags)[number]>;

export {
  elements,
  primaryElementTags,
  secondaryElementTags,
  bodyTypeTags,
  bodySubtypeTags,
  habitatTags,
  releaseTags,
  miscTags,
  tags,
};

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
