import { useDebouncedRefHistory } from '@vueuse/core';
import { computed, Ref } from 'vue';
import { LineageRoot } from '../../app/types';

function useTreeHistory(activeTree: Ref<LineageRoot | null>, capacity = 5) {
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