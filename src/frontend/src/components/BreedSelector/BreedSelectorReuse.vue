<template>
  <div class="reuse">
    <BreedGrid
      v-if="recentlyUsed.length > 0"
      :list="recentlyUsed.map((breed) => ({ data: breed }))"
      :compact="true"
      @breed-selected="(breed) => emit('breedSelected', breed)"
    />
    <p
      v-else
      class="information"
    >
      Unavailable.
    </p>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { BreedEntry, DragonGender, PortraitData } from '../../app/types';
import { getBreedData, filterBreedTableByGender } from '../../app/utils';
import { useAppStore } from '../../store/app';
import BreedGrid from '../BreedFiltering/BreedGrid.vue';

const props = defineProps({
  filterByGender: {
    type: String as PropType<DragonGender>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'breedSelected', breed: PortraitData): void;
}>();

const appStore = useAppStore();
const recentlyUsed = computed(() => {
  const uniqueBreeds = [...appStore.usedBreeds.keys()].map(
    (name) => getBreedData(name) as BreedEntry,
  );

  // in these circumstances, it should never return undefined
  return filterBreedTableByGender(uniqueBreeds, props.filterByGender);
});
</script>

<style scoped>
.reuse {
  /* limit to two rows */
  max-height: 108px;
  /* fixes the annoying scroll bar from appearing with a single row */
  min-height: 54px;
  overflow-y: auto;
  scrollbar-gutter: stable;
}
.information {
  font-style: italic;
  font-size: 11px;
}
</style>
