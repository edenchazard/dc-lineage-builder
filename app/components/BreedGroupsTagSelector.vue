<template>
  <TagList
    v-model="tagStore.groups"
    class="tag-group"
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
.tag-group {
  background-color: var(--ui-tags-groups-bg);
  color: var(--ui-tags-groups-fg);
}
</style>
