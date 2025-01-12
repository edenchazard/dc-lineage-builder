<template>
  <select
    :id="id"
    v-model="skinStore.activeSkin"
    class="skin-switcher pointer interactive"
    v-bind="$attrs"
  >
    <option
      v-for="skin in skinStore.availableSkins"
      :key="skin.cssName"
      :value="skin.cssName"
    >
      {{ skin.prettyName }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { useSkinStore } from '../store/useSkinStore.js';
const skinStore = useSkinStore();

withDefaults(
  defineProps<{
    id: string;
  }>(),
  {
    id: '',
  },
);
</script>
