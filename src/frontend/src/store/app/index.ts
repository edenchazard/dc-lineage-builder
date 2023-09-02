import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { PartialLineageWithMetadata } from '../../app/types';
import { useTreeAnalyser } from './useTreeAnalyser';
import Lineage, { DragonBuilder } from '../../app/dragon';

export const useAppStore = defineStore('appStore', () => {
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const activeTree = ref<PartialLineageWithMetadata>(Lineage().raw());
  const lineage = computed(() => Lineage(activeTree.value));
  const analytics = useTreeAnalyser(activeTree, 5);

  // These two functions have to be in the store so that the
  // Dragon components can call them. I would prefer them in
  // The builder component but we can't have everything...
  function replaceRoot(node: PartialLineageWithMetadata) {
    // replace the tree
    activeTree.value = Lineage(node, true).raw();
  }

  function addDescendant() {
    // check current root if exists
    if (activeTree.value === null) return;

    const newTree = Lineage().raw();
    newTree.parents =
      activeTree.value.gender === 'f'
        ? { f: activeTree.value, m: DragonBuilder.create({ gender: 'm' }) }
        : { f: DragonBuilder.create({ gender: 'f' }), m: activeTree.value };

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
    lineage,
  };
});
