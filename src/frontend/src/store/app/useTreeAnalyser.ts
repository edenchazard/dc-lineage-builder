import { ref, Ref, watch } from 'vue';
import GLOBALS from '../../app/globals';
import { LineageRoot } from '../../app/types';
import { forEveryDragon } from '../../app/utils';
import { useTreeHistory } from './useTreeHistory';
/*
    basically a way we can:
    - calculate used breeds
    - calculate selection count
    //- manage history (todo bug: usemanualrefhistory doesn't seem to work
    // with this, so for now it's its own thing.)

    in one foreverydragon pass instead of doing multiple passes.
    It's messy, and I'm not the biggest fan of it, but it improves performance.
*/
function useTreeAnalyser(activeTree: Ref<LineageRoot | null>, capacity = 5) {
  const history = useTreeHistory(activeTree, capacity);
  const selectionCount = ref(0);
  const usedBreeds = ref(new Map<string, number>());

  // do magic whenever the tree changes
  watch(
    activeTree,
    () => {
      if (activeTree.value === null) return;

      // breed count
      const breeds = new Map<string, number>();

      // selection count
      let selected = 0;

      forEveryDragon(activeTree.value, (dragon) => {
        breeds.set(dragon.breed, (breeds.get(dragon.breed) ?? 0) + 1);

        if (dragon.selected) selected++;
      });

      // exclude placeholder
      breeds.delete(GLOBALS.placeholder.name);

      // update values
      usedBreeds.value = breeds;
      selectionCount.value = selected;
    },
    { deep: true },
  );

  return {
    history,
    usedBreeds,
    selectionCount,
  };
}

export { useTreeAnalyser };
