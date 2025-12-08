import { ref, unref, watchEffect } from 'vue';
import type { Ref } from 'vue';
import type { PartialLineageWithMetadata } from '~/utils/shared/types';
import { useTreeHistory } from './useTreeHistory';
import type { LineageHandler } from '~/utils/shared/lineageHandler';
import { placeholder } from '~/utils/shared/breeds.js';

/*
    basically a way we can:
    - calculate used breeds
    - calculate selection count
    //- manage history (todo bug: usemanualrefhistory doesn't seem to work
    // with this, so for now it's its own thing.)

    in one foreverydragon pass instead of doing multiple passes.
    It's messy, and I'm not the biggest fan of it, but it improves performance.
*/
export function useTreeAnalyser(
  tree: Ref<PartialLineageWithMetadata>,
  handler: Ref<LineageHandler<PartialLineageWithMetadata>>,
  capacity = 5,
) {
  const history = useTreeHistory(tree, capacity);
  const selectionCount = ref(0);
  const usedBreeds = ref(new Map<string, number>());

  // do magic whenever the tree changes
  watchEffect(() => {
    if (tree.value === null) return;

    // breed count
    const breeds = new Map<string, number>();

    // selection count
    let selected = 0;

    unref(handler).every((dragon) => {
      breeds.set(dragon.breed, (breeds.get(dragon.breed) ?? 0) + 1);

      if (dragon.selected) selected++;
    });

    // exclude placeholder
    breeds.delete(placeholder.name);

    // update values
    usedBreeds.value = breeds;
    selectionCount.value = selected;
  });

  return {
    history,
    usedBreeds,
    selectionCount,
  };
}
