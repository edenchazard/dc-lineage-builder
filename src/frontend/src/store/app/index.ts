import { ref } from 'vue';
import { defineStore } from 'pinia';
import { LineageRoot, PartialLineage } from '../../app/types';
import { createDragonProperties } from '../../app/dragonBuilder';
import { useTreeAnalyser } from './useTreeAnalyser';

export const useAppStore = defineStore('appStore', () => {
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const activeTree = ref<null | LineageRoot>(null);
  const analytics = useTreeAnalyser(activeTree, 5);

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
    usedBreeds: analytics.usedBreeds,
    selectionCount: analytics.selectionCount,
    addDescendant,
    replaceRoot,
    treeHistory: analytics.history,
  };
});
