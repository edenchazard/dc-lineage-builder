<template>
  <button
    type="button"
    class="control"
    @click="emit('click')"
  >
    <font-awesome-icon
      v-bind="icon"
      class="icon"
    />
    <span
      v-if="label"
      class="label"
      >{{ label }}</span
    >
  </button>
</template>

<script setup lang="ts">
import { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome';
import { PropType } from 'vue';

defineProps({
  icon: {
    type: Object as PropType<FontAwesomeIconProps>,
    default: () => ({
      icon: 'dragon',
    }),
  },
  label: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'optionSelected', option: { label: string; value: unknown }): void;
}>();
</script>

<style scoped>
.control {
  color: var(--ui-builder-toolbar-button-fg);
  background: transparent;
  border: none;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.control:enabled {
  cursor: pointer;
}
.control:enabled:hover {
  background: rgba(255, 255, 255, 0.3);
}
.control:disabled {
  opacity: 0.3;
}
.label {
  background: var(--builderControlBG);
  color: var(--builderControlFG);
  padding: 5px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
}
.option {
  padding: 5px;
}
.icon {
  display: block;
  padding: 0;
}
</style>
