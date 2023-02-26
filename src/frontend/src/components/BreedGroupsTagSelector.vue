<template>
  <TagList
    v-model="tagStore.groups"
    :atLeastOneEnabled="true"
  />
</template>
<script setup lang="ts">
import { useTagStore } from '../store/tags';
import TagList from './ui/TagList.vue';

const tagStore = useTagStore();
</script>
