<template>
  <button
    class="control pointer"
    type="button"
    :title="title"
    @click="emit('click')"
  >
    <font-awesome-icon :icon="icon" />
  </button>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});
const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>
<style scoped>
.control {
  border: 0 none;
  color: var(--ui-builder-tile-action-color, inherit);
  background: transparent;
  font-size: 18px;
  padding: 0;
  width: 30px;
  height: 29.38px;
}
</style>
