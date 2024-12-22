import { unref, type MaybeRef } from 'vue';
import {
  bodyTypeTags,
  bodySubtypeTags,
  elementTags,
  habitatTags,
  miscTags,
  releaseTags,
  type BreedEntry,
  type NewTag,
  type TagFilterCollection,
} from '../shared/types';
import { useSessionStorage } from '@vueuse/core';
import { resolveLabel } from '../shared/utils';

export const tagStore = useSessionStorage<NewTag[]>('tags', []);

export function tagsFromModel(tags: MaybeRef<NewTag[]>): TagFilterCollection {
  const unrefTags = unref(tags);

  return {
    primaryElement: unrefTags
      .filter((tag) => elementTags.map((s) => `p:${s}`).includes(tag))
      .map(resolveLabel) as TagFilterCollection['primaryElement'],

    secondaryElement: unrefTags
      .filter((tag) => elementTags.map((s) => `s:${s}`).includes(tag))
      .map(resolveLabel) as TagFilterCollection['secondaryElement'],

    bodyType: unrefTags.filter(
      (tag): tag is TagFilterCollection['bodyType'][number] =>
        bodyTypeTags.includes(tag as TagFilterCollection['bodyType'][number]),
    ),

    bodySubtype: unrefTags.filter(
      (tag): tag is TagFilterCollection['bodySubtype'][number] =>
        bodySubtypeTags.includes(
          tag as TagFilterCollection['bodySubtype'][number],
        ),
    ),

    habitat: unrefTags.filter(
      (tag): tag is TagFilterCollection['habitat'][number] =>
        habitatTags.includes(tag as TagFilterCollection['habitat'][number]),
    ),

    release: unrefTags.filter(
      (tag): tag is TagFilterCollection['release'][number] =>
        releaseTags.includes(tag as TagFilterCollection['release'][number]),
    ),

    misc: unrefTags.filter((tag): tag is TagFilterCollection['misc'][number] =>
      miscTags.includes(tag as TagFilterCollection['misc'][number]),
    ),
  };
}

export function filterBreedsByTagsWith<
  Metadatable extends Pick<BreedEntry, 'metaData'>,
>(breeds: Metadatable[], tags: TagFilterCollection) {
  if (
    0 ===
    tags.bodyType.length +
      tags.bodySubtype.length +
      tags.primaryElement.length +
      tags.secondaryElement.length +
      tags.habitat.length +
      tags.release.length +
      tags.misc.length
  ) {
    return breeds;
  }
  const primaryFilters = new Set([
    ...tags.primaryElement.map((s) => `p:${s}`),
    ...tags.primaryElement,
  ]);

  const secondaryFilters = new Set([
    ...tags.secondaryElement.map((s) => `s:${s}`),
    ...tags.secondaryElement,
  ]);

  const bodyTypeFilters = new Set(tags.bodyType);
  const bodySubtypeFilters = new Set(tags.bodySubtype);
  const habitatFilters = new Set(tags.habitat);
  const releaseFilters = new Set(tags.release);
  const miscFilters = new Set(tags.misc);

  return breeds.filter((breed) => {
    const set = new Set(breed.metaData.tags);

    if (tags.primaryElement.length && primaryFilters.isDisjointFrom(set)) {
      return false;
    }

    if (tags.secondaryElement.length && secondaryFilters.isDisjointFrom(set)) {
      return false;
    }

    if (tags.bodyType.length && bodyTypeFilters.isDisjointFrom(set)) {
      return false;
    }

    if (tags.bodySubtype.length && bodySubtypeFilters.isDisjointFrom(set)) {
      return false;
    }

    if (tags.habitat.length && habitatFilters.isDisjointFrom(set)) {
      return false;
    }

    if (tags.release.length && releaseFilters.isDisjointFrom(set)) {
      return false;
    }

    if (tags.misc.length && miscFilters.isDisjointFrom(set)) {
      return false;
    }

    return true;
  });
}

export const filtersByGroup = [
  {
    name: 'Primary Element',
    tags: elementTags.map((tag) => `p:${tag}`),
  },
  {
    name: 'Secondary Element',
    tags: elementTags.map((tag) => `s:${tag}`),
  },
  {
    name: 'Body Type',
    tags: bodyTypeTags,
  },
  {
    name: 'Body Subtype',
    tags: bodySubtypeTags,
  },
  {
    name: 'Habitat',
    tags: habitatTags,
  },
  {
    name: 'Release',
    tags: releaseTags,
  },
  {
    name: 'Misceallaneous',
    tags: miscTags,
  },
];
