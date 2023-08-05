<template>
  <TagList
    v-model="tagStore.tags"
    :at-least-one-enabled="true"
  />
</template>

<script setup lang="ts">
import { useTagStore } from '../../store/tags';
import TagList from '../UI/TagList.vue';

const tagStore = useTagStore();
</script>
