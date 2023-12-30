<template>
  <div
    v-if="filteredBreeds.length > 0"
    class="results"
  >
    <BreedList
      ref="container"
      :list="filteredBreeds"
      :compact="search.length < 3 && filteredBreeds.length > 9"
      v-bind="$attrs"
      @breed-selected="(breed) => emit('breedSelected', breed)"
    />
  </div>
  <p
    v-else
    tabindex="-1"
    class="no-results"
  >
    {{ noResultsText }}
  </p>
</template>
<script setup lang="ts">
import { nextTick, watch, computed, ref } from 'vue';
import type { PropType } from 'vue';
import type { FilterTag, EggGroupTag, PortraitData } from '../shared/types';
import { filterEggGroups, filterTags } from '../shared/utils.js';
import BreedList from './BreedList.vue';
import { useAppStore } from '../store/useAppStore';

const props = defineProps({
  breeds: {
    type: Array<PortraitData>,
    required: true,
  },
  search: {
    type: String,
    default: '',
  },
  noResultsText: {
    type: String,
    default: 'No results',
  },
  tags: {
    type: Array as PropType<FilterTag[]>,
    required: true,
  },
  groups: {
    type: Array as PropType<EggGroupTag[]>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'breedSelected', breed: PortraitData): void;
}>();

const container = ref<HTMLDivElement | null>(null);

const appStore = useAppStore();

const filteredBreeds = computed(() => {
  const search = props.search.toLowerCase().trim();
  const breeds = props.breeds
    // filter the group and tags
    .filter(filterEggGroups(props.groups))
    .filter(filterTags(props.tags));

  // if the search string is empty, return the whole
  // list, with already used breeds first
  if (search === '') {
    return [
      ...props.breeds.filter(
        (breed) => appStore.usedBreeds.get(breed.name) !== undefined,
      ),
      ...breeds.filter(
        (breed) => appStore.usedBreeds.get(breed.name) === undefined,
      ),
    ];
  }
  // we make two arrays, one for primary results (the search matches
  // the beginning of the breed name, and secondary results, where
  // the breed name includes the search term somewhere.
  const primary: PortraitData[] = [],
    secondary: PortraitData[] = [];

  for (let breed of breeds) {
    const position = breed.name.toLowerCase().trim().indexOf(search);
    if (position === 0) primary.push(breed);
    else if (position > -1) secondary.push(breed);
  }
  return [...primary, ...secondary];
});

watch(container, () => {
  // scrolls the results back to the top to prevent
  // the view port being stuck further down
  if (container.value !== null)
    nextTick(() => ((container.value as HTMLDivElement).scrollTop = 0));
});
</script>

<style scoped>
.results {
  padding: 0px;
  flex: 1;
  overflow-y: auto;
}
.no-results {
  font-style: italic;
  margin: 0.5rem;
  padding: 0.5rem;
  text-align: center;
}
</style>
