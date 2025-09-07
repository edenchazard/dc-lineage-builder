<template>
  <div
    v-if="filteredBreeds.length > 0"
    class="results"
  >
    <BreedList
      :id="id"
      :list="filteredBreeds"
      :search="search"
      :compact="filteredBreeds.length > userSettings.gridThreshold"
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
import { computed } from 'vue';
import type { PortraitData, TagFilterCollection } from '../shared/types';
import BreedList from './BreedList.vue';
import { useAppStore } from '../store/useAppStore';
import { filterBreedsByTagsWith } from '../store/useTagStore';
import { filterBreedsByDate, dateFilterStore } from '../store/useDateFilter';
import { userSettings } from '../composables/useUserSettings';

const props = withDefaults(
  defineProps<{
    breeds: PortraitData[];
    search?: string;
    noResultsText?: string;
    tags: TagFilterCollection;
    id: string;
  }>(),
  {
    search: '',
    noResultsText: 'No results',
  },
);

const emit = defineEmits<{
  (e: 'breedSelected', breed: PortraitData): void;
}>();

const appStore = useAppStore();

const filteredBreeds = computed(() => {
  const search = props.search.toLowerCase().trim();

  console.log('Date filter store in BreedListFiltered:', dateFilterStore.value);
  console.log('Props breeds:', props.breeds);
  const breeds = filterBreedsByTagsWith(
    filterBreedsByDate(props.breeds, dateFilterStore.value),
    props.tags,
  );

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
  const primary: PortraitData[] = [];
  const secondary: PortraitData[] = [];

  for (const breed of breeds) {
    const position = breed.name.toLowerCase().trim().indexOf(search);
    if (position === 0) primary.push(breed);
    else if (position > -1) secondary.push(breed);
  }
  return [...primary, ...secondary];
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
