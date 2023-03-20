<template>
  <TagList
    v-model="tagStore.tags"
    :atLeastOneEnabled="true"
  />
</template>

<script setup lang="ts">
import { useTagStore } from '../../store/tags';
import TagList from '../UI/TagList.vue';

const tagStore = useTagStore();
</script>
