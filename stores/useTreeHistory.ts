import { computed } from 'vue';
import type { Ref } from 'vue';
import { useDebouncedRefHistory } from '@vueuse/core';
import type { PartialLineageWithMetadata } from '../shared/types';

function useTreeHistory(
  activeTree: Ref<PartialLineageWithMetadata>,
  capacity = 5,
) {
  // track history of the tree
  const history = useDebouncedRefHistory(activeTree, {
    deep: true,
    capacity,
  });

  function undo() {
    // we have to use two here because the initial snapshot will
    // be the null value
    if (history.history.value.length > 2) {
      history.undo();
    }
  }

  const canUndo = computed(() => history.history.value.length > 2);

  return {
    ...history,
    // overwrite the original undo method and can undo with ours
    undo,
    canUndo,
  };
}

export { useTreeHistory };
