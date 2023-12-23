import { computed, ref } from 'vue';
import type { ComputedRef, WritableComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { deepClone } from '../shared/utils.js';
import type { TagListOption, FilterTag, EggGroupTag } from '../shared/types';
import { filterTags, eggGroups } from '../shared/types';

interface SessionTagSet {
  key: string;
  tags: readonly EggGroupTag[] | readonly FilterTag[];
}

// returns tags in session if set, or defaults
function loadTags(session: SessionTagSet): TagListOption[] {
  // get the session
  const saved = sessionStorage.getItem(session.key);
  const defaults = session.tags.map((tag: string) => ({
    name: tag,
    active: true,
  }));

  // session exists, return the collection
  if (typeof saved === 'string') return JSON.parse(saved);

  // Return the default collection of tags with active set to true
  return defaults;
}

// Takes in an array of Tag types, filters for active tags
// and then creates an array of just the names
function flattenTagArray(tags: TagListOption[]) {
  return tags.filter((tag) => tag.active).map((tag) => tag.name);
}

function useCreateTagStorage<T extends FilterTag[] | EggGroupTag[]>(
  session: SessionTagSet,
) {
  const tags = ref(loadTags(session));
  // updates sessionstorage whenever the tags are updated
  const comp = computed({
    get: () => tags.value,
    set: (newList) => {
      tags.value = deepClone(newList);
      sessionStorage.setItem(session.key, JSON.stringify(newList));
    },
  });

  const enabled = computed(() => flattenTagArray(tags.value) as T);

  const ret: readonly [WritableComputedRef<TagListOption[]>, ComputedRef<T>] = [
    comp,
    enabled,
  ];
  return ret;
}

export const useTagStore = defineStore('tagStore', () => {
  const [tags, enabledTags] = useCreateTagStorage<FilterTag[]>({
    key: 'session-tags',
    tags: filterTags,
  });

  // groups to hide from the selection interface, such as *
  const hidden = ['*'];
  const [groups, enabledEggGroups] = useCreateTagStorage<EggGroupTag[]>({
    key: 'session-groups',
    tags: eggGroups.filter((tag) => !hidden.includes(tag)),
  });

  return {
    tags,
    groups,
    enabledEggGroups,
    enabledTags,
  };
});
