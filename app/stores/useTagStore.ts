import { computed, unref, type MaybeRef } from 'vue';
import {
  bodyTypeTags,
  bodySubtypeTags,
  habitatTags,
  miscTags,
  releaseTags,
  type NewTag,
  type TagFilterCollection,
  secondaryElementTags,
  primaryElementTags,
  type PortraitData,
  type BreedEntry,
} from '~~/shared/types';
import { useSessionStorage } from '@vueuse/core';
import { resolveLabel } from '~~/shared/utils';

// Set.prototype.isDisjointFrom() doesn't quite have widespread support yet,
// so we'll have to implement a polyfill for it.
if (!Set.prototype.isDisjointFrom) {
  Set.prototype.isDisjointFrom = function <T>(
    this: Set<T>,
    other: Set<T>,
  ): boolean {
    if (this.size <= other.size) {
      for (const elem of this) {
        if (other.has(elem)) return false;
      }
    } else {
      for (const elem of other.keys()) {
        if (this.has(elem)) return false;
      }
    }
    return true;
  };
}

export const tagStore = useSessionStorage<NewTag[]>('tags', []);

export function tagsFromModel(tags: MaybeRef<NewTag[]>): TagFilterCollection {
  const unrefTags = unref(tags);

  // I just don't care enough about this to fix it properly.
  const ret = {
    primaryElement: unrefTags.filter((tag) =>
      primaryElementTags.includes(
        tag as TagFilterCollection['primaryElement'][number],
      ),
    ),
    secondaryElement: unrefTags.filter((tag) =>
      secondaryElementTags.includes(
        tag as TagFilterCollection['secondaryElement'][number],
      ),
    ),

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

  return ret as TagFilterCollection;
}

export function filterBreedsByTagsWith<T extends PortraitData | BreedEntry>(
  breeds: T[],
  tags: TagFilterCollection,
) {
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
    ...tags.primaryElement,
    ...tags.primaryElement.map(resolveLabel),
  ]);
  const secondaryFilters = new Set([
    ...tags.secondaryElement,
    ...tags.secondaryElement.map(resolveLabel),
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

export const filtersByGroup = {
  'Primary Element': primaryElementTags,
  'Secondary Element': secondaryElementTags,
  'Body Type': bodyTypeTags,
  'Body Subtype': bodySubtypeTags,
  Habitat: habitatTags,
  Release: releaseTags,
  Miscellaneous: miscTags,
};

export const chosenTags = computed(() => tagsFromModel(tagStore));
