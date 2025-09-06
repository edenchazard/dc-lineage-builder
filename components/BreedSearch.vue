<template>
  <input
    class="breed-search interactive"
    type="search"
    autocomplete="off"
    :value="modelValue"
    @input="search"
  />
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';

const emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
}>();

defineProps<{
  modelValue: string;
}>();

const search = useDebounceFn(
  (e: Event) =>
    emit('update:model-value', (e.target as HTMLInputElement).value),
  250,
);
</script>

<style scoped>
.breed-search {
  padding-left: 1.8rem;
  background: #fff url('../assets/images/magnifying-glass-solid.svg') no-repeat
    0.5rem center;
  background-size: 0.8rem;
}
</style>
