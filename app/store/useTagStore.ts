import { unref, type MaybeRef } from 'vue';
import {
  bodyTypeTags,
  elementTags,
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
  };
}

export function filterBreedsByTagsWith<
  Metadatable extends Pick<BreedEntry, 'metaData'>,
>(breeds: Metadatable[], tags: TagFilterCollection) {
  if (
    !tags.bodyType.length &&
    !tags.primaryElement.length &&
    !tags.secondaryElement.length
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
];
