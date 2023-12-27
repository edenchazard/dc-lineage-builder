<template>
  <TagList
    v-model="tagStore.tags"
    class="tag-filter"
    at-least-one-enabled
    :name="name"
  />
</template>

<script setup lang="ts">
import { useTagStore } from '../store/useTagStore.js';
import TagList from './TagList.vue';

const tagStore = useTagStore();

defineProps({
  name: {
    type: String,
    required: true,
  },
});
</script>

<style>
.tag-filter {
  background-color: var(--ui-tags-filters-bg);
  color: var(--ui-tags-filters-fg) !important;
}
</style>
