import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { LineageRoot, PartialLineage } from '../../app/types';
import { createDragonProperties } from '../../app/dragonBuilder';
import { countBreeds, forEveryDragon } from '../../app/utils';

export const useAppStore = defineStore('appStore', () => {
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const activeTree = ref<null | LineageRoot>(null);

  // When the tree is modified, we need to update our breed counts
  // and selection count
  const usedBreeds = computed(() =>
    activeTree.value === null
      ? new Map<string, number>()
      : countBreeds(activeTree.value),
  );

  const selectionCount = computed(() => {
    if (activeTree.value === null) return null;

    let selected = 0;
    forEveryDragon(activeTree.value, (dragon) => {
      if (dragon.selected) selected++;
    });

    return selected;
  });

  // These two functions have to be in the store so that the
  // Dragon components can call them. I would prefer them in
  // The builder component but we can't have everything...
  function replaceRoot(node: PartialLineage) {
    // replace the tree
    activeTree.value = node;
  }

  function addDescendant() {
    // check current root if exists
    if (activeTree.value === null) return;

    const newTree = createDragonProperties();
    newTree.parents =
      activeTree.value.gender === 'f'
        ? { f: activeTree.value, m: createDragonProperties({ gender: 'm' }) }
        : { f: createDragonProperties({ gender: 'f' }), m: activeTree.value };

    // replace the existing root with the new tree.
    activeTree.value = newTree;
  }

  return {
    appVersion,
    activeTree,
    usedBreeds,
    selectionCount,
    addDescendant,
    replaceRoot,
  };
});
