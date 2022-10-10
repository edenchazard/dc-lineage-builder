<template>
<TagList
    :atLeastOneEnabled="true"
    :value="appStore.groups"
    @updated="appStore.setGroups($event)" />
</template>
<script setup lang="ts">
import { useAppStore } from '../store';
import TagList from './ui/TagList.vue';

const appStore = useAppStore();
</script>