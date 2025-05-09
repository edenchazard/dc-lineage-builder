<template>
  <button
    class="tile-button pointer"
    type="button"
    :title="title"
    @click="emit('click')"
  >
    <FontAwesomeIcon
      :icon="icon"
      class="graphic"
    />
  </button>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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
.tile-button {
  border: 0 none;
  color: var(--ui-builder-tile-action-color, inherit);
  background: transparent;
  padding: 0;
  width: 18px;
  height: 18px;

  > .graphic {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  &:hover {
    color: var(--ui-builder-tile-action-hover-color, inherit);
  }
}
</style>

<style>
.tile-button-group > .tile-button {
  margin: 5px;
}
</style>
