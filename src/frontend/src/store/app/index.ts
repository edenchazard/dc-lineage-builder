import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { PartialLineageWithMetadata } from '../../app/types';
import { useTreeAnalyser } from './useTreeAnalyser';
import { DragonBuilder } from '../../app/dragonBuilder';
import { LineageHandler } from '../../app/lineageHandler';

export const useAppStore = defineStore('appStore', () => {
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const activeTree = ref(DragonBuilder.createWithMetadata());
  const activeLineage = computed(
    () => new LineageHandler<PartialLineageWithMetadata>(activeTree.value),
  );
  const analytics = useTreeAnalyser(activeTree, activeLineage, 5);

  // These two functions have to be in the store so that the
  // Dragon components can call them. I would prefer them in
  // The builder component but we can't have everything...
  function replaceRoot(node: PartialLineageWithMetadata) {
    // replace the tree
    activeTree.value = node;
  }

  function addDescendant() {
    // check current root if exists
    if (activeTree.value === null) return;

    const newTree = DragonBuilder.createWithMetadata({
      parents:
        activeTree.value.gender === 'f'
          ? {
              f: activeTree.value,
              m: DragonBuilder.createWithMetadata({ gender: 'm' }),
            }
          : {
              f: DragonBuilder.createWithMetadata({ gender: 'f' }),
              m: activeTree.value,
            },
    });

    // replace the existing root with the new tree.
    activeTree.value = newTree;
  }

  return {
    appVersion,
    activeTree,
    usedBreeds: analytics.usedBreeds,
    selectionCount: analytics.selectionCount,
    addDescendant,
    replaceRoot,
    treeHistory: analytics.history,
    activeLineage: activeLineage,
  };
});
