import { unref, type MaybeRef } from 'vue';
import {
  bodyTypeTags,
  elementTags,
  type BreedEntry,
  type NewTag,
  type TagModel,
} from '../shared/types';
import { useSessionStorage } from '@vueuse/core';
import { resolveLabel } from '../shared/utils';

export const tagStore = useSessionStorage<NewTag[]>('tags', []);

export function tagsFromModel(tags: MaybeRef<NewTag[]>): TagModel {
  const unrefTags = unref(tags);
  return {
    PrimaryElement: unrefTags
      .filter((tag): tag is TagModel['PrimaryElement'][number] =>
        elementTags.map((s) => `p:${s}`).includes(tag),
      )
      .map(resolveLabel),
    SecondaryElement: unrefTags
      .filter((tag): tag is TagModel['SecondaryElement'][number] =>
        elementTags.map((s) => `s:${s}`).includes(tag),
      )
      .map(resolveLabel),
    BodyType: unrefTags.filter((tag): tag is TagModel['BodyType'][number] =>
      bodyTypeTags.includes('' + tag),
    ),
  };
}

export function filterBreedsByTagsWith<
  Metadatable extends Pick<BreedEntry, 'metaData'>,
>(breeds: Metadatable[], tags: TagModel) {
  if (
    !tags.BodyType.length &&
    !tags.PrimaryElement.length &&
    !tags.SecondaryElement.length
  ) {
    return breeds;
  }
  const primaryFilters = new Set([
    ...tags.PrimaryElement.map((s) => `p:${s}`),
    ...tags.PrimaryElement,
  ]);

  const secondaryFilters = new Set([
    ...tags.SecondaryElement.map((s) => `s:${s}`),
    ...tags.SecondaryElement,
  ]);

  const bodyTypeFilters = new Set(tags.BodyType);

  return breeds.filter((breed) => {
    const set = new Set(breed.metaData.tags);

    if (tags.PrimaryElement.length && primaryFilters.isDisjointFrom(set)) {
      return false;
    }

    if (tags.SecondaryElement.length && secondaryFilters.isDisjointFrom(set)) {
      return false;
    }

    if (tags.BodyType.length && bodyTypeFilters.isDisjointFrom(set)) {
      return false;
    }

    return true;
  });
}
