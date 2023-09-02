<template>
  <BreedSelectorWrapper
    aria-label="Choose a breed"
    aria-description="Select a breed."
    @close="close"
  >
    <template #title>
      <h2>Choose a breed</h2>
    </template>
    <template #content>
      <section class="recently-used">
        <h3>Breeds already in lineage</h3>
        <BreedSelectorReuse
          :filter-by-gender="genderFilter"
          @breed-selected="breedSelected"
        />
      </section>
      <section class="breeds">
        <h3>Breeds</h3>
        <div class="groups">
          <label>Groups:</label>
          <BreedGroupsTagSelector />
        </div>
        <div class="applied-tags">
          <label>Showing:</label>
          <BreedTagsSelector />
        </div>
        <div class="search">
          <label for="mates-search"
            ><font-awesome-icon icon="search" /> Filter:</label
          >
          <BreedSearchControl
            ref="mateSearchEl"
            @update="(search) => (searchString = search)"
          />
        </div>
        <FilteredBreedList
          :search="searchString"
          :breeds="breeds"
          :tags="tagStore.enabledTags"
          :groups="tagStore.enabledEggGroups"
          no-results-text="There are no breeds that match this criteria."
          @breed-selected="breedSelected"
        />
      </section>
    </template>
  </BreedSelectorWrapper>
</template>
<script setup lang="ts">
import { PropType, ref } from 'vue';
import { onStartTyping } from '@vueuse/core';
import { useTagStore } from '../../store/tags';
import { DragonGender, PortraitData } from '../../app/types';
import FilteredBreedList from '../BreedFiltering/FilteredBreedList.vue';
import BreedSelectorReuse from './BreedSelectorReuse.vue';
import BreedSelectorWrapper from './BreedSelectorWrapper.vue';
import BreedTagsSelector from '../BreedFiltering/BreedTagsSelector.vue';
import BreedGroupsTagSelector from '../BreedFiltering/BreedGroupsTagSelector.vue';
import BreedSearchControl from '../BreedFiltering/BreedSearchControl.vue';

defineProps({
  breeds: {
    type: Array<PortraitData>,
    required: true,
  },
  genderFilter: {
    type: String as PropType<DragonGender>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'breedSelected', breed: PortraitData): void;
  (e: 'close'): void;
}>();

const tagStore = useTagStore();
const searchString = ref('');
const mateSearchEl = ref<HTMLInputElement>();

// focus search bar when begin typing
onStartTyping(() => {
  if (!mateSearchEl.value) return;
  if (document.activeElement !== mateSearchEl.value.$el)
    mateSearchEl.value.$el.focus();
});

function breedSelected(breed: PortraitData) {
  emit('breedSelected', breed);
  close();
}

function close() {
  emit('close');
}
</script>
<style scoped>
/* hide labels on mobile screens */
.breeds label {
  display: none;
}
.breed-selector {
  color: var(--breedDropDownColourFG);
  display: flex;
  flex-direction: column;
}
.recently-used {
  flex-grow: 0;
}
.breeds {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.applied-tags,
.groups {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
}
.search {
  display: flex;
  align-items: flex-start;
  margin: 5px 0px;
}
.search input {
  flex: 1;
  margin-left: 5px;
  width: 100%;
}
h2 {
  font-size: 16px;
}
h3 {
  margin: 0px;
  min-height: 17px;
  position: relative;
  font-size: 11px;
  z-index: 1;
  overflow: hidden;
  text-align: left;
}
h3:after {
  position: absolute;
  top: 50%;
  overflow: hidden;
  width: 100%;
  height: 1px;
  content: '\a0';
  background-color: #000;
  margin-left: 5px;
}
@media only screen and (min-width: 500px) {
  .breeds label {
    display: unset;
  }
}
</style>
