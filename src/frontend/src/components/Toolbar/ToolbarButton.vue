<template>
  <button
    data-dragscroll
    type="button"
    class="control interactive"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
  >
    <FontAwesomeIcon
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
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/vue-fontawesome';
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
  disabled: {
    type: Boolean,
    default: false,
  },
});
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

  &[aria-disabled='false'] {
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  &[aria-disabled='true'] {
    opacity: 0.3;
    pointer-events: none;
  }
}

.label {
  background: var(--builderControlBG);
  color: var(--builderControlFG);
  margin: 0.2rem;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
}
.icon {
  display: block;
  padding: 0;
}
</style>
