<template>
  <TagList
    v-model="tagStore.tags"
    :at-least-one-enabled="true"
  />
</template>

<script setup lang="ts">
import { useTagStore } from '../store/useTagStore.js';
import TagList from './TagList.vue';

const tagStore = useTagStore();
</script>
