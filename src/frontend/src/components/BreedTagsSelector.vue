<template>
<TagList
    :atLeastOneEnabled="false"
    :value="appStore.tags"
    @updated="appStore.setTags($event)" />
</template>

<script setup lang="ts">
import { useAppStore } from '../store';
import TagList from './ui/TagList.vue';

const appStore = useAppStore();
</script>